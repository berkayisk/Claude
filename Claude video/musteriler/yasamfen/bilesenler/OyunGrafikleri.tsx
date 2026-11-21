// Yaşamfen oyun grafikleri: bilgi yarışması (soru kartı, sayaç, doğru cevap) ve vampir köylü (rol kartı, gece/gündüz, elendi).
// Hepsi kendi Sequence'ı içinde yerel kareyle çalışır. 1080x1920 dikey için ölçülü. Logo YOK (MARKA.md).
import "@fontsource/montserrat/600.css";
import "@fontsource/montserrat/800.css";
import "@fontsource/montserrat/900.css";
import "@fontsource/inter/500.css";
import "@fontsource/inter/700.css";
import React from "react";
import { AbsoluteFill, Audio, Easing, Sequence, interpolate, spring, staticFile, useCurrentFrame, useVideoConfig } from "remotion";

export const YF = {
  kirmizi: "#C00C0C",
  kirmiziAcik: "#E5281F",
  antrasit: "#2A2A2A",
  koyu: "#161616",
  beyaz: "#FFFFFF",
  yesil: "#1FA84F", // doğru cevap — anlamsal istisna
  baslik: "'Montserrat', sans-serif",
  metin: "'Inter', sans-serif",
};

const golge = "0 24px 60px rgba(0,0,0,0.35), 0 4px 14px rgba(0,0,0,0.25)";
const kl = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;

// Ortak giriş/çıkış: yumuşak pop-in, son 8 karede sade çıkış
const useGirisCikis = (sure: number) => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const g = spring({ frame: f, fps, config: { damping: 14, stiffness: 160 } });
  const c = interpolate(f, [sure - 8, sure], [0, 1], { ...kl, easing: Easing.in(Easing.cubic) });
  return { f, fps, g, c, olcek: (0.85 + 0.15 * g) * (1 - 0.08 * c), opak: Math.min(1, g * 1.4) * (1 - c) };
};

const Sfx: React.FC<{ ad: string; kare?: number; ses?: number }> = ({ ad, kare = 0, ses = 0.6 }) => (
  <Sequence from={kare} layout="none">
    <Audio src={staticFile(`sfx/${ad}.wav`)} volume={ses} />
  </Sequence>
);

// ───────────────────────── BİLGİ YARIŞMASI ─────────────────────────

export type SoruProps = {
  no: number;
  toplam?: number;
  soru: string;
  siklar?: string[]; // en fazla 4
  dogru?: number; // doğru şık indeksi
  cevapKare?: number; // bu karede doğru şık yeşile döner
  sure: number; // sekansın toplam kare sayısı
  y?: number; // kartın üst kenarı (px)
  sfx?: boolean;
};

