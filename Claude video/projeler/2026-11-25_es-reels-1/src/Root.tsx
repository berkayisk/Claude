import { Composition } from "remotion";
import veri from "./es.json";
import { ES, ESVeri } from "./ES";

const v = veri as unknown as ESVeri;
const Komp: React.FC = () => <ES v={v} />;
export const RemotionRoot: React.FC = () => (
  <Composition id="ESReels1" component={Komp} durationInFrames={v.toplamKare} fps={30} width={1080} height={1920} />
);
