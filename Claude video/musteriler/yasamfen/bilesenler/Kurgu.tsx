// Yaşamfen veri güdümlü kurgu: parçalar (video + temiz ses), zoom/punch, yumuşak geçiş, altyazı, oyun grafikleri, müzik.
// Veri: src/<video>.json  →  <Kurgu v={...} />
import React from "react";
import { AbsoluteFill, Audio, Easing, OffthreadVideo, Sequence, interpolate, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { CevapKarti, Elendi, FazBandi, RolKarti, Sayac, SoruKarti, YF } from "./OyunGrafikleri";

export type Parca = {
  src: string; // girdiler/ içindeki video (H.264 vekil)
  ses?: string; // girdiler/ içindeki temiz ses (yoksa sessiz)
  bas: number; // kaynakta başlangıç (sn)
  kare: number; // süre (kare)
  sesSeviye?: number;
  zoom?: [number, number]; // parça boyunca ölçek (başlangıç → bitiş)
  punch?: { kare: number; olcek: number; sure?: number }[]; // vurgu anında yumuşak yakınlaşma (parça içi kare)
  odak?: [number, number]; // zoom merkezi (0–1)
  gecis?: "yumusak" | "beyaz" | "siyah"; // parça başında sade geçiş
  sessiz?: boolean; // B-roll: ses yok
};
export type Kelime = { w: string; s: number; e: number };
export type Olay = { tip: string; s: number; son: number; [k: string]: any };
export type KurguVeri = {
  fps: number;
  parcalar: Parca[];
  altyazi: Kelime[];
  vurgu?: string[];
  altyaziGizle?: [number, number][]; // bu aralıklarda altyazı yok (soru kartı vb.)
  olaylar: Olay[];
  muzik?: { src: string; seviye: number; konusmaSeviye?: number };
  sfx?: { ad: string; s: number; seviye?: number }[];
  toplamKare: number;
};

const kl = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;

// ───────── Arka plan parçası ─────────
const ParcaGorunum: React.FC<{ p: Parca }> = ({ p }) => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const [z0, z1] = p.zoom ?? [1, 1];
  let olcek = interpolate(f, [0, p.kare], [z0, z1], { ...kl, easing: Easing.inOut(Easing.sin) });
  for (const pu of p.punch ?? []) {
    const d = pu.sure ?? 8;
    const g = interpolate(f, [pu.kare, pu.kare + d], [0, 1], { ...kl, easing: Easing.out(Easing.cubic) });
    olcek *= 1 + (pu.olcek - 1) * g;
  }
  let blur = 0, ek = 1, ortu = 0, ortuRenk = "#fff";
  if (p.gecis) {
    const g = interpolate(f, [0, 9], [1, 0], { ...kl, easing: Easing.out(Easing.cubic) });
    if (p.gecis === "yumusak") { blur = 10 * g; ek = 1 + 0.06 * g; }
    else { ortu = g; ortuRenk = p.gecis === "beyaz" ? "#fff" : "#000"; }
  }
  const [ox, oy] = p.odak ?? [0.5, 0.45];
  return (
    <AbsoluteFill style={{ overflow: "hidden", backgroundColor: "#000" }}>
      <AbsoluteFill style={{ transform: `scale(${olcek * ek})`, transformOrigin: `${ox * 100}% ${oy * 100}%`, filter: blur > 0.2 ? `blur(${blur}px)` : undefined }}>
        <OffthreadVideo src={staticFile(p.src)} startFrom={Math.round(p.bas * fps)} muted style={{ width: "100%", height: "100%", objectFit: "cover" }} />
      </AbsoluteFill>
      {ortu > 0 && <AbsoluteFill style={{ backgroundColor: ortuRenk, opacity: ortu * 0.85 }} />}
      {!p.sessiz && p.ses && (
        <Audio src={staticFile(p.ses)} startFrom={Math.round(p.bas * fps)} endAt={Math.round(p.bas * fps) + p.kare}
          volume={(i) => (p.sesSeviye ?? 1) * interpolate(i, [0, 1, p.kare - 1, p.kare], [0, 1, 1, 0], kl)} />
      )}
    </AbsoluteFill>
  );
};

