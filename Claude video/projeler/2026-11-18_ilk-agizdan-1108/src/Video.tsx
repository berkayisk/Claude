import React from "react";
import { AbsoluteFill, Audio, OffthreadVideo, Sequence, interpolate, staticFile, useCurrentFrame } from "remotion";
import plan from "./plan.json";
import { AzSonraYazi, IsikGecisi } from "../../../bilesenler/AzSonra";
import { AltBant } from "../../../bilesenler/AltBant";
import { IlkAgizdanKart } from "../../../bilesenler/IlkAgizdanKart";
import { AboneOl, InstagramEtiketi } from "../../../bilesenler/AboneOl";

const FPS = plan.fps;
const f = (s: number) => Math.round(s * FPS);
const KAYNAK: Record<string, string> = { genis: "genis.mp4", konuk: "konuk160.mp4", sunucu: "sunucu160.mp4" }; // yakın planlar %160

// Süreler (kare)
const FLAS = 12; // ışık geçişi
const JENERIK = 58; // kanal-jenerigi-2sn.mp4
const JENERIK_GECIS = 8; // jenerik -> röportaj crossfade
const KART = 63; // İlk Ağızdan kartı (~2.1 sn)
const KART_CIKIS = 7; // kart -> geniş plan crossfade
const BITIS = 284; // bitis-ekrani-9sn.mp4
const BITIS_GECIS = 12;

// --- Zaman çizelgesi hesabı ---
const fragmanKareler = plan.fragman.map((k) => f(k.son) - f(k.bas));
const FRAGMAN = fragmanKareler.reduce((a, b) => a + b, 0);
const ROP_BAS = FRAGMAN + JENERIK - JENERIK_GECIS; // röportajın başladığı kare

// Röportajı kartlarla bölünmüş "koşulara" ayır
type Kosu = { kaynakBas: number; kaynakSon: number; tlBas: number };
const kosular: Kosu[] = [];
{
  // her kart: cik = kartın girdiği kaynak an, gir = röportajın döndüğü kaynak an (arası atlanır)
  const baslar = [0, ...plan.kartlar.map((k) => k.gir)];
  const sonlar = [...plan.kartlar.map((k) => k.cik), plan.son];
  let tl = ROP_BAS;
  for (let i = 0; i < baslar.length; i++) {
    const a = baslar[i];
    const b = sonlar[i];
    kosular.push({ kaynakBas: a, kaynakSon: b, tlBas: tl });
    tl += f(b) - f(a);
    if (i < plan.kartlar.length) tl += KART - KART_CIKIS; // kart araya girer, son 7 karesi sonraki koşuyla örtüşür
  }
}
const kaynaktanTl = (t: number) => {
  const k = kosular.find((k) => t >= k.kaynakBas && t < k.kaynakSon) ?? kosular[kosular.length - 1];
  return k.tlBas + f(t) - f(k.kaynakBas);
};
const sonKosu = kosular[kosular.length - 1];
const ROP_SON = sonKosu.tlBas + f(sonKosu.kaynakSon) - f(sonKosu.kaynakBas);
export const TOPLAM_KARE = ROP_SON - BITIS_GECIS + BITIS;

// Yumuşak giriş için opaklık sarmalayıcı
const Solma: React.FC<{ giris?: number; cikis?: number; sure: number; children: React.ReactNode }> = ({ giris = 0, cikis = 0, sure, children }) => {
  const frame = useCurrentFrame();
  const a = giris ? interpolate(frame, [0, giris], [0, 1], { extrapolateRight: "clamp" }) : 1;
  const b = cikis ? interpolate(frame, [sure - cikis, sure], [1, 0], { extrapolateLeft: "clamp" }) : 1;
  return <AbsoluteFill style={{ opacity: Math.min(a, b) }}>{children}</AbsoluteFill>;
};

const Fragman: React.FC = () => {
  let t = 0;
  return (
    <AbsoluteFill style={{ background: "black" }}>
      {plan.fragman.map((k, i) => {
        const bas = t;
        const sure = fragmanKareler[i];
        t += sure;
        return (
          <Sequence key={i} from={bas} durationInFrames={sure}>
            <OffthreadVideo src={staticFile(KAYNAK[k.aci])} startFrom={f(k.bas)} muted />
            <Audio src={staticFile("genis.mp4")} startFrom={f(k.bas)} />
          </Sequence>
        );
      })}
      {/* gerilim müziği (kodla üretildi: araclar/gerilim_muzigi.py) */}
      <Audio src={staticFile("gerilim.wav")} volume={0.28} />
      <AzSonraYazi />
      {/* klipler arası ışık geçişleri */}
      {fragmanKareler.slice(0, -1).map((_, i) => {
        const kesme = fragmanKareler.slice(0, i + 1).reduce((a, b) => a + b, 0);
        return (
          <Sequence key={`f${i}`} from={kesme - FLAS / 2} durationInFrames={FLAS}>
            <IsikGecisi sure={FLAS} />
            <Audio src={staticFile("flas.wav")} volume={0.5} />
          </Sequence>
        );
      })}
    </AbsoluteFill>
  );
};

