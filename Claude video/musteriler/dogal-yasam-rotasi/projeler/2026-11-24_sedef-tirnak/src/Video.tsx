import React from "react";
import "@fontsource/fredoka/600.css";
import "@fontsource/fredoka/700.css";
import { AbsoluteFill, Audio, Sequence, interpolate, spring, staticFile, useCurrentFrame, useVideoConfig, Easing } from "remotion";
import { SATIRLAR, FPS } from "./zaman";
import { RENK, El, Tirnak, Buyutec, ElIkon, Dirsek, Doktor, Telefon, KagitUcak, ArkaPlan } from "./cizim";

const FONT = "Fredoka, sans-serif";
const fr = (s: number) => Math.round(s * FPS);

// ---------- ortak ----------
const useGiris = (gecikme = 0, damp = 12) => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  return spring({ frame: f - gecikme, fps, config: { damping: damp, stiffness: 140, mass: 0.7 } });
};

/** Sahne kabı: hafif kamera yaklaşması (örnekteki yavaş zoom) */
const Sahne: React.FC<{ dur: number; zemin: string; vurgu?: string; koyu?: boolean; children: React.ReactNode; zoom?: number }> = ({ dur, zemin, vurgu, koyu, children, zoom = 0.05 }) => {
  const f = useCurrentFrame();
  const s = interpolate(f, [0, dur], [1, 1 + zoom], { extrapolateRight: "clamp" });
  return (
    <AbsoluteFill>
      <ArkaPlan renk={zemin} vurgu={vurgu} t={f / 30} koyu={koyu} />
      <AbsoluteFill style={{ transform: `scale(${s})` }}>
        <svg width={1080} height={1920} viewBox="0 0 1080 1920">
          {children}
        </svg>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

/** Üst başlık (ekran yazısı): mor hap, beyaz yazı */
const Baslik: React.FC<{ metin: string; gecikme?: number; y?: number }> = ({ metin, gecikme = 2, y = 250 }) => {
  const g = useGiris(gecikme, 11);
  return (
    <div style={{ position: "absolute", top: y, left: 0, right: 0, display: "flex", justifyContent: "center", transform: `scale(${0.6 + 0.4 * g})`, opacity: Math.min(1, g * 1.5) }}>
      <div style={{ background: RENK.mor, color: "#fff", fontFamily: FONT, fontWeight: 700, fontSize: 66, padding: "18px 44px", borderRadius: 999, letterSpacing: 1, boxShadow: "0 10px 0 rgba(43,33,64,0.25)", border: "6px solid #fff", textAlign: "center", maxWidth: 940 }}>
        {metin}
      </div>
    </div>
  );
};

/** Altyazı: beyaz hap, mor ince kenar, koyu mor yazı; satır parçalara bölünür */
const Altyazi: React.FC<{ metin: string; dur: number }> = ({ metin, dur }) => {
  const f = useCurrentFrame();
  const parcalar = parcala(metin);
  const toplam = parcalar.reduce((a, p) => a + p.length, 0);
  let acc = 0, aktif = parcalar[0];
  for (const p of parcalar) {
    const bas = (acc / toplam) * dur;
    if (f >= bas) aktif = p;
    acc += p.length;
  }
  return (
    <div style={{ position: "absolute", top: 1330, left: 0, right: 0, display: "flex", justifyContent: "center" }}>
      <div style={{ background: "#fff", border: `5px solid ${RENK.morAcik}`, color: RENK.mor, fontFamily: FONT, fontWeight: 600, fontSize: 56, padding: "14px 38px", borderRadius: 999, boxShadow: "0 8px 22px rgba(43,33,64,0.18)", textAlign: "center", maxWidth: 960, lineHeight: 1.15 }}>
        {aktif}
      </div>
    </div>
  );
};
function parcala(m: string): string[] {
  const k = m.split(" ");
  const out: string[] = [];
  let cur: string[] = [];
  for (const w of k) {
    cur.push(w);
    const n = cur.join(" ");
    if (cur.length >= 5 || (cur.length >= 3 && /[,?.:]$/.test(w)) || n.length > 22) { out.push(n); cur = []; }
  }
  if (cur.length) out.push(cur.join(" "));
  // tek kelimelik kuyruk varsa önceki parçaya ekle
  if (out.length > 1 && out[out.length - 1].split(" ").length === 1) { const s = out.pop()!; out[out.length - 1] += " " + s; }
  return out;
}

// ---------- sahneler ----------
const S01: React.FC<{ dur: number }> = ({ dur }) => {
  const g = useGiris(0, 10);
  return (
    <Sahne dur={dur} zemin={RENK.krem} vurgu="#FFE2C4">
      <g transform={`translate(240 ${560 + (1 - g) * 900}) scale(1.0)`}><El /></g>
    </Sahne>
  );
};

const S02: React.FC<{ dur: number }> = ({ dur }) => {
  const f = useCurrentFrame();
  const t = interpolate(f, [4, 24], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.out(Easing.cubic) });
  const bx = interpolate(t, [0, 1], [1150, 545]);
  return (
    <Sahne dur={dur} zemin={RENK.krem} vurgu="#FFE2C4" zoom={0.03}>
      <g transform="translate(240 560)"><El tirnaklar={["cukur", "cukur", "cukur", "normal", "normal"]} /></g>
      <g transform={`translate(${bx} 760)`}>
        <Buyutec r={230} id="b02">
          <g transform="translate(-150 -150)"><Tirnak w={300} h={300} tip="cukur" sw={10} /></g>
        </Buyutec>
      </g>
    </Sahne>
  );
};

const S03: React.FC<{ dur: number }> = ({ dur }) => {
  const f = useCurrentFrame();
  const vurus = Math.round(dur * 0.45);
  const yaklas = interpolate(f, [0, vurus], [-260, 0], { extrapolateRight: "clamp", easing: Easing.in(Easing.quad) });
  const geri = f > vurus ? interpolate(f, [vurus, vurus + 8], [0, -40], { extrapolateRight: "clamp" }) : 0;
  const titre = f > vurus && f < vurus + 8 ? Math.sin(f * 3) * 10 : 0;
  const yildiz = spring({ frame: f - vurus, fps: 30, config: { damping: 9 } });
  return (
    <Sahne dur={dur} zemin={RENK.mavi} vurgu="#FFFFFF" zoom={0.03}>
      {/* masa köşesi */}
      <g transform={`translate(${titre} 0)`}>
        <path d="M560 850 L 1080 850 L 1080 1920 L 560 1920 Z" fill="#B97C55" stroke={RENK.cizgi} strokeWidth={8} />
        <path d="M560 850 L 1080 850 L 1080 910 L 560 910 Z" fill="#D49A70" stroke={RENK.cizgi} strokeWidth={8} />
      </g>
      <g transform={`translate(${232 + yaklas + geri} 1020) rotate(90) scale(0.8) translate(-300 -470)`}><El tirnaklar={["cukur", "cukur", "normal", "normal", "normal"]} /></g>
      {f > vurus && (
        <g transform={`translate(565 970) scale(${yildiz})`}>
          <path d="M0 -90 L 22 -30 L 85 -40 L 38 5 L 70 60 L 8 35 L -30 85 L -28 22 L -88 5 L -32 -22 Z" fill="#FFD84D" stroke={RENK.cizgi} strokeWidth={7} strokeLinejoin="round" />
          <text x={0} y={18} textAnchor="middle" fontFamily={FONT} fontWeight={700} fontSize={44} fill={RENK.cizgi}>TIK</text>
        </g>
      )}
      {f > vurus + 10 && (
        <text x={330} y={700} textAnchor="middle" fontFamily={FONT} fontWeight={700} fontSize={220} fill={RENK.mor} opacity={Math.min(1, (f - vurus - 10) / 8)}>?</text>
      )}
    </Sahne>
  );
};

const S04: React.FC<{ dur: number }> = ({ dur }) => {
  const g = useGiris(8, 12);
  const f = useCurrentFrame();
  const cizgi = interpolate(f, [6, 22], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  return (
    <Sahne dur={dur} zemin={RENK.lila} vurgu="#FFFFFF">
      <g transform="translate(330 560)"><Tirnak w={420} h={440} tip="cukur" sw={12} /></g>
      <path d={`M640 700 L ${640 + 180 * cizgi} ${700 - 160 * cizgi}`} stroke={RENK.mor} strokeWidth={8} strokeDasharray="16 12" strokeLinecap="round" />
      <g transform={`translate(840 520) scale(${g})`}>
        <rect x={-140} y={-62} width={280} height={110} rx={55} fill="#fff" stroke={RENK.mor} strokeWidth={8} />
        <text x={0} y={18} textAnchor="middle" fontFamily={FONT} fontWeight={700} fontSize={64} fill={RENK.mor}>sedef?</text>
      </g>
    </Sahne>
  );
};

const S05: React.FC<{ dur: number }> = ({ dur }) => {
  const a = useGiris(0, 12);
  const b = useGiris(10, 12);
  const etiket = (x: number, y: number, m: string) => (
    <g transform={`translate(${x} ${y})`}>
      <rect x={-130} y={-48} width={260} height={84} rx={42} fill={RENK.mor} />
      <text x={0} y={12} textAnchor="middle" fontFamily={FONT} fontWeight={700} fontSize={46} fill="#fff">{m}</text>
    </g>
  );
  return (
    <Sahne dur={dur} zemin={RENK.mint} vurgu="#FFFFFF" zoom={0.03}>
      <g transform={`translate(560 ${640}) scale(${0.85 * a})`}><Dirsek /></g>
      {etiket(250, 470, "CİLT")}
      <text x={540} y={1000} textAnchor="middle" fontFamily={FONT} fontWeight={700} fontSize={110} fill={RENK.mor} opacity={b}>+</text>
      <g transform={`translate(${430} ${1040}) scale(${b})`}><Tirnak w={220} h={225} tip="cukur" sw={9} /></g>
      {etiket(830, 1150, "TIRNAK")}
    </Sahne>
  );
};

const S06: React.FC<{ dur: number }> = ({ dur }) => {
  const f = useCurrentFrame();
  const sira = [0, 6, 2, 8, 4];
  return (
    <Sahne dur={dur} zemin={RENK.lila} vurgu="#FFFFFF" zoom={0.02}>
      {Array.from({ length: 10 }).map((_, i) => {
        const x = 170 + (i % 5) * 185, y = 720 + Math.floor(i / 5) * 300;
        const idx = sira.indexOf(i);
        const aktif = idx >= 0 && f > 8 + idx * Math.max(6, Math.floor((dur - 30) / 6)) ? 1 : 0;
        return (
          <g key={i} transform={`translate(${x} ${y}) scale(${aktif ? 1.12 : 1})`}>
            <ElIkon aktif={aktif} />
          </g>
        );
      })}
    </Sahne>
  );
};

const Kart: React.FC<{ x: number; y: number; w: number; h: number; g: number; children?: React.ReactNode; no?: string }> = ({ x, y, w, h, g, children, no }) => (
  <g transform={`translate(${x} ${y}) scale(${g}, 1)`}>
    <rect x={-w / 2} y={-h / 2} width={w} height={h} rx={40} fill="#fff" stroke={RENK.cizgi} strokeWidth={8} />
    {no && (
      <g transform={`translate(${-w / 2 + 50} ${-h / 2 + 50})`}>
        <circle r={38} fill={RENK.mor} />
        <text y={16} textAnchor="middle" fontFamily={FONT} fontWeight={700} fontSize={46} fill="#fff">{no}</text>
      </g>
    )}
    {children}
  </g>
);

const S07: React.FC<{ dur: number }> = ({ dur }) => {
  const gs = [useGiris(2, 13), useGiris(8, 13), useGiris(14, 13)];
  return (
    <Sahne dur={dur} zemin={RENK.mavi} vurgu="#FFFFFF" zoom={0.02}>
      {[0, 1, 2].map((i) => (
        <Kart key={i} x={200 + i * 340} y={860} w={290} h={400} g={gs[i]} no={`${i + 1}`}>
          <text y={60} textAnchor="middle" fontFamily={FONT} fontWeight={700} fontSize={170} fill={RENK.morAcik}>?</text>
        </Kart>
      ))}
    </Sahne>
  );
};

const IsaretSahne: React.FC<{ dur: number; tip: "yag" | "kalkma" | "kalin"; no: string; zemin: string }> = ({ dur, tip, no, zemin }) => {
  const g = useGiris(0, 13);
  const f = useCurrentFrame();
  const kir = tip === "kalin" ? interpolate(f, [10, dur], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) : 0;
  return (
    <Sahne dur={dur} zemin={zemin} vurgu="#FFFFFF" zoom={0.04}>
      <Kart x={540} y={860} w={720} h={780} g={g} no={no}>
        <g transform="translate(-190 -230)"><Tirnak w={380} h={400} tip={tip} sw={12} kirinti={kir} /></g>
        {tip === "yag" && (
          <g transform="translate(250 -250)">
            <path d="M0 -60 Q 45 0 40 30 A 40 40 0 0 1 -40 30 Q -45 0 0 -60 Z" fill="#F2B36E" stroke={RENK.cizgi} strokeWidth={7} />
            <ellipse cx={-12} cy={15} rx={9} ry={14} fill="#fff" opacity={0.8} />
          </g>
        )}
      </Kart>
    </Sahne>
  );
};

const S11: React.FC<{ dur: number }> = ({ dur }) => {
  const f = useCurrentFrame();
  const s = interpolate(f, [0, dur], [2.2, 1.2], { easing: Easing.inOut(Easing.cubic) });
  const spot = interpolate(f, [0, 10], [0, 1], { extrapolateRight: "clamp" });
  return (
    <Sahne dur={dur} zemin="#1E1A33" vurgu="#3B3366" koyu zoom={0}>
      <defs>
        <radialGradient id="spot11" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#FFF6D8" stopOpacity={0.55 * spot} />
          <stop offset="100%" stopColor="#FFF6D8" stopOpacity={0} />
        </radialGradient>
      </defs>
      <circle cx={540} cy={720} r={520} fill="url(#spot11)" />
      <g transform={`translate(540 760) scale(${s}) translate(-300 -170)`}><El tirnaklar={["cukur", "cukur", "normal", "normal", "normal"]} /></g>
    </Sahne>
  );
};

const S12: React.FC<{ dur: number }> = ({ dur }) => {
  const f = useCurrentFrame();
  const p = interpolate(f, [6, dur * 0.55], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const parla = 0.5 + 0.5 * Math.sin(f / 5);
  // orta parmak tırnağından ilk ekleme ışık hattı (El yerel: x=300, tırnak y~110, eklem y~204)
  return (
    <Sahne dur={dur} zemin="#1E1A33" vurgu="#2D4C7A" koyu zoom={0.04}>
      <g transform="translate(240 520)">
        <El seffaf tirnaklar={["cukur", "cukur", "normal", "normal", "normal"]} eklemParla={p * parla} />
        <line x1={300} y1={120} x2={300} y2={120 + 84 * p} stroke="#FFD84D" strokeWidth={12} strokeLinecap="round" />
        <line x1={196} y1={190} x2={196} y2={190 + 66 * p} stroke="#FFD84D" strokeWidth={12} strokeLinecap="round" />
      </g>
    </Sahne>
  );
};

const S14: React.FC<{ dur: number }> = ({ dur }) => {
  const g = useGiris(4, 10);
  return (
    <Sahne dur={dur} zemin={RENK.krem} vurgu="#FFE2C4" zoom={0.03}>
      <g transform="translate(340 600)"><Tirnak w={400} h={420} tip="cukur" sw={12} /></g>
      <text x={860} y={760} textAnchor="middle" fontFamily={FONT} fontWeight={700} fontSize={300} fill={RENK.mor} transform={`rotate(${(1 - g) * 30} 860 700)`} opacity={g}>?</text>
      {/* başka olası sebepler, silik */}
      <g opacity={0.45 * g} transform="translate(200 1130)">
        <rect x={-55} y={-25} width={110} height={50} rx={12} fill="#9AA3B5" stroke={RENK.cizgi} strokeWidth={5} />
        <rect x={-10} y={20} width={20} height={90} rx={6} fill="#8D5A3B" stroke={RENK.cizgi} strokeWidth={5} />
      </g>
      <g opacity={0.45 * g} transform="translate(880 1150)">
        <path d="M0 -60 Q 45 0 40 30 A 40 40 0 0 1 -40 30 Q -45 0 0 -60 Z" fill="#9FC9E8" stroke={RENK.cizgi} strokeWidth={6} />
      </g>
    </Sahne>
  );
};

const S15: React.FC<{ dur: number }> = ({ dur }) => {
  const f = useCurrentFrame();
  const g = useGiris(0, 13);
  const konus = Math.max(0, Math.sin(f / 2.6)) * (f < dur - 10 ? 0 : 0); // doktor konuşmuyor (anlatıcı); hafif gülümseme
  const bx = interpolate(f, [6, 26], [420, 300], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  return (
    <Sahne dur={dur} zemin={RENK.mint} vurgu="#FFFFFF" zoom={0.04}>
      <g transform={`translate(330 ${1250 + (1 - g) * 500})`}><Doktor agiz={konus} goz={f % 90 > 84 ? 0.15 : 1} /></g>
      <g transform="translate(560 640) scale(0.62)"><El tirnaklar={["cukur", "cukur", "normal", "normal", "normal"]} /></g>
      <g transform={`translate(${bx + 470} 760)`}>
        <Buyutec r={120} id="b15">
          <g transform="translate(-80 -80)"><Tirnak w={160} h={160} tip="cukur" sw={8} /></g>
        </Buyutec>
      </g>
    </Sahne>
  );
};

const S16: React.FC<{ dur: number }> = ({ dur }) => {
  const f = useCurrentFrame();
  const g = useGiris(0, 13);
  const gonder = Math.round(dur * 0.5);
  const u = interpolate(f, [gonder, gonder + 18], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.in(Easing.quad) });
  // son ~0.5 sn: açılıştaki el karesine döngü
  const donus = interpolate(f, [dur - 14, dur], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  return (
    <Sahne dur={dur} zemin={RENK.lila} vurgu="#FFFFFF" zoom={0.02}>
      <g transform={`translate(540 ${820 + (1 - g) * 700})`} opacity={1 - donus}>
        <Telefon>
          <rect x={-170} y={-330} width={340} height={70} rx={35} fill="#E9E2F2" />
          <circle cx={-130} cy={-295} r={24} fill={RENK.teal} />
          <rect x={-90} y={-308} width={160} height={26} rx={13} fill="#C7BDD9" />
          <g transform={`translate(${60} ${-80 - u * 120})`} opacity={1 - u}>
            <rect x={-130} y={-150} width={260} height={300} rx={26} fill={RENK.krem} stroke={RENK.cizgi} strokeWidth={6} />
            <g transform="translate(-60 -110) scale(0.2)"><El tirnaklar={["cukur", "cukur", "normal", "normal", "normal"]} /></g>
          </g>
          <rect x={-170} y={280} width={340} height={80} rx={40} fill={RENK.mor} />
          <text x={-20} y={334} textAnchor="middle" fontFamily={FONT} fontWeight={700} fontSize={42} fill="#fff">GÖNDER</text>
          <g transform={`translate(${110 + u * 380} ${320 - u * 520}) scale(0.7) rotate(${-u * 20})`}><KagitUcak /></g>
        </Telefon>
      </g>
      <g opacity={donus} transform="translate(240 560)"><El /></g>
    </Sahne>
  );
};

const SAHNELER: Record<string, { C: React.FC<{ dur: number }>; baslik?: string; sfx?: [string, number][] }> = {
  s01: { C: S01, baslik: "TIRNAKLARINA BİR BAK", sfx: [["pop", 0]] },
  s02: { C: S02, sfx: [["whoosh_giris", 0.05]] },
  s03: { C: S03, sfx: [["tik", 0.45]] },
  s04: { C: S04, sfx: [["onay1", 0.25]] },
  s05: { C: S05, baslik: "CİLT + TIRNAK", sfx: [["pop", 0.0], ["pop", 0.33]] },
  s06: { C: S06, baslik: "YAKLAŞIK YARISI", sfx: [["blip2", 0.1], ["blip2", 0.3], ["blip2", 0.5], ["blip2", 0.7]] },
  s07: { C: S07, baslik: "3 İŞARET DAHA", sfx: [["whoosh_giris", 0.0]] },
  s08: { C: (p) => <IsaretSahne {...p} tip="yag" no="1" zemin={RENK.krem} />, baslik: "YAĞ DAMLASI LEKESİ", sfx: [["pop", 0]] },
  s09: { C: (p) => <IsaretSahne {...p} tip="kalkma" no="2" zemin={RENK.mint} />, baslik: "UÇTAN KALKMA", sfx: [["pop", 0]] },
  s10: { C: (p) => <IsaretSahne {...p} tip="kalin" no="3" zemin={RENK.lila} />, baslik: "KALINLAŞMA", sfx: [["pop", 0]] },
  s11: { C: S11, sfx: [["whoosh_cikis", 0.0]] },
  s12: { C: S12, baslik: "TIRNAK ↔ EKLEM", sfx: [["secim", 0.2]] },
  s14: { C: S14, baslik: "HER ÇUKUR SEDEF DEĞİL", sfx: [["pop", 0.1]] },
  s15: { C: S15, baslik: "DERMATOLOĞA GÖSTER", sfx: [["onay1", 0.2]] },
  s16: { C: S16, baslik: "GÖNDER ✈", sfx: [["bildirim", 0.5]] },
};

export const Video: React.FC = () => {
  const satirlar = SATIRLAR as unknown as { k: string; metin: string; bas: number; sure: number }[];
  const { durationInFrames } = useVideoConfig();
  return (
    <AbsoluteFill style={{ background: RENK.krem }}>
      {satirlar.map((s, i) => {
        const bas = i === 0 ? 0 : fr(s.bas);
        const son = i + 1 < satirlar.length ? fr(satirlar[i + 1].bas) : durationInFrames;
        const dur = son - bas;
        const sh = SAHNELER[s.k];
        return (
          <Sequence key={s.k} from={bas} durationInFrames={dur}>
            <sh.C dur={dur} />
            {sh.baslik && <Baslik metin={sh.baslik} />}
            <Sequence from={fr(s.bas) - bas} durationInFrames={dur}>
              <Altyazi metin={s.metin} dur={fr(s.sure)} />
            </Sequence>
            {(sh.sfx || []).map(([ad, t], j) => (
              <Sequence key={j} from={Math.round(t * dur)}>
                <Audio src={staticFile(`sfx/${ad}.wav`)} volume={0.35} />
              </Sequence>
            ))}
          </Sequence>
        );
      })}
      {/* seslendirme */}
      {satirlar.map((s) => (
        <Sequence key={"a" + s.k} from={fr(s.bas)}>
          <Audio src={staticFile(`ses/${s.k}.wav`)} />
        </Sequence>
      ))}
      <Audio src={staticFile("muzik.wav")} volume={0.13} />
      {/* bilgilendirme notu: son 3 sn */}
      <Sequence from={durationInFrames - fr(3.2)}>
        <div style={{ position: "absolute", top: 1490, left: 0, right: 0, textAlign: "center", fontFamily: FONT, fontWeight: 600, fontSize: 28, color: "#5E5470" }}>
          Bilgilendirme amaçlıdır, tanı ve tedavi yerine geçmez.
        </div>
      </Sequence>
    </AbsoluteFill>
  );
};
