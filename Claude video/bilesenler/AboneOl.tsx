import React from "react";
import { AbsoluteFill, Img, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { RENK, FONT } from "./marka";

// Turuncu "▶ ABONE OL" butonu, üstünden sunucu fotoğrafı iner, butona "tıklanır".
// x: butonun yatay merkezi (varsayılan ekran ortası). Yakın planda konuşmacının olmadığı tarafa kaydır.
export const AboneOl: React.FC<{ foto: string; sure: number; x?: number; y?: number }> = ({ foto, sure, x = 960, y = 120 }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const giris = spring({ frame, fps, config: { damping: 12, stiffness: 140 } });
  const foto_s = spring({ frame: frame - 10, fps, config: { damping: 14 } });
  const tik = spring({ frame: frame - 40, fps, config: { damping: 8, stiffness: 300 } });
  const basili = frame >= 40;
  const cikis = interpolate(frame, [sure - 10, sure], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const olcek = giris * (1 - 0.08 * Math.sin(Math.min(tik, 1) * Math.PI));
  return (
    <AbsoluteFill style={{ opacity: cikis }}>
      <div style={{ position: "absolute", top: y, left: x, transform: "translateX(-50%)", display: "flex", flexDirection: "column", alignItems: "center" }}>
        <div style={{ height: 170, overflow: "hidden", display: "flex", alignItems: "flex-end" }}>
          <Img
            src={foto}
            style={{ width: 160, height: 160, borderRadius: 80, transform: `translateY(${interpolate(foto_s, [0, 1], [180, 0])}px)`, boxShadow: "0 6px 20px rgba(0,0,0,0.5)" }}
          />
        </div>
        <div
          style={{
            marginTop: 18,
            transform: `scale(${olcek})`,
            background: basili ? "#6B6B6B" : RENK.turuncuButon,
            borderRadius: 18,
            padding: "18px 44px 18px 34px",
            display: "flex",
            alignItems: "center",
            gap: 22,
            boxShadow: "0 10px 30px rgba(0,0,0,0.45)",
          }}
        >
          <div style={{ width: 0, height: 0, borderTop: "30px solid transparent", borderBottom: "30px solid transparent", borderLeft: `48px solid ${RENK.krem}` }} />
          <span style={{ fontFamily: FONT.metin, fontWeight: 800, fontSize: 76, color: RENK.krem, letterSpacing: 1 }}>{basili ? "ABONE OLUNDU" : "ABONE OL"}</span>
        </div>
      </div>
    </AbsoluteFill>
  );
};

// Instagram etiketi: siyah daire içinde ikon + beyaz kalın kullanıcı adı
export const InstagramEtiketi: React.FC<{ kullanici: string; x: number; y: number; gecikme?: number; sure: number }> = ({ kullanici, x, y, gecikme = 0, sure }) => {
  const frame = useCurrentFrame() - gecikme;
  const { fps } = useVideoConfig();
  const s = spring({ frame, fps, config: { damping: 14 } });
  const cikis = interpolate(frame, [sure - gecikme - 10, sure - gecikme], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  return (
    <div style={{ position: "absolute", left: x, top: y, display: "flex", alignItems: "center", gap: 24, opacity: Math.min(s, cikis), transform: `translateY(${interpolate(s, [0, 1], [40, 0])}px)` }}>
      <div style={{ width: 150, height: 150, borderRadius: 75, background: "#000", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <div style={{ width: 84, height: 84, border: "8px solid white", borderRadius: 24, position: "relative", boxSizing: "border-box" }}>
          <div style={{ position: "absolute", left: "50%", top: "50%", width: 36, height: 36, border: "7px solid white", borderRadius: 18, transform: "translate(-50%,-50%)", boxSizing: "border-box" }} />
          <div style={{ position: "absolute", right: 8, top: 8, width: 9, height: 9, background: "white", borderRadius: 5 }} />
        </div>
      </div>
      <span style={{ fontFamily: FONT.metin, fontWeight: 700, fontSize: 70, color: "white", textShadow: "0 3px 12px rgba(0,0,0,0.7)" }}>{kullanici}</span>
    </div>
  );
};
