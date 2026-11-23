"""Berkay'ın kendi okuması -> satır satır temiz VO (calisma/vo_kayit/<k>.wav). Sınırlar: Whisper kelime zamanları + enerji minimumu."""
import json,numpy as np,soundfile as sf
W=json.load(open("calisma/kayit_kelimeler.json"))
a,sr=sf.read("calisma/vo_kayit/temiz.wav",dtype="float32")
def db(t,w=0.02):
    s=a[max(0,int(t*sr)):int((t+w)*sr)]; return 20*np.log10(np.sqrt((s**2).mean())+1e-9) if len(s) else -99
SAT=[("n1",0,1),("n2",2,9),("n3",10,17),("n4",18,19),("n5",20,21),("n6",22,24),("n7",25,28),("n8",29,31),("n9",32,37),("i1",38,43),("i2",44,46),
     ("n10",47,52),("n11",53,61),("n12",62,71),("n13",72,76),("n14",77,86),("n15",87,94),("n16",95,98),("n17",99,108),("n18",109,112),("n19",113,115),("n20",116,128)]
ELLE={"n12":(30.2,None),"n19":(54.75,56.9),"n20":(56.9,None)}    # n12: yarım kalan "Kendi ürününü..." denemesi atılır; n19: ikinci okuma
METIN={k:" ".join(W[x]["w"] for x in range(i,j+1)).replace(" -","-").replace(" '","'") for k,i,j in SAT}
sinir={}
for (k1,i1,j1),(k2,i2,j2) in zip(SAT,SAT[1:]):
    x,y=W[j1]["e"]-0.05,W[i2]["s"]+0.25
    ts=np.arange(x,max(x+0.02,y),0.01); sinir[(k1,k2)]=float(ts[np.argmin([db(t) for t in ts])])
ESIK0=-30
ESIK_OZEL={"n3":-40,"n5":-40}   # yumuşak başlayan/biten satırlar
d={}
for n,(k,i,j) in enumerate(SAT):
    sol=sinir.get((SAT[n-1][0],k),0.0) if n>0 else max(0,W[i]["s"]-0.6)
    sag=sinir.get((k,SAT[n+1][0]),len(a)/sr) if n<len(SAT)-1 else min(len(a)/sr,W[j]["e"]+0.8)
    if k in ELLE: sol=ELLE[k][0]; sag=ELLE[k][1] or sag
    ESIK=ESIK_OZEL.get(k,ESIK0)
    ts=np.arange(sol,sag,0.01); v=np.array([db(t) for t in ts])>ESIK
    b=max(sol,ts[np.argmax(v)]-0.06); e=min(sag,ts[len(v)-1-np.argmax(v[::-1])]+0.14)
    ts2=np.arange(b,e,0.01); sus=np.array([db(t) for t in ts2])<ESIK-2
    parc=[]; bas=b; t0=None
    for t,s in zip(ts2,sus):
        if s and t0 is None: t0=t
        if not s and t0 is not None:
            if t-t0>0.30: parc.append((bas,t0+0.12)); bas=t-0.12
            t0=None
    parc.append((bas,e))
    out=np.concatenate([a[int(x*sr):int(y*sr)] for x,y in parc])
    f=int(0.008*sr); out[:f]*=np.linspace(0,1,f); g=int(0.04*sr); out[-g:]*=np.linspace(1,0,g)
    sf.write(f"calisma/vo_kayit/{k}.wav",out,sr)
    d[k]=[METIN[k],round(len(out)/sr,2)]
    print(k,round(b,2),round(e,2),"->",d[k][1],"iç kesme",len(parc)-1,"|",METIN[k])
json.dump(d,open("calisma/vo_kayit/sureler.json","w"),ensure_ascii=False,indent=1)
