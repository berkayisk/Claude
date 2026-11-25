import React from "react";
import { AbsoluteFill, Audio, Img, OffthreadVideo, Sequence, interpolate, spring, useCurrentFrame, useVideoConfig, Easing, staticFile } from "remotion";
import "@fontsource/anton/400.css";
import "@fontsource/inter/600.css";
import "@fontsource/inter/800.css";

// Etkileşim Sihirbazı Reels şablonu — marka/etkilesim-sihirbazi/MARKA.md
// Kapak dili: Anton (condensed, büyük harf), beyaz + sarı vurgu, kırmızı fırça, siyah gölge/kontur.
// Bölgeler (1080x1920): ilerleme 0-10 | marka rozeti ~110 | yüz ~640 | kartlar 860-1260 | altyazı ~1330-1480 | IG alt arayüz 1500+
const ANTON = "'Anton', sans-serif";
const INTER = "'Inter', sans-serif";
const EMOJI = "'Noto Color Emoji', sans-serif";
const SARI = "#FFE600";
const KIRMIZI = "#E5262B";
const YESIL = "#22C55E";
const FPS = 30;

type Olay = { tip: string; s: number; son: number; [k: string]: any };
type Parca = { src: string; ses: string; bas: number; kare: number; tl: number; birim: string; yuz: { t: number; x: number; y: number; h: number }[] };
type Kamera = { s: number; e: number; z0: number; z1: number; giris: string; yh: number };
export type ESVeri = {
  parcalar: Parca[];
  altyazi: { w: string; s: number; e: number }[];
  olaylar: Olay[];
  kamera: Kamera[];
  gizle: number[][];
  vurgu: string[];
  toplamKare: number;
};

const sf = (ad: string) => staticFile(ad);
const clamp = { extrapolateLeft: "clamp" as const, extrapolateRight: "clamp" as const };
const kontur = (px: number, renk = "#000") => ({ WebkitTextStroke: `${px}px ${renk}`, paintOrder: "stroke fill" as any });
const golge = "0 8px 0 rgba(0,0,0,0.85), 0 14px 30px rgba(0,0,0,0.55)";

// ---------------- Kamera (yüz takipli, her <=2 sn hareket) ----------------
const yuzNokta = (p: Parca, t: number) => {
  // ±0.5 sn ağırlıklı ortalama (titreşimsiz takip)
  let sx = 0, sy = 0, sh = 0, sw = 0;
  for (const o of p.yuz) {
    const d = Math.abs(o.t - t);
    if (d > 0.6) continue;
    const w = 1 - d / 0.6;
    sx += o.x * w; sy += o.y * w; sh += o.h * w; sw += w;
  }
  if (!sw) { const o = p.yuz[0]; return o ? { x: o.x, y: o.y, h: o.h } : { x: 540, y: 640, h: 250 }; }
  return { x: sx / sw, y: sy / sw, h: sh / sw };
};
const kameraZ = (km: Kamera[], t: number) => {
  const i = Math.max(0, km.findIndex((k) => t >= k.s && t < k.e));
  const k = km[i] ?? km[km.length - 1];
  const p = interpolate(t, [k.s, k.e], [0, 1], clamp);
  let z = k.z0 + (k.z1 - k.z0) * p;
  const onceki = km[i - 1];
  const gecen = (t - k.s) * FPS;
  if (onceki && gecen < 6) {
    const e = Easing.out(Easing.cubic)(Math.min(1, gecen / 5));
    z = onceki.z1 + (z - onceki.z1) * e;
  }
  return { z, k, gecen };
};

const Goruntu: React.FC<{ v: ESVeri }> = ({ v }) => {
  const frame = useCurrentFrame();
  const t = frame / FPS;
  const { z, k, gecen } = kameraZ(v.kamera, t);
  return (
    <>
      {v.parcalar.map((p, i) => {
        const from = Math.round(p.tl * FPS);
        const aktif = frame >= from && frame < from + p.kare;
        let stil: React.CSSProperties = {};
        if (aktif) {
          const kt = p.bas + (frame - from) / FPS;
          const f = yuzNokta(p, kt);
          const tx = Math.min(0, Math.max(1080 - 1080 * z, 540 - f.x * z));
          let ty0 = 600 - f.y * z;
          const ust = (f.y - 0.85 * f.h) * z + ty0;
          if (ust < 190) ty0 += 190 - ust;
          const ty = Math.min(0, Math.max(1920 - 1920 * z, ty0));
          // giriş efektleri
          let ek = "", filtre = "";
          if (k.giris === "whip" && gecen < 7) {
            const g = 1 - Easing.out(Easing.cubic)(gecen / 7);
            ek = ` translateX(${g * 220}px) rotate(${g * 2.5}deg)`;
            filtre = `blur(${g * 22}px)`;
          } else if (gecen < 8) {
            const s = Math.sin(gecen * 2.2) * (1 - gecen / 8);
            ek = ` rotate(${s * 0.7}deg)`;
          }
          stil = { transform: `translate(${tx}px, ${ty}px) scale(${z})${ek}`, transformOrigin: "0 0", filter: filtre };
        }
        return (
          <Sequence key={i} from={from} durationInFrames={p.kare}>
            <AbsoluteFill style={{ overflow: "hidden", background: "#000" }}>
              <OffthreadVideo src={sf(p.src)} startFrom={Math.round(p.bas * FPS)} muted style={{ width: 1080, height: 1920, ...stil }} />
            </AbsoluteFill>
            <Audio src={sf(p.ses)} startFrom={Math.round(p.bas * FPS)} />
          </Sequence>
        );
      })}
      {/* whip flaşı */}
      {k.giris === "whip" && gecen < 4 ? <AbsoluteFill style={{ background: "white", opacity: interpolate(gecen, [0, 4], [0.55, 0], clamp) }} /> : null}
    </>
  );
};

