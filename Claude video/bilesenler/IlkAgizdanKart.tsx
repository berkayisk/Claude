import React from "react";
import { AbsoluteFill, Img, interpolate, useCurrentFrame, Easing } from "remotion";
import { RENK, FONT } from "./marka";

// Kontur efekti: krem iç + turuncu dış çizgi (drop-shadow zinciri)
const kontur = (renk: string, r: number) =>
  [0, 45, 90, 135, 180, 225, 270, 315]
    .map((a) => `drop-shadow(${(Math.cos((a * Math.PI) / 180) * r).toFixed(1)}px ${(Math.sin((a * Math.PI) / 180) * r).toFixed(1)}px 0 ${renk})`)
    .join(" ");

const FircaDarbesi: React.FC<{ style: React.CSSProperties; ters?: boolean }> = ({ style, ters }) => (
  <svg viewBox="0 0 600 400" style={{ position: "absolute", ...style, transform: ters ? "scaleX(-1)" : undefined }}>
    <g fill={RENK.turuncu}>
      <path d="M0 260 C120 220 260 150 420 120 C470 110 540 90 600 60 L600 110 C520 150 430 170 330 210 C220 255 120 300 0 330 Z" opacity="0.95" />
      <path d="M0 330 C140 300 260 260 380 230 C450 212 520 200 600 170 L600 200 C500 240 380 270 250 310 C160 338 80 360 0 380 Z" opacity="0.85" />
      <path d="M40 200 C160 170 300 120 470 70 L480 85 C330 140 200 185 60 225 Z" opacity="0.7" />
      <path d="M0 395 C150 370 330 320 600 250 L600 262 C360 330 170 380 0 400 Z" opacity="0.6" />
    </g>
  </svg>
);

const Yarimton: React.FC<{ style: React.CSSProperties }> = ({ style }) => (
  <div
    style={{
      position: "absolute",
      backgroundImage: `radial-gradient(circle, ${RENK.turuncu} 38%, transparent 42%)`,
      backgroundSize: "26px 26px",
      WebkitMaskImage: "radial-gradient(ellipse at center, black 10%, transparent 70%)",
      maskImage: "radial-gradient(ellipse at center, black 10%, transparent 70%)",
      ...style,
    }}
  />
);

// "Berkay Işık ile İLK AĞIZDAN" soru geçiş kartı. Giriş: punch-in (büyükten normale), çıkış: dışarıda crossfade ile yapılır.
export const IlkAgizdanKart: React.FC<{ konuk: string; sunucu: string; sunucuAdi?: string }> = ({ konuk, sunucu, sunucuAdi = "Berkay Işık" }) => {
  const frame = useCurrentFrame();
  const olcek = interpolate(frame, [0, 5], [1.12, 1], { extrapolateRight: "clamp", easing: Easing.out(Easing.cubic) });
  const kisiFiltre = "drop-shadow(0 18px 30px rgba(0,0,0,0.5))"; // kontur PNG'de hazır (araclar/kontur.py)
  const golge = "5px 6px 0 rgba(0,0,0,0.75)";
  return (
    <AbsoluteFill style={{ background: `radial-gradient(ellipse at 50% 40%, #12284a 0%, ${RENK.kartLacivert} 55%, #050d1c 100%)`, transform: `scale(${olcek})`, overflow: "hidden" }}>
      {/* doku */}
      <AbsoluteFill style={{ opacity: 0.12, backgroundImage: "repeating-linear-gradient(115deg, rgba(255,255,255,0.15) 0 2px, transparent 2px 9px)" }} />
      <Yarimton style={{ left: -60, top: 180, width: 520, height: 520 }} />
      <Yarimton style={{ right: -40, top: -60, width: 600, height: 520 }} />
      <Yarimton style={{ right: 80, bottom: -120, width: 460, height: 420 }} />
      <FircaDarbesi style={{ left: -60, top: 330, width: 820, height: 560 }} />
      <FircaDarbesi style={{ right: -80, top: 120, width: 820, height: 560 }} ters />
      <FircaDarbesi style={{ right: -40, bottom: -160, width: 700, height: 480 }} ters />

      {/* kişiler */}
      <Img src={konuk} style={{ position: "absolute", left: 20, bottom: -30, height: 960, filter: kisiFiltre }} />
      <Img src={sunucu} style={{ position: "absolute", right: 10, bottom: -40, height: 900, filter: kisiFiltre }} />

      {/* tırnaklar */}
      <div style={{ position: "absolute", left: 40, top: -30, fontFamily: FONT.serif, fontWeight: 700, fontStyle: "italic", fontSize: 330, color: RENK.krem, textShadow: golge }}>“</div>
      <div style={{ position: "absolute", right: 60, top: 40, fontFamily: FONT.serif, fontWeight: 700, fontStyle: "italic", fontSize: 330, color: RENK.krem, textShadow: golge }}>”</div>

      {/* başlık */}
      <div style={{ position: "absolute", left: 0, right: 0, top: 120, display: "flex", flexDirection: "column", alignItems: "center", transform: "translateX(-20px) rotate(-3deg)" }}>
        <div style={{ fontFamily: FONT.serif, fontWeight: 700, fontStyle: "italic", fontSize: 76, color: RENK.krem, textShadow: golge }}>{sunucuAdi} ile</div>
        <svg width="520" height="26" viewBox="0 0 520 26" style={{ marginTop: -4 }}>
          <path d="M5 18 C120 6 300 4 515 10 L512 20 C300 16 140 18 8 24 Z" fill={RENK.turuncu} />
        </svg>
        <div style={{ fontFamily: FONT.baslik, fontSize: 230, lineHeight: 0.98, color: RENK.krem, textShadow: "8px 9px 0 rgba(0,0,0,0.8)", marginTop: 6, textAlign: "center", letterSpacing: 2 }}>
          İLK
          <br />
          AĞIZDAN
        </div>
      </div>
    </AbsoluteFill>
  );
};
