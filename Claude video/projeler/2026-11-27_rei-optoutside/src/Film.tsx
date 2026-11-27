import React from "react";
import { AbsoluteFill, Audio, interpolate, spring, staticFile, useCurrentFrame, useVideoConfig, Easing } from "remotion";
import { BerkayBas, BerkayTam, Ifade, KOL_POZ, KolAci, Poz, Vizem } from "./berkay";
import plan from "./plan.json";
import vizemler from "./vizem.json";

// v4: her satır ayrı çekim — mekân, kadraj (yakın/tam boy/köşe), kamera hareketi ve geçiş değişir.
const POP = "'PoppinsF', 'Poppins', sans-serif";
const TURUNCU = "#FF8A1F", YESIL = "#2ED47A", KIRMIZI = "#FF5A5A", MAVI = "#5AB4FF", KREM = "#FFF6E8", MOR = "#B45AFF";
type VO = { k: string; metin: string; bas: number; son: number };
const VOS = plan.vo as VO[];
const vo = (k: string) => VOS.find((v) => v.k === k)!;
const kl = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;

const Font: React.FC = () => (
  <style>{`
    @font-face { font-family: 'PoppinsF'; font-weight: 600; src: url(${staticFile("fonts/Poppins-SemiBold.ttf")}); }
    @font-face { font-family: 'PoppinsF'; font-weight: 700; src: url(${staticFile("fonts/Poppins-Bold.ttf")}); }
    @font-face { font-family: 'PoppinsF'; font-weight: 800; src: url(${staticFile("fonts/Poppins-ExtraBold.ttf")}); }
    @font-face { font-family: 'PoppinsF'; font-weight: 900; src: url(${staticFile("fonts/Poppins-Black.ttf")}); }
  `}</style>
);
const sp = (t: number, bas: number, damping = 12) => spring({ frame: Math.max(0, (t - bas) * 30), fps: 30, config: { damping, mass: 0.7 } });

// ---------- karakter durumu (dudak, göz, kollar) ----------
const VZ = vizemler as { t: number; v: Vizem }[];
const vizemAt = (t: number): Vizem => { let v: Vizem = "X"; for (const e of VZ) { if (e.t > t) break; v = e.v; } return v; };
const konusuyor = (t: number) => VOS.some((v) => t >= v.bas && t < v.son);

const Kisi: React.FC<{ t: number; mod: "tam" | "yakin"; x: number; y: number; olcek: number; ayna?: boolean; poz?: Poz; ifade?: Ifade; bas0?: number }> = ({ t, mod, x, y, olcek, ayna = false, poz = "dur", ifade = {}, bas0 = 0 }) => {
  const f = Math.round(t * 30);
  const kon = konusuyor(t);
  let ag: Vizem = kon ? vizemAt(t) : (ifade.agiz ?? "gulumse");
  if (ag === "X" && kon) ag = "duz";
  const kp = (f + 17) % 96, kirp = kp < 2 ? 0.1 : kp < 4 ? 0.5 : 1;
  const ifd: Ifade = { ...ifade, agiz: ag, egim: (ifade.egim ?? 0) + (kon ? Math.sin(t * 2.3) * 2.5 : Math.sin(t * 0.8)) };
  // kol: pozdan, çekim başında dur'dan geçiş + hareket
  const p = interpolate(t, [bas0, bas0 + 0.3], [0, 1], { ...kl, easing: Easing.out(Easing.cubic) });
  const A = KOL_POZ.dur, B = KOL_POZ[poz];
  let sag: KolAci = [A[0] + (B[0] - A[0]) * p, A[1] + (B[1] - A[1]) * p, p < 0.5 ? A[2] : B[2]];
  if (poz === "selam") sag = [sag[0] + Math.sin(t * 10) * 12 * p, sag[1] + Math.sin(t * 10) * 14 * p, sag[2]];
  if (poz === "anlat" && kon) sag = [sag[0] + Math.sin(t * 4.5) * 8, sag[1] + Math.sin(t * 4.5 + 1) * 12, sag[2]];
  if (poz === "goster") sag = [sag[0] + Math.sin(t * 3) * 3, sag[1], sag[2]];
  const sol: KolAci = [10 + Math.sin(t * 1.3) * 2, 6 + (kon ? Math.sin(t * 3.1) * 6 : 0), "yumruk"];
  const nefes = Math.sin(t * 2.2) * 3;
  const zipla = mod === "tam" ? -Math.abs(Math.sin(t * 2.2)) * 4 : Math.sin(t * 2.2) * 3;
  const tr = `translate(${x},${y + zipla}) scale(${ayna ? -olcek : olcek},${olcek}) translate(-200,0)`;
  return (
    <svg width={1080} height={1920} viewBox="0 0 1080 1920" style={{ position: "absolute", left: 0, top: 0, overflow: "visible" }}>
      {mod === "tam" ? <ellipse cx={x} cy={y + 1128 * olcek} rx={190 * olcek} ry={26 * olcek} fill="rgba(0,0,0,0.3)" /> : null}
      <g transform={tr}>
        {mod === "tam" ? <BerkayTam ifade={ifd} kirp={kirp} sag={sag} sol={sol} nefes={nefes} /> : <BerkayBas ifade={ifd} kirp={kirp} />}
      </g>
    </svg>
  );
};

