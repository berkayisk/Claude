// Gece kaşıntısı videosu çizimleri (aynı stil)
import React from "react";
import { RENK } from "./cizim";
const C = RENK.cizgi;
const SW = 7;
const FONT = "'Baloo 2', sans-serif";

/** Ay + yıldızlar (merkez 0,0), t zaman */
export const Ay: React.FC<{ t: number; r?: number }> = ({ t, r = 110 }) => (
  <g>
    <circle r={r * 1.6} fill="#FFF3C4" opacity={0.12 + 0.05 * Math.sin(t * 2)} />
    <circle r={r} fill="#FFF3C4" stroke={C} strokeWidth={SW} />
    <circle cx={r * 0.45} cy={-r * 0.25} r={r * 0.82} fill="#2A2150" />
    {[[-r * 0.3, r * 0.2, 10], [-r * 0.5, -r * 0.35, 7]].map(([x, y, rr], i) => <circle key={i} cx={x} cy={y} r={rr} fill="#EAD9A0" />)}
  </g>
);
export const Yildizlar: React.FC<{ t: number }> = ({ t }) => (
  <g>
    {[[120, 260], [300, 160], [520, 300], [760, 180], [960, 320], [200, 520], [880, 560], [640, 120], [420, 470]].map(([x, y], i) => {
      const s = 0.6 + 0.4 * Math.sin(t * 3 + i * 1.7);
      return <path key={i} transform={`translate(${x} ${y}) scale(${s})`} d="M0 -16 L 4 -4 L 16 0 L 4 4 L 0 16 L -4 4 L -16 0 L -4 -4 Z" fill="#FFF3C4" />;
    })}
  </g>
);

/** Yatakta yatan Elif (merkez 0,0); kasi: kol kaşıma açısı (-1..1), goz: 0 kapalı – 1 açık */
export const YataktaElif: React.FC<{ kasi: number; goz: number }> = ({ kasi, goz }) => (
  <g>
    {/* yatak */}
    <rect x={-440} y={40} width={880} height={170} rx={30} fill="#8A5A3C" stroke={C} strokeWidth={SW} />
    <rect x={-420} y={-30} width={840} height={110} rx={40} fill="#F7F3FF" stroke={C} strokeWidth={SW} />
    {/* yastık */}
    <ellipse cx={-280} cy={-50} rx={140} ry={60} fill="#FFFFFF" stroke={C} strokeWidth={SW} />
    {/* baş */}
    <g transform="translate(-270 -95)">
      <ellipse rx={88} ry={95} fill={RENK.ten} stroke={C} strokeWidth={SW} />
      <path d="M-90 -10 Q -95 -110 0 -112 Q 95 -110 90 -10 Q 60 -80 0 -78 Q -60 -78 -90 -10 Z" fill="#6B3E26" stroke={C} strokeWidth={SW} />
      {[-32, 32].map((x) => goz < 0.3
        ? <path key={x} d={`M${x - 16} 0 q 16 10 32 0`} fill="none" stroke={C} strokeWidth={6} strokeLinecap="round" />
        : <g key={x}><ellipse cx={x} cy={0} rx={18} ry={18 * goz} fill="#fff" stroke={C} strokeWidth={5} /><circle cx={x + 2} cy={2} r={8} fill={C} /></g>)}
      <path d="M-40 -32 L -14 -24 M40 -32 L 14 -24" stroke={C} strokeWidth={6} strokeLinecap="round" opacity={goz > 0.3 ? 1 : 0} />
      <path d="M-18 48 q 18 -10 36 0" fill="none" stroke={C} strokeWidth={6} strokeLinecap="round" />
    </g>
    {/* yorgan */}
    <path d="M-170 -60 Q 0 -110 420 -40 L 420 90 L -170 90 Z" fill={RENK.teal} stroke={C} strokeWidth={SW} strokeLinejoin="round" />
    <path d="M-100 -40 Q 100 -60 380 -20" fill="none" stroke="#3FB5AF" strokeWidth={10} strokeLinecap="round" />
    {/* kaşıyan kol */}
    <g transform={`translate(-100 -70) rotate(${-20 + kasi * 14})`}>
      <path d="M0 0 Q 90 -60 170 -20" fill="none" stroke={C} strokeWidth={46} strokeLinecap="round" />
      <path d="M0 0 Q 90 -60 170 -20" fill="none" stroke={RENK.ten} strokeWidth={32} strokeLinecap="round" />
      <circle cx={178} cy={-18} r={26} fill={RENK.ten} stroke={C} strokeWidth={6} />
    </g>
    {/* kaşıntı çizgileri */}
    {[0, 1, 2].map((i) => (
      <path key={i} d={`M${120 + i * 40} ${-120 - i * 10} l 18 -24 l 18 24 l 18 -24`} fill="none" stroke="#FF5A5A" strokeWidth={8} strokeLinecap="round" strokeLinejoin="round" opacity={(Math.sin(kasi * 3 + i) + 1) / 2} />
    ))}
  </g>
);

