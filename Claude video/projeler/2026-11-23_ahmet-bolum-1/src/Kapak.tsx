import React from "react";
import { AbsoluteFill } from "remotion";
import { MasaOn, Gren, Vinyet } from "./sahneler";
import "@fontsource/poppins/600.css";
import "@fontsource/poppins/700.css";
import "@fontsource/poppins/800.css";

// Reels/TikTok kapağı 1080x1920. Profil ızgarası ortadaki 1080x1440'ı (y 240-1680) gösterir: tüm yazılar bu alanda.
const POP = "'Poppins', sans-serif";
export const Kapak: React.FC = () => (
  <AbsoluteFill style={{ background: "#000" }}>
    <MasaOn z="gece" f={30} zoom={1.22} odakY={700} laptopAcik={1} ekranIsik={1.1} ifade={{ gozY: 0.2, kasY: 2, kasAci: 5, dudakBas: 0.6 }} />
    <AbsoluteFill style={{ background: "linear-gradient(180deg, rgba(0,0,0,0.0) 40%, rgba(5,8,20,0.75) 62%, rgba(5,8,20,0.92) 100%)" }} />
    {/* dizi + bölüm rozeti (üst, ızgara içinde) */}
    <div style={{ position: "absolute", top: 268, left: 0, right: 0, display: "flex", justifyContent: "center" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 14, background: "rgba(10,14,28,0.85)", border: "2px solid #F67102", borderRadius: 50, padding: "10px 26px" }}>
        <span style={{ fontFamily: POP, fontWeight: 800, fontSize: 28, color: "white", background: "#F67102", borderRadius: 30, padding: "2px 16px" }}>BÖLÜM 1</span>
        <span style={{ fontFamily: POP, fontWeight: 700, fontSize: 28, letterSpacing: 3, color: "white" }}>KARAR GECESİ</span>
      </div>
    </div>
    {/* başlık (yüzün altında) */}
    <div style={{ position: "absolute", top: 1110, left: 50, right: 50, textAlign: "center", fontFamily: POP, lineHeight: 1.0, textShadow: "0 8px 30px rgba(0,0,0,0.7)" }}>
      <div style={{ fontWeight: 700, fontSize: 52, color: "rgba(255,255,255,0.85)", letterSpacing: 1 }}>AHMET</div>
      <div style={{ fontWeight: 800, fontSize: 118, color: "white", letterSpacing: -3, marginTop: 6 }}>E-TİCARETE</div>
      <div style={{ fontWeight: 800, fontSize: 92, color: "white", letterSpacing: -2 }}>BAŞLAMAK İSTİYOR</div>
      <div style={{ display: "inline-block", marginTop: 26, background: "#F67102", color: "white", fontWeight: 800, fontStyle: "italic", fontSize: 48, padding: "6px 26px", borderRadius: 14, transform: "rotate(-2deg)" }}>ama nereden?</div>
    </div>
    <Vinyet guc={0.8} />
    <Gren f={7} guc={0.8} />
  </AbsoluteFill>
);