const Roportaj: React.FC = () => (
  <>
    {kosular.map((k, i) => (
      <Sequence key={`a${i}`} from={k.tlBas} durationInFrames={f(k.kaynakSon) - f(k.kaynakBas)}>
        <Audio src={staticFile("genis.mp4")} startFrom={f(k.kaynakBas)} />
      </Sequence>
    ))}
    {kosular.flatMap((k, j) =>
      plan.cekimler
        .filter((c) => c.son > k.kaynakBas && c.bas < k.kaynakSon) // kart aralarındaki atlanan kaynak çizilmez
        .map((c, i) => {
          const a = Math.max(c.bas, k.kaynakBas);
          const b = Math.min(c.son, k.kaynakSon);
          const sure = f(b) - f(a);
          if (sure <= 0) return null;
          return (
            <Sequence key={`c${j}_${i}`} from={k.tlBas + f(a) - f(k.kaynakBas)} durationInFrames={sure}>
              <OffthreadVideo src={staticFile(KAYNAK[c.aci])} startFrom={f(a)} muted />
            </Sequence>
          );
        }),
    )}
  </>
);

export const Video: React.FC = () => {
  return (
    <AbsoluteFill style={{ background: "black" }}>
      {/* 1) Röportaj (altta) */}
      <Roportaj />

      {/* 2) Az Sonra fragmanı */}
      <Sequence from={0} durationInFrames={FRAGMAN}>
        <Fragman />
      </Sequence>

      {/* 3) Kanal jeneriği: ışık geçişiyle girer, röportaja crossfade ile çıkar */}
      <Sequence from={FRAGMAN} durationInFrames={JENERIK}>
        <Solma cikis={JENERIK_GECIS} sure={JENERIK}>
          <OffthreadVideo src={staticFile("kanal-jenerigi-2sn.mp4")} />
        </Solma>
      </Sequence>
      <Sequence from={FRAGMAN - FLAS / 2} durationInFrames={FLAS}>
        <IsikGecisi sure={FLAS} />
      </Sequence>

      {/* 4) Konuk alt bandı */}
      <Sequence from={kaynaktanTl(plan.altBant.bas)} durationInFrames={f(plan.altBant.sure)}>
        <AltBant isim={plan.altBant.isim} unvan={plan.altBant.unvan} rol={plan.altBant.rol} sure={f(plan.altBant.sure)} />
      </Sequence>

      {/* 5) İlk Ağızdan soru kartları */}
      {plan.kartlar.map((k, i) => {
        const bas = kosular[i].tlBas + f(kosular[i].kaynakSon) - f(kosular[i].kaynakBas);
        return (
          <Sequence key={`k${i}`} from={bas} durationInFrames={KART}>
            <Solma cikis={KART_CIKIS} sure={KART}>
              <IlkAgizdanKart konuk={staticFile("konuk_kontur.png")} sunucu={staticFile("sunucu_kontur.png")} />
            </Solma>
            {/* kanal müziğinin sözsüz kısmı (tam müzikte 5.19–7.35 sn) + hafif whoosh */}
            <Audio src={staticFile("kart-muzigi-sozsuz.wav")} />
            <Audio src={staticFile("whoosh.wav")} volume={0.35} />
          </Sequence>
        );
      })}

      {/* 6) Abone Ol + Instagram */}
      <Sequence from={kaynaktanTl(plan.aboneOl.bas)} durationInFrames={f(plan.aboneOl.sure)}>
        <AboneOl foto={staticFile("berkay-isik-profil.png")} sure={f(plan.aboneOl.sure)} x={plan.aboneOl.x} y={plan.aboneOl.y} />
      </Sequence>
      <Sequence from={kaynaktanTl(plan.instagram.bas)} durationInFrames={f(plan.instagram.sure)}>
        <AbsoluteFill>
          {plan.instagram.hesaplar.map((h, i) => (
            <InstagramEtiketi key={i} kullanici={h.kullanici} x={h.x} y={h.y} gecikme={i * 6} sure={f(plan.instagram.sure)} />
          ))}
        </AbsoluteFill>
      </Sequence>

      {/* 7) Bitiş ekranı */}
      <Sequence from={ROP_SON - BITIS_GECIS} durationInFrames={BITIS}>
        <Solma giris={BITIS_GECIS} sure={BITIS}>
          <OffthreadVideo src={staticFile("bitis-ekrani-9sn.mp4")} />
        </Solma>
      </Sequence>
    </AbsoluteFill>
  );
};
