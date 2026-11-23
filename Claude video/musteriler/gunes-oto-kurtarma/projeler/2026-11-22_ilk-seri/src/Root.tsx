import React from "react";
import { Composition, staticFile } from "remotion";
import { GunesReels, GunesVeri } from "../../../bilesenler/GunesReels";
import { GunesKapak } from "../../../bilesenler/GunesKapak";
import kapaklar from "./kapak.json";

// Her video src/<id>.json (calisma/plan.py üretir). Var olanlar listelenir.
const ctx = (require as any).context("./", false, /^\.\/v\d+\.json$/);
const k = {
  dosya: (ad: string) => staticFile(ad),
  logo: staticFile("logo.png"),
  sfx: (ad: string) => staticFile(`sfx/${ad}.wav`),
};
export const RemotionRoot: React.FC = () => (
  <>
    {ctx.keys().map((key: string) => {
      const id = key.replace("./", "").replace(".json", "");
      const v = ctx(key) as GunesVeri;
      const C: React.FC = () => <GunesReels v={v} k={k} />;
      return <Composition key={id} id={id} component={C} durationInFrames={v.toplamKare} fps={30} width={1080} height={1920} />;
    })}
    {Object.entries(kapaklar as Record<string, any>).map(([id, kv]) => {
      const C: React.FC = () => <GunesKapak v={{ ...kv, gorsel: staticFile(`kapak/${id}.jpg`) }} logo={k.logo} />;
      return <Composition key={`k${id}`} id={`kapak-${id}`} component={C} durationInFrames={1} fps={30} width={1080} height={1920} />;
    })}
  </>
);
