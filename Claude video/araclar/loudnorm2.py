"""İki geçişli loudnorm (EBU R128) — ffmpeg 6 ve 9+ ile uyumlu.
Kullanım: python3 araclar/loudnorm2.py girdi.mp4 cikti.mp4 [--lufs -14] [--tp -1.5] [--video copy|reencode] [--ab 256k]
1. geçiş: ölçüm (JSON bloğu çıktının neresinde olursa olsun ayıklanır; ffmpeg 9 JSON'dan sonra özet satırları yazar).
2. geçiş: linear=true ile uygulanır; video kopyalanır (varsayılan), ses AAC.
Sonunda ölçülen entegre yüksekliği yazar."""
import sys, re, json, subprocess, argparse

def olc(girdi, lufs, tp, lra):
    r = subprocess.run(["ffmpeg", "-hide_banner", "-nostats", "-i", girdi, "-vn", "-af",
                        f"loudnorm=I={lufs}:TP={tp}:LRA={lra}:print_format=json", "-f", "null", "-"],
                       capture_output=True, text=True)
    bloklar = re.findall(r"\{[^{}]*\"input_i\"[^{}]*\}", r.stderr, re.S)
    if not bloklar: raise SystemExit("loudnorm ölçümü okunamadı:\n" + r.stderr[-800:])
    return json.loads(bloklar[-1])

def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("girdi"); ap.add_argument("cikti")
    ap.add_argument("--lufs", type=float, default=-14); ap.add_argument("--tp", type=float, default=-1.5)
    ap.add_argument("--lra", type=float, default=11); ap.add_argument("--video", default="copy"); ap.add_argument("--ab", default="256k")
    a = ap.parse_args()
    j = olc(a.girdi, a.lufs, a.tp, a.lra)
    f = (f"loudnorm=I={a.lufs}:TP={a.tp}:LRA={a.lra}:measured_I={j['input_i']}:measured_TP={j['input_tp']}:"
         f"measured_LRA={j['input_lra']}:measured_thresh={j['input_thresh']}:offset={j['target_offset']}:linear=true,aresample=48000")
    v = ["-c:v", "copy"] if a.video == "copy" else ["-c:v", "libx264", "-crf", "18", "-pix_fmt", "yuv420p"]
    subprocess.run(["ffmpeg", "-v", "error", "-y", "-i", a.girdi, *v, "-af", f, "-c:a", "aac", "-b:a", a.ab, "-movflags", "+faststart", a.cikti], check=True)
    son = olc(a.cikti, a.lufs, a.tp, a.lra)
    print(f"{a.cikti}: {son['input_i']} LUFS, gerçek tepe {son['input_tp']} dBTP")

if __name__ == "__main__":
    main()
