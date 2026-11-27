import React from "react";
import "@fontsource/baloo-2/700.css";
import "@fontsource/baloo-2/800.css";
import { AbsoluteFill, Audio, Sequence, interpolate, spring, staticFile, useCurrentFrame, useVideoConfig, Easing } from "remotion";
import { SATIRLAR, FPS } from "./zaman";
import { RENK, Telefon, KagitUcak, ArkaPlan } from "./cizim";
import { Elif, CiltKesit, Kisi, Halka, KaynakKarti } from "./cizim2";
import { Ay, Yildizlar, YataktaElif, Saat24, GunEgrisi, YorumBalonu } from "./cizim3";

// Baloo 2: Türkçe karakterlerin tamamı var (Fredoka'da Ğ ğ İ Ş ş YOK)
const FONT = "'Baloo 2', sans-serif";
const fr = (s: number) => Math.round(s * FPS);
const GECIS = 10; // sahne geçişi (kare) — yeni sahne öncekinin üstüne bu sürede girer
const clamp = { extrapolateLeft: "clamp" as const, extrapolateRight: "clamp" as const };

const useYay = (gecikme = 0, damp = 12, stiff = 140) => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  return spring({ frame: f - gecikme, fps, config: { damping: damp, stiffness: stiff, mass: 0.7 } });
};

// ---------- geçişler ----------
type GecisTip = "yok" | "kaydirSol" | "kaydirYukari" | "daire" | "zoom" | "sil" | "donus";
const Gecis: React.FC<{ tip: GecisTip; children: React.ReactNode }> = ({ tip, children }) => {
  const f = useCurrentFrame();
  const p = interpolate(f, [0, GECIS], [0, 1], { ...clamp, easing: Easing.out(Easing.cubic) });
  let style: React.CSSProperties = {};
  if (tip === "kaydirSol") style = { transform: `translateX(${(1 - p) * 1080}px)` };
  if (tip === "kaydirYukari") style = { transform: `translateY(${(1 - p) * 1920}px)` };
  if (tip === "daire") style = { clipPath: `circle(${p * 125}% at 50% 45%)` };
  if (tip === "zoom") style = { transform: `scale(${1.8 - 0.8 * p})`, opacity: p };
  if (tip === "sil") style = { clipPath: `polygon(0 0, ${p * 220}% 0, ${p * 220 - 100}% 100%, 0 100%)` };
  if (tip === "donus") style = { transform: `rotate(${(1 - p) * -25}deg) scale(${0.4 + 0.6 * p})`, opacity: Math.min(1, p * 2) };
  return <AbsoluteFill style={style}>{children}</AbsoluteFill>;
};

