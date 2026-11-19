import React from "react";
import { AbsoluteFill, Img } from "remotion";
import { RENK, FONT } from "./marka";

// YouTube thumbnail (1920x1080 render, 1280x720 oranı) — Sıfırdan Satışa / İlk Ağızdan stili.
// Sağ alt köşe (video süresi rozeti) boş bırakılır.
export type ThumbSatir = { metin: string; boyut: number; kutu?: boolean; renk?: string; egim?: number };
export const Thumbnail: React.FC<{ konuk: string; sunucu: string; satirlar: ThumbSatir[]; ust?: string; emoji?: string; emojiPoz?: { x: number; y: number; boyut: number; donme?: number } }> = ({ konuk, sunucu, satirlar, ust, emoji, emojiPoz }) => {
  const golge = "10px 12px 0 rgba(0,0,0,0.85)";
  const fircalar = [
    { top: 640, left: -120, w: 1100, h: 120, r: -14 },
    { top: 120, left: 1000, w: 1100, h: 90, r: -10 },
    { top: 870, left: 900, w: 1200, h: 70, r: -8 },
  ];
  return (
    <AbsoluteFill style={{ background: `radial-gradient(ellipse at 50% 45%, #183463 0%, ${RENK.kartLacivert} 55%, #040b18 100%)`, overflow: "hidden" }}>
      {/* yarım ton ve fırça darbeleri */}
      <AbsoluteFill style={{ backgroundImage: `radial-gradient(circle, ${RENK.turuncu} 36%, transparent 40%)`, backgroundSize: "30px 30px", opacity: 0.28, WebkitMaskImage: "radial-gradient(ellipse at 50% 50%, transparent 35%, black 80%)", maskImage: "radial-gradient(ellipse at 50% 50%, transparent 35%, black 80%)" }} />
      {fircalar.map((f, i) => (
        <div key={i} style={{ position: "absolute", top: f.top, left: f.left, width: f.w, height: f.h, background: RENK.turuncu, transform: `rotate(${f.r}deg)`, borderRadius: "40% 10% 60% 15%", opacity: 0.92 }} />
      ))}
      {/* kişiler: yüzler büyük, iki yanda */}
      <Img src={konuk} style={{ position: "absolute", left: -60, top: 70, height: 1330, filter: "drop-shadow(0 25px 40px rgba(0,0,0,0.6))" }} />
      <Img src={sunucu} style={{ position: "absolute", right: -170, top: 90, height: 1250, filter: "drop-shadow(0 25px 40px rgba(0,0,0,0.6))" }} />
      {/* marka rozeti */}
      <div style={{ position: "absolute", top: 34, left: 0, right: 0, display: "flex", justifyContent: "center" }}>
        <div style={{ fontFamily: FONT.metin, fontWeight: 800, fontSize: 40, letterSpacing: 5, color: RENK.krem, background: RENK.lacivert, border: `4px solid ${RENK.turuncu}`, padding: "8px 30px", borderRadius: 60, boxShadow: "0 8px 20px rgba(0,0,0,0.5)" }}>{ust ?? "İLK AĞIZDAN"}</div>
      </div>
      {/* başlık */}
      <div style={{ position: "absolute", top: 150, left: 560, width: 800, display: "flex", flexDirection: "column", alignItems: "center", gap: 6 }}>
        {satirlar.map((s, i) => (
          <div
            key={i}
            style={{
              fontFamily: FONT.baslik,
              fontSize: s.boyut,
              lineHeight: 1.0,
              color: s.renk ?? RENK.krem,
              background: s.kutu ? RENK.turuncu : "transparent",
              padding: s.kutu ? "4px 30px 0" : 0,
              transform: `rotate(${s.egim ?? -3}deg)`,
              textShadow: s.kutu ? "none" : golge,
              boxShadow: s.kutu ? golge : "none",
              WebkitTextStroke: s.kutu ? "0" : "4px black",
              paintOrder: "stroke fill",
              whiteSpace: "nowrap",
            }}
          >
            {s.metin}
          </div>
        ))}
      </div>
      {emoji && emojiPoz ? (
        <div style={{ position: "absolute", left: emojiPoz.x, top: emojiPoz.y, fontSize: emojiPoz.boyut, fontFamily: "'Noto Color Emoji', sans-serif", transform: `rotate(${emojiPoz.donme ?? 0}deg)`, filter: "drop-shadow(0 16px 24px rgba(0,0,0,0.6))" }}>{emoji}</div>
      ) : null}
    </AbsoluteFill>
  );
};
