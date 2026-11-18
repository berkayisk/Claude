import { AbsoluteFill, Img, Sequence, staticFile } from "remotion";
import { IlkAgizdanKart } from "../../../bilesenler/IlkAgizdanKart";
import { AltBant } from "../../../bilesenler/AltBant";
import { Vizor, AzSonraYazi, IsikGecisi } from "../../../bilesenler/AzSonra";
import { AboneOl, InstagramEtiketi } from "../../../bilesenler/AboneOl";

export const KartTest = () => <IlkAgizdanKart konuk={staticFile("konuk_kontur.png")} sunucu={staticFile("sunucu_kontur.png")} />;
const Arka = () => <Img src={staticFile("kare_120.png")} style={{ width: 1920, height: 1080 }} />;
export const OverlayTest = () => (
  <AbsoluteFill>
    <Arka />
    <Sequence from={0}><AltBant isim="Konuk Adı Soyadı" unvan="Unvan Buraya" rol="Rol Buraya" sure={300} /></Sequence>
    <Sequence from={0}><AboneOl foto={staticFile("berkay-isik-profil.png")} sure={300} /></Sequence>
  </AbsoluteFill>
);
export const AzSonraTest = () => (
  <AbsoluteFill>
    <Arka />
    <Vizor />
    <AzSonraYazi />
    <Sequence from={40} durationInFrames={12}><IsikGecisi sure={12} /></Sequence>
  </AbsoluteFill>
);
export const InstaTest = () => (
  <AbsoluteFill>
    <Arka />
    <InstagramEtiketi kullanici="konukhesabi" x={80} y={760} sure={300} />
    <InstagramEtiketi kullanici="sifirdansatisa" x={1100} y={760} sure={300} />
  </AbsoluteFill>
);
