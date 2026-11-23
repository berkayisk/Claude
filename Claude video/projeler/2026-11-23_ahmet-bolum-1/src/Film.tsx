import React from "react";
import { AbsoluteFill, Audio, Sequence, staticFile, useCurrentFrame, interpolate, Easing } from "remotion";
import { OdaPlan, MasaOn, YuzYakin, TelefonYakin, EkranAkis, EkranMarka, LaptopYakin, EkranArastirma, EkranKurulum, Defter, Gren, Vinyet, INTER, ara } from "./sahneler";
import { Isik } from "./ahmet";

const FPS = 24;
const kl = { extrapolateLeft: "clamp" as const, extrapolateRight: "clamp" as const };
const yavas = Easing.inOut(Easing.sin);
const GECE_EKRAN: Isik = { renk: "#a8c6ff", yon: "on", guc: 1.1, ortam: 0.18 };
const GECE_TEL: Isik = { renk: "#a9c8ff", yon: "alt", guc: 1.1, ortam: 0.2 };
const SABAH: Isik = { renk: "#ffd59a", yon: "sol", guc: 1, ortam: 0 };

type Cekim = { id: string; bas: number; sure: number; C: React.FC<{ f: number; d: number }> };
const s = (sn: number) => Math.round(sn * FPS);

