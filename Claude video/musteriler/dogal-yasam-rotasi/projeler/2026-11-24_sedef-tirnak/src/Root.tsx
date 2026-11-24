import { Composition } from "remotion";
import { Video } from "./Video";
import { TOPLAM, FPS } from "./zaman";
export const RemotionRoot: React.FC = () => (
  <Composition id="Video" component={Video} durationInFrames={Math.ceil(TOPLAM * FPS)} fps={FPS} width={1080} height={1920} />
);
