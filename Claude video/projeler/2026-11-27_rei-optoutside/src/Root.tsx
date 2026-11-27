import React from "react";
import { Composition, Still } from "remotion";
import { Film } from "./Film";
import { Kapak, KapakBF, KapakREI, Profil } from "./Hesap";
import plan from "./plan.json";
export const RemotionRoot: React.FC = () => (
  <>
    <Composition id="Film" component={Film} durationInFrames={Math.round(plan.bitis * 30)} fps={30} width={1080} height={1920} />
    <Still id="Profil" component={Profil} width={1080} height={1080} />
    <Still id="Kapak" component={Kapak} width={1080} height={1920} defaultProps={{ s1: "FİYATLAR NEDEN HEP", s2: "99,99" }} />
    <Still id="KapakBF" component={KapakBF} width={1080} height={1920} />
    <Still id="KapakREI" component={KapakREI} width={1080} height={1920} />
  </>
);
