---
name: yt-dlp
description: YouTube, Instagram, TikTok vb. sitelerden video/ses/altyazı/kapak indirir (yt-dlp) — referans videolar, kanal stili incelemesi, b-roll, müzik referansı için. "indir", "YouTube'dan al", "bu linki indir", "videoyu çek", "sesini al", "altyazısını al", "yt-dlp", bir video linki verildiğinde kullan.
---

# yt-dlp ile indirme

## Kurulum
Ortamın açılış betiği `pip install -U yt-dlp` çalıştırır. Yoksa: `pip install -q -U yt-dlp`.
ffmpeg hazır (`/usr/local/bin/ffmpeg`, birleştirme ve ses çıkarma için gerekli).

## Nereye indirilir
- Bir projeye aitse: `Claude video/projeler/<proje>/referanslar/`
- Kanal stili referansıysa: `Claude video/kanal-referanslari/<kanal>/`
- Geçici işler: scratchpad.
Büyük video dosyalarını **git'e ekleme** (repo şişer); gerekiyorsa sadece kareleri/notları commit et.

## Tarifler
```bash
# Remotion'a uygun MP4 (H.264 + AAC), en fazla 1080p
yt-dlp -f "bv*[vcodec^=avc1][height<=1080]+ba[ext=m4a]/b[ext=mp4]/b" --merge-output-format mp4 \
  -o "%(title).80s [%(id)s].%(ext)s" URL

# Sadece ses (wav — earshot / ses analizi için; mp3 için --audio-format mp3)
yt-dlp -x --audio-format wav -o "%(title).80s.%(ext)s" URL

# Sadece belirli bir aralık (ör. 1:05–1:30)
yt-dlp --download-sections "*00:01:05-00:01:30" --force-keyframes-at-cuts -f "b[ext=mp4]/b" URL

# Altyazı (Türkçe, yoksa otomatik), videosuz
yt-dlp --skip-download --write-subs --write-auto-subs --sub-langs "tr.*,en.*" --convert-subs srt URL

# Kapak görseli + bilgi (indirmeden)
yt-dlp --skip-download --write-thumbnail --convert-thumbnails jpg URL
yt-dlp -J --no-playlist URL > bilgi.json     # başlık, süre, kanal, formatlar

# Oynatma listesi / kanalın son N videosu
yt-dlp -I 1:5 -o "%(playlist_index)02d - %(title).60s.%(ext)s" URL
```
Stil incelemesi için kare çıkarmak: `ffmpeg -i video.mp4 -vf "fps=1/2,scale=720:-1" kareler/%03d.jpg`

## Bulut oturumunda bilinen durum (önemli)
- Ağ: `claude-video` ortamında `www.youtube.com`, `youtube.com`, `m.youtube.com`, `youtubei.googleapis.com`, `i.ytimg.com` izinli.
  Video akışları `*.googlevideo.com` alt alan adlarından gelir; bu joker alan adı ortam ayarlarından (Network access → Allowed domains) kullanıcı tarafından eklenmelidir. 403 "no rule allows host" görürsen hangi host olduğunu kullanıcıya söyle.
- YouTube bulut sunucu IP'lerinde sık sık **"Sign in to confirm you're not a bot"** hatası verir. Bot kontrolünü atlatmaya çalışma (uzaktan betik indirme, istemci taklidi vb.). Bunun yerine kullanıcıya seçenek sun:
  1. Videoyu kendi bilgisayarında indirip repoya/oturuma yüklesin (ya da Google Drive linki versin — `gdown` kurulu, Drive izinli).
  2. Kendi tarayıcısından dışa aktardığı `cookies.txt` dosyasını yüklesin → `yt-dlp --cookies cookies.txt ...`.
     Bu dosya hesap oturumu taşır: **asla commit etme**, işten sonra sil, kullanıcıya bunu hatırlat.
- Instagram: `www.instagram.com` izinli ama medya CDN'i (`*.cdninstagram.com`, `*.fbcdn.net`) değil; aynı şekilde joker alan adı ayarlardan eklenmeli.

## Telif
İndirilen içerik başkasınındır: referans/inceleme için kullan; yayınlanacak videoya koymadan önce lisansını kullanıcıyla netleştir (müzik için `real-sound` skill'indeki lisans kurallarına bak).