// ---------------- Altyazı (Anton, büyük harf, aktif kelime sarı) ----------------
type Sayfa = { k: ESVeri["altyazi"]; s: number; e: number };
const temiz = (s: string) => s.replace(/[.,!…]+$/g, "");
const sayfala = (a: ESVeri["altyazi"]): Sayfa[] => {
  const out: Sayfa[] = [];
  let c: Sayfa | null = null;
  for (const w of a) {
    const son = c?.k[c.k.length - 1];
    const uz = c ? c.k.map((x) => temiz(x.w)).join(" ").length + temiz(w.w).length : 0;
    if (!c || c.k.length >= 3 || uz > 15 || (son && /[.?!,]$/.test(son.w)) || (son && w.s - son.e > 0.35)) {
      c = { k: [], s: w.s, e: w.e };
      out.push(c);
    }
    c.k.push(w);
    c.e = w.e;
  }
  for (let i = 0; i < out.length - 1; i++) if (out[i + 1].s - out[i].e < 0.35) out[i].e = out[i + 1].s;
  return out;
};
const Altyazi: React.FC<{ v: ESVeri; y: number }> = ({ v, y }) => {
  const frame = useCurrentFrame();
  const t = frame / FPS;
  const sayfalar = React.useMemo(() => sayfala(v.altyazi), [v]);
  const vurgu = React.useMemo(() => new Set(v.vurgu.map((x) => temiz(x).toLocaleLowerCase("tr-TR"))), [v]);
  if (v.gizle.some(([a, b]) => t >= a && t < b)) return null;
  const p = sayfalar.find((x) => t >= x.s && t < x.e + 0.08);
  if (!p) return null;
  const g = spring({ frame: frame - Math.round(p.s * FPS), fps: FPS, config: { damping: 11, stiffness: 260 } });
  return (
    <div style={{ position: "absolute", left: 40, right: 40, top: y, display: "flex", justifyContent: "center", flexWrap: "wrap", gap: 0, transform: `scale(${interpolate(g, [0, 1], [0.7, 1])}) rotate(${interpolate(g, [0, 1], [-3, 0])}deg)` }}>
      {p.k.map((w, i) => {
        const aktif = t >= w.s - 0.03;
        const simdi = t >= w.s - 0.03 && t < w.e + 0.05;
        const vur = vurgu.has(temiz(w.w).toLocaleLowerCase("tr-TR"));
        const pop = spring({ frame: frame - Math.round(w.s * FPS), fps: FPS, config: { damping: 9, stiffness: 300 } });
        return (
          <span key={i} style={{ fontFamily: ANTON, fontSize: vur ? 104 : 92, lineHeight: 1.08, letterSpacing: 1, color: vur && aktif ? SARI : "white", opacity: aktif ? 1 : 0.0, ...kontur(14), textShadow: golge, transform: `scale(${simdi ? interpolate(pop, [0, 1], [1.18, 1.0]) : 1})`, transformOrigin: "center 80%", display: "inline-block", margin: "0 16px" }}>
            {temiz(w.w).toLocaleUpperCase("tr-TR")}
          </span>
        );
      })}
    </div>
  );
};

// ---------------- Ortak parçalar ----------------
const useG = (gec = 0, d = 12, st = 200) => {
  const f = useCurrentFrame();
  return spring({ frame: f - gec, fps: FPS, config: { damping: d, stiffness: st } });
};
const cikis = (f: number, sure: number, n = 6) => interpolate(f, [sure - n, sure], [1, 0], clamp);
const Firca: React.FC<{ renk: string; style?: React.CSSProperties; children?: React.ReactNode }> = ({ renk, style, children }) => (
  // fırça darbesi: düzensiz kenarlı şerit (SVG) + üzerinde içerik
  <div style={{ position: "relative", display: "inline-block", padding: "6px 34px", ...style }}>
    <svg viewBox="0 0 400 100" preserveAspectRatio="none" style={{ position: "absolute", inset: 0, width: "100%", height: "100%" }}>
      <path d="M6,18 C40,8 90,14 140,9 C200,4 260,12 320,7 C350,5 380,10 396,16 L392,40 C398,55 390,70 396,86 C350,94 300,88 240,93 C180,97 120,90 60,95 C35,97 15,92 4,88 C9,70 2,55 8,42 Z" fill={renk} />
      <path d="M2,30 L-6,26 M398,60 L408,58 M30,95 L20,100" stroke={renk} strokeWidth="6" />
    </svg>
    <div style={{ position: "relative" }}>{children}</div>
  </div>
);
const Avatar: React.FC<{ ad: string; i: number; boy?: number }> = ({ ad, i, boy = 70 }) => {
  const r = ["#F58529,#DD2A7B", "#4F5BD5,#962FBF", "#FEDA77,#F58529", "#2ED4C6,#4F5BD5", "#FF4D4D,#B91C1C"][i % 5];
  return <div style={{ width: boy, height: boy, borderRadius: boy, flexShrink: 0, background: `linear-gradient(135deg, ${r})`, display: "flex", alignItems: "center", justifyContent: "center", color: "white", fontFamily: INTER, fontWeight: 800, fontSize: boy * 0.42 }}>{ad[0].toUpperCase()}</div>;
};