/** 24 saatlik kadran (merkez 0,0); vurgu: [başlangıç saati, bitiş saati], p: vurgu dolumu 0..1, akrep: saat (0–24) */
export const Saat24: React.FC<{ r?: number; vurgu?: [number, number]; p?: number; akrep?: number }> = ({ r = 260, vurgu, p = 0, akrep }) => {
  const aci = (h: number) => (h / 24) * 2 * Math.PI - Math.PI / 2;
  const dilim = () => {
    if (!vurgu) return null;
    const [a, b] = vurgu; const son = a + (b - a) * p;
    if (p <= 0) return null;
    const x1 = Math.cos(aci(a)) * r, y1 = Math.sin(aci(a)) * r, x2 = Math.cos(aci(son)) * r, y2 = Math.sin(aci(son)) * r;
    const buyuk = son - a > 12 ? 1 : 0;
    return <path d={`M0 0 L ${x1} ${y1} A ${r} ${r} 0 ${buyuk} 1 ${x2} ${y2} Z`} fill="#FF6B6B" opacity={0.85} />;
  };
  return (
    <g>
      <circle r={r + 30} fill="#fff" stroke={C} strokeWidth={SW + 2} />
      {/* gece yarısı (koyu) / gündüz (açık) yarım daireler */}
      <path d={`M0 0 L ${Math.cos(aci(18)) * r} ${Math.sin(aci(18)) * r} A ${r} ${r} 0 0 1 ${Math.cos(aci(6)) * r} ${Math.sin(aci(6)) * r} Z`} fill="#E6E3F5" />
      {dilim()}
      {Array.from({ length: 24 }).map((_, h) => {
        const a = aci(h); const uz = h % 6 === 0;
        return <line key={h} x1={Math.cos(a) * (r - (uz ? 34 : 18))} y1={Math.sin(a) * (r - (uz ? 34 : 18))} x2={Math.cos(a) * r} y2={Math.sin(a) * r} stroke={C} strokeWidth={uz ? 8 : 4} />;
      })}
      {[0, 6, 12, 18].map((h) => (
        <text key={h} x={Math.cos(aci(h)) * (r - 75)} y={Math.sin(aci(h)) * (r - 75) + 18} textAnchor="middle" fontFamily={FONT} fontWeight={800} fontSize={48} fill={C}>{String(h).padStart(2, "0")}</text>
      ))}
      {akrep !== undefined && <line x1={0} y1={0} x2={Math.cos(aci(akrep)) * (r - 60)} y2={Math.sin(aci(akrep)) * (r - 60)} stroke={RENK.mor} strokeWidth={16} strokeLinecap="round" />}
      <circle r={18} fill={RENK.mor} stroke={C} strokeWidth={5} />
    </g>
  );
};

