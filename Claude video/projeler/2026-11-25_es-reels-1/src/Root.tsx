import { Composition, Still, staticFile } from "remotion";
import veri from "./es.json";
import { ES, ESVeri } from "./ES";
import { ESKapak } from "../../../bilesenler/ESKapak";

const v = veri as unknown as ESVeri;
const Komp: React.FC = () => <ES v={v} />;
const kisi = { arka: staticFile("kapak_arka.png"), kisi: staticFile("kapak_kisi.png"), kisiGenislik: 1500, kisiX: -183, kisiY: 660 };
export const RemotionRoot: React.FC = () => (
  <>
    <Composition id="ESReels1" component={Komp} durationInFrames={v.toplamKare} fps={30} width={1080} height={1920} />
    <Still id="Kapak-A" component={() => <ESKapak {...kisi} satir1="TAKİPÇİNE" satir2="BÖYLE SORMA!" boy2={150} alt="Yorumları 2 seçenekle patlat" />} width={1080} height={1920} />
    <Still id="Kapak-B" component={() => <ESKapak {...kisi} satir1="YORUM ALAMIYORSAN" boy1={112} satir2="SEBEBİ BU" satir2Kirmizi />} width={1080} height={1920} />
  </>
);
