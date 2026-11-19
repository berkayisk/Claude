import React from "react";
import { AbsoluteFill, Audio, Img, OffthreadVideo, Sequence, interpolate, random, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { RENK, FONT } from "./marka";

// Dikey (1080x1920) Shorts / Reels / TikTok şablonu — Sıfırdan Satışa stili
// Güvenli alan: üst 0-190 (uygulama arayüzü), alt 1480+ (açıklama), sağ 920+ (butonlar). Yazılar yüzlere binmez.
type Yuz = { ust: number; alt: number; cy: number };
export type ShortVeri = {
  id: string;
  kanca: string[];
  vurgu: string[];
  parcalar: { bas: number; kare: number; duzen: "konuk" | "sunucu" | "ikili"; zoom: boolean; yuz: { konuk: Yuz; sunucu: Yuz } }[];
  altyazi: { w: string; s: number; e: number }[];
  broll: { s: number; sure: number; emoji: string; etiket: string }[];
  toplamKare: number;
};
type Kaynak = { konuk: string; sunucu: string; ses: string; foto: string; muzik?: string; whoosh?: string };

const tr = (s: string) => s.toLocaleUpperCase("tr-TR");
const temiz = (s: string) => s.replace(/[.,!…]+$/g, "");
const ZOOM = 1.07;
const IKILI_UST_HEDEF = 500; // üst yarıda yüz merkezi
const IKILI_ALT_HEDEF = 340; // alt yarıda yüz merkezi (alt arayüzden uzak dursun)
const KANCA_BUYUK = 96; // kare: büyük başlık süresi

// ---------- Görüntü ----------
const Tam: React.FC<{ src: string; bas: number; zoom: boolean; cy: number }> = ({ src, bas, zoom, cy }) => (
  <AbsoluteFill style={{ overflow: "hidden" }}>
    <OffthreadVideo src={src} startFrom={Math.round(bas * 30)} muted style={{ width: 1080, height: 1920, transform: `scale(${zoom ? ZOOM : 1})`, transformOrigin: `540px ${cy}px` }} />
  </AbsoluteFill>
);

const Yarim: React.FC<{ src: string; bas: number; cy: number; hedef: number }> = ({ src, bas, cy, hedef }) => {
  const ty = Math.max(-960, Math.min(0, hedef - cy));
  return (
    <div style={{ width: 1080, height: 960, overflow: "hidden", position: "relative" }}>
      <OffthreadVideo src={src} startFrom={Math.round(bas * 30)} muted style={{ width: 1080, height: 1920, position: "absolute", top: ty }} />
    </div>
  );
};

const zamanCizelgesi = (v: ShortVeri) => {
  let t = 0;
  return v.parcalar.map((p) => {
    const from = t;
    t += p.kare;
    return { ...p, from };
  });
};

const Goruntu: React.FC<{ v: ShortVeri; k: Kaynak }> = ({ v, k }) => (
  <>
    {zamanCizelgesi(v).map((p, i) => (
      <Sequence key={i} from={p.from} durationInFrames={p.kare}>
        {p.duzen === "ikili" ? (
          <AbsoluteFill>
            <Yarim src={k.sunucu} bas={p.bas} cy={p.yuz.sunucu.cy} hedef={IKILI_UST_HEDEF} />
            <Yarim src={k.konuk} bas={p.bas} cy={p.yuz.konuk.cy} hedef={IKILI_ALT_HEDEF} />
            <div style={{ position: "absolute", top: 955, left: 0, right: 0, height: 10, background: RENK.turuncu }} />
          </AbsoluteFill>
        ) : (
          <Tam src={p.duzen === "konuk" ? k.konuk : k.sunucu} bas={p.bas} zoom={p.zoom} cy={p.yuz[p.duzen].cy} />
        )}
        <Audio src={k.ses} startFrom={Math.round(p.bas * 30)} />
      </Sequence>
    ))}
  </>
);

// Şu anki parçaya göre altyazının başlayacağı y (yüzün altı)
const altyaziY = (v: ShortVeri, frame: number) => {
  const p = zamanCizelgesi(v).find((x) => frame >= x.from && frame < x.from + x.kare) ?? v.parcalar[0];
  if (p.duzen === "ikili") {
    const ustCene = IKILI_UST_HEDEF + (p.yuz.sunucu.alt - p.yuz.sunucu.cy);
    return Math.max(640, ustCene + 50);
  }
  const y = p.yuz[p.duzen];
  const alt = y.cy + (y.alt - y.cy) * (p.zoom ? ZOOM : 1);
  return Math.min(1250, Math.max(1150, alt + 110));
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
    if (!cur || cur.kelimeler.length >= 3 || uzunluk > 15 || (son && /[.?!,]$/.test(son.w)) || (son && w.s - son.e > 0.45)) {
      cur = { kelimeler: [], s: w.s, e: w.e };
      out.push(cur);
    }
    cur.kelimeler.push(w);
    cur.e = w.e;
  }
  for (let i = 0; i < out.length - 1; i++) if (out[i + 1].s - out[i].e < 0.35) out[i].e = out[i + 1].s;
  return out;
};

