import React from "react";

// Berkay — hesabın rehber karakteri. Modern düz (flat) stil, hafif chibi oran (büyük baş).
// Referans: referanslar/berkay_ref.png — kısa koyu saç (şakaklarda hafif açıklık, yanlar kısa),
// kalın düz kaşlar, kahverengi gözler, kısa dolgun sakal + bıyık, lacivert yarım fermuarlı yakalı kazak, altında beyaz tişört.
// Baş yerel koordinatı: 400 x 440 (merkez x=200). Omuz/gövde 440'tan aşağı.

export const R = {
  ten: "#dcaa86",
  tenGolge: "#c08f6c",
  tenKoyu: "#a9795a",
  yanak: "#e08f78",
  sac: "#1f1815",
  sacParlak: "#3a2d27",
  sakal: "#2a201b",
  kas: "#1c1512",
  goz: "#5a3a26",
  dudak: "#b8706a",
  agizIc: "#5e2a2a",
  dis: "#f4f1ec",
  kazak: "#1f2638",
  kazakGolge: "#161b29",
  kazakParlak: "#2c3550",
  tisort: "#f2efe9",
  fermuar: "#a7adb8",
  pantolon: "#2b2f38",
  pantolonGolge: "#22252c",
  ayakkabi: "#f4f4f2",
  taban: "#cfd2d6",
  cizgi: "#2a1d17",
};

// Konuşma ağız şekilleri (vizem). Ses klonundaki fonemlere eşlenecek.
export type Vizem = "X" | "A" | "E" | "I" | "O" | "U" | "M" | "F" | "gulumse" | "kocaGulumse" | "sasir" | "duz";

export type Ifade = {
  kas?: number;      // -1 indir .. 1 kaldır
  kasAci?: number;   // -1 endişeli (iç uç yukarı) .. 1 çatık
  goz?: number;      // 0 kapalı .. 1 açık
  gozGul?: number;   // 0..1 gülen göz (alt kapak kalkar)
  bakX?: number;     // -1..1
  bakY?: number;     // -1..1
  agiz?: Vizem;
  egim?: number;     // baş eğimi (derece)
  yanak?: number;    // 0..1 kızarma
};

const YUZ = "M72,206 C72,112 128,66 200,66 C272,66 328,112 328,206 C328,292 314,344 284,374 C258,400 230,410 200,410 C170,410 142,400 116,374 C86,344 72,292 72,206 Z";
// sakal bölgesi: favoriden çene hattına, yanak çizgisi + bıyık
const SAKAL = "M78,236 C80,302 98,350 122,378 C148,402 172,414 200,414 C228,414 252,402 278,378 C302,350 320,302 322,236 C316,276 304,306 284,322 C268,332 254,330 246,322 C236,312 222,308 200,308 C178,308 164,312 154,322 C146,330 132,332 116,322 C96,306 84,276 78,236 Z";
// bıyık ve dudak altı
const BIYIK = "M160,322 C172,310 188,308 200,312 C212,308 228,310 240,322 C232,326 222,326 212,324 C206,323 202,325 200,326 C198,325 194,323 188,324 C178,326 168,326 160,322 Z";

