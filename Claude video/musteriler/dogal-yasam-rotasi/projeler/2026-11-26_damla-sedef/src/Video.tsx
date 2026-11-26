import React from "react";
import "@fontsource/baloo-2/700.css";
import "@fontsource/baloo-2/800.css";
import { AbsoluteFill, Audio, Sequence, interpolate, spring, staticFile, useCurrentFrame, useVideoConfig, Easing } from "remotion";
import { SATIRLAR, FPS } from "./zaman";
import { RENK, Telefon, KagitUcak, ArkaPlan } from "./cizim";
import { Elif, Govde, DAMLALAR, Bakteri, Antikor, CiltKesit, Kisi, Takvim, Halka, KaynakKarti, Bogaz } from "./cizim2";

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
type SP = { dur: number };

const S01: React.FC<SP> = ({ dur }) => {
  const f = useCurrentFrame();
  const g = useYay(0, 11);
  // "Boğazın geçti": ağrı nabzı söner, yüz rahatlar
  const agri = (0.5 + 0.5 * Math.sin(f / 4)) * interpolate(f, [0, dur * 0.75], [1, 0], clamp);
  const yuz = f < dur * 0.55 ? "agri" : "rahat";
  return (
    <Sahne dur={dur} zemin={RENK.lila} vurgu="#FFFFFF" zoom={0.08}>
      <g transform={`translate(540 ${1290 + (1 - g) * 600}) scale(1.35)`}><Elif bogazTut={f < dur * 0.6} agri={agri} yuz={yuz} goz={f % 70 > 64 ? 0.15 : 1} /></g>
      {/* ağrı çizgileri */}
      {[0, 1, 2].map((i) => (
        <path key={i} d={`M${640 + i * 30} ${980 - i * 30} l 40 -20`} stroke="#FF5A5A" strokeWidth={10} strokeLinecap="round" opacity={(Math.sin(f / 3 + i) + 1) / 2} />
      ))}
      {/* termometre */}
      <g transform={`translate(850 560) rotate(20) scale(${useYay(8, 9)})`}>
        <rect x={-22} y={-150} width={44} height={220} rx={22} fill="#fff" stroke={RENK.cizgi} strokeWidth={7} />
        <rect x={-10} y={-90 + 40 * (1 - agri)} width={20} height={150 - 40 * (1 - agri)} rx={10} fill="#FF5A5A" />
        <circle cy={90} r={42} fill="#FF5A5A" stroke={RENK.cizgi} strokeWidth={7} />
      </g>
    </Sahne>
  );
};

const S02: React.FC<SP> = ({ dur }) => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const goster = DAMLALAR.map((_, i) => spring({ frame: f - GECIS - i * Math.max(1, (dur - 20) / DAMLALAR.length), fps, config: { damping: 8, stiffness: 200 } }));
  return (
    <Sahne dur={dur} zemin={RENK.krem} vurgu="#FFE2C4" zoom={0.1} pan={-40}>
      <g transform="translate(540 980) scale(1.25)"><Govde goster={goster} /></g>
    </Sahne>
  );
};

const S03: React.FC<SP> = ({ dur }) => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const harfler = "DAMLA SEDEF".split("");
  return (
    <Sahne dur={dur} zemin="#2A2150" vurgu="#4B3A8C" koyu zoom={0.05}>
      {harfler.map((h, i) => {
        const s = spring({ frame: f - 2 - i * 1, fps, config: { damping: 11, stiffness: 260 } });
        const satir = i < 5 ? 0 : 1;
        const x = satir === 0 ? 540 + (i - 2) * 150 : 540 + (i - 8) * 145;
        const y = satir === 0 ? 760 : 960;
        return (
          <text key={i} x={x} y={y - (1 - s) * 900} textAnchor="middle" fontFamily={FONT} fontWeight={800} fontSize={190} fill={satir === 0 ? "#FFFFFF" : "#F2994A"} stroke={RENK.cizgi} strokeWidth={6} paintOrder="stroke">{h}</text>
        );
      })}
      {/* sıçrayan damlalar */}
      {Array.from({ length: 10 }).map((_, i) => {
        const t = f - 12 - i * 2;
        if (t < 0) return null;
        const x = 540 + Math.cos(i * 0.63) * (90 + t * 12);
        const y = 1080 - Math.sin(0.4 + (i % 5) * 0.5) * t * 14 + t * t * 0.9;
        return <path key={i} transform={`translate(${x} ${y}) scale(${Math.max(0, 1 - t / 30)})`} d="M0 -30 Q 22 -5 20 10 A 20 20 0 0 1 -20 10 Q -22 -5 0 -30 Z" fill="#EE8E8B" stroke={RENK.cizgi} strokeWidth={4} />;
      })}
    </Sahne>
  );
};

