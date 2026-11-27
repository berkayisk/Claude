import React from "react";
import { AbsoluteFill, Img, staticFile } from "remotion";
import "@fontsource/anton/400.css";
import "@fontsource/inter/800.css";
import { RENK } from "../../../bilesenler/marka";

// Tanışma reels kapağı (1080x1920). Profil ızgarası ortadaki 1080x1440'ı (y 240-1680) gösterir.
// Dil: @sifirdansatisa ızgarasındaki kapaklar (Anton, büyük harf, beyaz + sarı + kırmızı kutu, kişi altta).
const ANTON = "'Anton', sans-serif";
const SARI = "#FFD43B";
const KIRMIZI = "#E5262B";
const golge = "0 6px 0 rgba(0,0,0,0.35), 0 12px 40px rgba(0,0,0,0.65)";

export const Kapak: React.FC<{ satir1: string; satir2: string; kutu: string; etiket?: string }> = ({ satir1, satir2, kutu, etiket }) => (
  <AbsoluteFill style={{ background: "#0a0610", overflow: "hidden" }}>
    {/* gerçek stüdyo, bulanık ve karartılmış */}
    <Img src={staticFile("kapak_arka.png")} style={{ position: "absolute", width: 1920, height: 1920, left: -420, top: 0, objectFit: "cover", filter: "blur(30px) brightness(0.45) saturate(1.15)" }} />
    <AbsoluteFill style={{ background: `radial-gradient(ellipse 75% 40% at 50% 74%, ${RENK.turuncu}55 0%, ${RENK.turuncu}14 45%, rgba(0,0,0,0) 72%)` }} />
    <AbsoluteFill style={{ background: "linear-gradient(180deg, rgba(10,6,16,0.92) 0%, rgba(10,6,16,0.55) 30%, rgba(10,6,16,0) 50%)" }} />
    {/* kişi */}
    <Img src={staticFile("kapak_kisi.png")} style={{ position: "absolute", width: 1130, left: -10, top: 880, filter: "drop-shadow(0 30px 60px rgba(0,0,0,0.7))" }} />
    <AbsoluteFill style={{ background: "linear-gradient(180deg, rgba(0,0,0,0) 78%, rgba(0,0,0,0.55) 100%)" }} />
    {/* başlık */}
    <div style={{ position: "absolute", top: 300, left: 40, right: 40, display: "flex", flexDirection: "column", alignItems: "center" }}>
      {etiket ? (
        <div style={{ fontFamily: "'Inter', sans-serif", fontWeight: 800, fontSize: 34, letterSpacing: 6, color: "white", background: "rgba(14,20,38,0.85)", border: `2px solid ${RENK.turuncu}`, borderRadius: 40, padding: "8px 28px", marginBottom: 22 }}>{etiket}</div>
      ) : null}
      <div style={{ fontFamily: ANTON, fontSize: 128, lineHeight: 1.0, color: "white", textAlign: "center", textShadow: golge, transform: "rotate(-1.5deg)" }}>{satir1}</div>
      <div style={{ fontFamily: ANTON, fontSize: 206, lineHeight: 0.98, color: SARI, textAlign: "center", textShadow: golge, transform: "rotate(-1.5deg)" }}>{satir2}</div>
      <div style={{ marginTop: 14, fontFamily: ANTON, fontSize: 104, lineHeight: 1.12, color: "white", background: KIRMIZI, padding: "0 30px", transform: "rotate(-2.5deg)", boxShadow: "0 14px 40px rgba(0,0,0,0.55)" }}>{kutu}</div>
    </div>
  </AbsoluteFill>
);
