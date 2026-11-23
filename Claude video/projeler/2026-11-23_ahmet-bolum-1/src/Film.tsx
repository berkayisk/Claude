import React from "react";
import { AbsoluteFill, Audio, Img, Sequence, staticFile, useCurrentFrame, interpolate, Easing } from "remotion";
import { OdaPlan, MasaOn, YuzYakin, TelefonYakin, EkranAkis, EkranMarka, LaptopYakin, EkranArastirma, EkranKurulum, Defter, Gren, Vinyet, INTER, ara } from "./sahneler";
import { Isik } from "./ahmet";

const FPS = 24;
const kl = { extrapolateLeft: "clamp" as const, extrapolateRight: "clamp" as const };
const yavas = Easing.inOut(Easing.sin);
const GECE_EKRAN: Isik = { renk: "#a8c6ff", yon: "on", guc: 1.1, ortam: 0.18 };
const GECE_TEL: Isik = { renk: "#a9c8ff", yon: "alt", guc: 1.1, ortam: 0.2 };
const SABAH: Isik = { renk: "#ffd59a", yon: "sol", guc: 1, ortam: 0 };

type Cekim = { id: string; bas: number; sure: number; C: React.FC<{ f: number; d: number }> };
const s = (sn: number) => Math.round(sn * FPS);

