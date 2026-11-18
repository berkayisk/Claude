import React from "react";
import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { RENK, FONT } from "./marka";

// Konuk alt bandı: lacivert kutu, turuncu sol şerit, tırnak ikonu, isim / unvan / rol
export const AltBant: React.FC<{ isim: string; unvan: string; rol: string; sure: number }> = ({ isim, unvan, rol, sure }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const giris = spring({ frame, fps, config: { damping: 16, stiffness: 110 } });
  const cikis = spring({ frame: frame - (sure - 15), fps, config: { damping: 20, stiffness: 140 } });
  const x = interpolate(giris, [0, 1], [-1300, 0]) + interpolate(cikis, [0, 1], [0, -1300]);
  const metinOp = interpolate(frame, [8, 18], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const cizgi = interpolate(frame, [14, 30], [0, 100], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  return (
    <AbsoluteFill>
      <div style={{ position: "absolute", left: 50, bottom: 95, transform: `translateX(${x}px)` }}>
        {/* turuncu sol şerit */}
        <div style={{ position: "absolute", left: -14, top: 18, bottom: 18, width: 30, background: RENK.turuncu, borderRadius: "18px 0 0 18px" }} />
        <div
          style={{
            position: "relative",
            background: RENK.lacivert,
            border: "3px solid rgba(255,255,255,0.92)",
            borderRadius: 18,
            padding: "26px 70px 24px 36px",
            display: "flex",
            alignItems: "center",
            gap: 26,
            boxShadow: "0 12px 40px rgba(0,0,0,0.45)",
          }}
        >
          <div style={{ fontFamily: FONT.serif, fontStyle: "italic", fontWeight: 700, color: RENK.krem, fontSize: 130, lineHeight: 0.6, marginTop: -10, alignSelf: "flex-start", paddingTop: 40 }}>“</div>
          <div style={{ width: 4, alignSelf: "stretch", background: RENK.turuncu, margin: "12px 0 40px" }} />
          <div style={{ opacity: metinOp }}>
            <div style={{ fontFamily: FONT.metin, fontWeight: 800, color: RENK.krem, fontSize: 70, lineHeight: 1.05 }}>{isim}</div>
            <div style={{ fontFamily: FONT.metin, fontWeight: 400, color: RENK.krem, fontSize: 40, marginTop: 6 }}>{unvan}</div>
            <div style={{ width: `${cizgi}px`, height: 5, background: RENK.turuncu, margin: "12px 0 10px" }} />
            <div style={{ fontFamily: FONT.metin, fontWeight: 700, color: RENK.turuncu, fontSize: 40 }}>{rol}</div>
          </div>
        </div>
      </div>
    </AbsoluteFill>
  );
};
