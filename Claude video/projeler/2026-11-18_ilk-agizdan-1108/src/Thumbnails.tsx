import { staticFile } from "remotion";
import { Thumbnail } from "../../../bilesenler/Thumbnail";

const k = staticFile("thumb_konuk.png");
const s = staticFile("thumb_sunucu.png");
export const ThumbA = () => (
  <Thumbnail konuk={k} sunucu={s} satirlar={[{ metin: "SATIN ALIRKEN", boyut: 92 }, { metin: "%95", boyut: 330, kutu: true }, { metin: "DUYGUSALIZ!", boyut: 150 }]} />
);
export const ThumbB = () => (
  <Thumbnail konuk={k} sunucu={s} satirlar={[{ metin: "MÜŞTERİ", boyut: 160 }, { metin: "“TUVALET”", boyut: 190, kutu: true }, { metin: "DEDİ!", boyut: 180 }]} emoji="🚽" emojiPoz={{ x: 820, y: 700, boyut: 230, donme: -10 }} />
);
export const ThumbC = () => (
  <Thumbnail konuk={k} sunucu={s} satirlar={[{ metin: "TÜRKLER", boyut: 190 }, { metin: "vs", boyut: 110, renk: "#FFC247" }, { metin: "AMERİKALILAR", boyut: 132, kutu: true }]} emoji="🇹🇷🇺🇸" emojiPoz={{ x: 760, y: 730, boyut: 170 }} />
);
