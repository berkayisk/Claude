import React from "react";
import { Composition, staticFile } from "remotion";
import { GunesReels, GunesVeri } from "../../../bilesenler/GunesReels";

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
  </>
);
