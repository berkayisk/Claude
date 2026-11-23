import React from "react";
import { AbsoluteFill, Img, interpolate, staticFile, Easing } from "remotion";
import { AhmetBas, AhmetArka, El, RENKLER, Ifade, Isik, kirp } from "./ahmet";
import "@fontsource/inter/400.css";
import "@fontsource/inter/500.css";
import "@fontsource/inter/600.css";
import "@fontsource/inter/700.css";
import "@fontsource/inter/800.css";
import "@fontsource/caveat/500.css";
import "@fontsource/caveat/700.css";

export const INTER = "'Inter', sans-serif";
const CAVEAT = "'Caveat', cursive";
export type Zaman = "gece" | "sabah";
const kl = { extrapolateLeft: "clamp" as const, extrapolateRight: "clamp" as const };
export const ara = (f: number, a: number[], b: number[], ease = Easing.inOut(Easing.cubic)) => interpolate(f, a, b, { ...kl, easing: ease });

const P = {
  gece: { duvar: "#1a2340", duvar2: "#121a31", zemin: "#141827", zemin2: "#0d1020", pencere: "#24406e", perde: "rgba(170,195,235,0.22)", masa: "#4a3a2c", masaUst: "#5d4936", kanepe: "#2a2f3e", minder: "#6b6152", kitap: ["#3a3550", "#2c4058", "#4a3a3a"], bitki: "#1f3a2e", lamba: "#ffb469", golge: 0.0 },
  sabah: { duvar: "#ead9c0", duvar2: "#dcc6a6", zemin: "#b78f66", zemin2: "#9c7752", pencere: "#fff3d6", perde: "rgba(255,250,235,0.55)", masa: "#b8936c", masaUst: "#cfa97f", kanepe: "#6d7383", minder: "#d9c8a8", kitap: ["#8a6d5a", "#4f6d7a", "#a65d4f"], bitki: "#3f7a52", lamba: "#ffd9a0", golge: 0.0 },
};

// ---------------- Ortak efektler ----------------
export const Gren: React.FC<{ f: number; guc?: number }> = ({ f, guc = 1 }) => (
  <AbsoluteFill style={{ backgroundImage: `url(${staticFile("gren.png")})`, backgroundPosition: `${(f * 137) % 1200}px ${(f * 251) % 1200}px`, opacity: 0.55 * guc, mixBlendMode: "overlay" }} />
);
export const Vinyet: React.FC<{ guc?: number }> = ({ guc = 1 }) => (
  <AbsoluteFill style={{ background: `radial-gradient(ellipse 75% 60% at 50% 48%, rgba(0,0,0,0) 55%, rgba(0,0,0,${0.55 * guc}) 100%)` }} />
);
const Bokeh: React.FC<{ noktalar: [number, number, number, string, number][] }> = ({ noktalar }) => (
  <>{noktalar.map(([x, y, r, c, o], i) => <circle key={i} cx={x} cy={y} r={r} fill={c} opacity={o} />)}</>
);

