import React from "react";
import { AbsoluteFill, Audio, interpolate, spring, staticFile, useCurrentFrame, useVideoConfig, Easing } from "remotion";
import { BerkayTam, Ifade, KOL_POZ, KolAci, Poz, Vizem } from "./berkay";
import plan from "./plan.json";
import vizemler from "./vizem.json";

const POP = "'PoppinsF', 'Poppins', sans-serif";
const TURUNCU = "#FF8A1F", YESIL = "#2ED47A", KIRMIZI = "#FF5A5A", MAVI = "#5AB4FF", KREM = "#FFF6E8";
type VO = { k: string; metin: string; bas: number; son: number };
const VOS = plan.vo as VO[];
const vo = (k: string) => VOS.find((v) => v.k === k)!;

const Font: React.FC = () => (
  <style>{`
    @font-face { font-family: 'PoppinsF'; font-weight: 600; src: url(${staticFile("fonts/Poppins-SemiBold.ttf")}); }
    @font-face { font-family: 'PoppinsF'; font-weight: 700; src: url(${staticFile("fonts/Poppins-Bold.ttf")}); }
    @font-face { font-family: 'PoppinsF'; font-weight: 800; src: url(${staticFile("fonts/Poppins-ExtraBold.ttf")}); }
    @font-face { font-family: 'PoppinsF'; font-weight: 900; src: url(${staticFile("fonts/Poppins-Black.ttf")}); }
  `}</style>
);