// ---------- ortak parçalar ----------
const Etiket: React.FC<{ fiyat: string; renk?: string; olcek?: number; aci?: number; vurgu?: number; ip?: boolean; yazi?: string }> = ({ fiyat, renk = KREM, olcek = 1, aci = 0, vurgu = -1, ip = true, yazi = "#1b1f2e" }) => (
  <div style={{ transform: `scale(${olcek}) rotate(${aci}deg)`, transformOrigin: "50% 0%", display: "flex", flexDirection: "column", alignItems: "center" }}>
    {ip ? <div style={{ width: 5, height: 80, background: "#c9b38a" }} /> : null}
    <div style={{ position: "relative", background: renk, borderRadius: 30, padding: "40px 56px 30px", boxShadow: "0 28px 70px rgba(0,0,0,0.45)" }}>
      <div style={{ position: "absolute", top: 12, left: "50%", marginLeft: -11, width: 22, height: 22, borderRadius: 11, background: "#121726" }} />
      <div style={{ fontFamily: POP, fontWeight: 900, fontSize: 150, color: yazi, letterSpacing: -4, lineHeight: 1, whiteSpace: "nowrap" }}>
        {fiyat.split("").map((c, i) => <span key={i} style={{ color: i === vurgu ? TURUNCU : yazi }}>{c}</span>)}
        <span style={{ fontSize: 70, marginLeft: 12 }}>TL</span>
      </div>
    </div>
  </div>
);
const Yazi: React.FC<{ children: React.ReactNode; boy: number; renk?: string; g?: number; style?: React.CSSProperties }> = ({ children, boy, renk = "white", g = 1, style }) => (
  <div style={{ fontFamily: POP, fontWeight: 900, fontSize: boy, color: renk, lineHeight: 1.02, textAlign: "center", opacity: Math.min(1, g * 1.5), transform: `scale(${0.7 + 0.3 * g})`, textShadow: "0 8px 30px rgba(0,0,0,0.45)", ...style }}>{children}</div>
);
const Mutlak: React.FC<{ x?: number; y: number; w?: number; children: React.ReactNode; style?: React.CSSProperties }> = ({ x = 0, y, w = 1080, children, style }) => (
  <div style={{ position: "absolute", left: x, top: y, width: w, display: "flex", flexDirection: "column", alignItems: "center", ...style }}>{children}</div>
);
const Bokeh: React.FC<{ t: number; renk: string; n?: number; seed?: number }> = ({ t, renk, n = 14, seed = 1 }) => (
  <svg width={1080} height={1920} style={{ position: "absolute" }}>
    {Array.from({ length: n }).map((_, i) => {
      const r = 30 + ((i * 37 + seed * 13) % 90), x = (i * 211 + seed * 97) % 1080, y = ((i * 353 + seed * 51) % 1920) - ((t * (20 + (i % 5) * 8)) % 200);
      return <circle key={i} cx={x} cy={y} r={r} fill={renk} opacity={0.08 + (i % 4) * 0.03} />;
    })}
  </svg>
);

// ---------- arka planlar ----------
const Market: React.FC<{ t: number }> = ({ t }) => {
  const renk = ["#FF6B6B", "#4ECDC4", "#FFD93D", "#6C5CE7", "#FF9F43", "#2ED47A", "#54A0FF"];
  const fiyatlar = ["99,99", "49,99", "199,99", "9,99", "299,99", "19,99", "79,99"];
  return (
    <AbsoluteFill style={{ background: "linear-gradient(180deg,#2b1d3f 0%,#3c2752 100%)" }}>
      {[0, 1, 2, 3].map((r) => (
        <div key={r} style={{ position: "absolute", top: 240 + r * 400, left: -60 - ((t * 40 * (r % 2 ? 1 : -1)) % 200), width: 1400, height: 380 }}>
          <div style={{ position: "absolute", bottom: 0, width: "100%", height: 26, background: "#5a3f78" }} />
          {Array.from({ length: 9 }).map((_, i) => (
            <div key={i} style={{ position: "absolute", bottom: 26, left: i * 160, width: 120, height: 150 + ((i + r) % 3) * 40, background: renk[(i + r) % 7], borderRadius: 12, opacity: 0.85 }}>
              <div style={{ position: "absolute", bottom: -64, left: 10, background: KREM, borderRadius: 8, padding: "2px 8px", fontFamily: POP, fontWeight: 800, fontSize: 26, color: "#1b1f2e" }}>{fiyatlar[(i + r * 2) % 7]}</div>
            </div>
          ))}
        </div>
      ))}
      <AbsoluteFill style={{ background: "radial-gradient(ellipse at 50% 35%, rgba(43,29,63,0) 0%, rgba(20,12,30,0.75) 75%)" }} />
    </AbsoluteFill>
  );
};
const Beyin: React.FC<{ t: number; g: number }> = ({ t, g }) => {
  const nabiz = 1 + Math.sin(t * 7) * 0.025;
  return (
    <AbsoluteFill style={{ background: "radial-gradient(circle at 50% 30%, #4a1d6e 0%, #16081f 70%)" }}>
      <svg width={1080} height={1920}>
        <defs><filter id="parla"><feGaussianBlur stdDeviation="14" /></filter></defs>
        <g transform={`translate(540,560) scale(${g * nabiz * 2.3}) translate(-110,-90)`}>
          <path d="M108,10 C70,-6 30,12 26,46 C2,54 -6,88 12,108 C4,134 22,162 52,162 C64,184 96,186 108,170 Z M112,10 C150,-6 190,12 194,46 C218,54 226,88 208,108 C216,134 198,162 168,162 C156,184 124,186 112,170 Z" fill="#ff7ac8" filter="url(#parla)" opacity={0.7} />
          <path d="M108,10 C70,-6 30,12 26,46 C2,54 -6,88 12,108 C4,134 22,162 52,162 C64,184 96,186 108,170 Z M112,10 C150,-6 190,12 194,46 C218,54 226,88 208,108 C216,134 198,162 168,162 C156,184 124,186 112,170 Z" fill="#ff9bd6" />
          <path d="M40,60 C60,50 70,80 90,70 M30,110 C55,100 70,130 95,118 M180,60 C160,50 150,80 130,70 M190,110 C165,100 150,130 125,118 M110,20 L110,165" stroke="#d94fa0" strokeWidth={5} fill="none" strokeLinecap="round" />
        </g>
        {Array.from({ length: 16 }).map((_, i) => {
          const a = (i / 16) * Math.PI * 2 + t * 0.8, r = 330 + Math.sin(t * 3 + i) * 30;
          return <circle key={i} cx={540 + Math.cos(a) * r} cy={560 + Math.sin(a) * r * 0.8} r={6 + (i % 3) * 3} fill="#ffd1f0" opacity={g * 0.8} />;
        })}
      </svg>
    </AbsoluteFill>
  );
};
const Duz: React.FC<{ ust: string; alt: string; yon?: string }> = ({ ust, alt, yon = "180deg" }) => <AbsoluteFill style={{ background: `linear-gradient(${yon}, ${ust} 0%, ${alt} 100%)` }} />;
const Izgara: React.FC<{ renk?: string }> = ({ renk = "rgba(255,255,255,0.06)" }) => (
  <AbsoluteFill style={{ backgroundImage: `linear-gradient(${renk} 2px, transparent 2px), linear-gradient(90deg, ${renk} 2px, transparent 2px)`, backgroundSize: "90px 90px" }} />
);

