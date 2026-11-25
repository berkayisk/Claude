import React from "react";
import { AbsoluteFill, Img, staticFile } from "remotion";
import { BerkayBas, BerkayTam, Ifade, Vizem, R } from "./berkay";

const IFADELER: { ad: string; i: Ifade }[] = [
  { ad: "Gülümseyen", i: { agiz: "gulumse", gozGul: 0.25 } },
  { ad: "Anlatırken", i: { agiz: "A", kas: 0.3 } },
  { ad: "Şaşkın", i: { agiz: "sasir", kas: 1, goz: 1.15 } },
  { ad: "Düşünceli", i: { agiz: "duz", kas: -0.2, kasAci: 0.6, bakX: 0.8, bakY: -0.8, egim: -4 } },
  { ad: "Endişeli", i: { agiz: "duz", kasAci: -1, kas: 0.4, bakX: -0.5 } },
  { ad: "Kahkaha", i: { agiz: "kocaGulumse", gozGul: 0.8, goz: 0.7, kas: 0.4, yanak: 0.4 } },
];
const VIZEMLER: { ad: string; v: Vizem }[] = [
  { ad: "Kapalı", v: "X" }, { ad: "A", v: "A" }, { ad: "E", v: "E" }, { ad: "I/İ", v: "I" },
  { ad: "O/Ö", v: "O" }, { ad: "U/Ü", v: "U" }, { ad: "M/B/P", v: "M" }, { ad: "F/V", v: "F" },
];
const Etiket: React.FC<{ x: number; y: number; t: string; boy?: number }> = ({ x, y, t, boy = 26 }) => (
  <text x={x} y={y} textAnchor="middle" fill="#cfd5e2" fontSize={boy} fontFamily="Poppins, Arial, sans-serif" fontWeight={600}>{t}</text>
);

export const Kart: React.FC = () => (
  <AbsoluteFill style={{ background: "#0f1320" }}>
    <svg width={2400} height={1500} viewBox="0 0 2400 1500">
      <rect width={2400} height={1500} fill="#0f1320" />
      <text x={60} y={88} fill="#fff" fontSize={52} fontWeight={800} fontFamily="Poppins, Arial, sans-serif">BERKAY — karakter kartı v4</text>
      <text x={60} y={130} fill="#8d97ad" fontSize={26} fontFamily="Poppins, Arial, sans-serif">rehber karakter · flat stil · kodla çizildi (Remotion SVG)</text>
      {/* referans */}
      <image href={staticFile("berkay_ref2.jpg")} x={60} y={170} width={300} height={300} />
      <Etiket x={210} y={505} t="Referans" />
      {/* büyük portre */}
      <clipPath id="pk"><rect x={400} y={170} width={620} height={760} rx={28} /></clipPath>
      <rect x={400} y={170} width={620} height={760} rx={28} fill="#1a2033" />
      <g clipPath="url(#pk)"><g transform="translate(470,200) scale(1.2)"><BerkayBas ifade={{ agiz: "gulumse", gozGul: 0.2 }} /></g></g>
      {/* tam boy pozlar */}
      {(["dur", "goster", "selam"] as const).map((p, j) => (
        <g key={p}>
          <rect x={1060 + j * 300} y={170} width={280} height={760} rx={28} fill="#1a2033" />
          <g transform={`translate(${1060 + j * 300 + 50},230) scale(0.52)`}>
            <BerkayTam poz={p} ifade={p === "selam" ? { agiz: "kocaGulumse", gozGul: 0.7, goz: 0.8 } : p === "goster" ? { agiz: "A", kas: 0.3, bakX: 0.7 } : { agiz: "gulumse" }} />
          </g>
          <Etiket x={1060 + j * 300 + 140} y={905} t={{ dur: "Duruş", goster: "Gösteriyor", selam: "Selam" }[p]} />
        </g>
      ))}
      {/* sağ sütun: tüm ifadeler */}
      <rect x={1980} y={170} width={380} height={760} rx={28} fill="#1a2033" />
      {IFADELER.map((e, j) => (
        <g key={e.ad + "s"}>
          <g transform={`translate(${1995 + (j % 2) * 180},${180 + Math.floor(j / 2) * 250}) scale(0.44)`}><BerkayBas ifade={e.i} govde={false} /></g>
          <Etiket x={2083 + (j % 2) * 180} y={395 + Math.floor(j / 2) * 250} t={e.ad} boy={22} />
        </g>
      ))}
      {/* vizemler */}
      <text x={60} y={1010} fill="#fff" fontSize={32} fontWeight={700} fontFamily="Poppins, Arial, sans-serif">Konuşma ağız şekilleri (ses klonuna senkron)</text>
      {VIZEMLER.map((z, j) => (
        <g key={z.v}>
          <rect x={60 + j * 290} y={1040} width={270} height={400} rx={24} fill="#1a2033" />
          <g transform={`translate(${60 + j * 290 - 25},1060) scale(0.8)`}>
            <svg x={0} y={0} width={400} height={440} viewBox="60 150 280 300" overflow="hidden"><BerkayBas ifade={{ agiz: z.v }} govde={false} /></svg>
          </g>
          <Etiket x={60 + j * 290 + 135} y={1420} t={z.ad} />
        </g>
      ))}
    </svg>
  </AbsoluteFill>
);
