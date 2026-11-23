import React from "react";

// Ahmet: stilize, gerçekçi oranlı karakter. Yerel koordinat: 400 x 560 (baş + boyun + omuz başı).
// Işık: "isik" rengi ve yönü ile yüzün bir yanı aydınlanır, öbür yanı gölgede kalır.
export type Ifade = {
  kasY?: number;      // + aşağı, - kaldır (px)
  kasAci?: number;    // + çatık (derece)
  gozX?: number;      // -1 sol .. 1 sağ
  gozY?: number;      // -1 yukarı .. 1 aşağı
  gozAcik?: number;   // 0 kapalı .. 1 açık
  gulum?: number;     // -1 .. 1
  dudakBas?: number;  // 0..1 dudak bükme
};
export type Isik = { renk: string; yon: "sol" | "sag" | "alt" | "on"; guc: number; ortam: number };

export const RENKLER = {
  ten: "#c8977a",
  tenKoyu: "#9c6f56",
  sac: "#2f2119",
  sakal: "#2f2119",
  tisort: "#3b3e44",
  tisortKoyu: "#2a2c31",
  pantolon: "#16171a",
  goz: "#4a2f1f",
};

const BAS = "M96,210 C96,120 140,92 200,92 C260,92 304,120 304,210 C304,282 292,322 264,347 C242,366 222,374 200,374 C178,374 158,366 136,347 C108,322 96,282 96,210 Z";

export const kirp = (f: number, periyot = 84, ofset = 0) => {
  const p = (f + ofset) % periyot;
  return p < 2 ? 0.08 : p < 4 ? 0.5 : 1;
};

