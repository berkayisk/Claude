import React from "react";
import { AbsoluteFill, Img, staticFile } from "remotion";

// Mağazanolsun yaka kartı — sade, net, canlı. Renkler eski karttan örneklendi.
const R = { magenta: "#C90051", koyu: "#A30456", mor: "#960258", pembe: "#FF2D55", turkuaz: "#50B1C2", lila: "#8687C7", metin: "#1A1530" };
const POP = "'PoppinsF', sans-serif";
const Font: React.FC = () => (
  <style>{`
    @font-face { font-family: 'PoppinsF'; font-weight: 600; src: url(${staticFile("fonts/Poppins-SemiBold.ttf")}); }
    @font-face { font-family: 'PoppinsF'; font-weight: 800; src: url(${staticFile("fonts/Poppins-ExtraBold.ttf")}); }
    @font-face { font-family: 'PoppinsF'; font-weight: 900; src: url(${staticFile("fonts/Poppins-Black.ttf")}); }
  `}</style>
);

export const YakaKarti: React.FC<{ ad: string; unvan: string; foto: string }> = ({ ad, unvan, foto }) => {
  const W = 1252, H = 1724;
  const D = 640, cx = W / 2, cy = 905;   // fotoğraf dairesi
  return (
    <AbsoluteFill style={{ background: "#ffffff" }}>
      <Font />
      {/* üst bant: canlı degrade + yumuşak dalga kenar */}
      <svg width={W} height={H} style={{ position: "absolute" }}>
        <defs>
          <linearGradient id="bant" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stopColor={R.mor} /><stop offset="0.55" stopColor={R.magenta} /><stop offset="1" stopColor={R.pembe} /></linearGradient>
          <linearGradient id="halka" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stopColor={R.turkuaz} /><stop offset="0.5" stopColor={R.lila} /><stop offset="1" stopColor={R.magenta} /></linearGradient>
          <radialGradient id="daire" cx="0.5" cy="0.35" r="0.75"><stop offset="0" stopColor={R.pembe} /><stop offset="1" stopColor={R.koyu} /></radialGradient>
          <clipPath id="foto"><path d={`M${cx - D / 2},${cy} A${D / 2},${D / 2} 0 0 0 ${cx + D / 2},${cy} L${cx + D / 2},0 L${cx - D / 2},0 Z`} /></clipPath>
        </defs>
        <path d={`M0,0 L${W},0 L${W},500 C${W * 0.72},585 ${W * 0.3},430 0,520 Z`} fill="url(#bant)" />
        {/* hafif dekor halkalar */}
        <circle cx={W - 80} cy={90} r={190} fill="none" stroke="#ffffff" strokeOpacity={0.10} strokeWidth={36} />
        <circle cx={70} cy={430} r={120} fill="#ffffff" fillOpacity={0.06} />
        {/* fotoğraf dairesi + degrade halka */}
        <circle cx={cx} cy={cy} r={D / 2 + 22} fill="url(#halka)" />
        <circle cx={cx} cy={cy} r={D / 2 + 8} fill="#ffffff" />
        <circle cx={cx} cy={cy} r={D / 2} fill="url(#daire)" />
        {/* alt bant */}
        <path d={`M0,${H} L${W},${H} L${W},${H - 120} C${W * 0.7},${H - 70} ${W * 0.3},${H - 170} 0,${H - 110} Z`} fill="url(#bant)" />
      </svg>
      {/* kişi: alt yarısı daireye kırpılır, baş dairenin üstüne taşar */}
      <svg width={W} height={H} style={{ position: "absolute" }}>
        <g clipPath="url(#foto)">
          <image href={staticFile(foto)} x={cx - 360} y={cy - D / 2 - 100} width={720} height={845} preserveAspectRatio="xMidYMid meet" />
        </g>
      </svg>
      {/* logo */}
      <div style={{ position: "absolute", top: 175, width: W, display: "flex", justifyContent: "center" }}>
        <Img src={staticFile("logo_beyaz.png")} style={{ width: 760 }} />
      </div>
      {/* ad + unvan */}
      <div style={{ position: "absolute", top: cy + D / 2 + 70, width: W, textAlign: "center" }}>
        <div style={{ fontFamily: POP, fontWeight: 900, fontSize: 96, color: R.metin, letterSpacing: 2, lineHeight: 1 }}>{ad}</div>
        <div style={{ display: "inline-block", marginTop: 30, background: R.magenta, color: "white", fontFamily: POP, fontWeight: 600, fontSize: 46, borderRadius: 999, padding: "12px 44px", letterSpacing: 1 }}>{unvan}</div>
      </div>
    </AbsoluteFill>
  );
};