const CEKIMLER: Cekim[] = [
  // SAHNE 1 — Merak (gece)
  { id: "1A", bas: 0, sure: 3, C: ({ f, d }) => <OdaPlan z="gece" f={f} cx={1645} cy={1120} s={ara(f, [0, d], [1.55, 1.75], yavas)} ahmet="kanepe" telefonIsik={1} laptopIsik={0} /> },
  { id: "1B", bas: 3, sure: 2.5, C: ({ f }) => <TelefonYakin f={f} ekran={<EkranAkis f={f} durma={40} />} /> },
  { id: "1C", bas: 5.5, sure: 2.5, C: ({ f, d }) => (
    <YuzYakin z="gece" f={f} arka="masa" isik={GECE_TEL} olcek={2.3} x={ara(f, [0, d], [600, 640])} y={940}
      ifade={{ gozX: ara(f, [10, 30], [0.2, -1]), gozY: ara(f, [10, 30], [0.8, 0]), kasY: ara(f, [12, 40], [0, -5]) }}
      donus={ara(f, [10, 34], [4, -6])} yuzBulanik={ara(f, [24, 54], [0, 12])} arkaBulanik={ara(f, [24, 54], [16, 2])} />
  ) },
  // SAHNE 2 — Araştırma (gece)
  { id: "2A", bas: 8, sure: 2, C: ({ f, d }) => <MasaOn z="gece" f={f} zoom={ara(f, [0, d], [1.04, 1.0])} laptopAcik={ara(f, [4, 26], [0, 1])} ekranIsik={ara(f, [14, 34], [0, 1])} ifade={{ gozY: 0.6 }} /> },
  { id: "2B", bas: 10, sure: 3, C: ({ f, d }) => <LaptopYakin z="gece" f={f} kayma={ara(f, [0, d], [0, -60], yavas)} ekran={<EkranArastirma f={f} />} /> },
  { id: "2C", bas: 13, sure: 3, C: ({ f }) => (
    <Defter z="gece" f={f} satirlar={[{ metin: "Ne satacağım?", bas: 2, son: 22 }, { metin: "Tedarikçi?", bas: 26, son: 40 }, { metin: "Şirket?", bas: 44, son: 56 }, { metin: "Stok / kargo?", bas: 58, son: 72 }]} />
  ) },
  { id: "2D", bas: 16, sure: 3, C: ({ f, d }) => (
    <YuzYakin z="gece" f={f} arka="oda" isik={GECE_EKRAN} olcek={ara(f, [0, d], [2.3, 2.6], yavas)} x={540} y={980}
      ifade={{ gozX: Math.sin(f / 4.5) * 0.8, gozY: 0.3, kasAci: ara(f, [0, 30], [2, 9]), kasY: 2, dudakBas: ara(f, [20, 50], [0, 1]) }} />
  ) },
  // SAHNE 3 — Tıkanıklık (gece)
  { id: "3A", bas: 19, sure: 3, C: ({ f }) => <MasaOn z="gece" f={f} zoom={1.12} odakY={820} ifade={{ gozY: 0.2, kasY: 3, kasAci: 3 }} nefes={ara(f, [10, 40, 70], [0, 1, 0])} /> },
  { id: "3B", bas: 22, sure: 3, C: ({ f }) => (
    <MasaOn z="gece" f={f} zoom={1.55} odakY={760} ifade={{ gozAcik: ara(f, [6, 22], [1, 0.1]), kasAci: 6 }}
      eller={ara(f, [4, 22, 46, 64], [0, 1, 1, 0])} yaslan={ara(f, [40, 70], [0, 1])} />
  ) },
  { id: "3C", bas: 25, sure: 4, C: ({ f, d }) => (
    <OdaPlan z="gece" f={f} cx={ara(f, [0, d], [560, 620], yavas)} cy={1060} s={ara(f, [0, d], [1.18, 1.04], yavas)} ahmet="masa"
      laptopIsik={ara(f, [36, 44], [1, 0])} karartma={ara(f, [36, 50], [0, 0.25])} />
  ) },
  // SAHNE 4 — Keşif (gece)
  { id: "4A", bas: 29, sure: 3, C: ({ f }) => (
    <MasaOn z="gece" f={f} zoom={1.25} odakY={820} laptopAcik={0} ekranIsik={0} telefon={ara(f, [2, 26], [0, 1])} telefonIsik={ara(f, [20, 30], [0, 1])}
      ifade={{ gozY: ara(f, [0, 30], [0.4, 0.9]), kasY: 3, gozAcik: 0.8 }} />
  ) },
  { id: "4B", bas: 32, sure: 3, C: ({ f }) => <TelefonYakin f={f} ekran={<EkranMarka f={f} durma={26} />} /> },
  { id: "4C", bas: 35, sure: 3, C: ({ f, d }) => (
    <YuzYakin z="gece" f={f} arka="masa" isik={GECE_TEL} olcek={ara(f, [0, d], [5.0, 5.4], yavas)} x={540} y={900 + ara(f, [0, d], [0, 30])}
      ifade={{ gozY: 0.7, kasY: ara(f, [10, 34], [2, -9]), gozAcik: ara(f, [10, 34], [0.85, 1.05]) }} />
  ) },
  { id: "4D", bas: 38, sure: 4, C: ({ f, d }) => (
    <MasaOn z="gece" f={f} zoom={ara(f, [0, d], [1.05, 1.5], Easing.in(Easing.cubic))} odakY={860} telefon={ara(f, [0, 16], [1, 0])} telefonIsik={ara(f, [0, 16], [1, 0])}
      laptopAcik={ara(f, [14, 36], [0, 1])} ekranIsik={ara(f, [24, 50], [0, 1.2])} ifade={{ gozY: 0.4, kasY: -3, gulum: 0.1 }} beyaz={ara(f, [d - 14, d], [0, 1], Easing.in(Easing.quad))} />
  ) },
  // SAHNE 5 — Netlik (sabah)
  { id: "5A", bas: 42, sure: 3, C: ({ f, d }) => (
    <AbsoluteFill>
      <OdaPlan z="sabah" f={f} cx={ara(f, [0, d], [560, 640], yavas)} cy={1050} s={ara(f, [0, d], [1.3, 1.1], yavas)} ahmet="masa" kupa lambaAcik={false} toz />
      <AbsoluteFill style={{ background: "#f2f5ff", opacity: interpolate(f, [0, 10], [1, 0], kl) }} />
    </AbsoluteFill>
  ) },
  { id: "5B", bas: 45, sure: 3, C: ({ f }) => (
    <Defter z="sabah" f={f} satirlar={[{ metin: "Yol haritası", bas: 0, son: 14, boyut: 84 }, { metin: "1. Modeli öğren", bas: 18, son: 36 }, { metin: "2. Mağazayı kur", bas: 40, son: 56 }, { metin: "3. İlk ürünü seç", bas: 58, son: 72 }]} />
  ) },
  { id: "5C", bas: 48, sure: 3, C: ({ f, d }) => <LaptopYakin z="sabah" f={f} kayma={ara(f, [0, d], [-50, 10], yavas)} ekran={<EkranKurulum f={f} />} /> },
  { id: "5D", bas: 51, sure: 3, C: ({ f }) => (
    <YuzYakin z="sabah" f={f} arka="sabah" isik={SABAH} olcek={2.35} x={560} y={900}
      ifade={{ gozX: -0.3, gozY: 0.4, gulum: ara(f, [6, 36], [0, 0.9]), kasY: ara(f, [6, 36], [0, -3]) }} kupa={ara(f, [48, 70], [0, 0.55])} />
  ) },
  // SAHNE 6 — Kapanış (sabah)
  { id: "6A", bas: 54, sure: 1.3, C: ({ f, d }) => (
    <OdaPlan z="sabah" f={f} cx={ara(f, [0, d], [620, 760], yavas)} cy={1060} s={ara(f, [0, d], [1.12, 0.98], yavas)} ahmet="masa" kupa lambaAcik={false} toz />
  ) },
  { id: "6C", bas: 55.3, sure: 4.4, C: ({ f, d }) => <MasadakiTelefon f={f} d={d} /> },
];

