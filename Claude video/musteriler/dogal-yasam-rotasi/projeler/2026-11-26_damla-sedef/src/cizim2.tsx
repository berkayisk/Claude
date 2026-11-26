// Damla sedef videosu için ek çizimler (aynı stil: koyu mor-lacivert kalın çizgi, düz renk)
import React from "react";
import { RENK } from "./cizim";
const SW = 7;
const C = RENK.cizgi;

/** Elif büstü (merkez alt 0,0). boğazTut: el boğazda; agri: boğazda kırmızı parıltı; yuz: "agri" | "saskin" | "rahat" */
export const Elif: React.FC<{ bogazTut?: boolean; agri?: number; yuz?: "agri" | "saskin" | "rahat"; goz?: number }> = ({ bogazTut = false, agri = 0, yuz = "rahat", goz = 1 }) => (
  <g>
    {/* gövde / kazak */}
    <path d="M-250 0 Q -240 -210 -100 -250 L 100 -250 Q 240 -210 250 0 Z" fill={RENK.teal} stroke={C} strokeWidth={SW} />
    <path d="M-70 -250 Q 0 -200 70 -250" fill="none" stroke={C} strokeWidth={SW} />
    {/* boyun */}
    <rect x={-42} y={-320} width={84} height={85} rx={20} fill={RENK.tenGolge} stroke={C} strokeWidth={SW} />
    {agri > 0 && <circle cx={0} cy={-280} r={50 + agri * 20} fill="#FF5A5A" opacity={0.25 + 0.35 * agri} />}
    {/* at kuyruğu */}
    <path d="M90 -470 Q 190 -420 160 -300 Q 150 -260 120 -280 Q 140 -380 80 -430 Z" fill="#6B3E26" stroke={C} strokeWidth={SW} />
    {/* kafa */}
    <ellipse cx={0} cy={-430} rx={120} ry={135} fill={RENK.ten} stroke={C} strokeWidth={SW} />
    {/* saç */}
    <path d="M-122 -440 Q -130 -560 0 -568 Q 125 -565 122 -440 Q 90 -520 0 -515 Q -80 -515 -122 -440 Z" fill="#6B3E26" stroke={C} strokeWidth={SW} />
    {/* gözler */}
    {[-45, 45].map((x) => (
      <g key={x}>
        <ellipse cx={x} cy={-430} rx={24} ry={yuz === "saskin" ? 28 : 24} fill="#fff" stroke={C} strokeWidth={5} />
        <ellipse cx={x + 3} cy={-428} rx={11} ry={12 * goz} fill={C} />
      </g>
    ))}
    {/* kaşlar */}
    {yuz === "agri" ? (
      <path d="M-70 -480 L -22 -468 M70 -480 L 22 -468" stroke={C} strokeWidth={7} strokeLinecap="round" />
    ) : yuz === "saskin" ? (
      <path d="M-70 -478 Q -45 -500 -20 -480 M70 -478 Q 45 -500 20 -480" fill="none" stroke={C} strokeWidth={7} strokeLinecap="round" />
    ) : (
      <path d="M-68 -470 Q -45 -482 -22 -470 M68 -470 Q 45 -482 22 -470" fill="none" stroke={C} strokeWidth={7} strokeLinecap="round" />
    )}
    {/* ağız */}
    {yuz === "agri" ? (
      <path d="M-30 -362 Q 0 -380 30 -362" fill="none" stroke={C} strokeWidth={7} strokeLinecap="round" />
    ) : yuz === "saskin" ? (
      <ellipse cx={0} cy={-365} rx={16} ry={20} fill="#7A2E3A" stroke={C} strokeWidth={5} />
    ) : (
      <path d="M-30 -372 Q 0 -348 30 -372" fill="none" stroke={C} strokeWidth={7} strokeLinecap="round" />
    )}
    <ellipse cx={-80} cy={-395} rx={18} ry={10} fill="#F2A3A0" opacity={0.6} />
    <ellipse cx={80} cy={-395} rx={18} ry={10} fill="#F2A3A0" opacity={0.6} />
    {/* el boğazda */}
    {bogazTut && (
      <g>
        <path d="M-200 0 Q -180 -150 -60 -230" fill="none" stroke={C} strokeWidth={70} strokeLinecap="round" />
        <path d="M-200 0 Q -180 -150 -60 -230" fill="none" stroke={RENK.teal} strokeWidth={56} strokeLinecap="round" />
        <ellipse cx={-30} cy={-275} rx={52} ry={38} fill={RENK.ten} stroke={C} strokeWidth={SW} />
      </g>
    )}
  </g>
);