const Agiz: React.FC<{ v: Vizem; k: string }> = ({ v, k }) => {
  const y = 338;
  const ic = (d: string, dis = true, dil = false) => (
    <g>
      <clipPath id={`${k}agz`}><path d={d} /></clipPath>
      <path d={d} fill={R.agizIc} />
      <g clipPath={`url(#${k}agz)`}>
        {dis ? <rect x={150} y={y - 40} width={100} height={46} rx={6} fill={R.dis} transform={`translate(0,${-3})`} /> : null}
        {dil ? <ellipse cx={200} cy={y + 30} rx={26} ry={14} fill="#c46a68" /> : null}
      </g>
      <path d={d} fill="none" stroke={R.cizgi} strokeWidth={4} strokeLinejoin="round" />
    </g>
  );
  switch (v) {
    case "X": case "duz":
      return <path d={`M176,${y} Q200,${y + 3} 224,${y}`} stroke={R.cizgi} strokeWidth={5} fill="none" strokeLinecap="round" />;
    case "gulumse":
      return <g>
        <path d={`M170,${y - 4} Q200,${y + 14} 230,${y - 4}`} stroke={R.cizgi} strokeWidth={5} fill="none" strokeLinecap="round" />
        <path d={`M166,${y - 7} Q169,${y - 3} 171,${y - 1}`} stroke={R.cizgi} strokeWidth={3.5} fill="none" strokeLinecap="round" />
        <path d={`M234,${y - 7} Q231,${y - 3} 229,${y - 1}`} stroke={R.cizgi} strokeWidth={3.5} fill="none" strokeLinecap="round" />
      </g>;
    case "kocaGulumse":
      return ic(`M164,${y - 8} Q200,${y - 2} 236,${y - 8} Q230,${y + 28} 200,${y + 30} Q170,${y + 28} 164,${y - 8} Z`, true, true);
    case "A":
      return ic(`M174,${y - 6} Q200,${y - 10} 226,${y - 6} Q228,${y + 30} 200,${y + 34} Q172,${y + 30} 174,${y - 6} Z`, true, true);
    case "E":
      return ic(`M168,${y - 4} Q200,${y - 8} 232,${y - 4} Q226,${y + 16} 200,${y + 18} Q174,${y + 16} 168,${y - 4} Z`, true, false);
    case "I":
      return ic(`M172,${y - 2} Q200,${y - 5} 228,${y - 2} Q224,${y + 9} 200,${y + 10} Q176,${y + 9} 172,${y - 2} Z`, true, false);
    case "O":
      return ic(`M186,${y - 6} Q200,${y - 12} 214,${y - 6} Q222,${y + 12} 214,${y + 26} Q200,${y + 32} 186,${y + 26} Q178,${y + 12} 186,${y - 6} Z`, false, true);
    case "U":
      return ic(`M191,${y - 2} Q200,${y - 6} 209,${y - 2} Q214,${y + 8} 209,${y + 16} Q200,${y + 20} 191,${y + 16} Q186,${y + 8} 191,${y - 2} Z`, false, false);
    case "M":
      return <g>
        <path d={`M178,${y + 1} Q200,${y - 2} 222,${y + 1}`} stroke={R.cizgi} strokeWidth={6} fill="none" strokeLinecap="round" />
        <path d={`M186,${y + 7} Q200,${y + 10} 214,${y + 7}`} stroke={R.dudak} strokeWidth={4} fill="none" strokeLinecap="round" opacity={0.8} />
      </g>;
    case "F":
      return <g>
        <path d={`M176,${y - 2} Q200,${y - 6} 224,${y - 2} L222,${y + 6} Q200,${y + 8} 178,${y + 6} Z`} fill={R.dis} stroke={R.cizgi} strokeWidth={4} strokeLinejoin="round" />
        <path d={`M180,${y + 8} Q200,${y + 13} 220,${y + 8}`} stroke={R.dudak} strokeWidth={5} fill="none" strokeLinecap="round" />
      </g>;
    case "sasir":
      return ic(`M188,${y - 4} Q200,${y - 8} 212,${y - 4} Q218,${y + 10} 212,${y + 22} Q200,${y + 27} 188,${y + 22} Q182,${y + 10} 188,${y - 4} Z`, false, false);
  }
};

