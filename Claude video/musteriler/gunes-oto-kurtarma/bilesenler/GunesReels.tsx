import React from "react";
import { AbsoluteFill, Audio, Img, OffthreadVideo, Sequence, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import "@fontsource/saira/latin-ext-700.css";
import "@fontsource/saira/latin-ext-800.css";
import "@fontsource/saira/latin-ext-800-italic.css";
import "@fontsource/saira/latin-ext-900-italic.css";
import "@fontsource/saira/latin-700.css";
import "@fontsource/saira/latin-800.css";
import "@fontsource/saira/latin-800-italic.css";
import "@fontsource/saira/latin-900-italic.css";

// Güneş Ağır Ticari Oto Kurtarma — Reels şablonu (marka: musteriler/gunes-oto-kurtarma/MARKA.md)
// Sarı #FDD301 + siyah, kalın eğik başlık (Saira), sarı-siyah ikaz şeridi motifi. Kanal stili KULLANILMAZ.
export const SARI = "#FDD301";
const SIYAH = "#0A0A0A";
const KIRMIZI = "#FF3B30";
const F = "'Saira', sans-serif";
const SERIT = `repeating-linear-gradient(-45deg, ${SARI} 0 22px, ${SIYAH} 22px 44px)`;

type Olay = { tip: string; s: number; son: number; [k: string]: any };
export type GunesVeri = {
  parcalar: { src: string; ses: string; bas: number; kare: number; zoom: boolean; sesSeviye?: number }[];
  broll: { dosya: string; bas: number; s: number; son: number; zoom?: number }[];
  altyazi: { w: string; s: number; e: number }[];
  olaylar: Olay[];
  vurgu: string[];
  toplamKare: number;
  kartY?: number;
  altyaziY?: number;
};
type Kaynak = { dosya: (ad: string) => string; logo: string; sfx: (ad: string) => string; muzik?: string };

let KART_Y = 1040;
let ALTYAZI_Y = 1440;

const useGiris = (gecikme = 0, d = 14) => {
  const f = useCurrentFrame();
  return spring({ frame: f - gecikme, fps: 30, config: { damping: d, stiffness: 180 } });
};
const useCikis = (sure: number, u = 7) => {
  const f = useCurrentFrame();
  return interpolate(f, [sure - u, sure], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
};
const panel: React.CSSProperties = {
  background: "rgba(10,10,10,0.90)",
  borderRadius: 18,
  boxShadow: "0 18px 50px rgba(0,0,0,0.55)",
  border: "2px solid rgba(253,211,1,0.35)",
};

// ---------------- Görüntü: konuşma parçaları + kendi çekimlerimizden B-roll ----------------
const Goruntu: React.FC<{ v: GunesVeri; k: Kaynak }> = ({ v, k }) => {
  let t = 0;
  return (
    <>
      {v.parcalar.map((p, i) => {
        const from = t;
        t += p.kare;
        return (
          <Sequence key={i} from={from} durationInFrames={p.kare}>
            <AbsoluteFill style={{ overflow: "hidden" }}>
              <OffthreadVideo src={k.dosya(p.src)} startFrom={Math.round(p.bas * 30)} muted style={{ width: 1080, height: 1920, transform: `scale(${p.zoom ? 1.07 : 1})`, transformOrigin: "540px 600px" }} />
            </AbsoluteFill>
            <Audio src={k.dosya(p.ses)} startFrom={Math.round(p.bas * 30)} volume={p.sesSeviye ?? 1} />
          </Sequence>
        );
      })}
    </>
  );
};

const BRoll: React.FC<{ b: GunesVeri["broll"][number]; sure: number; k: Kaynak }> = ({ b, sure, k }) => {
  const f = useCurrentFrame();
  const z = interpolate(f, [0, sure], [1.0, b.zoom ?? 1.08]);
  const op = interpolate(f, [0, 3, sure - 3, sure], [0, 1, 1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  return (
    <AbsoluteFill style={{ overflow: "hidden", opacity: op }}>
      <OffthreadVideo src={k.dosya(b.dosya)} startFrom={Math.round(b.bas * 30)} muted style={{ width: 1080, height: 1920, transform: `scale(${z})` }} />
    </AbsoluteFill>
  );
};

// ---------------- Altyazı ----------------
type Sayfa = { k: GunesVeri["altyazi"]; s: number; e: number };
const temiz = (s: string) => s.replace(/[.,!…;:]+$/g, "");
const buyuk = (s: string) => s.toLocaleUpperCase("tr-TR");
const sayfala = (a: GunesVeri["altyazi"]): Sayfa[] => {
  const out: Sayfa[] = [];
  let c: Sayfa | null = null;
  for (const w of a) {
    const son = c?.k[c.k.length - 1];
    const uz = c ? c.k.map((x) => temiz(x.w)).join(" ").length + temiz(w.w).length : 0;
    if (!c || c.k.length >= 3 || uz > 18 || (son && /[.?!,]$/.test(son.w)) || (son && w.s - son.e > 0.4)) {
      c = { k: [], s: w.s, e: w.e };
      out.push(c);
    }
    c.k.push(w);
    c.e = w.e;
  }
  for (let i = 0; i < out.length - 1; i++) if (out[i + 1].s - out[i].e < 0.3) out[i].e = out[i + 1].s;
  return out;
};
const Altyazi: React.FC<{ v: GunesVeri }> = ({ v }) => {
  const frame = useCurrentFrame();
  const t = frame / 30;
  const sayfalar = React.useMemo(() => sayfala(v.altyazi), [v]);
  const vurgu = React.useMemo(() => new Set(v.vurgu.map((x) => x.toLocaleLowerCase("tr-TR"))), [v]);
  const p = sayfalar.find((x) => t >= x.s && t < x.e + 0.1);
  if (!p) return null;
  const g = spring({ frame: frame - Math.round(p.s * 30), fps: 30, config: { damping: 15, stiffness: 240 } });
  return (
    <div style={{ position: "absolute", top: ALTYAZI_Y, left: 60, width: 960, display: "flex", flexWrap: "wrap", justifyContent: "center", gap: "0 18px", transform: `scale(${interpolate(g, [0, 1], [0.86, 1])})`, opacity: g }}>
      {p.k.map((w, i) => {
        const aktif = t >= w.s - 0.03;
        const vur = vurgu.has(temiz(w.w).toLocaleLowerCase("tr-TR").replace(/[?]/g, ""));
        return (
          <span key={i} style={{ fontFamily: F, fontWeight: 900, fontStyle: "italic", fontSize: 78, lineHeight: 1.12, letterSpacing: 0.5, color: vur ? SARI : "white", opacity: aktif ? 1 : 0.5, WebkitTextStroke: "3px black", paintOrder: "stroke fill", textShadow: "0 6px 18px rgba(0,0,0,0.7)" }}>
            {buyuk(temiz(w.w))}
          </span>
        );
      })}
    </div>
  );
};

// ---------------- Grafikler ----------------
// Kanca başlığı: ilk karede tam görünür (video sözle başlar, başlık konuşmanın üstüne biner)
const Kanca: React.FC<{ o: Olay; sure: number }> = ({ o, sure }) => {
  const f = useCurrentFrame();
  const cik = useCikis(sure);
  const g = o.anlik ? 1 : spring({ frame: f, fps: 30, config: { damping: 13, stiffness: 190 } });
  return (
    <div style={{ position: "absolute", top: o.top ?? 210, left: 0, right: 0, display: "flex", flexDirection: "column", alignItems: "center", opacity: cik }}>
      <div style={{ background: SARI, padding: "6px 30px 2px", transform: `skewX(-10deg) scale(${interpolate(g, [0, 1], [0.7, 1])})`, boxShadow: "0 12px 34px rgba(0,0,0,0.5)" }}>
        <div style={{ transform: "skewX(10deg)", fontFamily: F, fontWeight: 900, fontStyle: "italic", fontSize: o.boyut ?? 92, color: SIYAH, lineHeight: 1.05, textAlign: "center" }}>{o.satir1}</div>
      </div>
      {o.satir2 ? (
        <div style={{ marginTop: 10, background: SIYAH, padding: "4px 24px", transform: `skewX(-10deg) translateY(${interpolate(g, [0, 1], [30, 0])}px)` }}>
          <div style={{ transform: "skewX(10deg)", fontFamily: F, fontWeight: 800, fontStyle: "italic", fontSize: 54, color: "white", lineHeight: 1.1 }}>{o.satir2}</div>
        </div>
      ) : null}
    </div>
  );
};

// Madde listesi (✓ / ✕ / numara); her madde kendi kelimesinde gelir
const Liste: React.FC<{ o: Olay; sure: number }> = ({ o, sure }) => {
  const f = useCurrentFrame();
  const g = useGiris(0, 14);
  const cik = useCikis(sure);
  return (
    <div style={{ position: "absolute", top: o.top ?? KART_Y - 80, left: 0, right: 0, display: "flex", justifyContent: "center", opacity: Math.min(g, cik) }}>
      <div style={{ ...panel, padding: "22px 40px 24px 34px", minWidth: 760, maxWidth: 960, display: "flex", flexDirection: "column", gap: 12, transform: `scale(${interpolate(g, [0, 1], [0.85, 1])})`, borderTop: "none", position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", left: 0, right: 0, top: 0, height: 12, background: SERIT }} />
        {o.baslik ? <div style={{ marginTop: 6, fontFamily: F, fontWeight: 800, fontSize: 32, letterSpacing: 4, color: SARI }}>{o.baslik}</div> : <div style={{ height: 4 }} />}
        {o.ogeler.map((og: any[], i: number) => {
          const gk = og[1] != null ? Math.round((og[1] - o.s) * 30) : -30;
          const gi = spring({ frame: f - gk, fps: 30, config: { damping: 12, stiffness: 210 } });
          const isaret = o.isaret === "carpi" ? "✕" : o.isaret === "sayi" ? String(i + 1) : "✓";
          const renk = o.isaret === "carpi" ? KIRMIZI : SARI;
          return (
            <div key={i} style={{ display: "flex", alignItems: "center", gap: 20, opacity: gi, transform: `translateX(${interpolate(gi, [0, 1], [-50, 0])}px)` }}>
              <div style={{ width: 58, height: 58, flexShrink: 0, borderRadius: 12, background: renk, color: o.isaret === "carpi" ? "white" : SIYAH, fontFamily: F, fontWeight: 900, fontSize: 40, display: "flex", alignItems: "center", justifyContent: "center", transform: `skewX(-8deg) scale(${interpolate(gi, [0, 1], [0.3, 1])})` }}>{isaret}</div>
              <div style={{ fontFamily: F, fontWeight: 800, fontStyle: "italic", fontSize: o.boyut ?? 54, color: "white", lineHeight: 1.1 }}>{og[0]}</div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

// Tek vurgu kartı (ör. "3 – 15 TON", "4-5 AY")
const Stat: React.FC<{ o: Olay; sure: number }> = ({ o, sure }) => {
  const g = useGiris(0, 11);
  const cik = useCikis(sure);
  const c = useGiris(6, 20);
  return (
    <div style={{ position: "absolute", top: o.top ?? KART_Y - 20, left: 0, right: 0, display: "flex", justifyContent: "center", opacity: Math.min(g, cik) }}>
      <div style={{ ...panel, padding: "18px 46px 22px", display: "flex", flexDirection: "column", alignItems: "center", transform: `scale(${interpolate(g, [0, 1], [0.7, 1])})` }}>
        <div style={{ fontFamily: F, fontWeight: 800, fontSize: 30, letterSpacing: 5, color: "rgba(255,255,255,0.75)" }}>{o.ust}</div>
        <div style={{ fontFamily: F, fontWeight: 900, fontStyle: "italic", fontSize: 104, color: SARI, lineHeight: 1.05 }}>{o.deger}</div>
        <div style={{ height: 10, width: `${c * 100}%`, background: SERIT, borderRadius: 3, marginTop: 6 }} />
      </div>
    </div>
  );
};

// Uyarı damgası (ör. "GAZA BASMAYIN")
const Uyari: React.FC<{ o: Olay; sure: number }> = ({ o, sure }) => {
  const g = useGiris(0, 9);
  const cik = useCikis(sure);
  const kirmizi = o.renk !== "sari";
  return (
    <div style={{ position: "absolute", top: o.top ?? KART_Y, left: 0, right: 0, display: "flex", justifyContent: "center", opacity: Math.min(g, cik), transform: `scale(${interpolate(g, [0, 1], [2.2, 1])}) rotate(-6deg)` }}>
      <div style={{ fontFamily: F, fontWeight: 900, fontStyle: "italic", fontSize: o.boyut ?? 80, color: kirmizi ? KIRMIZI : SIYAH, background: kirmizi ? "rgba(255,255,255,0.95)" : SARI, border: `9px solid ${kirmizi ? KIRMIZI : SIYAH}`, borderRadius: 16, padding: "4px 30px", boxShadow: "0 12px 34px rgba(0,0,0,0.5)", textAlign: "center", lineHeight: 1.05 }}>{o.metin}</div>
    </div>
  );
};

// Her videoda: köşede küçük logo
const KoseLogo: React.FC<{ logo: string }> = ({ logo }) => (
  <div style={{ position: "absolute", top: 70, left: 40, width: 330, filter: "drop-shadow(0 4px 12px rgba(0,0,0,0.6))" }}>
    <Img src={logo} style={{ width: 330 }} />
  </div>
);

// Kapanış: logo + 7/24 + telefon (son cümlede başlar, son karede sönmez)
const Kapanis: React.FC<{ o: Olay; sure: number; logo: string }> = ({ o, logo }) => {
  const f = useCurrentFrame();
  const g = useGiris(0, 13);
  const g2 = useGiris(7, 12);
  const g3 = useGiris(13, 12);
  const nabiz = 1 + 0.035 * Math.sin(f / 4);
  return (
    <AbsoluteFill>
      <AbsoluteFill style={{ background: `linear-gradient(180deg, rgba(0,0,0,0) 35%, rgba(0,0,0,${0.75 * g}) 60%, rgba(0,0,0,${0.85 * g}) 100%)` }} />
      <div style={{ position: "absolute", top: o.top ?? 1030, left: 0, right: 0, display: "flex", flexDirection: "column", alignItems: "center", gap: 18 }}>
        <Img src={logo} style={{ width: 860, opacity: g, transform: `scale(${interpolate(g, [0, 1], [0.8, 1])})` }} />
        <div style={{ display: "flex", alignItems: "center", gap: 18, opacity: g2, transform: `translateY(${interpolate(g2, [0, 1], [40, 0])}px)` }}>
          <div style={{ background: SARI, padding: "4px 22px", transform: "skewX(-10deg)" }}>
            <div style={{ transform: "skewX(10deg)", fontFamily: F, fontWeight: 900, fontStyle: "italic", fontSize: 62, color: SIYAH }}>7/24</div>
          </div>
          <div style={{ fontFamily: F, fontWeight: 900, fontStyle: "italic", fontSize: 76, color: "white", letterSpacing: 1, WebkitTextStroke: "2px black", paintOrder: "stroke fill" }}>0544 397 87 96</div>
        </div>
        <div style={{ fontFamily: F, fontWeight: 800, fontSize: 36, color: "rgba(255,255,255,0.92)", letterSpacing: 2, opacity: g3, transform: `scale(${nabiz})` }}>{o.alt ?? "ARA · WHATSAPP · ANKARA"}</div>
      </div>
    </AbsoluteFill>
  );
};


// Numara etiketi: konuşmacının "şuraya bırakıyorum" diye gösterdiği yere yapışır (o.top / o.left)
const Numara: React.FC<{ o: Olay; sure: number }> = ({ o }) => {
  const f = useCurrentFrame();
  const g = spring({ frame: f, fps: 30, config: { damping: 9, stiffness: 220 } });
  const g2 = useGiris(8, 12);
  const nabiz = 1 + 0.03 * Math.sin(f / 4);
  return (
    <div style={{ position: "absolute", top: o.top ?? 560, left: o.left ?? 430, display: "flex", flexDirection: "column", alignItems: "flex-start", gap: 10, transform: `scale(${interpolate(g, [0, 1], [0.2, 1]) * nabiz}) rotate(${interpolate(g, [0, 1], [-14, -4])}deg)`, transformOrigin: "0% 100%", opacity: Math.min(1, g * 1.5) }}>
      <div style={{ background: SARI, padding: "10px 30px 6px", transform: "skewX(-10deg)", border: `6px solid ${SIYAH}`, boxShadow: "0 16px 40px rgba(0,0,0,0.55)" }}>
        <div style={{ transform: "skewX(10deg)", fontFamily: F, fontWeight: 900, fontStyle: "italic", fontSize: 74, color: SIYAH, lineHeight: 1, whiteSpace: "nowrap" }}>0544 397 87 96</div>
      </div>
      <div style={{ marginLeft: 26, background: SIYAH, padding: "4px 18px", transform: "skewX(-10deg)", opacity: g2 }}>
        <div style={{ transform: "skewX(10deg)", fontFamily: F, fontWeight: 800, fontStyle: "italic", fontSize: 36, color: "white", whiteSpace: "nowrap" }}>7/24 · ARA · WHATSAPP</div>
      </div>
    </div>
  );
};

const OlayCiz: React.FC<{ o: Olay; k: Kaynak }> = ({ o, k }) => {
  const sure = Math.max(1, Math.round((o.son - o.s) * 30));
  switch (o.tip) {
    case "kanca": return <Kanca o={o} sure={sure} />;
    case "liste": return <Liste o={o} sure={sure} />;
    case "stat": return <Stat o={o} sure={sure} />;
    case "uyari": return <Uyari o={o} sure={sure} />;
    case "kapanis": return <Kapanis o={o} sure={sure} logo={k.logo} />;
    case "numara": return <Numara o={o} sure={sure} />;
    default: return null;
  }
};

const Sesler: React.FC<{ o: Olay; k: Kaynak }> = ({ o, k }) => {
  const e: { t: number; ad: string; v: number }[] = [];
  const cikis = (ad = "whoosh_cikis", v = 0.22) => e.push({ t: Math.max(o.s, o.son - 0.22), ad, v });
  switch (o.tip) {
    case "kanca": if (!o.anlik) e.push({ t: o.s, ad: "baslik", v: 0.4 }); cikis(); break;
    case "liste": o.ogeler.forEach((og: any[], i: number) => og[1] != null && e.push({ t: og[1], ad: o.isaret === "carpi" ? "pop" : `onay${(i % 4) + 1}`, v: 0.42 })); cikis(); break;
    case "stat": e.push({ t: o.s, ad: "boom", v: 0.4 }); cikis(); break;
    case "uyari": e.push({ t: o.s, ad: "damga", v: 0.6 }); break;
    case "kapanis": e.push({ t: o.s, ad: "cagri", v: 0.45 }); break;
    case "numara": e.push({ t: o.s, ad: "damga", v: 0.5 }); e.push({ t: o.s + 0.1, ad: "basari", v: 0.35 }); break;
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

export const GunesReels: React.FC<{ v: GunesVeri; k: Kaynak }> = ({ v, k }) => {
  KART_Y = v.kartY ?? 1040;
  ALTYAZI_Y = v.altyaziY ?? 1440;
  const kapanisS = v.olaylar.find((o) => o.tip === "kapanis")?.s ?? 1e9;
  return (
    <AbsoluteFill style={{ background: "black" }}>
      <Goruntu v={v} k={k} />
      {v.broll.map((b, i) => {
        const d = Math.max(1, Math.round((b.son - b.s) * 30));
        return (
          <Sequence key={`b${i}`} from={Math.round(b.s * 30)} durationInFrames={d}>
            <BRoll b={b} sure={d} k={k} />
          </Sequence>
        );
      })}
      <AbsoluteFill style={{ background: "linear-gradient(180deg, rgba(0,0,0,0.30) 0%, rgba(0,0,0,0) 16%, rgba(0,0,0,0) 55%, rgba(0,0,0,0.45) 100%)" }} />
      <Sequence durationInFrames={Math.round(kapanisS * 30)}>
        <KoseLogo logo={k.logo} />
      </Sequence>
      {v.olaylar.map((o, i) => (
        <Sequence key={i} from={Math.round(o.s * 30)} durationInFrames={Math.max(1, Math.round((o.son - o.s) * 30))}>
          <OlayCiz o={o} k={k} />
        </Sequence>
      ))}
      <Sequence durationInFrames={Math.round(kapanisS * 30)}>
        <Altyazi v={v} />
      </Sequence>
      {v.olaylar.map((o, i) => <Sesler key={`s${i}`} o={o} k={k} />)}
      {k.muzik ? <Audio src={k.muzik} volume={0.06} /> : null}
    </AbsoluteFill>
  );
};
