import React from "react";
import { Composition } from "remotion";
import { Film } from "./Film";
import plan from "./plan.json";
export const RemotionRoot: React.FC = () => (
  <Composition id="Film" component={Film} durationInFrames={Math.round(plan.bitis * 30)} fps={30} width={1080} height={1920} />
);
