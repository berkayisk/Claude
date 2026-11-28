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