// ---------- çekimler ----------
type Kam = [number, number, number, number]; // [çekim içi sn, odak x, odak y, zoom]
type Cekim = { bas: number; son: number; gecis: "kes" | "kay" | "kayTers" | "zoom" | "flas"; alt: number | ((y: number) => number); kam?: Kam[]; render: (t: number, yerel: number) => React.ReactNode };
// sanal kamera: anahtar kareler arasında yumuşak geçiş (zoom-in, yana kayıp kalma, geri gelme); kenar taşmaz
const kamera = (kam: Kam[] | undefined, y: number) => {
  if (!kam || !kam.length) return { x: 540, y: 960, z: 1 };
  let a = kam[0], b = kam[0];
  for (let i = 0; i < kam.length; i++) { if (kam[i][0] <= y) { a = kam[i]; b = kam[Math.min(i + 1, kam.length - 1)]; } }
  const p = b[0] > a[0] ? Easing.inOut(Easing.cubic)(Math.min(1, Math.max(0, (y - a[0]) / (b[0] - a[0])))) : 0;
  const z = a[3] + (b[3] - a[3]) * p;
  let x = a[1] + (b[1] - a[1]) * p, yy = a[2] + (b[2] - a[2]) * p;
  x = Math.min(1080 - 540 / z, Math.max(540 / z, x)); yy = Math.min(1920 - 960 / z, Math.max(960 / z, yy));
  return { x, y: yy, z };
};
const n = (k: string) => vo(k).bas;

const SARI = "#FFD93D", ORMAN = "#1f6b45";
const KALEM = ["#FF6B6B", "#4ECDC4", "#FFD93D", "#6C5CE7", "#FF9F43", "#54A0FF", "#2ED47A"];
const Dag: React.FC<{ t: number; gunes?: boolean }> = ({ t, gunes = true }) => (
  <svg width={1080} height={1920} style={{ position: "absolute" }}>
    <defs><linearGradient id="gok" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#7cc6ff" /><stop offset="1" stopColor="#d9f0ff" /></linearGradient></defs>
    <rect width={1080} height={1920} fill="url(#gok)" />
    {gunes ? <circle cx={820} cy={330 - Math.sin(t * 0.5) * 10} r={110} fill="#ffe27a" /> : null}
    <path d="M-50,1150 L250,620 L430,900 L620,560 L1130,1150 Z" fill="#6a8fa8" />
    <path d="M250,620 L310,720 L270,700 L230,730 Z M620,560 L690,680 L640,650 L590,690 Z" fill="white" />
    <path d="M-50,1250 C200,1050 450,1150 700,1060 C900,990 1050,1080 1130,1050 L1130,1920 L-50,1920 Z" fill="#3f8f5e" />
    {Array.from({ length: 9 }).map((_, i) => <path key={i} d={`M${60 + i * 120},${1180 + (i % 3) * 30} l40,-120 l40,120 Z`} fill={ORMAN} />)}
    <rect x={-50} y={1500} width={1180} height={420} fill="#2f7a4c" />
  </svg>
);
const Magaza: React.FC<{ x: number; y: number; s: number; acik: number }> = ({ x, y, s, acik }) => (
  <g transform={`translate(${x},${y}) scale(${s})`}>
    <rect x={0} y={20} width={60} height={46} rx={4} fill="#3a4560" />
    <path d="M-4,22 L64,22 L58,6 L2,6 Z" fill={acik > 0.5 ? "#2ED47A" : "#555c70"} />
    <rect x={8} y={32} width={20} height={16} fill={acik > 0.5 ? "#ffe9a6" : "#1b2030"} />
    <rect x={34} y={32} width={18} height={34} fill={acik > 0.5 ? "#ffe9a6" : "#1b2030"} />
  </g>
);