// B — Koyu, iddialı: tam degrade zemin, dev M filigranı, kemer çerçeve, sola dayalı iki satır isim
export const YakaKartiB: React.FC<{ ad: string; unvan: string; foto: string }> = ({ ad, unvan, foto }) => {
  const W = 1252, H = 1724;
  const [ilk, ...son] = ad.split(" ");
  const ax = 186, ay = 470, aw = 880, ah = 760; // kemer çerçeve
  const kemer = `M${ax},${ay + ah} L${ax},${ay + aw / 2} A${aw / 2},${aw / 2} 0 0 1 ${ax + aw},${ay + aw / 2} L${ax + aw},${ay + ah} Z`;
  return (
    <AbsoluteFill style={{ background: `linear-gradient(160deg, ${R.mor} 0%, ${R.magenta} 55%, ${R.pembe} 100%)` }}>
      <Font />
      <svg width={W} height={H} style={{ position: "absolute" }}>
        <defs>
          <linearGradient id="bHalka" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stopColor={R.turkuaz} /><stop offset="1" stopColor={R.lila} /></linearGradient>
          <clipPath id="bKemer"><rect x={ax} y={0} width={aw} height={ay + ah} /></clipPath>
        </defs>
        {/* dev M filigranı (logodaki M çizgisinden esinli, çizgi) */}
        <path d="M120,1650 L120,980 C120,860 260,830 330,920 L626,1250 L922,920 C992,830 1132,860 1132,980 L1132,1650" fill="none" stroke="#ffffff" strokeOpacity={0.08} strokeWidth={120} strokeLinecap="round" strokeLinejoin="round" />
        <path d={kemer} fill="#ffffff" fillOpacity={0.12} />
        <path d={kemer} fill="none" stroke="url(#bHalka)" strokeWidth={14} transform="translate(-22,22)" />
        <g clipPath="url(#bKemer)"><image href={staticFile(foto)} x={ax + aw / 2 - 470} y={ay - 150} width={940} height={1103} preserveAspectRatio="xMidYMid meet" /></g>
        <rect x={ax} y={ay + ah} width={aw} height={6} fill="#ffffff" fillOpacity={0.5} />
      </svg>
      <div style={{ position: "absolute", top: 120, left: 120 }}><Img src={staticFile("logo_beyaz.png")} style={{ width: 560 }} /></div>
      <div style={{ position: "absolute", top: ay + ah + 70, left: ax, fontFamily: POP, color: "white", lineHeight: 0.98 }}>
        <div style={{ fontWeight: 600, fontSize: 70, letterSpacing: 6, opacity: 0.92 }}>{ilk}</div>
        <div style={{ fontWeight: 900, fontSize: 128, letterSpacing: 1 }}>{son.join(" ")}</div>
        <div style={{ marginTop: 26, display: "flex", alignItems: "center", gap: 18 }}>
          <div style={{ width: 70, height: 8, borderRadius: 4, background: R.turkuaz }} />
          <div style={{ fontWeight: 600, fontSize: 46, color: "#d9fbff" }}>{unvan}</div>
        </div>
      </div>
    </AbsoluteFill>
  );
};

