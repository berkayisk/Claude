import { Composition, staticFile } from "remotion";
import veri from "./reels.json";
import { Reels, ReelsVeri } from "../../../bilesenler/Reels";

const v = veri as ReelsVeri;
const k = {
  dosya: (ad: string) => staticFile(ad),
  foto: staticFile("berkay-isik-profil.png"),
  sfx: (ad: string) => staticFile(`sfx/${ad}.wav`),
  kanal: "Sıfırdan Satışa",
};
const ReelsKomp: React.FC = () => <Reels v={v} k={k} />;
export const RemotionRoot: React.FC = () => (
  <Composition id="Tanisma" component={ReelsKomp} durationInFrames={v.toplamKare} fps={30} width={1080} height={1920} />
);
