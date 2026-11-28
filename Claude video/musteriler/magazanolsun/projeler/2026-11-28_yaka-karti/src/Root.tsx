import React from "react";
import { Still } from "remotion";
import { YakaKarti } from "./YakaKarti";
// 100 x 140 mm @300 dpi = 1181 x 1654 px (+3 mm taşma payı = 1252 x 1724)
export const RemotionRoot: React.FC = () => (
  <>
    <Still id="YakaKarti" component={YakaKarti} width={1252} height={1724} defaultProps={{ ad: "ONUR ALTUNAY", unvan: "E-ticaret Danışmanı", foto: "kisi_dekupe.png" }} />
  </>
);