// C — Ferah, oyunbaz: beyaz zemin, solda dikey renk şeridi + dikey logo, organik leke önünde kişi, renkli şekiller
export const YakaKartiC: React.FC<{ ad: string; unvan: string; foto: string }> = ({ ad, unvan, foto }) => {
  const W = 1252, H = 1724;
  const [ilk, ...son] = ad.split(" ");
  return (
    <AbsoluteFill style={{ background: "#ffffff" }}>
      <Font />
      <svg width={W} height={H} style={{ position: "absolute" }}>
        <defs>
          <linearGradient id="cSerit" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor={R.mor} /><stop offset="0.6" stopColor={R.magenta} /><stop offset="1" stopColor={R.pembe} /></linearGradient>
          <linearGradient id="cLeke" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stopColor={R.pembe} /><stop offset="1" stopColor={R.magenta} /></linearGradient>
          <clipPath id="cAlt"><rect x={0} y={0} width={W} height={1170} /></clipPath>
        </defs>
        <rect x={0} y={0} width={210} height={H} fill="url(#cSerit)" />
        {/* organik leke */}
        <path d="M720,330 C930,300 1150,430 1140,650 C1132,860 1010,1060 800,1120 C560,1190 330,1100 300,880 C270,660 420,370 720,330 Z" fill="url(#cLeke)" />
        {/* oyunbaz şekiller */}
        <circle cx={1110} cy={300} r={58} fill={R.turkuaz} />
        <circle cx={330} cy={430} r={26} fill={R.lila} />
        <rect x={1060} y={1030} width={90} height={90} rx={20} fill={R.lila} transform="rotate(18 1105 1075)" />
        <path d="M300,1110 l40,-70 l40,70 Z" fill={R.turkuaz} />
        {Array.from({ length: 16 }).map((_, i) => <circle key={i} cx={980 + (i % 4) * 34} cy={470 + Math.floor(i / 4) * 34} r={7} fill="#ffffff" fillOpacity={0.7} />)}
        <g clipPath="url(#cAlt)"><image href={staticFile(foto)} x={300} y={270} width={840} height={986} preserveAspectRatio="xMidYMid meet" /></g>
        <rect x={300} y={1166} width={850} height={8} rx={4} fill={R.metin} />
      </svg>
      {/* dikey logo */}
      <div style={{ position: "absolute", left: 105, top: H / 2, transform: "translate(-50%,-50%) rotate(-90deg)", transformOrigin: "50% 50%" }}><Img src={staticFile("logo_beyaz.png")} style={{ width: 1100 }} /></div>
      <div style={{ position: "absolute", top: 1230, left: 300, right: 90, fontFamily: POP, lineHeight: 0.95 }}>
        <div style={{ fontWeight: 900, fontSize: 132, color: R.magenta }}>{ilk}</div>
        <div style={{ fontWeight: 900, fontSize: 132, color: R.metin }}>{son.join(" ")}</div>
        <div style={{ marginTop: 26, fontWeight: 600, fontSize: 48, color: "#5b5370", letterSpacing: 1 }}>{unvan} <span style={{ color: R.turkuaz }}>●</span></div>
      </div>
    </AbsoluteFill>
  );
};

