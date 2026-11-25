import React from "react";
import { AbsoluteFill, Img } from "remotion";
import "@fontsource/anton/400.css";

// Etkileşim Sihirbazı Reels kapağı (1080x1920) — marka/etkilesim-sihirbazi/MARKA.md "Reels kapak stili"
// Hesabın kapak dili: büyük Anton başlık (beyaz + sarı), kırmızı fırça şerit, sarı grunge darbeleri, kişi altta ortada, tuğla duvar.
// Instagram profil ızgarası ortadaki 1080x1440'ı (y 240-1680) gösterir: başlık ve yüz bu alanın içinde.
const ANTON = "'Anton', sans-serif";
const SARI = "#FFE600";
const KIRMIZI = "#E5262B";
const kontur = (px: number) => ({ WebkitTextStroke: `${px}px #000`, paintOrder: "stroke fill" as any });

const Darbe: React.FC<{ renk: string; style: React.CSSProperties; tohum?: number }> = ({ renk, style, tohum = 0 }) => {
  // düzensiz kenarlı fırça darbesi + kopan lekeler
  const lek = [...Array(14)].map((_, i) => {
    const r = Math.sin((i + 1) * 12.9898 + tohum * 78.233) * 43758.5453;
    const f = r - Math.floor(r);
    return { x: 20 + ((i * 53 + tohum * 31) % 360), y: i % 2 ? 4 + f * 12 : 86 + f * 12, r: 2 + f * 6 };
  });
  return (
    <svg viewBox="0 0 400 100" preserveAspectRatio="none" style={{ position: "absolute", ...style }}>
      <path d="M8,22 C50,6 110,16 170,8 C230,2 300,14 360,6 C380,4 392,10 398,18 L390,44 C399,58 388,72 396,88 C340,96 280,86 210,94 C150,99 90,90 40,96 C24,98 10,92 2,86 C10,70 1,54 9,40 Z" fill={renk} />
      {lek.map((l, i) => <circle key={i} cx={l.x} cy={l.y} r={l.r} fill={renk} />)}
    </svg>
  );
};

export type ESKapakProps = {
  arka: string;            // çekimden tam kare (tuğla duvar mekânı)
  kisi: string;            // dekupe kişi (araclar/dekupe.py)
  kisiGenislik: number;    // kişi görselinin ekrandaki genişliği (px)
  kisiX: number;           // kişi görselinin sol kenarı
  kisiY: number;           // kişi görselinin üst kenarı (yüz ~y 950-1050 olacak şekilde)
  satir1: string;          // beyaz üst satır
  satir2: string;          // sarı büyük satır
  satir2Kirmizi?: boolean; // satir2 kırmızı fırça şerit üstünde beyaz (HAPI YUTTUN kapağı gibi)
  alt?: string;            // küçük alt başlık (beyaz, siyah şerit)
  boy1?: number;
  boy2?: number;
};

export const ESKapak: React.FC<ESKapakProps> = ({ arka, kisi, kisiGenislik, kisiX, kisiY, satir1, satir2, satir2Kirmizi, alt, boy1 = 128, boy2 = 210 }) => (
  <AbsoluteFill style={{ background: "#0a0a0a", overflow: "hidden" }}>
    {/* mekân: hafif bulanık, karartılmış */}
    <Img src={arka} style={{ position: "absolute", width: 1080, height: 1920, objectFit: "cover", filter: "blur(10px) brightness(0.55) saturate(1.15)", transform: "scale(1.08)" }} />
    <AbsoluteFill style={{ background: "linear-gradient(180deg, rgba(0,0,0,0.65) 0%, rgba(0,0,0,0.15) 38%, rgba(0,0,0,0) 60%, rgba(0,0,0,0.55) 100%)" }} />
    {/* sarı grunge darbeleri (kişinin arkasında) */}
    <Darbe renk={SARI} tohum={1} style={{ left: -120, top: 820, width: 820, height: 210, transform: "rotate(-14deg)", opacity: 0.95 }} />
    <Darbe renk={SARI} tohum={2} style={{ left: 520, top: 1180, width: 760, height: 170, transform: "rotate(-10deg)", opacity: 0.9 }} />
    {/* kişi */}
    <Img src={kisi} style={{ position: "absolute", width: kisiGenislik, left: kisiX, top: kisiY, filter: "drop-shadow(0 0 3px rgba(255,255,255,0.9)) drop-shadow(0 26px 50px rgba(0,0,0,0.7))" }} />
    {/* başlık */}
    <div style={{ position: "absolute", top: 250, left: 30, right: 30, display: "flex", flexDirection: "column", alignItems: "center", transform: "rotate(-4deg)" }}>
      <div style={{ fontFamily: ANTON, fontSize: boy1, lineHeight: 1.02, color: "white", textAlign: "center", ...kontur(12), textShadow: "0 9px 0 rgba(0,0,0,0.85), 0 16px 34px rgba(0,0,0,0.6)" }}>{satir1}</div>
      <div style={{ position: "relative", marginTop: 6, padding: satir2Kirmizi ? "4px 40px" : 0 }}>
        {satir2Kirmizi ? <Darbe renk={KIRMIZI} tohum={3} style={{ left: 0, top: 0, width: "100%", height: "100%" }} /> : null}
        <div style={{ position: "relative", fontFamily: ANTON, fontSize: boy2, lineHeight: 1.0, color: satir2Kirmizi ? "white" : SARI, textAlign: "center", ...kontur(14), textShadow: "0 10px 0 rgba(0,0,0,0.85), 0 18px 40px rgba(0,0,0,0.6)" }}>{satir2}</div>
      </div>
    </div>
    {alt ? (
      <div style={{ position: "absolute", top: 1500, left: 0, right: 0, display: "flex", justifyContent: "center", transform: "rotate(-3deg)" }}>
        <div style={{ position: "relative", padding: "10px 46px" }}>
          <Darbe renk="#000" tohum={4} style={{ left: 0, top: 0, width: "100%", height: "100%", opacity: 0.88 }} />
          <div style={{ position: "relative", fontFamily: ANTON, fontSize: 74, color: "white", textAlign: "center", lineHeight: 1.1 }}>{alt}</div>
        </div>
      </div>
    ) : null}
  </AbsoluteFill>
);
