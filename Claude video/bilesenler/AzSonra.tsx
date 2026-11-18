import React from "react";
import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig, Easing } from "remotion";
import { RENK, FONT } from "./marka";

// Kamera vizörü çerçevesi: köşe çizgileri, pil, yanıp sönen REC, 4K 60FPS / HD, odak köşeleri
export const Vizor: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const recAcik = Math.floor(frame / (fps * 0.5)) % 2 === 0;
  const c = "rgba(255,255,255,0.95)";
  const kalin = 4;
  const kose = (style: React.CSSProperties, bl: boolean, br: boolean, bt: boolean, bb: boolean) => (
    <div
      style={{
        position: "absolute",
        width: 200,
        height: 200,
        borderLeft: bl ? `${kalin}px solid ${c}` : undefined,
        borderRight: br ? `${kalin}px solid ${c}` : undefined,
        borderTop: bt ? `${kalin}px solid ${c}` : undefined,
        borderBottom: bb ? `${kalin}px solid ${c}` : undefined,
        ...style,
      }}
    />
  );
  const odak = (style: React.CSSProperties, bl: boolean, br: boolean, bt: boolean, bb: boolean) => (
    <div
      style={{
        position: "absolute",
        width: 55,
        height: 55,
        borderLeft: bl ? `3px solid ${c}` : undefined,
        borderRight: br ? `3px solid ${c}` : undefined,
        borderTop: bt ? `3px solid ${c}` : undefined,
        borderBottom: bb ? `3px solid ${c}` : undefined,
        ...style,
      }}
    />
  );
  const yazi: React.CSSProperties = {
    position: "absolute",
    color: c,
    fontFamily: FONT.metin,
    fontWeight: 400,
    fontSize: 44,
    textShadow: "0 2px 6px rgba(0,0,0,0.5)",
  };
  return (
    <AbsoluteFill>
      {kose({ left: 60, top: 60 }, true, false, true, false)}
      {kose({ right: 60, top: 60 }, false, true, true, false)}
      {kose({ left: 60, bottom: 60 }, true, false, false, true)}
      {kose({ right: 60, bottom: 60 }, false, true, false, true)}
      {/* odak köşeleri */}
      {odak({ left: 725, top: 410 }, true, false, true, false)}
      {odak({ right: 725, top: 410 }, false, true, true, false)}
      {odak({ left: 725, bottom: 410 }, true, false, false, true)}
      {odak({ right: 725, bottom: 410 }, false, true, false, true)}
      {/* pil */}
      <div style={{ position: "absolute", left: 120, top: 105, width: 84, height: 38, border: `4px solid ${c}`, borderRadius: 7 }}>
        <div style={{ position: "absolute", left: 4, top: 4, bottom: 4, width: 50, background: c, borderRadius: 2 }} />
        <div style={{ position: "absolute", right: -12, top: 9, width: 6, height: 12, background: c, borderRadius: 2 }} />
      </div>
      {/* REC */}
      <div style={{ ...yazi, right: 120, top: 92, display: "flex", alignItems: "center", gap: 16 }}>
        <div style={{ width: 30, height: 30, borderRadius: 15, background: recAcik ? "#FF1E1E" : "transparent" }} />
        <span>REC</span>
      </div>
      <div style={{ ...yazi, left: 110, bottom: 98 }}>4K 60FPS</div>
      <div style={{ ...yazi, right: 120, bottom: 98 }}>HD</div>
    </AbsoluteFill>
  );
};

// "AZ SONRA" yazısı: aşağıdan kayarak gelir
export const AzSonraYazi: React.FC<{ boyut?: number }> = ({ boyut = 130 }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const s = spring({ frame, fps, config: { damping: 14, stiffness: 120 } });
  const y = interpolate(s, [0, 1], [boyut * 0.7, 0]);
  const op = interpolate(frame, [0, 8], [0, 1], { extrapolateRight: "clamp" });
  const golge = `${boyut * 0.03}px ${boyut * 0.03}px 0 rgba(0,0,0,0.55), 0 0 ${boyut * 0.12}px rgba(0,0,0,0.35)`;
  return (
    <AbsoluteFill style={{ justifyContent: "flex-end", alignItems: "center", paddingBottom: 90 }}>
      <div
        style={{
          transform: `translateY(${y}px)`,
          opacity: op,
          fontFamily: FONT.baslik,
          fontSize: boyut,
          lineHeight: 1,
          letterSpacing: 2,
          display: "flex",
          gap: boyut * 0.14,
        }}
      >
        <span style={{ color: RENK.krem, textShadow: golge }}>AZ</span>
        <span style={{ color: RENK.turuncu, textShadow: golge }}>SONRA</span>
      </div>
    </AbsoluteFill>
  );
};

// Işık sızıntısı / flaş geçişi. `sure` kare boyunca oynar, ortasında tepe yapar.
export const IsikGecisi: React.FC<{ sure: number }> = ({ sure }) => {
  const frame = useCurrentFrame();
  const t = frame / sure;
  const guc = interpolate(t, [0, 0.45, 0.55, 1], [0, 1, 1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.inOut(Easing.quad),
  });
  const x = interpolate(t, [0, 1], [-20, 120]);
  return (
    <AbsoluteFill style={{ mixBlendMode: "screen", pointerEvents: "none" }}>
      <AbsoluteFill
        style={{
          opacity: guc,
          background: `radial-gradient(ellipse 70% 55% at ${x}% 45%, rgba(255,255,255,1) 0%, rgba(255,240,220,0.95) 25%, rgba(255,150,60,0.6) 45%, rgba(255,40,90,0.25) 65%, rgba(0,0,0,0) 80%)`,
        }}
      />
      <AbsoluteFill
        style={{
          opacity: guc * 0.8,
          background: `linear-gradient(${100 + t * 40}deg, rgba(0,0,0,0) 20%, rgba(255,80,60,0.6) 38%, rgba(255,220,80,0.6) 48%, rgba(80,255,160,0.45) 56%, rgba(60,140,255,0.5) 64%, rgba(180,80,255,0.4) 72%, rgba(0,0,0,0) 85%)`,
        }}
      />
      <AbsoluteFill style={{ opacity: interpolate(t, [0.4, 0.5, 0.6], [0, 0.85, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }), background: "white" }} />
    </AbsoluteFill>
  );
};
