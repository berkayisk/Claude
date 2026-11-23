"""Türkçe telaffuz denetçisi (GOP: goodness of pronunciation).
Model: mpoyraz/wav2vec2-xls-r-300m-cv8-turkish (harf düzeyinde CTC, dil modeli YOK -> duyduğunu yazar, aksanı düzeltmez).
Beklenen metin CTC ile sese hizalanır; her kelime için hizalanan karelerin ortalama log-olasılığı = kelime puanı.
Eşik Berkay'ın gerçek okumasından kalibre edilir (kalibrasyon.json). Eşiğin altındaki kelime = şüpheli telaffuz.

Kullanım:
  python3 araclar/telaffuz.py kalibre satirlar.json gercek_klasor/      # Berkay'ın gerçek kayıt satırlarıyla eşik
  python3 araclar/telaffuz.py denetle satirlar.json klasor/             # her satır: kelime puanları + şüpheliler
Python'dan: from telaffuz import Denetci; Denetci().kelime_puanlari(wav16k, metin)
"""
import sys, os, json, re, subprocess, numpy as np

KOK = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
KALIB = os.path.join(KOK, "araclar", "telaffuz_kalibrasyon.json")
MODEL = "mpoyraz/wav2vec2-xls-r-300m-cv8-turkish"

def kucuk(x): return x.replace("İ", "i").replace("I", "ı").lower()
def kelimeler(metin):
    m = kucuk(metin).replace("-", "").replace("’", "'")
    return [w for w in re.sub(r"[^a-zçğıöşü' ]", " ", m).split() if w.strip("'")]

class Denetci:
    def __init__(self):
        import torch
        from transformers import Wav2Vec2ForCTC, Wav2Vec2Processor
        self.torch = torch
        self.proc = Wav2Vec2Processor.from_pretrained(MODEL)
        self.mod = Wav2Vec2ForCTC.from_pretrained(MODEL).eval()
        self.vocab = self.proc.tokenizer.get_vocab()
        self.esik = json.load(open(KALIB))["esik"] if os.path.exists(KALIB) else -1.0

    def logp(self, a):
        with self.torch.no_grad():
            x = self.proc(a, sampling_rate=16000, return_tensors="pt").input_values
            lg = self.mod(x).logits[0]
        return self.torch.log_softmax(lg, -1).numpy()   # (T, V)

    def hizala(self, lp, hedef):
        """CTC Viterbi zorunlu hizalama. hedef: etiket kimlikleri. Dönüş: her etiket için kare aralığı."""
        T = lp.shape[0]; blank = 0
        ext = [blank]
        for t in hedef: ext += [t, blank]
        S = len(ext); NEG = -1e9
        D = np.full((T, S), NEG); B = np.zeros((T, S), np.int32)
        D[0, 0] = lp[0, ext[0]]
        if S > 1: D[0, 1] = lp[0, ext[1]]
        for t in range(1, T):
            for s in range(S):
                c = [(D[t - 1, s], s)]
                if s >= 1: c.append((D[t - 1, s - 1], s - 1))
                if s >= 2 and ext[s] != blank and ext[s] != ext[s - 2]: c.append((D[t - 1, s - 2], s - 2))
                v, k = max(c)
                D[t, s] = v + lp[t, ext[s]]; B[t, s] = k
        s = S - 1 if S < 2 or D[T - 1, S - 1] >= D[T - 1, S - 2] else S - 2
        yol = []
        for t in range(T - 1, -1, -1):
            yol.append((t, s)); s = B[t, s]
        yol.reverse()
        kareler = {}
        for t, s in yol:
            if ext[s] != blank: kareler.setdefault((s - 1) // 2, []).append(t)
        return kareler

    def kelime_puanlari(self, a, metin):
        ws = kelimeler(metin)
        ids, sinir = [], []
        for w in ws:
            bas = len(ids)
            ids += [self.vocab[ch] for ch in w if ch in self.vocab]
            sinir.append((bas, len(ids)))
            ids.append(self.vocab["|"])
        ids = ids[:-1]
        lp = self.logp(a)
        if lp.shape[0] < len(ids) * 2: return [(w, -9.0, -9.0) for w in ws]
        kar = self.hizala(lp, ids)
        out = []
        for w, (b, e) in zip(ws, sinir):
            sk = []
            for j in range(b, e):
                fr = kar.get(j, [])
                if fr: sk.append(float(np.mean(lp[fr, ids[j]])))  # harfin tüm karelerinin ortalaması (ünlü kalitesi/aksan)
                else: sk.append(-9.0)
            out.append((w, float(np.mean(sk)) if sk else -9.0, float(np.min(sk)) if sk else -9.0))
        return out

    def harf_zamanlari(self, a, metin):
        """her kelime için [(harf, başlangıç_sn, bitiş_sn)] — wav2vec2 karesi 20 ms (vurgu/tonlama ölçümü için)"""
        ws = kelimeler(metin)
        ids, sinir, harfler = [], [], []
        for w in ws:
            bas = len(ids); hs = [ch for ch in w if ch in self.vocab]
            ids += [self.vocab[ch] for ch in hs]; harfler += hs
            sinir.append((bas, len(ids))); ids.append(self.vocab["|"]); harfler.append("|")
        ids = ids[:-1]; harfler = harfler[:-1]
        lp = self.logp(a)
        if lp.shape[0] < len(ids) * 2: return [(w, []) for w in ws]
        kar = self.hizala(lp, ids)
        out = []
        for w, (b, e) in zip(ws, sinir):
            hz = []
            for j in range(b, e):
                fr = kar.get(j, [])
                if fr: hz.append((harfler[j], min(fr) * 0.02, (max(fr) + 1) * 0.02))
            out.append((w, hz))
        return out

def oku16(p):
    a = subprocess.run(["ffmpeg", "-v", "error", "-i", p, "-ac", "1", "-ar", "16000", "-f", "f32le", "-"], capture_output=True).stdout
    return np.frombuffer(a, np.float32).copy()

if __name__ == "__main__":
    kip, satir_yol, klasor = sys.argv[1], sys.argv[2], sys.argv[3]
    S = json.load(open(satir_yol)); dn = Denetci()
    if kip == "kalibre":
        tum = []
        for s in S:
            p = os.path.join(klasor, s["k"] + ".wav")
            if not os.path.exists(p): continue
            for w, ort, mn in dn.kelime_puanlari(oku16(p), s.get("gercek_metin", s["metin"])): tum.append(ort)
        esik = float(np.percentile(tum, 5))
        json.dump({"esik": esik, "medyan": float(np.median(tum)), "n": len(tum), "kaynak": klasor}, open(KALIB, "w"), indent=1)
        print(f"kalibrasyon: {len(tum)} kelime, medyan {np.median(tum):.2f}, eşik (5. yüzdelik) {esik:.2f}")
    else:
        for s in S:
            p = os.path.join(klasor, s["k"] + ".wav")
            if not os.path.exists(p): continue
            pu = dn.kelime_puanlari(oku16(p), s["metin"])
            kotu = [f"{w}({o:.2f})" for w, o, m in pu if o < dn.esik]
            print(f"{s['k']:4s} {'TAMAM ' if not kotu else 'ŞÜPHE '} min {min(o for _, o, _ in pu):.2f} | {' '.join(kotu)}")