/** Sahne kabı: arka plan + sürekli hafif kamera hareketi */
const Sahne: React.FC<{ dur: number; zemin: string; vurgu?: string; koyu?: boolean; children: React.ReactNode; zoom?: number; pan?: number }> = ({ dur, zemin, vurgu, koyu, children, zoom = 0.06, pan = 0 }) => {
  const f = useCurrentFrame();
  const s = interpolate(f, [0, dur], [1, 1 + zoom], clamp);
  const y = interpolate(f, [0, dur], [0, pan], clamp);
  return (
    <AbsoluteFill>
      <ArkaPlan renk={zemin} vurgu={vurgu} t={f / 25} koyu={koyu} />
      <Parcaciklar koyu={koyu} />
      <AbsoluteFill style={{ transform: `translateY(${y}px) scale(${s})` }}>
        <svg width={1080} height={1920} viewBox="0 0 1080 1920">{children}</svg>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

/** Yüzen küçük parçacıklar (hareket hissi) */
const Parcaciklar: React.FC<{ koyu?: boolean }> = ({ koyu }) => {
  const f = useCurrentFrame();
  return (
    <svg width={1080} height={1920} style={{ position: "absolute" }}>
      {Array.from({ length: 14 }).map((_, i) => {
        const x = (i * 211) % 1080;
        const y = (1920 + ((i * 397) % 1920) - f * (1.2 + (i % 4) * 0.5)) % 1920;
        return <circle key={i} cx={x + Math.sin(f / 20 + i) * 18} cy={y} r={4 + (i % 3) * 3} fill={koyu ? "#8E7CC3" : "#FFFFFF"} opacity={0.5} />;
      })}
    </svg>
  );
};

/** Üst başlık: harf harf zıplayarak gelir */
const Baslik: React.FC<{ metin: string; y?: number; gecikme?: number; boyut?: number }> = ({ metin, y = 240, gecikme = GECIS, boyut = 70 }) => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const kutu = spring({ frame: f - gecikme, fps, config: { damping: 12 } });
  return (
    <div style={{ position: "absolute", top: y, left: 0, right: 0, display: "flex", justifyContent: "center" }}>
      <div style={{ background: RENK.mor, color: "#fff", fontFamily: FONT, fontWeight: 800, fontSize: boyut, padding: "12px 44px 4px", borderRadius: 999, border: "6px solid #fff", boxShadow: "0 10px 0 rgba(43,33,64,0.25)", transform: `scale(${0.5 + 0.5 * kutu})`, opacity: Math.min(1, kutu * 2), whiteSpace: "pre" }}>
        {metin.split("").map((h, i) => {
          const s = spring({ frame: f - gecikme - i * 1.2, fps, config: { damping: 9, stiffness: 180 } });
          return <span key={i} style={{ display: "inline-block", transform: `translateY(${(1 - s) * -40}px)`, opacity: s }}>{h}</span>;
        })}
      </div>
    </div>
  );
};

/** Sayaç: 0 → hedef */
const useSayac = (hedef: number, bas: number, son: number) => {
  const f = useCurrentFrame();
  return Math.round(interpolate(f, [bas, son], [0, hedef], { ...clamp, easing: Easing.out(Easing.cubic) }));
};

/** Altyazı (beyaz hap, mor yazı), satır 3–6 kelimelik parçalara bölünür */
const Altyazi: React.FC<{ metin: string; dur: number }> = ({ metin, dur }) => {
  const f = useCurrentFrame();
  const parcalar = parcala(metin);
  const toplam = parcalar.reduce((a, p) => a + p.length, 0);
  let acc = 0, aktif = parcalar[0], aktifBas = 0;
  for (const p of parcalar) {
    const bas = (acc / toplam) * dur;
    if (f >= bas) { aktif = p; aktifBas = bas; }
    acc += p.length;
  }
  const pop = spring({ frame: f - aktifBas, fps: 30, config: { damping: 14, stiffness: 220 } });
  return (
    <div style={{ position: "absolute", top: 1330, left: 0, right: 0, display: "flex", justifyContent: "center" }}>
      <div style={{ background: "#fff", border: `5px solid ${RENK.morAcik}`, color: RENK.mor, fontFamily: FONT, fontWeight: 700, fontSize: 58, padding: "10px 38px 4px", borderRadius: 999, boxShadow: "0 8px 22px rgba(43,33,64,0.18)", textAlign: "center", maxWidth: 960, lineHeight: 1.15, transform: `scale(${0.9 + 0.1 * pop})` }}>
        {aktif}
      </div>
    </div>
  );
};
function parcala(m: string): string[] {
  const out: string[] = [];
  let cur: string[] = [];
  for (const w of m.split(" ")) {
    cur.push(w);
    const n = cur.join(" ");
    if (cur.length >= 5 || (cur.length >= 2 && /[,?.:]$/.test(w)) || n.length > 22) { out.push(n); cur = []; }
  }
  if (cur.length) out.push(cur.join(" "));
  if (out.length > 1 && out[out.length - 1].split(" ").length === 1 && (out[out.length - 2] + out[out.length - 1]).length <= 24) { const s = out.pop()!; out[out.length - 1] += " " + s; }
  return out;
}

// ---------- sahneler ----------
type SP = { dur: number; ikinciBas?: number };
const GECE = "#22204A";

const S01: React.FC<SP> = ({ dur }) => {
  const f = useCurrentFrame();
  const g = useYay(0, 12);
  return (
    <Sahne dur={dur} zemin={GECE} vurgu="#3B3878" koyu zoom={0.1}>
      <Yildizlar t={f / 30} />
      <g transform="translate(820 360)"><Ay t={f / 30} /></g>
      {/* pencere çerçevesi */}
      <rect x={640} y={190} width={360} height={360} rx={24} fill="none" stroke="#5A5590" strokeWidth={14} />
      <line x1={820} y1={190} x2={820} y2={550} stroke="#5A5590" strokeWidth={10} />
      <g transform={`translate(560 ${1010 + (1 - g) * 500}) scale(1.05)`}><YataktaElif kasi={Math.sin(f / 2.2)} goz={1} /></g>
    </Sahne>
  );
};

const S02: React.FC<SP> = ({ dur }) => {
  const f = useCurrentFrame();
  const damga = interpolate(f, [GECIS + 2, GECIS + 9], [3, 1], { ...clamp, easing: Easing.in(Easing.quad) });
  const titre = f > GECIS + 9 && f < GECIS + 15 ? Math.sin(f * 4) * 8 : 0;
  return (
    <Sahne dur={dur} zemin={RENK.lila} vurgu="#FFFFFF" zoom={0.05}>
      <g transform={`translate(${540 + titre} 1250) scale(1.25)`}><Elif yuz="saskin" goz={f % 60 > 55 ? 0.15 : 1} /></g>
      <g transform={`translate(540 520) rotate(-6) scale(${damga})`} opacity={f > GECIS + 2 ? 1 : 0}>
        <rect x={-300} y={-85} width={600} height={160} rx={22} fill="rgba(255,255,255,0.92)" stroke="#2FA36B" strokeWidth={12} />
        <text y={30} textAnchor="middle" fontFamily={FONT} fontWeight={800} fontSize={96} fill="#2FA36B">HAYAL DEĞİL</text>
      </g>
    </Sahne>
  );
};

/** s03 + s04: 241 kişi sayacı → 24 saat kadranında 20–24 dilimi */
const S03: React.FC<SP> = ({ dur, ikinciBas = -1 }) => {
  const f = useCurrentFrame();
  const sayi = useSayac(241, GECIS, GECIS + 28);
  const kart = useYay(GECIS + 10, 13);
  const ik = ikinciBas > 0 ? ikinciBas : dur * 0.4;
  const p = interpolate(f, [ik + 4, ik + 34], [0, 1], { ...clamp, easing: Easing.inOut(Easing.cubic) });
  const akrep = interpolate(f, [ik, ik + 34], [8, 22], clamp);
  const ikinci = f > ik;
  const gec = interpolate(f, [ik - 6, ik + 6], [0, 1], clamp);
  const etiketG = useYay(ik + 30, 10);
  return (
    <Sahne dur={dur} zemin={RENK.krem} vurgu="#FFE2C4" zoom={0.04}>
      {/* 1. kısım: 241 yetişkin */}
      <g opacity={1 - gec} transform={`translate(0 ${-gec * 80})`}>
        {Array.from({ length: 24 }).map((_, i) => (
          <g key={i} transform={`translate(${210 + (i % 6) * 132} ${640 + Math.floor(i / 6) * 140}) scale(${Math.min(1, Math.max(0, (sayi / 241) * 24 - i)) * 0.5})`}><Kisi aktif /></g>
        ))}
        <text x={540} y={1220} textAnchor="middle" fontFamily={FONT} fontWeight={800} fontSize={130} fill={RENK.mor} stroke="#fff" strokeWidth={10} paintOrder="stroke">{sayi}</text>
        <text x={540} y={1280} textAnchor="middle" fontFamily={FONT} fontWeight={800} fontSize={48} fill={RENK.cizgi}>YETİŞKİN</text>
      </g>
      {/* 2. kısım: saat */}
      {ikinci && (
        <g opacity={gec}>
          <g transform={`translate(540 760) scale(${0.7 + 0.3 * gec})`}><Saat24 r={270} vurgu={[20, 24]} p={p} akrep={akrep} /></g>
          <g transform={`translate(540 1150) scale(${etiketG})`}>
            <rect x={-250} y={-58} width={500} height={106} rx={53} fill="#FF6B6B" stroke={RENK.cizgi} strokeWidth={6} />
            <text y={20} textAnchor="middle" fontFamily={FONT} fontWeight={800} fontSize={60} fill="#fff">20.00 – 24.00</text>
          </g>
        </g>
      )}
      <g transform={`translate(${540 + (1 - kart) * 1100} ${ikinci ? 1250 : 455})`} opacity={ikinci ? 0 : 1}>
        <KaynakKarti ust="Acta Derm. Venereol., 2024" alt="241 egzamalı yetişkin" />
      </g>
    </Sahne>
  );
};

const S05: React.FC<SP> = ({ dur }) => {
  const f = useCurrentFrame();
  const s = interpolate(f, [0, dur], [0.9, 1.5], { ...clamp, easing: Easing.in(Easing.quad) });
  return (
    <Sahne dur={dur} zemin={GECE} vurgu="#3B3878" koyu zoom={0}>
      <Yildizlar t={f / 30} />
      <g transform={`translate(540 800) scale(${s * 2})`}><Ay t={f / 30} /></g>
      {[0, 1, 2].map((i) => {
        const y = useYay(4 + i * 4, 8);
        return <text key={i} x={300 + i * 240} y={1120 - i * 40} textAnchor="middle" fontFamily={FONT} fontWeight={800} fontSize={150 + i * 20} fill="#FFF3C4" transform={`rotate(${(i - 1) * 12} ${300 + i * 240} 1100) scale(1)`} opacity={y}>?</text>;
      })}
    </Sahne>
  );
};

/** s06 + s07: kortizol eğrisi (temsili) + fren */
const S06: React.FC<SP> = ({ dur, ikinciBas = -1 }) => {
  const f = useCurrentFrame();
  const ik = ikinciBas > 0 ? ikinciBas : dur * 0.3;
  const p = interpolate(f, [GECIS + 4, ik + 40], [0, 1], { ...clamp, easing: Easing.inOut(Easing.quad) });
  // kortizol: sabah zirve (~08), gece yarısı dip (temsili şekil)
  // kortizol (temsili): gece yarısı en düşük, sabaha doğru yükselir, ~08.00 zirve, gün boyu düşer
  const kortizol = (s: number) => s <= 8 ? 0.12 + 0.83 * (1 - Math.cos((Math.PI * s) / 8)) / 2 : 0.12 + 0.83 * (1 + Math.cos((Math.PI * (s - 8)) / 16)) / 2;
  const fren = interpolate(f, [ik + 10, dur - 10], [1, 0.25], clamp);
  const kart = useYay(ik + 6, 13);
  return (
    <Sahne dur={dur} zemin={RENK.mint} vurgu="#FFFFFF" zoom={0.04}>
      <g transform="translate(150 520)"><GunEgrisi w={780} h={380} p={p} deger={kortizol} etiket="KORTİZOL" renk={RENK.mor} /></g>
      {/* fren göstergesi */}
      <g transform={`translate(540 1050) scale(${useYay(ik, 11)})`}>
        <rect x={-330} y={-50} width={660} height={100} rx={50} fill="#fff" stroke={RENK.cizgi} strokeWidth={6} />
        <rect x={-322} y={-42} width={644 * fren} height={84} rx={42} fill={fren > 0.5 ? RENK.teal : "#FF6B6B"} />
        <text y={16} textAnchor="middle" fontFamily={FONT} fontWeight={800} fontSize={46} fill={RENK.cizgi}>İLTİHAP FRENİ</text>
      </g>
      <g transform={`translate(${540 + (1 - kart) * 1100} 1195)`} opacity={kart}><KaynakKarti ust="Lavery, Yosipovitch ve ark." alt="2016 · derleme" /></g>
    </Sahne>
  );
};

/** s08 + s09: ısı — termometre + ısınan cilt */
const S08: React.FC<SP> = ({ dur, ikinciBas = -1 }) => {
  const f = useCurrentFrame();
  const ik = ikinciBas > 0 ? ikinciBas : dur * 0.3;
  const isi = interpolate(f, [GECIS, dur * 0.8], [0, 1], clamp);
  const renk = `rgb(${Math.round(242 + 13 * isi)},${Math.round(185 - 60 * isi)},${Math.round(160 - 80 * isi)})`;
  return (
    <Sahne dur={dur} zemin={RENK.krem} vurgu="#FFD9B0" zoom={0.05}>
      {/* termometre */}
      <g transform={`translate(230 760) scale(${useYay(GECIS, 9)})`}>
        <rect x={-34} y={-260} width={68} height={360} rx={34} fill="#fff" stroke={RENK.cizgi} strokeWidth={8} />
        <rect x={-16} y={60 - 300 * isi} width={32} height={60 + 300 * isi} rx={16} fill="#FF5A5A" />
        <circle cy={130} r={62} fill="#FF5A5A" stroke={RENK.cizgi} strokeWidth={8} />
      </g>
      {/* cilt kesiti ısınıyor + ısı dalgaları */}
      <g transform="translate(640 860)">
        <rect x={-300} y={0} width={600} height={70} fill={renk} stroke={RENK.cizgi} strokeWidth={7} />
        <rect x={-300} y={70} width={600} height={170} fill="#F2B9A0" stroke={RENK.cizgi} strokeWidth={7} />
        {[-180, 0, 180].map((x, i) => (
          <path key={i} d={`M${x} -20 q 20 -30 0 -60 q -20 -30 0 -60 q 20 -30 0 -60`} fill="none" stroke="#FF8A5A" strokeWidth={10} strokeLinecap="round" opacity={isi * (0.5 + 0.5 * Math.sin(f / 4 + i))} transform={`translate(0 ${-((f * 2 + i * 20) % 40)})`} />
        ))}
        {f > ik && [0, 1, 2].map((i) => (
          <path key={"k" + i} d={`M${-120 + i * 100} -230 l 22 -30 l 22 30 l 22 -30`} fill="none" stroke="#FF3B3B" strokeWidth={10} strokeLinecap="round" strokeLinejoin="round" opacity={(Math.sin(f / 3 + i) + 1) / 2} />
        ))}
      </g>
      <g transform={`translate(640 1160) scale(${useYay(ik + 10, 11)})`}>
        <rect x={-280} y={-55} width={560} height={100} rx={50} fill="#FF8A5A" stroke={RENK.cizgi} strokeWidth={6} />
        <text y={18} textAnchor="middle" fontFamily={FONT} fontWeight={800} fontSize={54} fill="#fff">CİLT ISINIR</text>
      </g>
    </Sahne>
  );
};

const S10: React.FC<SP> = ({ dur }) => {
  const sayi = useSayac(43, GECIS + 4, GECIS + 40);
  const kart = useYay(GECIS + 16, 13);
  const f = useCurrentFrame();
  return (
    <Sahne dur={dur} zemin={GECE} vurgu="#3B3878" koyu zoom={0.05}>
      <Yildizlar t={f / 30} />
      <g transform="translate(540 720)"><Halka oran={sayi / 100} r={230} metin={`%${sayi}`} renk="#FF6B6B" /></g>
      <text x={540} y={1035} textAnchor="middle" fontFamily={FONT} fontWeight={800} fontSize={52} fill="#FFF3C4">UYKU SORUNU</text>
      <g transform={`translate(${540 - (1 - kart) * 1100} 1160)`}><KaynakKarti ust="Arch. Dermatol. Res., 2025" alt="meta-analiz" /></g>
    </Sahne>
  );
};

const S11: React.FC<SP> = ({ dur }) => {
  const f = useCurrentFrame();
  const g = useYay(GECIS, 12);
  const tik = interpolate(f, [GECIS + 18, GECIS + 32], [0, 1], clamp);
  return (
    <Sahne dur={dur} zemin={RENK.mint} vurgu="#FFFFFF" zoom={0.04}>
      {/* not defteri: gece kaşıntısı notları */}
      <g transform={`translate(330 ${820 + (1 - g) * 600}) rotate(-5)`}>
        <rect x={-210} y={-280} width={420} height={540} rx={26} fill="#FFFDF2" stroke={RENK.cizgi} strokeWidth={7} />
        {[0, 1, 2, 3].map((i) => <line key={i} x1={-160} y1={-150 + i * 95} x2={160} y2={-150 + i * 95} stroke="#D9D2C0" strokeWidth={5} />)}
        <text x={-160} y={-190} fontFamily={FONT} fontWeight={800} fontSize={44} fill={RENK.mor}>GECE KAŞINTISI</text>
        {["22.30 ✓", "01.10 ✓", "03.40 ✓"].map((t, i) => <text key={i} x={-150} y={-112 + i * 95} fontFamily={FONT} fontWeight={700} fontSize={46} fill={RENK.cizgi} opacity={tik > i / 3 ? 1 : 0}>{t}</text>)}
      </g>
      {/* randevu takvimi (doktor karakteri yok) */}
      <g transform={`translate(790 ${760 + (1 - useYay(GECIS + 8, 12)) * 600})`}>
        <rect x={-160} y={-130} width={320} height={260} rx={28} fill="#fff" stroke={RENK.cizgi} strokeWidth={7} />
        <path d="M-160 -66 L -160 -100 Q -160 -130 -130 -130 L 130 -130 Q 160 -130 160 -100 L 160 -66 Z" fill={RENK.mor} stroke={RENK.cizgi} strokeWidth={7} />
        <path d="M-50 20 l 32 32 l 70 -76" fill="none" stroke={RENK.teal} strokeWidth={18} strokeLinecap="round" strokeLinejoin="round" strokeDasharray={170} strokeDashoffset={170 * (1 - tik)} />
      </g>
    </Sahne>
  );
};

const S12: React.FC<SP> = ({ dur }) => {
  const f = useCurrentFrame();
  const g = useYay(GECIS, 12);
  const secim = Math.floor(f / 18) % 2; // gece / gündüz arasında yanıp sönen seçim
  const donus = interpolate(f, [dur - 14, dur], [0, 1], clamp);
  return (
    <Sahne dur={dur} zemin={RENK.lila} vurgu="#FFFFFF" zoom={0.03}>
      <g opacity={1 - donus}>
        <g transform={`translate(540 ${820 + (1 - g) * 700}) scale(${0.9 + 0.1 * g})`}><YorumBalonu secim={secim} /></g>
        {/* klavye imleci */}
        <rect x={250} y={1080} width={580} height={90} rx={45} fill="#fff" stroke={RENK.cizgi} strokeWidth={6} />
        <text x={290} y={1140} fontFamily={FONT} fontWeight={700} fontSize={44} fill="#8C84A3">Yorum ekle…</text>
        {f % 30 < 15 && <rect x={560} y={1102} width={6} height={50} fill={RENK.mor} />}
      </g>
      <g opacity={donus}><rect width={1080} height={1920} fill={GECE} /><g transform="translate(560 1010) scale(1.05)"><YataktaElif kasi={Math.sin(f / 2.2)} goz={1} /></g></g>
    </Sahne>
  );
};

// satır → sahne (C'siz satır öncekine eklenir)
const SAHNE: Record<string, { C?: React.FC<any>; gecis: GecisTip; baslik?: string; sfx?: [string, number][] }> = {
  s01: { C: S01, gecis: "yok", sfx: [["whoosh_giris", 0.05]] },
  s02: { C: S02, gecis: "zoom", sfx: [["damga", 0.25]] },
  s03: { C: S03, gecis: "kaydirSol", baslik: "ARAŞTIRMA", sfx: [["whoosh_giris", 0], ["secim", 0.3]] },
  s04: { gecis: "yok", sfx: [["tik", 0.2], ["tik", 0.45], ["uyari", 0.7]] },
  s05: { C: S05, gecis: "daire", baslik: "NEDEN GECE?", sfx: [["whoosh_cikis", 0], ["pop", 0.3]] },
  s06: { C: S06, gecis: "sil", baslik: "1. SEBEP", sfx: [["whoosh_giris", 0], ["blip2", 0.4]] },
  s07: { gecis: "yok", sfx: [["uyari", 0.6]] },
  s08: { C: S08, gecis: "kaydirYukari", baslik: "2. SEBEP", sfx: [["whoosh_giris", 0], ["blip3", 0.5]] },
  s09: { gecis: "yok", sfx: [["pop", 0.3]] },
  s10: { C: S10, gecis: "daire", baslik: "SONUÇ", sfx: [["secim", 0.2], ["pop", 0.6]] },
  s11: { C: S11, gecis: "kaydirSol", sfx: [["whoosh_giris", 0], ["onay1", 0.6]] },
  s12: { C: S12, gecis: "zoom", baslik: "YORUMLARA YAZ", sfx: [["bildirim", 0.15], ["blip1", 0.5]] },
};

export const Video: React.FC = () => {
  const L = SATIRLAR as unknown as { k: string; metin: string; bas: number; sure: number }[];
  const { durationInFrames } = useVideoConfig();
  // sahne blokları: C'si olan satır yeni sahne başlatır; C'siz satır öncekine eklenir
  const bloklar: { i: number; son: number }[] = [];
  L.forEach((s, i) => { if (SAHNE[s.k].C) bloklar.push({ i, son: i }); else bloklar[bloklar.length - 1].son = i; });
  return (
    <AbsoluteFill style={{ background: RENK.krem }}>
      {bloklar.map((b, j) => {
        const s = L[b.i];
        const bas = j === 0 ? 0 : fr(s.bas) - GECIS;
        const sonraki = bloklar[j + 1];
        const son = sonraki ? fr(L[sonraki.i].bas) : durationInFrames; // sonraki sahne GECIS kadar önce üstüne biner
        const dur = son - bas;
        const sh = SAHNE[s.k];
        const C = sh.C!;
        const ikinciBas = b.son > b.i ? fr(L[b.i + 1].bas) - bas : -1;
        return (
          <Sequence key={s.k} from={bas} durationInFrames={dur}>
            <Gecis tip={j === 0 ? "yok" : sh.gecis}>
              <C dur={dur} ikinciBas={ikinciBas} />
              {sh.baslik && <Baslik metin={sh.baslik} />}
            </Gecis>
          </Sequence>
        );
      })}
      {/* altyazılar + efektler (satır bazında) */}
      {L.map((s, i) => {
        const bas = fr(s.bas);
        const son = i + 1 < L.length ? fr(L[i + 1].bas) : durationInFrames;
        return (
          <Sequence key={"a" + s.k} from={bas} durationInFrames={son - bas}>
            <Altyazi metin={s.metin} dur={fr(s.sure)} />
            <Audio src={staticFile(`ses/${s.k}.wav`)} />
            {(SAHNE[s.k].sfx || []).map(([ad, t], j) => (
              <Sequence key={j} from={Math.max(0, Math.round(t * (son - bas)) - (t === 0 ? GECIS : 0))}>
                <Audio src={staticFile(`sfx/${ad}.wav`)} volume={0.3} />
              </Sequence>
            ))}
          </Sequence>
        );
      })}
      <Audio src={staticFile("muzik.wav")} volume={0.12} />
      <Sequence from={durationInFrames - fr(3.2)}>
        <div style={{ position: "absolute", top: 1490, left: 0, right: 0, textAlign: "center", fontFamily: FONT, fontWeight: 700, fontSize: 28, color: "#5E5470" }}>
          Bilgilendirme amaçlıdır, tanı ve tedavi yerine geçmez.
        </div>
      </Sequence>
    </AbsoluteFill>
  );
};