export const AhmetBas: React.FC<{ id: string; ifade?: Ifade; isik: Isik; kirpma?: number; govde?: boolean }> = ({ id, ifade = {}, isik, kirpma = 1, govde = true }) => {
  const { kasY = 0, kasAci = 0, gozX = 0, gozY = 0, gozAcik = 1, gulum = 0, dudakBas = 0 } = ifade;
  const ac = Math.max(0.06, gozAcik * kirpma);
  const yon = { sol: ["0", "0.5", "1", "0.5"], sag: ["1", "0.5", "0", "0.5"], alt: ["0.5", "1", "0.5", "0"], on: ["0.5", "0.6", "0.5", "0"] }[isik.yon];
  const goz = (cx: number, sag: boolean) => {
    const ix = cx + gozX * 7, iy = 222 + gozY * 4;
    return (
      <g>
        <clipPath id={`${id}gz${sag ? 1 : 0}`}><ellipse cx={cx} cy={222} rx={19} ry={9.5 * ac} /></clipPath>
        <ellipse cx={cx} cy={222} rx={19} ry={9.5 * ac} fill="#eee6df" />
        <g clipPath={`url(#${id}gz${sag ? 1 : 0})`}>
          <circle cx={ix} cy={iy} r={8.5} fill={RENKLER.goz} />
          <circle cx={ix} cy={iy} r={4} fill="#120b07" />
          <circle cx={ix + 2.5} cy={iy - 2.5} r={1.8} fill="white" opacity={0.85} />
          <rect x={cx - 22} y={210} width={44} height={6} fill="rgba(0,0,0,0.25)" />
        </g>
        <path d={`M${cx - 21},${222 - 1} Q${cx},${222 - 13 * ac - 2} ${cx + 21},${222 - 1}`} stroke="#3a2418" strokeWidth={3.2} fill="none" strokeLinecap="round" />
        <path d={`M${cx - 18},${222 - 15 * ac - 4} Q${cx},${222 - 22 * ac - 6} ${cx + 18},${222 - 15 * ac - 4}`} stroke="rgba(90,55,40,0.35)" strokeWidth={2} fill="none" />
      </g>
    );
  };
  const kas = (sol: boolean) => {
    const ic = sol ? 182 : 218, dis = sol ? 136 : 264, y = 188 + kasY;
    const icY = y + kasAci * 0.5 - (kasAci < 0 ? 0 : 0), disY = y + 3 - kasAci * 0.15;
    return <path d={`M${dis},${disY} Q${(ic + dis) / 2},${y - 9 - kasAci * 0.1} ${ic},${icY}`} stroke={RENKLER.sac} strokeWidth={9} strokeLinecap="round" fill="none" />;
  };
  const agizY = 318;
  return (
    <g>
      <defs>
        <linearGradient id={`${id}isik`} x1={yon[0]} y1={yon[1]} x2={yon[2]} y2={yon[3]}>
          <stop offset="0" stopColor={isik.renk} stopOpacity={0.55 * isik.guc} />
          <stop offset="0.45" stopColor={isik.renk} stopOpacity={0.12 * isik.guc} />
          <stop offset="1" stopColor="#000" stopOpacity={0.55} />
        </linearGradient>
        <radialGradient id={`${id}yanak`} cx="0.5" cy="0.6" r="0.5">
          <stop offset="0" stopColor="#d9876b" stopOpacity="0.25" />
          <stop offset="1" stopColor="#d9876b" stopOpacity="0" />
        </radialGradient>
      </defs>
      {govde ? (
        <g>
          {/* omuzlar ve tişört */}
          <path d="M-60,560 C-50,500 10,470 120,452 L170,440 L230,440 L280,452 C390,470 450,500 460,560 Z" fill={RENKLER.tisort} />
          <path d="M-60,560 C-50,500 10,470 120,452 L170,440 L230,440 L280,452 C390,470 450,500 460,560 Z" fill={`url(#${id}isik)`} opacity={0.8} />
        </g>
      ) : null}
      {/* boyun */}
      <path d="M160,330 L160,445 C175,462 225,462 240,445 L240,330 Z" fill={RENKLER.tenKoyu} />
      <path d="M160,360 C185,390 215,390 240,360 L240,330 L160,330 Z" fill="rgba(0,0,0,0.35)" />
      {govde ? <path d="M150,442 C170,470 230,470 250,442" stroke={RENKLER.tisortKoyu} strokeWidth={10} fill="none" /> : null}
      {/* kulaklar */}
      <ellipse cx={98} cy={234} rx={15} ry={29} fill={RENKLER.tenKoyu} />
      <ellipse cx={302} cy={234} rx={15} ry={29} fill={RENKLER.tenKoyu} />
      {/* baş */}
      <path d={BAS} fill={RENKLER.ten} />
      <ellipse cx={150} cy={270} rx={34} ry={22} fill={`url(#${id}yanak)`} />
      <ellipse cx={250} cy={270} rx={34} ry={22} fill={`url(#${id}yanak)`} />
      {/* sakal (hafif) */}
      <path d="M108,258 C116,330 158,374 200,376 C242,374 284,330 292,258 C284,300 258,322 234,328 C222,316 178,316 166,328 C142,322 116,300 108,258 Z" fill={RENKLER.sakal} opacity={0.26} />
      <path d="M168,303 C185,293 215,293 232,303 C222,308 178,308 168,303 Z" fill={RENKLER.sakal} opacity={0.4} />
      {/* burun */}
      <path d="M203,228 C199,256 189,276 193,284 C199,290 211,289 214,283" stroke="rgba(110,70,50,0.6)" strokeWidth={3.5} fill="none" strokeLinecap="round" />
      <ellipse cx={204} cy={282} rx={14} ry={6} fill="rgba(0,0,0,0.12)" />
      {/* gözler, kaşlar */}
      {goz(160, false)}
      {goz(240, true)}
      {kas(true)}
      {kas(false)}
      {/* ağız */}
      <path d={`M${177 - gulum * 4},${agizY - gulum * 3 + dudakBas * 2} Q200,${agizY + gulum * 9 - dudakBas * 3} ${223 + gulum * 4},${agizY - gulum * 3 + dudakBas * 2}`} stroke="#7a4636" strokeWidth={4.5} fill="none" strokeLinecap="round" />
      <path d={`M186,${agizY + 9} Q200,${agizY + 13} 214,${agizY + 9}`} stroke="rgba(120,70,55,0.35)" strokeWidth={3} fill="none" strokeLinecap="round" />
      <path d={BAS} fill={`url(#${id}isik)`} />
      {/* saç */}
      <path d="M90,214 C80,122 128,66 202,64 C276,62 322,112 312,214 C307,186 298,164 284,152 L266,160 L250,144 L232,158 L212,142 L192,156 L172,144 L154,158 L136,150 C114,164 98,186 90,214 Z" fill={RENKLER.sac} />
      <path d="M126,146 C150,112 200,104 250,112 C275,118 292,132 300,150" stroke="rgba(255,255,255,0.08)" strokeWidth={6} fill="none" />
      <path d="M92,214 L92,240 C96,230 98,222 100,214 Z M310,214 L310,240 C306,230 304,222 302,214 Z" fill={RENKLER.sac} />
      {/* ortam karartması (sadece siluet) */}
      <g fill="#070b18" opacity={isik.ortam}>
        <path d={BAS} />
        <path d="M90,214 C80,122 128,66 202,64 C276,62 322,112 312,214 Z" />
        <path d="M160,330 L160,445 L240,445 L240,330 Z" />
        <ellipse cx={98} cy={234} rx={15} ry={29} /><ellipse cx={302} cy={234} rx={15} ry={29} />
        {govde ? <path d="M-60,560 C-50,500 10,470 120,452 L170,440 L230,440 L280,452 C390,470 450,500 460,560 Z" /> : null}
      </g>
    </g>
  );
};

