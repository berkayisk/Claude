import React from "react";
import { AbsoluteFill, Audio, Img, OffthreadVideo, Sequence, interpolate, spring, useCurrentFrame, useVideoConfig, Easing } from "remotion";
import "@fontsource/inter/400.css";
import "@fontsource/inter/600.css";
import "@fontsource/inter/800.css";
import "@fontsource/inter/600-italic.css";
import "@fontsource/inter/800-italic.css";
import { RENK } from "./marka";

// Premium Reels şablonu (talking head + motion graphics) — referans: projeler/2026-11-19_reels-stili/REELS_STIL.md
// Bölgeler (1080x1920): üst arayüz 0-190 | takipçi 200 | yüz ~600-820 | grafik kartları 870-1180 | altyazı 1250+ | alt arayüz 1480+
const INTER = "'Inter', sans-serif";
const EMOJI = "'Noto Color Emoji', sans-serif";
const KIRMIZI = "#FF4D4D";
const YESIL = "#2ED47A";
const KART_Y = 880;
const ALTYAZI_Y = 1250;

type Olay = { tip: string; s: number; son: number; [k: string]: any };
export type ReelsVeri = {
  fps: number;
  parcalar: { src: string; ses?: string; bas: number; kare: number; zoom: boolean }[];
  altyazi: { w: string; s: number; e: number }[];
  olaylar: Olay[];
  vurgu: string[];
  toplamKare: number;
};
type Kaynak = { dosya: (ad: string) => string; foto: string; muzik?: string; sfx: (ad: string) => string; kanal?: string };

// NOT: backdrop-filter kullanma — headless render'da karede bir uygulanıp bir uygulanmıyor (titreme)
const cam: React.CSSProperties = {
  background: "linear-gradient(160deg, rgba(22,30,52,0.90) 0%, rgba(10,14,28,0.88) 100%)",
  border: "1.5px solid rgba(255,255,255,0.18)",
  borderRadius: 30,
  boxShadow: "0 18px 50px rgba(0,0,0,0.45), inset 0 1px 0 rgba(255,255,255,0.12)",
};