// ---------------- ODA (geniş planlar) ----------------
// Dünya koordinatı: x -300..2500, y -500..2500. Kamera: merkez (cx, cy) ve ölçek.
const Oda: React.FC<{ z: Zaman; f: number; ahmet: "kanepe" | "masa" | "yok"; laptopIsik: number; lambaAcik: boolean; kupa?: boolean; telefonIsik?: number }> = ({ z, f, ahmet, laptopIsik, lambaAcik, kupa, telefonIsik = 0 }) => {
  const c = P[z];
  const gece = z === "gece";
  const isikA: Isik = gece ? { renk: "#9cc4ff", yon: "alt", guc: 0.9 * telefonIsik + 0.2, ortam: 0.35 } : { renk: "#ffd18a", yon: "sol", guc: 0.8, ortam: 0 };
  return (
    <g>
      <defs>
        <linearGradient id="odaDuvar" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor={c.duvar2} /><stop offset="1" stopColor={c.duvar} /></linearGradient>
        <linearGradient id="odaZemin" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor={c.zemin2} /><stop offset="1" stopColor={c.zemin} /></linearGradient>
        <radialGradient id="lambaIsik" cx="0.5" cy="0.5" r="0.5"><stop offset="0" stopColor={c.lamba} stopOpacity={0.55} /><stop offset="1" stopColor={c.lamba} stopOpacity={0} /></radialGradient>
        <radialGradient id="ekranIsik" cx="0.5" cy="0.5" r="0.5"><stop offset="0" stopColor="#bcd6ff" stopOpacity={0.6} /><stop offset="1" stopColor="#bcd6ff" stopOpacity={0} /></radialGradient>
        <linearGradient id="gunes" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stopColor="#fff0c8" stopOpacity={0.55} /><stop offset="1" stopColor="#ffd88a" stopOpacity={0} /></linearGradient>
        <linearGradient id="ay" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stopColor="#8fb3ff" stopOpacity={0.16} /><stop offset="1" stopColor="#8fb3ff" stopOpacity={0} /></linearGradient>
        <linearGradient id="pencereCam" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor={gece ? "#132648" : "#fffaf0"} /><stop offset="1" stopColor={c.pencere} /></linearGradient>
      </defs>
      {/* duvar, tavan, zemin */}
      <rect x={-300} y={-500} width={2800} height={1750} fill="url(#odaDuvar)" />
      <rect x={-300} y={1250} width={2800} height={1250} fill="url(#odaZemin)" />
      <rect x={-300} y={1236} width={2800} height={18} fill={gece ? "#0e1222" : "#f3e6d2"} />
      {/* parke çizgileri */}
      {Array.from({ length: 14 }).map((_, i) => <line key={i} x1={-300 + i * 220} y1={1254} x2={-900 + i * 300} y2={2500} stroke="rgba(0,0,0,0.12)" strokeWidth={3} />)}
      {/* pencere */}
      <rect x={250} y={300} width={540} height={620} rx={6} fill={gece ? "#0d1426" : "#efe3cf"} />
      <rect x={272} y={322} width={496} height={576} fill="url(#pencereCam)" />
      {gece ? (
        <g opacity={0.9}>
          {/* uzak şehir */}
          <path d="M272,800 L320,800 L320,740 L360,740 L360,770 L420,770 L420,700 L470,700 L470,760 L540,760 L540,720 L590,720 L590,780 L650,780 L650,730 L700,730 L700,790 L768,790 L768,898 L272,898 Z" fill="#0b1630" />
          {[[300, 780], [340, 760], [440, 720], [450, 740], [560, 740], [610, 795], [670, 750], [720, 805], [490, 775]].map(([x, y], i) => <rect key={i} x={x} y={y} width={8} height={10} fill="#ffcf7a" opacity={0.6 + 0.3 * Math.sin(i + f / 30)} />)}
          <circle cx={660} cy={420} r={28} fill="#dfe8ff" opacity={0.75} />
        </g>
      ) : (
        <g><circle cx={380} cy={430} r={90} fill="#fff8e0" opacity={0.9} /><path d="M272,820 C400,780 600,800 768,760 L768,898 L272,898 Z" fill="#cfe0c0" opacity={0.6} /></g>
      )}
      <rect x={517} y={322} width={6} height={576} fill={gece ? "#0d1426" : "#efe3cf"} />
      <rect x={272} y={606} width={496} height={6} fill={gece ? "#0d1426" : "#efe3cf"} />
      {/* perdeler */}
      <path d={`M232,280 C250,500 220,700 245,940 L330,940 C315,700 340,500 320,280 Z`} fill={c.perde} />
      <path d={`M808,280 C790,500 820,700 795,940 L710,940 C725,700 700,500 720,280 Z`} fill={c.perde} />
      <rect x={210} y={270} width={620} height={10} rx={5} fill={gece ? "#0b1020" : "#a88b6a"} />
      {/* ay / güneş ışığı huzmesi */}
      <polygon points="272,322 768,322 1300,2000 520,2000" fill={gece ? "url(#ay)" : "url(#gunes)"} />
      {/* raf ve kitaplar */}
      <rect x={930} y={640} width={300} height={14} fill={c.masa} />
      {[0, 1, 2, 3, 4, 5].map((i) => <rect key={i} x={945 + i * 34} y={540 + (i % 3) * 12} width={26} height={100 - (i % 3) * 12} fill={c.kitap[i % 3]} />)}
      <rect x={930} y={880} width={300} height={14} fill={c.masa} />
      {/* bitki */}
      <path d="M80,1300 L170,1300 L158,1420 L92,1420 Z" fill={gece ? "#3a3030" : "#d7c3a5"} />
      {[-40, -20, 0, 20, 40, 60].map((a, i) => <ellipse key={i} cx={125 + a * 1.2} cy={1180 + Math.abs(a) * 0.8} rx={22} ry={70} fill={c.bitki} transform={`rotate(${a} ${125 + a * 1.2} ${1180 + Math.abs(a) * 0.8})`} />)}
      {/* masa */}
      <rect x={210} y={1070} width={640} height={34} rx={4} fill={c.masaUst} />
      <rect x={230} y={1104} width={24} height={330} fill={c.masa} />
      <rect x={806} y={1104} width={24} height={330} fill={c.masa} />
      <rect x={560} y={1104} width={270} height={120} fill={c.masa} />
      {/* lamba */}
      <g>
        <ellipse cx={300} cy={1068} rx={38} ry={8} fill="#111" />
        <path d="M300,1066 L330,930 L290,880" stroke="#151515" strokeWidth={9} fill="none" />
        <path d="M250,860 L330,850 L318,905 L262,912 Z" fill="#1a1a1a" />
        {lambaAcik ? <ellipse cx={292} cy={1000} rx={330} ry={260} fill="url(#lambaIsik)" /> : null}
      </g>
      {/* laptop (arkası) */}
      <g>
        <rect x={430} y={1060} width={200} height={10} rx={3} fill="#9a9ca3" />
        <path d="M445,1062 L455,940 L605,940 L615,1062 Z" fill={gece ? "#5f636c" : "#c6c8cf"} />
        {laptopIsik > 0 ? <ellipse cx={530} cy={980} rx={260} ry={220} fill="url(#ekranIsik)" opacity={laptopIsik} /> : null}
      </g>
      {kupa ? <g><rect x={700} y={1020} width={46} height={52} rx={6} fill="#f4f1ea" /><path d="M746,1032 C772,1034 772,1060 746,1062" stroke="#f4f1ea" strokeWidth={8} fill="none" /></g> : null}
      {/* Ahmet masada (arkadan) + sandalye */}
      {ahmet === "masa" ? (
        <g>
          <g transform="translate(395,850) scale(0.68)"><AhmetArka id="odaArka" isik={gece ? { renk: "#9cc4ff", yon: "on", guc: laptopIsik, ortam: 0.3 } : { renk: "#ffd18a", yon: "sol", guc: 0.8, ortam: 0 }} /></g>
          <rect x={448} y={1145} width={170} height={175} rx={26} fill="#121317" />
          <rect x={460} y={1157} width={146} height={150} rx={20} fill="#1c1e24" />
          {Array.from({ length: 7 }).map((_, i) => <line key={i} x1={462} y1={1170 + i * 20} x2={604} y2={1170 + i * 20} stroke="#2a2d35" strokeWidth={4} />)}
          <rect x={528} y={1320} width={12} height={110} fill="#101114" />
          <path d="M470,1440 L598,1440" stroke="#101114" strokeWidth={12} strokeLinecap="round" />
        </g>
      ) : (
        <g>
          <rect x={448} y={1170} width={170} height={150} rx={24} fill="#121317" />
          <rect x={528} y={1320} width={12} height={110} fill="#101114" />
          <path d="M470,1440 L598,1440" stroke="#101114" strokeWidth={12} strokeLinecap="round" />
        </g>
      )}
      {/* kanepe */}
      <g>
        <rect x={1360} y={960} width={720} height={220} rx={40} fill={c.kanepe} />
        <rect x={1320} y={1080} width={90} height={240} rx={34} fill={c.kanepe} />
        <rect x={2030} y={1080} width={90} height={240} rx={34} fill={c.kanepe} />
        <rect x={1400} y={1150} width={640} height={130} rx={26} fill={c.kanepe} />
        <rect x={1400} y={1150} width={640} height={130} rx={26} fill="rgba(0,0,0,0.18)" />
        <rect x={1890} y={1010} width={130} height={130} rx={24} fill={c.minder} transform="rotate(-8 1955 1075)" />
        <rect x={1380} y={1300} width={20} height={40} fill="#0c0c0c" /><rect x={2040} y={1300} width={20} height={40} fill="#0c0c0c" />
      </g>
      {ahmet === "kanepe" ? (
        <g>
          {/* bacaklar */}
          <path d="M1560,1240 L1780,1250 L1800,1300 L1760,1460 L1710,1460 L1720,1320 L1570,1300 Z" fill={RENKLER.pantolon} />
          <path d="M1600,1250 L1700,1255 L1650,1470 L1600,1470 Z" fill={RENKLER.pantolon} />
          <rect x={1590} y={1460} width={70} height={26} rx={10} fill="#e9e9e9" /><rect x={1705} y={1455} width={70} height={26} rx={10} fill="#e9e9e9" />
          {/* gövde */}
          <path d="M1530,1050 C1540,1000 1580,985 1640,980 C1700,985 1745,1000 1755,1050 L1770,1260 L1520,1260 Z" fill={RENKLER.tisort} />
          <g transform="translate(1528,800) scale(0.57)"><AhmetBas id="odaKanepe" isik={isikA} ifade={{ gozY: 0.9, gozX: 0.1 }} kirpma={kirp(f)} govde={false} /></g>
          {/* kollar + telefon */}
          <path d="M1550,1060 C1530,1150 1560,1180 1610,1150" stroke={RENKLER.tisort} strokeWidth={46} fill="none" strokeLinecap="round" />
          <path d="M1740,1060 C1760,1150 1720,1180 1680,1150" stroke={RENKLER.tisort} strokeWidth={46} fill="none" strokeLinecap="round" />
          <rect x={1620} y={1080} width={46} height={86} rx={8} fill="#0d0d10" transform="rotate(8 1643 1123)" />
          <rect x={1624} y={1086} width={38} height={74} rx={5} fill="#cfe1ff" opacity={0.85 * telefonIsik + 0.1} transform="rotate(8 1643 1123)" />
          <El x={1612} y={1170} aci={-10} olcek={0.48} renk={RENKLER.tenKoyu} />
          <El x={1676} y={1168} aci={14} olcek={0.48} ayna renk={RENKLER.tenKoyu} />
        </g>
      ) : null}
      {/* sehpa + halı */}
      <ellipse cx={1500} cy={1720} rx={800} ry={170} fill={gece ? "#1d2133" : "#cdb08a"} opacity={0.8} />
      <rect x={1420} y={1540} width={460} height={34} rx={8} fill={c.masaUst} />
      <rect x={1440} y={1574} width={18} height={150} fill={c.masa} /><rect x={1842} y={1574} width={18} height={150} fill={c.masa} />
      {/* gece genel karartma */}
      {gece ? <rect x={-300} y={-500} width={2800} height={3000} fill="#050816" opacity={0.28} /> : <rect x={-300} y={-500} width={2800} height={3000} fill="#ffb24d" opacity={0.06} />}
      {gece && lambaAcik ? <ellipse cx={300} cy={1050} rx={420} ry={330} fill="url(#lambaIsik)" opacity={0.6} /> : null}
    </g>
  );
};

