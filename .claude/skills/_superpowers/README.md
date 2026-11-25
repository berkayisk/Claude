# Superpowers (vendored)

Kaynak: https://github.com/obra/superpowers — v7.0.2, commit 22f0b46, MIT (Jesse Vincent). Lisans: LICENSE.

14 skill `.claude/skills/` altına doğrudan kopyalandı (eklenti yerine), çünkü bulut oturumlarında
`~/.claude` her oturumda silinir; repodaki skiller ise her oturumda yüklenir.

Uyarlama: skill içindeki `superpowers:<isim>` atıfları `<isim>` yapıldı (proje skillerinde ad alanı yok).
Eklentinin SessionStart kancası (her oturuma using-superpowers'ı zorunlu enjekte eder) kurulmadı.

Güncellemek için: repoyu yeniden klonla, `skills/` içeriğini buraya kopyala, aynı sed uyarlamasını uygula.

Skiller: brainstorming diagnosing-superpowers dispatching-parallel-agents executing-plans finishing-a-development-branch receiving-code-review requesting-code-review subagent-driven-development systematic-debugging test-driven-development using-git-worktrees using-superpowers verification-before-completion writing-plans writing-skills 