// Arkadan baş + omuz (masa başında, oda geniş planlarında)
export const AhmetArka: React.FC<{ isik: Isik; id: string }> = ({ isik, id }) => (
  <g>
    <defs>
      <linearGradient id={`${id}ark`} x1="0" y1="0" x2="1" y2="0">
        <stop offset="0" stopColor={isik.renk} stopOpacity={0.35 * isik.guc} />
        <stop offset="1" stopColor="#000" stopOpacity={0.45} />
      </linearGradient>
    </defs>
    <path d="M-60,560 C-50,490 10,460 120,445 L280,445 C390,460 450,490 460,560 Z" fill={RENKLER.tisort} />
    <path d="M160,340 L160,450 L240,450 L240,340 Z" fill={RENKLER.tenKoyu} />
    <ellipse cx={98} cy={234} rx={15} ry={29} fill={RENKLER.tenKoyu} />
    <ellipse cx={302} cy={234} rx={15} ry={29} fill={RENKLER.tenKoyu} />
    <path d={BAS} fill={RENKLER.sac} />
    <path d="M110,300 C130,350 170,372 200,374 C230,372 270,350 290,300 C270,330 240,344 200,346 C160,344 130,330 110,300 Z" fill={RENKLER.tenKoyu} opacity={0.7} />
    <path d="M-60,560 C-50,490 10,460 120,445 L280,445 C390,460 450,490 460,560 Z M96,210 C96,120 140,92 200,92 C260,92 304,120 304,210 C304,282 292,322 264,347 C242,366 222,374 200,374 C178,374 158,366 136,347 C108,322 96,282 96,210 Z" fill={`url(#${id}ark)`} />
    <path d="M-60,560 C-50,490 10,460 120,445 L280,445 C390,460 450,490 460,560 Z M96,210 C96,120 140,92 200,92 C260,92 304,120 304,210 C304,282 292,322 264,347 C242,366 222,374 200,374 C178,374 158,366 136,347 C108,322 96,282 96,210 Z" fill="#070b18" opacity={isik.ortam} />
  </g>
);

// El (basit, gerçekçi oranlı): avuç + parmaklar. Yerel 0,0 bilek; aci derece; ayna
export const El: React.FC<{ x: number; y: number; aci?: number; olcek?: number; ayna?: boolean; renk?: string; golge?: number }> = ({ x, y, aci = 0, olcek = 1, ayna = false, renk = RENKLER.ten, golge = 0.25 }) => (
  <g transform={`translate(${x},${y}) rotate(${aci}) scale(${ayna ? -olcek : olcek},${olcek})`}>
    <path d="M-22,0 C-26,-30 -24,-58 -14,-70 L18,-70 C26,-56 28,-30 22,0 Z" fill={renk} />
    {[-14, -4, 6, 15].map((px, i) => (
      <rect key={i} x={px - 4.5} y={-104 + Math.abs(i - 1.5) * 6} width={9.5} height={40 - Math.abs(i - 1.5) * 5} rx={4.75} fill={renk} />
    ))}
    <rect x={-34} y={-62} width={10} height={34} rx={5} fill={renk} transform="rotate(-28 -29 -45)" />
    <path d="M-22,0 C-26,-30 -24,-58 -14,-70 L18,-70 C26,-56 28,-30 22,0 Z" fill="#000" opacity={golge} />
  </g>
);
