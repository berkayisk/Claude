// Doğal Yaşam Rotası — 2D düz vektör çizimler (örnek videonun stili: koyu mor-lacivert kalın dış çizgi, düz renk, yumuşak gölge)
import React from "react";

export const RENK = {
  cizgi: "#2B2140",
  mor: "#481A78",
  morAcik: "#7B4FB5",
  ten: "#F4C9A6",
  tenGolge: "#E2AC85",
  tirnak: "#FBE4DA",
  tirnakAy: "#FFF4EE",
  mint: "#DFF2EC",
  krem: "#FFF6E9",
  mavi: "#DCEBFA",
  lila: "#ECE6F7",
  teal: "#2D9D98",
  turuncu: "#F2994A",
  beyaz: "#FFFFFF",
};
const SW = 7; // çizgi kalınlığı

export type TirnakTip = "normal" | "cukur" | "yag" | "kalkma" | "kalin";

/** Tek tırnak (yerel koordinat 0..w, 0..h) */
export const Tirnak: React.FC<{ w: number; h: number; tip: TirnakTip; sw?: number; kirinti?: number }> = ({ w, h, tip, sw = SW, kirinti = 0 }) => {
  const rx = w * 0.42;
  const id = `tc${w}${h}${tip}`;
  const govde = tip === "kalin" ? "#EFD9A6" : RENK.tirnak;
  return (
    <g>
      <defs>
        <clipPath id={id}>
          <rect x={0} y={0} width={w} height={h} rx={rx} />
        </clipPath>
      </defs>
      <rect x={0} y={0} width={w} height={h} rx={rx} fill={govde} />
      <g clipPath={`url(#${id})`}>
        {/* tırnak dibi ayı */}
        <ellipse cx={w / 2} cy={h * 1.02} rx={w * 0.36} ry={h * 0.2} fill={RENK.tirnakAy} opacity={tip === "kalin" ? 0.3 : 0.9} />
        {tip === "cukur" &&
          [
            [0.3, 0.3], [0.58, 0.24], [0.45, 0.46], [0.7, 0.5], [0.28, 0.62], [0.55, 0.7], [0.38, 0.84],
          ].map(([x, y], i) => (
            <g key={i}>
              <ellipse cx={w * x} cy={h * y} rx={w * 0.055} ry={w * 0.05} fill="#B88E83" />
              <ellipse cx={w * x - w * 0.012} cy={h * y - w * 0.012} rx={w * 0.03} ry={w * 0.025} fill="#8E6A62" opacity={0.6} />
            </g>
          ))}
        {tip === "yag" && (
          <>
            <ellipse cx={w * 0.52} cy={h * 0.5} rx={w * 0.27} ry={h * 0.2} fill="#F2B36E" opacity={0.85} />
            <ellipse cx={w * 0.52} cy={h * 0.5} rx={w * 0.16} ry={h * 0.12} fill="#E99A55" opacity={0.7} />
          </>
        )}
        {tip === "kalkma" && (
          <>
            <path d={`M0 ${h * 0.38} Q ${w * 0.25} ${h * 0.46} ${w * 0.5} ${h * 0.4} T ${w} ${h * 0.44} L ${w} 0 L 0 0 Z`} fill="#FFFFFF" />
            <path d={`M0 ${h * 0.38} Q ${w * 0.25} ${h * 0.46} ${w * 0.5} ${h * 0.4} T ${w} ${h * 0.44}`} fill="none" stroke="#D8C4BC" strokeWidth={sw * 0.6} />
          </>
        )}
        {tip === "kalin" &&
          [0.25, 0.42, 0.58, 0.74].map((y, i) => (
            <path key={i} d={`M${w * 0.08} ${h * y} Q ${w * 0.5} ${h * (y + 0.05)} ${w * 0.92} ${h * y}`} fill="none" stroke="#C9AE74" strokeWidth={sw * 0.6} strokeLinecap="round" />
          ))}
        {/* parlama */}
        <ellipse cx={w * 0.3} cy={h * 0.22} rx={w * 0.1} ry={h * 0.07} fill="#FFFFFF" opacity={0.75} />
      </g>
      <rect x={0} y={0} width={w} height={h} rx={rx} fill="none" stroke={RENK.cizgi} strokeWidth={sw} />
      {tip === "kalin" &&
        Array.from({ length: 5 }).map((_, i) => (
          <rect key={i} x={w * (0.15 + i * 0.17)} y={h + 10 + kirinti * (40 + i * 25)} width={w * 0.07} height={w * 0.05} rx={3} fill="#EFD9A6" stroke={RENK.cizgi} strokeWidth={sw * 0.4} opacity={kirinti > 0 ? Math.max(0, 1 - kirinti * 0.8) : 0} transform={`rotate(${i * 30} ${w * (0.15 + i * 0.17)} ${h})`} />
        ))}
    </g>
  );
};