// ---------------- Olaylar ----------------
const Kanca: React.FC<{ o: Olay; sure: number }> = ({ o, sure }) => {
  const f = useCurrentFrame();
  const g1 = useG(0, 9, 260), g2 = useG(8, 9, 260);
  const out = cikis(f, sure, 5);
  const titre = f < 10 ? Math.sin(f * 3) * (10 - f) * 0.6 : 0;
  return (
    <AbsoluteFill style={{ opacity: out, transform: `scale(${1 + (1 - out) * 0.15}) translateX(${titre}px)` }}>
      <div style={{ position: "absolute", top: 170, left: 0, right: 0, display: "flex", flexDirection: "column", alignItems: "center" }}>
        <div style={{ fontFamily: ANTON, fontSize: 200, lineHeight: 1, color: "white", ...kontur(14), textShadow: golge, transform: `scale(${interpolate(g1, [0, 1], [2.4, 1])}) rotate(-4deg)`, opacity: Math.min(1, g1 * 3) }}>{o.satir1}</div>
        <div style={{ marginTop: 10, transform: `scale(${interpolate(g2, [0, 1], [2.2, 1])}) rotate(-4deg)`, opacity: Math.min(1, g2 * 3) }}>
          <Firca renk={KIRMIZI}>
            <div style={{ fontFamily: ANTON, fontSize: 80, color: SARI, ...kontur(8), letterSpacing: 1 }}>{o.satir2}</div>
          </Firca>
        </div>
      </div>
    </AbsoluteFill>
  );
};

const BosPost: React.FC<{ o: Olay; sure: number }> = ({ o, sure }) => {
  const f = useCurrentFrame();
  const g = useG(0, 13, 190);
  const carpiK = Math.round((o.carpi - o.s) * FPS);
  const cg = spring({ frame: f - carpiK, fps: FPS, config: { damping: 10, stiffness: 240 } });
  const out = cikis(f, sure, 5);
  const bocek = interpolate(f, [4, sure], [-120, 1100], clamp);
  return (
    <AbsoluteFill style={{ opacity: out }}>
      <div style={{ position: "absolute", left: 90, width: 900, top: 880, background: "white", borderRadius: 34, padding: "30px 36px", boxShadow: "0 24px 60px rgba(0,0,0,0.5)", transform: `translateY(${interpolate(g, [0, 1], [260, 0])}px) rotate(${interpolate(g, [0, 1], [6, -1.5])}deg)` }}>
        <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
          <Avatar ad="s" i={1} />
          <div style={{ fontFamily: INTER, fontWeight: 800, fontSize: 34, color: "#111" }}>senin.hesabin</div>
        </div>
        <div style={{ fontFamily: `${INTER}, ${EMOJI}`, fontWeight: 800, fontSize: 54, color: "#111", marginTop: 18 }}>Sizce ne düşünüyorsunuz? 🤔</div>
        <div style={{ display: "flex", gap: 40, marginTop: 20, fontFamily: `${INTER}, ${EMOJI}`, fontWeight: 600, fontSize: 36, color: "#777" }}>
          <span>♡ 2</span><span style={{ color: KIRMIZI, fontWeight: 800 }}>💬 0 yorum</span>
        </div>
        <div style={{ position: "absolute", left: bocek, top: -70, fontSize: 70, fontFamily: EMOJI, transform: `translateY(${-Math.abs(Math.sin(f / 3)) * 40}px)` }}>🦗</div>
      </div>
      {f >= carpiK ? (
        <div style={{ position: "absolute", left: 0, right: 0, top: 960, display: "flex", justifyContent: "center", transform: `scale(${interpolate(cg, [0, 1], [2.6, 1])}) rotate(-9deg)`, opacity: Math.min(1, cg * 2) }}>
          <div style={{ fontFamily: ANTON, fontSize: 110, color: "white", background: KIRMIZI, padding: "4px 34px", borderRadius: 12, border: "8px solid white", boxShadow: "0 14px 40px rgba(0,0,0,0.5)" }}>✕ BÖYLE SORMA</div>
        </div>
      ) : null}
    </AbsoluteFill>
  );
};

