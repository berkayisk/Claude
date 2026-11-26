# black-friday (2026-11-26)

@eticaretteperdearkasi #2. Şablon: projeler/2026-11-25_fiyat-99-99 (Film.tsx CEKIMLER + kam, calisma/yap.py hizli/plan/dudak/miks).
- Senaryo + doğrulanmış kaynaklar: senaryo/SENARYO.md. VO 1,18x, 15 sahne, 49,6 sn.
- n1 yeniden üretildi (TOHUM=11, yazim "kara... cuma" ile Whisper doğru duydu). İngilizce kelimelerde (Black Friday, Philadelphia) telaffuz denetçisi (Türkçe GOP) yanlış alarm verir; Whisper doğruluyorsa sorun yok.
- Render: `npx remotion render src/index.ts Film ciktilar/black_friday_v1.mp4 --public-dir <abs>/girdiler`
- v2: n1 yeniden üretildi; v1'de "kara... cuma" yazımı tamlamayı böldü ("cuma kara, cuma" duyuldu). Yeni: bitisik denetimi (bu–cuma 0,10 sn, kara–cuma 0,08 sn).
