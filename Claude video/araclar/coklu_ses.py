"""Çok sesli seslendirme: her satır kendi (izinli) klon sesiyle üretilir.

Kullanım:
  python3 araclar/coklu_ses.py satirlar.json cikti_klasoru [--sesler musteriler/<firma>/marka/sesler]
satirlar.json: [{"k":"s01","ses":"anlatici","metin":"..."}, {"k":"s02","ses":"elif","metin":"...","ex":0.5}, ...]
Sesler klasöründe <ses>_referans.wav ve sesler.json ({ses: {"f0": medyan perde, "netlik": "yok" (opsiyonel), "kurut": true (WPE, opsiyonel)}}) bulunur.
Her ses için araclar/berkay_ses.py SES_REF/SES_F0 ile ayrı çalıştırılır (Whisper + telaffuz + vurgu denetimi, perde, netlik).
Çıktı: cikti/<k>.wav (48 kHz mono, satır sırasıyla) + cikti/sureler.json {k: [ses, metin, süre, skor, whisper]}
"""
import sys, os, json, shutil, subprocess

KOK = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
VARSAYILAN = os.path.join(KOK, "musteriler/dogal-yasam-rotasi/marka/sesler")

def main(girdi, cikti, sesler):
    satirlar = json.load(open(girdi))
    bilgi = json.load(open(os.path.join(sesler, "sesler.json")))
    os.makedirs(cikti, exist_ok=True)
    gruplar = {}
    for s in satirlar:
        v = s.get("ses", "anlatici")
        if v not in bilgi: sys.exit(f"bilinmeyen ses: {v} (mevcut: {', '.join(bilgi)})")
        gruplar.setdefault(v, []).append({x: y for x, y in s.items() if x != "ses"})
    for v, liste in gruplar.items():
        alt = os.path.join(cikti, "_" + v); os.makedirs(alt, exist_ok=True)
        yol = os.path.join(alt, "satirlar.json"); json.dump(liste, open(yol, "w"), ensure_ascii=False, indent=1)
        env = dict(os.environ, SES_REF=os.path.join(sesler, f"{v}_referans.wav"), SES_F0=str(bilgi[v]["f0"]), HF_HUB_DISABLE_XET="1")
        if "netlik" in bilgi[v]: env["SES_NETLIK"] = bilgi[v]["netlik"]
        print(f"== {v}: {len(liste)} satır", flush=True)
        subprocess.run([sys.executable, os.path.join(KOK, "araclar/berkay_ses.py"), yol, alt], env=env, check=True)
    ozet = {}
    for s in satirlar:
        v, k = s.get("ses", "anlatici"), s["k"]
        d = json.load(open(os.path.join(cikti, "_" + v, "sureler.json")))[k]
        hedef = os.path.join(cikti, f"{k}.wav")
        shutil.copy(os.path.join(cikti, "_" + v, f"{k}.wav"), hedef)
        if bilgi[v].get("kurut"):   # WPE ile geç yansımaları (yankı) çıkar
            import numpy as np, soundfile as sf
            sys.path.insert(0, os.path.join(KOK, "araclar")); from ses_temizle import wpe_uygula
            x, sr = sf.read(hedef, dtype="float64"); tepe = np.abs(x).max()
            z = wpe_uygula(x, sr, taps=20, iters=5); sf.write(hedef, (z / (np.abs(z).max() + 1e-9) * tepe).astype(np.float32), sr)
        ozet[k] = [v] + d[:4]
    json.dump(ozet, open(os.path.join(cikti, "sureler.json"), "w"), ensure_ascii=False, indent=1)
    zayif = [k for k, x in ozet.items() if x[3] < 0.999]
    print(f"tamam: {len(ozet)} satır" + (f" | kontrol et: {', '.join(zayif)}" if zayif else ""))

if __name__ == "__main__":
    a = sys.argv[1:]
    ses = VARSAYILAN
    if "--sesler" in a: i = a.index("--sesler"); ses = a[i + 1]; del a[i:i + 2]
    main(a[0], a[1], ses)