const Secenek: React.FC<{ o: Olay; sure: number }> = ({ o, sure }) => {
  const f = useCurrentFrame();
  const g0 = useG(0, 12, 220), ga = useG(6, 8, 260), gb = useG(12, 8, 260);
  const out = cikis(f, sure, 5);
  const nabiz = 1 + Math.max(0, Math.sin((f - 20) / 4)) * 0.04;
  const tus = (h: string, g: number, renk: string, yazi: string, d: number) => (
    <div style={{ width: 300, height: 300, borderRadius: 50, background: renk, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: ANTON, fontSize: 210, color: yazi, border: "8px solid #000", boxShadow: "0 16px 0 #000, 0 30px 50px rgba(0,0,0,0.5)", transform: `scale(${interpolate(g, [0, 1], [0.1, 1]) * nabiz}) rotate(${d * (1 - g) * 40 + d * 4}deg)`, opacity: Math.min(1, g * 2) }}>{h}</div>
  );
  return (
    <AbsoluteFill style={{ opacity: out }}>
      <div style={{ position: "absolute", top: 860, left: 0, right: 0, display: "flex", justifyContent: "center", transform: `scale(${interpolate(g0, [0, 1], [0.4, 1])})`, opacity: g0 }}>
        <Firca renk="#000"><div style={{ fontFamily: ANTON, fontSize: 84, color: SARI, letterSpacing: 2 }}>2 NET SEÇENEK</div></Firca>
      </div>
      <div style={{ position: "absolute", top: 1010, left: 0, right: 0, display: "flex", justifyContent: "center", gap: 70 }}>
        {tus("A", ga, SARI, "#000", -1)}
        {tus("B", gb, "white", "#000", 1)}
      </div>
    </AbsoluteFill>
  );
};

const YariVideo: React.FC<{ src: string; ust: boolean; g: number; etiket: string; eg: number; renk: string; bas?: number }> = ({ src, ust, g, etiket, eg, renk, bas = 0 }) => {
  const f = useCurrentFrame();
  return (
    <div style={{ position: "absolute", left: 0, width: 1080, height: 960, top: ust ? 0 : 960, overflow: "hidden", transform: `translateY(${(1 - g) * (ust ? -960 : 960)}px)`, borderBottom: ust ? `10px solid ${SARI}` : undefined, borderTop: ust ? undefined : `10px solid ${SARI}` }}>
      <OffthreadVideo src={src} startFrom={Math.round(bas * FPS)} muted style={{ position: "absolute", height: 960, width: 1707, left: -313, top: 0, transform: `scale(${1.05 + f * 0.002})` }} />
      <AbsoluteFill style={{ background: ust ? "linear-gradient(180deg, rgba(0,0,0,0) 55%, rgba(0,0,0,0.55) 100%)" : "linear-gradient(0deg, rgba(0,0,0,0) 55%, rgba(0,0,0,0.55) 100%)" }} />
      <div style={{ position: "absolute", left: 50, [ust ? "bottom" : "top"]: 50, transform: `scale(${interpolate(eg, [0, 1], [2, 1])}) rotate(-5deg)`, opacity: Math.min(1, eg * 2), transformOrigin: "left center" } as React.CSSProperties}>
        <Firca renk={renk}><div style={{ fontFamily: `${ANTON}, ${EMOJI}`, fontSize: 150, color: renk === SARI ? "#000" : "white", lineHeight: 1.05 }}>{etiket}</div></Firca>
      </div>
    </div>
  );
};
const TutAt: React.FC<{ o: Olay; sure: number }> = ({ o, sure }) => {
  const f = useCurrentFrame();
  const tutK = Math.round((o.tut - o.s) * FPS), atK = Math.round((o.at - o.s) * FPS);
  const g1 = useG(0, 15, 200), g2 = useG(atK - 4, 15, 200);
  const e1 = useG(tutK, 9, 260), e2 = useG(atK, 9, 260);
  const vs = useG(atK + 5, 8, 260);
  const out = cikis(f, sure, 4);
  return (
    <AbsoluteFill style={{ opacity: out }}>
      <YariVideo src={sf(o.dosya_tut)} ust g={g1} etiket="TUT 🧤" eg={e1} renk={SARI} bas={0.5} />
      {f < atK ? (
        <div style={{ position: "absolute", left: 0, top: 960, width: 1080, height: 960, background: "radial-gradient(ellipse at 50% 40%, #2a2a2a, #050505)", transform: `translateY(${(1 - g1) * 960}px)`, display: "flex", alignItems: "flex-start", justifyContent: "center", paddingTop: 120 }}>
          <div style={{ fontFamily: `${ANTON}, ${EMOJI}`, fontSize: 200, color: "rgba(255,255,255,0.18)", ...kontur(4, "rgba(255,255,255,0.35)") }}>?</div>
        </div>
      ) : null}
      {f >= atK - 5 ? <YariVideo src={sf(o.dosya_at)} ust={false} g={g2} etiket="AT ⚽" eg={e2} renk={KIRMIZI} bas={1.2} /> : null}
      {f >= atK + 5 ? (
        <div style={{ position: "absolute", left: 440, top: 860, width: 200, height: 200, borderRadius: 100, background: "#000", border: `8px solid ${SARI}`, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: ANTON, fontSize: 96, color: SARI, transform: `scale(${vs}) rotate(${(1 - vs) * 90}deg)` }}>VS</div>
      ) : null}
    </AbsoluteFill>
  );
};