export const OdaPlan: React.FC<{ z: Zaman; f: number; cx: number; cy: number; s: number; ahmet: "kanepe" | "masa" | "yok"; laptopIsik?: number; lambaAcik?: boolean; kupa?: boolean; telefonIsik?: number; karartma?: number; toz?: boolean }> = ({ z, f, cx, cy, s, ahmet, laptopIsik = 0, lambaAcik = true, kupa, telefonIsik = 0, karartma = 0, toz }) => (
  <AbsoluteFill style={{ background: "#000" }}>
    <svg width={1080} height={1920} viewBox="0 0 1080 1920">
      <g transform={`translate(540,960) scale(${s}) translate(${-cx},${-cy})`}>
        <Oda z={z} f={f} ahmet={ahmet} laptopIsik={laptopIsik} lambaAcik={lambaAcik} kupa={kupa} telefonIsik={telefonIsik} />
        {toz ? Array.from({ length: 40 }).map((_, i) => {
          const x = 300 + ((i * 97) % 700) + Math.sin(f / 40 + i) * 20, y = 400 + ((i * 173) % 1300) - (f * 0.6 + i * 13) % 200;
          return <circle key={i} cx={x + (y - 400) * 0.35} cy={y} r={2 + (i % 3)} fill="#fff4d0" opacity={0.35} />;
        }) : null}
      </g>
      <rect width={1080} height={1920} fill="#000" opacity={karartma} />
    </svg>
  </AbsoluteFill>
);

