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

const CEKIMLER: Cekim[] = [
  // 1 — kanca: market rafı, dev etiket düşer, yakın plan Berkay yukarı bakar
  { bas: 0, son: n("n2") - 0.05, gecis: "kes", alt: (y) => (y < 1.4 ? 880 : 1720), kam: [[0,540,480,1.22],[0.7,540,500,1.22],[1.2,540,960,1],[1.7,700,1450,1.45],[2.5,700,1450,1.45]], render: (t) => {
    const g = sp(t, 0.05, 8), sal = Math.sin(t * 3.4) * 7 * Math.exp(-t * 0.9);
    return (<>
      <Market t={t} />
      <Mutlak y={120}><div style={{ transform: `translateY(${(1 - g) * -900}px)` }}><Etiket fiyat="99,99" aci={sal} olcek={1.35} /></div></Mutlak>
      <Kisi t={t} mod="yakin" x={720} y={1240} olcek={1.55} ifade={{ kas: 0.8, bakX: -0.4, bakY: -1, agiz: "sasir" }} />
    </>);
  } },
  // 2 — "bir kuruş için mi?": dev dönen madeni para, küçük Berkay omuz silker
  { bas: n("n2") - 0.05, son: n("n2") + 0.98, gecis: "zoom", alt: 1060, kam: [[0,540,760,1],[0.55,540,640,1.32],[1.1,540,640,1.32]], render: (t, y) => {
    const g = sp(t, n("n2"), 10), don = Math.cos(y * 7) ;
    return (<>
      <Duz ust="#0f3b3a" alt="#0a2322" /><Bokeh t={t} renk="#ffd166" seed={3} />
      <Mutlak y={260}>
        <div style={{ width: 560, height: 560, borderRadius: "50%", background: "radial-gradient(circle at 35% 30%, #ffe08a, #d4a017 70%)", border: "18px solid #b8860b", transform: `scale(${g}) scaleX(${0.25 + 0.75 * Math.abs(don)})`, display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 30px 80px rgba(0,0,0,0.5)" }}>
          <div style={{ fontFamily: POP, fontWeight: 900, fontSize: 170, color: "#8a6100", opacity: Math.abs(don) > 0.4 ? 1 : 0 }}>1<span style={{ fontSize: 60 }}>kr</span></div>
        </div>
        <Yazi boy={90} g={sp(t, n("n2") + 0.25)} style={{ marginTop: 40 }}>1 KURUŞ İÇİN Mİ?</Yazi>
      </Mutlak>
      <Kisi t={t} mod="tam" x={190} y={1260} olcek={0.5} poz="anlat" ifade={{ kas: 0.6 }} bas0={n("n2")} />
    </>);
  } },
  // 3 — "beynin için": neon beyin, Berkay sağda düşünür
  { bas: n("n2") + 0.98, son: n("n3"), gecis: "flas", alt: 1720, kam: [[0,540,600,1.45],[0.45,540,760,1],[0.85,790,1300,1.55],[1.4,790,1300,1.55]], render: (t) => {
    const g = sp(t, n("n2") + 0.98, 9);
    return (<>
      <Beyin t={t} g={g} />
      <Mutlak y={960}><Yazi boy={120} renk="#ff9bd6" g={sp(t, n("n2") + 1.4)}>BEYNİN İÇİN</Yazi></Mutlak>
      <Kisi t={t} mod="tam" x={800} y={1180} olcek={0.6} poz="dusun" ifade={{ kasAci: 0.4, bakX: -0.8, bakY: -0.6 }} bas0={n("n2") + 0.98} />
    </>);
  } },
  // 4 — "soldan okuruz": kamera dev etiketin üstünde soldan sağa kayar
  { bas: n("n3"), son: n("n4"), gecis: "kay", alt: 1080, kam: [[0,540,960,1],[0.3,320,600,1.35],[1.7,780,600,1.35],[2.2,540,960,1]], render: (t, y) => {
    const kay = interpolate(y, [0.2, 2.0], [380, -380], { ...kl, easing: Easing.inOut(Easing.cubic) });
    const ok = interpolate(y, [0.2, 2.0], [0, 1], kl);
    return (<>
      <Duz ust="#ff9a3c" alt="#ff6a1f" /><Izgara renk="rgba(255,255,255,0.12)" />
      <Mutlak y={180}><Yazi boy={80} g={sp(t, n("n3"))}>FİYATI <span style={{ color: "#1b1f2e" }}>SOLDAN</span> OKURUZ</Yazi></Mutlak>
      <div style={{ position: "absolute", left: 540 + kay, top: 420, transform: "translateX(-50%)" }}><Etiket fiyat="99,99" olcek={2.2} vurgu={0} ip={false} /></div>
      <div style={{ position: "absolute", left: 90, top: 900, width: 900 * ok, height: 20, borderRadius: 10, background: "#1b1f2e" }} />
      <div style={{ position: "absolute", left: 90 + 900 * ok - 30, top: 870, fontSize: 70, color: "#1b1f2e", fontFamily: POP, fontWeight: 900 }}>▶</div>
      <Kisi t={t} mod="yakin" x={300} y={1300} olcek={1.25} ifade={{ bakX: 0.8 * (ok * 2 - 1), bakY: -0.9, kas: 0.4 }} />
    </>);
  } },
  // 5 — "doksan dokuz → doksanlı": yeşil yarı, Berkay sağda işaret eder
  { bas: n("n4"), son: n("n4") + 2.32, gecis: "kay", alt: (y) => (y < 1.1 ? 1000 : 1720), kam: [[0,540,480,1.45],[0.7,540,700,1.05],[1.3,840,1260,1.6],[2.4,840,1260,1.6]], render: (t) => {
    const g = sp(t, n("n4"));
    return (<>
      <Duz ust="#0f5c3a" alt="#093a25" /><Bokeh t={t} renk={YESIL} seed={5} />
      <Mutlak y={230}><Etiket fiyat="99,99" olcek={1.05} vurgu={0} /></Mutlak>
      <Mutlak y={760}><Yazi boy={170} renk={YESIL} g={sp(t, n("n4") + 0.9)}>90'LAR</Yazi></Mutlak>
      <Kisi t={t} mod="tam" x={840} y={1100} olcek={0.62} poz="goster" ayna ifade={{ bakX: -0.7, bakY: -0.6, kas: 0.5 }} bas0={n("n4")} />
    </>);
  } },
  // 6 — "yüz ise yüzlü": kırmızı yarı, ters yönden kayar
  { bas: n("n4") + 2.32, son: n("n5"), gecis: "kayTers", alt: (y) => (y < 0.45 ? 1720 : 1000), kam: [[0,240,1260,1.6],[0.55,540,820,1.08],[1.3,540,820,1.08]], render: (t) => (<>
      <Duz ust="#6e1a1a" alt="#3d0d0d" /><Bokeh t={t} renk={KIRMIZI} seed={7} />
      <Mutlak y={230}><Etiket fiyat="100" olcek={1.05} /></Mutlak>
      <Mutlak y={760}><Yazi boy={170} renk={KIRMIZI} g={sp(t, n("n4") + 2.55)}>100'LER</Yazi></Mutlak>
      <Kisi t={t} mod="tam" x={240} y={1100} olcek={0.62} poz="goster" ifade={{ bakX: 0.7, bakY: -0.6, kasAci: 0.3 }} bas0={n("n4") + 2.32} />
    </>) },
  // 7 — "fark bir kuruş, his büyük": terazi, yakın plan şaşkın Berkay
  { bas: n("n5"), son: n("n6"), gecis: "zoom", alt: (y) => (y < 2.1 ? 1060 : 300), kam: [[0,540,960,1],[0.85,760,560,1.65],[1.8,760,560,1.65],[2.3,540,1420,1.3],[2.7,540,1420,1.3]], render: (t) => {
    const egil = interpolate(t, [n("n5") + 0.9, n("n5") + 1.5], [0, 18], { ...kl, easing: Easing.out(Easing.back(2)) });
    const kefe = (x: number, dy: number, icerik: React.ReactNode) => (
      <g transform={`translate(${x},${330 + dy})`}>
        <line x1={0} y1={0} x2={-90} y2={170} stroke="#cfd6e6" strokeWidth={5} /><line x1={0} y1={0} x2={90} y2={170} stroke="#cfd6e6" strokeWidth={5} />
        <path d="M-130,170 Q0,240 130,170 Z" fill="#cfd6e6" />
        <foreignObject x={-150} y={60} width={300} height={130}>{icerik}</foreignObject>
      </g>
    );
    const dy = Math.sin((egil * Math.PI) / 180) * 280;
    return (<>
      <Duz ust="#123c55" alt="#0a2333" /><Izgara />
      <svg width={1080} height={1920} style={{ position: "absolute" }}>
        <rect x={530} y={300} width={20} height={600} fill="#8fa0bf" /><rect x={420} y={880} width={240} height={40} rx={12} fill="#8fa0bf" />
        <g transform={`rotate(${-egil} 540 320)`}><rect x={190} y={310} width={700} height={20} rx={10} fill="#cfd6e6" /></g>
        {kefe(540 - 330 * Math.cos((egil * Math.PI) / 180), dy, <div style={{ fontFamily: POP, fontWeight: 900, fontSize: 44, color: MAVI, textAlign: "center" }}>1 kuruş</div>)}
        {kefe(540 + 330 * Math.cos((egil * Math.PI) / 180), -dy, <div style={{ fontFamily: POP, fontWeight: 900, fontSize: 64, color: TURUNCU, textAlign: "center" }}>HİS</div>)}
      </svg>
      <Mutlak y={150}><Yazi boy={72} g={sp(t, n("n5"))}>FARK KÜÇÜK, <span style={{ color: TURUNCU }}>HİS BÜYÜK</span></Yazi></Mutlak>
      <Kisi t={t} mod="yakin" x={540} y={1280} olcek={1.35} ifade={{ kas: 1, goz: 1.1, bakY: -0.8 }} />
    </>);
  } },
  // 8 — "gerçekten işe yarıyor mu?": aşırı yakın plan, uçuşan soru işaretleri
  { bas: n("n6"), son: n("n7"), gecis: "zoom", alt: 300, kam: [[0,540,960,1],[0.4,540,880,1.28],[1.5,540,880,1.28],[2.0,540,960,1]], render: (t) => (<>
      <Duz ust="#2a1f4d" alt="#120d24" /><Bokeh t={t} renk={MOR} n={18} seed={9} />
      {[0, 1, 2, 3, 4].map((i) => {
        const g = sp(t, n("n6") + i * 0.18, 7);
        return <div key={i} style={{ position: "absolute", left: [120, 820, 200, 760, 470][i], top: [520, 470, 1500, 1450, 380][i] - Math.sin(t * 2 + i) * 20, fontFamily: POP, fontWeight: 900, fontSize: [160, 130, 110, 150, 90][i], color: [TURUNCU, "white", MOR, TURUNCU, "white"][i], transform: `scale(${g}) rotate(${(i - 2) * 12}deg)` }}>?</div>;
      })}
      <Kisi t={t} mod="yakin" x={540} y={620} olcek={2.4} ifade={{ kasAci: 0.6, bakX: 0.6, bakY: -0.6, egim: -5 }} />
    </>) },
  // 9 — "Amerika'da araştırmacılar": ofis/araştırma masası, Berkay sağda
  { bas: n("n7"), son: n("n8"), gecis: "kay", alt: 1720, kam: [[0,540,960,1],[0.9,400,860,1.55],[2.0,400,860,1.55],[2.5,830,1300,1.6],[3.4,830,1300,1.6]], render: (t) => {
    const k = (i: number) => sp(t, n("n7") + 0.3 + i * 0.15);
    return (<>
      <Duz ust="#e9eef7" alt="#cdd6e6" /><Izgara renk="rgba(30,40,70,0.07)" />
      <Mutlak y={170}><div style={{ fontFamily: POP, fontWeight: 900, fontSize: 64, color: "white", background: "#1b2a4a", borderRadius: 999, padding: "14px 44px", transform: `scale(${sp(t, n("n7"))})` }}>🇺🇸 ABD · SAHA DENEYİ</div></Mutlak>
      {[0, 1, 2].map((i) => (
        <div key={i} style={{ position: "absolute", left: 80 + i * 60, top: 420 + i * 40, width: 520, height: 640, background: "white", borderRadius: 20, boxShadow: "0 20px 50px rgba(20,30,60,0.25)", transform: `rotate(${(i - 1) * 6}deg) translateY(${(1 - k(i)) * 400}px)`, padding: 40 }}>
          <div style={{ height: 30, width: "70%", background: "#1b2a4a", borderRadius: 8, marginBottom: 26 }} />
          {[0, 1, 2, 3, 4, 5].map((j) => <div key={j} style={{ height: 16, width: `${90 - ((j * 17) % 35)}%`, background: "#c4cde0", borderRadius: 8, marginBottom: 18 }} />)}
          {i === 2 ? <div style={{ marginTop: 20, display: "flex", gap: 20, alignItems: "flex-end", height: 180 }}>{[90, 160, 110].map((h, j) => <div key={j} style={{ width: 90, height: h * sp(t, n("n7") + 1.2 + j * 0.1), background: j === 1 ? YESIL : "#8fa0bf", borderRadius: 10 }} />)}</div> : null}
        </div>
      ))}
      <Kisi t={t} mod="tam" x={830} y={1150} olcek={0.6} poz="anlat" ayna ifade={{ kas: 0.3 }} bas0={n("n7")} />
    </>);
  } },
  // 10 — "aynı ürünler, farklı fiyatlarla": katalog sayfaları açılır
  { bas: n("n8"), son: n("n9"), gecis: "kay", alt: 1300, kam: [[0,540,660,1.2],[0.9,540,660,1.2],[1.3,560,660,1.85],[2.0,560,660,1.85],[2.5,540,960,1]], render: (t) => (<>
      <Duz ust="#fbe3c8" alt="#f3c99a" />
      <Mutlak y={150}><Yazi boy={84} renk="#3a2410" g={sp(t, n("n8"))}>AYNI ÜRÜN · <span style={{ color: "#d9480f" }}>FARKLI FİYAT</span></Yazi></Mutlak>
      {[0, 1, 2].map((i) => {
        const g = sp(t, n("n8") + 0.2 + i * 0.28, 10);
        return (
          <div key={i} style={{ position: "absolute", left: 60 + i * 330, top: 420, width: 300, height: 470, background: "white", borderRadius: 22, boxShadow: "0 24px 60px rgba(90,50,10,0.3)", transform: `perspective(900px) rotateY(${(1 - g) * 90}deg) rotate(${(i - 1) * 3}deg)`, display: "flex", flexDirection: "column", alignItems: "center", paddingTop: 34, border: i === 1 ? `8px solid ${YESIL}` : "none" }}>
            <svg width={200} height={260} viewBox="0 0 130 170"><path d="M45,10 L85,10 L95,40 L120,160 L10,160 L35,40 Z" fill="#e46a6a" /><path d="M45,10 Q65,30 85,10" stroke="#fff" strokeWidth={5} fill="none" /></svg>
            <div style={{ fontFamily: POP, fontWeight: 900, fontSize: 64, color: i === 1 ? "#0f7a45" : "#1b1f2e", marginTop: 16 }}>{["…4", "…9", "…4"][i]}</div>
          </div>
        );
      })}
      <Kisi t={t} mod="yakin" x={240} y={1330} olcek={1.15} ifade={{ bakX: 0.6, bakY: -0.8, kas: 0.4 }} />
    </>) },
  // 11 — "üç deneyin üçünde de": skor tablosu, damgalar, konfeti
  { bas: n("n9"), son: n("n10"), gecis: "flas", alt: 1040, kam: [[0,540,560,1.3],[1.4,540,600,1.3],[1.9,540,960,1],[2.8,540,960,1]], render: (t) => (<>
      <Duz ust="#101a33" alt="#060b18" />
      <svg width={1080} height={1920} style={{ position: "absolute" }}>
        {Array.from({ length: 40 }).map((_, i) => {
          const b = n("n9") + 1.3, d = Math.max(0, t - b);
          if (d <= 0) return null;
          const x = 540 + Math.cos(i * 2.4) * (200 + (i % 7) * 60) * Math.min(1, d * 2), y = 700 + Math.sin(i * 1.7) * 300 * Math.min(1, d * 2) + d * d * 400;
          return <rect key={i} x={x} y={y} width={18} height={10} fill={[TURUNCU, YESIL, MAVI, "#FFD93D", KIRMIZI][i % 5]} transform={`rotate(${i * 40 + d * 300} ${x} ${y})`} />;
        })}
      </svg>
      <Mutlak y={240}>
        {[0, 1, 2].map((i) => {
          const g = sp(t, n("n9") + 0.1 + i * 0.47, 11), dam = sp(t, n("n9") + 0.35 + i * 0.47, 6);
          return (
            <div key={i} style={{ position: "relative", opacity: g, transform: `translateX(${(1 - g) * -300}px)`, width: 880, marginBottom: 34, display: "flex", justifyContent: "space-between", alignItems: "center", background: "#1c2a4f", borderRadius: 30, padding: "34px 48px" }}>
              <div style={{ fontFamily: POP, fontWeight: 800, fontSize: 64, color: "white" }}>Deney {i + 1}</div>
              <div style={{ fontFamily: POP, fontWeight: 900, fontSize: 64, color: YESIL, transform: `scale(${dam * 1.0}) rotate(${(1 - dam) * -40}deg)`, border: `6px solid ${YESIL}`, borderRadius: 18, padding: "0 22px" }}>…9 ✓</div>
            </div>
          );
        })}
      </Mutlak>
      <Kisi t={t} mod="tam" x={540} y={1200} olcek={0.56} poz="selam" ifade={{ gozGul: 0.6, kas: 0.5 }} bas0={n("n9") + 1.2} />
    </>) },
  // 12 — "indirimdeymiş gibi": alışveriş sepeti + etiket + yapıştırma, kamera sarsıntısı
  { bas: n("n10"), son: n("n11"), gecis: "kay", alt: (y) => (y < 2.0 ? 1150 : 1740), kam: [[0,540,960,1],[0.45,540,420,1.45],[0.75,790,320,1.7],[1.6,790,320,1.7],[2.2,820,1500,1.4],[3.0,820,1500,1.4]], render: (t) => {
    const st = sp(t, n("n10") + 0.64, 6);
    const sars = t > n("n10") + 0.64 && t < n("n10") + 0.9 ? Math.sin(t * 90) * 12 : 0;
    return (<div style={{ position: "absolute", inset: 0, transform: `translate(${sars}px,${-sars * 0.6}px)` }}>
      <Duz ust="#ff5a5a" alt="#b8232f" /><Bokeh t={t} renk="#ffffff" seed={11} />
      <svg width={1080} height={1920} style={{ position: "absolute" }}>
        <g transform="translate(300,560)">
          <path d="M0,0 L80,0 L140,300 L480,300 L530,90 L110,90" stroke="#1b1f2e" strokeWidth={22} fill="none" strokeLinejoin="round" strokeLinecap="round" />
          <circle cx={180} cy={360} r={34} fill="#1b1f2e" /><circle cx={440} cy={360} r={34} fill="#1b1f2e" />
          <rect x={160} y={30} width={110} height={120} rx={12} fill="#FFD93D" /><rect x={290} y={10} width={130} height={140} rx={12} fill="#4ECDC4" /><rect x={230} y={-40} width={90} height={90} rx={12} fill="#6C5CE7" />
        </g>
      </svg>
      <Mutlak y={160}><Etiket fiyat="99,99" olcek={0.95} /></Mutlak>
      <div style={{ position: "absolute", left: 640, top: 150, transform: `rotate(14deg) scale(${st})`, background: "#FFD93D", color: "#b8232f", fontFamily: POP, fontWeight: 900, fontSize: 64, borderRadius: 999, width: 300, height: 300, display: "flex", alignItems: "center", justifyContent: "center", textAlign: "center", lineHeight: 1, boxShadow: "0 18px 50px rgba(0,0,0,0.4)" }}>İNDİRİM<br />GİBİ!</div>
      <Kisi t={t} mod="yakin" x={820} y={1330} olcek={1.15} ayna ifade={{ gozGul: 0.4, kas: 0.4 }} />
    </div>);
  } },
  // 13 — "fiyat bir mesaj": siyah zemin tipografi, spot ışığı
  { bas: n("n11"), son: n("n12"), gecis: "zoom", alt: 1060, kam: [[0,540,500,1.6],[1.0,540,520,1.6],[1.6,540,960,1],[2.8,540,960,1]], render: (t) => {
    const harfler = "MESAJ".split("");
    return (<>
      <AbsoluteFill style={{ background: "radial-gradient(ellipse at 50% 75%, #2b2f45 0%, #07080d 60%)" }} />
      <Mutlak y={260}><Yazi boy={120} g={sp(t, n("n11"))}>FİYAT =</Yazi>
        <div style={{ display: "flex", marginTop: 10 }}>{harfler.map((h, i) => { const g = sp(t, n("n11") + 1.2 + i * 0.09, 8); return <span key={i} style={{ fontFamily: POP, fontWeight: 900, fontSize: 230, color: TURUNCU, display: "inline-block", transform: `translateY(${(1 - g) * 200}px) scale(${g})`, opacity: g }}>{h}</span>; })}</div>
      </Mutlak>
      <Kisi t={t} mod="tam" x={540} y={1180} olcek={0.6} poz="anlat" ifade={{ gozGul: 0.3, kas: 0.3 }} bas0={n("n11")} />
    </>);
  } },
  // 14 — çağrı: telefon ekranında profil + takip et, Berkay el sallar
  { bas: n("n12"), son: plan.bitis, gecis: "kay", alt: 1650, kam: [[0,540,960,1],[0.8,730,900,1.5],[1.9,730,900,1.5],[2.4,250,1300,1.5],[3.2,250,1300,1.5]], render: (t) => {
    const tik = (plan as any).takipTik as number, basma = interpolate(t, [tik - 0.08, tik, tik + 0.12], [1, 0.9, 1], kl), takip = t >= tik;
    const g = sp(t, n("n12"), 11);
    return (<>
      <Duz ust="#ff8a1f" alt="#ff5a1f" /><Izgara renk="rgba(255,255,255,0.1)" />
      <div style={{ position: "absolute", left: 470, top: 260, width: 520, height: 1040, background: "#0f1320", borderRadius: 70, border: "14px solid #1b1f2e", boxShadow: "0 40px 90px rgba(0,0,0,0.45)", transform: `translateY(${(1 - g) * 900}px) rotate(4deg)`, overflow: "hidden", display: "flex", flexDirection: "column", alignItems: "center", paddingTop: 110 }}>
        <div style={{ width: 200, height: 200, borderRadius: "50%", background: "linear-gradient(135deg,#ff8a1f,#b45aff)", padding: 8 }}><div style={{ width: "100%", height: "100%", borderRadius: "50%", background: "#232c4f", overflow: "hidden" }}>
          <svg width={184} height={184} viewBox="60 40 280 280"><BerkayBas ifade={{ agiz: "gulumse", gozGul: 0.3 }} govde={false} /></svg></div></div>
        <div style={{ fontFamily: POP, fontWeight: 800, fontSize: 40, color: "white", marginTop: 26, textAlign: "center", lineHeight: 1.15 }}>Alışverişin<br /><span style={{ color: TURUNCU }}>perde arkası</span></div>
        <div style={{ transform: `scale(${basma})`, marginTop: 40, fontFamily: POP, fontWeight: 900, fontSize: 44, color: takip ? "white" : "#1b1f2e", background: takip ? "#2a3350" : "white", borderRadius: 20, padding: "18px 60px" }}>{takip ? "✓ Takip" : "Takip et"}</div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 150px)", gap: 8, marginTop: 44 }}>{Array.from({ length: 6 }).map((_, i) => <div key={i} style={{ height: 150, background: ["#3c2752", "#0f5c3a", "#6e1a1a", "#123c55", "#2a1f4d", "#ff6a1f"][i], borderRadius: 8 }} />)}</div>
      </div>
      <Kisi t={t} mod="tam" x={250} y={1140} olcek={0.6} poz="selam" ifade={{ gozGul: 0.5, kas: 0.4 }} bas0={n("n12")} />
    </>);
  } },
];

// ---------- altyazı (çekime göre konum; yüzü kapatmaz) ----------
const VURGU = ["neden", "doksan", "dokuz", "beynin", "soldan", "doksanlı", "yüzlü", "kuruş", "his", "gerçekten", "test", "farklı", "üçünde", "dokuzla", "indirimdeymiş", "mesaj", "takip"];
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