const S04: React.FC<SP> = ({ dur }) => {
  const f = useCurrentFrame();
  const p = interpolate(f, [GECIS + 6, dur - 12], [0, 1], { ...clamp, easing: Easing.inOut(Easing.cubic) });
  const a = useYay(GECIS, 11), b = useYay(dur - 18, 10);
  const hafta = p < 0.34 ? 1 : p < 0.67 ? 2 : 3;
  return (
    <Sahne dur={dur} zemin={RENK.mavi} vurgu="#FFFFFF" zoom={0.04}>
      {/* sol: boğaz */}
      <g transform={`translate(210 820) scale(${0.32 * a})`}><Bogaz kizariklik={1} /></g>
      <text x={210} y={1010} textAnchor="middle" fontFamily={FONT} fontWeight={800} fontSize={44} fill={RENK.cizgi} opacity={a}>BOĞAZ</text>
      {/* zaman çizgisi */}
      <rect x={340} y={800} width={400} height={40} rx={20} fill="#fff" stroke={RENK.cizgi} strokeWidth={6} />
      <rect x={346} y={806} width={388 * p} height={28} rx={14} fill={RENK.mor} />
      {[0, 1, 2].map((i) => <circle key={i} cx={340 + 133 * (i + 1)} cy={820} r={14} fill={p > (i + 1) / 3 - 0.02 ? "#F2994A" : "#fff"} stroke={RENK.cizgi} strokeWidth={5} />)}
      <g transform="translate(540 650)"><Takvim metin={`${hafta}`} alt="HAFTA" /></g>
      {/* sağ: lekeler */}
      <g transform={`translate(870 820) scale(${b})`}>
        <circle r={110} fill={RENK.ten} stroke={RENK.cizgi} strokeWidth={7} />
        {[[-40, -30, 18], [30, -45, 14], [45, 20, 20], [-25, 40, 16], [0, 0, 12]].map(([x, y, r], i) => <circle key={i} cx={x} cy={y} r={r} fill="#EE8E8B" stroke="#D06A68" strokeWidth={3} />)}
      </g>
      <text x={870} y={1010} textAnchor="middle" fontFamily={FONT} fontWeight={800} fontSize={44} fill={RENK.cizgi} opacity={b}>CİLT</text>
      <g transform={`translate(540 1120) scale(${useYay(GECIS + 4, 12)})`}>
        <rect x={-230} y={-60} width={460} height={110} rx={55} fill="#F2994A" stroke={RENK.cizgi} strokeWidth={6} />
        <text y={22} textAnchor="middle" fontFamily={FONT} fontWeight={800} fontSize={62} fill="#fff">1–3 HAFTA</text>
      </g>
    </Sahne>
  );
};

/** s05 + s06 tek sahne: %58 halka + kaynak kartı */
const S05: React.FC<SP & { ikinciBas: number }> = ({ dur, ikinciBas }) => {
  const f = useCurrentFrame();
  const sayi = useSayac(58, GECIS + 2, GECIS + 40);
  const kart = useYay(GECIS + 14, 13);
  const bak = useYay(ikinciBas, 10);
  return (
    <Sahne dur={dur} zemin={RENK.krem} vurgu="#FFE2C4" zoom={0.05}>
      <g transform={`translate(540 ${ikinciBas > 0 && f > ikinciBas ? 700 - 60 * bak : 700}) scale(${1 - 0.15 * bak})`}>
        <Halka oran={sayi / 100} r={230} metin={`%${sayi}`} />
      </g>
      <g transform={`translate(${540 + (1 - kart) * 1100} 1070)`}><KaynakKarti ust="Telfer ve ark., 1992" alt="Archives of Dermatology · 33 hasta" /></g>
      {f > ikinciBas && (
        <g transform={`translate(540 ${330 + (1 - bak) * -400})`}>
          <Bakteri t={f / 30} n={7} />
        </g>
      )}
    </Sahne>
  );
};