// 6C — masadaki telefon titreşir, bildirim gelir (yazısı okunmaz: merak)
const MasadakiTelefon: React.FC<{ f: number; d: number }> = ({ f, d }) => {
  const t0 = s(0.3); // 55.6 sn
  const yan = f >= t0 ? 1 : 0;
  const titre = (f >= t0 && f < t0 + 6) || (f >= t0 + 12 && f < t0 + 18) ? Math.sin(f * 3.1) * 7 : 0;
  const zoom = ara(f, [0, d], [1.0, 1.28], yavas);
  const banner = interpolate(f, [t0, t0 + 6], [0, 1], kl);
  return (
    <AbsoluteFill style={{ background: "#c49d74", overflow: "hidden" }}>
      <AbsoluteFill style={{ transform: `scale(${zoom})`, transformOrigin: "540px 900px" }}>
        <svg width={1080} height={1920} style={{ position: "absolute" }}>
          <defs><radialGradient id="tmIsik" cx="0.25" cy="0.15" r="0.9"><stop offset="0" stopColor="#fff2cc" stopOpacity={0.55} /><stop offset="1" stopColor="#5a3a1a" stopOpacity={0.35} /></radialGradient></defs>
          <rect width={1080} height={1920} fill="#c49d74" />
          {Array.from({ length: 12 }).map((_, i) => <line key={i} x1={0} y1={i * 170 + 40} x2={1080} y2={i * 170 + 70} stroke="rgba(0,0,0,0.07)" strokeWidth={6} />)}
          {/* defter köşesi ve kupa (bulanık kenarlar) */}
          <rect x={-120} y={1350} width={520} height={700} rx={10} fill="#f6f3ea" transform="rotate(-10 140 1700)" />
          <circle cx={900} cy={380} r={120} fill="#f3efe7" /><circle cx={900} cy={380} r={92} fill="#6b4226" />
          <rect width={1080} height={1920} fill="url(#tmIsik)" />
        </svg>
        <div style={{ position: "absolute", left: 300, top: 520, width: 480, height: 980, borderRadius: 70, background: "#0b0b0e", transform: `rotate(-8deg) translateX(${titre}px)`, boxShadow: yan ? "0 0 120px rgba(170,200,255,0.45), 0 30px 60px rgba(0,0,0,0.35)" : "0 30px 60px rgba(0,0,0,0.35)" }}>
          <div style={{ position: "absolute", left: 18, top: 18, right: 18, bottom: 18, borderRadius: 54, background: yan ? "linear-gradient(170deg, #1d2a4a 0%, #0c1222 100%)" : "#050506", overflow: "hidden" }}>
            {yan ? (
              <>
                <div style={{ position: "absolute", top: 120, width: "100%", textAlign: "center", fontFamily: INTER, fontWeight: 300, fontSize: 120, color: "white" }}>09:41</div>
                <div style={{ position: "absolute", left: 22, right: 22, top: 330, height: 150, borderRadius: 30, background: "rgba(255,255,255,0.88)", opacity: banner, transform: `translateY(${(1 - banner) * -40}px)`, display: "flex", alignItems: "center", gap: 18, padding: "0 22px" }}>
                  <div style={{ width: 70, height: 70, borderRadius: 18, background: "#F67102", flexShrink: 0 }} />
                  <div style={{ flex: 1, filter: "blur(7px)" }}>
                    <div style={{ height: 22, width: "60%", borderRadius: 11, background: "#222", marginBottom: 14 }} />
                    <div style={{ height: 18, width: "90%", borderRadius: 9, background: "#555" }} />
                  </div>
                </div>
              </>
            ) : null}
          </div>
        </div>
      </AbsoluteFill>
      <Vinyet guc={0.9} />
    </AbsoluteFill>
  );
};

