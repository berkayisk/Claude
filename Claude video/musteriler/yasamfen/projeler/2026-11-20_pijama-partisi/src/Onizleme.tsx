// Oyun grafiklerinin önizlemesi — arka plan geçici (ham çekim yerine bulanık sahne taklidi)
import React from "react";
import { AbsoluteFill, Sequence } from "remotion";
import { CevapKarti, Elendi, FazBandi, RolKarti, Sayac, SoruKarti } from "../../../bilesenler/OyunGrafikleri";

const Zemin: React.FC = () => (
  <AbsoluteFill style={{ background: "radial-gradient(circle at 30% 30%, #6b5a7a 0%, #3b3446 45%, #1d1a22 100%)" }}>
    <AbsoluteFill style={{ background: "radial-gradient(circle at 70% 75%, rgba(255,190,120,0.35), transparent 45%)" }} />
  </AbsoluteFill>
);

// Bölümler: [başlangıç, süre]
const S = {
  soru: [0, 165],
  sayac: [15, 150],
  cevap: [170, 60],
  rol1: [240, 75],
  rol2: [320, 75],
  rol3: [400, 75],
  gece: [480, 60],
  elendi: [545, 60],
} as const;
export const ONIZLEME_SURE = 610;

export const Onizleme: React.FC = () => (
  <AbsoluteFill>
    <Zemin />
    <Sequence from={S.soru[0]} durationInFrames={S.soru[1]}>
      <SoruKarti no={3} toplam={10} soru="Türkiye'nin en uzun nehri hangisidir?" siklar={["Fırat", "Kızılırmak", "Sakarya", "Dicle"]} dogru={1} cevapKare={150} sure={S.soru[1]} />
    </Sequence>
    <Sequence from={S.sayac[0]} durationInFrames={S.sayac[1]}>
      <Sayac saniye={4} sure={S.sayac[1]} y={1420} />
    </Sequence>
    <Sequence from={S.cevap[0]} durationInFrames={S.cevap[1]}>
      <CevapKarti cevap="Kızılırmak" sure={S.cevap[1]} y={1500} />
    </Sequence>
    <Sequence from={S.rol1[0]} durationInFrames={S.rol1[1]}>
      <RolKarti rol="vampir" kisi="Elif" sure={S.rol1[1]} />
    </Sequence>
    <Sequence from={S.rol2[0]} durationInFrames={S.rol2[1]}>
      <RolKarti rol="doktor" sure={S.rol2[1]} />
    </Sequence>
    <Sequence from={S.rol3[0]} durationInFrames={S.rol3[1]}>
      <RolKarti rol="koylu" sure={S.rol3[1]} />
    </Sequence>
    <Sequence from={S.gece[0]} durationInFrames={S.gece[1]}>
      <FazBandi faz="gece" sure={S.gece[1]} />
    </Sequence>
    <Sequence from={S.elendi[0]} durationInFrames={S.elendi[1]}>
      <Elendi kisi="Ahmet" rol="koylu" sure={S.elendi[1]} />
    </Sequence>
  </AbsoluteFill>
);
