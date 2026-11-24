import { Composition, Still } from "remotion";
import { Kapak } from "./Kapak";
import { Video } from "./Video";
import { TOPLAM, FPS } from "./zaman";
export const RemotionRoot: React.FC = () => (
  <>
  <Still id="Kapak" component={Kapak} width={1080} height={1920} />
  <Composition id="Video" component={Video} durationInFrames={Math.ceil(TOPLAM * FPS)} fps={FPS} width={1080} height={1920} />
  </>
);