const Anket: React.FC<{ o: Olay; sure: number }> = ({ o, sure }) => {
  const f = useCurrentFrame();
  const g = useG(0, 11, 230);
  const out = cikis(f, sure, 4);
  const p = interpolate(f, [4, Math.max(8, sure - 2)], [0, 1], { ...clamp, easing: Easing.out(Easing.cubic) });
  const bar = (ad: string, yuzde: number, kaz: boolean) => (
    <div style={{ position: "relative", height: 96, borderRadius: 22, background: "#EFEFEF", overflow: "hidden", marginTop: 16 }}>
      <div style={{ position: "absolute", left: 0, top: 0, bottom: 0, width: `${yuzde * p}%`, background: kaz ? "linear-gradient(90deg,#F58529,#DD2A7B,#962FBF)" : "#CFCFCF" }} />
      <div style={{ position: "absolute", left: 28, top: 0, bottom: 0, display: "flex", alignItems: "center", fontFamily: `${INTER}, ${EMOJI}`, fontWeight: 800, fontSize: 44, color: kaz ? "white" : "#222" }}>{ad}</div>
      <div style={{ position: "absolute", right: 28, top: 0, bottom: 0, display: "flex", alignItems: "center", fontFamily: INTER, fontWeight: 800, fontSize: 44, color: "#222" }}>{Math.round(yuzde * p)}%</div>
    </div>
  );
  return (
    <AbsoluteFill style={{ opacity: out }}>
      <div style={{ position: "absolute", left: 150, width: 780, top: 900, background: "white", borderRadius: 36, padding: "30px 34px", boxShadow: "0 24px 60px rgba(0,0,0,0.5)", transform: `scale(${interpolate(g, [0, 1], [0.3, 1])}) rotate(${interpolate(g, [0, 1], [-14, -3])}deg)` }}>
        <div style={{ fontFamily: `${INTER}, ${EMOJI}`, fontWeight: 800, fontSize: 46, color: "#111", textAlign: "center" }}>Bir dahaki video? 🤔</div>
        {bar("TUT 🧤", 38, false)}
        {bar("AT ⚽", 62, true)}
      </div>
    </AbsoluteFill>
  );
};

const KameraKapandi: React.FC<{ o: Olay; sure: number }> = ({ sure }) => {
  const f = useCurrentFrame();
  const g = useG(3, 8, 260);
  const out = cikis(f, sure, 5);
  const glitch = f < 9 || (f > 26 && f < 31);
  const kay = glitch ? Math.sin(f * 7.3) * 40 : 0;
  return (
    <AbsoluteFill style={{ opacity: out }}>
      {glitch ? (
        <>
          {[0, 1, 2, 3, 4].map((i) => (
            <div key={i} style={{ position: "absolute", left: 0, right: 0, top: ((i * 389 + f * 211) % 1800), height: 30 + (i * 37) % 90, background: i % 2 ? "rgba(255,0,80,0.35)" : "rgba(0,255,230,0.3)", transform: `translateX(${kay * (i % 2 ? 1 : -1)}px)` }} />
          ))}
          <AbsoluteFill style={{ background: "rgba(255,255,255,0.08)" }} />
        </>
      ) : null}
      <div style={{ position: "absolute", left: 0, right: 0, top: 300, display: "flex", justifyContent: "center", transform: `scale(${interpolate(g, [0, 1], [3, 1])}) rotate(-7deg) translateX(${kay * 0.4}px)`, opacity: Math.min(1, g * 2) }}>
        <Firca renk={SARI}><div style={{ fontFamily: `${ANTON}, ${EMOJI}`, fontSize: 120, color: "#000" }}>📵 KAMERA GİTTİ</div></Firca>
      </div>
    </AbsoluteFill>
  );
};

const YorumYagmuru: React.FC<{ o: Olay; sure: number }> = ({ o, sure }) => {
  const f = useCurrentFrame();
  const out = cikis(f, sure, 5);
  const ara = Math.floor((sure - 8) / o.yorumlar.length);
  const hg = useG(0, 12, 220);
  const sayi = Math.round(interpolate(f, [0, sure - 4], [3, 127], clamp));
  return (
    <AbsoluteFill style={{ opacity: out }}>
      <div style={{ position: "absolute", left: 0, right: 0, top: 230, display: "flex", justifyContent: "center", transform: `scale(${interpolate(hg, [0, 1], [0.4, 1])}) rotate(-3deg)`, opacity: hg }}>
        <Firca renk="#000"><div style={{ fontFamily: `${ANTON}, ${EMOJI}`, fontSize: 92, color: "white" }}>💬 <span style={{ color: SARI }}>{sayi}</span> YORUM</div></Firca>
      </div>
      {o.yorumlar.map((y: string[], i: number) => {
        const k = i * ara;
        if (f < k) return null;
        const g = spring({ frame: f - k, fps: FPS, config: { damping: 12, stiffness: 230 } });
        const kac = o.yorumlar.filter((_: any, j: number) => j > i && f >= j * ara).length;
        const yuk = 1110 - kac * 128;
        return (
          <div key={i} style={{ position: "absolute", left: i % 2 ? 150 : 70, width: 860, top: yuk, background: "white", borderRadius: 28, padding: "16px 22px", display: "flex", alignItems: "center", gap: 18, boxShadow: "0 14px 34px rgba(0,0,0,0.45)", transform: `translateX(${interpolate(g, [0, 1], [900, 0])}px) rotate(${i % 2 ? 1.5 : -1.5}deg)`, opacity: kac >= 3 ? 0 : 1 - kac * 0.12 }}>
            <Avatar ad={y[0]} i={i} boy={66} />
            <div>
              <div style={{ fontFamily: INTER, fontWeight: 800, fontSize: 26, color: "#111" }}>{y[0]} <span style={{ fontWeight: 600, color: "#999", fontSize: 22 }}>· şimdi</span></div>
              <div style={{ fontFamily: `${INTER}, ${EMOJI}`, fontWeight: 800, fontSize: 40, color: "#111" }}>{y[1]}</div>
            </div>
          </div>
        );
      })}
    </AbsoluteFill>
  );
};