// Final kartı: Bölüm 2 + takip et (referans stili)
const Bolum2: React.FC<{ f: number }> = ({ f }) => {
  const g = interpolate(f, [2, 12], [0, 1], { ...kl, easing: Easing.out(Easing.back(1.5)) });
  const t2 = interpolate(f, [16, 26], [0, 1], kl);
  const tik = f >= s(1.85);
  const bas = interpolate(f, [s(1.8), s(1.85), s(1.95)], [1, 0.92, 1], kl);
  return (
    <AbsoluteFill style={{ background: "radial-gradient(ellipse at 50% 40%, #1a1f33 0%, #05060a 70%)", alignItems: "center", fontFamily: POP }}>
      <div style={{ position: "absolute", top: 300, opacity: g * 0.7, fontWeight: 600, fontSize: 34, letterSpacing: 8, color: "white" }}>AHMET E-TİCARETE BAŞLAMAK İSTİYOR</div>
      <div style={{ position: "absolute", top: 400, opacity: g, transform: `scale(${0.8 + 0.2 * g})`, textAlign: "center", lineHeight: 1 }}>
        <div style={{ fontWeight: 800, fontSize: 170, color: "white", letterSpacing: -4 }}>BÖLÜM 2</div>
        <div style={{ fontWeight: 800, fontSize: 64, color: "#F67102", marginTop: 14 }}>ÇOK YAKINDA</div>
      </div>
      <div style={{ position: "absolute", top: 820, opacity: t2, display: "flex", flexDirection: "column", alignItems: "center", gap: 22 }}>
        <Img src={staticFile("berkay-isik-profil.png")} style={{ width: 230, height: 230, borderRadius: 115, objectFit: "cover", border: "6px solid #F67102" }} />
        <div style={{ fontWeight: 700, fontSize: 54, color: "white" }}>@sifirdansatisa</div>
        <div style={{ fontWeight: 500, fontSize: 38, color: "rgba(255,255,255,0.75)" }}>Kaçırmamak için takip et</div>
        <div style={{ marginTop: 10, transform: `scale(${bas})`, background: tik ? "#2a2d36" : "#F67102", color: "white", fontWeight: 800, fontSize: 54, padding: "22px 80px", borderRadius: 18 }}>{tik ? "TAKİPTESİN ✓" : "TAKİP ET"}</div>
      </div>
    </AbsoluteFill>
  );
};