const CEKIMLER: Cekim[] = [
  // SAHNE 1 — Merak (gece)
  { id: "1A", bas: 0, sure: 3, C: ({ f, d }) => <OdaPlan z="gece" f={f} cx={1645} cy={1120} s={ara(f, [0, d], [1.55, 1.75], yavas)} ahmet="kanepe" telefonIsik={1} laptopIsik={0} /> },
  { id: "1B", bas: 3, sure: 2.5, C: ({ f }) => <TelefonYakin f={f} ekran={<EkranAkis f={f} durma={40} />} /> },
  { id: "1C", bas: 5.5, sure: 2.5, C: ({ f, d }) => (
    <YuzYakin z="gece" f={f} arka="masa" isik={GECE_TEL} olcek={2.3} x={ara(f, [0, d], [600, 640])} y={940}
      ifade={{ gozX: ara(f, [10, 30], [0.2, -1]), gozY: ara(f, [10, 30], [0.8, 0]), kasY: ara(f, [12, 40], [0, -5]) }}
      donus={ara(f, [10, 34], [4, -6])} yuzBulanik={ara(f, [24, 54], [0, 12])} arkaBulanik={ara(f, [24, 54], [16, 2])} />
  ) },
  // SAHNE 2 — Araştırma (gece)
  { id: "2A", bas: 8, sure: 2, C: ({ f, d }) => <MasaOn z="gece" f={f} zoom={ara(f, [0, d], [1.04, 1.0])} laptopAcik={ara(f, [4, 26], [0, 1])} ekranIsik={ara(f, [14, 34], [0, 1])} ifade={{ gozY: 0.6 }} /> },
  { id: "2B", bas: 10, sure: 3, C: ({ f, d }) => <LaptopYakin z="gece" f={f} kayma={ara(f, [0, d], [0, -60], yavas)} ekran={<EkranArastirma f={f} />} /> },
  { id: "2C", bas: 13, sure: 3, C: ({ f }) => (
    <Defter z="gece" f={f} satirlar={[{ metin: "Ne satacağım?", bas: 2, son: 22 }, { metin: "Tedarikçi?", bas: 26, son: 40 }, { metin: "Şirket?", bas: 44, son: 56 }, { metin: "Stok / kargo?", bas: 58, son: 72 }]} />
  ) },
  { id: "2D", bas: 16, sure: 3, C: ({ f, d }) => (
    <YuzYakin z="gece" f={f} arka="oda" isik={GECE_EKRAN} olcek={ara(f, [0, d], [2.3, 2.6], yavas)} x={540} y={980}
      ifade={{ gozX: Math.sin(f / 4.5) * 0.8, gozY: 0.3, kasAci: ara(f, [0, 30], [2, 9]), kasY: 2, dudakBas: ara(f, [20, 50], [0, 1]) }} />
  ) },
  // SAHNE 3 — Tıkanıklık (gece)
  { id: "3A", bas: 19, sure: 3, C: ({ f }) => <MasaOn z="gece" f={f} zoom={1.12} odakY={820} ifade={{ gozY: 0.2, kasY: 3, kasAci: 3 }} nefes={ara(f, [10, 40, 70], [0, 1, 0])} /> },
  { id: "3B", bas: 22, sure: 3, C: ({ f }) => (
    <MasaOn z="gece" f={f} zoom={1.55} odakY={760} ifade={{ gozAcik: ara(f, [6, 22], [1, 0.1]), kasAci: 6 }}
      eller={ara(f, [4, 22, 46, 64], [0, 1, 1, 0])} yaslan={ara(f, [40, 70], [0, 1])} />
  ) },
  { id: "3C", bas: 25, sure: 4, C: ({ f, d }) => (
    <OdaPlan z="gece" f={f} cx={ara(f, [0, d], [560, 620], yavas)} cy={1060} s={ara(f, [0, d], [1.18, 1.04], yavas)} ahmet="masa"
      laptopIsik={ara(f, [36, 44], [1, 0])} karartma={ara(f, [36, 50], [0, 0.25])} />
  ) },
  // SAHNE 4 — Keşif (gece)
  { id: "4A", bas: 29, sure: 3, C: ({ f }) => (
    <MasaOn z="gece" f={f} zoom={1.25} odakY={820} laptopAcik={0} ekranIsik={0} telefon={ara(f, [2, 26], [0, 1])} telefonIsik={ara(f, [20, 30], [0, 1])}
      ifade={{ gozY: ara(f, [0, 30], [0.4, 0.9]), kasY: 3, gozAcik: 0.8 }} />
  ) },
  { id: "4B", bas: 32, sure: 3, C: ({ f }) => <TelefonYakin f={f} ekran={<EkranMarka f={f} durma={26} />} /> },
  { id: "4C", bas: 35, sure: 3, C: ({ f, d }) => (
    <YuzYakin z="gece" f={f} arka="masa" isik={GECE_TEL} olcek={ara(f, [0, d], [5.0, 5.4], yavas)} x={540} y={900 + ara(f, [0, d], [0, 30])}
      ifade={{ gozY: 0.7, kasY: ara(f, [10, 34], [2, -9]), gozAcik: ara(f, [10, 34], [0.85, 1.05]) }} />
  ) },
  { id: "4D", bas: 38, sure: 4, C: ({ f, d }) => (
    <MasaOn z="gece" f={f} zoom={ara(f, [0, d], [1.05, 1.5], Easing.in(Easing.cubic))} odakY={860} telefon={ara(f, [0, 16], [1, 0])} telefonIsik={ara(f, [0, 16], [1, 0])}
      laptopAcik={ara(f, [14, 36], [0, 1])} ekranIsik={ara(f, [24, 50], [0, 1.2])} ifade={{ gozY: 0.4, kasY: -3, gulum: 0.1 }} beyaz={ara(f, [d - 14, d], [0, 1], Easing.in(Easing.quad))} />
  ) },
  // SAHNE 5 — Netlik (sabah)
  { id: "5A", bas: 42, sure: 3, C: ({ f, d }) => (
    <AbsoluteFill>
      <OdaPlan z="sabah" f={f} cx={ara(f, [0, d], [560, 640], yavas)} cy={1050} s={ara(f, [0, d], [1.3, 1.1], yavas)} ahmet="masa" kupa lambaAcik={false} toz />
      <AbsoluteFill style={{ background: "#f2f5ff", opacity: interpolate(f, [0, 10], [1, 0], kl) }} />
    </AbsoluteFill>
  ) },
  { id: "5B", bas: 45, sure: 3, C: ({ f }) => (
    <Defter z="sabah" f={f} satirlar={[{ metin: "Yol haritası", bas: 0, son: 14, boyut: 84 }, { metin: "1. Modeli öğren", bas: 18, son: 36 }, { metin: "2. Mağazayı kur", bas: 40, son: 56 }, { metin: "3. İlk ürünü seç", bas: 58, son: 72 }]} />
  ) },
  { id: "5C", bas: 48, sure: 3, C: ({ f, d }) => <LaptopYakin z="sabah" f={f} kayma={ara(f, [0, d], [-50, 10], yavas)} ekran={<EkranKurulum f={f} />} /> },
  { id: "5D", bas: 51, sure: 3, C: ({ f }) => (
    <YuzYakin z="sabah" f={f} arka="sabah" isik={SABAH} olcek={2.35} x={560} y={900}
      ifade={{ gozX: -0.3, gozY: 0.4, gulum: ara(f, [6, 36], [0, 0.9]), kasY: ara(f, [6, 36], [0, -3]) }} kupa={ara(f, [48, 70], [0, 0.55])} />
  ) },
  // SAHNE 6 — Kapanış (sabah)
  { id: "6A", bas: 54, sure: 4, C: ({ f, d }) => (
    <OdaPlan z="sabah" f={f} cx={ara(f, [0, d], [620, 1000], yavas)} cy={ara(f, [0, d], [1050, 1150], yavas)} s={ara(f, [0, d], [1.12, 0.8], yavas)} ahmet="masa" kupa lambaAcik={false} toz
      karartma={ara(f, [d - 12, d], [0, 1], Easing.in(Easing.quad))} />
  ) },
];