// ---- A'nın görsel dili, farklı yerleşimler ----
const Tanimlar: React.FC<{ p: string; cx: number; cy: number; D: number }> = ({ p, cx, cy, D }) => (
  <defs>
    <linearGradient id={`${p}bant`} x1="0" y1="0" x2="1" y2="1"><stop offset="0" stopColor={R.mor} /><stop offset="0.55" stopColor={R.magenta} /><stop offset="1" stopColor={R.pembe} /></linearGradient>
    <linearGradient id={`${p}halka`} x1="0" y1="0" x2="1" y2="1"><stop offset="0" stopColor={R.turkuaz} /><stop offset="0.5" stopColor={R.lila} /><stop offset="1" stopColor={R.magenta} /></linearGradient>
    <radialGradient id={`${p}daire`} cx="0.5" cy="0.35" r="0.75"><stop offset="0" stopColor={R.pembe} /><stop offset="1" stopColor={R.koyu} /></radialGradient>
    <clipPath id={`${p}foto`}><path d={`M${cx - D / 2},${cy} A${D / 2},${D / 2} 0 0 0 ${cx + D / 2},${cy} L${cx + D / 2},0 L${cx - D / 2},0 Z`} /></clipPath>
  </defs>
);
const FotoDaire: React.FC<{ p: string; cx: number; cy: number; D: number; foto: string; halkaBeyaz?: boolean }> = ({ p, cx, cy, D, foto, halkaBeyaz }) => (
  <>
    <circle cx={cx} cy={cy} r={D / 2 + 22} fill={`url(#${p}halka)`} />
    <circle cx={cx} cy={cy} r={D / 2 + 8} fill="#ffffff" />
    <circle cx={cx} cy={cy} r={D / 2} fill={`url(#${p}daire)`} />
    <g clipPath={`url(#${p}foto)`}><image href={staticFile(foto)} x={cx - D * 0.5625} y={cy - D / 2 - D * 0.156} width={D * 1.125} height={D * 1.32} preserveAspectRatio="xMidYMid meet" /></g>
    {halkaBeyaz ? null : null}
  </>
);
const Hap: React.FC<{ unvan: string; boy?: number }> = ({ unvan, boy = 46 }) => (
  <div style={{ display: "inline-block", background: R.magenta, color: "white", fontFamily: POP, fontWeight: 600, fontSize: boy, borderRadius: 999, padding: "12px 44px", letterSpacing: 1 }}>{unvan}</div>
);

// A2 — asimetrik: fotoğraf sağda üst banda biner, logo sol üstte, isim sola dayalı
export const YakaKartiA2: React.FC<{ ad: string; unvan: string; foto: string }> = ({ ad, unvan, foto }) => {
  const W = 1252, H = 1724, D = 600, cx = 800, cy = 700;
  const [ilk, ...son] = ad.split(" ");
  return (
    <AbsoluteFill style={{ background: "#ffffff" }}>
      <Font />
      <svg width={W} height={H} style={{ position: "absolute" }}>
        <Tanimlar p="a2" cx={cx} cy={cy} D={D} />
        <path d={`M0,0 L${W},0 L${W},360 C${W * 0.75},430 ${W * 0.35},620 0,600 Z`} fill="url(#a2bant)" />
        <circle cx={1130} cy={1090} r={52} fill={R.turkuaz} fillOpacity={0.9} />
        <circle cx={1035} cy={1165} r={20} fill={R.lila} />
        <FotoDaire p="a2" cx={cx} cy={cy} D={D} foto={foto} />
        <path d={`M0,${H} L${W},${H} L${W},${H - 230} C${W * 0.6},${H - 120} ${W * 0.3},${H - 70} 0,${H - 140} Z`} fill="url(#a2bant)" />
      </svg>
      <div style={{ position: "absolute", top: 120, left: 90 }}><Img src={staticFile("logo_beyaz.png")} style={{ width: 600 }} /></div>
      <div style={{ position: "absolute", top: 1110, left: 110, fontFamily: POP, lineHeight: 1 }}>
        <div style={{ fontWeight: 600, fontSize: 70, color: R.magenta, letterSpacing: 6 }}>{ilk}</div>
        <div style={{ fontWeight: 900, fontSize: 124, color: R.metin }}>{son.join(" ")}</div>
        <div style={{ marginTop: 30 }}><Hap unvan={unvan} /></div>
      </div>
    </AbsoluteFill>
  );
};

