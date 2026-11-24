# Ahmet E-Ticarete Başlamak İstiyor — Bölüm 1 (stilize versiyon)

- Prodüksiyon planı (storyboard, promptlar, VO, müzik): Claude Docs belgesi "Ahmet E-Ticarete Başlamak İstiyor — Bölüm 1 · Prodüksiyon Planı".
- Kullanıcı API'li fotogerçekçi üretim yerine **kodla stilize** versiyonu seçti.
- 1080x1920, 24 fps, 60 sn, 20 çekim (`src/Film.tsx` CEKIMLER). Karakter `src/ahmet.tsx`, mekân/çekim bileşenleri `src/sahneler.tsx`.
- Seslendirme: Piper TTS `tr_TR-dfki-medium` (HF rhasspy/piper-voices), satır satır `calisma/vo/`; iç ses pitch +7%, kuru.
- Müzik + SFX tamamen sentez: `calisma/ses.py` -> `calisma/ana_ses_ham.wav` -> loudnorm -> `girdiler/ana_ses.wav`. 0:19'da müzik durur, 0:32 umutlu tema.
- Çıktı: `ciktilar/Ahmet_Bolum1_Stilize.mp4`.

## v2 (referans: referanslar/ref_kas.mp4 — "Kaslar neden büyür?" açıklayıcı video)
- Referanstan alınanlar: soruyla kanca, merak köprüleri ("Ama…", "Peki sonra ne oldu?"), sonda izleyiciye dönen soru;
  üstte 2 satır başlık (beyaz + renkli), altta cümle altyazısı (anahtar kelimeler turuncu), seslendirmenin ~15-20 dB altında kesintisiz müzik zemini, köprülerde vurgu sesi.
- Metin, başlıklar ve vurgular `src/plan.json` (ses.py ve Film.tsx aynı dosyayı okur).
- Yüzün önündeki mavi hare: karakterin üstüne çizilen ekran/telefon ışığı elipsleri kaldırıldı, yüz ışık geçişi yumuşatıldı.

## v3 — Bölüm 2 bağlantısı (61 sn)
- Final: "Her şey yolunda gibiydi." → "Ta ki birkaç gün sonra, telefonuna o mesaj gelene kadar." (masadaki telefon titrer, bildirim yazısı bulanık)
  → "O mesajda ne yazıyordu?" → final kartı "BÖLÜM 2 · ÇOK YAKINDA" + @sifirdansatisa TAKİP ET → TAKİPTESİN, VO "Cevabı, ikinci bölümde."
- Mesaj içeriği bilinçli olarak gizli (kolay para / sipariş imasından kaçınıldı). Bölüm 2 bu mesajla açılmalı.
- 52.8 sn'de umutlu tema çekilir, 53–58.3 gerilim (hızlanan nabız + disonans), 58.3 vurgu.

## v4 — ElevenLabs seslendirme + dramatik müzik (62,6 sn)
- Ses: ElevenLabs `eleven_v3`, language_code=tr. Ücretsiz plan: kütüphane (Türk) sesleri API'de kullanılamıyor, hazır sesler kullanıldı:
  anlatıcı **Brian**, iç ses **Liam** ([whispers]/[sighs]). Duygu etiketleri: [dramatic], [serious]. Çıkış formatı mp3_44100_128 (192 ücretli).
- Her satır Whisper ile birebir doğrulandı; uymayan satırlar otomatik yeniden üretildi (calisma/vo_el/).
- Anahtar ortamda kayıtlı (api.elevenlabs.io, xi-api-key, proxy enjekte eder) — kodda `xi-api-key: proxy-injected` yeter.
- Müzik: `calisma/muzik_dramatik.py` (ses.py içine gömülü) — 100 BPM re minör fragman tarzı: braam, boom, tom, ostinato, riser,
  0:19 düşüş + kalp atışı, 0:29,6 büyük vuruş, 0:42 patlama + majör sabah teması, 52,75–59,7 hızlanan tik cliffhanger. Seslendirme altında ducking.
- Final kaydı: 6C telefon 55,3–59,7, Bölüm 2 kartı 59,7–62,5.