const CEKIMLER: Cekim[] = [
  // 1 — kanca: mağaza kapısında sallanan KAPALI tabelası, etrafta Black Friday afişleri
  { bas: 0, son: n("n2") - 0.05, gecis: "kes", alt: (y) => (y < 1.6 ? 1180 : 1720), kam: [[0,540,560,1.35],[1.0,540,560,1.35],[1.6,540,960,1],[2.3,540,1500,1.35],[3.5,540,1500,1.35]], render: (t) => {
    const g = sp(t, 0.2, 6), sal = Math.sin(t * 4) * 10 * Math.exp(-t * 0.6);
    return (<>
      <Duz ust="#151a2c" alt="#0b0e18" />
      {["%50", "%70", "SALE", "%40"].map((y, i) => <div key={i} style={{ position: "absolute", left: [40, 800, 60, 820][i], top: [180, 230, 760, 820][i], transform: `rotate(${[-10, 8, 6, -7][i]}deg)`, background: KIRMIZI, color: "white", fontFamily: POP, fontWeight: 900, fontSize: 64, padding: "8px 26px", borderRadius: 14, opacity: 0.55 }}>{y}</div>)}
      <Mutlak y={180}>
        <div style={{ width: 4, height: 120, background: "#c9b38a" }} />
        <div style={{ transform: `rotate(${sal}deg) scale(${g})`, transformOrigin: "50% -120px", background: "#f4efe6", border: "14px solid #7a4a1f", borderRadius: 24, padding: "30px 70px", boxShadow: "0 30px 80px rgba(0,0,0,0.5)" }}>
          <div style={{ fontFamily: POP, fontWeight: 900, fontSize: 170, color: KIRMIZI, lineHeight: 1 }}>KAPALI</div>
          <div style={{ fontFamily: POP, fontWeight: 800, fontSize: 46, color: "#3a2a10", textAlign: "center" }}>BLACK FRIDAY</div>
        </div>
      </Mutlak>
      <Kisi t={t} mod="yakin" x={540} y={1260} olcek={1.4} ifade={{ kas: 1, goz: 1.1, agiz: "sasir", bakY: -0.9 }} />
    </>);
  } },
  // 2 — REI kim: dağ manzarası, rozet
  { bas: n("n2") - 0.05, son: n("n3"), gecis: "kay", alt: 1740, kam: [[0,540,960,1],[0.5,420,520,1.4],[2.0,420,520,1.4],[2.6,820,1300,1.45],[3.5,820,1300,1.45]], render: (t) => (<>
      <Dag t={t} />
      <Mutlak y={260}><div style={{ transform: `scale(${sp(t, n("n2") + 0.1)})`, background: "white", borderRadius: 30, padding: "24px 50px", boxShadow: "0 20px 50px rgba(0,0,0,0.25)", textAlign: "center" }}>
        <div style={{ fontFamily: POP, fontWeight: 900, fontSize: 130, color: ORMAN, lineHeight: 1 }}>REI</div>
        <div style={{ fontFamily: POP, fontWeight: 800, fontSize: 38, color: "#3a4560" }}>🇺🇸 KOOPERATİF · DOĞA SPORLARI</div>
      </div></Mutlak>
      <svg width={1080} height={1920} style={{ position: "absolute" }}><path d="M180,1440 L300,1260 L420,1440 Z" fill="#ff8a1f" /><path d="M300,1260 L300,1440" stroke="#b85a0a" strokeWidth={6} /></svg>
      <Kisi t={t} mod="tam" x={820} y={1120} olcek={0.56} poz="anlat" ayna ifade={{ gozGul: 0.3, kas: 0.3 }} bas0={n("n2")} />
    </>) },
  // 3 — 2015, Black Friday REI için ilk 10 gün
  { bas: n("n3"), son: n("n4"), gecis: "kay", alt: 1740, kam: [[0,540,960,1],[0.6,540,700,1.25],[2.8,540,760,1.25],[3.3,250,1290,1.5],[4.5,250,1290,1.5]], render: (t) => {
    const gun = ["Black Friday", "Aralık 19", "Aralık 21", "Aralık 22", "Aralık 20"];
    return (<>
      <Duz ust="#1b2442" alt="#0f1424" /><Izgara />
      <Mutlak y={170}><Yazi boy={120} renk={SARI} g={sp(t, n("n3"))}>2015</Yazi><Yazi boy={46} g={sp(t, n("n3") + 0.4)}>YILIN EN BÜYÜK 10 SATIŞ GÜNÜ</Yazi></Mutlak>
      <div style={{ position: "absolute", left: 120, top: 520, width: 840 }}>
        {gun.map((d, i) => { const g = sp(t, n("n3") + 0.7 + i * 0.12); return (
          <div key={i} style={{ display: "flex", alignItems: "center", gap: 20, marginBottom: 18, opacity: g, transform: `translateX(${(1 - g) * -200}px)` }}>
            <div style={{ fontFamily: POP, fontWeight: 900, fontSize: 40, color: "#8fa0bf", width: 50 }}>{i + 1}</div>
            <div style={{ height: 70, width: 620 - i * 60, borderRadius: 14, background: i === 0 ? KIRMIZI : "#3a4560", display: "flex", alignItems: "center", paddingLeft: 24, fontFamily: POP, fontWeight: 800, fontSize: 36, color: "white" }}>{i === 0 ? "BLACK FRIDAY" : "…"}</div>
          </div>); })}
        <div style={{ fontFamily: POP, fontWeight: 600, fontSize: 26, color: "#8fa0bf", marginTop: 10 }}>temsili sıralama · CEO: "bizim için ilk 10 gün"</div>
      </div>
      <Kisi t={t} mod="tam" x={250} y={1150} olcek={0.5} poz="goster" ifade={{ bakX: 0.7, bakY: -0.7, kas: 0.4 }} bas0={n("n3")} />
    </>);
  } },
  // 4 — 143 mağazanın ışığı söner, 12.000 çalışan izinde
  { bas: n("n4"), son: n("n5"), gecis: "zoom", alt: 1720, kam: [[0,540,620,1.2],[2.2,540,620,1.2],[2.8,540,960,1],[4,540,960,1]], render: (t) => {
    const son = interpolate(t, [n("n4") + 0.4, n("n4") + 2.2], [0, 143], kl);
    return (<>
      <Duz ust="#0f1424" alt="#05070d" />
      <svg width={1080} height={1920} style={{ position: "absolute" }}>
        {Array.from({ length: 143 }).map((_, i) => <Magaza key={i} x={60 + (i % 13) * 74} y={180 + Math.floor(i / 13) * 66} s={0.9} acik={i < son ? 0 : 1} />)}
      </svg>
      <Mutlak y={940}><Yazi boy={140} renk={KIRMIZI} g={sp(t, n("n4") + 0.3)}>{Math.round(son)} MAĞAZA</Yazi><Yazi boy={60} renk={YESIL} g={sp(t, n("n4") + 1.8)} style={{ marginTop: 10 }}>12.000 ÇALIŞAN · ÜCRETLİ İZİN</Yazi></Mutlak>
      <Kisi t={t} mod="yakin" x={540} y={1380} olcek={1.05} ifade={{ kas: 0.8, goz: 1.1 }} />
    </>);
  } },
  // 5 — indirim yok, siparişler ertesi gün
  { bas: n("n5"), son: n("n6"), gecis: "kay", alt: 1720, kam: [[0,540,960,1],[0.6,560,760,1.35],[2.4,560,760,1.35],[2.9,540,960,1]], render: (t) => {
    const d = sp(t, n("n5") + 0.15, 6), g = sp(t, n("n5"), 11);
    return (<>
      <Duz ust="#e9eef7" alt="#cdd6e6" />
      <div style={{ position: "absolute", left: 300, top: 300, width: 480, height: 860, background: "#0f1320", borderRadius: 64, border: "14px solid #1b1f2e", transform: `translateY(${(1 - g) * 900}px)`, padding: 40 }}>
        <div style={{ fontFamily: POP, fontWeight: 900, fontSize: 44, color: "white" }}>Siparişin</div>
        <div style={{ marginTop: 40, background: "#1f2a44", borderRadius: 22, padding: 26, fontFamily: POP, fontWeight: 800, fontSize: 34, color: "white", lineHeight: 1.3 }}>⏸️ Beklemede<br /><span style={{ color: SARI }}>28 Kasım'da işlenecek</span></div>
        <div style={{ marginTop: 30, background: "#1f2a44", borderRadius: 22, padding: 26, fontFamily: POP, fontWeight: 800, fontSize: 34, color: "#8fa0bf" }}>Kampanya: —</div>
      </div>
      <div style={{ position: "absolute", left: 140, top: 520, fontFamily: POP, fontWeight: 900, fontSize: 120, color: KIRMIZI, border: `12px solid ${KIRMIZI}`, borderRadius: 26, padding: "0 30px", transform: `rotate(-14deg) scale(${2 - d})`, opacity: Math.min(1, d * 1.4), background: "rgba(255,255,255,0.85)" }}>İNDİRİM YOK</div>
      <Kisi t={t} mod="tam" x={880} y={1180} olcek={0.5} poz="anlat" ayna ifade={{ kas: 0.4 }} bas0={n("n5")} />
    </>);
  } },
  // 6 — #OptOutside: alışveriş yapma, dışarı çık
  { bas: n("n6"), son: n("n7"), gecis: "flas", alt: 1060, kam: [[0,540,500,1.4],[1.2,540,520,1.4],[1.8,540,960,1],[3,540,960,1]], render: (t) => (<>
      <Dag t={t} />
      <Mutlak y={300}><div style={{ fontFamily: POP, fontWeight: 900, fontSize: 120, color: "white", textShadow: "0 10px 40px rgba(0,0,0,0.35)", transform: `scale(${sp(t, n("n6"), 8)})` }}>#OptOutside</div>
        <div style={{ marginTop: 20, background: "white", borderRadius: 999, padding: "12px 40px", fontFamily: POP, fontWeight: 900, fontSize: 54, color: ORMAN, transform: `scale(${sp(t, n("n6") + 0.8)})` }}>DIŞARI ÇIK 🌲</div></Mutlak>
      <Kisi t={t} mod="tam" x={540} y={1180} olcek={0.56} poz="selam" ifade={{ gozGul: 0.6, kas: 0.4 }} bas0={n("n6") + 0.6} />
    </>) },
  // 7 — "neye mal oldu?": aşırı yakın plan + soru işaretleri
  { bas: n("n7"), son: n("n8"), gecis: "zoom", alt: 300, kam: [[0,540,960,1],[0.4,540,880,1.25],[2.4,540,880,1.25]], render: (t) => (<>
      <Duz ust="#2a1f4d" alt="#120d24" /><Bokeh t={t} renk={MOR} n={18} seed={9} />
      {[0, 1, 2, 3, 4].map((i) => { const g = sp(t, n("n7") + i * 0.12, 7);
        return <div key={i} style={{ position: "absolute", left: [120, 820, 200, 760, 470][i], top: [520, 470, 1500, 1450, 380][i] - Math.sin(t * 2 + i) * 20, fontFamily: POP, fontWeight: 900, fontSize: [160, 130, 110, 150, 90][i], color: [TURUNCU, "white", MOR, YESIL, "white"][i], transform: `scale(${g}) rotate(${(i - 2) * 12}deg)` }}>{["?", "$", "?", "?", "$"][i]}</div>; })}
      <Kisi t={t} mod="yakin" x={540} y={620} olcek={2.4} ifade={{ kasAci: 0.6, bakX: 0.6, bakY: -0.6, egim: -5 }} />
    </>) },
  // 8 — 33 gün haberlerde: gazete manşetleri yığılır, sayaç
  { bas: n("n8"), son: n("n9"), gecis: "kay", alt: 1740, kam: [[0,540,960,1],[0.5,480,720,1.3],[2.2,480,720,1.3],[2.7,850,1300,1.45],[3.6,850,1300,1.45]], render: (t) => {
    const gun = Math.round(interpolate(t, [n("n8") + 0.2, n("n8") + 2.0], [1, 33], kl));
    const mans = ["REI Black Friday'de kapanıyor", "Mağazasını kapatan dev", "#OptOutside büyüyor", "Çalışanlara ücretli izin", "Tüketimciliğe meydan okuma"];
    return (<>
      <Duz ust="#efe4c9" alt="#d9c89e" />
      {mans.map((m, i) => { const g = sp(t, n("n8") + i * 0.25);
        return <div key={i} style={{ position: "absolute", left: 70 + (i % 2) * 70, top: 260 + i * 120, width: 700, background: "#fbf6e8", boxShadow: "0 12px 30px rgba(90,60,10,0.25)", padding: "20px 30px", transform: `rotate(${(i % 2 ? 3 : -3)}deg) translateY(${(1 - g) * -600}px)`, fontFamily: "serif", fontWeight: 900, fontSize: 44, color: "#2a2418" }}>{m}</div>; })}
      <Mutlak y={950}><Yazi boy={200} renk="#b8232f" g={sp(t, n("n8") + 0.2)}>{gun}</Yazi><Yazi boy={60} renk="#2a2418" g={sp(t, n("n8") + 0.4)}>GÜN BOYUNCA HABERLERDE</Yazi></Mutlak>
      <Kisi t={t} mod="tam" x={880} y={1180} olcek={0.5} poz="goster" ayna ifade={{ bakX: -0.7, bakY: -0.6, kas: 0.4 }} bas0={n("n8")} />
    </>);
  } },
  // 9 — satış +%9, rekor üye
  { bas: n("n9"), son: n("n10"), gecis: "kay", alt: 1300, kam: [[0,540,960,1],[0.6,540,640,1.3],[2.4,540,640,1.3],[2.9,540,1500,1.25],[3.8,540,1500,1.25]], render: (t) => {
    const c = interpolate(t, [n("n9") + 0.2, n("n9") + 1.6], [0, 1], { ...kl, easing: Easing.out(Easing.cubic) });
    return (<>
      <Duz ust="#0b3d2e" alt="#04170f" /><Izgara renk="rgba(46,212,122,0.08)" />
      <svg width={1080} height={1920} style={{ position: "absolute" }}>
        <path d={`M120,900 L${120 + 420 * c},${900 - 260 * c}`} stroke={YESIL} strokeWidth={22} strokeLinecap="round" />
        {c > 0.95 ? <path d="M540,640 l-60,0 l60,-60 l0,60" fill={YESIL} /> : null}
      </svg>
      <Mutlak y={230}><Yazi boy={170} renk={YESIL} g={sp(t, n("n9") + 0.3)}>+%9</Yazi><Yazi boy={56} g={sp(t, n("n9") + 0.5)}>SATIŞ · 2,4 MİLYAR $</Yazi></Mutlak>
      <Mutlak y={960}><div style={{ fontFamily: POP, fontWeight: 900, fontSize: 70, color: SARI, transform: `scale(${sp(t, n("n9") + 1.4, 8)})` }}>🏆 REKOR ÜYE BÜYÜMESİ</div></Mutlak>
      <Kisi t={t} mod="yakin" x={540} y={1430} olcek={1.1} ifade={{ gozGul: 0.6, kas: 0.5 }} />
    </>);
  } },
  // 10 — Cannes büyük ödül
  { bas: n("n10"), son: n("n11"), gecis: "flas", alt: 1060, kam: [[0,540,620,1.4],[1.8,540,620,1.4],[2.4,540,960,1],[3.6,540,960,1]], render: (t) => (<>
      <AbsoluteFill style={{ background: "radial-gradient(circle at 50% 35%, #3a2a00 0%, #0b0800 70%)" }} />
      <svg width={1080} height={1920} style={{ position: "absolute" }}>
        {Array.from({ length: 40 }).map((_, i) => { const d = Math.max(0, t - n("n10") - 0.5); if (d <= 0) return null;
          const x = 540 + Math.cos(i * 2.4) * (200 + (i % 7) * 60) * Math.min(1, d * 2), y = 600 + Math.sin(i * 1.7) * 300 * Math.min(1, d * 2) + d * d * 400;
          return <rect key={i} x={x} y={y} width={18} height={10} fill={[TURUNCU, YESIL, MAVI, SARI, KIRMIZI][i % 5]} transform={`rotate(${i * 40 + d * 300} ${x} ${y})`} />; })}
        <g transform={`translate(540,560) scale(${sp(t, n("n10"), 8)})`}>
          <path d="M-120,-160 L120,-160 L100,-20 C80,60 -80,60 -100,-20 Z" fill="#e8b923" /><rect x={-24} y={50} width={48} height={90} fill="#c99a10" /><rect x={-90} y={140} width={180} height={40} rx={8} fill="#8a6a08" />
          <text y={-60} textAnchor="middle" fontFamily="PoppinsF" fontWeight={900} fontSize={60} fill="#5a4508">🦁</text>
        </g>
      </svg>
      <Mutlak y={800}><Yazi boy={110} renk={SARI} g={sp(t, n("n10") + 0.6)}>CANNES LIONS</Yazi><Yazi boy={60} g={sp(t, n("n10") + 0.9)}>GRAND PRIX · 2016</Yazi></Mutlak>
      <Kisi t={t} mod="tam" x={540} y={1180} olcek={0.5} poz="selam" ifade={{ gozGul: 0.6, kas: 0.5 }} bas0={n("n10") + 0.5} />
    </>) },
  // 11 — bugün 10. yıl, yine kapalı
  { bas: n("n11"), son: n("n12"), gecis: "kay", alt: 1740, kam: [[0,540,620,1.3],[1.6,540,620,1.3],[2.1,250,1290,1.5],[3.2,250,1290,1.5]], render: (t) => {
    const yil = Math.round(interpolate(t, [n("n11") + 0.1, n("n11") + 1.3], [2015, 2026], kl));
    return (<>
      <Duz ust="#151a2c" alt="#0b0e18" />
      <Mutlak y={220}><Yazi boy={200} renk={SARI} g={sp(t, n("n11"))}>{yil}</Yazi>
        <div style={{ marginTop: 20, background: "#f4efe6", border: "12px solid #7a4a1f", borderRadius: 22, padding: "20px 50px", fontFamily: POP, fontWeight: 900, fontSize: 100, color: KIRMIZI, transform: `scale(${sp(t, n("n11") + 1.3, 8)}) rotate(-3deg)` }}>YİNE KAPALI</div>
        <Yazi boy={70} g={sp(t, n("n11") + 1.5)} style={{ marginTop: 30 }}>10. YIL</Yazi></Mutlak>
      <Kisi t={t} mod="tam" x={250} y={1150} olcek={0.5} poz="goster" ifade={{ bakX: 0.7, bakY: -0.7, gozGul: 0.3 }} bas0={n("n11")} />
    </>);
  } },
  // 12 — dönüş: 2023'te 311 milyon $ zarar
  { bas: n("n12"), son: n("n13"), gecis: "flas", alt: (y) => (y < 2.6 ? 1300 : 300), kam: [[0,540,960,1],[1.4,540,640,1.4],[2.6,540,640,1.4],[3.1,540,1480,1.3],[4.2,540,1480,1.3]], render: (t) => {
    const v = Math.round(interpolate(t, [n("n12") + 1.3, n("n12") + 2.8], [0, 311], { ...kl, easing: Easing.out(Easing.cubic) }));
    return (<>
      <Duz ust="#3d0d0d" alt="#120303" />
      <svg width={1080} height={1920} style={{ position: "absolute" }}>
        <path d={`M120,520 L320,560 L520,700 L${520 + 360 * interpolate(t, [n("n12") + 1, n("n12") + 2.2], [0, 1], kl)},${700 + 330 * interpolate(t, [n("n12") + 1, n("n12") + 2.2], [0, 1], kl)}`} stroke={KIRMIZI} strokeWidth={18} fill="none" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
      <Mutlak y={260}><Yazi boy={80} g={sp(t, n("n12") + 0.9)}>2023</Yazi></Mutlak>
      <Mutlak y={980}><Yazi boy={150} renk={KIRMIZI} g={sp(t, n("n12") + 1.3)}>-{v} MİLYON $</Yazi><Yazi boy={44} renk="#ffb3b3" g={sp(t, n("n12") + 1.6)}>net zarar · REI 2023 finansalları</Yazi></Mutlak>
      <Kisi t={t} mod="yakin" x={540} y={1440} olcek={1.05} ifade={{ kasAci: -1, kas: 0.4, bakX: -0.4 }} />
    </>);
  } },
  // 13 — kampanya dikkat çeker, işi tek başına kurtarmaz
  { bas: n("n13"), son: n("n14"), gecis: "kay", alt: 1740, kam: [[0,540,960,1],[0.5,540,620,1.25],[2.3,540,620,1.25],[2.8,830,1300,1.5],[3.8,830,1300,1.5]], render: (t) => (<>
      <Duz ust="#1b2442" alt="#0f1424" /><Izgara />
      <Mutlak y={250}>
        {[["DİKKAT", "✓", YESIL], ["SATIŞ", "✓", YESIL], ["KÂRLILIK", "?", KIRMIZI]].map(([a, b, r], i) => { const g = sp(t, n("n13") + 0.2 + i * 0.45);
          return <div key={i} style={{ width: 820, marginBottom: 30, display: "flex", justifyContent: "space-between", alignItems: "center", background: "#1f2a44", borderRadius: 28, padding: "30px 46px", opacity: g, transform: `translateX(${(1 - g) * -300}px)`, border: `5px solid ${r}` }}>
            <div style={{ fontFamily: POP, fontWeight: 900, fontSize: 64, color: "white" }}>{a}</div><div style={{ fontFamily: POP, fontWeight: 900, fontSize: 84, color: r as string }}>{b}</div></div>; })}
      </Mutlak>
      <Kisi t={t} mod="tam" x={830} y={1150} olcek={0.5} poz="dusun" ayna ifade={{ kasAci: 0.5, bakX: -0.6, bakY: -0.6 }} bas0={n("n13")} />
    </>) },
  // 14 — herkes indirim diye bağırırken farklı hikâye anlatan duyulur
  { bas: n("n14"), son: n("n15"), gecis: "zoom", alt: 1740, kam: [[0,540,960,1],[0.8,540,760,1.3],[2.6,700,700,1.45],[3.2,540,960,1],[4.4,540,960,1]], render: (t) => {
    const g = sp(t, n("n14") + 1.6, 7);
    return (<>
      <Duz ust="#2b1d3f" alt="#141a2e" />
      {Array.from({ length: 14 }).map((_, i) => <div key={i} style={{ position: "absolute", left: (i * 157) % 900 + 20, top: 220 + Math.floor(i / 4) * 210 + (i % 2) * 40, transform: `rotate(${(i % 5 - 2) * 8}deg) scale(${0.9 + 0.1 * Math.sin(t * 8 + i)})`, background: KIRMIZI, color: "white", fontFamily: POP, fontWeight: 900, fontSize: 40, padding: "10px 22px", borderRadius: 16, opacity: 0.35 + 0.65 * (1 - g) }}>📢 İNDİRİM!</div>)}
      <Mutlak y={620}><div style={{ background: YESIL, color: "#06301b", fontFamily: POP, fontWeight: 900, fontSize: 90, borderRadius: 40, padding: "30px 60px", transform: `scale(${g * 1.05})`, boxShadow: "0 30px 80px rgba(46,212,122,0.45)" }}>💬 HİKÂYE</div></Mutlak>
      <Kisi t={t} mod="tam" x={540} y={1180} olcek={0.5} poz="anlat" ifade={{ gozGul: 0.3, kas: 0.3 }} bas0={n("n14")} />
    </>);
  } },
  // 15 — çağrı: telefon ekranında profil + takip et, Berkay el sallar
  { bas: n("n15"), son: plan.bitis, gecis: "kay", alt: 1650, kam: [[0,540,960,1],[0.8,730,900,1.5],[1.9,730,900,1.5],[2.4,250,1300,1.5],[3.2,250,1300,1.5]], render: (t) => {
    const tik = (plan as any).takipTik as number, basma = interpolate(t, [tik - 0.08, tik, tik + 0.12], [1, 0.9, 1], kl), takip = t >= tik;
    const g = sp(t, n("n15"), 11);
    return (<>
      <Duz ust="#ff8a1f" alt="#ff5a1f" /><Izgara renk="rgba(255,255,255,0.1)" />
      <div style={{ position: "absolute", left: 470, top: 300, width: 520, height: 1040, background: "#0f1320", borderRadius: 70, border: "14px solid #1b1f2e", boxShadow: "0 40px 90px rgba(0,0,0,0.45)", transform: `translateY(${(1 - g) * 900}px) rotate(4deg)`, overflow: "hidden", display: "flex", flexDirection: "column", alignItems: "center", paddingTop: 110 }}>
        <div style={{ width: 200, height: 200, borderRadius: "50%", background: "linear-gradient(135deg,#ff8a1f,#b45aff)", padding: 8 }}><div style={{ width: "100%", height: "100%", borderRadius: "50%", background: "#232c4f", overflow: "hidden" }}>
          <svg width={184} height={184} viewBox="60 40 280 280"><BerkayBas ifade={{ agiz: "gulumse", gozGul: 0.3 }} govde={false} /></svg></div></div>
        <div style={{ fontFamily: POP, fontWeight: 800, fontSize: 30, color: "white", marginTop: 22 }}>eticaretteperdearkasi</div>
        <div style={{ fontFamily: POP, fontWeight: 700, fontSize: 30, color: "#aab3c8", marginTop: 4, textAlign: "center", lineHeight: 1.2 }}>E-ticarette<br /><span style={{ color: TURUNCU, fontWeight: 900, fontSize: 40 }}>perde arkası</span></div>
        <div style={{ transform: `scale(${basma})`, marginTop: 40, fontFamily: POP, fontWeight: 900, fontSize: 44, color: takip ? "white" : "#1b1f2e", background: takip ? "#2a3350" : "white", borderRadius: 20, padding: "18px 60px" }}>{takip ? "✓ Takip" : "Takip et"}</div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 150px)", gap: 8, marginTop: 44 }}>{Array.from({ length: 6 }).map((_, i) => <div key={i} style={{ height: 150, background: ["#3c2752", "#0f5c3a", "#6e1a1a", "#123c55", "#2a1f4d", "#ff6a1f"][i], borderRadius: 8 }} />)}</div>
      </div>
      <div style={{ position: "absolute", left: 40, top: 150, width: 1000, display: "flex", justifyContent: "center", transform: `scale(${sp(t, n("n15") + 0.3)})` }}>
        <div style={{ fontFamily: POP, fontWeight: 900, fontSize: 56, color: "#1b1f2e", background: "white", borderRadius: 999, padding: "14px 40px", boxShadow: "0 16px 40px rgba(0,0,0,0.25)" }}>@eticaretteperdearkasi</div>
      </div>
      <Kisi t={t} mod="tam" x={250} y={1140} olcek={0.6} poz="selam" ifade={{ gozGul: 0.5, kas: 0.4 }} bas0={n("n15")} />
    </>);
  } },
];

