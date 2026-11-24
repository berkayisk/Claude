# GSAP AI Skills (vendored)

Kaynak: https://github.com/greensock/gsap-skills — resmi GreenSock skilleri, commit aed9cfd, MIT.
Değiştirilmeden `.claude/skills/` altına kopyalandı. GSAP ve tüm eklentileri (SplitText, MorphSVG…) ticari kullanım dahil ücretsiz, `gsap` npm paketinden.

Remotion ile kullanırken: GSAP zaman çizelgesini oluşturup `paused: true` yap ve her karede
`tl.seek(frame / fps)` (ya da `tl.progress(...)`) ile Remotion'un `useCurrentFrame()` değerine bağla;
gerçek zamanlı oynatmaya güvenme, aksi halde render kareleri tutarsız olur.

Skiller: gsap-core gsap-frameworks gsap-performance gsap-plugins gsap-react gsap-scrolltrigger gsap-timeline gsap-utils 
