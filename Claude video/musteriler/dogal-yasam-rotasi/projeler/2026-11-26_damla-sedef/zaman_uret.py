# ses/<k>.wav sürelerinden src/zaman.ts üretir (satır arası boşluk ARA sn)
import json,soundfile as sf,sys
ARA=float(sys.argv[1]) if len(sys.argv)>1 else 0.18
L=json.load(open("senaryo/satirlar.json")); t=0.3; out=[]
for x in L:
    du=round(sf.info(f"ses/{x['k']}.wav").duration,3); out.append({"k":x["k"],"metin":x["metin"],"bas":round(t,3),"sure":du}); t+=du+ARA
open("src/zaman.ts","w").write("export const FPS=30;\nexport const TOPLAM="+str(round(t+0.4,2))+";\nexport const SATIRLAR="+json.dumps(out,ensure_ascii=False,indent=1)+" as const;\n")
print("toplam",round(t+0.4,2))