const S07: React.FC<SP> = ({ dur }) => {
  const f = useCurrentFrame();
  const s = interpolate(f, [0, dur], [0.9, 1.5], { ...clamp, easing: Easing.in(Easing.quad) });
  const k = interpolate(f, [0, dur * 0.6], [0.2, 1], clamp);
  return (
    <Sahne dur={dur} zemin="#3A1E2E" vurgu="#7A3550" koyu zoom={0}>
      <g transform={`translate(540 860) scale(${s})`}>
        <Bogaz kizariklik={k} />
        <g transform="translate(0 60) scale(0.6)"><Bakteri t={f / 25} n={5} /></g>
      </g>
    </Sahne>
  );
};

const S08: React.FC<SP> = ({ dur }) => {
  const f = useCurrentFrame();
  const yarim = dur * 0.45;
  const ant = interpolate(f, [GECIS, yarim], [0, 1], { ...clamp, easing: Easing.out(Easing.cubic) });
  const ok = interpolate(f, [yarim, yarim + 18], [0, 1], clamp);
  const leke = spring({ frame: f - yarim - 16, fps: 30, config: { damping: 9 } });
  return (
    <Sahne dur={dur} zemin={RENK.mint} vurgu="#FFFFFF" zoom={0.04}>
      <g transform="translate(540 600) scale(1.3)"><Bakteri t={f / 25} n={6} /></g>
      {[[-1, -1], [1, -1], [-1, 1], [1, 1], [0, -1.4]].map(([dx, dy], i) => (
        <g key={i} transform={`translate(${540 + dx * (440 - 290 * ant)} ${600 + dy * (300 - 190 * ant)}) scale(1.3) rotate(${dx * -40 + dy * 20 + 180 * (dy > 0 ? 1 : 0)})`}>
          <Antikor />
        </g>
      ))}
      <text x={540} y={860} textAnchor="middle" fontFamily={FONT} fontWeight={800} fontSize={46} fill={RENK.cizgi} opacity={ant}>BAĞIŞIKLIK TEPKİSİ</text>
      {/* aşağı ok */}
      <path d={`M540 890 L 540 ${890 + 70 * ok}`} stroke={RENK.mor} strokeWidth={16} strokeLinecap="round" strokeDasharray="30 22" />
      {ok > 0.95 && <path d="M505 940 L 540 975 L 575 940" fill="none" stroke={RENK.mor} strokeWidth={16} strokeLinecap="round" strokeLinejoin="round" />}
      <g transform="translate(540 1030)"><CiltKesit w={820} leke={leke} /></g>
      <text x={540} y={1015} textAnchor="middle" fontFamily={FONT} fontWeight={800} fontSize={40} fill={RENK.cizgi} opacity={ok}>CİLT</text>
    </Sahne>
  );
};

const S09: React.FC<SP> = ({ dur }) => {
  const f = useCurrentFrame();
  const p = interpolate(f, [GECIS, GECIS + 26], [0, 1], { ...clamp, easing: Easing.out(Easing.cubic) });
  const etiket = useYay(GECIS + 22, 9);
  // yaş cetveli 0–60, 0–30 vurgulu (dağılım verisi değil: sadece "en sık 30 yaş altı" bilgisi)
  return (
    <Sahne dur={dur} zemin={RENK.lila} vurgu="#FFFFFF" zoom={0.05}>
      <rect x={120} y={900} width={840} height={60} rx={30} fill="#fff" stroke={RENK.cizgi} strokeWidth={6} />
      <rect x={126} y={906} width={414 * p} height={48} rx={24} fill={RENK.mor} />
      {[0, 10, 20, 30, 40, 50, 60].map((y, i) => (
        <g key={y}>
          <line x1={120 + i * 140} y1={970} x2={120 + i * 140} y2={1000} stroke={RENK.cizgi} strokeWidth={5} />
          <text x={120 + i * 140} y={1050} textAnchor="middle" fontFamily={FONT} fontWeight={800} fontSize={42} fill={RENK.cizgi}>{y}</text>
        </g>
      ))}
      <text x={540} y={1110} textAnchor="middle" fontFamily={FONT} fontWeight={700} fontSize={36} fill="#6E6585">YAŞ</text>
      {/* çocuk + genç */}
      <g transform={`translate(230 860) scale(${useYay(GECIS + 4, 10)})`}><Kisi aktif olcek={0.8} /></g>
      <g transform={`translate(400 860) scale(${useYay(GECIS + 9, 10)})`}><Kisi aktif olcek={1.05} /></g>
      <g transform={`translate(760 860)`} opacity={0.5}><Kisi olcek={1.1} /></g>
      <g transform={`translate(330 640) scale(${etiket})`}>
        <rect x={-190} y={-60} width={380} height={100} rx={50} fill="#F2994A" stroke={RENK.cizgi} strokeWidth={6} />
        <text y={14} textAnchor="middle" fontFamily={FONT} fontWeight={800} fontSize={56} fill="#fff">EN SIK</text>
      </g>
    </Sahne>
  );
};