const useGiris = (gecikme = 0, d = 14) => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  return spring({ frame: f - gecikme, fps, config: { damping: d, stiffness: 170 } });
};
const useCikis = (sure: number, uzunluk = 8) => {
  const f = useCurrentFrame();
  return interpolate(f, [sure - uzunluk, sure], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
};

// ---------------- Görüntü ----------------
const Goruntu: React.FC<{ v: ReelsVeri; k: Kaynak }> = ({ v, k }) => {
  let t = 0;
  return (
    <>
      {v.parcalar.map((p, i) => {
        const from = t;
        t += p.kare;
        return (
          <Sequence key={i} from={from} durationInFrames={p.kare}>
            <AbsoluteFill style={{ overflow: "hidden" }}>
              <OffthreadVideo src={k.dosya(p.src)} startFrom={Math.round(p.bas * 30)} muted={!!p.ses} style={{ width: 1080, height: 1920, transform: `scale(${p.zoom ? 1.06 : 1})`, transformOrigin: "540px 650px" }} />
            </AbsoluteFill>
            {/* temizlenmiş ses (müzik/gürültü ayrılmış) */}
            {p.ses ? <Audio src={k.dosya(p.ses)} startFrom={Math.round(p.bas * 30)} /> : null}
          </Sequence>
        );
      })}
    </>
  );
};

// ---------------- Altyazı (sade, premium) ----------------
type Sayfa = { k: ReelsVeri["altyazi"]; s: number; e: number };
const temiz = (s: string) => s.replace(/[.,!…]+$/g, "");
const sayfala = (a: ReelsVeri["altyazi"]): Sayfa[] => {
  const out: Sayfa[] = [];
  let c: Sayfa | null = null;
  for (const w of a) {
    const son = c?.k[c.k.length - 1];
    const uz = c ? c.k.map((x) => temiz(x.w)).join(" ").length + temiz(w.w).length : 0;
    if (!c || c.k.length >= 4 || uz > 20 || (son && /[.?!,]$/.test(son.w)) || (son && w.s - son.e > 0.4)) {
      c = { k: [], s: w.s, e: w.e };
      out.push(c);
    }
    c.k.push(w);
    c.e = w.e;
  }
  for (let i = 0; i < out.length - 1; i++) if (out[i + 1].s - out[i].e < 0.3) out[i].e = out[i + 1].s;
  return out;
};
const Altyazi: React.FC<{ v: ReelsVeri }> = ({ v }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = frame / fps;
  const sayfalar = React.useMemo(() => sayfala(v.altyazi), [v]);
  const vurgu = React.useMemo(() => new Set(v.vurgu.map((x) => x.toLocaleLowerCase("tr-TR"))), [v]);
  const p = sayfalar.find((x) => t >= x.s && t < x.e + 0.1);
  if (!p) return null;
  const g = spring({ frame: frame - Math.round(p.s * fps), fps, config: { damping: 16, stiffness: 220 } });
  return (
    <div style={{ position: "absolute", top: ALTYAZI_Y, left: 90, width: 900, display: "flex", flexWrap: "wrap", justifyContent: "center", gap: "0 16px", opacity: g, transform: `translateY(${interpolate(g, [0, 1], [18, 0])}px)` }}>
      {p.k.map((w, i) => {
        const aktif = t >= w.s - 0.03;
        const vur = vurgu.has(temiz(w.w).toLocaleLowerCase("tr-TR").replace(/[?]/g, ""));
        return (
          <span key={i} style={{ position: "relative", fontFamily: INTER, fontWeight: vur ? 800 : 600, fontStyle: vur ? "italic" : "normal", fontSize: 66, lineHeight: 1.2, color: "white", opacity: aktif ? 1 : 0.55, textShadow: "0 4px 18px rgba(0,0,0,0.65), 0 1px 3px rgba(0,0,0,0.6)", letterSpacing: -0.5 }}>
            {temiz(w.w).toLocaleLowerCase("tr-TR")}
            {vur && aktif ? <span style={{ position: "absolute", left: 2, right: 2, bottom: 6, height: 6, borderRadius: 3, background: RENK.turuncu, opacity: 0.95 }} /> : null}
          </span>
        );
      })}
    </div>
  );
};

// ---------------- Grafik olayları ----------------
const YorumKarti: React.FC<{ kul: string; metin: string; gecikme: number; i: number; carpildi: boolean }> = ({ kul, metin, gecikme, i, carpildi }) => {
  const g = useGiris(gecikme, 12);
  const f = useCurrentFrame();
  const sars = carpildi ? Math.sin(f * 2.2) * 4 : 0;
  const renkler = ["#F58529,#DD2A7B", "#4F5BD5,#962FBF", "#FEDA77,#F58529", "#2ED4C6,#4F5BD5"];
  return (
    <div style={{ position: "absolute", left: 70 + (i % 2) * 60, top: KART_Y - 30 + i * 96, width: 880, display: "flex", alignItems: "center", gap: 18, background: "rgba(255,255,255,0.96)", borderRadius: 26, padding: "16px 22px", boxShadow: "0 14px 40px rgba(0,0,0,0.35)", transform: `translateX(${interpolate(g, [0, 1], [i % 2 ? 300 : -300, 0]) + sars}px) scale(${interpolate(g, [0, 1], [0.8, 1])})`, opacity: g * (carpildi ? 0.75 : 1), filter: carpildi ? "grayscale(0.8)" : "none" }}>
      <div style={{ width: 74, height: 74, borderRadius: 37, background: `linear-gradient(135deg, ${renkler[i % 4]})`, display: "flex", alignItems: "center", justifyContent: "center", color: "white", fontFamily: INTER, fontWeight: 800, fontSize: 28 }}>{kul[0].toUpperCase()}</div>
      <div style={{ flex: 1 }}>
        <div style={{ fontFamily: INTER, fontWeight: 800, fontSize: 30, color: "#111" }}>
          {kul} <span style={{ fontWeight: 400, color: "#888", fontSize: 22 }}>· 2 dk</span>
        </div>
        <div style={{ fontFamily: `${INTER}, ${EMOJI}`, fontWeight: 600, fontSize: 42, color: "#111" }}>{metin}</div>
      </div>
      <div style={{ fontSize: 30, color: "#999" }}>♡</div>
    </div>
  );
};
const Yorumlar: React.FC<{ o: Olay; sure: number }> = ({ o, sure }) => {
  const f = useCurrentFrame();
  const carpiK = Math.round((o.carpi - o.s) * 30);
  const g = useGiris(carpiK, 9);
  const cik = useCikis(sure);
  const carpildi = f >= carpiK;
  return (
    <AbsoluteFill style={{ opacity: cik }}>
      {o.yorumlar.map((y: string[], i: number) => (
        <YorumKarti key={i} kul={y[0]} metin={y[1]} gecikme={i * 7} i={i} carpildi={carpildi} />
      ))}
      {carpildi && (
        <div style={{ position: "absolute", left: 0, right: 0, top: KART_Y + 60, display: "flex", justifyContent: "center", transform: `scale(${interpolate(g, [0, 1], [2.4, 1])}) rotate(-10deg)`, opacity: g }}>
          <div style={{ fontFamily: INTER, fontWeight: 800, fontSize: 84, color: KIRMIZI, border: `9px solid ${KIRMIZI}`, borderRadius: 18, padding: "6px 28px", background: "rgba(255,255,255,0.92)", letterSpacing: 2, boxShadow: "0 10px 30px rgba(0,0,0,0.4)" }}>✕ GÖNDERMİYORUM</div>
        </div>
      )}
    </AbsoluteFill>
  );
};

const Baslik: React.FC<{ o: Olay; sure: number }> = ({ o, sure }) => {
  const g1 = useGiris(o.anlik ? -20 : 0, 13);   // anlik: kanca ilk karede tam görünür
  const g2 = useGiris(o.anlik ? -20 : 8, 13);
  const cik = useCikis(sure);
  return (
    <AbsoluteFill style={{ opacity: cik }}>
      <div style={{ position: "absolute", top: KART_Y + 40, left: 60, right: 60, display: "flex", flexDirection: "column", alignItems: "center", gap: 10 }}>
        <div style={{ overflow: "hidden" }}>
          <div style={{ fontFamily: INTER, fontWeight: 800, fontSize: o.buyuk ? 130 : 74, color: "white", letterSpacing: o.buyuk ? 2 : -1.5, textAlign: "center", textShadow: "0 6px 24px rgba(0,0,0,0.6)", transform: `translateY(${interpolate(g1, [0, 1], [90, 0])}px)` }}>{o.satir1}</div>
        </div>
        <div style={{ fontFamily: INTER, fontWeight: 600, fontStyle: "italic", fontSize: 50, color: "white", background: RENK.turuncu, borderRadius: 14, padding: "4px 22px", opacity: g2, transform: `scale(${interpolate(g2, [0, 1], [0.6, 1])}) rotate(-2deg)` }}>{o.satir2}</div>
      </div>
    </AbsoluteFill>
  );
};

const Takipci: React.FC<{ o: Olay; sure: number }> = ({ o, sure }) => {
  const f = useCurrentFrame();
  const t = o.s + f / 30;
  const aktif = o.gecisler.filter((x: number) => t >= x).length - 1;
  const g = useGiris(0, 15);
  const cik = useCikis(sure, 10);
  return (
    <div style={{ position: "absolute", top: 200, left: 0, right: 0, display: "flex", justifyContent: "center", gap: 10, opacity: Math.min(g, cik), transform: `translateY(${interpolate(g, [0, 1], [-40, 0])}px)` }}>
      {o.adlar.map((ad: string, i: number) => {
        const a = i === aktif;
        const bitti = i < aktif;
        return (
          <div key={i} style={{ ...cam, borderRadius: 40, padding: "12px 26px", display: "flex", alignItems: "center", gap: 12, background: a ? RENK.turuncu : "linear-gradient(160deg, rgba(22,30,52,0.90), rgba(10,14,28,0.88))", border: a ? "1.5px solid rgba(255,255,255,0.5)" : cam.border, transform: `scale(${a ? 1.06 : 0.94})`, transition: "none" }}>
            <div style={{ width: 42, height: 42, borderRadius: 21, background: a ? "white" : bitti ? YESIL : "rgba(255,255,255,0.15)", color: a ? RENK.turuncu : "white", fontFamily: INTER, fontWeight: 800, fontSize: 24, display: "flex", alignItems: "center", justifyContent: "center" }}>{bitti ? "✓" : i + 1}</div>
            <span style={{ fontFamily: INTER, fontWeight: 800, fontSize: 30, color: "white", letterSpacing: 1 }}>{ad}</span>
          </div>
        );
      })}
    </div>
  );
};

const Stat: React.FC<{ o: Olay; sure: number }> = ({ o, sure }) => {
  const g = useGiris(0, 11);
  const cik = useCikis(sure);
  const cizgi = useGiris(6, 20);
  const renk = o.renk === "kirmizi" ? KIRMIZI : RENK.turuncu;
  return (
    <div style={{ position: "absolute", top: KART_Y + 30, left: 0, right: 0, display: "flex", justifyContent: "center", opacity: Math.min(g, cik) }}>
      <div style={{ ...cam, padding: "22px 44px 26px", display: "flex", flexDirection: "column", alignItems: "center", transform: `scale(${interpolate(g, [0, 1], [0.7, 1])})` }}>
        <div style={{ fontFamily: INTER, fontWeight: 600, fontSize: 26, letterSpacing: 5, color: "rgba(255,255,255,0.7)" }}>{o.ust}</div>
        <div style={{ fontFamily: INTER, fontWeight: 800, fontSize: 84, color: "white", letterSpacing: -2, lineHeight: 1.1 }}>{o.deger}</div>
        <div style={{ height: 7, width: `${cizgi * 100}%`, background: renk, borderRadius: 4, marginTop: 6 }} />
      </div>
    </div>
  );
};

const Zincir: React.FC<{ o: Olay; sure: number }> = ({ o, sure }) => {
  const f = useCurrentFrame();
  const cik = useCikis(sure);
  const altG = useGiris(Math.round((o.ogeler[2][2] - o.s) * 30) + 8, 14);
  return (
    <div style={{ position: "absolute", top: KART_Y, left: 0, right: 0, opacity: cik }}>
      <div style={{ display: "flex", justifyContent: "center", alignItems: "flex-start", gap: 0 }}>
        {o.ogeler.map((og: any[], i: number) => {
          const gk = Math.round((og[2] - o.s) * 30);
          const g = spring({ frame: f - gk, fps: 30, config: { damping: 11, stiffness: 180 } });
          const cizgi = i > 0 ? interpolate(f, [gk - 6, gk + 4], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) : 0;
          return (
            <React.Fragment key={i}>
              {i > 0 && (
                <div style={{ width: 70, marginTop: 86, height: 0, borderTop: `5px dashed ${RENK.turuncu}`, clipPath: `inset(0 ${(1 - cizgi) * 100}% 0 0)` }} />
              )}
              <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 10, opacity: g, transform: `scale(${interpolate(g, [0, 1], [0.4, 1])})` }}>
                <div style={{ ...cam, width: 172, height: 172, borderRadius: 40, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 96, fontFamily: EMOJI, boxShadow: `0 0 30px rgba(246,113,2,0.35), ${cam.boxShadow}` }}>{og[0]}</div>
                <div style={{ fontFamily: INTER, fontWeight: 800, fontSize: 38, color: "white", textShadow: "0 3px 10px rgba(0,0,0,0.6)" }}>{og[1]}</div>
              </div>
            </React.Fragment>
          );
        })}
      </div>
      <div style={{ display: "flex", justifyContent: "center", marginTop: 18, opacity: altG }}>
        <div style={{ fontFamily: INTER, fontWeight: 800, fontSize: 38, letterSpacing: 3, color: "white", background: KIRMIZI, borderRadius: 14, padding: "8px 22px" }}>{o.alt}</div>
      </div>
    </div>
  );
};

