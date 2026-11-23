import React from "react";
import { Composition } from "remotion";
import plan from "./plan.json";
import { Film } from "./Film";
export const RemotionRoot: React.FC = () => <Composition id="AhmetBolum1" component={Film} durationInFrames={Math.round(plan.bitis * 24)} fps={24} width={1080} height={1920} />;