// ---------- altyazı (çekime göre konum; yüzü kapatmaz) ----------
const VURGU = ["kapattı", "rei", "kooperatif", "black", "friday", "on", "yüz", "hepsi", "ücretli", "indirim", "dışarı", "neye", "otuz", "dokuz", "rekor", "cannes", "onuncu", "kapalı", "zarar", "milyon", "kurtarmaz", "hikâye", "takip"];
const Altyazi: React.FC<{ t: number; y: number }> = ({ t, y }) => {
  const v = VOS.find((x) => t >= x.bas - 0.05 && t < x.son + 0.2);
  if (!v) return null;
  const ws = v.metin.split(" "), ilerleme = (t - v.bas) / Math.max(0.1, v.son - v.bas);
  return (
    <div style={{ position: "absolute", top: y, left: 50, width: 980, textAlign: "center", lineHeight: 1.2 }}>
      <span style={{ background: "rgba(10,12,22,0.55)", borderRadius: 18, padding: "6px 18px", boxDecorationBreak: "clone", WebkitBoxDecorationBreak: "clone" }}>
        {ws.map((w, i) => {
          const yak = i / ws.length <= ilerleme + 0.02, temiz = w.toLocaleLowerCase("tr").replace(/[^a-zçğıöşü]/g, "");
          const vur = VURGU.some((x) => temiz.startsWith(x));
          return <span key={i} style={{ fontFamily: POP, fontWeight: 800, fontSize: 48, color: vur ? "#FFB347" : "white", opacity: yak ? 1 : 0.4 }}>{w} </span>;
        })}
      </span>
    </div>
  );
};

