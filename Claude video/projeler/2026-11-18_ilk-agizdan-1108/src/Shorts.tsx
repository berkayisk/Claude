import { staticFile } from "remotion";
import shorts from "./shorts.json";
import { Short, ShortVeri } from "../../../bilesenler/Short";

export const SHORTLAR = shorts as ShortVeri[];
const kaynak = {
  konuk: staticFile("konuk_dikey2.mp4"),
  sunucu: staticFile("sunucu_dikey2.mp4"),
  ses: staticFile("genis.mp4"),
  foto: staticFile("berkay-isik-profil.png"),
  muzik: staticFile("shorts_muzik.wav"),
  whoosh: staticFile("whoosh.wav"),
};
export const ShortKomp: React.FC<{ i: number }> = ({ i }) => <Short v={SHORTLAR[i]} k={kaynak} />;
