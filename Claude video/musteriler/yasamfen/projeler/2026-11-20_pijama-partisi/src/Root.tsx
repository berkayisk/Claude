import React from "react";
import { Composition, Still } from "remotion";
import { Onizleme, ONIZLEME_SURE } from "./Onizleme";
import { Kurgu, KurguVeri } from "../../../bilesenler/Kurgu";
import { Kapak, KapakProps } from "../../../bilesenler/Kapak";
import { Ikili } from "../../../bilesenler/Ikili";

// Her video: src/<ad>.json (calisma/kurgu_yap.py üretir). Dosya yoksa atlanır.
const VIDEOLAR: [string, string][] = [
  ["Yarisma1", "yarisma1"],
  ["Yarisma2", "yarisma2"],
  ["Vampir1", "vampir1"],
  ["Vampir2", "vampir2"],
  ["Genel", "genel"],
  ["Kombin", "kombin"],
  ["Hocalar", "hocalar"],
  ["Yks", "yks"],
  ["KomikYks", "komik_yks"],
  ["KomikParti", "komik_parti"],
  ["ViralTren", "viral_tren"],
  ["ViralHoroz", "viral_horoz"],
  ["ViralMusa", "viral_musa"],
  ["ViralSekiz", "viral_sekiz"],
  ["ViralSaniye", "viral_saniye"],
  ["ViralVampirKim", "viral_vampirkim"],
];
// Reels kapakları (1080x1920): id → props
const KAPAKLAR: [string, KapakProps][] = [
  ["Kapak-yarisma1", { arka: "kapak/yarisma1.jpg", ust: "LGS BİLGİ YARIŞMASI", satir1: "SEN KAÇ", satir2: "TANESİNİ BİLİRDİN?", alt: "8 soru · 2 takım 🧠", boyut: 120 }],
  ["Kapak-yarisma2", { arka: "kapak/yarisma2.jpg", ust: "LGS BİLGİ YARIŞMASI #2", satir1: "KAZANAN", satir2: "KİM OLDU?", alt: "Son soru şaşırtmaca 🚂" }],
  ["Kapak-vampir1", { arka: "kapak/vampir1.jpg", ust: "PİJAMA PARTİSİ", satir1: "VAMPİR", satir2: "KÖYLÜ 🧛", alt: "Hocalar vs öğrenciler", odakY: 0.3 }],
  ["Kapak-vampir2", { arka: "kapak/vampir2.jpg", ust: "VAMPİR KÖYLÜ", satir1: "KENDİSİ", satir2: "VAMPİR 🤫", alt: "Masum görünüyor değil mi?", odakY: 0.3 }],
  ["Kapak-genel", { arka: "kapak/genel.jpg", ust: "YAŞAMFEN KURS", satir1: "PİJAMA", satir2: "PARTİSİ 🎉", alt: "Kamp haftasının finali", odakY: 0.25 }],
  ["Kapak-kombin", { arka: "kapak/kombin.jpg", ust: "PİJAMA PARTİSİ", satir1: "PİJAMA", satir2: "KOMBİNLERİ 💤", alt: "Favorin hangisi?", odakY: 0.25, boyut: 112 }],
  ["Kapak-hocalar", { arka: "kapak/hocalar.jpg", ust: "PİJAMA PARTİSİ", satir1: "HOCALARIMIZ", satir2: "NE DEDİ? 🎤", alt: "Kamp haftası değerlendirmesi", odakY: 0.2, boyut: 118 }],
  ["Kapak-yks", { arka: "kapak/yks.jpg", ust: "TYT BİLGİ YARIŞMASI", satir1: "MF mi", satir2: "TM mi? 🏆", alt: "Sen kaç tanesini bilirdin?" }],
  ["Kapak-komik-yks", { arka: "kapak/komik_yks.jpg", ust: "TYT YARIŞMASI", satir1: "KİMSE CİDDİ", satir2: "DEĞİLDİ 😂", alt: "En komik anlar", boyut: 130 }],
  ["Kapak-komik-parti", { arka: "kapak/komik_parti.jpg", ust: "PİJAMA PARTİSİ", satir1: "GÜLMEDEN", satir2: "İZLEYEMEZSİN 😂", alt: "En komik anlar", odakY: 0.25, boyut: 120 }],
  ["Kapak-viral-tren", { arka: "kapak/viral_tren.jpg", ust: "ŞAŞIRTMACA SORU", satir1: "%90'I 🤯", satir2: "YANLIŞ BİLİYOR", alt: "Elektrikli tren sorusu 🚂", boyut: 100 }],
  ["Kapak-viral-horoz", { arka: "kapak/viral_horoz.jpg", ust: "ŞAŞIRTMACA SORU", satir1: "HOROZ", satir2: "YUMURTLADI 🐓", alt: "Yumurta sağa mı düşer, sola mı?", boyut: 108 }],
  ["Kapak-viral-musa", { arka: "kapak/viral_musa.jpg", ust: "ŞAŞIRTMACA SORU", satir1: "DİKKATLİ", satir2: "DİNLE! 🚢", alt: "Musa gemisine kaç hayvan aldı?" }],
  ["Kapak-viral-sekiz", { arka: "kapak/viral_sekiz.jpg", ust: "TYT BİLGİ YARIŞMASI", satir1: "LİSE SON BİLEMEDİ", satir2: "8. SINIF BİLDİ 😳", alt: "DNA sorusu 🧬", boyut: 90 }],
  ["Kapak-viral-saniye", { arka: "kapak/viral_saniye.jpg", ust: "LGS MATEMATİK", satir1: "KAÇ SANİYEDE", satir2: "ÇÖZERSİN? ⏱️", alt: "√320 + √1280 = ?", boyut: 108 }],
  ["Kapak-viral-vampirkim", { arka: "kapak/viral_vampirkim.jpg", ust: "VAMPİR KÖYLÜ", satir1: "SENCE", satir2: "VAMPİR KİM? 🧛", alt: "Tahminini yoruma yaz 👇", odakY: 0.3, boyut: 108 }],
  ["Kapak-kombin-savasi", { arka: "kapak/kombin_savasi.jpg", ust: "PİJAMA PARTİSİ", satir1: "HANGİSİ?", satir2: "1 mi 2 mi? 🤔", alt: "Kombin savaşı 💤", odakY: 0.3, boyut: 130 }],
];

const yukle = (ad: string): KurguVeri | null => {
  try { return require(`./${ad}.json`) as KurguVeri; } catch { return null; }
};

export const RemotionRoot: React.FC = () => (
  <>
    <Composition id="Onizleme" component={Onizleme} durationInFrames={ONIZLEME_SURE} fps={30} width={1080} height={1920} />
    <Composition id="KombinSavasi" component={() => <Ikili sol={{ src: "vekil/7383.mp4", bas: 3.6, odakX: 0.62 }} sag={{ src: "vekil/7382.mp4", bas: 0.3, odakX: 0.42 }}
      ust="PİJAMA PARTİSİ" baslik={"HANGİSİ? 🤔"} alt="1 mi 2 mi? Yorumlara yaz 👇" />} durationInFrames={240} fps={30} width={1080} height={1920} />
    {KAPAKLAR.map(([id, p]) => <Still key={id} id={id} component={() => <Kapak {...p} />} width={1080} height={1920} />)}
    {VIDEOLAR.map(([id, ad]) => {
      const v = yukle(ad);
      if (!v) return null;
      return <Composition key={id} id={id} component={() => <Kurgu v={v} />} durationInFrames={v.toplamKare} fps={30} width={1080} height={1920} />;
    })}
  </>
);
