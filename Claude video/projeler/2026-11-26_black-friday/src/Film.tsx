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

const SARI = "#FFD93D";
const Arac: React.FC<{ x: number; y: number; renk: string; s?: number }> = ({ x, y, renk, s = 1 }) => (
  <g transform={`translate(${x},${y}) scale(${s})`}>
    <rect x={0} y={20} width={150} height={50} rx={14} fill={renk} /><path d="M25,20 L45,0 L105,0 L125,20 Z" fill={renk} />
    <path d="M50,5 L100,5 L115,20 L35,20 Z" fill="#cfe6ff" opacity={0.8} />
    <circle cx={35} cy={72} r={14} fill="#111" /><circle cx={115} cy={72} r={14} fill="#111" />
    <rect x={140} y={32} width={10} height={10} rx={3} fill="#ffef9a" />
  </g>
);
const KALEM = ["#FF6B6B", "#4ECDC4", "#FFD93D", "#6C5CE7", "#FF9F43", "#54A0FF", "#2ED47A"];

const CEKIMLER: Cekim[] = [
  // 1 — kanca: takvim yaprağı düşer, neon BLACK FRIDAY
  { bas: 0, son: n("n2") - 0.05, gecis: "kes", alt: (y) => (y < 1.3 ? 1000 : 1720), kam: [[0,540,520,1.35],[0.9,540,560,1.35],[1.4,540,960,1],[2.0,540,1450,1.4],[3,540,1450,1.4]], render: (t) => {
    const g = sp(t, 0.05, 9), neon = 0.75 + 0.25 * Math.abs(Math.sin(t * 9)) * (t > 0.6 ? 1 : 0);
    return (<>
      <AbsoluteFill style={{ background: "radial-gradient(circle at 50% 30%, #1c1c1c 0%, #000 70%)" }} />
      <Mutlak y={150}>
        <div style={{ transform: `translateY(${(1 - g) * -900}px) rotate(${(1 - g) * -20 - 3}deg)`, width: 520, background: "white", borderRadius: 26, overflow: "hidden", boxShadow: "0 30px 80px rgba(255,255,255,0.12)" }}>
          <div style={{ background: KIRMIZI, fontFamily: POP, fontWeight: 900, fontSize: 56, color: "white", textAlign: "center", padding: "14px 0" }}>KASIM</div>
          <div style={{ fontFamily: POP, fontWeight: 900, fontSize: 230, color: "#111", textAlign: "center", lineHeight: 1.05 }}>27</div>
          <div style={{ fontFamily: POP, fontWeight: 800, fontSize: 52, color: "#111", textAlign: "center", paddingBottom: 20 }}>CUMA</div>
        </div>
        <div style={{ marginTop: 60, fontFamily: POP, fontWeight: 900, fontSize: 130, color: "white", opacity: sp(t, 0.6), textShadow: `0 0 ${30 * neon}px #ff3b3b, 0 0 ${70 * neon}px #ff3b3b`, letterSpacing: 4 }}>BLACK FRIDAY</div>
      </Mutlak>
      <Kisi t={t} mod="yakin" x={540} y={1240} olcek={1.45} ifade={{ kas: 0.6, bakY: -0.9, kasAci: 0.2 }} />
    </>);
  } },
  // 2 — mit: muhasebe defteri, kırmızı → siyah
  { bas: n("n2") - 0.05, son: n("n3"), gecis: "kay", alt: 1720, kam: [[0,540,960,1],[0.6,420,640,1.45],[2.0,420,640,1.45],[2.6,540,960,1]], render: (t) => {
    const don = interpolate(t, [n("n2") + 1.0, n("n2") + 1.8], [0, 1], kl);
    const satir = ["-12.400", "-8.150", "-3.900", "+21.700"];
    return (<>
      <Duz ust="#f3ead8" alt="#e4d6b8" /><Izgara renk="rgba(120,90,40,0.08)" />
      <div style={{ position: "absolute", left: 90, top: 300, width: 660, height: 760, background: "#fffaf0", borderRadius: 24, boxShadow: "0 24px 60px rgba(90,60,10,0.3)", padding: "50px 60px", transform: "rotate(-4deg)" }}>
        <div style={{ fontFamily: POP, fontWeight: 900, fontSize: 54, color: "#3a2a10", borderBottom: "6px solid #3a2a10", paddingBottom: 10, marginBottom: 30 }}>MUHASEBE</div>
        {satir.map((s, i) => {
          const kirmizi = i < 3 ? 1 - don : 0;
          return <div key={i} style={{ fontFamily: POP, fontWeight: 900, fontSize: 84, color: i === 3 ? `rgba(17,17,17,${don})` : `rgb(${200 * kirmizi + 17},${40 * kirmizi + 17},${40 * kirmizi + 17})`, lineHeight: 1.35, textDecoration: i < 3 && don > 0.5 ? "line-through" : "none" }}>{s} ₺</div>;
        })}
      </div>
      <Mutlak y={1120}><Yazi boy={88} renk="#3a2a10" g={sp(t, n("n2") + 1.6)}>ZARARDAN <span style={{ color: "#111" }}>KÂRA?</span></Yazi></Mutlak>
      <Kisi t={t} mod="tam" x={860} y={1130} olcek={0.56} poz="anlat" ayna ifade={{ kas: 0.3 }} bas0={n("n2")} />
    </>);
  } },
  // 3 — mit çöker: MİT damgası, 1981
  { bas: n("n3"), son: n("n4"), gecis: "flas", alt: 300, kam: [[0,540,800,1.25],[1.2,540,820,1.25],[1.7,540,1350,1.35],[3,540,1350,1.35]], render: (t) => {
    const d = sp(t, n("n3") + 0.15, 6);
    return (<>
      <Duz ust="#e4d6b8" alt="#cdb88e" />
      <Mutlak y={520}>
        <div style={{ fontFamily: POP, fontWeight: 900, fontSize: 220, color: KIRMIZI, border: `16px solid ${KIRMIZI}`, borderRadius: 30, padding: "0 50px", transform: `rotate(-12deg) scale(${2 - d})`, opacity: Math.min(1, d * 1.4) }}>MİT</div>
        <div style={{ marginTop: 50, fontFamily: POP, fontWeight: 900, fontSize: 70, color: "#3a2a10", opacity: sp(t, n("n3") + 0.9) }}>ilk kez <span style={{ color: KIRMIZI, fontSize: 110 }}>1981</span></div>
      </Mutlak>
      <Kisi t={t} mod="yakin" x={540} y={1260} olcek={1.3} ifade={{ kasAci: 0.7, bakX: 0.3 }} />
    </>);
  } },
  // 4 — köken: Philadelphia 1961, polis rozeti, eski gazete
  { bas: n("n4"), son: n("n5"), gecis: "kay", alt: 1720, kam: [[0,540,960,1],[0.5,520,560,1.5],[1.8,520,560,1.5],[2.3,260,1250,1.55],[3.2,260,1250,1.55]], render: (t) => {
    const g = sp(t, n("n4") + 0.1, 10);
    return (<>
      <AbsoluteFill style={{ background: "#2a2418", filter: "sepia(0.6)" }} />
      <div style={{ position: "absolute", left: 120, top: 200, width: 840, height: 820, background: "#efe4c9", borderRadius: 10, transform: `rotate(${3 - 3 * g}deg) scale(${0.9 + 0.1 * g})`, boxShadow: "0 30px 80px rgba(0,0,0,0.6)", padding: 50, filter: "sepia(0.5)" }}>
        <div style={{ fontFamily: "serif", fontWeight: 900, fontSize: 64, color: "#2a2418", textAlign: "center", borderBottom: "4px double #2a2418", paddingBottom: 10 }}>THE PHILADELPHIA</div>
        <div style={{ fontFamily: "serif", fontSize: 34, color: "#2a2418", textAlign: "center", margin: "10px 0 30px" }}>1961</div>
        <svg width={740} height={420} viewBox="0 0 740 420">
          <g transform="translate(370,210)">
            <path d="M0,-170 L60,-120 L140,-120 L140,-30 C140,70 70,140 0,180 C-70,140 -140,70 -140,-30 L-140,-120 L-60,-120 Z" fill="#c9a227" stroke="#7a5f10" strokeWidth={10} />
            <circle r={70} fill="#e8c95a" stroke="#7a5f10" strokeWidth={6} />
            <text y={14} textAnchor="middle" fontFamily="serif" fontWeight={900} fontSize={44} fill="#5a4508">POLİS</text>
          </g>
        </svg>
        <div style={{ fontFamily: "serif", fontWeight: 900, fontSize: 54, color: "#2a2418", textAlign: "center", marginTop: 10 }}>“BLACK FRIDAY”</div>
      </div>
      <Kisi t={t} mod="tam" x={260} y={1090} olcek={0.56} poz="goster" ifade={{ bakX: 0.7, bakY: -0.7, kas: 0.4 }} bas0={n("n4")} />
    </>);
  } },
  // 5 — kaos: trafik sıkışması + kalabalık, kamera trafik boyunca kayar
  { bas: n("n5"), son: n("n6"), gecis: "zoom", alt: 300, kam: [[0,300,1000,1.45],[1.8,800,1000,1.45],[2.3,540,960,1],[3.4,540,960,1]], render: (t) => {
    const sars = Math.sin(t * 40) * 1.5;
    return (<>
      <Duz ust="#3a3a46" alt="#1e1e26" />
      <svg width={1080} height={1920} style={{ position: "absolute" }}>
        {[0, 1, 2, 3].map((s) => <rect key={s} x={0} y={700 + s * 170} width={1080} height={8} fill="rgba(255,255,255,0.15)" />)}
        {Array.from({ length: 28 }).map((_, i) => {
          const s = i % 4, k = Math.floor(i / 4);
          return <Arac key={i} x={-60 + k * 175 + (s % 2) * 80 + Math.sin(t * 2 + i) * 4} y={600 + s * 170 + sars} renk={KALEM[(i * 3) % 7]} />;
        })}
        {Array.from({ length: 90 }).map((_, i) => <circle key={i} cx={(i * 97) % 1080} cy={1380 + ((i * 53) % 260) + Math.sin(t * 6 + i) * 6} r={16} fill={KALEM[i % 7]} opacity={0.85} />)}
        {[0, 1, 2].map((i) => <text key={i} x={[180, 620, 900][i]} y={[560, 520, 600][i] - ((t * 60 + i * 40) % 80)} fontFamily="PoppinsF" fontWeight={900} fontSize={60} fill={SARI} opacity={0.9}>DÜT!</text>)}
      </svg>
      <Mutlak y={240}><Yazi boy={110} g={sp(t, n("n5") + 1.6)}>KARA <span style={{ color: KIRMIZI }}>CUMA</span></Yazi></Mutlak>
      <Kisi t={t} mod="yakin" x={880} y={1500} olcek={0.9} ayna ifade={{ kas: 1, goz: 1.1, agiz: "sasir" }} />
    </>);
  } },
  // 6 — "bugün dev bir ekonomi": şehir ışıkları yanar
  { bas: n("n6"), son: n("n7"), gecis: "flas", alt: 1060, kam: [[0,540,700,1.3],[1.4,540,960,1]], render: (t) => {
    const g = sp(t, n("n6"), 12);
    return (<>
      <Duz ust="#120f2b" alt="#2b1650" />
      <svg width={1080} height={1920} style={{ position: "absolute" }}>
        {Array.from({ length: 12 }).map((_, i) => {
          const h = 300 + ((i * 137) % 500), x = i * 92;
          return <g key={i}><rect x={x} y={1200 - h} width={84} height={h + 720} fill="#1d1a3d" />
            {Array.from({ length: Math.floor(h / 60) }).map((__, j) => <rect key={j} x={x + 14 + (j % 2) * 34} y={1220 - h + j * 60} width={22} height={30} fill={KALEM[(i + j) % 7]} opacity={g > ((i + j) % 10) / 10 ? 0.9 : 0.1} />)}</g>;
        })}
      </svg>
      <Mutlak y={240}><Yazi boy={120} renk={SARI} g={g}>DEV BİR<br />EKONOMİ</Yazi></Mutlak>
      <Kisi t={t} mod="tam" x={540} y={1180} olcek={0.56} poz="anlat" ifade={{ gozGul: 0.3, kas: 0.4 }} bas0={n("n6")} />
    </>);
  } },
  // 7 — 11,8 milyar $ sayacı
  { bas: n("n7"), son: n("n8"), gecis: "kay", alt: 1100, kam: [[0,540,960,1],[1.2,540,560,1.45],[3.0,540,560,1.45],[3.6,540,1450,1.3],[4.5,540,1450,1.3]], render: (t) => {
    const v = interpolate(t, [n("n7") + 0.6, n("n7") + 2.6], [0, 11.8], { ...kl, easing: Easing.out(Easing.cubic) });
    return (<>
      <Duz ust="#0b3d2e" alt="#04170f" /><Izgara renk="rgba(46,212,122,0.08)" />
      <Mutlak y={260}>
        <div style={{ fontFamily: POP, fontWeight: 800, fontSize: 44, color: "#bfeedd", background: "rgba(0,0,0,0.3)", borderRadius: 999, padding: "8px 30px" }}>ABD · BLACK FRIDAY 2025 · ONLINE</div>
        <div style={{ fontFamily: POP, fontWeight: 900, fontSize: 250, color: YESIL, lineHeight: 1.05, marginTop: 30, textShadow: "0 0 50px rgba(46,212,122,0.5)" }}>${v.toFixed(1).replace(".", ",")}</div>
        <div style={{ fontFamily: POP, fontWeight: 900, fontSize: 110, color: "white", marginTop: -10 }}>MİLYAR</div>
        <div style={{ fontFamily: POP, fontWeight: 600, fontSize: 30, color: "#8fcfb4", marginTop: 20 }}>Kaynak: Adobe Analytics</div>
      </Mutlak>
      <Kisi t={t} mod="yakin" x={540} y={1300} olcek={1.2} ifade={{ kas: 0.9, goz: 1.1, bakY: -0.8 }} />
    </>);
  } },
  // 8 — "indirimler gerçek mi?": aşırı yakın plan + soru işaretleri
  { bas: n("n8"), son: n("n9"), gecis: "zoom", alt: 300, kam: [[0,540,960,1],[0.4,540,880,1.25],[2,540,880,1.25]], render: (t) => (<>
      <Duz ust="#2a1f4d" alt="#120d24" /><Bokeh t={t} renk={MOR} n={18} seed={9} />
      {[0, 1, 2, 3, 4].map((i) => {
        const g = sp(t, n("n8") + i * 0.12, 7);
        return <div key={i} style={{ position: "absolute", left: [120, 820, 200, 760, 470][i], top: [520, 470, 1500, 1450, 380][i] - Math.sin(t * 2 + i) * 20, fontFamily: POP, fontWeight: 900, fontSize: [160, 130, 110, 150, 90][i], color: [TURUNCU, "white", MOR, TURUNCU, "white"][i], transform: `scale(${g}) rotate(${(i - 2) * 12}deg)` }}>?</div>;
      })}
      <Kisi t={t} mod="yakin" x={540} y={620} olcek={2.4} ifade={{ kasAci: 0.6, bakX: 0.6, bakY: -0.6, egim: -5 }} />
    </>) },
  // 9 — İngiltere: 175 ürün ızgarası dolar
  { bas: n("n9"), son: n("n10"), gecis: "kay", alt: 1720, kam: [[0,540,960,1],[0.7,440,700,1.35],[2.6,440,700,1.35],[3.1,850,1300,1.5],[4,850,1300,1.5]], render: (t) => {
    const dolu = interpolate(t, [n("n9") + 0.3, n("n9") + 2.6], [0, 175], kl);
    return (<>
      <Duz ust="#13213f" alt="#0a1224" />
      <Mutlak y={180}><div style={{ fontFamily: POP, fontWeight: 900, fontSize: 64, color: "white" }}>🇬🇧 TÜKETİCİ ÖRGÜTÜ</div></Mutlak>
      <div style={{ position: "absolute", left: 70, top: 320, width: 760, display: "grid", gridTemplateColumns: "repeat(14, 50px)", gap: 4 }}>
        {Array.from({ length: 175 }).map((_, i) => <div key={i} style={{ width: 50, height: 50, borderRadius: 10, background: KALEM[i % 7], opacity: i < dolu ? 1 : 0.08, transform: `scale(${i < dolu ? 1 : 0.6})` }} />)}
      </div>
      <Mutlak y={1000} w={760} style={{ left: 70 }}><div style={{ fontFamily: POP, fontWeight: 900, fontSize: 150, color: SARI }}>{Math.round(dolu)}</div><div style={{ fontFamily: POP, fontWeight: 800, fontSize: 56, color: "white", marginTop: -20 }}>ÜRÜN İNCELENDİ</div></Mutlak>
      <Kisi t={t} mod="tam" x={880} y={1150} olcek={0.5} poz="goster" ayna ifade={{ bakX: -0.7, bakY: -0.6 }} bas0={n("n9")} />
    </>);
  } },
  // 10 — hepsi aynı ya da daha ucuz
  { bas: n("n10"), son: n("n11"), gecis: "kayTers", alt: (y) => (y < 2.0 ? 1100 : 300), kam: [[0,540,700,1.3],[1.6,540,700,1.3],[2.1,540,1380,1.35],[3.2,540,1380,1.35]], render: (t) => {
    const don = interpolate(t, [n("n10") + 0.2, n("n10") + 1.6], [0, 175], kl);
    return (<>
      <Duz ust="#13213f" alt="#0a1224" />
      <div style={{ position: "absolute", left: 160, top: 200, width: 760, display: "grid", gridTemplateColumns: "repeat(14, 50px)", gap: 4 }}>
        {Array.from({ length: 175 }).map((_, i) => <div key={i} style={{ width: 50, height: 50, borderRadius: 10, background: i < don ? "#3a4560" : KALEM[i % 7], color: i < don ? (i % 2 ? YESIL : "#cfd6e6") : "transparent", fontFamily: POP, fontWeight: 900, fontSize: 32, display: "flex", alignItems: "center", justifyContent: "center" }}>{i % 2 ? "↓" : "="}</div>)}
      </div>
      <Mutlak y={860}><Yazi boy={150} renk={SARI} g={sp(t, n("n10") + 1.2)}>175 / 175</Yazi><Yazi boy={50} g={sp(t, n("n10") + 1.5)} style={{ marginTop: 10 }}>yılın başka zamanı <span style={{ color: YESIL }}>aynı ya da daha ucuz</span></Yazi></Mutlak>
      <Kisi t={t} mod="yakin" x={540} y={1240} olcek={1.3} ifade={{ kas: 1, goz: 1.15, agiz: "sasir" }} />
    </>);
  } },
  // 11 — İsveç: fiyat grafiği önce yükselir, sonra "indirim"
  { bas: n("n11"), son: n("n12"), gecis: "kay", alt: 1720, kam: [[0,540,960,1],[0.6,560,700,1.4],[2.8,700,700,1.4],[3.3,250,1260,1.5],[4.2,250,1260,1.5]], render: (t) => {
    const c = interpolate(t, [n("n11") + 0.3, n("n11") + 2.8], [0, 1], kl);
    const pts = [[0, 0.62], [0.25, 0.62], [0.42, 0.62], [0.55, 0.3], [0.72, 0.3], [0.8, 0.62], [1, 0.62]];
    const W = 860, H = 520, X0 = 110, Y0 = 380;
    const d = pts.filter((p) => p[0] <= c).map((p, i) => `${i ? "L" : "M"}${X0 + p[0] * W},${Y0 + p[1] * H}`).join(" ");
    return (<>
      <Duz ust="#0f2f4f" alt="#071a2c" /><Izgara />
      <Mutlak y={170}><div style={{ fontFamily: POP, fontWeight: 900, fontSize: 62, color: "white" }}>🇸🇪 İSVEÇ · <span style={{ color: SARI }}>~%30</span></div></Mutlak>
      <svg width={1080} height={1920} style={{ position: "absolute" }}>
        <line x1={X0} y1={Y0 + H} x2={X0 + W} y2={Y0 + H} stroke="#5a7090" strokeWidth={4} />
        <path d={d} stroke={SARI} strokeWidth={14} fill="none" strokeLinejoin="round" strokeLinecap="round" />
        {c > 0.55 ? <text x={X0 + 0.5 * W} y={Y0 + 0.3 * H - 40} fontFamily="PoppinsF" fontWeight={900} fontSize={52} fill={KIRMIZI}>ZAM ↑</text> : null}
        {c > 0.8 ? <text x={X0 + 0.74 * W} y={Y0 + 0.62 * H - 40} fontFamily="PoppinsF" fontWeight={900} fontSize={52} fill={YESIL}>"İNDİRİM"</text> : null}
        <text x={X0} y={Y0 + H + 60} fontFamily="PoppinsF" fontWeight={700} fontSize={36} fill="#9fb3cc">EKİM</text>
        <text x={X0 + W - 150} y={Y0 + H + 60} fontFamily="PoppinsF" fontWeight={700} fontSize={36} fill="#9fb3cc">KASIM</text>
      </svg>
      <Kisi t={t} mod="tam" x={250} y={1110} olcek={0.56} poz="goster" ifade={{ bakX: 0.7, bakY: -0.7, kasAci: 0.3 }} bas0={n("n11")} />
    </>);
  } },
  // 12 — Türkiye: KARA → EFSANE
  { bas: n("n12"), son: n("n13"), gecis: "flas", alt: 1080, kam: [[0,540,620,1.4],[1.6,540,620,1.4],[2.1,540,960,1]], render: (t) => {
    const cz = interpolate(t, [n("n12") + 0.5, n("n12") + 0.85], [0, 1], kl), ef = sp(t, n("n12") + 0.85, 8);
    return (<>
      <Duz ust="#c8102e" alt="#7a0a1c" /><Bokeh t={t} renk="#ffffff" seed={13} />
      <Mutlak y={400}>
        <div style={{ position: "relative", fontFamily: POP, fontWeight: 900, fontSize: 170, color: "#111", opacity: 1 - ef * 0.75 }}>KARA
          <div style={{ position: "absolute", left: -10, right: -10, top: "50%", height: 22, background: "white", transform: `scaleX(${cz}) rotate(-6deg)`, transformOrigin: "0 50%" }} /></div>
        <div style={{ fontFamily: POP, fontWeight: 900, fontSize: 190, color: SARI, marginTop: -60, transform: `scale(${ef}) rotate(-4deg)`, textShadow: "0 10px 40px rgba(0,0,0,0.4)" }}>EFSANE</div>
        <div style={{ fontFamily: POP, fontWeight: 900, fontSize: 130, color: "white", marginTop: -10 }}>CUMA</div>
      </Mutlak>
      <Kisi t={t} mod="tam" x={540} y={1200} olcek={0.52} poz="anlat" ifade={{ gozGul: 0.3, kas: 0.4 }} bas0={n("n12")} />
    </>);
  } },
  // 13 — kural: son 10 günün en düşük fiyatı
  { bas: n("n13"), son: n("n14"), gecis: "kay", alt: 1720, kam: [[0,540,960,1],[0.6,540,640,1.35],[2.6,540,640,1.35],[3.1,830,1280,1.5],[4,830,1280,1.5]], render: (t) => {
    const f = [1249, 1199, 1229, 1179, 1199, 1259, 1239, 1189, 1219, 1209];
    const enk = Math.min(...f), isaret = sp(t, n("n13") + 1.6, 8);
    return (<>
      <Duz ust="#f2f5fb" alt="#d7deec" />
      <Mutlak y={190}><Yazi boy={60} renk="#1b2a4a" g={sp(t, n("n13"))}>İNDİRİM ÖNCESİ FİYAT =</Yazi><Yazi boy={80} renk={KIRMIZI} g={sp(t, n("n13") + 0.3)}>SON 10 GÜNÜN EN DÜŞÜĞÜ</Yazi></Mutlak>
      <div style={{ position: "absolute", left: 60, top: 470, width: 960, display: "grid", gridTemplateColumns: "repeat(5, 180px)", gap: 15 }}>
        {f.map((v, i) => {
          const g = sp(t, n("n13") + 0.4 + i * 0.08), en = v === enk;
          return <div key={i} style={{ background: "white", borderRadius: 18, padding: "14px 0", textAlign: "center", boxShadow: "0 10px 24px rgba(20,30,60,0.15)", transform: `scale(${g * (en ? 1 + 0.12 * isaret : 1)})`, border: en ? `6px solid rgba(46,212,122,${isaret})` : "6px solid transparent" }}>
            <div style={{ fontFamily: POP, fontWeight: 700, fontSize: 28, color: "#7a88a6" }}>{i + 1}. gün</div>
            <div style={{ fontFamily: POP, fontWeight: 900, fontSize: 48, color: en ? "#0f7a45" : "#1b2a4a" }}>{v} ₺</div>
          </div>;
        })}
      </div>
      <Mutlak y={950}><div style={{ fontFamily: POP, fontWeight: 600, fontSize: 30, color: "#7a88a6" }}>temsili fiyatlar</div></Mutlak>
      <Kisi t={t} mod="tam" x={830} y={1140} olcek={0.56} poz="goster" ayna ifade={{ bakX: -0.7, bakY: -0.6, kas: 0.3 }} bas0={n("n13")} />
    </>);
  } },
  // 14 — taktik: fiyat takibi alarmı
  { bas: n("n14"), son: n("n15"), gecis: "zoom", alt: 1720, kam: [[0,540,960,1],[0.7,560,700,1.4],[2.4,560,700,1.4],[2.9,540,960,1]], render: (t) => {
    const g = sp(t, n("n14"), 11), zil = Math.sin(t * 30) * 12 * (t > n("n14") + 1.2 && t < n("n14") + 2 ? 1 : 0);
    return (<>
      <Duz ust="#ff8a1f" alt="#ff5a1f" />
      <div style={{ position: "absolute", left: 280, top: 230, width: 520, height: 920, background: "#0f1320", borderRadius: 70, border: "14px solid #1b1f2e", transform: `translateY(${(1 - g) * 900}px)`, padding: 40, boxShadow: "0 40px 90px rgba(0,0,0,0.4)" }}>
        <div style={{ fontFamily: POP, fontWeight: 900, fontSize: 40, color: "white" }}>Fiyat takibi</div>
        <svg width={420} height={260} style={{ marginTop: 30 }}><path d="M0,120 L60,110 L120,140 L180,90 L240,100 L300,60 L360,150 L420,200" stroke={SARI} strokeWidth={10} fill="none" strokeLinejoin="round" /><circle cx={420} cy={200} r={14} fill={YESIL} /></svg>
        <div style={{ marginTop: 30, background: "#1f2a44", borderRadius: 24, padding: 24, display: "flex", gap: 20, alignItems: "center", transform: `rotate(${zil * 0.2}deg)` }}>
          <div style={{ fontSize: 70, transform: `rotate(${zil}deg)` }}>🔔</div>
          <div style={{ fontFamily: POP, fontWeight: 800, fontSize: 32, color: "white", lineHeight: 1.2 }}>Gerçek indirim!<br /><span style={{ color: YESIL }}>Takip ettiğin en düşük fiyat</span></div>
        </div>
      </div>
      <Mutlak y={1200}><Yazi boy={80} g={sp(t, n("n14") + 0.8)}>FİYATI <span style={{ color: "#1b1f2e" }}>ŞİMDİDEN</span> TAKİP ET</Yazi></Mutlak>
      <Kisi t={t} mod="yakin" x={200} y={1420} olcek={0.95} ifade={{ gozGul: 0.5, kas: 0.3 }} />
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
const VURGU = ["black", "friday", "kara", "zarardan", "kâra", "seksenli", "philadelphia", "polisinden", "kaos", "dev", "on", "milyar", "gerçek", "yüz", "hepsi", "ucuza", "otuzunun", "yükseldi", "efsane", "en", "düşük", "şimdiden", "takip"];
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