/** Elin sırtı, parmaklar yukarı (yerel kutu ~600x940). tirnaklar: [işaret, orta, yüzük, serçe, başparmak] */
export const El: React.FC<{ tirnaklar?: TirnakTip[]; ten?: string; seffaf?: boolean; eklemParla?: number }> = ({
  tirnaklar = ["normal", "normal", "normal", "normal", "normal"],
  ten = RENK.ten,
  seffaf = false,
  eklemParla = 0,
}) => {
  const parmak = [
    { x: 150, y: 130, w: 92, h: 420 },
    { x: 252, y: 60, w: 96, h: 480 },
    { x: 358, y: 105, w: 92, h: 440 },
    { x: 458, y: 215, w: 80, h: 340 },
  ];
  const avuc = "M150 470 Q 140 760 210 900 L 470 900 Q 560 760 540 470 Z";
  const bas = "M170 640 Q 90 600 60 470 Q 45 400 100 385 Q 150 380 175 470 Q 190 540 230 590 Z";
  const sekiller = (props: React.SVGProps<SVGElement>) => (
    <>
      {parmak.map((p, i) => (
        <rect key={i} x={p.x} y={p.y} width={p.w} height={p.h} rx={p.w / 2} {...(props as any)} />
      ))}
      <path d={avuc} {...(props as any)} />
      <path d={bas} {...(props as any)} />
    </>
  );
  const dolgu = seffaf ? "rgba(170,210,255,0.35)" : ten;
  const cizgi = seffaf ? "#7FB2E8" : RENK.cizgi;
  return (
    <g>
      {/* birleşik dış çizgi: önce kalın çizgi, üstüne dolgu */}
      <g>{sekiller({ fill: "none", stroke: cizgi, strokeWidth: SW * 2, strokeLinejoin: "round" } as any)}</g>
      <g>{sekiller({ fill: dolgu, stroke: "none" } as any)}</g>
      {!seffaf && (
        <>
          {/* boğum çizgileri */}
          {parmak.map((p, i) => (
            <g key={i} stroke={RENK.tenGolge} strokeWidth={5} strokeLinecap="round" fill="none">
              <path d={`M${p.x + p.w * 0.3} ${p.y + p.h * 0.42} q ${p.w * 0.2} 8 ${p.w * 0.4} 0`} />
              <path d={`M${p.x + p.w * 0.28} ${p.y + p.h * 0.7} q ${p.w * 0.22} 10 ${p.w * 0.44} 0`} />
            </g>
          ))}
          <path d="M210 900 L 470 900 Q 470 860 440 840 L 240 840 Q 210 860 210 900Z" fill={RENK.tenGolge} opacity={0.5} />
        </>
      )}
      {seffaf && (
        // kemikler + eklemler
        <g>
          {parmak.map((p, i) => {
            const cx = p.x + p.w / 2;
            const ekl = [p.y + p.h * 0.3, p.y + p.h * 0.58, p.y + p.h * 0.88];
            return (
              <g key={i}>
                <line x1={cx} y1={p.y + 40} x2={cx} y2={p.y + p.h + 80} stroke="#EAF4FF" strokeWidth={22} strokeLinecap="round" opacity={0.9} />
                {ekl.map((y, j) => (
                  <g key={j}>
                    <circle cx={cx} cy={y} r={26 + (j === 0 ? eklemParla * 10 : 0)} fill={j === 0 ? `rgba(242,153,74,${0.25 + eklemParla * 0.6})` : "rgba(255,255,255,0.15)"} />
                    <circle cx={cx} cy={y} r={14} fill={j === 0 ? `rgba(242,153,74,${0.5 + eklemParla * 0.5})` : "#EAF4FF"} />
                  </g>
                ))}
              </g>
            );
          })}
        </g>
      )}
      {/* tırnaklar */}
      {parmak.map((p, i) => (
        <g key={i} transform={`translate(${p.x + 14} ${p.y + 18})`}>
          <Tirnak w={p.w - 28} h={p.w * 0.95} tip={tirnaklar[i]} />
        </g>
      ))}
      <g transform="translate(66 400) rotate(-28 40 40)">
        <Tirnak w={70} h={66} tip={tirnaklar[4]} />
      </g>
    </g>
  );
};