const EmojiPop: React.FC<{ o: Olay; sure: number }> = ({ o, sure }) => {
  const f = useCurrentFrame();
  const g = useG(0, 7, 260);
  return <div style={{ position: "absolute", left: 700, top: 400, fontSize: 200, fontFamily: EMOJI, transform: `scale(${g}) rotate(${Math.sin(f / 3) * 10}deg)`, opacity: cikis(f, sure, 4) }}>{o.emoji}</div>;
};

const Karsilastir: React.FC<{ o: Olay; sure: number }> = ({ o, sure }) => {
  const f = useCurrentFrame();
  const sagK = Math.round((o.sag_t - o.s) * FPS);
  const gl = useG(0, 12, 220), gr = useG(sagK, 12, 220);
  const xl = useG(Math.min(24, sagK - 6), 8, 260), xr = useG(sagK + 10, 8, 260);
  const out = cikis(f, sure, 5);
  const kart = (g: number, d: number, bas: string, renk: string, sayi: string, isaret: string, ig: number, soluk: boolean) => (
    <div style={{ width: 430, background: "#111", border: `6px solid ${renk}`, borderRadius: 34, padding: "26px 0", display: "flex", flexDirection: "column", alignItems: "center", boxShadow: "0 20px 50px rgba(0,0,0,0.55)", transform: `translateY(${interpolate(g, [0, 1], [600, 0])}px) rotate(${d * 3}deg) scale(${soluk ? 0.92 : 1})`, opacity: soluk ? 0.6 : 1, position: "relative" }}>
      <div style={{ fontFamily: `${ANTON}, ${EMOJI}`, fontSize: 96, color: renk, lineHeight: 1.1 }}>{bas}</div>
      <div style={{ fontFamily: `${ANTON}, ${EMOJI}`, fontSize: 80, color: "white", marginTop: 6 }}>{sayi}</div>
      <div style={{ position: "absolute", top: -50, right: -30, width: 120, height: 120, borderRadius: 60, background: renk, color: "white", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: INTER, fontWeight: 800, fontSize: 66, border: "6px solid white", transform: `scale(${ig})` }}>{isaret}</div>
    </div>
  );
  return (
    <AbsoluteFill style={{ opacity: out }}>
      <div style={{ position: "absolute", top: 900, left: 0, right: 0, display: "flex", justifyContent: "center", gap: 60 }}>
        {kart(gl, -1, "❓ SORU", KIRMIZI, "💬 0", "✕", xl, f > sagK + 6)}
        {f >= sagK ? kart(gr, 1, "A / B", YESIL, "💬 99+", "✓", xr, false) : <div style={{ width: 430 }} />}
      </div>
    </AbsoluteFill>
  );
};

const BRollYorum: React.FC<{ o: Olay; sure: number }> = ({ o, sure }) => {
  const f = useCurrentFrame();
  const g = useG(0, 16, 170);
  const op = Math.min(interpolate(f, [0, 3], [0, 1], clamp), cikis(f, sure, 2));
  const etiketOp = cikis(f, sure - 2, 2);
  const sayi = Math.round(interpolate(f, [3, sure - 3], [12, 248], clamp));
  const W = 1000, H = 563, TOP = 380;
  return (
    <AbsoluteFill style={{ opacity: op }}>
      <AbsoluteFill style={{ background: "#07070a" }} />
      <OffthreadVideo src={sf(o.dosya)} startFrom={Math.round(o.bas * FPS)} muted style={{ position: "absolute", width: 3413, height: 1920, left: -1166, top: 0, filter: "blur(34px) brightness(0.4) saturate(1.3)" }} />
      <div style={{ position: "absolute", left: 40, top: TOP, width: W, height: H, borderRadius: 34, overflow: "hidden", border: `6px solid ${SARI}`, boxShadow: "0 30px 80px rgba(0,0,0,0.6)", transform: `translateY(${interpolate(g, [0, 1], [80, 0])}px) scale(${interpolate(g, [0, 1], [0.85, 1])}) rotate(-1.5deg)` }}>
        <OffthreadVideo src={sf(o.dosya)} startFrom={Math.round(o.bas * FPS)} muted style={{ width: W, height: H, objectFit: "cover", transform: `scale(${1.05 + f * 0.004})` }} />
      </div>
      <div style={{ position: "absolute", left: 0, right: 0, top: TOP + H + 50, display: "flex", justifyContent: "center", opacity: etiketOp, transform: `rotate(-3deg) scale(${interpolate(g, [0, 1], [0.5, 1])})` }}>
        <Firca renk={SARI}><div style={{ fontFamily: `${ANTON}, ${EMOJI}`, fontSize: 120, color: "#000" }}>💬 {sayi} YORUM</div></Firca>
      </div>
    </AbsoluteFill>
  );
};

