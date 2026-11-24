import React from "react";
import "@fontsource/baloo-2/800.css";
import { AbsoluteFill } from "remotion";
import { RENK, El, Tirnak, Buyutec, ArkaPlan } from "./cizim";
const FONT = "'Baloo 2', sans-serif";
// Kapak: 1080x1920; önemli her şey ortadaki 1080x1080 (profil ızgarası) içinde (y 420–1500)
export const Kapak: React.FC = () => (
  <AbsoluteFill style={{ background: RENK.krem }}>
    <ArkaPlan renk={RENK.krem} vurgu="#FFE2C4" t={0.6} />
    <svg width={1080} height={1920} viewBox="0 0 1080 1920" style={{ position: "absolute" }}>
      <g transform="translate(150 790) scale(0.76)"><El tirnaklar={["cukur", "cukur", "cukur", "normal", "normal"]} /></g>
      <g transform="translate(680 980)">
        <Buyutec r={230} id="bk"><g transform="translate(-150 -150)"><Tirnak w={300} h={300} tip="cukur" sw={10} /></g></Buyutec>
      </g>
    </svg>
    <div style={{ position: "absolute", top: 450, left: 60, right: 60, textAlign: "center", fontFamily: FONT, fontWeight: 800, lineHeight: 1.0 }}>
      <div style={{ fontSize: 112, color: RENK.mor, textShadow: "0 6px 0 #fff, 0 -6px 0 #fff, 6px 0 0 #fff, -6px 0 0 #fff" }}>TIRNAĞINDAKİ</div>
      <div style={{ display: "inline-block", marginTop: 14, background: RENK.mor, color: "#fff", fontSize: 108, padding: "10px 40px 0", borderRadius: 30, border: "7px solid #fff", boxShadow: "0 12px 0 rgba(43,33,64,0.25)" }}>İĞNE İZLERİ</div>
    </div>
    <div style={{ position: "absolute", top: 1335, left: 0, right: 0, display: "flex", justifyContent: "center" }}>
      <div style={{ background: "#fff", border: `6px solid ${RENK.morAcik}`, color: RENK.mor, fontFamily: FONT, fontWeight: 800, fontSize: 56, padding: "8px 40px 0", borderRadius: 999 }}>sedefin işareti olabilir</div>
    </div>
  </AbsoluteFill>
);