/** Gövde (sırt/göğüs) silueti; lekeler: 0..1 kaç tanesi görünür (pop animasyonu dışarıda) */
export const DAMLALAR: [number, number, number][] = [
  [-120, -380, 22], [-40, -420, 16], [60, -400, 20], [140, -350, 15], [-160, -270, 18], [-60, -300, 24], [30, -290, 14],
  [120, -250, 22], [-110, -170, 15], [-10, -190, 20], [90, -150, 16], [170, -190, 12], [-170, -90, 20], [-60, -80, 14],
  [40, -60, 22], [140, -70, 15], [-120, 10, 16], [0, 20, 18], [100, 40, 14], [-200, -350, 12], [200, -300, 14],
];
export const Govde: React.FC<{ goster: number[] }> = ({ goster }) => (
  <g>
    <path d="M-260 260 L -250 -380 Q -240 -470 -140 -500 Q -60 -520 -40 -560 L 40 -560 Q 60 -520 140 -500 Q 240 -470 250 -380 L 260 260 Z" fill={RENK.ten} stroke={C} strokeWidth={SW} strokeLinejoin="round" />
    <rect x={-48} y={-640} width={96} height={100} rx={30} fill={RENK.tenGolge} stroke={C} strokeWidth={SW} />
    <path d="M0 -480 L 0 200" stroke={RENK.tenGolge} strokeWidth={6} opacity={0.5} />
    {DAMLALAR.map(([x, y, r], i) => {
      const s = goster[i] ?? 0;
      if (s <= 0) return null;
      return (
        <g key={i} transform={`translate(${x} ${y}) scale(${s})`}>
          <path d={`M0 ${-r * 1.25} Q ${r} ${-r * 0.2} ${r * 0.9} ${r * 0.35} A ${r * 0.92} ${r * 0.92} 0 0 1 ${-r * 0.9} ${r * 0.35} Q ${-r} ${-r * 0.2} 0 ${-r * 1.25} Z`} fill="#EE8E8B" stroke="#D06A68" strokeWidth={3} />
          <path d={`M${-r * 0.4} ${r * 0.1} q ${r * 0.4} -${r * 0.3} ${r * 0.8} 0`} fill="none" stroke="#fff" strokeWidth={3} strokeLinecap="round" opacity={0.85} />
        </g>
      );
    })}
  </g>
);

/** Streptokok: boncuk zinciri (merkez 0,0), t: zaman (kıpırdama) */
export const Bakteri: React.FC<{ t: number; n?: number; renk?: string }> = ({ t, n = 6, renk = "#7BC67E" }) => (
  <g>
    {Array.from({ length: n }).map((_, i) => {
      const x = (i - (n - 1) / 2) * 46;
      const y = Math.sin(t * 3 + i * 0.9) * 12;
      return (
        <g key={i}>
          <circle cx={x} cy={y} r={24} fill={renk} stroke={C} strokeWidth={5} />
          <circle cx={x - 7} cy={y - 7} r={6} fill="#fff" opacity={0.7} />
        </g>
      );
    })}
  </g>
);

/** Antikor (Y), merkez 0,0 */
export const Antikor: React.FC<{ renk?: string }> = ({ renk = "#FFD84D" }) => (
  <g stroke={C} strokeWidth={5} strokeLinecap="round" strokeLinejoin="round">
    <path d="M0 50 L 0 0 L -34 -42 M0 0 L 34 -42" fill="none" stroke={C} strokeWidth={22} />
    <path d="M0 50 L 0 0 L -34 -42 M0 0 L 34 -42" fill="none" stroke={renk} strokeWidth={12} />
  </g>
);

/** Cilt kesiti (yatay bant): üst epidermis, alt dermis; leke 0..1 */
export const CiltKesit: React.FC<{ w: number; leke: number }> = ({ w, leke }) => (
  <g>
    <rect x={-w / 2} y={0} width={w} height={70} fill="#F7D3B7" stroke={C} strokeWidth={SW} />
    <rect x={-w / 2} y={70} width={w} height={170} fill="#F2B9A0" stroke={C} strokeWidth={SW} />
    {Array.from({ length: 9 }).map((_, i) => (
      <circle key={i} cx={-w / 2 + 60 + i * ((w - 120) / 8)} cy={35} r={14} fill="#F9E2CF" stroke="#E2B49A" strokeWidth={3} />
    ))}
    <path d={`M${-w / 2 + 40} 150 q 60 -40 120 0 t 120 0 t 120 0 t 120 0 t 120 0`} fill="none" stroke="#E07A7A" strokeWidth={6} opacity={0.6} />
    {leke > 0 && (
      <g transform={`translate(0 0) scale(${leke})`}>
        <path d="M-90 0 Q -60 -60 0 -70 Q 60 -60 90 0 Z" fill="#EE8E8B" stroke="#D06A68" strokeWidth={5} />
        <path d="M-50 -30 q 25 -16 50 0 M5 -40 q 20 -12 40 0" fill="none" stroke="#fff" strokeWidth={5} strokeLinecap="round" />
      </g>
    )}
  </g>
);

/** İnsan ikonu, merkez alt 0,0 */
export const Kisi: React.FC<{ aktif?: boolean; olcek?: number; renk?: string }> = ({ aktif = false, olcek = 1, renk }) => {
  const f = renk ?? (aktif ? RENK.mor : "#CFC6DE");
  return (
    <g transform={`scale(${olcek})`}>
      <circle cx={0} cy={-150} r={42} fill={f} stroke={C} strokeWidth={6} />
      <path d="M-70 0 Q -70 -95 0 -100 Q 70 -95 70 0 Z" fill={f} stroke={C} strokeWidth={6} />
    </g>
  );
};