## Referans ses eşleştirmesi (referanslar/ref_ses_fb.mp4)
- Ses klonlanmadı (başka kanalın sesi). Bunun yerine ElevenLabs Türkçe erkek kütüphanesi (1185 ses) Resemblyzer konuşmacı benzerliğiyle tarandı (referans Demucs ile müzikten ayrıldı).
- En yakın: **Emrullah Tuna - Deep & Full** (voice_id QftNgZhlSOYKrYbk7WR7) benzerlik 0.921; ikinci 0.858 → referans büyük olasılıkla bu kütüphane sesini kullanıyor.
- Kullanmak için ElevenLabs ücretli plan (Starter+) gerekli: ücretsiz plan kütüphane seslerini API'de kullandırmıyor.

## v5 — Berkay'ın kendi sesi (kullanıcı onayı: "Sesimi kullanabilirsin")
- DÜZELTME: v4'te ses.py yaması yarıda kalmış, VO hâlâ Piper (calisma/vo/) okunuyordu → v4 aslında Piper sesiyle çıktı. Kullanıcıya bildirildi.
- Model: Chatterbox Multilingual (Resemble AI, MIT lisans, ticari kullanım serbest), language_id="tr". XTTS-v2 lisansı ticari kullanıma kapalı olduğu için kullanılmadı.
- Referans: Ankara reklamı IMG_7287_ses.wav 9.6–17.6 sn (Demucs temiz, akıcı bölüm) → calisma/ref_berkay.wav.
- Kurulum notları: torch 2.15 + torchaudio 2.11.1 (--no-deps), torchaudio.load/save soundfile ile yamalandı; chatterbox-tts --no-deps + bağımlılıklar elle.
- calisma/vo_berkay.py: her satır ≤5 deneme, Whisper birebir eşleşene kadar; sonra enerji tabanlı kırpma (son: -42 dB altına 120 ms düşene kadar).
  Kırpılmış dosyalar da Whisper ile tekrar doğrulanmalı (n13'te baş kırpma "Pe"yi yemişti → yeniden üretildi).
- Ses benzerliği (Resemblyzer, Berkay'ın başka kaydıyla): ~0.78–0.80.

## v6 — Berkay'ın kendi okuması (girdiler/kayit/berkay_kayit.m4a, 66 sn) — 67,8 sn
- Temizlik: Demucs htdemucs_ft vocals → highpass/afftdn/agate/compressor/EQ → calisma/vo_kayit/temiz.wav (zemin -69 dB).
- `calisma/kayit_kes.py`: Whisper kelime zamanları + komşu satırlar arası enerji minimumu ile 22 satıra bölme; eşik -30 dB
  (nefesler -36/-40 dB), yumuşak satırlar (n3, n5) -40 dB. "Cevabı ikinci bölümde" iki kez okunmuş → ikinci okuma.
- Kısa klipleri Whisper tek başına uyduruyor (0,9 sn "ne satacak" → "İzlediğiniz için..."): doğrulamayı komşu satırlarla birleştirip yap.
- Metin kullanıcının okuduğu hale uyarlandı (…bir şey daha var / …mümkün / Peki ya sonra ne olacak? / fark etmişti) + yeni son satır n20 (takip çağrısı).
- Final kartı 59,7–67,8; TAKİP ET tıklaması "takip" kelimesinde (plan.json takipTik=65.39).

## v7 — kayıt hataları denetimi
- Kayıt sessizliklerden adacıklara bölünüp her adacık ayrı çözümlendi (Whisper tekrarları birleştiriyordu).
- Bulunan: n12 başında yarım kalan "Kendi ürününü..." denemesi (28,75–29,5) → atıldı (ELLE n12 30.2'den); n19 iki okuma → ikinci.
- Senaryodan sapan okumalar (yeniden kayıt istendi): n3 "e-ticaret" "ev ticaret" gibi duyuluyor; n11 "bir şey daha var" (→ vardı);
  n12 "mümkün" (→ mümkündü); n13 "Peki ya sonra ne olacak?" (→ Peki sonra ne oldu?); n14 "fark etmişti" (→ fark etti).

## v8 — Berkay ses klonu (67,5 sn)
- Kullanıcı: "sesimi klonla, tüm bölümler için bu klonu kullanacağız". Referans artık anlatım kaydından (eski klon Ankara reklamından → 1,5 yarım ton pes/kalın).
- `araclar/berkay_ses.py` + `calisma/satirlar.json` (senaryonun doğru hali: vardı / mümkündü / Peki sonra ne oldu? / fark etti + n20 takip çağrısı).
- Gerçek kayda benzerlik 0,88–0,91; perde oranı x1.03. calisma/vo_klon/.

## v10 — Türkçe telaffuz denetimi (/turkce-seslendirme)
- GOP denetçisi (araclar/telaffuz.py, wav2vec2 Türkçe CTC, dil modelsiz), eşik Berkay'ın gerçek okumasıyla kalibre.
- Şüpheli bulunup yeniden üretilen: var, başlayacağım, ürününü (3 deneme reddedildi), adımı, Ahmet'in, doğuruyor, aynı.
- Rubberband perde kaydırma ünsüzleri bozuyordu ("kaçırmamak"→"kaçınmamak", "başlayacağım") → %3,5 altı farkta kaydırma yok.
- Kabul kontrolü artık son işlenmiş (netlik) ses üzerinde. 22/22 satır denetimden geçti.

## v11 — Senaryo v2 (senarist) + telaffuz/vurgu denetimli klon (67,9 sn)
- Metin: seriler/ahmet-e-ticaret/bolum1_senaryo_v2.md, satırlar senaryo/satirlar.json (n2: "e-ticaretti" 16 denemede okunamadı → "Ahmet'in fikri ise, e-ticaret.").
- Seslendirme yazımları ("yazim" alanı): "Ama, …", "Önce, …" virgülleri vurguyu başa çekmek için.
- calisma/plan_v2.py zamanlama; telefon titreşimi 56,3 sn ("…titreyene kadar" bitişi), final kartı 60,25 sn.
- Dinleme listesi: n2 "Ahmet'in" (GOP -0,51, cümle başı ölçüm etkisi olabilir), n10 "Ama" (aMA), n16 "sonra", n8 "cevap", n21 "kaçırmamak".

## v12 — Gerçek kayıtlarla ses bandı (real-sound + earshot)
- Müzik: "We Will Get It" (Eugenio Mininni, Mixkit) — earshot rank ile 15 adaydan seçildi; 5 segment, bar 117 drop = 42,0 sn (sabah).
- Efektler: Mixkit + Freesound CC0 (lisanslar sayfalarından doğrulandı) — audio/sounddesign.json, out/cues.json (40 olay), CREDITS.md.
- mix.py → out/audio/soundtrack.wav (-14,0 LUFS, -2,3 dBTP); qa.py: kenar kusuru 0; seslendirme müzik altında (-7 dB ducking) net.
- Video: v11 görüntüsü + yeni ses (mux) → ciktilar/Ahmet_Bolum1_v12_Gercek_Ses.mp4.
- Not: qa.py, cue türü "place" olunca serbest yerleştirmelerle karışıyor → tür adı "set".

## v13 — sakin, akıcı, alttan gelen müzik
- Kullanıcı: v12 "çok dramatik"; akıcı, baskın olmayan, alttan gelen müzik istendi.
- 110 Mixkit adayı (ambient/chillout/new age/elektronika/sakin film müziği) earshot rank + match ile: "Relaxation 05" (Lily J) — %91 sakin/umutlu,
  ses seviyesi düz (std 4 dB), saniyede ~1 vuruş. Filmdeki müzik kanalı %94 sakin/umutlu (v12 müziği %17).
- Kesintisiz akış (0:19 sert kesme yerine -5 dB yumuşak kısılma), final kartında parçanın kendi bitişi.
- Müzik tabanı -9 dB, konuşmada ek -9 dB. Vuruşlar, riser, kalp atışı çıkarıldı; saat tiki -4 dB. Eski tasarım: audio/sounddesign_v12_dramatik.json.

## v14 — dinamik, hafif gerilimli, dramatik olmayan müzik
- Kullanıcı: v13 ambient pad hâlâ "çok fazla ve dramatik"; dinamik + hafif gerilimli + dramatik olmayan istendi.
- 83 aday (elektronik/hip hop/downtempo/underscore/tech) earshot ile: "New Bass 02" (Lily J) — minimal elektronik, hedefe %94; dramatik/neşeli 0.
- Ritimsiz gergin giriş 0–29,5; ritim "Ama…" (29,53) anında girer; finalde parçanın kendi sönüşü (82,3–90).
- Müzik tabanı -13 dB + konuşmada -9 dB → müzik kanalı seslendirmenin ~16 dB altında. Önceki tasarımlar: sounddesign_v12_dramatik.json, sounddesign_v13_sakin.json.
- Ders: pad ağırlıklı ambient (rüya gibi, eterik) kullanıcıya "dramatik" geliyor; ritmik minimal elektronik daha uygun.