export const BerkayBas: React.FC<{ ifade?: Ifade; kirp?: number; govde?: boolean }> = ({ ifade = {}, kirp = 1, govde = true }) => {
  const { kas = 0, kasAci = 0, goz = 1, gozGul = 0, bakX = 0, bakY = 0, agiz = "gulumse", egim = 0, yanak = 0 } = ifade;
  const k = React.useId().replace(/[^a-zA-Z0-9]/g, "");
  const ac = Math.max(0.05, goz * kirp);
  const gozY = 236;
  const Goz = ({ cx, sag }: { cx: number; sag: boolean }) => {
    const ry = 14 * ac, rx = 21;
    const alt = gozY + ry - gozGul * ry * 1.1;
    const kid = `${k}gz${sag ? "s" : "l"}`;
    const ix = cx + bakX * 7, iy = gozY + bakY * 5;
    const sekil = `M${cx - rx},${gozY} Q${cx - rx * 0.4},${gozY - ry * 1.25} ${cx + rx * 0.2},${gozY - ry * 1.15} Q${cx + rx * 0.8},${gozY - ry * 0.9} ${cx + rx},${gozY + 1} Q${cx},${alt + ry * 0.35} ${cx - rx},${gozY} Z`;
    const ayna = sag ? `translate(${2 * cx},0) scale(-1,1)` : undefined;
    return (
      <g transform={ayna}>
        <clipPath id={kid}><path d={sekil} /></clipPath>
        <path d={sekil} fill="#fbf7f2" />
        <g clipPath={`url(#${kid})`}>
          <circle cx={sag ? 2 * cx - ix : ix} cy={iy} r={11} fill={R.goz} />
          <circle cx={sag ? 2 * cx - ix : ix} cy={iy} r={5.5} fill="#140c08" />
          <circle cx={(sag ? 2 * cx - ix : ix) + (sag ? -3.5 : 3.5)} cy={iy - 4} r={3} fill="#fff" />
        </g>
        {/* üst kapak çizgisi (kalın, kirpik hissi) */}
        <path d={`M${cx - rx - 2},${gozY + 1} Q${cx - rx * 0.4},${gozY - ry * 1.3} ${cx + rx * 0.2},${gozY - ry * 1.2} Q${cx + rx * 0.8},${gozY - ry * 0.95} ${cx + rx + 3},${gozY + 2}`} stroke={R.cizgi} strokeWidth={5} fill="none" strokeLinecap="round" />
        {/* göz kapağı kıvrımı */}
        <path d={`M${cx - rx + 4},${gozY - ry - 8} Q${cx},${gozY - ry - 13} ${cx + rx - 2},${gozY - ry - 6}`} stroke={R.tenKoyu} strokeWidth={2.5} fill="none" strokeLinecap="round" opacity={ac > 0.3 ? 0.7 : 0} />
        {gozGul > 0.2 ? <path d={`M${cx - rx + 3},${alt + 6} Q${cx},${alt + 1} ${cx + rx - 3},${alt + 6}`} stroke={R.tenKoyu} strokeWidth={2.5} fill="none" strokeLinecap="round" /> : null}
      </g>
    );
  };
  const Kas = ({ sol }: { sol: boolean }) => {
    const y = 196 - kas * 12;
    const ic = sol ? 178 : 222, dis = sol ? 118 : 282;
    const icY = y + 4 + kasAci * 9, disY = y + 2 - kasAci * 3;
    return <path d={`M${ic},${icY} C${(ic * 2 + dis) / 3},${y - 6 + kasAci * 4} ${(ic + dis * 2) / 3},${y - 10} ${dis},${disY + 4} L${dis + (sol ? 2 : -2)},${disY - 6} C${(ic + dis * 2) / 3},${y - 22} ${(ic * 2 + dis) / 3},${y - 18 + kasAci * 4} ${ic},${icY - 12} Z`} fill={R.kas} strokeLinejoin="round" stroke={R.kas} strokeWidth={2} />;
  };
  return (
    <g>
      <defs>
        <clipPath id={`${k}yuz`}><path d={YUZ} /></clipPath>
        <radialGradient id={`${k}yan`} cx="0.5" cy="0.5" r="0.5">
          <stop offset="0" stopColor={R.yanak} stopOpacity={0.45} />
          <stop offset="1" stopColor={R.yanak} stopOpacity={0} />
        </radialGradient>
      </defs>
      {govde ? <g transform="translate(0,-22)"><Gogus /></g> : null}
      {/* boyun */}
      <path d="M156,360 L156,468 L244,468 L244,360 Z" fill={R.tenGolge} />
      <path d="M156,392 C180,420 220,420 244,392 L244,360 L156,360 Z" fill={R.tenKoyu} opacity={0.55} />
      {govde ? <g transform="translate(0,-22)"><Yaka /></g> : null}
      <g transform={`rotate(${egim} 200 300)`}>
        {/* kulaklar */}
        <g>
          <ellipse cx={74} cy={246} rx={20} ry={34} fill={R.ten} />
          <path d="M70,228 C62,240 64,258 72,266" stroke={R.tenKoyu} strokeWidth={4} fill="none" strokeLinecap="round" />
          <ellipse cx={326} cy={246} rx={20} ry={34} fill={R.ten} />
          <path d="M330,228 C338,240 336,258 328,266" stroke={R.tenKoyu} strokeWidth={4} fill="none" strokeLinecap="round" />
        </g>
        {/* yüz */}
        <path d={YUZ} fill={R.ten} />
        {/* düz gölge: sağ yan */}
        <g clipPath={`url(#${k}yuz)`}>
          <path d="M300,80 C340,180 336,300 290,380 L360,420 L360,60 Z" fill={R.tenGolge} opacity={0.75} />
          <ellipse cx={138} cy={290} rx={34} ry={20} fill={`url(#${k}yan)`} opacity={0.6 + yanak} />
          <ellipse cx={262} cy={290} rx={34} ry={20} fill={`url(#${k}yan)`} opacity={0.6 + yanak} />
          {/* sakal */}
          <path d={SAKAL} fill={R.sakal} opacity={0.78} />
          <path d={SAKAL} fill="none" stroke={R.sakal} strokeWidth={12} opacity={0.18} />
          <path d={BIYIK} fill={R.sakal} opacity={0.9} />
          {/* dudak alanı: sakal içinde ten rengi, ağız okunur */}
          <path d="M168,330 Q200,322 232,330 Q230,356 214,364 Q200,368 186,364 Q170,356 168,330 Z" fill={R.tenGolge} opacity={0.55} />
          <path d="M178,346 Q200,340 222,346 Q218,360 200,362 Q182,360 178,346 Z" fill={R.dudak} opacity={0.35} />
        </g>
        {/* burun */}
        <path d="M202,262 C200,276 192,288 190,294 C195,301 206,302 213,296" stroke={R.tenKoyu} strokeWidth={4.5} fill="none" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M182,294 C185,300 190,302 194,301 M207,301 C212,302 217,300 220,294" stroke={R.tenKoyu} strokeWidth={3.5} fill="none" strokeLinecap="round" />
        {/* ağız */}
        <Agiz v={agiz} k={k} />
        {/* gözler + kaşlar */}
        <Goz cx={150} sag={false} />
        <Goz cx={250} sag={true} />
        <Kas sol={true} />
        <Kas sol={false} />
        {/* saç: kısa üst, şakaklarda hafif açıklık, yanlar kısa (fade) */}
        <path d="M76,214 C74,150 92,108 124,86 C152,66 184,58 210,58 C252,58 292,74 314,104 C330,128 330,170 324,214 C318,190 312,172 302,160 C300,150 296,140 288,134 C270,140 252,134 236,128 C222,134 210,136 198,132 C184,138 168,138 152,134 C134,140 116,148 108,160 C94,174 82,192 76,214 Z" fill={R.sac} />
        {/* üst hacim */}
        <path d="M110,108 C136,64 196,44 250,52 C290,58 318,82 322,118 C300,92 262,82 230,84 C190,84 150,92 110,108 Z" fill={R.sac} />
        <path d="M136,90 C170,66 230,60 278,74" stroke={R.sacParlak} strokeWidth={8} fill="none" strokeLinecap="round" />
        <path d="M160,104 C190,90 236,88 266,96" stroke={R.sacParlak} strokeWidth={5} fill="none" strokeLinecap="round" opacity={0.7} />
        {/* yan kısa saç (favori) */}
        <path d="M78,206 C76,222 77,236 80,250 C84,240 86,226 88,212 Z" fill={R.sac} opacity={0.75} />
        <path d="M322,206 C324,222 323,236 320,250 C316,240 314,226 312,212 Z" fill={R.sac} opacity={0.75} />
      </g>
    </g>
  );
};