/** Takvim sayfası (merkez 0,0) */
export const Takvim: React.FC<{ metin: string; alt?: string; renk?: string }> = ({ metin, alt, renk = RENK.mor }) => (
  <g>
    <rect x={-130} y={-140} width={260} height={280} rx={30} fill="#fff" stroke={C} strokeWidth={SW} />
    <path d="M-130 -80 L -130 -110 Q -130 -140 -100 -140 L 100 -140 Q 130 -140 130 -110 L 130 -80 Z" fill={renk} stroke={C} strokeWidth={SW} />
    {[-70, 70].map((x) => <rect key={x} x={x - 12} y={-165} width={24} height={50} rx={12} fill="#C7BDD9" stroke={C} strokeWidth={5} />)}
    <text x={0} y={40} textAnchor="middle" fontFamily="'Baloo 2', sans-serif" fontWeight={800} fontSize={96} fill={C}>{metin}</text>
    {alt && <text x={0} y={105} textAnchor="middle" fontFamily="'Baloo 2', sans-serif" fontWeight={800} fontSize={40} fill={renk}>{alt}</text>}
  </g>
);

/** Halka grafik: oran 0..1 (merkez 0,0) */
export const Halka: React.FC<{ oran: number; r?: number; renk?: string; metin?: string }> = ({ oran, r = 200, renk = RENK.mor, metin }) => {
  const cevre = 2 * Math.PI * r;
  return (
    <g>
      <circle r={r} fill="none" stroke="#E6E0F0" strokeWidth={56} />
      <circle r={r} fill="none" stroke={renk} strokeWidth={56} strokeDasharray={`${cevre * oran} ${cevre}`} transform="rotate(-90)" strokeLinecap="round" />
      <circle r={r - 40} fill="#fff" stroke={C} strokeWidth={5} />
      <circle r={r + 40} fill="none" stroke={C} strokeWidth={5} />
      {metin && <text y={45} textAnchor="middle" fontFamily="'Baloo 2', sans-serif" fontWeight={800} fontSize={150} fill={C}>{metin}</text>}
    </g>
  );
};

/** Araştırma kartı (kaynak etiketi), merkez 0,0 */
export const KaynakKarti: React.FC<{ ust: string; alt: string }> = ({ ust, alt }) => (
  <g>
    <rect x={-400} y={-70} width={800} height={140} rx={30} fill="#fff" stroke={C} strokeWidth={6} />
    <rect x={-400} y={-70} width={130} height={140} rx={30} fill={RENK.mor} />
    <rect x={-300} y={-70} width={30} height={140} fill={RENK.mor} />
    {/* kitap/makale ikonu */}
    <g transform="translate(-335 0)" stroke="#fff" strokeWidth={6} fill="none" strokeLinecap="round">
      <rect x={-30} y={-38} width={60} height={76} rx={8} />
      <path d="M-16 -16 h32 M-16 2 h32 M-16 20 h20" />
    </g>
    <text x={-240} y={-10} fontFamily="'Baloo 2', sans-serif" fontWeight={800} fontSize={44} fill={C}>{ust}</text>
    <text x={-240} y={42} fontFamily="'Baloo 2', sans-serif" fontWeight={700} fontSize={32} fill="#6E6585">{alt}</text>
  </g>
);

/** Boğaz yakın planı: açık ağız, kızarık bademcikler (merkez 0,0) */
export const Bogaz: React.FC<{ kizariklik: number }> = ({ kizariklik }) => (
  <g>
    <defs><clipPath id="bogazKirp"><ellipse rx={300} ry={360} /></clipPath></defs>
    <g clipPath="url(#bogazKirp)">
    <ellipse rx={300} ry={360} fill="#5A1E2A" />
    <path d="M-300 -60 Q 0 -420 300 -60 L 300 -360 L -300 -360 Z" fill="#F4F0F0" stroke={C} strokeWidth={SW} opacity={0.95} />
    <ellipse cx={0} cy={-120} rx={34} ry={70} fill="#E8708A" stroke={C} strokeWidth={6} />
    {[-170, 170].map((x) => (
      <ellipse key={x} cx={x} cy={60} rx={80} ry={120} fill={`rgb(${220 + 35 * kizariklik},${120 - 60 * kizariklik},${130 - 60 * kizariklik})`} stroke={C} strokeWidth={6} />
    ))}
    <ellipse cx={0} cy={200} rx={180} ry={120} fill="#E35D78" stroke={C} strokeWidth={6} />
    {kizariklik > 0.5 && [[-180, 40], [-150, 90], [175, 30], [150, 100], [195, 80]].map(([x, y], i) => <circle key={i} cx={x} cy={y} r={9} fill="#FFF3C4" opacity={kizariklik} />)}
    </g>
    <ellipse rx={300} ry={360} fill="none" stroke={C} strokeWidth={SW + 2} />
  </g>
);
