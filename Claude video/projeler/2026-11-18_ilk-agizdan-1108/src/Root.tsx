import { Composition } from "remotion";
import { Video, TOPLAM_KARE } from "./Video";
import { KartTest, OverlayTest, AzSonraTest, InstaTest } from "./Test";

export const RemotionRoot: React.FC = () => (
  <>
    <Composition id="Video" component={Video} durationInFrames={TOPLAM_KARE} fps={30} width={1920} height={1080} />
    <Composition id="KartTest" component={KartTest} durationInFrames={60} fps={30} width={1920} height={1080} />
    <Composition id="OverlayTest" component={OverlayTest} durationInFrames={120} fps={30} width={1920} height={1080} />
    <Composition id="AzSonraTest" component={AzSonraTest} durationInFrames={90} fps={30} width={1920} height={1080} />
    <Composition id="InstaTest" component={InstaTest} durationInFrames={60} fps={30} width={1920} height={1080} />
  </>
);