/** Büyüteç: merkez (0,0), r yarıçap, içine çocuk çizim */
export const Buyutec: React.FC<{ r: number; children?: React.ReactNode; id: string }> = ({ r, children, id }) => (
  <g>
    <line x1={r * 0.7} y1={r * 0.7} x2={r * 1.55} y2={r * 1.55} stroke={RENK.cizgi} strokeWidth={r * 0.26} strokeLinecap="round" />
    <line x1={r * 0.95} y1={r * 0.95} x2={r * 1.5} y2={r * 1.5} stroke="#8D5A3B" strokeWidth={r * 0.16} strokeLinecap="round" />
    <defs>
      <clipPath id={id}>
        <circle cx={0} cy={0} r={r} />
      </clipPath>
    </defs>
    <circle cx={0} cy={0} r={r} fill="#F7FBFF" />
    <g clipPath={`url(#${id})`}>{children}</g>
    <circle cx={0} cy={0} r={r} fill="none" stroke={RENK.cizgi} strokeWidth={r * 0.1} />
    <circle cx={0} cy={0} r={r * 0.9} fill="none" stroke="#C9D6E6" strokeWidth={r * 0.05} />
    <path d={`M${-r * 0.55} ${-r * 0.35} A ${r * 0.65} ${r * 0.65} 0 0 1 ${-r * 0.2} ${-r * 0.62}`} fill="none" stroke="#FFFFFF" strokeWidth={r * 0.08} strokeLinecap="round" opacity={0.9} />
  </g>
);

/** Küçük el ikonu (ızgara için), merkez 0,0 */
export const ElIkon: React.FC<{ aktif: number }> = ({ aktif }) => {
  const renk = aktif > 0 ? RENK.mor : "#C7BDD9";
  return (
    <g>
      {[[-44, -40, 34], [-14, -60, 34], [16, -50, 34], [44, -26, 28]].map(([x, y, w], i) => (
        <rect key={i} x={x - w / 2} y={y} width={w} height={90} rx={w / 2} fill={aktif > 0 ? "#F4C9A6" : "#E9E2F2"} stroke={renk} strokeWidth={6} />
      ))}
      <rect x={-62} y={0} width={124} height={100} rx={40} fill={aktif > 0 ? "#F4C9A6" : "#E9E2F2"} stroke={renk} strokeWidth={6} />
      {[[-44, -40, 34], [-14, -60, 34], [16, -50, 34], [44, -26, 28]].map(([x, y, w], i) => (
        <rect key={i} x={x - w / 2 + 7} y={y + 7} width={w - 14} height={22} rx={10} fill={aktif > 0 ? "#B88E83" : "#FFFFFF"} opacity={0.9} />
      ))}
    </g>
  );
};

/** Dirsek + pullu plak (yumuşak, iğrenç değil) */
export const Dirsek: React.FC = () => (
  <g>
    <path d="M-330 60 Q -60 40 20 -40 Q 80 -110 60 -330 L 200 -330 Q 230 -60 120 70 Q 40 170 -330 200 Z" fill={RENK.ten} stroke={RENK.cizgi} strokeWidth={SW} strokeLinejoin="round" />
    <path d="M-330 60 Q -60 40 20 -40" fill="none" stroke={RENK.tenGolge} strokeWidth={6} opacity={0.6} />
    <ellipse cx={70} cy={60} rx={95} ry={70} fill="#F0A3A0" stroke="#D97E7C" strokeWidth={5} />
    {[[40, 35], [85, 45], [60, 80], [105, 85], [30, 75], [75, 15]].map(([x, y], i) => (
      <path key={i} d={`M${x - 16} ${y} q 16 -12 32 0`} fill="none" stroke="#FFFFFF" strokeWidth={6} strokeLinecap="round" />
    ))}
  </g>
);