import plan from "./plan.json";
import "@fontsource/poppins/600.css";
import "@fontsource/poppins/700.css";
import "@fontsource/poppins/800.css";
const POP = "'Poppins', sans-serif";
type VO = { k: string; metin: string; bas: number; son: number; ic: boolean };
type Bsl = { bas: number; son: number; s1: string; s2: string; renk: string; orta?: boolean };
const kucuk = (x: string) => x.replace(/İ/g, "i").replace(/I/g, "ı").toLowerCase().replace(/[.,?!:'’]/g, "");

// Üst başlık (referans stili): beyaz satır + renkli anahtar satır
const Baslik: React.FC<{ t: number }> = ({ t }) => {
  const b = (plan.basliklar as Bsl[]).find((x) => t >= x.bas && t < x.son);
  if (!b) return null;
  const g = interpolate(t, [b.bas, b.bas + 0.35], [0, 1], { ...kl, easing: Easing.out(Easing.back(1.6)) });
  const c = interpolate(t, [b.son - 0.25, b.son], [1, 0], kl);
  const op = Math.min(g, c);
  if (b.orta) {
    return (
      <AbsoluteFill style={{ background: `rgba(0,0,0,${0.55 * op})`, justifyContent: "center", alignItems: "center", flexDirection: "column" }}>
        <div style={{ opacity: op, transform: `scale(${0.85 + 0.15 * g})`, textAlign: "center", fontFamily: POP, fontWeight: 800, lineHeight: 1.05 }}>
          <div style={{ fontSize: 104, color: "white", letterSpacing: -2 }}>{b.s1}</div>
          <div style={{ fontSize: 104, color: b.renk, letterSpacing: -2 }}>{b.s2}</div>
        </div>
      </AbsoluteFill>
    );
  }
  return (
    <AbsoluteFill style={{ alignItems: "center" }}>
      <div style={{ position: "absolute", top: 150, width: 980, textAlign: "center", fontFamily: POP, fontWeight: 800, lineHeight: 1.04, opacity: op, transform: `translateY(${(1 - g) * -30}px)`, textShadow: "0 6px 30px rgba(0,0,0,0.6)" }}>
        <div style={{ fontSize: 68, color: "white", letterSpacing: -1 }}>{b.s1}</div>
        <div style={{ fontSize: 78, color: b.renk, letterSpacing: -1 }}>{b.s2}</div>
      </div>
    </AbsoluteFill>
  );
};
// Alt altyazı: seslendirme cümlesi, anahtar kelimeler turuncu
const Altyazi: React.FC<{ t: number }> = ({ t }) => {
  const vo = plan.vo as VO[];
  const i = vo.findIndex((v, j) => t >= v.bas - 0.05 && t < Math.min(v.son + 0.35, vo[j + 1] ? vo[j + 1].bas - 0.05 : 99));
  if (i < 0) return null;
  const v = vo[i];
  const g = interpolate(t, [v.bas - 0.05, v.bas + 0.15], [0, 1], kl);
  const kelimeler = v.metin.split(" ");
  return (
    <AbsoluteFill style={{ alignItems: "center" }}>
      <div style={{ position: "absolute", top: 1500, width: 940, display: "flex", flexWrap: "wrap", justifyContent: "center", gap: "0 14px", opacity: g, transform: `translateY(${(1 - g) * 14}px)` }}>
        {kelimeler.map((w, j) => {
          const vurgu = (plan.vurgu as string[]).some((k) => kucuk(w).startsWith(k));
          return <span key={j} style={{ fontFamily: POP, fontWeight: 700, fontStyle: v.ic ? "italic" : "normal", fontSize: 50, lineHeight: 1.25, color: vurgu ? "#FF9A3C" : "white", textShadow: "0 3px 18px rgba(0,0,0,0.85), 0 0 3px rgba(0,0,0,0.9)" }}>{w}</span>;
        })}
      </div>
    </AbsoluteFill>
  );
};

export const Film: React.FC = () => {
  const f = useCurrentFrame();
  return (
    <AbsoluteFill style={{ background: "#000" }}>
      {CEKIMLER.map((c) => (
        <Sequence key={c.id} from={s(c.bas)} durationInFrames={s(c.sure)} name={c.id}>
          <CekimSar c={c} />
        </Sequence>
      ))}
      <Sequence from={s(59.7)} durationInFrames={s(2.8)} name="6B"><KapanisSar /></Sequence>
      <AbsoluteFill style={{ background: "linear-gradient(180deg, rgba(0,0,0,0.55) 0%, rgba(0,0,0,0.25) 16%, rgba(0,0,0,0) 26%, rgba(0,0,0,0) 70%, rgba(0,0,0,0.35) 78%, rgba(0,0,0,0.6) 92%)" }} />
      <Baslik t={f / FPS} />
      <Altyazi t={f / FPS} />
      <Vinyet guc={0.8} />
      <Gren f={f} />
      <Audio src={staticFile("ana_ses.wav")} />
    </AbsoluteFill>
  );
};
const CekimSar: React.FC<{ c: Cekim }> = ({ c }) => {
  const f = useCurrentFrame();
  const C = c.C;
  return <C f={f} d={s(c.sure)} />;
};
const KapanisSar: React.FC = () => <Bolum2 f={useCurrentFrame()} />;