// A3 — fotoğraf üst banda biner (kafa bandın içinde), isim ortada, logo alt bantta
export const YakaKartiA3: React.FC<{ ad: string; unvan: string; foto: string }> = ({ ad, unvan, foto }) => {
  const W = 1252, H = 1724, D = 660, cx = W / 2, cy = 600;
  return (
    <AbsoluteFill style={{ background: "#ffffff" }}>
      <Font />
      <svg width={W} height={H} style={{ position: "absolute" }}>
        <Tanimlar p="a3" cx={cx} cy={cy} D={D} />
        <path d={`M0,0 L${W},0 L${W},560 C${W * 0.7},640 ${W * 0.3},480 0,580 Z`} fill="url(#a3bant)" />
        <circle cx={W - 110} cy={120} r={170} fill="none" stroke="#fff" strokeOpacity={0.12} strokeWidth={32} />
        <circle cx={90} cy={150} r={90} fill="#fff" fillOpacity={0.07} />
        <FotoDaire p="a3" cx={cx} cy={cy} D={D} foto={foto} />
        <path d={`M0,${H} L${W},${H} L${W},${H - 330} C${W * 0.7},${H - 250} ${W * 0.3},${H - 400} 0,${H - 300} Z`} fill="url(#a3bant)" />
      </svg>
      <div style={{ position: "absolute", top: cy + D / 2 + 60, width: W, textAlign: "center" }}>
        <div style={{ fontFamily: POP, fontWeight: 900, fontSize: 100, color: R.metin, letterSpacing: 2, lineHeight: 1 }}>{ad}</div>
        <div style={{ marginTop: 28 }}><Hap unvan={unvan} /></div>
      </div>
      <div style={{ position: "absolute", bottom: 120, width: W, display: "flex", justifyContent: "center" }}><Img src={staticFile("logo_beyaz.png")} style={{ width: 640 }} /></div>
    </AbsoluteFill>
  );
};

// A4 — logo + isim üstte, fotoğraf alt banda gömülü (kişi banttan yükselir)
export const YakaKartiA4: React.FC<{ ad: string; unvan: string; foto: string }> = ({ ad, unvan, foto }) => {
  const W = 1252, H = 1724, D = 730, cx = W / 2, cy = 1265;
  return (
    <AbsoluteFill style={{ background: "#ffffff" }}>
      <Font />
      <svg width={W} height={H} style={{ position: "absolute" }}>
        <Tanimlar p="a4" cx={cx} cy={cy} D={D} />
        <path d={`M0,0 L${W},0 L${W},330 C${W * 0.7},400 ${W * 0.3},280 0,360 Z`} fill="url(#a4bant)" />
        <path d={`M0,${H} L${W},${H} L${W},${H - 560} C${W * 0.72},${H - 470} ${W * 0.3},${H - 640} 0,${H - 520} Z`} fill="url(#a4bant)" />
        <circle cx={150} cy={H - 190} r={110} fill="#fff" fillOpacity={0.08} />
        <circle cx={W - 120} cy={H - 120} r={60} fill={R.turkuaz} fillOpacity={0.85} />
        <FotoDaire p="a4" cx={cx} cy={cy} D={D} foto={foto} />
      </svg>
      <div style={{ position: "absolute", top: 105, width: W, display: "flex", justifyContent: "center" }}><Img src={staticFile("logo_beyaz.png")} style={{ width: 700 }} /></div>
      <div style={{ position: "absolute", top: 430, width: W, textAlign: "center" }}>
        <div style={{ fontFamily: POP, fontWeight: 900, fontSize: 104, color: R.metin, letterSpacing: 2, lineHeight: 1 }}>{ad}</div>
        <div style={{ marginTop: 28 }}><Hap unvan={unvan} /></div>
      </div>
    </AbsoluteFill>
  );
};

// ---- Basılı karttan esinli (koyu ahududu zemin + eş merkezli halkalar, sola dayalı beyaz isim, sağ altta logo) ----
const AH = { zemin: "#9B1E4E", halka: "#B5406C", acik: "#F9EEF1", yazi: "#FFFFFF", soluk: "#F6C9D7" };
const Halkalar: React.FC<{ cx: number; cy: number; renk: string; n?: number; adim?: number; r0?: number; kalin?: number; op?: number }> = ({ cx, cy, renk, n = 14, adim = 70, r0 = 60, kalin = 22, op = 0.55 }) => (
  <g fill="none" stroke={renk} strokeWidth={kalin} strokeOpacity={op}>
    {Array.from({ length: n }).map((_, i) => <circle key={i} cx={cx} cy={cy} r={r0 + i * adim} />)}
  </g>
);
const Delik = () => null; // askı deliği matbaada delinir; üst orta (x 626, y 60–200) boş bırakıldı