// ───────── Altyazı: 2–4 kelimelik sayfalar, beyaz, vurgu kalın + kırmızı alt çizgi ─────────
type Sayfa = { k: Kelime[]; s: number; e: number };
const sayfala = (a: Kelime[]): Sayfa[] => {
  const out: Sayfa[] = []; let cur: Kelime[] = [];
  const bitir = () => { if (cur.length) out.push({ k: cur, s: cur[0].s, e: cur[cur.length - 1].e }); cur = []; };
  for (const w of a) {
    const onceki = cur[cur.length - 1];
    if (cur.length && (cur.length >= 4 || w.s - onceki.e > 0.45 || /[.?!,]$/.test(onceki.w) && cur.length >= 2 || cur.map((x) => x.w).join(" ").length + w.w.length > 22)) bitir();
    cur.push(w);
  }
  bitir();
  for (let i = 0; i < out.length; i++) out[i].e = Math.min(out[i].e + 0.35, i + 1 < out.length ? out[i + 1].s : out[i].e + 0.35);
  return out;
};
const kucult = (s: string) => s.replace(/İ/g, "i").replace(/I/g, "ı").toLowerCase().replace(/[.,!?…"“”']/g, "");

const Altyazi: React.FC<{ v: KurguVeri }> = ({ v }) => {
  const f = useCurrentFrame();
  const t = f / v.fps;
  if ((v.altyaziGizle ?? []).some(([a, b]) => t >= a && t < b)) return null;
  const sayfalar = React.useMemo(() => sayfala(v.altyazi), [v.altyazi]);
  const sy = sayfalar.find((p) => t >= p.s && t < p.e);
  if (!sy) return null;
  const vurgu = new Set((v.vurgu ?? []).map(kucult));
  const g = interpolate(t, [sy.s, sy.s + 0.12], [0, 1], kl);
  return (
    <AbsoluteFill style={{ justifyContent: "flex-start", alignItems: "center", paddingTop: 1920 * 0.68 }}>
      <div style={{ maxWidth: 900, textAlign: "center", opacity: g, transform: `translateY(${(1 - g) * 14}px)`, fontFamily: YF.metin, fontSize: 62, lineHeight: 1.2, color: "#fff",
        textShadow: "0 3px 14px rgba(0,0,0,0.65), 0 1px 3px rgba(0,0,0,0.8)" }}>
        {sy.k.map((w, i) => {
          const vv = vurgu.has(kucult(w.w));
          const aktif = t >= w.s;
          return (
            <span key={i} style={{ fontWeight: vv ? 800 : 600, opacity: aktif ? 1 : 0.55, marginRight: 14, display: "inline-block",
              borderBottom: vv ? `6px solid ${YF.kirmiziAcik}` : undefined, paddingBottom: vv ? 2 : 0 }}>{w.w}</span>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};

// ───────── Başlık / kanca, etiket, çağrı ─────────
const Baslik: React.FC<{ o: Olay; sure: number }> = ({ o, sure }) => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const g = interpolate(f, [0, 10], [0, 1], { ...kl, easing: Easing.out(Easing.back(1.6)) });
  const c = interpolate(f, [sure - 8, sure], [0, 1], kl);
  return (
    <AbsoluteFill style={{ justifyContent: "flex-start", alignItems: "center", paddingTop: o.y ?? 300, opacity: 1 - c }}>
      {o.ust && <div style={{ background: YF.kirmizi, color: "#fff", fontFamily: YF.baslik, fontWeight: 800, fontSize: 38, letterSpacing: 3, padding: "10px 30px", borderRadius: 999,
        transform: `scale(${g})`, marginBottom: 18, boxShadow: "0 10px 30px rgba(0,0,0,0.3)" }}>{o.ust}</div>}
      <div style={{ fontFamily: YF.baslik, fontWeight: 900, fontSize: o.boyut ?? 92, color: "#fff", textAlign: "center", lineHeight: 1.05, padding: "0 60px",
        transform: `translateY(${(1 - g) * 40}px)`, opacity: g, textShadow: "0 6px 28px rgba(0,0,0,0.55)" }}>
        {String(o.metin).split("\n").map((s: string, i: number) => <div key={i} style={{ color: i === 1 && o.vurguSatir ? YF.kirmiziAcik : "#fff" }}>{s}</div>)}
      </div>
      {o.alt && <div style={{ fontFamily: YF.metin, fontWeight: 600, fontSize: 44, color: "#fff", marginTop: 18, opacity: interpolate(f, [6, 16], [0, 1], kl), textShadow: "0 3px 14px rgba(0,0,0,0.6)" }}>{o.alt}</div>}
      {o.sfx !== false && <Sequence layout="none"><Audio src={staticFile("sfx/baslik.wav")} volume={0.5} /></Sequence>}
    </AbsoluteFill>
  );
};

const Etiket: React.FC<{ o: Olay; sure: number }> = ({ o, sure }) => {
  const f = useCurrentFrame();
  const g = interpolate(f, [0, 8], [0, 1], { ...kl, easing: Easing.out(Easing.back(2)) });
  const c = interpolate(f, [sure - 6, sure], [0, 1], kl);
  return (
    <div style={{ position: "absolute", left: o.x ?? 540, top: o.y ?? 400, transform: `translate(-50%,-50%) scale(${g * (1 - 0.2 * c)})`, opacity: 1 - c,
      background: o.renk ?? YF.kirmizi, color: "#fff", fontFamily: YF.baslik, fontWeight: 900, fontSize: o.boyut ?? 44, padding: "12px 28px", borderRadius: 18,
      boxShadow: "0 12px 30px rgba(0,0,0,0.35)", whiteSpace: "nowrap" }}>
      {o.metin}
      {o.sfx !== false && <Audio src={staticFile(`sfx/${o.ses ?? "pop"}.wav`)} volume={0.45} />}
    </div>
  );
};

const Cagri: React.FC<{ o: Olay; sure: number }> = ({ o, sure }) => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const g = interpolate(f, [0, 12], [0, 1], { ...kl, easing: Easing.out(Easing.back(1.4)) });
  const nabiz = 1 + 0.03 * Math.sin((f / fps) * Math.PI * 2);
  return (
    <AbsoluteFill style={{ justifyContent: "flex-end", alignItems: "center", paddingBottom: o.alt ?? 420 }}>
      <div style={{ background: "#fff", borderRadius: 34, padding: "30px 46px", textAlign: "center", boxShadow: "0 24px 60px rgba(0,0,0,0.35)", borderBottom: `10px solid ${YF.kirmizi}`,
        transform: `scale(${g * nabiz})`, opacity: g }}>
        <div style={{ fontFamily: YF.baslik, fontWeight: 900, fontSize: 56, color: YF.antrasit, lineHeight: 1.1 }}>{o.metin}</div>
        {o.altMetin && <div style={{ fontFamily: YF.metin, fontWeight: 600, fontSize: 38, color: YF.kirmizi, marginTop: 8 }}>{o.altMetin}</div>}
      </div>
      <Audio src={staticFile("sfx/cagri.wav")} volume={0.5} />
    </AbsoluteFill>
  );
};

const OlayGorunum: React.FC<{ o: Olay; sure: number }> = ({ o, sure }) => {
  switch (o.tip) {
    case "soru": return <SoruKarti {...(o as any)} sure={sure} />;
    case "sayac": return <Sayac {...(o as any)} sure={sure} />;
    case "cevap": return <CevapKarti {...(o as any)} sure={sure} />;
    case "rol": return <RolKarti {...(o as any)} sure={sure} />;
    case "faz": return <FazBandi {...(o as any)} sure={sure} />;
    case "elendi": return <Elendi {...(o as any)} sure={sure} />;
    case "baslik": return <Baslik o={o} sure={sure} />;
    case "etiket": return <Etiket o={o} sure={sure} />;
    case "cagri": return <Cagri o={o} sure={sure} />;
    case "karart": return <AbsoluteFill style={{ background: `rgba(0,0,0,${o.seviye ?? 0.35})` }} />;
    default: return null;
  }
};

export const Kurgu: React.FC<{ v: KurguVeri }> = ({ v }) => {
  let bas = 0;
  const konusma = v.muzik?.konusmaSeviye;
  return (
    <AbsoluteFill style={{ backgroundColor: "#000" }}>
      {v.parcalar.map((p, i) => {
        const s = bas; bas += p.kare;
        return <Sequence key={i} from={s} durationInFrames={p.kare}><ParcaGorunum p={p} /></Sequence>;
      })}
      {v.olaylar.filter((o) => o.tip === "karart").map((o, i) => (
        <Sequence key={`k${i}`} from={Math.round(o.s * v.fps)} durationInFrames={Math.max(1, Math.round((o.son - o.s) * v.fps))}><OlayGorunum o={o} sure={Math.round((o.son - o.s) * v.fps)} /></Sequence>
      ))}
      <Altyazi v={v} />
      {v.olaylar.filter((o) => o.tip !== "karart").map((o, i) => {
        const sure = Math.max(1, Math.round((o.son - o.s) * v.fps));
        return <Sequence key={i} from={Math.round(o.s * v.fps)} durationInFrames={sure}><OlayGorunum o={o} sure={sure} /></Sequence>;
      })}
      {(v.sfx ?? []).map((x, i) => (
        <Sequence key={`s${i}`} from={Math.round(x.s * v.fps)} layout="none"><Audio src={staticFile(`sfx/${x.ad}.wav`)} volume={x.seviye ?? 0.5} /></Sequence>
      ))}
      {v.muzik && (
        <Audio src={staticFile(v.muzik.src)} loop
          volume={(f) => {
            const t = f / v.fps;
            const konus = konusma !== undefined && v.altyazi.some((w) => t >= w.s - 0.15 && t <= w.e + 0.25);
            const giris = interpolate(f, [0, 15], [0, 1], kl), cikis = interpolate(f, [v.toplamKare - 30, v.toplamKare], [1, 0], kl);
            return (konus ? konusma! : v.muzik!.seviye) * giris * cikis;
          }} />
      )}
    </AbsoluteFill>
  );
};