const TakipEt: React.FC<{ o: Olay; sure: number }> = ({ o, sure }) => {
  const f = useCurrentFrame();
  const g = useG(0, 12, 200);
  const tikK = Math.round((o.tik - o.s) * FPS);
  const basildi = f >= tikK;
  const el = interpolate(f, [tikK - 12, tikK], [1, 0], { ...clamp, easing: Easing.out(Easing.cubic) });
  const bg = spring({ frame: f - tikK, fps: FPS, config: { damping: 8, stiffness: 300 } });
  return (
    <AbsoluteFill>
      {/* kıvılcımlar */}
      {basildi ? [...Array(14)].map((_, i) => {
        const a = (i / 14) * Math.PI * 2, r = (f - tikK) * 16;
        return <div key={i} style={{ position: "absolute", left: 760 + Math.cos(a) * r, top: 1110 + Math.sin(a) * r, fontSize: 44, fontFamily: EMOJI, opacity: interpolate(f - tikK, [0, 18], [1, 0], clamp) }}>✨</div>;
      }) : null}
      <div style={{ position: "absolute", left: 60, width: 960, top: 930, background: "white", borderRadius: 40, padding: "30px 34px", display: "flex", alignItems: "center", gap: 24, boxShadow: "0 24px 60px rgba(0,0,0,0.5)", transform: `translateY(${interpolate(g, [0, 1], [500, 0])}px) rotate(${interpolate(g, [0, 1], [5, -1.5])}deg)` }}>
        <div style={{ width: 150, height: 150, borderRadius: 75, flexShrink: 0, padding: 6, background: "linear-gradient(135deg,#FEDA77,#F58529,#DD2A7B,#962FBF)" }}>
          <div style={{ width: "100%", height: "100%", borderRadius: 75, border: "5px solid white", overflow: "hidden", background: "#000" }}>
            <Img src={sf("profil.png")} style={{ width: "100%", height: "100%", objectFit: "cover", transform: "scale(1.08)" }} />
          </div>
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontFamily: INTER, fontWeight: 800, fontSize: 38, color: "#111" }}>etkilesimsihirbazi</div>
          <div style={{ fontFamily: INTER, fontWeight: 600, fontSize: 26, color: "#666", marginTop: 4 }}>Berkay Işık · Onur Altunay</div>
        </div>
        <div style={{ fontFamily: INTER, fontWeight: 800, fontSize: 34, color: basildi ? "#111" : "white", background: basildi ? "#EFEFEF" : "#0095F6", borderRadius: 18, padding: "18px 26px", transform: `scale(${basildi ? interpolate(bg, [0, 1], [0.85, 1]) : 1})`, whiteSpace: "nowrap" }}>{basildi ? "Takiptesin ✓" : "Takip Et"}</div>
      </div>
      <div style={{ position: "absolute", left: 790, top: 1080, fontSize: 110, fontFamily: EMOJI, transform: `translate(${el * 140}px, ${el * 220}px)`, opacity: f < tikK + 14 ? 1 : 0 }}>👆</div>
    </AbsoluteFill>
  );
};

// Kartların tasarım üst sınırı; plan.py yüz kutusunun dışındaki banda o.y / o.olcek ile taşır (yüzün önüne gelmez)
const TASARIM_UST: Record<string, number> = { kanca: 170, bospost: 880, secenek: 860, karsilastir: 850, takipet: 930 };
const OlayCiz: React.FC<{ o: Olay }> = ({ o }) => {
  const ic = <OlayIc o={o} />;
  const ust = TASARIM_UST[o.tip];
  if (ust === undefined || o.y === undefined) return ic;
  return (
    <AbsoluteFill style={{ transform: `translateY(${o.y - ust}px)` }}>
      <AbsoluteFill style={{ transformOrigin: `540px ${ust}px`, transform: `scale(${o.olcek ?? 1})` }}>{ic}</AbsoluteFill>
    </AbsoluteFill>
  );
};
const OlayIc: React.FC<{ o: Olay }> = ({ o }) => {
  const sure = Math.max(1, Math.round((o.son - o.s) * FPS));
  const p = { o, sure };
  switch (o.tip) {
    case "kanca": return <Kanca {...p} />;
    case "bospost": return <BosPost {...p} />;
    case "secenek": return <Secenek {...p} />;
    case "tutat": return <TutAt {...p} />;
    case "anket": return <Anket {...p} />;
    case "kamerakapandi": return <KameraKapandi {...p} />;
    case "yorumyagmuru": return <YorumYagmuru {...p} />;
    case "emoji": return <EmojiPop {...p} />;
    case "karsilastir": return <Karsilastir {...p} />;
    case "broll_yorum": return <BRollYorum {...p} />;
    case "takipet": return <TakipEt {...p} />;
    default: return null;
  }
};