// D1 — halkalar fotoğraftan yayılır
export const YakaKartiD1: React.FC<{ ad: string; unvan: string; foto: string }> = ({ ad, unvan, foto }) => {
  const W = 1252, H = 1724, D = 560, cx = W / 2, cy = 640;
  const [ilk, ...son] = ad.split(" ");
  return (
    <AbsoluteFill style={{ background: AH.zemin }}>
      <Font />
      <svg width={W} height={H} style={{ position: "absolute" }}>
        <defs><clipPath id="d1foto"><path d={`M${cx - D / 2},${cy} A${D / 2},${D / 2} 0 0 0 ${cx + D / 2},${cy} L${cx + D / 2},0 L${cx - D / 2},0 Z`} /></clipPath></defs>
        <Halkalar cx={cx} cy={cy} renk={AH.halka} r0={D / 2 + 70} adim={92} n={11} kalin={26} op={0.32} />
        <circle cx={cx} cy={cy} r={D / 2 + 14} fill="#ffffff" />
        <circle cx={cx} cy={cy} r={D / 2} fill={AH.halka} />
        <g clipPath="url(#d1foto)"><image href={staticFile(foto)} x={cx - D * 0.5625} y={cy - D / 2 - D * 0.156} width={D * 1.125} height={D * 1.32} preserveAspectRatio="xMidYMid meet" /></g>
      </svg>
      <div style={{ position: "absolute", top: cy + D / 2 + 110, left: 120, fontFamily: POP, color: AH.yazi, lineHeight: 1.02 }}>
        <div style={{ fontWeight: 800, fontSize: 108 }}>{ilk}</div>
        <div style={{ fontWeight: 800, fontSize: 108 }}>{son.join(" ")}</div>
        <div style={{ marginTop: 22, fontWeight: 600, fontSize: 44, color: AH.soluk }}>{unvan}</div>
      </div>
      <div style={{ position: "absolute", right: 110, bottom: 120 }}><Img src={staticFile("logo_beyaz.png")} style={{ width: 400 }} /></div>
    </AbsoluteFill>
  );
};

// D2 — orijinal yerleşim: halkalar soldan, isim sol üstte, kişi sağ alttan yükselir
export const YakaKartiD2: React.FC<{ ad: string; unvan: string; foto: string }> = ({ ad, unvan, foto }) => {
  const W = 1252, H = 1724;
  const [ilk, ...son] = ad.split(" ");
  return (
    <AbsoluteFill style={{ background: AH.zemin }}>
      <Font />
      <svg width={W} height={H} style={{ position: "absolute" }}>
        <defs><linearGradient id="d2sol" x1="0" y1="0" x2="0" y2="1"><stop offset="0.82" stopColor="#000" stopOpacity={0} /><stop offset="1" stopColor="#000" stopOpacity={0.25} /></linearGradient></defs>
        <Halkalar cx={-40} cy={1040} renk={AH.halka} r0={80} adim={92} n={12} kalin={28} op={0.32} />
        <image href={staticFile(foto)} x={400} y={800} width={940} height={1103} preserveAspectRatio="xMidYMid meet" />
        <rect x={0} y={0} width={W} height={H} fill="url(#d2sol)" />
      </svg>
      <div style={{ position: "absolute", top: 300, left: 120, fontFamily: POP, color: AH.yazi, lineHeight: 1.02 }}>
        <div style={{ fontWeight: 800, fontSize: 120 }}>{ilk}</div>
        <div style={{ fontWeight: 800, fontSize: 120 }}>{son.join(" ")}</div>
        <div style={{ marginTop: 26, display: "inline-block", border: `4px solid ${AH.soluk}`, color: AH.soluk, fontWeight: 600, fontSize: 42, borderRadius: 999, padding: "8px 34px" }}>{unvan}</div>
      </div>
      <div style={{ position: "absolute", left: 120, bottom: 120 }}><Img src={staticFile("logo_beyaz.png")} style={{ width: 380 }} /></div>
    </AbsoluteFill>
  );
};