// ---------------- MASA ÖNDEN (orta planlar) ----------------
// Kamera pencere/duvar tarafından Ahmet'e bakar. Arka planda bulanık oda ve kanepe.
export const MasaOn: React.FC<{
  z: Zaman; f: number; zoom?: number; odakY?: number; laptopAcik?: number; ekranIsik?: number; ifade?: Ifade;
  telefon?: number; telefonIsik?: number; eller?: number; yaslan?: number; nefes?: number; beyaz?: number; lamba?: boolean; arkaBulanik?: number;
}> = ({ z, f, zoom = 1, odakY = 900, laptopAcik = 1, ekranIsik = 1, ifade = {}, telefon = 0, telefonIsik = 0, eller = 0, yaslan = 0, nefes = 0, beyaz = 0, lamba = true, arkaBulanik = 10 }) => {
  const c = P[z];
  const gece = z === "gece";
  const isik: Isik = gece
    ? { renk: telefonIsik > ekranIsik ? "#a9c8ff" : "#a8c6ff", yon: telefonIsik > ekranIsik ? "alt" : "on", guc: Math.max(ekranIsik, telefonIsik) * 1.1, ortam: 0.42 - 0.25 * Math.max(ekranIsik, telefonIsik) }
    : { renk: "#ffd59a", yon: "sol", guc: 0.9, ortam: 0 };
  const basY = 560 - yaslan * 40 + nefes * 6;
  const kirpma = kirp(f, 90, 20);
  return (
    <AbsoluteFill style={{ background: gece ? "#0a0e1c" : "#e8d6bb" }}>
      {/* arka plan: oda (bulanık) */}
      <AbsoluteFill style={{ filter: `blur(${arkaBulanik}px)`, transform: `scale(${zoom})`, transformOrigin: `540px ${odakY}px` }}>
        <svg width={1080} height={1920} viewBox="0 0 1080 1920">
          <rect width={1080} height={1920} fill={gece ? "#161d35" : "#e4cfae"} />
          <rect y={1180} width={1080} height={740} fill={gece ? "#0f1324" : "#b48c62"} />
          <rect x={560} y={760} width={620} height={300} rx={40} fill={c.kanepe} />
          <rect x={560} y={900} width={620} height={120} rx={30} fill={c.kanepe} opacity={0.8} />
          <rect x={980} y={800} width={110} height={110} rx={20} fill={c.minder} />
          <rect x={60} y={420} width={260} height={14} fill={c.masa} />
          {[0, 1, 2, 3].map((i) => <rect key={i} x={74 + i * 36} y={330} width={28} height={90} fill={c.kitap[i % 3]} />)}
          <rect x={-40} y={300} width={80} height={900} fill={gece ? "#101629" : "#f0e3cc"} />
          {gece ? <Bokeh noktalar={[[150, 600, 60, "#ffb469", 0.25], [900, 560, 40, "#9cc4ff", 0.18], [760, 1300, 90, "#ffb469", 0.08]]} /> : <Bokeh noktalar={[[150, 500, 120, "#fff2cf", 0.55], [930, 380, 90, "#fff2cf", 0.4]]} />}
        </svg>
      </AbsoluteFill>
      {/* Ahmet + masa (ön plan) */}
      <AbsoluteFill style={{ transform: `scale(${zoom})`, transformOrigin: `540px ${odakY}px` }}>
        <svg width={1080} height={1920} viewBox="0 0 1080 1920">
          <defs>
            <radialGradient id="moEkran" cx="0.5" cy="0.5" r="0.5"><stop offset="0" stopColor="#c4dbff" stopOpacity={0.5} /><stop offset="1" stopColor="#c4dbff" stopOpacity={0} /></radialGradient>
            <radialGradient id="moLamba" cx="0.5" cy="0.5" r="0.5"><stop offset="0" stopColor="#ffb469" stopOpacity={0.5} /><stop offset="1" stopColor="#ffb469" stopOpacity={0} /></radialGradient>
            <linearGradient id="moMasa" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor={c.masaUst} /><stop offset="1" stopColor={c.masa} /></linearGradient>
          </defs>
          {/* sandalye sırtı (arkada) */}
          <rect x={300} y={720} width={480} height={560} rx={70} fill="#15161b" />
          {/* gövde */}
          <path d={`M280,1500 L292,${990 - yaslan * 30} C306,${905 - yaslan * 30} 420,${880 - yaslan * 30} 540,${876 - yaslan * 30} C660,${880 - yaslan * 30} 774,${905 - yaslan * 30} 788,${990 - yaslan * 30} L800,1500 Z`} fill={RENKLER.tisort} />
          <path d={`M280,1500 L292,${990 - yaslan * 30} C306,${905 - yaslan * 30} 420,${880 - yaslan * 30} 540,${876 - yaslan * 30} L540,1500 Z`} fill={gece ? "#a8c6ff" : "#ffd59a"} opacity={gece ? 0.08 * ekranIsik : 0.12} />
          {/* baş */}
          <g transform={`translate(${540 - 200 * 1.3},${basY - 250}) scale(1.3)`}>
            <AhmetBas id="mo" isik={isik} ifade={ifade} kirpma={kirpma} govde={false} />
          </g>
          {/* eller yüze */}
          {eller > 0 ? (
            <g>
              <El x={ara(eller, [0, 1], [380, 470])} y={ara(eller, [0, 1], [1380, 880 - yaslan * 60])} aci={ara(eller, [0, 1], [-20, 8])} olcek={1.25} renk={RENKLER.ten} golge={gece ? 0.45 : 0.15} />
              <El x={ara(eller, [0, 1], [700, 610])} y={ara(eller, [0, 1], [1380, 880 - yaslan * 60])} aci={ara(eller, [0, 1], [20, -8])} olcek={1.25} ayna renk={RENKLER.ten} golge={gece ? 0.45 : 0.15} />
            </g>
          ) : null}
          {/* masa */}
          <rect x={-40} y={1370} width={1160} height={600} fill="url(#moMasa)" />
          <rect x={-40} y={1370} width={1160} height={10} fill="rgba(255,255,255,0.08)" />
          {/* kollar masada */}
          {eller < 0.05 && telefon < 0.05 ? (
            <g>
              <path d="M320,1120 C300,1280 340,1400 430,1430" stroke={RENKLER.tisort} strokeWidth={90} strokeLinecap="round" fill="none" />
              <path d="M760,1120 C780,1280 740,1400 650,1430" stroke={RENKLER.tisort} strokeWidth={90} strokeLinecap="round" fill="none" />
              <ellipse cx={470} cy={1440} rx={60} ry={34} fill={RENKLER.tenKoyu} />
              <ellipse cx={610} cy={1440} rx={60} ry={34} fill={RENKLER.tenKoyu} />
            </g>
          ) : null}
          {/* telefon elde */}
          {telefon > 0 ? (
            <g transform={`translate(0,${(1 - telefon) * 420})`}>
              <path d="M760,1200 C800,1320 740,1380 640,1330" stroke={RENKLER.tisort} strokeWidth={90} strokeLinecap="round" fill="none" />
              <rect x={540} y={1150} width={110} height={210} rx={18} fill="#0d0d10" transform="rotate(-12 595 1255)" />
              <rect x={549} y={1162} width={92} height={186} rx={12} fill="#cfe1ff" opacity={0.15 + 0.85 * telefonIsik} transform="rotate(-12 595 1255)" />
              <El x={620} y={1390} aci={-20} olcek={1.15} ayna renk={RENKLER.ten} golge={0.4} />
            </g>
          ) : null}
          {/* laptop kapağı (arkası, kameraya dönük) */}
          <g transform={`translate(540,1500) scale(1,${0.05 + 0.95 * laptopAcik}) translate(-540,-1500)`}>
            <path d="M330,1500 L350,1170 L730,1170 L750,1500 Z" fill={gece ? "#5c6069" : "#c9cbd2"} />
            <path d="M330,1500 L350,1170 L730,1170 L750,1500 Z" fill="url(#moEkran)" opacity={0} />
            <circle cx={540} cy={1330} r={22} fill={gece ? "#6d717b" : "#d9dbe2"} />
          </g>
          <rect x={300} y={1496} width={480} height={22} rx={6} fill="#8e9097" />
          {/* ekran ışığı halesi */}
          {/* lamba (sol kenar) */}
          {lamba ? (
            <g>
              <path d="M40,1372 L80,1180 L20,1100" stroke="#121212" strokeWidth={14} fill="none" />
              <path d="M-60,1060 L60,1050 L48,1130 L-50,1140 Z" fill="#191919" />
              {gece ? <ellipse cx={30} cy={1250} rx={420} ry={360} fill="url(#moLamba)" /> : null}
            </g>
          ) : null}
          {gece ? <rect width={1080} height={1920} fill="#040714" opacity={0.18} /> : <rect width={1080} height={1920} fill="#ffb24d" opacity={0.05} />}
        </svg>
      </AbsoluteFill>
      {beyaz > 0 ? <AbsoluteFill style={{ background: `radial-gradient(ellipse at 50% 72%, rgba(235,242,255,${beyaz}) 0%, rgba(235,242,255,${beyaz * 0.85}) ${30 + beyaz * 70}%, rgba(235,242,255,${beyaz * 0.6}) 100%)` }} /> : null}
    </AbsoluteFill>
  );
};