const S10: React.FC<SP> = ({ dur }) => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const goster = DAMLALAR.map((_, i) => 1 - spring({ frame: f - GECIS - 8 - i * Math.max(1, (dur - 30) / DAMLALAR.length), fps, config: { damping: 12 } }));
  const sayfa = interpolate(f, [GECIS, dur * 0.6], [0, 1], clamp);
  const tik = useYay(dur * 0.55, 9);
  return (
    <Sahne dur={dur} zemin={RENK.mint} vurgu="#FFFFFF" zoom={0.05}>
      <g transform="translate(400 1050) scale(0.95)"><Govde goster={goster} /></g>
      <g transform="translate(820 560)"><Takvim metin={sayfa < 0.5 ? "HFT" : "AY"} alt={sayfa < 0.5 ? "haftalar" : "aylar"} renk={RENK.teal} /></g>
      <g transform={`translate(820 860) scale(${tik})`}>
        <circle r={80} fill={RENK.teal} stroke={RENK.cizgi} strokeWidth={7} />
        <path d="M-35 0 L -8 28 L 40 -28" fill="none" stroke="#fff" strokeWidth={16} strokeLinecap="round" strokeLinejoin="round" />
      </g>
    </Sahne>
  );
};

const S11: React.FC<SP> = ({ dur }) => {
  const f = useCurrentFrame();
  const kart = useYay(GECIS + 2, 13);
  const sec = f > GECIS + 22;
  const vurgu = useYay(GECIS + 22, 8);
  return (
    <Sahne dur={dur} zemin={RENK.krem} vurgu="#FFE2C4" zoom={0.05}>
      {[0, 1, 2].map((i) => (
        <g key={i} transform={`translate(${270 + i * 270} 900) scale(${i === 1 && sec ? 1.1 + 0.15 * vurgu : 1.1})`}>
          <Kisi aktif={i === 1 && sec} renk={i === 1 && sec ? "#F2994A" : undefined} />
        </g>
      ))}
      <g transform={`translate(540 560) scale(${vurgu})`}>
        <text textAnchor="middle" y={60} fontFamily={FONT} fontWeight={800} fontSize={210} fill={RENK.mor} stroke="#fff" strokeWidth={10} paintOrder="stroke">1 / 3</text>
      </g>
      <g transform={`translate(${540 - (1 - kart) * 1100} 1090)`}><KaynakKarti ust="Martin ve ark., 1996" alt="Archives of Dermatology · takip çalışması" /></g>
    </Sahne>
  );
};

const S12: React.FC<SP> = ({ dur }) => {
  const f = useCurrentFrame();
  const damga = interpolate(f, [GECIS + 2, GECIS + 9], [3, 1], { ...clamp, easing: Easing.in(Easing.quad) });
  const titre = f > GECIS + 9 && f < GECIS + 16 ? Math.sin(f * 4) * 8 : 0;
  const ikinci = Math.round(dur * 0.42);
  const tk = useYay(ikinci, 11);
  return (
    <Sahne dur={dur} zemin={RENK.lila} vurgu="#FFFFFF" zoom={0.04}>
      <g transform={`translate(${titre} 0)`}>
        <g transform="translate(360 880)"><Kisi aktif olcek={1.1} /></g>
        <g transform="translate(720 880)"><Kisi olcek={1.1} renk={RENK.teal} /></g>
        <g transform={`translate(540 520) rotate(-8) scale(${damga})`} opacity={f > GECIS + 2 ? 1 : 0}>
          <rect x={-330} y={-80} width={660} height={150} rx={20} fill="rgba(255,255,255,0.9)" stroke="#D9443F" strokeWidth={12} />
          <text y={30} textAnchor="middle" fontFamily={FONT} fontWeight={800} fontSize={88} fill="#D9443F">BULAŞICI DEĞİL</text>
        </g>
      </g>
      {/* randevu takvimi (doktor karakteri yok) */}
      <g transform={`translate(540 ${1080 + (1 - tk) * 700})`}>
        <rect x={-150} y={-120} width={300} height={220} rx={26} fill="#fff" stroke={RENK.cizgi} strokeWidth={7} />
        <path d="M-150 -60 L -150 -94 Q -150 -120 -124 -120 L 124 -120 Q 150 -120 150 -94 L 150 -60 Z" fill={RENK.mor} stroke={RENK.cizgi} strokeWidth={7} />
        <path d="M-40 20 l 30 30 l 60 -64" fill="none" stroke={RENK.teal} strokeWidth={16} strokeLinecap="round" strokeLinejoin="round" />
      </g>
    </Sahne>
  );
};