const Kapanis: React.FC<{ f: number }> = ({ f }) => {
  const g = interpolate(f, [7, 19], [0, 1], kl);
  return (
    <AbsoluteFill style={{ background: "#000", justifyContent: "center", alignItems: "center", flexDirection: "column" }}>
      <div style={{ opacity: g, fontFamily: INTER, fontWeight: 800, fontSize: 92, letterSpacing: 4, color: "white" }}>
        SIFIRDAN <span style={{ color: "#F67102" }}>SATIŞA</span>
      </div>
      <div style={{ opacity: g * 0.75, marginTop: 22, fontFamily: INTER, fontWeight: 500, fontSize: 36, letterSpacing: 10, color: "white" }}>BÖLÜM 1</div>
    </AbsoluteFill>
  );
};

import plan from "./plan.json";
import "@fontsource/poppins/600.css";
import "@fontsource/poppins/700.css";
import "@fontsource/poppins/800.css";
const POP = "'Poppins', sans-serif";
type VO = { k: string; metin: string; bas: number; son: number; ic: boolean };
type Bsl = { bas: number; son: number; s1: string; s2: string; renk: string; orta?: boolean };
const kucuk = (x: string) => x.replace(/İ/g, "i").replace(/I/g, "ı").toLowerCase().replace(/[.,?!:'’]/g, "");

// Üst başlık (referans stili): beyaz satır + renkli anahtar satır
const Baslik: React.FC<{ t: number }> = ({ t }) => {
  const b = (plan.basliklar as Bsl[]).find((x) => t >= x.bas && t < x.son);
  if (!b) return null;
  const g = interpolate(t, [b.bas, b.bas + 0.35], [0, 1], { ...kl, easing: Easing.out(Easing.back(1.6)) });
  const c = interpolate(t, [b.son - 0.25, b.son], [1, 0], kl);
  const op = Math.min(g, c);
  if (b.orta) {
    return (
      <AbsoluteFill style={{ background: `rgba(0,0,0,${0.55 * op})`, justifyContent: "center", alignItems: "center", flexDirection: "column" }}>
        <div style={{ opacity: op, transform: `scale(${0.85 + 0.15 * g})`, textAlign: "center", fontFamily: POP, fontWeight: 800, lineHeight: 1.05 }}>
          <div style={{ fontSize: 104, color: "white", letterSpacing: -2 }}>{b.s1}</div>
          <div style={{ fontSize: 104, color: b.renk, letterSpacing: -2 }}>{b.s2}</div>
        </div>
      </AbsoluteFill>
    );
  }
  return (
    <AbsoluteFill style={{ alignItems: "center" }}>
      <div style={{ position: "absolute", top: 150, width: 980, textAlign: "center", fontFamily: POP, fontWeight: 800, lineHeight: 1.04, opacity: op, transform: `translateY(${(1 - g) * -30}px)`, textShadow: "0 6px 30px rgba(0,0,0,0.6)" }}>
        <div style={{ fontSize: 68, color: "white", letterSpacing: -1 }}>{b.s1}</div>
        <div style={{ fontSize: 78, color: b.renk, letterSpacing: -1 }}>{b.s2}</div>
      </div>
    </AbsoluteFill>
  );
};
// Alt altyazı: seslendirme cümlesi, anahtar kelimeler turuncu
const Altyazi: React.FC<{ t: number }> = ({ t }) => {
  const vo = plan.vo as VO[];
  const i = vo.findIndex((v, j) => t >= v.bas - 0.05 && t < Math.min(v.son + 0.35, vo[j + 1] ? vo[j + 1].bas - 0.05 : 99));
  if (i < 0) return null;
  const v = vo[i];
  const g = interpolate(t, [v.bas - 0.05, v.bas + 0.15], [0, 1], kl);
  const kelimeler = v.metin.split(" ");
  return (
    <AbsoluteFill style={{ alignItems: "center" }}>
      <div style={{ position: "absolute", top: 1500, width: 940, display: "flex", flexWrap: "wrap", justifyContent: "center", gap: "0 14px", opacity: g, transform: `translateY(${(1 - g) * 14}px)` }}>
        {kelimeler.map((w, j) => {
          const vurgu = (plan.vurgu as string[]).some((k) => kucuk(w).startsWith(k));
          return <span key={j} style={{ fontFamily: POP, fontWeight: 700, fontStyle: v.ic ? "italic" : "normal", fontSize: 50, lineHeight: 1.25, color: vurgu ? "#FF9A3C" : "white", textShadow: "0 3px 18px rgba(0,0,0,0.85), 0 0 3px rgba(0,0,0,0.9)" }}>{w}</span>;
        })}
      </div>
    </AbsoluteFill>
  );
};

export const Film: React.FC = () => {
  const f = useCurrentFrame();
  return (
    <AbsoluteFill style={{ background: "#000" }}>
      {CEKIMLER.map((c) => (
        <Sequence key={c.id} from={s(c.bas)} durationInFrames={s(c.sure)} name={c.id}>
          <CekimSar c={c} />
        </Sequence>
      ))}
      <Sequence from={s(58)} durationInFrames={s(2)} name="6B"><KapanisSar /></Sequence>
      <AbsoluteFill style={{ background: "linear-gradient(180deg, rgba(0,0,0,0.55) 0%, rgba(0,0,0,0.25) 16%, rgba(0,0,0,0) 26%, rgba(0,0,0,0) 70%, rgba(0,0,0,0.35) 78%, rgba(0,0,0,0.6) 92%)" }} />
      <Baslik t={f / FPS} />
      <Altyazi t={f / FPS} />
      <Vinyet guc={0.8} />
      <Gren f={f} />
      <Audio src={staticFile("ana_ses.wav")} />
    </AbsoluteFill>
  );
};
const CekimSar: React.FC<{ c: Cekim }> = ({ c }) => {
  const f = useCurrentFrame();
  const C = c.C;
  return <C f={f} d={s(c.sure)} />;
};
const KapanisSar: React.FC = () => <Kapanis f={useCurrentFrame()} />;