// ---------------- YÜZ YAKIN ----------------
export const YuzYakin: React.FC<{
  z: Zaman; f: number; olcek?: number; x?: number; y?: number; ifade?: Ifade; isik: Isik; yuzBulanik?: number; arkaBulanik?: number; arka: "masa" | "oda" | "sabah"; donus?: number; kupa?: number;
}> = ({ z, f, olcek = 2.4, x = 540, y = 1000, ifade, isik, yuzBulanik = 0, arkaBulanik = 14, arka, donus = 0, kupa = 0 }) => {
  const gece = z === "gece";
  return (
    <AbsoluteFill style={{ background: gece ? "#0b1020" : "#e9d5b5" }}>
      <AbsoluteFill style={{ filter: `blur(${arkaBulanik}px)` }}>
        <svg width={1080} height={1920} viewBox="0 0 1080 1920">
          {arka === "masa" ? (
            <g>
              <rect width={1080} height={1920} fill="#141b33" />
              <rect x={0} y={1180} width={1080} height={740} fill="#0f1220" />
              <rect x={60} y={1120} width={520} height={30} fill="#4a3a2c" />
              <path d="M180,1120 L195,900 L465,900 L480,1120 Z" fill="#5f636c" />
              <ellipse cx={330} cy={980} rx={240} ry={200} fill="#bcd6ff" opacity={0.25} />
              <circle cx={120} cy={900} r={90} fill="#ffb469" opacity={0.35} />
              <rect x={300} y={420} width={300} height={360} fill="#203a66" opacity={0.6} />
            </g>
          ) : arka === "oda" ? (
            <g>
              <rect width={1080} height={1920} fill="#151c35" />
              <circle cx={200} cy={700} r={110} fill="#ffb469" opacity={0.22} />
              <circle cx={880} cy={520} r={70} fill="#9cc4ff" opacity={0.16} />
              <rect x={600} y={1000} width={600} height={300} rx={40} fill="#232838" />
            </g>
          ) : (
            <g>
              <rect width={1080} height={1920} fill="#e6cfa8" />
              <circle cx={180} cy={520} r={220} fill="#fff6dc" opacity={0.8} />
              <circle cx={900} cy={420} r={120} fill="#fff1c8" opacity={0.5} />
              <rect x={0} y={1250} width={1080} height={700} fill="#c09466" />
              <ellipse cx={850} cy={1100} rx={140} ry={240} fill="#3f7a52" opacity={0.5} />
            </g>
          )}
        </svg>
      </AbsoluteFill>
      <AbsoluteFill style={{ filter: yuzBulanik > 0.2 ? `blur(${yuzBulanik}px)` : undefined }}>
        <svg width={1080} height={1920} viewBox="0 0 1080 1920">
          <g transform={`translate(${x},${y}) scale(${olcek}) rotate(${donus}) translate(-200,-230)`}>
            <AhmetBas id={`yz${z}`} isik={isik} ifade={ifade} kirpma={kirp(f, 80, 10)} />
          </g>
          {kupa > 0 ? (
            <g transform={`translate(0,${(1 - kupa) * 700})`}>
              <rect x={600} y={1350} width={300} height={360} rx={40} fill="#f3efe7" />
              <rect x={600} y={1350} width={300} height={360} rx={40} fill="url(#kupaGolge)" />
              <path d="M900,1430 C1010,1440 1010,1610 900,1620" stroke="#f3efe7" strokeWidth={44} fill="none" />
              <defs><linearGradient id="kupaGolge" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stopColor="#fff" stopOpacity={0.3} /><stop offset="1" stopColor="#8a6a44" stopOpacity={0.35} /></linearGradient></defs>
            </g>
          ) : null}
        </svg>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

// ---------------- TELEFON YAKIN (omuz üstü) ----------------
export const TelefonYakin: React.FC<{ f: number; ekran: React.ReactNode; kamY?: number }> = ({ f, ekran, kamY = 0 }) => {
  const nefes = Math.sin(f / 18) * 4;
  return (
    <AbsoluteFill style={{ background: "#0a0e1b" }}>
      <AbsoluteFill style={{ filter: "blur(16px)" }}>
        <svg width={1080} height={1920}>
          <rect width={1080} height={1920} fill="#121a30" />
          <circle cx={850} cy={500} r={140} fill="#ffb469" opacity={0.18} />
          <rect x={0} y={1300} width={1080} height={620} fill="#262b3a" />
          {/* omuz + kulak (ön planda bulanık) */}
          <path d="M-100,1920 L-100,1000 C40,900 180,880 260,960 L300,1920 Z" fill="#2c2f36" />
          <ellipse cx={120} cy={760} rx={60} ry={110} fill="#5b4033" />
        </svg>
      </AbsoluteFill>
      <AbsoluteFill style={{ transform: `translate(${nefes}px, ${nefes * 0.6 + kamY}px) rotate(-4deg)` }}>
        {/* telefon */}
        <div style={{ position: "absolute", left: 250, top: 330, width: 600, height: 1220, borderRadius: 84, background: "#0b0b0e", boxShadow: "0 0 160px rgba(160,195,255,0.35)" }}>
          <div style={{ position: "absolute", left: 22, top: 22, width: 556, height: 1176, borderRadius: 64, overflow: "hidden", background: "#0f0f12" }}>{ekran}</div>
          <div style={{ position: "absolute", left: 240, top: 40, width: 120, height: 34, borderRadius: 17, background: "#000" }} />
        </div>
        {/* el */}
        <svg width={1080} height={1920} style={{ position: "absolute", left: 0, top: 0 }}>
          <path d="M260,1900 C240,1650 230,1450 300,1300 L360,1290 C350,1450 380,1650 420,1900 Z" fill="#a87a60" />
          <path d="M840,1900 C880,1700 900,1450 860,1250 L800,1240 C790,1420 760,1650 700,1900 Z" fill="#b8866b" />
          <rect x={815} y={1000} width={58} height={190} rx={29} fill="#b8866b" transform="rotate(-8 844 1095)" />
          <rect x={826} y={1170} width={58} height={170} rx={29} fill="#ad7d63" transform="rotate(-6 855 1255)" />
          <rect x={820} y={1330} width={58} height={150} rx={29} fill="#a3765d" transform="rotate(-4 849 1405)" />
          <rect x={260} y={1180} width={64} height={250} rx={32} fill="#b8866b" transform="rotate(30 292 1305)" />
        </svg>
      </AbsoluteFill>
      <AbsoluteFill style={{ background: "radial-gradient(ellipse at 50% 45%, rgba(0,0,0,0) 40%, rgba(0,0,0,0.5) 100%)" }} />
    </AbsoluteFill>
  );
};

// Telefon ekranı: genel akış (marka yok) -> durduğu karede e-ticaret videosu
export const EkranAkis: React.FC<{ f: number; durma: number }> = ({ f, durma }) => {
  const kaydir = interpolate(f, [0, durma], [0, 1400], { ...kl, easing: Easing.out(Easing.cubic) });
  const kartlar = [
    { r: "#5a4a7a", b: "Hafta sonu kahvaltı tarifi", k: "@mutfaktayiz" },
    { r: "#2f6b5e", b: "Sahilde gün batımı", k: "@gezgin" },
    { r: "#7a5a3a", b: "Yeni telefon incelemesi", k: "@teknoloji" },
    { r: "#3a4f7a", b: "E-ticarete nasıl başlanır?", k: "@girisim", vurgu: true },
    { r: "#6b3a4a", b: "Antrenman programı", k: "@fit" },
  ];
  return (
    <div style={{ position: "absolute", inset: 0, background: "#111", fontFamily: INTER }}>
      <div style={{ position: "absolute", left: 0, right: 0, top: 70 - kaydir }}>
        {kartlar.map((k, i) => (
          <div key={i} style={{ height: 470, margin: "0 0 0 0", position: "relative", borderBottom: "6px solid #000" }}>
            <div style={{ position: "absolute", inset: 0, background: `linear-gradient(160deg, ${k.r} 0%, #111 100%)` }} />
            {k.vurgu ? (
              <>
                <div style={{ position: "absolute", left: 40, top: 120, right: 40, fontWeight: 800, fontSize: 56, color: "white", lineHeight: 1.05 }}>E-ticarete<br />nasıl başlanır?</div>
                <div style={{ position: "absolute", left: 230, top: 290, width: 96, height: 96, borderRadius: 48, background: "rgba(255,255,255,0.9)" }}>
                  <div style={{ position: "absolute", left: 38, top: 26, width: 0, height: 0, borderLeft: "32px solid #222", borderTop: "22px solid transparent", borderBottom: "22px solid transparent" }} />
                </div>
              </>
            ) : null}
            <div style={{ position: "absolute", left: 30, bottom: 26, display: "flex", alignItems: "center", gap: 14 }}>
              <div style={{ width: 44, height: 44, borderRadius: 22, background: "#ddd" }} />
              <div style={{ color: "white", fontWeight: 600, fontSize: 24 }}>{k.k}</div>
            </div>
            {!k.vurgu ? <div style={{ position: "absolute", left: 30, bottom: 90, color: "rgba(255,255,255,0.85)", fontSize: 26, fontWeight: 500 }}>{k.b}</div> : null}
          </div>
        ))}
      </div>
      <div style={{ position: "absolute", left: 0, right: 0, top: 0, height: 70, background: "#111", color: "white", fontSize: 22, fontWeight: 600, display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 44px" }}>
        <span>21:47</span><span>●●● ▮</span>
      </div>
    </div>
  );
};

// Telefon ekranı: Sıfırdan Satışa içeriği (markanın ilk görünümü)
export const EkranMarka: React.FC<{ f: number; durma: number }> = ({ f, durma }) => {
  const kaydir = interpolate(f, [0, durma], [600, 0], { ...kl, easing: Easing.out(Easing.cubic) });
  return (
    <div style={{ position: "absolute", inset: 0, background: "#111", fontFamily: INTER }}>
      <div style={{ position: "absolute", left: 0, right: 0, top: 70 + kaydir - 600 }}>
        <div style={{ height: 600, background: "linear-gradient(160deg, #4a3f35 0%, #111 100%)" }} />
        <div style={{ height: 1106, position: "relative", background: "linear-gradient(170deg, #0b1a33 0%, #021a3b 60%, #000 100%)" }}>
          <div style={{ position: "absolute", left: 30, top: 30, display: "flex", alignItems: "center", gap: 16 }}>
            <Img src={staticFile("berkay-isik-profil.png")} style={{ width: 64, height: 64, borderRadius: 32, objectFit: "cover", border: "3px solid #F67102" }} />
            <div style={{ color: "white", fontWeight: 700, fontSize: 28 }}>sifirdansatisa</div>
          </div>
          <div style={{ position: "absolute", left: 40, right: 40, top: 300, textAlign: "center" }}>
            <div style={{ color: "white", fontWeight: 800, fontSize: 70, lineHeight: 1.0, letterSpacing: -2 }}>ŞİRKETSİZ</div>
            <div style={{ color: "white", fontWeight: 800, fontSize: 70, lineHeight: 1.0, letterSpacing: -2 }}>& STOKSUZ</div>
            <div style={{ display: "inline-block", marginTop: 22, background: "#F67102", color: "white", fontWeight: 800, fontStyle: "italic", fontSize: 54, padding: "6px 24px", borderRadius: 14, transform: "rotate(-2deg)" }}>E-TİCARET</div>
          </div>
          <div style={{ position: "absolute", left: 40, right: 40, top: 720, color: "rgba(255,255,255,0.8)", fontSize: 28, textAlign: "center", lineHeight: 1.35 }}>Kendi ürünün olmadan,<br />stok tutmadan başlamanın yolları</div>
          <div style={{ position: "absolute", left: 30, right: 30, bottom: 40, height: 8, borderRadius: 4, background: "rgba(255,255,255,0.2)" }}>
            <div style={{ width: `${Math.min(100, Math.max(0, (f - durma) * 1.2))}%`, height: 8, borderRadius: 4, background: "#F67102" }} />
          </div>
        </div>
      </div>
      <div style={{ position: "absolute", left: 0, right: 0, top: 0, height: 70, background: "#111", color: "white", fontSize: 22, fontWeight: 600, display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 44px" }}>
        <span>23:18</span><span>●●● ▮</span>
      </div>
    </div>
  );
};

// ---------------- LAPTOP OMUZ ÜSTÜ ----------------
export const LaptopYakin: React.FC<{ z: Zaman; f: number; ekran: React.ReactNode; kayma?: number }> = ({ z, f, ekran, kayma = 0 }) => {
  const gece = z === "gece";
  return (
    <AbsoluteFill style={{ background: gece ? "#0a0e1b" : "#e7d3b2" }}>
      <AbsoluteFill style={{ transform: `translateX(${kayma}px)` }}>
        {/* ekran */}
        <div style={{ position: "absolute", left: 60, top: 520, width: 1100, height: 720, borderRadius: 26, background: "#1a1b1f", transform: "perspective(1800px) rotateY(-14deg)", transformOrigin: "0% 50%", boxShadow: gece ? "0 0 220px rgba(160,195,255,0.35)" : "0 30px 80px rgba(80,50,20,0.35)" }}>
          <div style={{ position: "absolute", left: 22, top: 22, right: 22, bottom: 22, borderRadius: 10, overflow: "hidden", background: "#fff" }}>{ekran}</div>
        </div>
        {/* klavye tabanı */}
        <div style={{ position: "absolute", left: 20, top: 1270, width: 1200, height: 220, background: gece ? "#4c4f57" : "#c3c5cc", borderRadius: "0 0 30px 30px", transform: "perspective(900px) rotateX(55deg) rotateY(-10deg)", transformOrigin: "50% 0%" }} />
        {/* masa */}
        <div style={{ position: "absolute", left: -100, top: 1390, width: 1400, height: 600, background: gece ? "#3e3125" : "#c49d74" }} />
        {/* el trackpad'de */}
        <svg width={1080} height={1920} style={{ position: "absolute", left: 0, top: 0 }}>
          <g transform={`translate(${640 + Math.sin(f / 9) * 14},${1560 + Math.cos(f / 11) * 6})`}>
            <path d="M-80,400 C-90,250 -70,120 -20,40 L60,40 C90,120 110,250 120,400 Z" fill={gece ? "#7d5a47" : "#b8866b"} />
            {[-14, 8, 30, 52].map((px, i) => <rect key={i} x={px - 11} y={-30 + Math.abs(i - 1.5) * 10} width={22} height={90} rx={11} fill={gece ? "#7d5a47" : "#b8866b"} />)}
          </g>
        </svg>
      </AbsoluteFill>
      {/* omuz (ön planda, bulanık) */}
      <AbsoluteFill style={{ filter: "blur(18px)" }}>
        <svg width={1080} height={1920}>
          <path d="M680,1920 C700,1500 820,1300 1000,1250 L1200,1240 L1200,1920 Z" fill={RENKLER.tisort} />
          <path d="M880,1260 C900,1100 960,980 1080,960 L1200,960 L1200,1260 Z" fill={RENKLER.sac} />
        </svg>
      </AbsoluteFill>
      {gece ? <AbsoluteFill style={{ background: "radial-gradient(ellipse at 40% 45%, rgba(0,0,0,0) 35%, rgba(0,0,0,0.6) 100%)" }} /> : <AbsoluteFill style={{ background: "linear-gradient(120deg, rgba(255,230,170,0.25) 0%, rgba(0,0,0,0) 50%)" }} />}
    </AbsoluteFill>
  );
};

const Tarayici: React.FC<{ sekmeler: string[]; aktif: number; children: React.ReactNode }> = ({ sekmeler, aktif, children }) => (
  <div style={{ position: "absolute", inset: 0, fontFamily: INTER, background: "#f4f5f7" }}>
    <div style={{ height: 64, background: "#dfe2e7", display: "flex", alignItems: "flex-end", padding: "0 14px", gap: 6 }}>
      {sekmeler.map((s, i) => (
        <div key={i} style={{ height: 48, padding: "0 20px", display: "flex", alignItems: "center", fontSize: 22, fontWeight: 600, color: i === aktif ? "#111" : "#666", background: i === aktif ? "#f4f5f7" : "transparent", borderRadius: "12px 12px 0 0", whiteSpace: "nowrap" }}>{s}</div>
      ))}
    </div>
    <div style={{ height: 50, background: "#f4f5f7", display: "flex", alignItems: "center", padding: "0 24px" }}>
      <div style={{ flex: 1, height: 34, borderRadius: 17, background: "#e6e8ec" }} />
    </div>
    <div style={{ position: "absolute", left: 0, right: 0, top: 114, bottom: 0, padding: 34 }}>{children}</div>
  </div>
);
export const EkranArastirma: React.FC<{ f: number }> = ({ f }) => {
  const sekmeler = ["Ürün seçimi", "Tedarikçi bulma", "Şirket kuruluşu", "Stok ve kargo"];
  const aktif = Math.min(3, Math.floor(f / 18));
  return (
    <Tarayici sekmeler={sekmeler} aktif={aktif}>
      <div style={{ fontSize: 44, fontWeight: 800, color: "#1a1a1a", marginBottom: 20 }}>{sekmeler[aktif]}</div>
      {[0.95, 0.8, 0.88, 0.6, 0.9, 0.7].map((w, i) => <div key={i} style={{ height: 18, width: `${w * 100}%`, borderRadius: 9, background: "#d4d7dd", marginBottom: 16 }} />)}
      <div style={{ display: "flex", gap: 18, marginTop: 20 }}>{[0, 1, 2].map((i) => <div key={i} style={{ flex: 1, height: 150, borderRadius: 14, background: "#e3e6eb" }} />)}</div>
    </Tarayici>
  );
};
export const EkranKurulum: React.FC<{ f: number }> = ({ f }) => {
  const adimlar = ["İş modelini öğren", "Mağaza alan adı", "Tema ve sayfalar", "İlk ürünleri seç"];
  return (
    <Tarayici sekmeler={["Mağaza kurulumu"]} aktif={0}>
      <div style={{ fontSize: 44, fontWeight: 800, color: "#1a1a1a", marginBottom: 26 }}>Mağaza kurulum adımları</div>
      {adimlar.map((a, i) => {
        const isaret = i < 2 && f > 14 + i * 26;
        return (
          <div key={i} style={{ display: "flex", alignItems: "center", gap: 20, padding: "18px 22px", marginBottom: 14, borderRadius: 14, background: "white", boxShadow: "0 2px 8px rgba(0,0,0,0.06)" }}>
            <div style={{ width: 38, height: 38, borderRadius: 10, border: `3px solid ${isaret ? "#2ED47A" : "#c7cbd2"}`, background: isaret ? "#2ED47A" : "white", color: "white", fontSize: 26, fontWeight: 800, display: "flex", alignItems: "center", justifyContent: "center" }}>{isaret ? "✓" : ""}</div>
            <div style={{ fontSize: 30, fontWeight: 600, color: "#222" }}>{a}</div>
          </div>
        );
      })}
    </Tarayici>
  );
};

// ---------------- DEFTER (tepe açı) ----------------
export const Defter: React.FC<{ z: Zaman; f: number; satirlar: { metin: string; bas: number; son: number; boyut?: number }[] }> = ({ z, f, satirlar }) => {
  const gece = z === "gece";
  // kalem ucu: o an yazılan satırın sonuna yakın
  const aktif = satirlar.find((s) => f >= s.bas && f < s.son) ?? satirlar.filter((s) => f >= s.son).slice(-1)[0] ?? satirlar[0];
  const ilerleme = interpolate(f, [aktif.bas, aktif.son], [0, 1], kl);
  const ai = satirlar.indexOf(aktif);
  const kalemX = 250 + ilerleme * Math.min(560, aktif.metin.length * 26) + Math.sin(f * 1.7) * 6;
  const kalemY = 640 + ai * 120 + Math.cos(f * 2.1) * 4;
  return (
    <AbsoluteFill style={{ background: gece ? "#3a2d22" : "#c9a27a" }}>
      <svg width={1080} height={1920} style={{ position: "absolute" }}>
        <defs>
          <radialGradient id="dfIsik" cx="0.3" cy="0.3" r="0.8"><stop offset="0" stopColor={gece ? "#ffbf7a" : "#fff3d0"} stopOpacity={gece ? 0.35 : 0.5} /><stop offset="1" stopColor="#000" stopOpacity={gece ? 0.55 : 0.1} /></radialGradient>
        </defs>
        {Array.from({ length: 12 }).map((_, i) => <line key={i} x1={0} y1={i * 170 + 40} x2={1080} y2={i * 170 + 70} stroke="rgba(0,0,0,0.08)" strokeWidth={6} />)}
        {/* defter */}
        <g transform="rotate(-6 540 960)">
          <rect x={150} y={360} width={800} height={1200} rx={10} fill="#f6f3ea" />
          {Array.from({ length: 10 }).map((_, i) => <line key={i} x1={170} y1={560 + i * 120} x2={930} y2={560 + i * 120} stroke="#b8c6dc" strokeWidth={2.5} />)}
          <line x1={230} y1={360} x2={230} y2={1560} stroke="#e6a3a3" strokeWidth={2.5} />
          {Array.from({ length: 14 }).map((_, i) => <circle key={i} cx={150} cy={400 + i * 84} r={14} fill="none" stroke="#777" strokeWidth={6} />)}
        </g>
        <rect width={1080} height={1920} fill="url(#dfIsik)" />
      </svg>
      {/* el yazısı */}
      <div style={{ position: "absolute", inset: 0, transform: "rotate(-6deg)", transformOrigin: "540px 960px" }}>
        {satirlar.map((s, i) => {
          const p = interpolate(f, [s.bas, s.son], [0, 1], kl);
          return (
            <div key={i} style={{ position: "absolute", left: 250, top: 560 + i * 120, height: 110, width: 680, overflow: "hidden", clipPath: `inset(0 ${100 - p * 100}% 0 0)` }}>
              <div style={{ fontFamily: CAVEAT, fontWeight: 600, fontSize: s.boyut ?? 74, color: "#1f2a44", whiteSpace: "nowrap", lineHeight: "110px" }}>{s.metin}</div>
            </div>
          );
        })}
      </div>
      {/* el + kalem */}
      <svg width={1080} height={1920} style={{ position: "absolute" }}>
        <g transform={`rotate(-6 540 960) translate(${kalemX},${kalemY})`}>
          <rect x={-6} y={-150} width={18} height={260} rx={8} fill="#141414" transform="rotate(28)" />
          <path d="M20,30 C60,0 160,20 230,90 L320,260 C280,330 160,330 90,270 C40,220 10,120 20,30 Z" fill={gece ? "#8a644f" : "#b8866b"} />
          <path d="M20,30 C60,0 160,20 230,90 L320,260 C280,330 160,330 90,270 C40,220 10,120 20,30 Z" fill="#000" opacity={gece ? 0.3 : 0.08} />
          <rect x={200} y={230} width={400} height={170} rx={60} fill={RENKLER.tisort} transform="rotate(35 200 230)" />
        </g>
      </svg>
      <Vinyet guc={gece ? 1.2 : 0.5} />
    </AbsoluteFill>
  );
};