// ---------- geçişler + kamera ----------
const GECIS = 0.24;
const CekimKatmani: React.FC<{ c: Cekim; t: number; giris: number; cikis: number }> = ({ c, t, giris, cikis }) => {
  // giris: 0..1 (yeni çekim giriyor), cikis: 0..1 (bu çekim çıkıyor); kamera: yavaş itme + hafif kayma
  const yerel = t - c.bas, sure = c.son - c.bas;
  const p = Math.min(1, yerel / Math.max(0.5, sure));
  const k = kamera(c.kam, yerel);
  const nefesKam = 1 + 0.012 * (1 + Math.sin(yerel * 1.7)) / 2;   // el kamerası hissi
  const z = k.z * nefesKam;
  let tf = `translate(${540 - k.x * z}px, ${960 - k.y * z}px) scale(${z})`, op = 1, blur = 0;
  void p;
  const e = 1 - giris;
  if (giris < 1) {
    if (c.gecis === "kay") { tf = `translateX(${e * 1080}px) ` + tf; blur = e * 18; }
    if (c.gecis === "kayTers") { tf = `translateX(${-e * 1080}px) ` + tf; blur = e * 18; }
    if (c.gecis === "zoom") { tf = `translate(540px,960px) scale(${1 + e * 0.6}) translate(-540px,-960px) ` + tf; op = giris; blur = e * 10; }
  }
  if (cikis > 0) { const g2 = cikis; op *= c.gecis === "zoom" ? 1 : 1; tf = `translate(540px,960px) scale(${1 + g2 * 0.05}) translate(-540px,-960px) ` + tf; }
  return (
    <AbsoluteFill style={{ transform: tf, transformOrigin: "0 0", opacity: op, filter: blur > 0.5 ? `blur(${blur}px)` : undefined, overflow: "hidden" }}>
      {c.render(t, yerel)}
    </AbsoluteFill>
  );
};