const Altyazi: React.FC<{ v: ShortVeri }> = ({ v }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = frame / fps;
  const sayfalar = React.useMemo(() => sayfala(v.altyazi), [v]);
  const vurgu = new Set(v.vurgu.map((x) => x.toLocaleLowerCase("tr-TR")));
  const sayfa = sayfalar.find((p) => t >= p.s && t < p.e + 0.12);
  if (!sayfa) return null;
  const giris = spring({ frame: frame - Math.round(sayfa.s * fps), fps, config: { damping: 12, stiffness: 260 } });
  const y = altyaziY(v, frame);
  return (
    <div style={{ position: "absolute", top: y, left: 60, width: 840, display: "flex", flexWrap: "wrap", justifyContent: "center", gap: "4px 20px", transform: `scale(${interpolate(giris, [0, 1], [0.82, 1])})` }}>
      {sayfa.kelimeler.map((w, i) => {
        const aktif = t >= w.s - 0.03 && t < w.e + 0.05;
        const vurgulu = vurgu.has(temiz(w.w).toLocaleLowerCase("tr-TR").replace(/[?]/g, ""));
        const kutu = vurgulu && aktif;
        return (
          <span
            key={i}
            style={{
              fontFamily: FONT.metin,
              fontWeight: 800,
              fontSize: vurgulu ? 96 : 84,
              lineHeight: 1.12,
              color: kutu ? RENK.krem : aktif ? RENK.turuncu : vurgulu ? "#FFC247" : "white",
              background: kutu ? RENK.turuncu : "transparent",
              borderRadius: 16,
              padding: kutu ? "0 16px" : 0,
              transform: `scale(${aktif ? 1.08 : 1}) rotate(${kutu ? -2 : 0}deg)`,
              WebkitTextStroke: kutu ? "0px" : "12px black",
              paintOrder: "stroke fill",
              textShadow: "0 8px 18px rgba(0,0,0,0.55)",
            }}
          >
            {tr(temiz(w.w))}
          </span>
        );
      })}
    </div>
  );
};