// Göğüs: lacivert yarım fermuarlı yakalı kazak (baş yerel koordinatında)
const Gogus: React.FC = () => (
  <g>
    <path d="M-40,640 C-38,540 20,486 112,462 L166,446 L234,446 L288,462 C380,486 438,540 440,640 Z" fill={R.kazak} />
    <path d="M300,466 C380,490 436,544 440,640 L360,640 C372,570 348,510 300,466 Z" fill={R.kazakGolge} />
    <path d="M100,466 C60,486 30,520 18,560" stroke={R.kazakParlak} strokeWidth={6} fill="none" strokeLinecap="round" opacity={0.6} />
  </g>
);

const Yaka: React.FC = () => (
  <g>
    {/* beyaz tişört V'de görünür */}
    <path d="M168,452 L200,524 L232,452 Z" fill={R.tisort} />
    <path d="M168,452 C182,462 218,462 232,452" stroke="#d9d4cb" strokeWidth={4} fill="none" />
    {/* yaka kanatları */}
    <path d="M150,440 C146,460 150,488 162,506 L200,528 L176,458 C172,450 164,444 150,440 Z" fill={R.kazak} stroke={R.kazakGolge} strokeWidth={3} strokeLinejoin="round" />
    <path d="M250,440 C254,460 250,488 238,506 L200,528 L224,458 C228,450 236,444 250,440 Z" fill={R.kazakGolge} stroke={R.kazakGolge} strokeWidth={3} strokeLinejoin="round" />
    <path d="M150,440 C164,436 176,440 186,452" stroke={R.kazakParlak} strokeWidth={4} fill="none" strokeLinecap="round" />
    {/* fermuar */}
    <path d="M200,528 L200,610" stroke={R.kazakGolge} strokeWidth={5} />
    <path d="M200,528 L200,610" stroke={R.fermuar} strokeWidth={2} strokeDasharray="3 3" />
    <rect x={194} y={524} width={12} height={22} rx={3} fill={R.fermuar} />
    <rect x={197} y={544} width={6} height={12} rx={2} fill={R.fermuar} />
  </g>
);