/** Doktor (büst), merkez alt 0,0 */
export const Doktor: React.FC<{ agiz?: number; goz?: number }> = ({ agiz = 0, goz = 1 }) => (
  <g>
    {/* önlük */}
    <path d="M-260 0 Q -250 -230 -110 -270 L 110 -270 Q 250 -230 260 0 Z" fill="#FFFFFF" stroke={RENK.cizgi} strokeWidth={SW} />
    <path d="M-60 -270 L 0 -150 L 60 -270" fill="#9FC9E8" stroke={RENK.cizgi} strokeWidth={SW} strokeLinejoin="round" />
    <path d="M0 -150 L -14 -60 L 0 -40 L 14 -60 Z" fill="#2D6E8A" stroke={RENK.cizgi} strokeWidth={5} />
    <path d="M-110 -270 L -40 -120 L -20 0" fill="none" stroke={RENK.cizgi} strokeWidth={SW} />
    <path d="M110 -270 L 40 -120 L 20 0" fill="none" stroke={RENK.cizgi} strokeWidth={SW} />
    <path d="M-90 -250 Q -150 -120 -60 -80" fill="none" stroke="#5B6474" strokeWidth={9} strokeLinecap="round" />
    <circle cx={-60} cy={-80} r={16} fill="#B9C2CF" stroke={RENK.cizgi} strokeWidth={5} />
    {/* boyun + kafa */}
    <rect x={-40} y={-320} width={80} height={70} fill={RENK.tenGolge} stroke={RENK.cizgi} strokeWidth={SW} />
    <ellipse cx={0} cy={-440} rx={135} ry={150} fill={RENK.ten} stroke={RENK.cizgi} strokeWidth={SW} />
    {/* yan saçlar */}
    <path d="M-132 -470 Q -150 -390 -110 -350 Q -100 -420 -120 -470 Z" fill="#E6E6EE" stroke={RENK.cizgi} strokeWidth={5} />
    <path d="M132 -470 Q 150 -390 110 -350 Q 100 -420 120 -470 Z" fill="#E6E6EE" stroke={RENK.cizgi} strokeWidth={5} />
    {/* sakal */}
    <path d="M-110 -420 Q -120 -300 0 -280 Q 120 -300 110 -420 Q 80 -360 0 -360 Q -80 -360 -110 -420 Z" fill="#F1F1F6" stroke={RENK.cizgi} strokeWidth={5} />
    <path d="M-50 -385 Q 0 -405 50 -385" fill="none" stroke="#D6D6E0" strokeWidth={12} strokeLinecap="round" />
    {/* ağız */}
    <ellipse cx={0} cy={-350} rx={26} ry={6 + agiz * 14} fill="#7A2E3A" stroke={RENK.cizgi} strokeWidth={4} />
    {/* gözlük + gözler */}
    {[-52, 52].map((x) => (
      <g key={x}>
        <circle cx={x} cy={-460} r={40} fill="#FFFFFF" stroke={RENK.cizgi} strokeWidth={8} />
        <ellipse cx={x + 4} cy={-458} rx={11} ry={12 * goz} fill={RENK.cizgi} />
      </g>
    ))}
    <line x1={-12} y1={-462} x2={12} y2={-462} stroke={RENK.cizgi} strokeWidth={7} />
    <path d="M-70 -515 q 20 -10 40 0 M30 -515 q 20 -10 40 0" fill="none" stroke="#D6D6E0" strokeWidth={9} strokeLinecap="round" />
    <path d="M-12 -430 q 12 18 24 0" fill="none" stroke={RENK.tenGolge} strokeWidth={6} strokeLinecap="round" />
  </g>
);

/** Telefon (merkez 0,0) */
export const Telefon: React.FC<{ children?: React.ReactNode }> = ({ children }) => (
  <g>
    <rect x={-230} y={-430} width={460} height={860} rx={60} fill="#3A3150" stroke={RENK.cizgi} strokeWidth={SW} />
    <rect x={-205} y={-395} width={410} height={790} rx={40} fill="#F7F5FB" />
    <rect x={-60} y={-415} width={120} height={20} rx={10} fill="#2B2140" />
    {children}
  </g>
);

export const KagitUcak: React.FC = () => (
  <g>
    <path d="M-60 0 L 70 -50 L 20 60 L 5 15 Z" fill="#FFFFFF" stroke={RENK.cizgi} strokeWidth={6} strokeLinejoin="round" />
    <path d="M5 15 L 70 -50" stroke={RENK.cizgi} strokeWidth={5} />
  </g>
);

/** Arka plan: pastel zemin + bulanık yuvarlak şekiller (derinlik) */
export const ArkaPlan: React.FC<{ renk: string; vurgu?: string; t: number; koyu?: boolean }> = ({ renk, vurgu = "#FFFFFF", t, koyu }) => (
  <svg width={1080} height={1920} style={{ position: "absolute" }}>
    <defs>
      <radialGradient id={`vin${renk}`} cx="50%" cy="45%" r="75%">
        <stop offset="60%" stopColor={renk} />
        <stop offset="100%" stopColor={koyu ? "#0E0B1C" : "#BFD3CF"} />
      </radialGradient>
    </defs>
    <rect width={1080} height={1920} fill={`url(#vin${renk})`} />
    <g style={{ filter: "blur(28px)" }} opacity={koyu ? 0.15 : 0.55}>
      <circle cx={160 + 20 * Math.sin(t)} cy={380} r={170} fill={vurgu} />
      <circle cx={930} cy={720 + 25 * Math.cos(t * 0.8)} r={210} fill={vurgu} />
      <circle cx={260} cy={1550} r={230} fill={vurgu} />
      <rect x={760} y={1380 + 15 * Math.sin(t * 0.6)} width={260} height={330} rx={60} fill={vurgu} />
    </g>
  </svg>
);