// D3 — açık versiyon: krem zemin, ahududu halkalar, ahududu isim
export const YakaKartiD3: React.FC<{ ad: string; unvan: string; foto: string }> = ({ ad, unvan, foto }) => {
  const W = 1252, H = 1724, D = 520, cx = 820, cy = 1060;
  const [ilk, ...son] = ad.split(" ");
  return (
    <AbsoluteFill style={{ background: AH.acik }}>
      <Font />
      <svg width={W} height={H} style={{ position: "absolute" }}>
        <defs><clipPath id="d3foto"><path d={`M${cx - D / 2},${cy} A${D / 2},${D / 2} 0 0 0 ${cx + D / 2},${cy} L${cx + D / 2},0 L${cx - D / 2},0 Z`} /></clipPath></defs>
        <Halkalar cx={cx} cy={cy} renk={AH.zemin} r0={D / 2 + 60} adim={86} n={12} kalin={22} op={0.07} />
        <circle cx={cx} cy={cy} r={D / 2 + 12} fill={AH.zemin} />
        <circle cx={cx} cy={cy} r={D / 2} fill={AH.halka} />
        <g clipPath="url(#d3foto)"><image href={staticFile(foto)} x={cx - D * 0.5625} y={cy - D / 2 - D * 0.156} width={D * 1.125} height={D * 1.32} preserveAspectRatio="xMidYMid meet" /></g>
        <rect x={0} y={H - 150} width={W} height={150} fill={AH.zemin} />
      </svg>
      <div style={{ position: "absolute", top: 300, left: 120, fontFamily: POP, lineHeight: 1.02 }}>
        <div style={{ fontWeight: 800, fontSize: 118, color: AH.zemin }}>{ilk}</div>
        <div style={{ fontWeight: 800, fontSize: 118, color: "#2a1420" }}>{son.join(" ")}</div>
        <div style={{ marginTop: 22, fontWeight: 600, fontSize: 44, color: "#7a4a5c" }}>{unvan}</div>
      </div>
      <div style={{ position: "absolute", right: 110, bottom: 38 }}><Img src={staticFile("logo_beyaz.png")} style={{ width: 330 }} /></div>
    </AbsoluteFill>
  );
};