export const Film: React.FC = () => {
  const f = useCurrentFrame(); const { fps } = useVideoConfig(); const t = f / fps;
  let i = 0;
  for (let j = 0; j < CEKIMLER.length; j++) if (t >= CEKIMLER[j].bas) i = j;
  const c = CEKIMLER[i], once = i > 0 ? CEKIMLER[i - 1] : null;
  const yerel = t - c.bas;
  const giris = c.gecis === "kes" || c.gecis === "flas" ? 1 : interpolate(yerel, [0, GECIS], [0, 1], { ...kl, easing: Easing.out(Easing.cubic) });
  const flas = c.gecis === "flas" ? interpolate(yerel, [0, 0.05, 0.22], [0.9, 0.9, 0], kl) : 0;
  return (
    <AbsoluteFill style={{ background: "#0b0e18" }}>
      <Font />
      {once && giris < 1 ? <CekimKatmani c={once} t={t} giris={1} cikis={giris} /> : null}
      <CekimKatmani c={c} t={t} giris={giris} cikis={0} />
      {flas > 0 ? <AbsoluteFill style={{ background: "white", opacity: flas }} /> : null}
      <Altyazi t={t} y={typeof c.alt === "number" ? c.alt : c.alt(yerel)} />
      {(plan as any).ses ? <Audio src={staticFile((plan as any).ses)} /> : null}
    </AbsoluteFill>
  );
};
