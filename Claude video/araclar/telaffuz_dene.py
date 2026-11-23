"""Yanlış okunan bir kelime için seslendirme yazımı bulur ve sözlüğe ekler.
Kullanım: python3 araclar/telaffuz_dene.py "kelime" "Kelimenin geçtiği örnek cümle." [ek yazım adayları...]
Her aday yazım 3 tohumla üretilir; Whisper doğru okumalı, kelimenin GOP puanı (araclar/telaffuz.py) en yüksek olan seçilir.
Seçilen yazım araclar/telaffuz_sozluk.json'a yazılır (asıl kelime -> seslendirme yazımı)."""
import sys, os, json, re, subprocess, numpy as np, torch
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
import berkay_ses as B
from telaffuz import Denetci, kelimeler

UNLU = set("aeıioöuüAEIİOÖUÜ")
def hecele(k):
    """Türkçe heceleme: ünlüden önceki tek ünsüz yeni heceyi başlatır (ka-ra-rın, baş-la-ya-ca-ğım)"""
    h, cur = [], ""
    for i, ch in enumerate(k):
        if ch not in UNLU and i + 1 < len(k) and k[i + 1] in UNLU and any(c in UNLU for c in cur):
            h.append(cur); cur = ""
        cur += ch
    h.append(cur); return h

def adaylar(k):
    a = [k, "-".join(hecele(k)), " ".join(hecele(k)) if len(hecele(k)) <= 3 else k, k.replace("ğ", "").replace("Ğ", ""), k.replace("'", "")]
    return list(dict.fromkeys([x for x in a if x]))

def main():
    kelime, cumle = sys.argv[1], sys.argv[2]
    ekstra = sys.argv[3:]
    from chatterbox.mtl_tts import ChatterboxMultilingualTTS
    m = ChatterboxMultilingualTTS.from_pretrained(device="cpu"); dn = Denetci()
    hedef = kelimeler(kelime)[0]
    sonuc = []
    for yaz in adaylar(kelime) + ekstra:
        metin_tts = re.sub(re.escape(kelime), yaz, cumle, flags=re.IGNORECASE)
        puanlar = []
        for t in range(3):
            torch.manual_seed(500 + t * 7)
            w = m.generate(metin_tts, language_id="tr", audio_prompt_path=B.REF, exaggeration=0.5, cfg_weight=0.5).squeeze().numpy()
            w = B.kirp(w, m.sr)
            w16 = subprocess.run(["ffmpeg", "-v", "error", "-f", "f32le", "-ar", str(m.sr), "-ac", "1", "-i", "-", "-ar", "16000", "-f", "f32le", "-"],
                                 input=w.astype(np.float32).tobytes(), capture_output=True).stdout
            pu = dn.kelime_puanlari(np.frombuffer(w16, np.float32).copy(), cumle)
            puanlar += [o for x, o, _ in pu if x == hedef]
        ort = float(np.mean(puanlar)) if puanlar else -9
        sonuc.append((ort, yaz)); print(f"  {yaz:20s} ort GOP {ort:.2f}", flush=True)
    en = max(sonuc)
    soz = json.load(open(B.SOZLUK))
    if en[1] != kelime: soz[kelime] = en[1]
    json.dump(soz, open(B.SOZLUK, "w"), ensure_ascii=False, indent=1)
    print(f"seçilen: {kelime} -> {en[1]} (GOP {en[0]:.2f})")

if __name__ == "__main__":
    main()
