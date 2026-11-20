import React from "react";
import { AbsoluteFill, Img } from "remotion";
import "@fontsource/inter/600.css";
import "@fontsource/inter/800.css";
import "@fontsource/inter/800-italic.css";
import { RENK } from "./marka";

// Reels kapağı (1080x1920). Instagram profil ızgarası ortadaki 1080x1440'ı (y 240-1680) gösterir:
// başlık, yüz ve etiketler bu alanın içinde tutulur.
const INTER = "'Inter', sans-serif";
export const ReelsKapak: React.FC<{
  arka: string; kisi: string; rozet: string; satir1: string; satir2: string; vurgu: string; etiketler?: string[]; numara?: string;
}> = ({ arka, kisi, rozet, satir1, satir2, vurgu, etiketler = [], numara }) => (
  <AbsoluteFill style={{ background: "#07080d", overflow: "hidden" }}>
    {/* bulanık, karartılmış gerçek mekân */}
    <Img src={arka} style={{ position: "absolute", width: 1080, height: 1920, filter: "blur(28px) brightness(0.38) saturate(1.1)", transform: "scale(1.15)" }} />
    <AbsoluteFill style={{ background: "radial-gradient(ellipse 70% 45% at 50% 62%, rgba(246,113,2,0.55) 0%, rgba(246,113,2,0.12) 45%, rgba(0,0,0,0) 70%)" }} />
    <AbsoluteFill style={{ background: "linear-gradient(180deg, rgba(7,8,13,0.85) 0%, rgba(7,8,13,0.2) 34%, rgba(7,8,13,0) 55%, rgba(7,8,13,0.75) 100%)" }} />
    {/* kişi */}
    <Img src={kisi} style={{ position: "absolute", width: 1180, left: -50, top: 600, filter: "drop-shadow(0 30px 60px rgba(0,0,0,0.6))" }} />
    {/* alt koyulaştırma (etiketler okunsun) */}
    <AbsoluteFill style={{ background: "linear-gradient(180deg, rgba(0,0,0,0) 62%, rgba(0,0,0,0.7) 86%)" }} />
    {/* rozet */}
    <div style={{ position: "absolute", top: 290, left: 0, right: 0, display: "flex", justifyContent: "center" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 14, background: "rgba(14,20,38,0.88)", border: `2px solid ${RENK.turuncu}`, borderRadius: 50, padding: "12px 30px" }}>
        {numara ? <span style={{ fontFamily: INTER, fontWeight: 800, fontSize: 30, color: "white", background: RENK.turuncu, borderRadius: 30, padding: "2px 14px" }}>{numara}</span> : null}
        <span style={{ fontFamily: INTER, fontWeight: 800, fontSize: 32, letterSpacing: 4, color: "white" }}>{rozet}</span>
      </div>
    </div>
    {/* başlık */}
    <div style={{ position: "absolute", top: 380, left: 50, right: 50, display: "flex", flexDirection: "column", alignItems: "center" }}>
      <div style={{ fontFamily: INTER, fontWeight: 800, fontSize: 112, lineHeight: 1.0, color: "white", letterSpacing: -3, textAlign: "center", textShadow: "0 8px 30px rgba(0,0,0,0.7)" }}>{satir1}</div>
      <div style={{ fontFamily: INTER, fontWeight: 800, fontSize: 112, lineHeight: 1.0, color: "white", letterSpacing: -3, textAlign: "center", textShadow: "0 8px 30px rgba(0,0,0,0.7)" }}>{satir2}</div>
      <div style={{ marginTop: 18, fontFamily: INTER, fontWeight: 800, fontStyle: "italic", fontSize: 58, color: "white", background: RENK.turuncu, borderRadius: 16, padding: "4px 26px", transform: "rotate(-2.5deg)", boxShadow: "0 10px 30px rgba(0,0,0,0.5)" }}>{vurgu}</div>
    </div>
    {/* etiketler */}
    {etiketler.length ? (
      <div style={{ position: "absolute", top: 1480, left: 0, right: 0, display: "flex", justifyContent: "center", gap: 14 }}>
        {etiketler.map((e, i) => (
          <div key={e} style={{ display: "flex", alignItems: "center", gap: 10, background: "rgba(14,20,38,0.9)", border: "1.5px solid rgba(255,255,255,0.25)", borderRadius: 40, padding: "12px 24px" }}>
            <span style={{ width: 38, height: 38, borderRadius: 19, background: RENK.turuncu, color: "white", fontFamily: INTER, fontWeight: 800, fontSize: 22, display: "flex", alignItems: "center", justifyContent: "center" }}>{i + 1}</span>
            <span style={{ fontFamily: INTER, fontWeight: 800, fontSize: 32, color: "white" }}>{e}</span>
          </div>
        ))}
      </div>
    ) : null}
  </AbsoluteFill>
);
