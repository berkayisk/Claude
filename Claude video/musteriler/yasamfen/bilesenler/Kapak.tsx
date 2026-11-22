// Yaşamfen Reels kapağı (1080x1920). Logo YOK. Metin Instagram ızgara kırpmasının (orta 1080x1440, y 240–1680) içinde.
import React from "react";
import { AbsoluteFill, Img, staticFile } from "remotion";
import { YF } from "./OyunGrafikleri";

export type KapakProps = {
  arka: string;          // girdiler/ altındaki görsel
  ust: string;           // kırmızı rozet
  satir1: string;        // beyaz büyük başlık
  satir2?: string;       // kırmızı büyük başlık
  alt?: string;          // beyaz hap içinde kısa alt yazı
  odakY?: number;        // arka plan dikey odak (0–1)
  boyut?: number;
};

export const Kapak: React.FC<KapakProps> = ({ arka, ust, satir1, satir2, alt, odakY = 0.4, boyut = 150 }) => (
  <AbsoluteFill style={{ backgroundColor: "#111" }}>
    <Img src={staticFile(arka)} style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: `50% ${odakY * 100}%` }} />
    <AbsoluteFill style={{ background: "linear-gradient(180deg, rgba(0,0,0,0.0) 30%, rgba(0,0,0,0.35) 52%, rgba(0,0,0,0.82) 78%, rgba(0,0,0,0.9) 100%)" }} />
    <AbsoluteFill style={{ justifyContent: "flex-end", alignItems: "center", paddingBottom: 1920 - 1640 }}>
      <div style={{ background: YF.kirmizi, color: "#fff", fontFamily: YF.baslik, fontWeight: 800, fontSize: 40, letterSpacing: 4, padding: "12px 34px", borderRadius: 999,
        boxShadow: "0 10px 30px rgba(0,0,0,0.35)", marginBottom: 22 }}>{ust}</div>
      <div style={{ fontFamily: YF.baslik, fontWeight: 900, fontSize: boyut, lineHeight: 0.98, color: "#fff", textAlign: "center", padding: "0 50px",
        textShadow: "0 8px 30px rgba(0,0,0,0.6)", letterSpacing: -1 }}>{satir1}</div>
      {satir2 && <div style={{ fontFamily: YF.baslik, fontWeight: 900, fontSize: boyut, lineHeight: 0.98, color: YF.kirmiziAcik, textAlign: "center", padding: "0 50px",
        textShadow: "0 8px 30px rgba(0,0,0,0.6)", letterSpacing: -1 }}>{satir2}</div>}
      {alt && <div style={{ marginTop: 28, background: "#fff", color: YF.antrasit, fontFamily: YF.metin, fontWeight: 700, fontSize: 44, padding: "14px 34px", borderRadius: 999,
        boxShadow: "0 10px 30px rgba(0,0,0,0.35)" }}>{alt}</div>}
    </AbsoluteFill>
  </AbsoluteFill>
);