const S13: React.FC<SP> = ({ dur }) => {
  const f = useCurrentFrame();
  const g = useYay(GECIS, 13);
  const gonder = Math.round(dur * 0.5);
  const u = interpolate(f, [gonder, gonder + 16], [0, 1], { ...clamp, easing: Easing.in(Easing.quad) });
  const donus = interpolate(f, [dur - 14, dur], [0, 1], clamp);
  return (
    <Sahne dur={dur} zemin={RENK.lila} vurgu="#FFFFFF" zoom={0.02}>
      <g transform={`translate(540 ${820 + (1 - g) * 700})`} opacity={1 - donus}>
        <Telefon>
          <rect x={-170} y={-330} width={340} height={70} rx={35} fill="#E9E2F2" />
          <circle cx={-130} cy={-295} r={24} fill={RENK.teal} />
          <rect x={-90} y={-308} width={160} height={26} rx={13} fill="#C7BDD9" />
          <g transform={`translate(60 ${-80 - u * 120})`} opacity={1 - u}>
            <rect x={-130} y={-150} width={260} height={300} rx={26} fill={RENK.krem} stroke={RENK.cizgi} strokeWidth={6} />
            <g transform="translate(0 120) scale(0.32)"><Govde goster={DAMLALAR.map(() => 1)} /></g>
          </g>
          <rect x={-170} y={280} width={340} height={80} rx={40} fill={RENK.mor} />
          <text x={-20} y={334} textAnchor="middle" fontFamily={FONT} fontWeight={800} fontSize={42} fill="#fff">GÖNDER</text>
          <g transform={`translate(${110 + u * 380} ${320 - u * 520}) scale(0.7) rotate(${-u * 20})`}><KagitUcak /></g>
        </Telefon>
      </g>
      <g opacity={donus} transform="translate(540 1300)"><Elif bogazTut agri={0.6} yuz="agri" /></g>
    </Sahne>
  );
};

// satır → sahne (s06, S05 sahnesinin devamı)
const SAHNE: Record<string, { C?: React.FC<any>; gecis: GecisTip; baslik?: string; sfx?: [string, number][] }> = {
  s01: { C: S01, gecis: "yok", sfx: [["pop", 0.05]] },
  s02: { C: S02, gecis: "kaydirSol", sfx: [["whoosh_giris", 0], ["blip1", 0.3], ["blip2", 0.5], ["blip3", 0.7]] },
  s03: { C: S03, gecis: "daire", sfx: [["baslik", 0.05], ["pop", 0.45]] },
  s04: { C: S04, gecis: "sil", baslik: "NE ZAMAN?", sfx: [["whoosh_giris", 0], ["tik", 0.35], ["tik", 0.6], ["tik", 0.85]] },
  s05: { C: S05, gecis: "zoom", baslik: "ARAŞTIRMA", sfx: [["whoosh_giris", 0], ["secim", 0.35]] },
  s06: { gecis: "yok", sfx: [["pop", 0.05]] },
  s07: { C: S07, gecis: "donus", baslik: "NEDEN BOĞAZ?", sfx: [["whoosh_cikis", 0], ["uyari", 0.3]] },
  s08: { C: S08, gecis: "kaydirYukari", sfx: [["whoosh_giris", 0], ["blip2", 0.4], ["pop", 0.65]] },
  s09: { C: S09, gecis: "kaydirSol", baslik: "KİMLERDE?", sfx: [["whoosh_giris", 0], ["pop", 0.5]] },
  s10: { C: S10, gecis: "daire", baslik: "İYİ HABER", sfx: [["basari", 0.1], ["onay2", 0.55]] },
  s11: { C: S11, gecis: "sil", baslik: "TAKİP ÇALIŞMASI", sfx: [["whoosh_giris", 0], ["secim", 0.45]] },
  s12: { C: S12, gecis: "zoom", sfx: [["damga", 0.1], ["onay1", 0.45]] },
  s13: { C: S13, gecis: "kaydirSol", baslik: "GÖNDER ✈", sfx: [["whoosh_giris", 0], ["bildirim", 0.5]] },
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