// ---------- yardımcılar ----------
const useT = () => { const f = useCurrentFrame(); const { fps } = useVideoConfig(); return { f, fps, t: f / fps }; };
const giris = (t: number, bas: number, fps: number, damping = 13) => spring({ frame: Math.max(0, (t - bas) * fps), fps, config: { damping, mass: 0.7 } });
const cikis = (t: number, son: number, d = 0.25) => interpolate(t, [son - d, son], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
// sahne aralığı: bir satırın başından bir sonraki sahnenin başına
const aralik = (k: string, sonK?: string) => [vo(k).bas - 0.15, sonK ? vo(sonK).bas - 0.15 : plan.bitis] as const;

// ---------- fiyat etiketi ----------
const Etiket: React.FC<{ fiyat: string; renk?: string; yazi?: string; olcek?: number; aci?: number; vurgu?: number; soluk?: number }> = ({ fiyat, renk = KREM, yazi = "#1b1f2e", olcek = 1, aci = 0, vurgu = -1, soluk = 0 }) => (
  <div style={{ transform: `scale(${olcek}) rotate(${aci}deg)`, transformOrigin: "50% 0%", display: "flex", flexDirection: "column", alignItems: "center" }}>
    <div style={{ width: 4, height: 70, background: "#c9b38a" }} />
    <div style={{ position: "relative", background: renk, borderRadius: 28, padding: "38px 54px 30px", boxShadow: "0 24px 60px rgba(0,0,0,0.45)", border: "6px solid rgba(0,0,0,0.08)" }}>
      <div style={{ position: "absolute", top: 12, left: "50%", marginLeft: -11, width: 22, height: 22, borderRadius: 11, background: "#121726" }} />
      <div style={{ fontFamily: POP, fontWeight: 900, fontSize: 150, color: yazi, letterSpacing: -4, lineHeight: 1, whiteSpace: "nowrap" }}>
        {fiyat.split("").map((c, i) => (
          <span key={i} style={{ color: i === vurgu ? TURUNCU : yazi, opacity: vurgu >= 0 && i !== vurgu ? 1 - soluk : 1 }}>{c}</span>
        ))}
        <span style={{ fontSize: 70, marginLeft: 12 }}>TL</span>
      </div>
    </div>
  </div>
);

const Baslik: React.FC<{ s1?: string; s2: string; renk?: string; t: number; bas: number; son: number; fps: number; boy?: number }> = ({ s1, s2, renk = TURUNCU, t, bas, son, fps, boy = 96 }) => {
  const g = giris(t, bas, fps);
  return (
    <div style={{ textAlign: "center", fontFamily: POP, fontWeight: 900, lineHeight: 1.02, opacity: g * cikis(t, son), transform: `translateY(${(1 - g) * -40}px)` }}>
      {s1 ? <div style={{ fontSize: boy * 0.62, color: "white", letterSpacing: 1 }}>{s1}</div> : null}
      <div style={{ fontSize: boy, color: renk, textShadow: "0 8px 30px rgba(0,0,0,0.5)" }}>{s2}</div>
    </div>
  );
};

// ---------- sahneler (üst bölge: y 140–880) ----------
const Ust: React.FC<{ children: React.ReactNode; top?: number }> = ({ children, top = 150 }) => (
  <div style={{ position: "absolute", top, left: 0, width: 1080, display: "flex", flexDirection: "column", alignItems: "center", gap: 26 }}>{children}</div>
);

const Sahneler: React.FC = () => {
  const { t, fps } = useT();
  const ic = (a: readonly [number, number]) => t >= a[0] && t < a[1];
  const s1 = aralik("n1", "n3"), s3 = aralik("n3", "n4"), s4 = aralik("n4", "n5"), s5 = aralik("n5", "n6"), s6 = aralik("n6", "n7"),
    s7 = aralik("n7", "n9"), s9 = aralik("n9", "n10"), s10 = aralik("n10", "n11"), s11 = aralik("n11", "n12"), s12 = aralik("n12");
  return (
    <>
      {ic(s1) && (() => {
        const g = giris(t, s1[0], fps, 9), sal = Math.sin((t - s1[0]) * 3.2) * 6 * Math.exp(-(t - s1[0]) * 0.9);
        const n2 = vo("n2").bas, kurus = giris(t, n2 + 0.1, fps), cizgi = interpolate(t, [n2 + 0.9, n2 + 1.2], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
        const beyin = giris(t, n2 + 1.5, fps);
        return (
          <Ust top={90}>
            <div style={{ transform: `translateY(${(1 - g) * -700}px)` }}><Etiket fiyat="99,99" aci={sal} olcek={1.3} /></div>
            <div style={{ height: 150, marginTop: 110, position: "relative", width: 1080, display: "flex", justifyContent: "center", alignItems: "center", gap: 40 }}>
              <div style={{ opacity: kurus * (1 - beyin * 0.6), transform: `scale(${kurus})`, position: "relative", fontFamily: POP, fontWeight: 800, fontSize: 64, color: "white", background: "#2a3350", borderRadius: 80, padding: "14px 40px" }}>
                1 kuruş için mi?
                <div style={{ position: "absolute", left: 20, right: 20, top: "50%", height: 10, borderRadius: 5, background: KIRMIZI, transform: `scaleX(${cizgi})`, transformOrigin: "0 50%" }} />
              </div>
            </div>
            <div style={{ opacity: beyin, transform: `scale(${0.8 + 0.2 * beyin})`, fontFamily: POP, fontWeight: 900, fontSize: 84, color: TURUNCU, marginTop: -40 }}>BEYNİN İÇİN</div>
          </Ust>
        );
      })()}
      {ic(s3) && (() => {
        const g = giris(t, s3[0], fps), tar = interpolate(t, [s3[0] + 0.5, s3[0] + 1.6], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.inOut(Easing.cubic) });
        return (
          <Ust top={120}>
            <Baslik s1="FİYATI" s2="SOLDAN OKURUZ" t={t} bas={s3[0]} son={s3[1]} fps={fps} boy={90} />
            <div style={{ position: "relative", opacity: g }}>
              <Etiket fiyat="99,99" vurgu={0} soluk={tar * 0.55} olcek={1.15} />
              <div style={{ position: "absolute", left: 40 + tar * 700, top: 420, fontSize: 70, transform: "translateX(-50%)", color: TURUNCU, fontFamily: POP, fontWeight: 900 }}>▲</div>
              <div style={{ position: "absolute", left: 40, top: 395, height: 12, width: tar * 700, background: TURUNCU, borderRadius: 6, opacity: 0.8 }} />
            </div>
          </Ust>
        );
      })()}
      {ic(s4) && (() => {
        const a = giris(t, s4[0], fps), b = giris(t, s4[0] + 1.9, fps);
        const kart = (fiyat: string, et: string, renk: string, g: number) => (
          <div style={{ opacity: g, transform: `translateY(${(1 - g) * 80}px)`, display: "flex", flexDirection: "column", alignItems: "center", gap: 18 }}>
            <Etiket fiyat={fiyat} olcek={0.72} vurgu={fiyat.startsWith("1") ? -1 : 0} />
            <div style={{ fontFamily: POP, fontWeight: 900, fontSize: 64, color: "white", background: renk, borderRadius: 24, padding: "6px 30px", marginTop: -60 }}>{et}</div>
          </div>
        );
        return (
          <Ust top={260}>
            <div style={{ display: "flex", gap: 30, alignItems: "flex-start" }}>
              {kart("99,99", "90'LAR", YESIL, a)}
              {kart("100", "100'LER", KIRMIZI, b)}
            </div>
          </Ust>
        );
      })()}
      {ic(s5) && (() => {
        const g1 = giris(t, s5[0] + 0.1, fps), g2 = interpolate(t, [s5[0] + 1.3, s5[0] + 2.3], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.out(Easing.cubic) });
        const cubuk = (ad: string, w: number, renk: string, g: number, deger: string) => (
          <div style={{ width: 900, opacity: g > 0 ? 1 : 0 }}>
            <div style={{ fontFamily: POP, fontWeight: 700, fontSize: 58, color: "white", marginBottom: 12 }}>{ad}</div>
            <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
              <div style={{ height: 96, width: Math.max(10, w * g), background: renk, borderRadius: 14 }} />
              <div style={{ fontFamily: POP, fontWeight: 900, fontSize: 52, color: renk, opacity: g }}>{deger}</div>
            </div>
          </div>
        );
        return (
          <Ust top={320}>
            {cubuk("Gerçek fark", 14, MAVI, g1, "1 kuruş")}
            {cubuk("Hissettirdiği fark", 640, TURUNCU, g2, "")}
          </Ust>
        );
      })()}
      {ic(s6) && (() => {
        const g = giris(t, s6[0], fps, 8);
        return <Ust top={200}><div style={{ fontFamily: POP, fontWeight: 900, fontSize: 380, color: TURUNCU, transform: `scale(${g}) rotate(${(1 - g) * -30}deg)`, lineHeight: 1 }}>?</div></Ust>;
      })()}
      {ic(s7) && (() => {
        const g = giris(t, s7[0], fps), n8 = vo("n8").bas;
        const sayfa = (i: number) => {
          const gi = giris(t, n8 + i * 0.25, fps);
          return (
            <div key={i} style={{ width: 300, height: 400, background: KREM, borderRadius: 18, boxShadow: "0 16px 40px rgba(0,0,0,0.4)", transform: `translateY(${(1 - gi) * 60}px) rotate(${(i - 1) * 4}deg)`, opacity: gi, display: "flex", flexDirection: "column", alignItems: "center", paddingTop: 30 }}>
              <svg width={170} height={220} viewBox="0 0 130 170"><path d="M45,10 L85,10 L95,40 L120,160 L10,160 L35,40 Z" fill={["#e46a6a", "#5aa0e4", "#9c6ae4"][i]} /><path d="M45,10 Q65,30 85,10" stroke="#fff" strokeWidth={5} fill="none" /></svg>
              <div style={{ fontFamily: POP, fontWeight: 900, fontSize: 52, color: "#1b1f2e", marginTop: 6 }}>{["…4", "…9", "…4"][i]}</div>
            </div>
          );
        };
        return (
          <Ust top={150}>
            <div style={{ opacity: g, transform: `scale(${0.9 + 0.1 * g})`, fontFamily: POP, fontWeight: 900, fontSize: 70, color: "white", background: "#2a3350", borderRadius: 26, padding: "10px 40px" }}>KIYAFET KATALOĞU <span style={{ color: MAVI }}>· ABD</span></div>
            <div style={{ display: "flex", gap: 28, marginTop: 30 }}>{[0, 1, 2].map(sayfa)}</div>
          </Ust>
        );
      })()}
      {ic(s9) && (() => (
        <Ust top={260}>
          {[0, 1, 2].map((i) => {
            const g = giris(t, s9[0] + 0.5 + i * 0.55, fps);
            return (
              <div key={i} style={{ opacity: g, transform: `translateX(${(1 - g) * -120}px)`, width: 820, display: "flex", justifyContent: "space-between", alignItems: "center", background: "#1f2740", borderRadius: 26, padding: "30px 44px", border: `4px solid ${YESIL}` }}>
                <div style={{ fontFamily: POP, fontWeight: 800, fontSize: 56, color: "white" }}>Deney {i + 1}</div>
                <div style={{ fontFamily: POP, fontWeight: 900, fontSize: 56, color: YESIL }}>…9 kazandı ✓</div>
              </div>
            );
          })}
        </Ust>
      ))()}
      {ic(s10) && (() => {
        const g = giris(t, s10[0], fps), st = giris(t, s10[0] + 0.9, fps, 7);
        return (
          <Ust top={150}>
            <div style={{ position: "relative", opacity: g }}>
              <Etiket fiyat="99,99" olcek={1.2} />
              <div style={{ position: "absolute", right: -60, top: 40, transform: `rotate(14deg) scale(${st})`, background: KIRMIZI, color: "white", fontFamily: POP, fontWeight: 900, fontSize: 58, borderRadius: 999, width: 230, height: 230, display: "flex", alignItems: "center", justifyContent: "center", textAlign: "center", lineHeight: 1, boxShadow: "0 14px 40px rgba(0,0,0,0.4)" }}>İNDİRİM<br />gibi!</div>
            </div>
          </Ust>
        );
      })()}
      {ic(s11) && (
        <Ust top={260}>
          <Baslik s1="FİYAT = " s2="MESAJ" t={t} bas={s11[0]} son={s11[1]} fps={fps} boy={190} />
        </Ust>
      )}
      {ic(s12) && (() => {
        const g = giris(t, s12[0], fps), tik = (plan as any).takipTik ?? vo("n12").bas + 1.8;
        const bas = interpolate(t, [tik - 0.08, tik, tik + 0.12], [1, 0.9, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
        const takip = t >= tik;
        return (
          <Ust top={250}>
            <div style={{ opacity: g, fontFamily: POP, fontWeight: 800, fontSize: 60, color: "white", textAlign: "center", lineHeight: 1.15 }}>Alışverişin<br /><span style={{ color: TURUNCU, fontSize: 84, fontWeight: 900 }}>PERDE ARKASI</span></div>
            <div style={{ opacity: g, transform: `scale(${bas * (0.8 + 0.2 * g)})`, marginTop: 30, fontFamily: POP, fontWeight: 900, fontSize: 64, color: takip ? "#1b1f2e" : "white", background: takip ? "#e9ecf3" : TURUNCU, borderRadius: 999, padding: "20px 70px", boxShadow: "0 16px 40px rgba(0,0,0,0.4)" }}>{takip ? "✓ Takip ediliyor" : "+ Takip et"}</div>
          </Ust>
        );
      })()}
    </>
  );
};

// ---------- altyazı (karakterin başının üstünde, yüzü kapatmaz) ----------
const VURGU = ["neden", "doksan", "dokuz", "beynin", "soldan", "doksanlı", "yüzlü", "kuruş", "his", "gerçekten", "test", "farklı", "üçünde", "dokuzla", "indirimdeymiş", "mesaj", "takip"];
const Altyazi: React.FC = () => {
  const { t } = useT();
  const v = VOS.find((x) => t >= x.bas - 0.05 && t < x.son + 0.25);
  if (!v) return null;
  const ws = v.metin.split(" ");
  const ilerleme = (t - v.bas) / Math.max(0.1, v.son - v.bas);
  return (
    <div style={{ position: "absolute", top: 905, left: 60, width: 960, textAlign: "center", lineHeight: 1.22 }}>
      {ws.map((w, i) => {
        const yak = i / ws.length <= ilerleme + 0.02;
        const temiz = w.toLocaleLowerCase("tr").replace(/[^a-zçğıöşü]/g, "");
        const vur = VURGU.some((x) => temiz.startsWith(x));
        return <span key={i} style={{ fontFamily: POP, fontWeight: 800, fontSize: 50, color: vur ? TURUNCU : "white", opacity: yak ? 1 : 0.35, textShadow: "0 3px 14px rgba(0,0,0,0.8)" }}>{w} </span>;
      })}
    </div>
  );
};

// ---------- karakter ----------
const POZLAR: { k: string; poz: Poz; ifade: Ifade }[] = [
  { k: "n1", poz: "goster", ifade: { kas: 0.5, bakX: 0.6, bakY: -0.8 } },
  { k: "n2", poz: "anlat", ifade: { kas: 0.2 } },
  { k: "n3", poz: "goster", ifade: { bakX: 0.5, bakY: -0.9 } },
  { k: "n4", poz: "anlat", ifade: { kas: 0.3 } },
  { k: "n5", poz: "dur", ifade: { kas: 0.6, gozGul: 0.2 } },
  { k: "n6", poz: "dusun", ifade: { kasAci: 0.5, bakX: 0.7, bakY: -0.7, egim: -4 } },
  { k: "n7", poz: "anlat", ifade: {} },
  { k: "n8", poz: "goster", ifade: { bakX: 0.5, bakY: -0.8 } },
  { k: "n9", poz: "goster", ifade: { kas: 0.7, bakY: -0.6, gozGul: 0.2 } },
  { k: "n10", poz: "anlat", ifade: { kas: 0.3 } },
  { k: "n11", poz: "dur", ifade: { gozGul: 0.3, kas: 0.2 } },
  { k: "n12", poz: "selam", ifade: { gozGul: 0.5 } },
];
const VZ = vizemler as { t: number; v: Vizem }[];
const vizemAt = (t: number): Vizem => {
  let v: Vizem = "X";
  for (const e of VZ) { if (e.t > t) break; v = e.v; }
  return v;
};
const karis = (a: KolAci, b: KolAci, p: number): KolAci => [a[0] + (b[0] - a[0]) * p, a[1] + (b[1] - a[1]) * p, p < 0.5 ? a[2] : b[2]];

const Karakter: React.FC = () => {
  const { t, f } = useT();
  // aktif poz ve bir öncekinden geçiş
  let i = 0;
  for (let j = 0; j < POZLAR.length; j++) if (t >= vo(POZLAR[j].k).bas - 0.25) i = j;
  const simdi = POZLAR[i], once = POZLAR[Math.max(0, i - 1)];
  const p = i === 0 ? 1 : interpolate(t, [vo(simdi.k).bas - 0.25, vo(simdi.k).bas + 0.1], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.inOut(Easing.cubic) });
  let sag = karis(KOL_POZ[once.poz], KOL_POZ[simdi.poz], p);
  // selam: el sallama, anlat: konuşurken hafif el hareketi
  if (simdi.poz === "selam") sag = [sag[0] + Math.sin(t * 9) * 10 * p, sag[1] + Math.sin(t * 9) * 12 * p, sag[2]];
  const konusuyor = VOS.some((v) => t >= v.bas && t < v.son);
  if (simdi.poz === "anlat" && konusuyor) sag = [sag[0] + Math.sin(t * 4.2) * 6, sag[1] + Math.sin(t * 4.2 + 1) * 10, sag[2]];
  const sol: KolAci = [10 + Math.sin(t * 1.3) * 2, 6 + (konusuyor ? Math.sin(t * 3.1) * 5 : 0), "yumruk"];
  const ifade: Ifade = { ...simdi.ifade, agiz: konusuyor ? vizemAt(t) : (simdi.k === "n12" || simdi.k === "n11" ? "gulumse" : "gulumse"), egim: (simdi.ifade.egim ?? 0) + (konusuyor ? Math.sin(t * 2.3) * 2 : Math.sin(t * 0.8) * 1) };
  if (ifade.agiz === "X" && konusuyor) ifade.agiz = "duz";
  // göz kırpma: ~3,4 sn'de bir, 4 kare
  const kp = (f + 17) % 102;
  const kirp = kp < 2 ? 0.1 : kp < 4 ? 0.5 : 1;
  const nefes = Math.sin(t * 2.0) * 3;
  const giris1 = spring({ frame: f, fps: 30, config: { damping: 14 } });
  return (
    <div style={{ position: "absolute", left: 0, top: 0, width: 1080, height: 1920 }}>
      <svg width={1080} height={1920} viewBox="0 0 1080 1920" style={{ position: "absolute" }}>
        <ellipse cx={540} cy={1872} rx={260} ry={34} fill="rgba(0,0,0,0.35)" />
        <g transform={`translate(${540 - 200 * 0.8},${1880 - 1130 * 0.8 + (1 - giris1) * 400}) scale(0.8)`}>
          <BerkayTam ifade={ifade} kirp={kirp} sag={sag} sol={sol} nefes={nefes} />
        </g>
      </svg>
    </div>
  );
};

// ---------- arka plan: minyatür e-ticaret dünyası (kutular, raf) ----------
const ArkaPlan: React.FC = () => {
  const { t } = useT();
  const kutu = (x: number, y: number, w: number, h: number, renk: string, k: number) => (
    <g key={k} transform={`translate(${x},${y + Math.sin(t * 0.7 + k) * 3})`}>
      <rect width={w} height={h} rx={8} fill={renk} />
      <rect x={w / 2 - 9} width={18} height={h} fill="rgba(255,255,255,0.18)" />
      <rect width={w} height={h * 0.22} rx={8} fill="rgba(0,0,0,0.12)" />
    </g>
  );
  return (
    <AbsoluteFill style={{ background: "linear-gradient(180deg, #141a2e 0%, #1b2442 55%, #232c4f 100%)" }}>
      <svg width={1080} height={1920} style={{ position: "absolute" }}>
        {/* zemin */}
        <path d="M0,1640 L1080,1640 L1080,1920 L0,1920 Z" fill="#1a2140" />
        {Array.from({ length: 12 }).map((_, i) => <line key={i} x1={540 + (i - 6) * 60} y1={1640} x2={540 + (i - 6) * 260} y2={1920} stroke="rgba(255,255,255,0.05)" strokeWidth={2} />)}
        {/* raflar ve kutular (soluk, arka planda) */}
        <g opacity={0.35}>
          <rect x={30} y={1340} width={250} height={14} fill="#3a4672" />
          <rect x={800} y={1300} width={250} height={14} fill="#3a4672" />
          {kutu(50, 1250, 100, 90, "#c08a4e", 1)}{kutu(160, 1280, 90, 60, "#d39b5c", 2)}
          {kutu(820, 1200, 110, 100, "#c08a4e", 3)}{kutu(940, 1240, 80, 60, "#d39b5c", 4)}
          {kutu(60, 1530, 140, 110, "#b5824a", 5)}{kutu(880, 1520, 150, 120, "#b5824a", 6)}{kutu(930, 1450, 90, 70, "#d39b5c", 7)}
        </g>
      </svg>
    </AbsoluteFill>
  );
};

export const Film: React.FC = () => (
  <AbsoluteFill style={{ background: "#141a2e" }}>
    <Font />
    <ArkaPlan />
    <Karakter />
    <Sahneler />
    <Altyazi />
    {(plan as any).ses ? <Audio src={staticFile((plan as any).ses)} /> : null}
  </AbsoluteFill>
);
