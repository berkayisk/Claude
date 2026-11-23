import React from "react";
import { AbsoluteFill, Img } from "remotion";
import "@fontsource/saira/latin-ext-800.css";
import "@fontsource/saira/latin-ext-800-italic.css";
import "@fontsource/saira/latin-ext-900-italic.css";
import "@fontsource/saira/latin-800.css";
import "@fontsource/saira/latin-800-italic.css";
import "@fontsource/saira/latin-900-italic.css";
import { SARI } from "./GunesReels";

// Reels kapağı (1080x1920). Instagram profil ızgarası ortadaki 1080x1440'ı gösterir (y 240–1680):
// logo, başlık ve yüz bu bölgede kalır.
const SIYAH = "#0A0A0A";
const F = "'Saira', sans-serif";
const SERIT = `repeating-linear-gradient(-45deg, ${SARI} 0 26px, ${SIYAH} 26px 52px)`;

export type KapakVeri = { gorsel: string; satir1: string; satir2?: string; no?: number; baslikY?: number; odak?: string };

export const GunesKapak: React.FC<{ v: KapakVeri; logo: string }> = ({ v, logo }) => {
  const Y = v.baslikY ?? 1150;
  const uzun = v.satir1.length > 16;
  return (
    <AbsoluteFill style={{ background: SIYAH }}>
      <Img src={v.gorsel} style={{ width: 1080, height: 1920, objectFit: "cover", objectPosition: v.odak ?? "50% 50%" }} />
      <AbsoluteFill style={{ background: "linear-gradient(180deg, rgba(0,0,0,0.55) 0%, rgba(0,0,0,0) 22%, rgba(0,0,0,0) 48%, rgba(0,0,0,0.78) 78%, rgba(0,0,0,0.9) 100%)" }} />
      {/* logo (ızgara içinde) */}
      <div style={{ position: "absolute", top: 270, left: 0, right: 0, display: "flex", justifyContent: "center", filter: "drop-shadow(0 6px 16px rgba(0,0,0,0.7))" }}>
        <Img src={logo} style={{ width: 560 }} />
      </div>
      {/* başlık */}
      <div style={{ position: "absolute", top: Y, left: 0, right: 0, display: "flex", flexDirection: "column", alignItems: "center", gap: 18 }}>
        <div style={{ background: SARI, padding: "10px 34px 4px", transform: "skewX(-10deg)", boxShadow: "0 16px 40px rgba(0,0,0,0.6)", maxWidth: 1000 }}>
          <div style={{ transform: "skewX(10deg)", fontFamily: F, fontWeight: 900, fontStyle: "italic", fontSize: uzun ? 92 : 112, lineHeight: 1.0, color: SIYAH, textAlign: "center" }}>{v.satir1}</div>
        </div>
        {v.satir2 ? (
          <div style={{ background: SIYAH, padding: "6px 28px", transform: "skewX(-10deg)", border: `3px solid ${SARI}` }}>
            <div style={{ transform: "skewX(10deg)", fontFamily: F, fontWeight: 800, fontStyle: "italic", fontSize: 60, color: "white", lineHeight: 1.1 }}>{v.satir2}</div>
          </div>
        ) : null}
      </div>
      {/* alt ikaz şeridi + 7/24 */}
      <div style={{ position: "absolute", top: 1560, left: 0, right: 0, height: 22, background: SERIT, opacity: 0.95 }} />
      <div style={{ position: "absolute", top: 1596, left: 0, right: 0, textAlign: "center", fontFamily: F, fontWeight: 900, fontStyle: "italic", fontSize: 54, color: "white", letterSpacing: 1 }}>
        <span style={{ color: SARI }}>7/24</span> · 0544 397 87 96
      </div>
    </AbsoluteFill>
  );
};