// ---------------- Ses efektleri ----------------
const sesListesi = (v: ESVeri) => {
  const e: { t: number; ad: string; v: number }[] = [];
  for (const k of v.kamera) {
    if (k.giris === "whip" && k.s > 0) e.push({ t: k.s - 0.08, ad: "whip", v: 0.5 });
    else if (k.s > 0) e.push({ t: k.s, ad: "whoosh_giris", v: 0.12 });
  }
  for (const o of v.olaylar) {
    const ek = (t: number, ad: string, vol: number) => e.push({ t, ad, v: vol });
    switch (o.tip) {
      case "kanca": ek(0, "boom", 0.55); ek(0.27, "damga", 0.6); break;
      case "bospost": ek(o.s, "pop", 0.4); ek(o.s + 0.15, "circir", 0.35); ek(o.carpi, "damga", 0.7); break;
      case "secenek": ek(o.s, "baslik", 0.4); ek(o.s + 0.2, "pop", 0.5); ek(o.s + 0.4, "pop", 0.5); break;
      case "tutat": ek(o.s, "broll", 0.45); ek(o.tut, "secim", 0.5); ek(o.at - 0.1, "whip", 0.45); ek(o.at, "top", 0.6); ek(o.at + 0.17, "boom", 0.35); break;
      case "anket": ek(o.s, "arayuz", 0.45); break;
      case "kamerakapandi": ek(o.s, "glitch", 0.55); ek(o.s + 0.1, "damga", 0.5); break;
      case "yorumyagmuru": {
        const sure = Math.round((o.son - o.s) * FPS); const ara = Math.floor((sure - 8) / o.yorumlar.length);
        o.yorumlar.forEach((_: any, i: number) => ek(o.s + (i * ara) / FPS, "bildirim", 0.35));
        break;
      }
      case "emoji": ek(o.s, "pop", 0.35); break;
      case "karsilastir": ek(o.s, "whoosh_giris", 0.35); ek(o.s + 0.8, "uyari", 0.4); ek(o.sag_t, "whoosh_giris", 0.35); ek(o.sag_t + 0.33, "basari", 0.45); break;
      case "broll_yorum": ek(o.s, "broll", 0.45); ek(o.s + 0.3, "para", 0.3); break;
      case "takipet": ek(o.s, "pop", 0.4); ek(o.tik, "tik", 0.7); ek(o.tik + 0.03, "sihir", 0.5); break;
    }
  }
  return e;
};

// ---------------- Kalıcı katmanlar ----------------
const Ilerleme: React.FC<{ toplam: number }> = ({ toplam }) => {
  const f = useCurrentFrame();
  return <div style={{ position: "absolute", left: 0, top: 0, height: 12, width: `${(f / toplam) * 100}%`, background: SARI, boxShadow: "0 0 18px rgba(255,230,0,0.7)" }} />;
};
const Rozet: React.FC = () => (
  <div style={{ position: "absolute", left: 0, right: 0, top: 96, display: "flex", justifyContent: "center" }}>
    <div style={{ display: "flex", alignItems: "center", gap: 10, background: "rgba(0,0,0,0.6)", border: "2px solid rgba(255,230,0,0.6)", borderRadius: 40, padding: "8px 22px" }}>
      <span style={{ fontSize: 30, fontFamily: EMOJI }}>🪄</span>
      <span style={{ fontFamily: INTER, fontWeight: 800, fontSize: 28, color: "white", letterSpacing: 0.5 }}>etkilesimsihirbazi</span>
    </div>
  </div>
);

export const ES: React.FC<{ v: ESVeri }> = ({ v }) => {
  const sesler = React.useMemo(() => sesListesi(v), [v]);
  const ustte = (o: Olay) => ["tutat", "broll_yorum"].includes(o.tip);
  return (
    <AbsoluteFill style={{ background: "black" }}>
      <Goruntu v={v} />
      <AbsoluteFill style={{ background: "linear-gradient(180deg, rgba(0,0,0,0.35) 0%, rgba(0,0,0,0) 16%, rgba(0,0,0,0) 45%, rgba(0,0,0,0.5) 100%)" }} />
      {[...v.olaylar.filter(ustte), ...v.olaylar.filter((o) => !ustte(o))].map((o, i) => (
        <Sequence key={i} from={Math.round(o.s * FPS)} durationInFrames={Math.max(1, Math.round((o.son - o.s) * FPS))}>
          <OlayCiz o={o} />
        </Sequence>
      ))}
      <Altyazi v={v} y={1345} />
      <Ilerleme toplam={v.toplamKare} />
      {sesler.map((x, i) => (
        <Sequence key={`s${i}`} from={Math.max(0, Math.round(x.t * FPS))} durationInFrames={60}>
          <Audio src={sf(`sfx/${x.ad}.wav`)} volume={x.v} />
        </Sequence>
      ))}
      <Audio src={sf("muzik.wav")} volume={0.09} />
    </AbsoluteFill>
  );
};
