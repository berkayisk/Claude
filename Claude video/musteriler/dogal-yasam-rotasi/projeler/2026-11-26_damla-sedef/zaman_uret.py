# ses/*.wav → src/zaman.ts. Kanca (s01) "ama"dan bölünmüş: ses/s01a.wav + ses/s02a.wav, aralarında boşluk yok.
import json,soundfile as sf,sys,os
ARA=float(sys.argv[1]) if len(sys.argv)>1 else 0.18
L=json.load(open("senaryo/satirlar.json")); t=0.3; out=[]
bolum=[("s01","Boğazın geçti ama","ses/s01a.wav",0.0),("s02","cildinde damla damla lekeler mi çıktı?","ses/s02a.wav",ARA)] if os.path.exists("ses/s01a.wav") else []
for k,mt,p,ara in bolum:
    du=round(sf.info(p).duration,3); out.append({"k":k,"metin":mt,"bas":round(t,3),"sure":du}); t+=du+ara
for x in (L[1:] if bolum else L):
    du=round(sf.info(f"ses/{x['k']}.wav").duration,3); out.append({"k":x["k"],"metin":x["metin"],"bas":round(t,3),"sure":du}); t+=du+ARA
open("src/zaman.ts","w").write("export const FPS=30;\nexport const TOPLAM="+str(round(t+0.4,2))+";\nexport const SATIRLAR="+json.dumps(out,ensure_ascii=False,indent=1)+" as const;\n")
print("toplam",round(t+0.4,2))