/** Gün içi eğri grafiği (temsili): x 0–24 saat; deger(h) 0..1; p çizim ilerlemesi */
export const GunEgrisi: React.FC<{ w: number; h: number; p: number; deger: (s: number) => number; renk?: string; etiket?: string }> = ({ w, h, p, deger, renk = RENK.mor, etiket }) => {
  const nok = Array.from({ length: 49 }).map((_, i) => { const s = i / 2; return [(s / 24) * w, h - deger(s) * h] as const; });
  const n = Math.max(2, Math.round(nok.length * p));
  const d = nok.slice(0, n).map(([x, y], i) => `${i ? "L" : "M"}${x.toFixed(1)} ${y.toFixed(1)}`).join(" ");
  return (
    <g>
      <rect x={-30} y={-30} width={w + 60} height={h + 110} rx={30} fill="#fff" stroke={C} strokeWidth={6} />
      <rect x={(18 / 24) * w} y={-10} width={(6 / 24) * w} height={h + 10} fill="#2A2150" opacity={0.12} />
      <line x1={0} y1={h} x2={w} y2={h} stroke={C} strokeWidth={5} />
      {[0, 6, 12, 18, 24].map((s) => <text key={s} x={(s / 24) * w} y={h + 55} textAnchor="middle" fontFamily={FONT} fontWeight={800} fontSize={38} fill={C}>{String(s).padStart(2, "0")}</text>)}
      <path d={d} fill="none" stroke={renk} strokeWidth={14} strokeLinecap="round" strokeLinejoin="round" />
      {n > 1 && <circle cx={nok[n - 1][0]} cy={nok[n - 1][1]} r={18} fill={renk} stroke={C} strokeWidth={5} />}
      {etiket && <text x={14} y={20} fontFamily={FONT} fontWeight={800} fontSize={40} fill={renk}>{etiket}</text>}
      <text x={w} y={20} textAnchor="end" fontFamily={FONT} fontWeight={700} fontSize={28} fill="#8C84A3">temsili</text>
    </g>
  );
};

/** Yorum balonu (merkez 0,0) */
export const YorumBalonu: React.FC<{ secim: number }> = ({ secim }) => (
  <g>
    <path d="M-380 -200 Q -380 -260 -320 -260 L 320 -260 Q 380 -260 380 -200 L 380 120 Q 380 180 320 180 L -120 180 L -220 270 L -200 180 L -320 180 Q -380 180 -380 120 Z" fill="#fff" stroke={C} strokeWidth={SW + 1} strokeLinejoin="round" />
    {[["🌙", "GECE", -170, RENK.mor], ["☀", "GÜNDÜZ", 170, "#F2994A"]].map(([ik, m, x, renk], i) => {
      const s = secim === i ? 1.12 : 1;
      return (
        <g key={i} transform={`translate(${x} -40) scale(${s})`}>
          <rect x={-150} y={-120} width={300} height={240} rx={36} fill={secim === i ? (renk as string) : "#F2EEF8"} stroke={C} strokeWidth={6} />
          {i === 0 ? (
            <g transform="translate(0 -35)"><circle r={42} fill="#FFF3C4" stroke={C} strokeWidth={5} /><circle cx={18} cy={-12} r={36} fill={secim === i ? (renk as string) : "#F2EEF8"} /></g>
          ) : (
            <g transform="translate(0 -35)">
              {Array.from({ length: 8 }).map((_, k) => <line key={k} x1={Math.cos(k * Math.PI / 4) * 50} y1={Math.sin(k * Math.PI / 4) * 50} x2={Math.cos(k * Math.PI / 4) * 66} y2={Math.sin(k * Math.PI / 4) * 66} stroke={secim === i ? "#fff" : "#F2994A"} strokeWidth={8} strokeLinecap="round" />)}
              <circle r={38} fill="#FFD84D" stroke={C} strokeWidth={5} />
            </g>
          )}
          <text y={85} textAnchor="middle" fontFamily={FONT} fontWeight={800} fontSize={54} fill={secim === i ? "#fff" : C}>{m}</text>
        </g>
      );
    })}
  </g>
);
