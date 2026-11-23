"""Senaryo v2 -> src/plan.json (seslendirme zamanları, başlıklar, vurgular) + ses.py VO klasörü.
Satırlar planlanan anlara yerleşir; çakışırsa sonraki satır kayar (en az 0.15 sn boşluk)."""
import json, subprocess, numpy as np

D = json.load(open("calisma/vo_v2/sureler.json"))
S = json.load(open("senaryo/satirlar.json"))
HEDEF = {"n1": 0.4, "n2": 3.0, "n3": 5.6, "n4": 8.7, "n5": 10.6, "n6": 12.0, "n7": 14.6, "n8": 17.0,
         "i1": 21.3, "i2": 24.0, "n9": 26.2, "n10": 29.6, "n11": 32.4, "n12": 35.3, "n13": 38.85,
         "n14": 42.8, "n15": 45.4, "n16": 47.3, "n17": 51.0, "n18": None, "n19": 57.5, "n20": 59.9, "n21": None}
TITRESIM = 55.6          # 6C telefon titreşimi: n18 bu anda bitmeli
vo, t_son = [], 0.0
for s in S:
    k = s["k"]; du = D[k][1]
    if k == "n18": bas = max(t_son + 0.15, TITRESIM - du - 0.05)
    elif HEDEF.get(k) is None: bas = t_son + 0.35
    else: bas = max(HEDEF[k], t_son + 0.15)
    vo.append({"k": k, "metin": s["metin"], "bas": round(bas, 2), "son": round(bas + du, 2), "ic": bool(s.get("ic"))})
    t_son = bas + du
for v in vo: print(f"{v['k']:4s} {v['bas']:6.2f}-{v['son']:6.2f}  {v['metin']}")
P = json.load(open("src/plan.json"))
P["vo"] = vo
P["basliklar"] = [
 {"bas": 0.0, "son": 8.0, "s1": "HERKESİN BİR", "s2": "GECE YARISI FİKRİ", "renk": "#F67102"},
 {"bas": 8.6, "son": 19.0, "s1": "SORULAR", "s2": "ÇOĞALIYOR", "renk": "#FF5A5A"},
 {"bas": 26.2, "son": 29.3, "s1": "ÇOĞU HİKÂYE", "s2": "BURADA BİTER", "renk": "#FF5A5A"},
 {"bas": 29.6, "son": 38.3, "s1": "AKLINA GELMEYEN", "s2": "BİR SORU", "renk": "#5AB4FF"},
 {"bas": 38.5, "son": 41.7, "s1": "PEKİ SONRA", "s2": "NE OLDU?", "renk": "#F67102", "orta": True},
 {"bas": 42.8, "son": 50.9, "s1": "ÖNCE DOĞRU MODEL", "s2": "SONRA İLK ADIM", "renk": "#2ED47A"},
 {"bas": 52.75, "son": 55.3, "s1": "ÜÇ GÜN SONRA", "s2": "O MESAJ", "renk": "#FF5A5A"},
 {"bas": 57.5, "son": 59.65, "s1": "O MESAJDA", "s2": "NE YAZIYORDU?", "renk": "#F67102"}]
P["vurgu"] = ["gece", "fikri", "e-ticaretti", "karar", "masum", "sekmeler", "satacaktı", "bulacaktı", "şart", "stokları", "iki", "yeni",
              "bilmiyorum", "göre", "değil", "hikâyesi", "biter", "uyuyamadı", "soru", "üretmeden", "stok", "tutmadan", "mümkünse",
              "sonra", "liste", "gerekmiyordu", "doğru", "modeli", "ilk", "adımı", "rahattı", "üç", "titreyene", "mesajı", "kaldı",
              "mesajda", "ikinci", "takip"]
# TAKİP ET tıklaması: n21'deki "takip" kelimesinin anı
from faster_whisper import WhisperModel
wm = WhisperModel("mobiuslabsgmbh/faster-whisper-large-v3-turbo", device="cpu", compute_type="int8")
a = subprocess.run(["ffmpeg", "-v", "error", "-i", "calisma/vo_v2/n21.wav", "-ac", "1", "-ar", "16000", "-f", "s16le", "-"], capture_output=True).stdout
a = np.concatenate([np.zeros(8000, np.float32), np.frombuffer(a, np.int16).astype(np.float32) / 32768])
tk = [x.start - 0.5 for s in wm.transcribe(a, language="tr", word_timestamps=True)[0] for x in s.words if x.word.strip().lower().startswith("takip")]
n21 = [v for v in vo if v["k"] == "n21"][0]
P["takipTik"] = round(n21["bas"] + (tk[0] if tk else 2.5), 2)
P["bitis"] = round(vo[-1]["son"] + 0.6, 2)
json.dump(P, open("src/plan.json", "w"), ensure_ascii=False, indent=1)
print("takip", P["takipTik"], "bitiş", P["bitis"])
s = open("calisma/ses.py").read()
import re
s = re.sub(r'VO_DIR = "[^"]*"', 'VO_DIR = "calisma/vo_v2"', s, count=1)
s = re.sub(r"DUR = [0-9.]+", f"DUR = {max(67.9, P['bitis'] + 0.3):.1f}", s, count=1)
open("calisma/ses.py", "w").write(s)