const Akis: React.FC<{ o: Olay; sure: number }> = ({ o, sure }) => {
  const g1 = useGiris(0, 13);
  const g2 = useGiris(14, 13);
  const ok = useGiris(7, 20);
  const cik = useCikis(sure);
  const kutu = (ust: string, alt: string, g: number, renk: string) => (
    <div style={{ ...cam, padding: "18px 26px", display: "flex", flexDirection: "column", alignItems: "center", opacity: g, transform: `scale(${interpolate(g, [0, 1], [0.6, 1])})` }}>
      <div style={{ fontFamily: INTER, fontWeight: 800, fontSize: 28, letterSpacing: 4, color: renk }}>{ust}</div>
      <div style={{ fontFamily: INTER, fontWeight: 800, fontSize: 52, color: "white" }}>{alt}</div>
    </div>
  );
  return (
    <div style={{ position: "absolute", top: KART_Y + 30, left: 0, right: 0, display: "flex", justifyContent: "center", alignItems: "center", gap: 18, opacity: cik }}>
      {kutu(o.ust, o.sol, g1, KIRMIZI)}
      <div style={{ fontFamily: INTER, fontWeight: 800, fontSize: 64, color: "white", opacity: ok, transform: `translateX(${interpolate(ok, [0, 1], [-30, 0])}px)` }}>→</div>
      {kutu(o.ust2, o.sag, g2, YESIL)}
    </div>
  );
};

