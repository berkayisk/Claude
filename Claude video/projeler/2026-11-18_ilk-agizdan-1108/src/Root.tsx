import { Composition } from "remotion";
import { Video, TOPLAM_KARE } from "./Video";
import { SHORTLAR, ShortKomp } from "./Shorts";
import { KartTest, OverlayTest, AzSonraTest, InstaTest } from "./Test";

export const RemotionRoot: React.FC = () => (
  <>
    <Composition id="Video" component={Video} durationInFrames={TOPLAM_KARE} fps={30} width={1920} height={1080} />
    {SHORTLAR.map((sh, i) => (
      <Composition key={sh.id} id={sh.id} component={ShortKomp} defaultProps={{ i }} durationInFrames={sh.toplamKare} fps={30} width={1080} height={1920} />
    ))}
    <Composition id="KartTest" component={KartTest} durationInFrames={60} fps={30} width={1920} height={1080} />
    <Composition id="OverlayTest" component={OverlayTest} durationInFrames={120} fps={30} width={1920} height={1080} />
    <Composition id="AzSonraTest" component={AzSonraTest} durationInFrames={90} fps={30} width={1920} height={1080} />
    <Composition id="InstaTest" component={InstaTest} durationInFrames={60} fps={30} width={1920} height={1080} />
  </>
);
