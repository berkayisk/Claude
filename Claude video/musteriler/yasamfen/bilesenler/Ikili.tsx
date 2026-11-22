// İkiye bölünmüş ekran "hangisi?" videosu (1080x1920): solda 1, sağda 2. Sessiz (trend ses Instagram'da eklenir).
import React from "react";
import { AbsoluteFill, Easing, OffthreadVideo, interpolate, spring, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { YF } from "./OyunGrafikleri";

export type IkiliProps = {
  sol: { src: string; bas: number; odakX?: number };
  sag: { src: string; bas: number; odakX?: number };
  ust: string; baslik: string; alt: string;
};

const Yari: React.FC<{ v: IkiliProps["sol"]; no: string; taraf: "sol" | "sag" }> = ({ v, no, taraf }) => {
  const f = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();
  const g = spring({ frame: f - (taraf === "sol" ? 6 : 12), fps, config: { damping: 12 } });
  const z = interpolate(f, [0, durationInFrames], [1.0, 1.08]);
  return (
    <div style={{ position: "absolute", top: 0, bottom: 0, width: 540, left: taraf === "sol" ? 0 : 540, overflow: "hidden" }}>
      <OffthreadVideo src={staticFile(v.src)} startFrom={Math.round(v.bas * fps)} muted
        style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: `${(v.odakX ?? 0.5) * 100}% 40%`, transform: `scale(${z})` }} />
      <div style={{ position: "absolute", left: "50%", top: 1180, transform: `translateX(-50%) scale(${g})`, width: 150, height: 150, borderRadius: 999,
        background: YF.kirmizi, color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: YF.baslik, fontWeight: 900, fontSize: 96,
        boxShadow: "0 12px 30px rgba(0,0,0,0.4)", border: "6px solid #fff" }}>{no}</div>
    </div>
  );
};

export const Ikili: React.FC<IkiliProps> = (p) => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const g = interpolate(f, [0, 10], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.out(Easing.back(1.5)) });
  const nabiz = 1 + 0.04 * Math.sin((f / fps) * Math.PI * 2);
  return (
    <AbsoluteFill style={{ backgroundColor: "#000" }}>
      <Yari v={p.sol} no="1" taraf="sol" />
      <Yari v={p.sag} no="2" taraf="sag" />
      <div style={{ position: "absolute", left: 537, top: 0, bottom: 0, width: 6, background: "#fff" }} />
      <AbsoluteFill style={{ background: "linear-gradient(180deg, rgba(0,0,0,0.55) 0%, rgba(0,0,0,0) 22%, rgba(0,0,0,0) 70%, rgba(0,0,0,0.55) 100%)" }} />
      <AbsoluteFill style={{ alignItems: "center", paddingTop: 250 }}>
        <div style={{ background: YF.kirmizi, color: "#fff", fontFamily: YF.baslik, fontWeight: 800, fontSize: 38, letterSpacing: 3, padding: "10px 30px", borderRadius: 999, opacity: g }}>{p.ust}</div>
        <div style={{ fontFamily: YF.baslik, fontWeight: 900, fontSize: 104, color: "#fff", textAlign: "center", lineHeight: 1, marginTop: 16, textShadow: "0 6px 26px rgba(0,0,0,0.7)",
          transform: `scale(${(0.8 + 0.2 * g) * nabiz})` }}>{p.baslik}</div>
      </AbsoluteFill>
      <AbsoluteFill style={{ justifyContent: "flex-end", alignItems: "center", paddingBottom: 300 }}>
        <div style={{ background: "#fff", color: YF.antrasit, fontFamily: YF.baslik, fontWeight: 900, fontSize: 52, padding: "18px 40px", borderRadius: 999,
          boxShadow: "0 12px 30px rgba(0,0,0,0.4)", borderBottom: `8px solid ${YF.kirmizi}` }}>{p.alt}</div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