const Liste: React.FC<{ o: Olay; sure: number }> = ({ o, sure }) => {
  const f = useCurrentFrame();
  const g = useGiris(0, 14);
  const cik = useCikis(sure);
  return (
    <div style={{ position: "absolute", top: KART_Y - 10, left: 0, right: 0, display: "flex", justifyContent: "center", opacity: Math.min(g, cik) }}>
      <div style={{ ...cam, padding: "26px 44px", display: "flex", flexDirection: "column", gap: 16, minWidth: 720, transform: `scale(${interpolate(g, [0, 1], [0.85, 1])})` }}>
        {o.ogeler.map((og: any[], i: number) => {
          const gk = og[1] ? Math.round((og[1] - o.s) * 30) : -30;
          const gi = spring({ frame: f - gk, fps: 30, config: { damping: 12, stiffness: 200 } });
          return (
            <div key={i} style={{ display: "flex", alignItems: "center", gap: 18, opacity: Math.max(0.0, gi), transform: `translateX(${interpolate(gi, [0, 1], [-40, 0])}px)` }}>
              <div style={{ width: 64, height: 64, borderRadius: 32, background: o.isaret === "carpi" ? KIRMIZI : YESIL, color: "white", fontFamily: INTER, fontWeight: 800, fontSize: 32, display: "flex", alignItems: "center", justifyContent: "center", transform: `scale(${interpolate(gi, [0, 1], [0.2, 1])})`, boxShadow: o.isaret === "carpi" ? "0 0 18px rgba(255,77,77,0.6)" : "0 0 18px rgba(46,212,122,0.6)" }}>{o.isaret === "carpi" ? "✕" : "✓"}</div>
              <div style={{ fontFamily: INTER, fontWeight: 800, fontSize: 54, color: "white" }}>{og[0]}</div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

const Panel: React.FC<{ o: Olay; sure: number }> = ({ sure }) => {
  const f = useCurrentFrame();
  const g = useGiris(0, 13);
  const cik = useCikis(sure);
  const bar = (i: number, h: number) => interpolate(f, [6 + i * 3, 18 + i * 3], [0, h], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.out(Easing.cubic) });
  return (
    <div style={{ position: "absolute", top: KART_Y - 20, left: 0, right: 0, display: "flex", justifyContent: "center", opacity: Math.min(g, cik) }}>
      <div style={{ ...cam, width: 860, height: 360, padding: 0, overflow: "hidden", transform: `perspective(1200px) rotateX(${interpolate(g, [0, 1], [25, 8])}deg) scale(${interpolate(g, [0, 1], [0.8, 1])})` }}>
        <div style={{ height: 44, display: "flex", alignItems: "center", gap: 8, padding: "0 16px", borderBottom: "1px solid rgba(255,255,255,0.15)" }}>
          {["#FF5F57", "#FEBC2E", "#28C840"].map((c) => <div key={c} style={{ width: 14, height: 14, borderRadius: 7, background: c }} />)}
          <div style={{ marginLeft: 16, flex: 1, height: 20, borderRadius: 10, background: "rgba(255,255,255,0.1)" }} />
          <span style={{ fontFamily: INTER, fontWeight: 800, fontSize: 28, color: RENK.turuncu, letterSpacing: 2 }}>TEK PANEL</span>
        </div>
        <div style={{ display: "flex", height: 316 }}>
          <div style={{ width: 200, borderRight: "1px solid rgba(255,255,255,0.12)", padding: 16, display: "flex", flexDirection: "column", gap: 12 }}>
            {["Ürünler", "Siparişler", "Kargo", "Ödemeler"].map((x, i) => (
              <div key={x} style={{ fontFamily: INTER, fontWeight: 600, fontSize: 26, color: i === 1 ? "white" : "rgba(255,255,255,0.6)", background: i === 1 ? "rgba(246,113,2,0.35)" : "transparent", borderRadius: 8, padding: "4px 8px" }}>{x}</div>
            ))}
          </div>
          <div style={{ flex: 1, padding: 20, display: "flex", alignItems: "flex-end", gap: 16 }}>
            {[90, 130, 110, 170, 150, 205].map((h, i) => (
              <div key={i} style={{ flex: 1, height: bar(i, h), borderRadius: 8, background: i === 5 ? RENK.turuncu : "rgba(255,255,255,0.35)" }} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

const Adimlar: React.FC<{ o: Olay; sure: number }> = ({ o, sure }) => {
  const f = useCurrentFrame();
  const g = useGiris(0, 14);
  const cik = useCikis(sure);
  const adlar = ["Ürün", "Mağaza", "Marka"];
  return (
    <div style={{ position: "absolute", top: KART_Y - 20, left: 0, right: 0, display: "flex", flexDirection: "column", alignItems: "center", opacity: Math.min(g, cik) }}>
      <div style={{ display: "flex", alignItems: "flex-end", gap: 20, height: 250 }}>
        {adlar.map((ad, i) => {
          const h = interpolate(f, [4 + i * 9, 16 + i * 9], [0, 90 + i * 60], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.out(Easing.back(1.4)) });
          return (
            <div key={ad} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 8 }}>
              <div style={{ ...cam, width: 210, height: h, borderRadius: 20, background: i === 2 ? RENK.turuncu : cam.background, display: "flex", alignItems: "flex-start", justifyContent: "center", paddingTop: 12, fontFamily: INTER, fontWeight: 800, fontSize: 38, color: "white" }}>{h > 60 ? ad : ""}</div>
            </div>
          );
        })}
      </div>
      <div style={{ marginTop: 14, fontFamily: INTER, fontWeight: 800, fontSize: 48, letterSpacing: 3, color: "white", textShadow: "0 4px 16px rgba(0,0,0,0.6)" }}>{o.baslik}</div>
    </div>
  );
};

const Sonraki: React.FC<{ o: Olay; sure: number }> = ({ o, sure }) => {
  const g = useGiris(0, 12);
  const cik = useCikis(sure);
  return (
    <div style={{ position: "absolute", top: KART_Y + 20, left: 0, right: 0, display: "flex", justifyContent: "center", opacity: Math.min(g, cik) }}>
      <div style={{ ...cam, padding: "20px 36px", display: "flex", alignItems: "center", gap: 22, transform: `translateY(${interpolate(g, [0, 1], [60, 0])}px)` }}>
        <div style={{ fontSize: 80, fontFamily: EMOJI }}>🎯</div>
        <div>
          <div style={{ fontFamily: INTER, fontWeight: 800, fontSize: 24, letterSpacing: 5, color: RENK.turuncu }}>{o.baslik}</div>
          <div style={{ fontFamily: INTER, fontWeight: 800, fontSize: 54, color: "white", letterSpacing: -1 }}>{o.konu}</div>
        </div>
      </div>
    </div>
  );
};

const TakipEt: React.FC<{ o: Olay; sure: number; foto: string; kanal: string }> = ({ o, sure, foto, kanal }) => {
  const f = useCurrentFrame();
  const g = useGiris(0, 13);
  const cik = useCikis(sure, 6);
  const tikK = Math.round((o.tik - o.s) * 30);
  const basildi = f >= tikK;
  const bas = spring({ frame: f - tikK, fps: 30, config: { damping: 8, stiffness: 300 } });
  const el = interpolate(f, [tikK - 14, tikK - 2], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.out(Easing.cubic) });
  return (
    <div style={{ position: "absolute", top: KART_Y + 20, left: 0, right: 0, display: "flex", justifyContent: "center", opacity: Math.min(g, cik) }}>
      <div style={{ ...cam, borderRadius: 60, padding: "14px 16px 14px 14px", display: "flex", alignItems: "center", gap: 18, transform: `scale(${interpolate(g, [0, 1], [0.7, 1]) * (1 - 0.06 * Math.sin(Math.min(bas, 1) * Math.PI))})` }}>
        <Img src={foto} style={{ width: 96, height: 96, borderRadius: 48, border: `3px solid ${RENK.turuncu}` }} />
        <div style={{ fontFamily: INTER, fontWeight: 800, fontSize: 40, color: "white", marginRight: 6 }}>{kanal}</div>
        <div style={{ fontFamily: INTER, fontWeight: 800, fontSize: 36, color: "white", background: basildi ? "rgba(255,255,255,0.18)" : RENK.turuncu, borderRadius: 40, padding: "16px 30px" }}>{basildi ? "Takip ediliyor ✓" : "Takip Et"}</div>
      </div>
      <div style={{ position: "absolute", left: 780, top: 70, fontSize: 90, fontFamily: EMOJI, transform: `translate(${el * 120}px, ${el * 160}px)`, opacity: f < tikK + 20 ? 1 : 0 }}>👆</div>
    </div>
  );
};


// ---------------- Reklam / etkinlik grafikleri ----------------
const SoruCevap: React.FC<{ o: Olay; sure: number }> = ({ o, sure }) => {
  const f = useCurrentFrame();
  const cik = useCikis(sure);
  const cevapK = o.cevap ? Math.round((o.cevap - o.s) * 30) : 99999;
  return (
    <div style={{ position: "absolute", top: KART_Y - 30, left: 0, right: 0, display: "flex", flexDirection: "column", alignItems: "center", gap: 14, opacity: cik }}>
      {o.ogeler.map((og: any[], i: number) => {
        const gk = Math.round((og[1] - o.s) * 30);
        const g = spring({ frame: f - gk, fps: 30, config: { damping: 12, stiffness: 190 } });
        const c = spring({ frame: f - cevapK - i * 5, fps: 30, config: { damping: 11, stiffness: 220 } });
        const cevaplandi = f >= cevapK + i * 5;
        return (
          <div key={i} style={{ ...cam, borderRadius: 24, padding: "14px 30px 14px 16px", display: "flex", alignItems: "center", gap: 18, opacity: g, transform: `translateX(${interpolate(g, [0, 1], [i % 2 ? 260 : -260, 0])}px) scale(${1 + 0.05 * Math.sin(Math.min(c, 1) * Math.PI)})`, border: cevaplandi ? `2px solid ${YESIL}` : cam.border }}>
            <div style={{ width: 56, height: 56, borderRadius: 28, background: cevaplandi ? YESIL : "rgba(255,77,77,0.9)", color: "white", fontFamily: INTER, fontWeight: 800, fontSize: 34, display: "flex", alignItems: "center", justifyContent: "center" }}>{cevaplandi ? "✓" : "?"}</div>
            <div style={{ fontFamily: INTER, fontWeight: 800, fontSize: 46, color: "white" }}>{og[0]}</div>
          </div>
        );
      })}
    </div>
  );
};

const Rozet: React.FC<{ o: Olay; sure: number }> = ({ o, sure }) => {
  const g = useGiris(0, 14);
  const cik = useCikis(sure, 8);
  return (
    <div style={{ position: "absolute", top: 205, left: 0, right: 0, display: "flex", justifyContent: "center", opacity: Math.min(g, cik), transform: `translateY(${interpolate(g, [0, 1], [-40, 0])}px)` }}>
      <div style={{ ...cam, borderRadius: 50, padding: "12px 32px", fontFamily: `${INTER}, ${EMOJI}`, fontWeight: 800, fontSize: 34, color: "white", letterSpacing: 2, border: `2px solid ${RENK.turuncu}` }}>{o.metin}</div>
    </div>
  );
};

const Etkinlik: React.FC<{ o: Olay; sure: number }> = ({ o, sure }) => {
  const f = useCurrentFrame();
  const g = useGiris(0, 13);
  const cik = useCikis(sure);
  return (
    <div style={{ position: "absolute", top: KART_Y - 40, left: 0, right: 0, display: "flex", justifyContent: "center", opacity: Math.min(g, cik) }}>
      <div style={{ ...cam, padding: "26px 40px", minWidth: 780, display: "flex", flexDirection: "column", gap: 14, transform: `scale(${interpolate(g, [0, 1], [0.85, 1])})`, borderTop: `6px solid ${RENK.turuncu}` }}>
        {o.satirlar.map((st: any[], i: number) => {
          const gk = Math.round((st[2] - o.s) * 30);
          const gi = spring({ frame: f - gk, fps: 30, config: { damping: 12, stiffness: 200 } });
          return (
            <div key={i} style={{ display: "flex", alignItems: "center", gap: 20, opacity: gi, transform: `translateX(${interpolate(gi, [0, 1], [-50, 0])}px)` }}>
              <div style={{ fontSize: 56, fontFamily: EMOJI, width: 70, textAlign: "center" }}>{st[0]}</div>
              <div style={{ fontFamily: INTER, fontWeight: 800, fontSize: 54, color: "white", letterSpacing: -0.5 }}>{st[1]}</div>
            </div>
          );
        })}
        {o.alt ? <div style={{ marginLeft: 90, fontFamily: INTER, fontWeight: 600, fontSize: 36, color: RENK.turuncu, opacity: interpolate(f, [30, 40], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) }}>{o.alt}</div> : null}
      </div>
    </div>
  );
};

const BRollKirlilik: React.FC<{ o: Olay; sure: number }> = ({ o, sure }) => {
  const f = useCurrentFrame();
  const carpi = Math.round(sure * 0.6);
  const cg = spring({ frame: f - carpi, fps: 30, config: { damping: 9, stiffness: 200 } });
  const yer = [[90, 380, -6], [420, 560, 5], [120, 760, 4], [460, 940, -5], [200, 1120, 3]];
  return (
    <BRollZemin sure={sure}>
      <div style={{ position: "absolute", top: 230, left: 0, right: 0, textAlign: "center", fontFamily: INTER, fontWeight: 800, fontSize: 64, color: "white", letterSpacing: -1 }}>BİLGİ KİRLİLİĞİ</div>
      {o.basliklar.map((b: string, i: number) => {
        const g = spring({ frame: f - i * 3, fps: 30, config: { damping: 11, stiffness: 180 } });
        const [x, y, r] = yer[i % yer.length];
        return (
          <div key={i} style={{ position: "absolute", left: x, top: y, width: 560, display: "flex", alignItems: "center", gap: 14, background: "rgba(255,255,255,0.95)", borderRadius: 22, padding: "16px 20px", boxShadow: "0 14px 40px rgba(0,0,0,0.45)", transform: `rotate(${r}deg) scale(${interpolate(g, [0, 1], [0.3, 1])})`, opacity: g * (f >= carpi ? 0.55 : 1), filter: f >= carpi ? "grayscale(1)" : "none" }}>
            <div style={{ width: 54, height: 54, borderRadius: 27, background: "linear-gradient(135deg,#F58529,#DD2A7B)" }} />
            <div style={{ fontFamily: `${INTER}, ${EMOJI}`, fontWeight: 800, fontSize: 34, color: "#111" }}>{b}</div>
          </div>
        );
      })}
      {f >= carpi && <div style={{ position: "absolute", left: 0, right: 0, top: 720, display: "flex", justifyContent: "center", transform: `scale(${interpolate(cg, [0, 1], [3, 1])}) rotate(-8deg)`, opacity: cg }}><div style={{ fontFamily: INTER, fontWeight: 800, fontSize: 260, color: KIRMIZI, textShadow: "0 10px 40px rgba(0,0,0,0.6)" }}>✕</div></div>}
    </BRollZemin>
  );
};

const Davetiye: React.FC<{ o: Olay; sure: number }> = ({ sure }) => {
  const f = useCurrentFrame();
  const g = useGiris(0, 12);
  const cik = useCikis(sure);
  const damgaK = 16;
  const dg = spring({ frame: f - damgaK, fps: 30, config: { damping: 9, stiffness: 200 } });
  return (
    <div style={{ position: "absolute", top: KART_Y - 20, left: 0, right: 0, display: "flex", justifyContent: "center", opacity: Math.min(g, cik) }}>
      <div style={{ position: "relative", width: 800, height: 280, borderRadius: 30, background: `linear-gradient(135deg, ${RENK.turuncu} 0%, #c94f00 100%)`, display: "flex", alignItems: "center", boxShadow: "0 20px 50px rgba(0,0,0,0.5)", transform: `rotate(${interpolate(g, [0, 1], [-12, -3])}deg) scale(${interpolate(g, [0, 1], [0.6, 1])})` }}>
        <div style={{ width: 210, height: "100%", borderRight: "4px dashed rgba(255,255,255,0.6)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 120, fontFamily: EMOJI }}>🎟️</div>
        <div style={{ paddingLeft: 34 }}>
          <div style={{ fontFamily: INTER, fontWeight: 800, fontSize: 30, letterSpacing: 6, color: "rgba(255,255,255,0.85)" }}>DAVETLİSİN</div>
          <div style={{ fontFamily: INTER, fontWeight: 800, fontSize: 64, color: "white", letterSpacing: -1, lineHeight: 1.05 }}>Mağazanolsun<br />Eskişehir</div>
        </div>
        {f >= damgaK && <div style={{ position: "absolute", right: -30, bottom: -40, transform: `scale(${interpolate(dg, [0, 1], [2.5, 1])}) rotate(-12deg)`, opacity: dg, fontFamily: INTER, fontWeight: 800, fontSize: 46, color: YESIL, background: "white", border: `6px solid ${YESIL}`, borderRadius: 16, padding: "6px 18px", boxShadow: "0 10px 30px rgba(0,0,0,0.4)" }}>KATILIM ÜCRETSİZ</div>}
      </div>
    </div>
  );
};

const Cagri2: React.FC<{ o: Olay; sure: number }> = ({ o, sure }) => {
  const f = useCurrentFrame();
  const g = useGiris(0, 13);
  const cik = useCikis(sure);
  const yk = Math.round((o.yorum_t - o.s) * 30);
  const yg = spring({ frame: f - yk + 6, fps: 30, config: { damping: 12, stiffness: 190 } });
  const yazi = o.yorum ?? "Eskişehir";
  const harf = Math.max(0, Math.min(yazi.length, Math.floor((f - yk + 4) / 1.6)));
  return (
    <div style={{ position: "absolute", top: KART_Y - 40, left: 0, right: 0, display: "flex", flexDirection: "column", alignItems: "center", gap: 18, opacity: cik }}>
      <div style={{ ...cam, borderRadius: 60, padding: "16px 36px", display: "flex", alignItems: "center", gap: 16, opacity: g, transform: `scale(${interpolate(g, [0, 1], [0.6, 1])})`, background: RENK.turuncu, border: "2px solid rgba(255,255,255,0.4)" }}>
        <span style={{ fontSize: 50, fontFamily: EMOJI }}>💬</span>
        <span style={{ fontFamily: INTER, fontWeight: 800, fontSize: 46, color: "white" }}>Bana mesaj at</span>
      </div>
      <div style={{ fontFamily: INTER, fontWeight: 800, fontSize: 32, color: "rgba(255,255,255,0.8)", letterSpacing: 4, opacity: yg }}>VEYA</div>
      <div style={{ width: 820, display: "flex", alignItems: "center", gap: 18, background: "rgba(255,255,255,0.96)", borderRadius: 26, padding: "16px 22px", boxShadow: "0 14px 40px rgba(0,0,0,0.35)", opacity: yg, transform: `translateY(${interpolate(yg, [0, 1], [60, 0])}px)` }}>
        <div style={{ width: 70, height: 70, borderRadius: 35, background: "linear-gradient(135deg,#4F5BD5,#962FBF)", color: "white", fontFamily: INTER, fontWeight: 800, fontSize: 30, display: "flex", alignItems: "center", justifyContent: "center" }}>S</div>
        <div style={{ flex: 1 }}>
          <div style={{ fontFamily: INTER, fontWeight: 800, fontSize: 28, color: "#111" }}>sen <span style={{ fontWeight: 400, color: "#888", fontSize: 22 }}>· şimdi</span></div>
          <div style={{ fontFamily: INTER, fontWeight: 800, fontSize: 44, color: "#111" }}>{yazi.slice(0, harf)}<span style={{ opacity: Math.floor(f / 8) % 2 ? 1 : 0, color: RENK.turuncu }}>|</span></div>
        </div>
        <div style={{ fontFamily: INTER, fontWeight: 800, fontSize: 30, color: harf >= yazi.length ? "#3897F0" : "#bbb" }}>Paylaş</div>
      </div>
    </div>
  );
};

const KapanisKarti: React.FC<{ o: Olay; sure: number }> = ({ o, sure }) => {
  const g = useGiris(0, 12);
  const cik = useCikis(sure, 4);
  return (
    <div style={{ position: "absolute", top: KART_Y + 50, left: 0, right: 0, display: "flex", justifyContent: "center", opacity: Math.min(g, cik) }}>
      <div style={{ ...cam, padding: "22px 36px", display: "flex", flexDirection: "column", alignItems: "center", gap: 6, transform: `scale(${interpolate(g, [0, 1], [0.8, 1])})`, borderTop: `6px solid ${RENK.turuncu}` }}>
        <div style={{ fontFamily: INTER, fontWeight: 800, fontSize: 56, color: "white" }}>{o.satir1 ?? "28 Kasım · 14.00"}</div>
        <div style={{ fontFamily: INTER, fontWeight: 600, fontSize: 34, color: "rgba(255,255,255,0.85)" }}>{o.satir2 ?? "Taşbaşı Kültür Merkezi · Odunpazarı"}</div>
        <div style={{ marginTop: 8, fontFamily: INTER, fontWeight: 800, fontSize: 34, color: "white", background: o.etiketRenk === "turuncu" ? RENK.turuncu : YESIL, borderRadius: 12, padding: "4px 18px" }}>{o.etiket ?? "KATILIM ÜCRETSİZ"}</div>
      </div>
    </div>
  );
};

const Defter: React.FC<{ o: Olay; sure: number }> = ({ o, sure }) => {
  const f = useCurrentFrame();
  const g = useGiris(0, 12);
  const cik = useCikis(sure);
  const kapK = Math.round((o.kapat - o.s) * 30);
  const kap = interpolate(f, [kapK - 4, kapK + 3], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.in(Easing.cubic) });
  const dg = spring({ frame: f - kapK - 2, fps: 30, config: { damping: 9, stiffness: 220 } });
  return (
    <div style={{ position: "absolute", top: KART_Y - 40, left: 0, right: 0, display: "flex", justifyContent: "center", opacity: Math.min(g, cik) }}>
      <div style={{ position: "relative", width: 520, height: 300, perspective: 1200, transform: `translateX(${130 * kap * 1.35}px) scale(${interpolate(g, [0, 1], [0.8, 1.35])})`, transformOrigin: "50% 0%" }}>
        {/* sol sayfa (sabit) + sağ kapak (kapanır) */}
        <div style={{ position: "absolute", left: 0, top: 0, width: 260, height: 300, background: "#f4efe2", borderRadius: "16px 0 0 16px", boxShadow: "0 18px 40px rgba(0,0,0,0.5)", padding: 26, boxSizing: "border-box" }}>
          {[0, 1, 2, 3, 4, 5].map((i) => <div key={i} style={{ height: 6, background: "rgba(0,0,0,0.12)", borderRadius: 3, marginBottom: 28, width: `${90 - (i % 3) * 15}%` }} />)}
        </div>
        <div style={{ position: "absolute", left: 260, top: 0, width: 260, height: 300, transformOrigin: "0 50%", transform: `rotateY(${-180 * kap}deg)`, transformStyle: "preserve-3d", zIndex: 2 }}>
          <div style={{ position: "absolute", inset: 0, background: "#f4efe2", borderRadius: "0 16px 16px 0", padding: 26, boxSizing: "border-box", backfaceVisibility: "hidden" }}>
            <div style={{ fontFamily: INTER, fontWeight: 800, fontSize: 30, color: "#333" }}>E-TİCARET</div>
            {[0, 1, 2, 3].map((i) => <div key={i} style={{ height: 6, background: "rgba(0,0,0,0.12)", borderRadius: 3, marginTop: 28, width: `${85 - i * 10}%` }} />)}
          </div>
          <div style={{ position: "absolute", inset: 0, background: `linear-gradient(135deg, ${RENK.turuncu}, #b84600)`, borderRadius: "16px 0 0 16px", transform: "rotateY(180deg)", backfaceVisibility: "hidden", display: "flex", alignItems: "flex-start", paddingTop: 50, justifyContent: "center", fontFamily: INTER, fontWeight: 800, fontSize: 40, color: "white" }}>{o.kapakYazi ?? "ANKARA"}</div>
        </div>
        {f >= kapK + 2 && <div style={{ position: "absolute", left: 0, width: 260, top: 160, display: "flex", justifyContent: "center", transform: `scale(${interpolate(dg, [0, 1], [2.4, 1])}) rotate(-8deg)`, opacity: dg, zIndex: 3 }}><div style={{ fontFamily: INTER, fontWeight: 800, fontSize: 56, color: YESIL, background: "white", border: `8px solid ${YESIL}`, borderRadius: 16, padding: "4px 24px", boxShadow: "0 10px 30px rgba(0,0,0,0.4)" }}>{o.damga ?? "KAPANDI"}</div></div>}
      </div>
    </div>
  );
};

const Koltuk: React.FC<{ o: Olay; sure: number }> = ({ o, sure }) => {
  const f = useCurrentFrame();
  const g = useGiris(0, 13);
  const cik = useCikis(sure);
  return (
    <div style={{ position: "absolute", top: KART_Y - 50, left: 0, right: 0, display: "flex", justifyContent: "center", opacity: Math.min(g, cik) }}>
      <div style={{ ...cam, padding: "22px 30px", display: "flex", flexDirection: "column", alignItems: "center", gap: 14, transform: `scale(${interpolate(g, [0, 1], [0.85, 1])})` }}>
        <div style={{ fontFamily: INTER, fontWeight: 800, fontSize: 30, letterSpacing: 5, color: "rgba(255,255,255,0.8)" }}>{o.ust ?? "KONTENJAN"}</div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(20, 28px)", gap: 7 }}>
          {Array.from({ length: 100 }).map((_, i) => {
            const k = 3 + i * 0.35;
            const a = interpolate(f, [k, k + 4], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
            return <div key={i} style={{ width: 28, height: 24, boxSizing: "border-box", borderRadius: "8px 8px 4px 4px", border: `3px solid ${RENK.turuncu}`, background: "rgba(246,113,2,0.12)", opacity: a, transform: `scale(${0.4 + 0.6 * a})` }} />;
          })}
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <div style={{ fontFamily: INTER, fontWeight: 800, fontSize: 60, color: "white", letterSpacing: -1 }}>{o.baslik ?? "SADECE 100 KİŞİ"}</div>
          {o.fiyat ? <div style={{ fontFamily: INTER, fontWeight: 800, fontSize: 40, color: "white", background: RENK.turuncu, borderRadius: 12, padding: "4px 16px" }}>{o.fiyat}</div> : null}
        </div>
      </div>
    </div>
  );
};

const OlayCiz: React.FC<{ o: Olay; k: Kaynak }> = ({ o, k }) => {
  const sure = Math.max(1, Math.round((o.son - o.s) * 30));
  const props = { o, sure };
  switch (o.tip) {
    case "yorumlar": return <Yorumlar {...props} />;
    case "baslik": return <Baslik {...props} />;
    case "takipci": return <Takipci {...props} />;
    case "stat": return <Stat {...props} />;
    case "zincir": return <Zincir {...props} />;
    case "akis": return <Akis {...props} />;
    case "liste": return <Liste {...props} />;
    case "panel": return <Panel {...props} />;
    case "adimlar": return <Adimlar {...props} />;
    case "sonraki": return <Sonraki {...props} />;
    case "takipet": return <TakipEt {...props} foto={k.foto} kanal={k.kanal ?? "Sıfırdan Satışa"} />;
    case "broll_stok": return <BRollStok {...props} />;
    case "broll_dropship": return <BRollDropship {...props} />;
    case "sorucevap": return <SoruCevap {...props} />;
    case "rozet": return <Rozet {...props} />;
    case "etkinlik": return <Etkinlik {...props} />;
    case "broll_kirlilik": return <BRollKirlilik {...props} />;
    case "davetiye": return <Davetiye {...props} />;
    case "cagri2": return <Cagri2 {...props} />;
    case "kapanis": return <KapanisKarti {...props} />;
    case "defter": return <Defter {...props} />;
    case "koltuk": return <Koltuk {...props} />;
    default: return null;
  }
};

// Her grafik türüne göre giriş / çıkış / iç olay sesleri (marka/sfx kütüphanesi)
const Sesler: React.FC<{ o: Olay; k: Kaynak }> = ({ o, k }) => {
  const e: { t: number; ad: string; v: number }[] = [];
  const giris = (ad: string, v = 0.4) => e.push({ t: o.s, ad, v });
  const cikis = (ad = "whoosh_cikis", v = 0.25) => e.push({ t: Math.max(o.s, o.son - 0.22), ad, v });
  switch (o.tip) {
    case "yorumlar":
      o.yorumlar.forEach((_: any, i: number) => e.push({ t: o.s + (i * 7) / 30, ad: "bildirim", v: 0.32 }));
      e.push({ t: o.carpi, ad: "damga", v: 0.8 }); cikis(); break;
    case "baslik": giris("baslik", 0.45); cikis(); break;
    case "takipci":
      giris("whoosh_giris", 0.3);
      (o.gecisler as number[]).slice(1).forEach((g) => e.push({ t: g, ad: "secim", v: 0.45 }));
      cikis("pop_cikis", 0.25); break;
    case "stat": giris(o.ses ?? "para", o.ses === "boom" ? 0.5 : 0.45); cikis(); break;
    case "zincir":
      o.ogeler.forEach((og: any[], i: number) => e.push({ t: og[2], ad: `blip${i + 1}`, v: 0.45 }));
      e.push({ t: o.ogeler[2][2] + 8 / 30, ad: "uyari", v: 0.35 }); cikis(); break;
    case "akis": giris("whoosh_giris", 0.35); e.push({ t: o.s + 14 / 30, ad: "pop", v: 0.35 }); cikis("pop_cikis"); break;
    case "liste":
      o.ogeler.forEach((og: any[], i: number) => og[1] && e.push({ t: og[1], ad: o.isaret === "carpi" ? "pop" : `onay${i + 1}`, v: 0.45 }));
      if (!o.ogeler[0][1]) giris("pop", 0.3);
      cikis(); break;
    case "panel": giris("arayuz", 0.45); cikis("pop_cikis"); break;
    case "adimlar": [0, 1, 2].forEach((i) => e.push({ t: o.s + (4 + i * 9) / 30, ad: `blip${i + 1}`, v: 0.45 })); cikis(); break;
    case "sonraki": giris("cagri", 0.45); cikis("pop_cikis"); break;
    case "takipet": giris("pop", 0.35); e.push({ t: o.tik, ad: "tik", v: 0.7 }); e.push({ t: o.tik + 0.05, ad: "basari", v: 0.45 }); break;
    case "broll_stok": case "broll_dropship": giris("broll", 0.5); cikis("whoosh_cikis", 0.3); break;
    case "sorucevap":
      o.ogeler.forEach((og: any[]) => e.push({ t: og[1], ad: "pop", v: 0.4 }));
      if (o.cevap) o.ogeler.forEach((_: any, i: number) => e.push({ t: o.cevap + (i * 5) / 30, ad: `onay${i + 1}`, v: 0.45 }));
      cikis(); break;
    case "rozet": giris("secim", 0.35); break;
    case "etkinlik": o.satirlar.forEach((st: any[], i: number) => e.push({ t: st[2], ad: `blip${i + 1}`, v: 0.45 })); cikis(); break;
    case "broll_kirlilik":
      giris("broll", 0.5); o.basliklar.forEach((_: any, i: number) => e.push({ t: o.s + (i * 3) / 30, ad: "bildirim", v: 0.22 }));
      e.push({ t: o.s + (o.son - o.s) * 0.6, ad: "damga", v: 0.7 }); cikis("whoosh_cikis", 0.3); break;
    case "davetiye": giris("baslik", 0.45); e.push({ t: o.s + 16 / 30, ad: "damga", v: 0.6 }); e.push({ t: o.s + 18 / 30, ad: "basari", v: 0.35 }); cikis(); break;
    case "cagri2": giris("pop", 0.4); e.push({ t: o.yorum_t - 0.2, ad: "bildirim", v: 0.35 }); e.push({ t: o.yorum_t + 0.4, ad: "tik", v: 0.6 }); cikis("pop_cikis"); break;
    case "kapanis": giris("cagri", 0.45); break;
    case "defter": giris("pop", 0.35); e.push({ t: o.kapat, ad: "damga", v: 0.75 }); cikis(); break;
    case "koltuk": giris("arayuz", 0.4); [0, 1, 2, 3].forEach((i) => e.push({ t: o.s + (3 + i * 9) / 30, ad: `blip${i + 1}`, v: 0.3 })); cikis(); break;
  }
  return (
    <>
      {e.map((x, i) => (
        <Sequence key={i} from={Math.max(0, Math.round(x.t * 30))} durationInFrames={45}>
          <Audio src={k.sfx(x.ad)} volume={x.v} />
        </Sequence>
      ))}
    </>
  );
};

// ---------------- B-roll: tam ekran motion graphic ara sahneler (ses devam eder) ----------------
const BRollZemin: React.FC<{ children: React.ReactNode; sure: number }> = ({ children, sure }) => {
  const f = useCurrentFrame();
  const op = interpolate(f, [0, 5, sure - 5, sure], [0, 1, 1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const zoom = interpolate(f, [0, sure], [1.08, 1.0]);
  return (
    <AbsoluteFill style={{ opacity: op, overflow: "hidden", background: "radial-gradient(ellipse at 50% 35%, #2a1d4f 0%, #120c2a 50%, #06050f 100%)" }}>
      {/* cam daireler (ref1 dili) */}
      {[[540, 420, 360], [200, 1300, 520], [900, 1500, 420]].map(([x, y, r], i) => (
        <div key={i} style={{ position: "absolute", left: x - r / 2, top: y - r / 2 + Math.sin((f + i * 20) / 18) * 12, width: r, height: r, borderRadius: r, border: "2px solid rgba(255,255,255,0.14)", background: "radial-gradient(circle at 30% 30%, rgba(255,255,255,0.10), rgba(255,255,255,0.02))" }} />
      ))}
      <AbsoluteFill style={{ transform: `scale(${zoom})` }}>{children}</AbsoluteFill>
    </AbsoluteFill>
  );
};

const BRollStok: React.FC<{ o: Olay; sure: number }> = ({ o, sure }) => {
  const f = useCurrentFrame();
  const kutular = [0, 1, 2, 3, 4, 5];
  const deger = Math.round(interpolate(f, [4, sure - 8], [0, 200], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }));
  return (
    <BRollZemin sure={sure}>
      <div style={{ position: "absolute", top: 380, left: 0, right: 0, textAlign: "center", fontFamily: INTER, fontWeight: 800, fontSize: 40, letterSpacing: 8, color: "rgba(255,255,255,0.7)" }}>{o.ust}</div>
      {kutular.map((i) => {
        const g = spring({ frame: f - i * 3, fps: 30, config: { damping: 10, stiffness: 160 } });
        const x = 300 + (i % 3) * 170; const y = 1080 - Math.floor(i / 3) * 165;
        return <div key={i} style={{ position: "absolute", left: x, top: y - (1 - g) * 700, fontSize: 150, fontFamily: EMOJI, transform: `rotate(${(i % 2 ? 6 : -5) * (1 - g)}deg)` }}>📦</div>;
      })}
      {[0, 1, 2, 3].map((i) => {
        const t = (f - 6 - i * 4) / 30;
        return t > 0 ? <div key={`p${i}`} style={{ position: "absolute", left: 460 + (i - 1.5) * 150 + t * (i - 1.5) * 220, top: 900 - t * 900 + t * t * 500, fontSize: 90, fontFamily: EMOJI, transform: `rotate(${t * 200 * (i % 2 ? 1 : -1)}deg)` }}>💸</div> : null;
      })}
      <div style={{ position: "absolute", top: 520, left: 0, right: 0, textAlign: "center", fontFamily: INTER, fontWeight: 800, fontSize: 130, color: "white", letterSpacing: -3, textShadow: "0 10px 40px rgba(0,0,0,0.6)" }}>
        ₺{deger} <span style={{ fontSize: 80 }}>BİN</span>
      </div>
    </BRollZemin>
  );
};

const BRollDropship: React.FC<{ o: Olay; sure: number }> = ({ o, sure }) => {
  const f = useCurrentFrame();
  const rota = interpolate(f, [4, sure - 6], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.inOut(Easing.cubic) });
  const P0 = [230, 880], P1 = [540, 560], P2 = [850, 900];
  const bez = (t: number) => [(1 - t) ** 2 * P0[0] + 2 * (1 - t) * t * P1[0] + t * t * P2[0], (1 - t) ** 2 * P0[1] + 2 * (1 - t) * t * P1[1] + t * t * P2[1]];
  const [ux, uy] = bez(rota);
  const yol = `M ${P0[0]} ${P0[1]} Q ${P1[0]} ${P1[1]} ${P2[0]} ${P2[1]}`;
  const g = spring({ frame: f, fps: 30, config: { damping: 12 } });
  return (
    <BRollZemin sure={sure}>
      <div style={{ position: "absolute", top: 300, left: 0, right: 0, textAlign: "center", fontFamily: INTER, fontWeight: 800, fontSize: 96, color: "white", letterSpacing: -2, opacity: g }}>{o.baslik}</div>
      <div style={{ position: "absolute", left: 340, top: 600, fontSize: 400, fontFamily: EMOJI, opacity: 0.22 }}>🌍</div>
      <svg width={1080} height={1920} style={{ position: "absolute", left: 0, top: 0 }}>
        <path d={yol} stroke={RENK.turuncu} strokeWidth={8} fill="none" strokeDasharray="22 18" pathLength={1} style={{ strokeDasharray: `${rota} 1` }} />
      </svg>
      <div style={{ position: "absolute", left: P0[0] - 80, top: P0[1] - 20, fontSize: 130, fontFamily: EMOJI }}>🏭</div>
      <div style={{ position: "absolute", left: P2[0] - 70, top: P2[1] - 20, fontSize: 130, fontFamily: EMOJI, opacity: rota > 0.95 ? 1 : 0.35 }}>🏠</div>
      <div style={{ position: "absolute", left: ux - 55, top: uy - 70, fontSize: 110, fontFamily: EMOJI }}>✈️</div>
      <div style={{ position: "absolute", top: 1080, left: 0, right: 0, display: "flex", justifyContent: "center", gap: 24 }}>
        {o.etiketler.map((x: string, i: number) => (
          <div key={x} style={{ ...cam, borderRadius: 40, padding: "12px 28px", fontFamily: INTER, fontWeight: 800, fontSize: 34, color: "white", opacity: interpolate(f, [8 + i * 6, 14 + i * 6], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) }}>{x}</div>
        ))}
      </div>
    </BRollZemin>
  );
};

export const Reels: React.FC<{ v: ReelsVeri; k: Kaynak }> = ({ v, k }) => (
  <AbsoluteFill style={{ background: "black" }}>
    <Goruntu v={v} k={k} />
    {/* hafif sinematik karartma: alt ve üst */}
    <AbsoluteFill style={{ background: "linear-gradient(180deg, rgba(0,0,0,0.35) 0%, rgba(0,0,0,0) 18%, rgba(0,0,0,0) 42%, rgba(0,0,0,0.55) 100%)" }} />
    {v.olaylar.map((o, i) => (
      <Sequence key={i} from={Math.round(o.s * 30)} durationInFrames={Math.max(1, Math.round((o.son - o.s) * 30))}>
        <OlayCiz o={o} k={k} />
      </Sequence>
    ))}
    <Altyazi v={v} />
    {v.olaylar.map((o, i) => <Sesler key={`s${i}`} o={o} k={k} />)}
    {k.muzik ? <Audio src={k.muzik} volume={0.07} /> : null}
  </AbsoluteFill>
);
