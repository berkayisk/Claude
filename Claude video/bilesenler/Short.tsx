import React from "react";
import { AbsoluteFill, Audio, Img, OffthreadVideo, Sequence, interpolate, spring, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { RENK, FONT } from "./marka";

// Dikey (1080x1920) Shorts şablonu — Sıfırdan Satışa stili
export type ShortVeri = {
  id: string;
  kanca: string[]; // 2 satır: [krem, turuncu]
  vurgu: string[];
  parcalar: { bas: number; kare: number; duzen: "konuk" | "sunucu" | "ikili"; zoom: boolean }[];
  altyazi: { w: string; s: number; e: number }[];
  toplamKare: number;
};
type Kaynak = { konuk: string; sunucu: string; ses: string; foto: string; muzik?: string };

const tr = (s: string) => s.toLocaleUpperCase("tr-TR");
const temiz = (s: string) => s.replace(/[.,!…]+$/g, "").replace(/^[„"“]+|[”"]+$/g, "");

// ---------- Görüntü katmanı ----------
const Dikey: React.FC<{ src: string; bas: number; zoom: boolean; kirpY?: string; yukseklik?: number }> = ({ src, bas, zoom, kirpY = "42%", yukseklik = 1920 }) => {
  const frame = useCurrentFrame();
  const olcek = zoom ? 1.14 : 1.0;
  const nefes = 1 + 0.012 * (frame / 300); // çok yavaş itme, statik görünmesin
  return (
    <div style={{ width: 1080, height: yukseklik, overflow: "hidden", position: "relative" }}>
      <OffthreadVideo
        src={src}
        startFrom={Math.round(bas * 30)}
        muted
        style={{ width: 1080, height: 1920, position: "absolute", top: (yukseklik - 1920) * (parseFloat(kirpY) / 100), transform: `scale(${olcek * nefes})`, transformOrigin: `50% ${kirpY}` }}
      />
    </div>
  );
};

const Goruntu: React.FC<{ v: ShortVeri; k: Kaynak }> = ({ v, k }) => {
  let t = 0;
  return (
    <>
      {v.parcalar.map((p, i) => {
        const from = t;
        t += p.kare;
        return (
          <Sequence key={i} from={from} durationInFrames={p.kare}>
            {p.duzen === "ikili" ? (
              <AbsoluteFill>
                <Dikey src={k.sunucu} bas={p.bas} zoom={false} yukseklik={960} kirpY="40%" />
                <Dikey src={k.konuk} bas={p.bas} zoom={false} yukseklik={960} kirpY="40%" />
                <div style={{ position: "absolute", top: 955, left: 0, right: 0, height: 10, background: RENK.turuncu }} />
              </AbsoluteFill>
            ) : (
              <Dikey src={p.duzen === "konuk" ? k.konuk : k.sunucu} bas={p.bas} zoom={p.zoom} />
            )}
            <Audio src={k.ses} startFrom={Math.round(p.bas * 30)} />
          </Sequence>
        );
      })}
    </>
  );
};

// ---------- Altyazı ----------
type Sayfa = { kelimeler: { w: string; s: number; e: number }[]; s: number; e: number };
const sayfala = (a: ShortVeri["altyazi"]): Sayfa[] => {
  const out: Sayfa[] = [];
  let cur: Sayfa | null = null;
  for (const w of a) {
    const txt = temiz(w.w);
    if (!txt) continue;
    const uzunluk = cur ? cur.kelimeler.map((x) => temiz(x.w)).join(" ").length + txt.length : 0;
    const son = cur?.kelimeler[cur.kelimeler.length - 1];
    const kes = !cur || cur.kelimeler.length >= 3 || uzunluk > 16 || (son && /[.?!,]$/.test(son.w)) || (son && w.s - son.e > 0.5);
    if (kes) {
      cur = { kelimeler: [], s: w.s, e: w.e };
      out.push(cur);
    }
    cur!.kelimeler.push(w);
    cur!.e = w.e;
  }
  // sayfalar arası küçük boşlukları kapat (titreşmesin)
  for (let i = 0; i < out.length - 1; i++) if (out[i + 1].s - out[i].e < 0.35) out[i].e = out[i + 1].s;
  return out;
};

const Altyazi: React.FC<{ v: ShortVeri }> = ({ v }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = frame / fps;
  const sayfalar = React.useMemo(() => sayfala(v.altyazi), [v]);
  const vurgu = new Set(v.vurgu.map((x) => x.toLocaleLowerCase("tr-TR")));
  const sayfa = sayfalar.find((p) => t >= p.s && t < p.e + 0.15);
  if (!sayfa) return null;
  const giris = spring({ frame: frame - Math.round(sayfa.s * fps), fps, config: { damping: 12, stiffness: 260 } });
  return (
    <AbsoluteFill style={{ justifyContent: "flex-start", alignItems: "center" }}>
      <div style={{ position: "absolute", top: 1160, left: 70, width: 830, display: "flex", flexWrap: "wrap", justifyContent: "center", gap: "6px 22px", transform: `scale(${interpolate(giris, [0, 1], [0.82, 1])})` }}>
        {sayfa.kelimeler.map((w, i) => {
          const aktif = t >= w.s - 0.03 && t < w.e + 0.05;
          const vurgulu = vurgu.has(temiz(w.w).toLocaleLowerCase("tr-TR").replace(/[?]/g, ""));
          const metin = tr(temiz(w.w));
          const kutu = vurgulu && aktif;
          return (
            <span
              key={i}
              style={{
                fontFamily: FONT.metin,
                fontWeight: 800,
                fontSize: vurgulu ? 98 : 86,
                lineHeight: 1.15,
                color: kutu ? RENK.krem : aktif ? RENK.turuncu : vurgulu ? "#FFC247" : "white",
                background: kutu ? RENK.turuncu : "transparent",
                borderRadius: 18,
                padding: kutu ? "0 18px" : "0",
                transform: `scale(${aktif ? 1.08 : 1}) rotate(${kutu ? -2 : 0}deg)`,
                WebkitTextStroke: kutu ? "0px" : "12px black",
                paintOrder: "stroke fill",
                textShadow: "0 8px 18px rgba(0,0,0,0.55)",
              }}
            >
              {metin}
            </span>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};

// ---------- Kanca başlığı, ilerleme, çağrı ----------
const Kanca: React.FC<{ v: ShortVeri }> = ({ v }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const s = spring({ frame, fps, config: { damping: 11, stiffness: 160 } });
  const s2 = spring({ frame: frame - 6, fps, config: { damping: 10, stiffness: 180 } });
  return (
    <AbsoluteFill style={{ alignItems: "center" }}>
      <div style={{ position: "absolute", top: 150, display: "flex", flexDirection: "column", alignItems: "center", transform: `scale(${interpolate(s, [0, 1], [0.6, 1])})`, opacity: s }}>
        <div style={{ fontFamily: FONT.metin, fontWeight: 700, fontSize: 30, letterSpacing: 4, color: RENK.krem, background: "rgba(2,26,59,0.85)", padding: "8px 22px", borderRadius: 40, marginBottom: 14, border: `2px solid ${RENK.turuncu}` }}>
          İLK AĞIZDAN • SIFIRDAN SATIŞA
        </div>
        <div style={{ fontFamily: FONT.baslik, fontSize: 96, lineHeight: 1.0, color: RENK.krem, textShadow: "6px 7px 0 rgba(0,0,0,0.85)", textAlign: "center" }}>{v.kanca[0]}</div>
        <div
          style={{
            fontFamily: FONT.baslik,
            fontSize: 118,
            lineHeight: 1.05,
            color: RENK.krem,
            background: RENK.turuncu,
            padding: "0 26px",
            marginTop: 8,
            transform: `rotate(-2deg) scale(${interpolate(s2, [0, 1], [0.5, 1])})`,
            boxShadow: "8px 9px 0 rgba(0,0,0,0.8)",
          }}
        >
          {v.kanca[1]}
        </div>
      </div>
    </AbsoluteFill>
  );
};

const Ilerleme: React.FC<{ toplam: number }> = ({ toplam }) => {
  const frame = useCurrentFrame();
  return (
    <div style={{ position: "absolute", top: 0, left: 0, height: 12, width: `${(frame / toplam) * 100}%`, background: RENK.turuncu, boxShadow: "0 0 12px rgba(246,113,2,0.8)" }} />
  );
};

const Cagri: React.FC<{ foto: string }> = ({ foto }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const s = spring({ frame, fps, config: { damping: 12, stiffness: 150 } });
  return (
    <AbsoluteFill style={{ alignItems: "center" }}>
      <div style={{ position: "absolute", top: 1420, left: 70, display: "flex", alignItems: "center", gap: 20, background: RENK.lacivert, border: `4px solid ${RENK.turuncu}`, borderRadius: 80, padding: "14px 40px 14px 14px", transform: `translateY(${interpolate(s, [0, 1], [200, 0])}px)`, boxShadow: "0 12px 30px rgba(0,0,0,0.5)" }}>
        <Img src={foto} style={{ width: 96, height: 96, borderRadius: 48 }} />
        <div>
          <div style={{ fontFamily: FONT.metin, fontWeight: 800, fontSize: 46, color: RENK.krem }}>TAMAMI KANALDA ▶</div>
          <div style={{ fontFamily: FONT.metin, fontWeight: 600, fontSize: 30, color: RENK.turuncu }}>Sıfırdan Satışa</div>
        </div>
      </div>
    </AbsoluteFill>
  );
};

export const Short: React.FC<{ v: ShortVeri; k: Kaynak }> = ({ v, k }) => {
  const CAGRI = 75;
  return (
    <AbsoluteFill style={{ background: "black" }}>
      <Goruntu v={v} k={k} />
      {/* üst ve alt karartma: yazılar her zeminde okunsun */}
      <AbsoluteFill style={{ background: "linear-gradient(180deg, rgba(0,0,0,0.55) 0%, rgba(0,0,0,0) 26%, rgba(0,0,0,0) 55%, rgba(0,0,0,0.45) 100%)" }} />
      <Kanca v={v} />
      <Altyazi v={v} />
      <Ilerleme toplam={v.toplamKare} />
      <Sequence from={v.toplamKare - CAGRI}>
        <Cagri foto={k.foto} />
      </Sequence>
      {k.muzik ? <Audio src={k.muzik} volume={0.1} loop /> : null}
    </AbsoluteFill>
  );
};
