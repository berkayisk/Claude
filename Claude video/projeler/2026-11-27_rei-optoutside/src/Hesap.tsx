import React from "react";
import { AbsoluteFill, staticFile } from "remotion";
import { BerkayBas } from "./berkay";

// @eticaretteperdearkasi: profil fotoğrafı (1080x1080, Instagram daire kırpar) + Reels kapağı (1080x1920)
const POP = "'PoppinsF', 'Poppins', sans-serif";
const Font: React.FC = () => (
  <style>{`
    @font-face { font-family: 'PoppinsF'; font-weight: 800; src: url(${staticFile("fonts/Poppins-ExtraBold.ttf")}); }
    @font-face { font-family: 'PoppinsF'; font-weight: 900; src: url(${staticFile("fonts/Poppins-Black.ttf")}); }
  `}</style>
);

export const Profil: React.FC = () => (
  <AbsoluteFill style={{ background: "radial-gradient(circle at 50% 40%, #ffa24a 0%, #ff6a1f 60%, #e2480f 100%)" }}>
    {/* perde: iki yanda koyu kumaş kıvrımları (hesap adı: perde arkası) */}
    <svg width={1080} height={1080} style={{ position: "absolute" }}>
      {[0, 1].map((s) => (
        <g key={s} transform={s ? "translate(1080,0) scale(-1,1)" : undefined}>
          <path d="M0,0 L230,0 C200,300 250,700 150,1080 L0,1080 Z" fill="#7a1530" />
          <path d="M40,0 C60,400 20,800 50,1080" stroke="#5c0f24" strokeWidth={26} fill="none" />
          <path d="M120,0 C140,380 110,760 110,1080" stroke="#5c0f24" strokeWidth={20} fill="none" />
        </g>
      ))}
    </svg>
    <svg width={1080} height={1080} viewBox="0 0 1080 1080" style={{ position: "absolute" }}>
      <g transform="translate(540,150) scale(2.05) translate(-200,0)"><BerkayBas ifade={{ agiz: "gulumse", gozGul: 0.3, kas: 0.2 }} /></g>
    </svg>
  </AbsoluteFill>
);

export const Kapak: React.FC<{ s1: string; s2: string }> = ({ s1, s2 }) => (
  <AbsoluteFill style={{ background: "linear-gradient(180deg,#2b1d3f 0%,#141a2e 100%)" }}>
    <Font />
    <AbsoluteFill style={{ background: "radial-gradient(ellipse at 50% 30%, rgba(255,138,31,0.35) 0%, rgba(0,0,0,0) 60%)" }} />
    <svg width={1080} height={1920} viewBox="0 0 1080 1920" style={{ position: "absolute" }}>
      <g transform="translate(540,760) scale(2.1) translate(-200,0)"><BerkayBas ifade={{ agiz: "sasir", kas: 0.9, goz: 1.1, bakY: -0.8 }} /></g>
    </svg>
    <div style={{ position: "absolute", top: 350, width: 1080, textAlign: "center", fontFamily: POP, fontWeight: 900, lineHeight: 1.0 }}>
      <div style={{ fontSize: 96, color: "white", textShadow: "0 8px 30px rgba(0,0,0,0.6)" }}>{s1}</div>
      <div style={{ display: "inline-block", marginTop: 30, background: "#FFF6E8", borderRadius: 34, padding: "26px 60px", fontSize: 220, color: "#1b1f2e", letterSpacing: -6, boxShadow: "0 30px 80px rgba(0,0,0,0.5)", transform: "rotate(-3deg)" }}>{s2}<span style={{ fontSize: 90 }}> TL</span></div>
    </div>
    <div style={{ position: "absolute", top: 255, width: 1080, textAlign: "center" }}>
      <span style={{ fontFamily: POP, fontWeight: 800, fontSize: 40, color: "#1b1f2e", background: "#FF8A1F", borderRadius: 999, padding: "10px 32px" }}>@eticaretteperdearkasi</span>
    </div>
  </AbsoluteFill>
);

// Black Friday Reels kapağı (3:4 ızgara kırpması y 240–1680 içinde: başlık + yüz)
export const KapakBF: React.FC = () => (
  <AbsoluteFill style={{ background: "radial-gradient(circle at 50% 35%, #2a0d0d 0%, #000 70%)" }}>
    <Font />
    <svg width={1080} height={1920} viewBox="0 0 1080 1920" style={{ position: "absolute" }}>
      <g transform="translate(540,800) scale(2.0) translate(-200,0)"><BerkayBas ifade={{ agiz: "sasir", kas: 0.9, goz: 1.1, bakY: -0.8 }} /></g>
    </svg>
    <div style={{ position: "absolute", top: 255, width: 1080, textAlign: "center" }}>
      <span style={{ fontFamily: POP, fontWeight: 800, fontSize: 40, color: "#1b1f2e", background: "#FF8A1F", borderRadius: 999, padding: "10px 32px" }}>@eticaretteperdearkasi</span>
    </div>
    <div style={{ position: "absolute", top: 350, width: 1080, textAlign: "center", fontFamily: POP, fontWeight: 900, lineHeight: 1.0 }}>
      <div style={{ fontSize: 132, color: "white", textShadow: "0 0 30px #ff3b3b, 0 0 70px #ff3b3b", whiteSpace: "nowrap" }}>BLACK FRIDAY</div>
      <div style={{ display: "inline-block", marginTop: 34, background: "#FFF6E8", borderRadius: 28, padding: "18px 44px", fontSize: 92, color: "#1b1f2e", transform: "rotate(-3deg)", boxShadow: "0 24px 60px rgba(0,0,0,0.6)" }}>NEDEN <span style={{ color: "#e0262f" }}>"KARA"?</span></div>
    </div>
  </AbsoluteFill>
);

// REI #OptOutside Reels kapağı
export const KapakREI: React.FC = () => (
  <AbsoluteFill style={{ background: "radial-gradient(circle at 50% 30%, #1d2a44 0%, #070a12 70%)" }}>
    <Font />
    <svg width={1080} height={1920} viewBox="0 0 1080 1920" style={{ position: "absolute" }}>
      <g transform="translate(540,830) scale(2.0) translate(-200,0)"><BerkayBas ifade={{ agiz: "sasir", kas: 0.9, goz: 1.1, bakY: -0.8 }} /></g>
    </svg>
    <div style={{ position: "absolute", top: 255, width: 1080, textAlign: "center" }}>
      <span style={{ fontFamily: POP, fontWeight: 800, fontSize: 40, color: "#1b1f2e", background: "#FF8A1F", borderRadius: 999, padding: "10px 32px" }}>@eticaretteperdearkasi</span>
    </div>
    <div style={{ position: "absolute", top: 345, width: 1080, textAlign: "center", fontFamily: POP, fontWeight: 900, lineHeight: 1.0 }}>
      <div style={{ fontSize: 76, color: "white", textShadow: "0 8px 30px rgba(0,0,0,0.6)" }}>BLACK FRIDAY'DE</div>
      <div style={{ display: "inline-block", marginTop: 26, background: "#f4efe6", border: "12px solid #7a4a1f", borderRadius: 24, padding: "14px 46px", fontSize: 120, color: "#e0262f", transform: "rotate(-3deg)", boxShadow: "0 24px 60px rgba(0,0,0,0.6)" }}>KAPATTI</div>
      <div style={{ fontSize: 50, color: "#2ED47A", marginTop: 26 }}>sonra ne oldu?</div>
    </div>
  </AbsoluteFill>
);