export const SoruKarti: React.FC<SoruProps> = ({ no, toplam, soru, siklar = [], dogru, cevapKare, sure, y = 250, sfx = true }) => {
  const { f, fps, olcek, opak } = useGirisCikis(sure);
  const acik = cevapKare !== undefined && f >= cevapKare;
  return (
    <AbsoluteFill>
      {sfx && <Sfx ad="whoosh_giris" ses={0.45} />}
      {sfx && cevapKare !== undefined && <Sfx ad="basari" kare={cevapKare} ses={0.55} />}
      <div style={{ position: "absolute", top: y, left: 70, right: 70, transform: `scale(${olcek})`, opacity: opak, transformOrigin: "50% 0%" }}>
        <div style={{ display: "flex", justifyContent: "center", marginBottom: -34, position: "relative", zIndex: 2 }}>
          <div style={{ background: YF.kirmizi, color: YF.beyaz, fontFamily: YF.baslik, fontWeight: 900, fontSize: 44, letterSpacing: 4, padding: "14px 40px", borderRadius: 999, boxShadow: golge }}>
            SORU {no}{toplam ? <span style={{ fontWeight: 600, opacity: 0.8 }}> / {toplam}</span> : null}
          </div>
        </div>
        <div style={{ background: YF.beyaz, borderRadius: 40, padding: "70px 56px 48px", boxShadow: golge, borderBottom: `10px solid ${YF.kirmizi}` }}>
          <div style={{ fontFamily: YF.baslik, fontWeight: 800, fontSize: 62, lineHeight: 1.18, color: YF.antrasit, textAlign: "center" }}>{soru}</div>
          {siklar.length > 0 && (
            <div style={{ display: "grid", gridTemplateColumns: siklar.some((s) => s.length > 14) ? "1fr" : "1fr 1fr", gap: 20, marginTop: 44 }}>
              {siklar.map((s, i) => {
                const gs = spring({ frame: f - 8 - i * 5, fps, config: { damping: 15 } });
                const buDogru = acik && i === dogru;
                const soluk = acik && i !== dogru;
                return (
                  <div key={i} style={{
                    display: "flex", alignItems: "center", gap: 22, padding: "22px 26px", borderRadius: 24,
                    background: buDogru ? YF.yesil : "#F2F2F2", color: buDogru ? YF.beyaz : YF.antrasit,
                    opacity: gs * (soluk ? 0.35 : 1), transform: `translateY(${(1 - gs) * 30}px) scale(${buDogru ? 1.04 : 1})`,
                    transition: "none",
                  }}>
                    <div style={{ width: 62, height: 62, borderRadius: 999, flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center",
                      background: buDogru ? "rgba(255,255,255,0.25)" : YF.kirmizi, color: YF.beyaz, fontFamily: YF.baslik, fontWeight: 900, fontSize: 34 }}>
                      {buDogru ? "✓" : "ABCD"[i]}
                    </div>
                    <div style={{ fontFamily: YF.metin, fontWeight: 700, fontSize: 42 }}>{s}</div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </AbsoluteFill>
  );
};

export type SayacProps = { saniye: number; sure: number; x?: number; y?: number; boyut?: number; sfx?: boolean };

// Dairesel geri sayım: her saniye tik, son 3 saniye kırmızı nabız, bitince "SÜRE BİTTİ"
export const Sayac: React.FC<SayacProps> = ({ saniye, sure, x = 540, y = 1350, boyut = 260, sfx = true }) => {
  const { f, fps, olcek, opak } = useGirisCikis(sure);
  const gecen = f / fps;
  const kalan = Math.max(0, Math.ceil(saniye - gecen));
  const oran = Math.max(0, 1 - gecen / saniye);
  const bitti = gecen >= saniye;
  const sonUc = kalan <= 3 && !bitti;
  const nabiz = sonUc ? 1 + 0.12 * Math.max(0, 1 - ((gecen % 1) * 4)) : 1;
  const r = boyut / 2 - 16, cevre = 2 * Math.PI * r;
  const renk = sonUc || bitti ? YF.kirmizi : YF.antrasit;
  const bittiG = spring({ frame: f - saniye * fps, fps, config: { damping: 10, stiffness: 200 } });
  return (
    <AbsoluteFill>
      {sfx && Array.from({ length: saniye }, (_, i) => (
        <Sfx key={i} ad={saniye - i <= 3 ? "blip3" : "tik"} kare={Math.round(i * fps)} ses={saniye - i <= 3 ? 0.5 : 0.35} />
      ))}
      {sfx && <Sfx ad="uyari" kare={Math.round(saniye * fps)} ses={0.5} />}
      <div style={{ position: "absolute", left: x - boyut / 2, top: y - boyut / 2, width: boyut, height: boyut, opacity: opak, transform: `scale(${olcek * nabiz})` }}>
        <svg width={boyut} height={boyut} style={{ position: "absolute", filter: "drop-shadow(0 18px 30px rgba(0,0,0,0.35))" }}>
          <circle cx={boyut / 2} cy={boyut / 2} r={r + 10} fill={YF.beyaz} />
          <circle cx={boyut / 2} cy={boyut / 2} r={r} fill="none" stroke="#EAEAEA" strokeWidth={18} />
          <circle cx={boyut / 2} cy={boyut / 2} r={r} fill="none" stroke={renk} strokeWidth={18} strokeLinecap="round"
            strokeDasharray={cevre} strokeDashoffset={cevre * (1 - oran)} transform={`rotate(-90 ${boyut / 2} ${boyut / 2})`} />
        </svg>
        <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: YF.baslik, fontWeight: 900, color: renk,
          fontSize: bitti ? boyut * 0.17 : boyut * 0.42, textAlign: "center", lineHeight: 1.05, transform: bitti ? `scale(${0.6 + 0.4 * bittiG})` : undefined }}>
          {bitti ? <span>SÜRE<br />BİTTİ!</span> : kalan}
        </div>
      </div>
    </AbsoluteFill>
  );
};

export type CevapProps = { cevap: string; baslik?: string; dogruMu?: boolean; sure: number; y?: number; sfx?: boolean };

// Doğru (yeşil) / yanlış (kırmızı) cevap bandı — damga girişli
export const CevapKarti: React.FC<CevapProps> = ({ cevap, baslik, dogruMu = true, sure, y = 1150, sfx = true }) => {
  const { f, fps, c } = useGirisCikis(sure);
  const g = spring({ frame: f, fps, config: { damping: 9, stiffness: 220 } });
  const renk = dogruMu ? YF.yesil : YF.kirmizi;
  return (
    <AbsoluteFill>
      {sfx && <Sfx ad={dogruMu ? "basari" : "uyari"} ses={0.6} />}
      <div style={{ position: "absolute", top: y, left: 0, right: 0, display: "flex", justifyContent: "center", opacity: Math.min(1, g * 2) * (1 - c),
        transform: `scale(${1.6 - 0.6 * g}) rotate(${(1 - g) * -6}deg)` }}>
        <div style={{ display: "flex", alignItems: "center", gap: 28, background: YF.beyaz, borderRadius: 36, padding: "26px 44px 26px 26px", boxShadow: golge, maxWidth: 920 }}>
          <div style={{ width: 110, height: 110, borderRadius: 999, background: renk, color: YF.beyaz, display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: 70, fontWeight: 900, fontFamily: YF.baslik, flexShrink: 0 }}>{dogruMu ? "✓" : "✕"}</div>
          <div>
            <div style={{ fontFamily: YF.baslik, fontWeight: 800, fontSize: 30, letterSpacing: 3, color: renk }}>{baslik ?? (dogruMu ? "DOĞRU CEVAP" : "YANLIŞ CEVAP")}</div>
            <div style={{ fontFamily: YF.baslik, fontWeight: 900, fontSize: 60, color: YF.antrasit, lineHeight: 1.1 }}>{cevap}</div>
          </div>
        </div>
      </div>
    </AbsoluteFill>
  );
};

// ───────────────────────── VAMPİR KÖYLÜ ─────────────────────────

export type Rol = "vampir" | "doktor" | "koylu" | "gozcu";
const ROLLER: Record<Rol, { ad: string; emoji: string; aciklama: string; zemin: string; yazi: string; vurgu: string }> = {
  vampir: { ad: "VAMPİR", emoji: "🧛", aciklama: "Geceleri köylüleri avlar", zemin: "linear-gradient(160deg,#3A0606 0%,#140000 100%)", yazi: YF.beyaz, vurgu: YF.kirmiziAcik },
  doktor: { ad: "DOKTOR", emoji: "🩺", aciklama: "Her gece bir kişiyi kurtarır", zemin: "linear-gradient(160deg,#FFFFFF 0%,#E9F5F1 100%)", yazi: YF.antrasit, vurgu: "#14967A" },
  koylu: { ad: "KÖYLÜ", emoji: "🧑‍🌾", aciklama: "Vampiri bul, köyü kurtar", zemin: "linear-gradient(160deg,#FFF6E6 0%,#F4E2C2 100%)", yazi: YF.antrasit, vurgu: "#B5651D" },
  gozcu: { ad: "GÖZCÜ", emoji: "🔮", aciklama: "Her gece birinin rolünü öğrenir", zemin: "linear-gradient(160deg,#241A3D 0%,#0E0A1C 100%)", yazi: YF.beyaz, vurgu: "#9C7BFF" },
};

export type RolKartiProps = { rol: Rol; kisi?: string; sure: number; cevirmeKare?: number; x?: number; y?: number; genislik?: number; sfx?: boolean };

// Kart arkası görünerek gelir, cevirmeKare'de 3D dönüp rolü açar
export const RolKarti: React.FC<RolKartiProps> = ({ rol, kisi, sure, cevirmeKare = 18, x = 540, y = 820, genislik = 560, sfx = true }) => {
  const { f, fps, olcek, opak } = useGirisCikis(sure);
  const R = ROLLER[rol];
  const don = spring({ frame: f - cevirmeKare, fps, config: { damping: 16, stiffness: 120 } });
  const aci = 180 - 180 * don; // 180: arka yüz, 0: ön yüz
  const onYuz = aci < 90;
  const yuk = genislik * 1.45;
  const yuz: React.CSSProperties = { position: "absolute", inset: 0, borderRadius: 40, boxShadow: golge, overflow: "hidden", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" };
  return (
    <AbsoluteFill>
      {sfx && <Sfx ad="whoosh_giris" ses={0.4} />}
      {sfx && <Sfx ad={rol === "vampir" ? "boom" : "pop"} kare={cevirmeKare + 4} ses={rol === "vampir" ? 0.55 : 0.5} />}
      <div style={{ position: "absolute", left: x - genislik / 2, top: y - yuk / 2, width: genislik, height: yuk, opacity: opak, transform: `scale(${olcek})`, perspective: 1800 }}>
        <div style={{ position: "absolute", inset: 0, transform: `rotateY(${aci}deg)`, transformStyle: "preserve-3d" }}>
          {onYuz ? (
            <div style={{ ...yuz, background: R.zemin, border: `8px solid ${R.vurgu}` }}>
              <div style={{ fontSize: genislik * 0.42, lineHeight: 1, filter: "drop-shadow(0 12px 18px rgba(0,0,0,0.3))" }}>{R.emoji}</div>
              <div style={{ fontFamily: YF.baslik, fontWeight: 900, fontSize: genislik * 0.15, color: R.vurgu, letterSpacing: 4, marginTop: 24 }}>{R.ad}</div>
              <div style={{ fontFamily: YF.metin, fontWeight: 500, fontSize: genislik * 0.06, color: R.yazi, opacity: 0.85, marginTop: 10, textAlign: "center", padding: "0 40px" }}>{R.aciklama}</div>
              {kisi && <div style={{ position: "absolute", bottom: 34, fontFamily: YF.baslik, fontWeight: 800, fontSize: genislik * 0.065, color: YF.beyaz, background: R.vurgu, padding: "10px 30px", borderRadius: 999 }}>{kisi}</div>}
            </div>
          ) : (
            <div style={{ ...yuz, transform: "rotateY(180deg)", background: `repeating-linear-gradient(45deg, ${YF.antrasit} 0 22px, #232323 22px 44px)`, border: `8px solid ${YF.kirmizi}` }}>
              <div style={{ width: genislik * 0.5, height: genislik * 0.5, borderRadius: 999, border: `6px solid ${YF.kirmizi}`, display: "flex", alignItems: "center", justifyContent: "center",
                fontFamily: YF.baslik, fontWeight: 900, fontSize: genislik * 0.3, color: YF.beyaz }}>?</div>
            </div>
          )}
        </div>
      </div>
    </AbsoluteFill>
  );
};

export type FazProps = { faz: "gece" | "gunduz"; alt?: string; sure: number; sfx?: boolean };

// Tam ekran yarı saydam ara bant: "GECE OLDU" / "SABAH OLDU"
export const FazBandi: React.FC<FazProps> = ({ faz, alt, sure, sfx = true }) => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const gir = interpolate(f, [0, 10], [0, 1], { ...kl, easing: Easing.out(Easing.cubic) });
  const cik = interpolate(f, [sure - 10, sure], [0, 1], kl);
  const yazi = spring({ frame: f - 4, fps, config: { damping: 14 } });
  const gece = faz === "gece";
  return (
    <AbsoluteFill style={{ opacity: gir * (1 - cik), justifyContent: "center", alignItems: "center",
      background: gece ? "radial-gradient(circle at 50% 40%, rgba(30,20,70,0.78), rgba(5,5,20,0.92))" : "radial-gradient(circle at 50% 40%, rgba(255,226,150,0.70), rgba(255,170,60,0.55))" }}>
      {sfx && <Sfx ad={gece ? "whoosh_giris" : "bildirim"} ses={0.5} />}
      <div style={{ textAlign: "center", transform: `translateY(${(1 - yazi) * 40}px)`, opacity: yazi }}>
        <div style={{ fontSize: 180, lineHeight: 1 }}>{gece ? "🌙" : "☀️"}</div>
        <div style={{ fontFamily: YF.baslik, fontWeight: 900, fontSize: 120, color: gece ? YF.beyaz : YF.antrasit, letterSpacing: 4, marginTop: 20 }}>{gece ? "GECE OLDU" : "SABAH OLDU"}</div>
        <div style={{ fontFamily: YF.metin, fontWeight: 500, fontSize: 46, color: gece ? "rgba(255,255,255,0.85)" : YF.antrasit, marginTop: 12 }}>
          {alt ?? (gece ? "Herkes gözlerini kapatsın…" : "Köy uyanıyor")}
        </div>
      </div>
    </AbsoluteFill>
  );
};

export type ElendiProps = { kisi?: string; rol?: Rol; sure: number; y?: number; sfx?: boolean };

// Damga: "ELENDİ" (+ isteğe bağlı kişi ve rolü)
export const Elendi: React.FC<ElendiProps> = ({ kisi, rol, sure, y = 760, sfx = true }) => {
  const { f, fps, c } = useGirisCikis(sure);
  const g = spring({ frame: f, fps, config: { damping: 8, stiffness: 240 } });
  return (
    <AbsoluteFill>
      {sfx && <Sfx ad="damga" ses={0.65} />}
      <div style={{ position: "absolute", top: y, left: 0, right: 0, display: "flex", flexDirection: "column", alignItems: "center", opacity: Math.min(1, g * 2) * (1 - c),
        transform: `scale(${2.2 - 1.2 * g}) rotate(-8deg)` }}>
        <div style={{ fontFamily: YF.baslik, fontWeight: 900, fontSize: 150, color: YF.kirmizi, border: `12px solid ${YF.kirmizi}`, borderRadius: 24, padding: "0 40px",
          background: "rgba(255,255,255,0.88)", letterSpacing: 6 }}>ELENDİ</div>
        {(kisi || rol) && (
          <div style={{ marginTop: 24, fontFamily: YF.baslik, fontWeight: 800, fontSize: 48, color: YF.beyaz, background: YF.antrasit, padding: "12px 36px", borderRadius: 999 }}>
            {kisi}{kisi && rol ? " · " : ""}{rol ? `${ROLLER[rol].emoji} ${ROLLER[rol].ad}` : ""}
          </div>
        )}
      </div>
    </AbsoluteFill>
  );
};
