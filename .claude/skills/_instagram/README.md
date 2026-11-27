# Instagram agent skill (vendored)

Kaynak: https://github.com/Jakeschincariol/instagram-agent-skill — commit d03c56b, MIT.
13 skill (ig-reel, ig-viral, ig-caption, ig-carousel, ig-story, ig-profile, ig-plan, ig-human, ig-audit, ig-comment,
ig-dm, ig-reply, ig-repurpose) `.claude/skills/` altına kopyalandı.

Uyarlama: `~/.claude/instagram/` (bulutta her oturumda silinir) yerine kalıcı repo yolu
`Claude video/marka/sifirdan-satisa/instagram/` kullanılıyor (voice.md, swipe.md, plan.md, log.md). Başka değişiklik yok.
`voice.md` şablon olarak kopyalandı; doldurulmalı (ya da Berkay'ın 3 reels'inden yazdırılmalı).

Skiller yazar, paylaşmaz: hiçbir şey kullanıcı onayı olmadan yayınlanmaz; otomatik beğeni/yorum/DM yapılmaz.
ig-viral araştırması için tarayıcı aracı gerekir (yoksa kullanıcı içerik yapıştırır).
