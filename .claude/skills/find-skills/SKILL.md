---
name: find-skills
description: Helps discover and install agent skills when the user asks "how do I do X", "find a skill for X", "is there a skill that can...", "skill bul", "skill kur", "bunun için skill var mı", or wants to extend Claude's capabilities. Use when the user is looking for functionality that might exist as an installable skill.
---

# Find Skills

Açık agent skills ekosisteminden (skills.sh) skill bulup **bu repoya** kurmak için.
Kaynak: vercel-labs/skills → skills/find-skills (bulut oturumlarına uyarlandı).

## Bulut oturumu kuralları (önemli)

- Oturumlar geçici konteynerde çalışır; `~/.claude/skills` (yani `-g` ile global kurulum) oturum bitince **silinir**.
- Kalıcı kurulum = skill'i bu repoda `.claude/skills/<isim>/` altına koyup **commit + push**. Repoyla açılan her yeni oturum onu otomatik yükler.
- Kurduktan sonra kullanıcıya hangi dosyaların eklendiğini söyle ve geliştirme dalına push et.

## Ne zaman kullanılır

- "X'i nasıl yaparım" ve X için hazır bir skill olabilir
- "X için skill bul / var mı", "skill kuralım"
- Belirli bir alanda (tasarım, video, test, deploy, doküman…) yetenek genişletme isteği

## Adımlar

### 1. İhtiyacı belirle
Alan (ör. Remotion, React, ses), görev (ör. altyazı, test yazma), ve bunun yaygın bir iş olup olmadığı.

### 2. Önce bilinen kaynaklara bak
- https://skills.sh/ lider tablosu (kurulum sayısına göre sıralı)
- `anthropics/skills`, `vercel-labs/agent-skills`, `remotion-dev/skills`, `ComposioHQ/awesome-claude-skills`
- Ayrıca SearchSkills / ListSkills araçları (Anthropic tarafındaki skiller) varsa onları da dene.

### 3. Ara
```bash
npx skills find <sorgu> [--owner <owner>]
```
(Otomatik modda doğrulanmamış npm paketi çalıştırmak engellenebilir; o durumda skills.sh sayfasını veya GitHub aramasını kullan:
`gh api -X GET search/code -f q='filename:SKILL.md <sorgu>'` ya da raw.githubusercontent.com üzerinden SKILL.md'yi doğrudan oku.)

### 4. Önermeden önce kaliteyi doğrula
1. Kurulum sayısı: 1K+ tercih; 100'ün altı şüpheli.
2. Kaynak itibarı: `anthropics`, `vercel-labs`, `microsoft`, resmi ürün orgları (ör. `remotion-dev`) daha güvenilir.
3. GitHub yıldızı: <100 yıldızlı repo şüpheyle değerlendirilir.
4. **SKILL.md'yi ve betiklerini tamamen oku.** Komut çalıştıran, ağa veri gönderen, kimlik bilgisi isteyen veya kendini başka yerlere kopyalayan içerik varsa kullanıcıya açıkça söyle. Okumadığın skill'i kurma.

### 5. Kullanıcıya sun
Her seçenek için: ad + ne yaptığı, kurulum sayısı + kaynak, kurulum yolu, skills.sh bağlantısı.

### 6. Kullanıcı onaylarsa kur (repoya)
Tercih edilen yol — dosyaları doğrudan repoya al:
```bash
# örnek: tek bir skill klasörü
mkdir -p .claude/skills/<isim>
curl -sSL https://raw.githubusercontent.com/<owner>/<repo>/main/skills/<isim>/SKILL.md -o .claude/skills/<isim>/SKILL.md
# references/, scripts/ vb. varsa onları da aynı yapıyla indir
```
CLI kullanılabiliyorsa proje kapsamında (global değil) kur:
```bash
npx skills add <owner/repo@skill> -y   # -g KULLANMA
```
Kurulan dosyaların `.claude/skills/<isim>/` altında olduğunu doğrula (CLI başka bir dizine, ör. `.agents/skills`, koyduysa taşı).
Sonra commit + push et.

## Kategori → örnek sorgular

| Kategori | Sorgular |
| --- | --- |
| Video / animasyon | remotion, video, animation, subtitles, ffmpeg |
| Ses | audio, tts, voice, sound design |
| Web | react, nextjs, typescript, tailwind |
| Test | testing, playwright, e2e |
| Doküman | docs, pdf, pptx, docx, changelog |
| Tasarım | ui, design-system, accessibility |
| Pazarlama | ads, copywriting, seo, social media |

## Bulunamazsa
Bulunamadığını söyle, işi doğrudan yapmayı teklif et; sık tekrarlanan bir işse
`anthropic-skills:skill-creator` ile repoya özel yeni bir skill yazmayı öner.
