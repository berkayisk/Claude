import React from "react";
import "@fontsource/baloo-2/800.css";
import { AbsoluteFill } from "remotion";
import { RENK, ArkaPlan } from "./cizim";
import { Govde, DAMLALAR, Bogaz } from "./cizim2";
const FONT = "'Baloo 2', sans-serif";
// 1080x1920; yazılar ortadaki 1:1 ızgara kırpımında (y 420–1500)
export const Kapak: React.FC = () => (
  <AbsoluteFill style={{ background: RENK.krem }}>
    <ArkaPlan renk={RENK.krem} vurgu="#FFE2C4" t={0.8} />
    <svg width={1080} height={1920} viewBox="0 0 1080 1920" style={{ position: "absolute" }}>
      <g transform="translate(560 1330) scale(0.95)"><Govde goster={DAMLALAR.map(() => 1)} /></g>
      <g transform="translate(860 1020) scale(0.36)">
        <circle r={380} fill="#fff" stroke={RENK.cizgi} strokeWidth={16} />
        <Bogaz kizariklik={1} />
      </g>
      <path d="M760 1080 Q 690 1120 650 1090" fill="none" stroke={RENK.mor} strokeWidth={10} strokeDasharray="18 12" strokeLinecap="round" />
    </svg>
    <div style={{ position: "absolute", top: 455, left: 50, right: 50, textAlign: "center", fontFamily: FONT, fontWeight: 800, lineHeight: 1.0 }}>
      <div style={{ fontSize: 92, color: RENK.mor, textShadow: "0 6px 0 #fff, 0 -6px 0 #fff, 6px 0 0 #fff, -6px 0 0 #fff" }}>BOĞAZIN GEÇTİ AMA</div>
      <div style={{ display: "inline-block", marginTop: 16, background: RENK.mor, color: "#fff", fontSize: 74, padding: "10px 32px 0", whiteSpace: "nowrap", borderRadius: 30, border: "7px solid #fff", boxShadow: "0 12px 0 rgba(43,33,64,0.25)" }}>DAMLA DAMLA LEKELER?</div>
    </div>
    <div style={{ position: "absolute", top: 1335, left: 0, right: 0, display: "flex", justifyContent: "center" }}>
      <div style={{ background: "#fff", border: `6px solid ${RENK.morAcik}`, color: RENK.mor, fontFamily: FONT, fontWeight: 800, fontSize: 56, padding: "8px 40px 0", borderRadius: 999 }}>adı: damla sedef</div>
    </div>
  </AbsoluteFill>
);