// D3 v2 — açık zemin, fotoğraf ortada, isim altında, unvan + "Mağazanolsun Partner"; desen: halka | dalga | capraz
export const YakaKartiD3v2: React.FC<{ ad: string; unvan: string; foto: string; ek?: string; desen?: "halka" | "dalga" | "capraz" | "topo" | "zikzak" | "isin" | "m"; mKonum?: "sag" | "sol" | "alt"; mOp?: number }> = ({ ad, unvan, foto, ek = "Mağazanolsun Partner", desen = "halka", mKonum = "sag", mOp = 0.07 }) => {
  const W = 1252, H = 1724, D = 560, cx = W / 2, cy = 640;
  const cizgi = AH.zemin;
  return (
    <AbsoluteFill style={{ background: AH.acik }}>
      <Font />
      <svg width={W} height={H} style={{ position: "absolute" }}>
        <defs><clipPath id={`d3v2${desen}`}><path d={`M${cx - D / 2},${cy} A${D / 2},${D / 2} 0 0 0 ${cx + D / 2},${cy} L${cx + D / 2},0 L${cx - D / 2},0 Z`} /></clipPath></defs>
        {desen === "halka" ? <Halkalar cx={cx} cy={cy} renk={cizgi} r0={D / 2 + 60} adim={86} n={13} kalin={20} op={0.045} /> : null}
        {desen === "dalga" ? (
          <g fill="none" stroke={cizgi} strokeOpacity={0.07} strokeWidth={10}>
            {Array.from({ length: 30 }).map((_, i) => { const y = -120 + i * 66;
              return <path key={i} d={`M-50,${y} C200,${y - 90} 420,${y + 110} 640,${y} S1060,${y - 100} 1320,${y + 20}`} />; })}
          </g>) : null}
        {desen === "capraz" ? (
          <g stroke={cizgi} strokeOpacity={0.06} strokeWidth={26}>
            {Array.from({ length: 22 }).map((_, i) => <line key={i} x1={-900 + i * 140} y1={H + 100} x2={-900 + i * 140 + 1900} y2={-100} />)}
          </g>) : null}
        {desen === "m" ? (() => {
          // logodaki M (girdiler/m_harf.png, 1728x1740); dörtte biri kartın dışında
          const k = { sag: { w: 1500, x: W - 1125, y: 120 }, sol: { w: 1500, x: -375, y: 120 }, alt: { w: 1250, x: 1, y: H - 944 } }[mKonum];
          return <image href={staticFile("m_harf.png")} x={k.x} y={k.y} width={k.w} height={k.w * 1740 / 1728} opacity={mOp} />;
        })() : null}
        {desen === "topo" ? (
          <g fill="none" stroke={cizgi} strokeOpacity={0.07} strokeWidth={8}>
            {Array.from({ length: 26 }).map((_, i) => {
              const pts = Array.from({ length: 73 }).map((__, k) => { const a = (k / 72) * Math.PI * 2;
                const r = 60 + i * 62 + 26 * Math.sin(3 * a + i * 0.35) + 16 * Math.sin(5 * a - i * 0.2);
                return `${(160 + Math.cos(a) * r * 1.05).toFixed(1)},${(1350 + Math.sin(a) * r).toFixed(1)}`; });
              return <polygon key={i} points={pts.join(" ")} />; })}
          </g>) : null}
        {desen === "zikzak" ? (
          <g fill="none" stroke={cizgi} strokeOpacity={0.065} strokeWidth={12} strokeLinejoin="round" strokeLinecap="round">
            {Array.from({ length: 22 }).map((_, i) => { const y = -60 + i * 84;
              const d = Array.from({ length: 9 }).map((__, k) => `${k ? "L" : "M"}${-60 + k * 170},${y + (k % 2 ? 70 : 0)}`).join(" ");
              return <path key={i} d={d} />; })}
          </g>) : null}
        {desen === "isin" ? (
          <g stroke={cizgi} strokeOpacity={0.07} strokeWidth={10} strokeLinecap="round">
            {Array.from({ length: 48 }).map((_, i) => { const a = (i / 48) * Math.PI * 2;
              return <line key={i} x1={cx + Math.cos(a) * (D / 2 + 50)} y1={cy + Math.sin(a) * (D / 2 + 50)} x2={cx + Math.cos(a) * 1800} y2={cy + Math.sin(a) * 1800} />; })}
          </g>) : null}
        <circle cx={cx} cy={cy} r={D / 2 + 12} fill={AH.zemin} />
        <circle cx={cx} cy={cy} r={D / 2} fill={AH.halka} />
        <g clipPath={`url(#d3v2${desen})`}><image href={staticFile(foto)} x={cx - D * 0.5625} y={cy - D / 2 - D * 0.156} width={D * 1.125} height={D * 1.32} preserveAspectRatio="xMidYMid meet" /></g>
        <rect x={0} y={H - 150} width={W} height={150} fill={AH.zemin} />
      </svg>
      <div style={{ position: "absolute", top: cy + D / 2 + 70, width: W, textAlign: "center", fontFamily: POP }}>
        <div style={{ fontWeight: 800, fontSize: 104, lineHeight: 1, letterSpacing: 1 }}><span style={{ color: AH.zemin }}>{ad.split(" ")[0]}</span> <span style={{ color: "#2a1420" }}>{ad.split(" ").slice(1).join(" ")}</span></div>
        <div style={{ marginTop: 26, fontWeight: 600, fontSize: 46, color: "#7a4a5c" }}>{unvan}</div>
        <div style={{ marginTop: 22, display: "inline-block", background: AH.zemin, color: "white", fontWeight: 700, fontSize: 40, borderRadius: 999, padding: "10px 38px", letterSpacing: 1 }}>{ek}</div>
      </div>
      <div style={{ position: "absolute", width: W, bottom: 38, display: "flex", justifyContent: "center" }}><Img src={staticFile("logo_beyaz.png")} style={{ width: 330 }} /></div>
    </AbsoluteFill>
  );
};
