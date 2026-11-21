import { Composition } from "remotion";
import { Onizleme, ONIZLEME_SURE } from "./Onizleme";

export const RemotionRoot: React.FC = () => {
  return (
    <>
      {/* Grafik önizlemesi (ham çekim gelmeden önce) */}
      <Composition id="Onizleme" component={Onizleme} durationInFrames={ONIZLEME_SURE} fps={30} width={1080} height={1920} />
    </>
  );
};