// ---------- Başlık (büyük -> ince şerit), çağrı ----------
const Kanca: React.FC<{ v: ShortVeri; cagriBas: number }> = ({ v, cagriBas }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const s = spring({ frame, fps, config: { damping: 11, stiffness: 160 } });
  const s2 = spring({ frame: frame - 6, fps, config: { damping: 10, stiffness: 180 } });
  const buyukOp = interpolate(frame, [KANCA_BUYUK - 8, KANCA_BUYUK], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const ince = spring({ frame: frame - KANCA_BUYUK + 4, fps, config: { damping: 14 } });
  const inceCik = interpolate(frame, [cagriBas - 6, cagriBas], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  return (
    <AbsoluteFill style={{ alignItems: "center" }}>
      {buyukOp > 0 && (
        <div style={{ position: "absolute", top: 200, display: "flex", flexDirection: "column", alignItems: "center", transform: `scale(${interpolate(s, [0, 1], [0.6, 1])})`, opacity: Math.min(s, buyukOp) }}>
          <div style={{ fontFamily: FONT.metin, fontWeight: 700, fontSize: 28, letterSpacing: 4, color: RENK.krem, background: "rgba(2,26,59,0.85)", padding: "6px 20px", borderRadius: 40, marginBottom: 12, border: `2px solid ${RENK.turuncu}` }}>
            İLK AĞIZDAN • SIFIRDAN SATIŞA
          </div>
          <div style={{ fontFamily: FONT.baslik, fontSize: 92, lineHeight: 1.0, color: RENK.krem, textShadow: "6px 7px 0 rgba(0,0,0,0.85)" }}>{v.kanca[0]}</div>
          <div style={{ fontFamily: FONT.baslik, fontSize: 112, lineHeight: 1.05, color: RENK.krem, background: RENK.turuncu, padding: "0 24px", marginTop: 6, transform: `rotate(-2deg) scale(${interpolate(s2, [0, 1], [0.5, 1])})`, boxShadow: "8px 9px 0 rgba(0,0,0,0.8)" }}>
            {v.kanca[1]}
          </div>
        </div>
      )}
      {frame >= KANCA_BUYUK - 4 && (
        <div style={{ position: "absolute", top: 196, display: "flex", alignItems: "center", gap: 14, opacity: Math.min(ince, inceCik), transform: `translateY(${interpolate(ince, [0, 1], [-30, 0])}px)` }}>
          <span style={{ fontFamily: FONT.baslik, fontSize: 56, color: RENK.krem, textShadow: "4px 5px 0 rgba(0,0,0,0.85)" }}>{v.kanca[0]}</span>
          <span style={{ fontFamily: FONT.baslik, fontSize: 58, color: RENK.krem, background: RENK.turuncu, padding: "0 14px", transform: "rotate(-2deg)", boxShadow: "5px 6px 0 rgba(0,0,0,0.8)" }}>{v.kanca[1]}</span>
        </div>
      )}
    </AbsoluteFill>
  );
};

const Ilerleme: React.FC<{ toplam: number }> = ({ toplam }) => {
  const frame = useCurrentFrame();
  return <div style={{ position: "absolute", top: 0, left: 0, height: 12, width: `${(frame / toplam) * 100}%`, background: RENK.turuncu, boxShadow: "0 0 12px rgba(246,113,2,0.8)" }} />;
};

const Cagri: React.FC<{ foto: string }> = ({ foto }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const s = spring({ frame, fps, config: { damping: 12, stiffness: 150 } });
  return (
    <AbsoluteFill style={{ alignItems: "center" }}>
      <div style={{ position: "absolute", top: 190, display: "flex", alignItems: "center", gap: 18, background: RENK.lacivert, border: `4px solid ${RENK.turuncu}`, borderRadius: 80, padding: "10px 36px 10px 10px", transform: `scale(${interpolate(s, [0, 1], [0.5, 1])})`, opacity: s, boxShadow: "0 12px 30px rgba(0,0,0,0.5)" }}>
        <Img src={foto} style={{ width: 84, height: 84, borderRadius: 42 }} />
        <div>
          <div style={{ fontFamily: FONT.metin, fontWeight: 800, fontSize: 42, color: RENK.krem }}>TAMAMI KANALDA ▶</div>
          <div style={{ fontFamily: FONT.metin, fontWeight: 600, fontSize: 28, color: RENK.turuncu }}>Sıfırdan Satışa</div>
        </div>
      </div>
    </AbsoluteFill>
  );
};

// ---------- B-roll kartı ----------
const BRoll: React.FC<{ b: ShortVeri["broll"][number] }> = ({ b }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const sure = Math.round(b.sure * fps);
  const giris = spring({ frame, fps, config: { damping: 9, stiffness: 200 } });
  const op = interpolate(frame, [0, 3, sure - 4, sure], [0, 1, 1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const adim = Math.floor(frame / 2.5);
  const r = (k: string, a: number) => (random(`${k}${adim}`) * 2 - 1) * a;
  const sayac = b.emoji === "SAYAC95";
  const deger = Math.round(interpolate(frame, [0, sure * 0.6], [0, 95], { extrapolateRight: "clamp" }));
  return (
    <AbsoluteFill style={{ opacity: op, background: `radial-gradient(ellipse at 50% 40%, #16305a 0%, ${RENK.kartLacivert} 55%, #050d1c 100%)`, overflow: "hidden" }}>
      <AbsoluteFill style={{ backgroundImage: `radial-gradient(circle, ${RENK.turuncu} 36%, transparent 40%)`, backgroundSize: "28px 28px", backgroundPosition: `${adim * 5}px ${adim * 3}px`, opacity: 0.22, WebkitMaskImage: "radial-gradient(ellipse at 50% 45%, transparent 30%, black 75%)", maskImage: "radial-gradient(ellipse at 50% 45%, transparent 30%, black 75%)" }} />
      <div style={{ position: "absolute", left: -100, right: -100, top: 1040 + r("f", 5), height: 70, background: RENK.turuncu, transform: `rotate(-6deg)`, opacity: 0.9 }} />
      <AbsoluteFill style={{ justifyContent: "flex-start", alignItems: "center" }}>
        <div style={{ position: "absolute", top: 520, transform: `scale(${interpolate(giris, [0, 1], [0.3, 1])}) rotate(${r("e", 3)}deg)`, fontSize: sayac ? 330 : 300, lineHeight: 1, textAlign: "center", fontFamily: sayac ? FONT.baslik : "'Noto Color Emoji', sans-serif", color: RENK.krem, textShadow: sayac ? "12px 14px 0 rgba(0,0,0,0.85)" : "0 20px 40px rgba(0,0,0,0.5)", whiteSpace: "nowrap" }}>
          {sayac ? `%${deger}` : b.emoji}
        </div>
        <div style={{ position: "absolute", top: 930, fontFamily: FONT.baslik, fontSize: 104, color: RENK.krem, background: RENK.turuncu, padding: "0 30px", transform: `rotate(-3deg) scale(${interpolate(spring({ frame: frame - 4, fps, config: { damping: 10 } }), [0, 1], [0.4, 1])})`, boxShadow: "10px 12px 0 rgba(0,0,0,0.8)", whiteSpace: "nowrap" }}>
          {b.etiket}
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

export const Short: React.FC<{ v: ShortVeri; k: Kaynak }> = ({ v, k }) => {
  const CAGRI = 75;
  const cagriBas = v.toplamKare - CAGRI;
  return (
    <AbsoluteFill style={{ background: "black" }}>
      <Goruntu v={v} k={k} />
      <AbsoluteFill style={{ background: "linear-gradient(180deg, rgba(0,0,0,0.5) 0%, rgba(0,0,0,0) 20%, rgba(0,0,0,0) 58%, rgba(0,0,0,0.4) 100%)" }} />
      {v.broll.map((b, i) => (
        <Sequence key={`b${i}`} from={Math.round(b.s * 30)} durationInFrames={Math.round(b.sure * 30)}>
          <BRoll b={b} />
          {k.whoosh ? <Audio src={k.whoosh} volume={0.25} /> : null}
        </Sequence>
      ))}
      <Altyazi v={v} />
      <Kanca v={v} cagriBas={cagriBas} />
      <Ilerleme toplam={v.toplamKare} />
      <Sequence from={cagriBas}>
        <Cagri foto={k.foto} />
      </Sequence>
      {k.muzik ? <Audio src={k.muzik} volume={0.1} loop /> : null}
    </AbsoluteFill>
  );
};
