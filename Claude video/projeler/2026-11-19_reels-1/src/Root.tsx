import { Composition, Still, staticFile } from "remotion";
import { ReelsKapak } from "../../../bilesenler/ReelsKapak";
import veri from "./reels.json";
import { Reels, ReelsVeri } from "../../../bilesenler/Reels";

const v = veri as ReelsVeri;
const k = {
  dosya: (ad: string) => staticFile(ad),
  foto: staticFile("berkay-isik-profil.png"),
  muzik: staticFile("muzik.wav"),
  sfx: (ad: string) => staticFile(`sfx/${ad}.wav`),
  kanal: "Sıfırdan Satışa",
};
const ReelsKomp: React.FC = () => <Reels v={v} k={k} />;
export const RemotionRoot: React.FC = () => (
  <>
  <Still id="Kapak-A" component={() => <ReelsKapak arka={staticFile("kapak_arka.png")} kisi={staticFile("kapak_kisi.png")} rozet="BABALAR GİBİ E-TİCARET" numara="#1" satir1="E-TİCARETE" satir2="NASIL BAŞLANIR?" vurgu="3 model, tek video" etiketler={["Geleneksel", "Stoksuz", "Yeni Nesil"]} />} width={1080} height={1920} />
  <Still id="Kapak-B" component={() => <ReelsKapak arka={staticFile("kapak_arka.png")} kisi={staticFile("kapak_kisi.png")} rozet="BABALAR GİBİ E-TİCARET" numara="#1" satir1="HANGİ MODEL" satir2="SANA UYGUN?" vurgu="babalar gibi anlatıyorum" etiketler={["Geleneksel", "Stoksuz", "Yeni Nesil"]} />} width={1080} height={1920} />
  <Composition id="Reels1" component={ReelsKomp} durationInFrames={v.toplamKare} fps={30} width={1080} height={1920} />
  </>
);
