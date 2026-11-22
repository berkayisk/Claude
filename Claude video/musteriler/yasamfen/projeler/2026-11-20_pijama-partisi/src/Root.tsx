import React from "react";
import { Composition } from "remotion";
import { Onizleme, ONIZLEME_SURE } from "./Onizleme";
import { Kurgu, KurguVeri } from "../../../bilesenler/Kurgu";

// Her video: src/<ad>.json (calisma/kurgu_yap.py üretir). Dosya yoksa atlanır.
const VIDEOLAR: [string, string][] = [
  ["Yarisma1", "yarisma1"],
  ["Yarisma2", "yarisma2"],
  ["Vampir1", "vampir1"],
  ["Vampir2", "vampir2"],
  ["Genel", "genel"],
  ["Kombin", "kombin"],
  ["Hocalar", "hocalar"],
  ["Yks", "yks"],
  ["KomikYks", "komik_yks"],
  ["KomikParti", "komik_parti"],
];
const yukle = (ad: string): KurguVeri | null => {
  try { return require(`./${ad}.json`) as KurguVeri; } catch { return null; }
};

export const RemotionRoot: React.FC = () => (
  <>
    <Composition id="Onizleme" component={Onizleme} durationInFrames={ONIZLEME_SURE} fps={30} width={1080} height={1920} />
    {VIDEOLAR.map(([id, ad]) => {
      const v = yukle(ad);
      if (!v) return null;
      return <Composition key={id} id={id} component={() => <Kurgu v={v} />} durationInFrames={v.toplamKare} fps={30} width={1080} height={1920} />;
    })}
  </>
);