// Tam boy (rehber pozu). Yerel: genişlik 400, yükseklik ~1180; ayak tabanı y=1180.
export type Poz = "dur" | "goster" | "selam" | "dusun";
export const BerkayTam: React.FC<{ ifade?: Ifade; poz?: Poz; kirp?: number }> = ({ ifade, poz = "dur", kirp = 1 }) => {
  const kol = (sol: boolean) => {
    const omuzX = sol ? 84 : 316, omuzY = 490;
    const yon = sol ? -1 : 1;
    let ust = sol ? 12 : -12, alt = 0; // derece: 0 aşağı sarkık
    if (poz === "goster" && !sol) { ust = -100; alt = -10; }
    if (poz === "selam" && !sol) { ust = -150; alt = -30; }
    if (poz === "dusun" && !sol) { ust = -20; alt = -140; }
    return (
      <g transform={`translate(${omuzX},${omuzY}) rotate(${ust})`}>
        <rect x={-36} y={-20} width={72} height={150} rx={36} fill={R.kazak} />
        <rect x={yon > 0 ? 4 : -36} y={-20} width={32} height={150} rx={16} fill={R.kazakGolge} opacity={0.55} />
        <g transform={`translate(0,118) rotate(${alt})`}>
          <rect x={-32} y={-14} width={64} height={130} rx={32} fill={R.kazak} />
          <rect x={-33} y={98} width={66} height={20} rx={9} fill={R.kazakGolge} />
          {/* el */}
          <g transform="translate(0,124)">
            <ellipse cx={0} cy={18} rx={30} ry={34} fill={R.ten} />
            <ellipse cx={yon * -20} cy={8} rx={11} ry={20} fill={R.ten} transform={`rotate(${yon * 25} ${yon * -20} 8)`} />
            {poz === "goster" && !sol ? <rect x={-7} y={30} width={14} height={46} rx={7} fill={R.ten} /> : null}
            <path d={`M${-18},${28} Q0,${46} 18,${28}`} stroke={R.tenKoyu} strokeWidth={3} fill="none" opacity={0.6} />
          </g>
        </g>
      </g>
    );
  };
  return (
    <g>
      {/* bacaklar */}
      <path d="M118,780 L114,1130 L194,1130 L200,850 L206,1130 L286,1130 L282,780 Z" fill={R.pantolon} />
      <path d="M200,850 L206,1130 L286,1130 L282,780 L250,780 Z" fill={R.pantolonGolge} />
      {/* ayakkabılar */}
      <path d="M100,1124 L196,1124 C204,1124 208,1140 206,1160 L80,1160 C78,1142 86,1124 100,1124 Z" fill={R.ayakkabi} />
      <rect x={78} y={1158} width={130} height={22} rx={8} fill={R.taban} />
      <path d="M204,1124 L300,1124 C314,1124 322,1142 320,1160 L194,1160 C192,1140 196,1124 204,1124 Z" fill={R.ayakkabi} />
      <rect x={192} y={1158} width={130} height={22} rx={8} fill={R.taban} />
      {/* gövde (kazak) */}
      <path d="M60,520 C56,476 110,454 166,446 L234,446 C290,454 344,476 340,520 L310,800 C266,816 134,816 90,800 Z" fill={R.kazak} />
      <path d="M318,500 C336,560 322,700 310,800 C290,808 270,810 254,812 C280,700 292,580 318,500 Z" fill={R.kazakGolge} />
      <rect x={88} y={772} width={224} height={36} rx={15} fill={R.kazakGolge} />
      {kol(true)}
      {kol(false)}
      <BerkayBas ifade={ifade} kirp={kirp} govde={false} />
      <Yaka />
    </g>
  );
};
