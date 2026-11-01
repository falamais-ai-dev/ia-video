import json, subprocess, numpy as np
SR=44100; T=1.1
x=np.frombuffer(subprocess.run(['ffmpeg','-v','error','-i','voz.mp3','-ac','1','-ar',str(SR),'-f','f32le','-'],capture_output=True,check=True).stdout,np.float32).copy()
W=json.load(open('palavras.json'))
win=int(0.02*SR); rms=np.sqrt(np.convolve(x**2,np.ones(win)/win,'same'))
thr=0.01
cortes=[]  # (inicio, fim) em amostras a remover
for i in range(1,len(W)):
    a,b=int((W[i-1]['e']+0.05)*SR),int((W[i]['s']-0.03)*SR)
    if b-a<int(0.3*SR):continue
    sil=rms[a:b]<thr
    # maior trecho contínuo de silêncio
    best=(0,0);k=None
    for j,v in enumerate(np.append(sil,False)):
        if v and k is None:k=j
        if not v and k is not None:
            if j-k>best[1]-best[0]:best=(k,j)
            k=None
    L=best[1]-best[0]; keep=int(0.25*SR)
    if L>keep+int(0.05*SR):
        m=a+best[0]+keep//2; cortes.append((m,m+L-keep))
print('corte total',sum(b-a for a,b in cortes)/SR)
out=[];prev=0;f=int(0.005*SR)
for a,b in cortes:
    out.append(x[prev:a]);prev=b
out.append(x[prev:]);y=np.concatenate(out)
def novo(t):
    s=int(t*SR);rem=sum(min(b,s)-a for a,b in cortes if a<s)
    return (s-rem)/SR/T
for p in W:p['s']=round(novo(p['s']),3);p['e']=round(novo(p['e']),3)
subprocess.run(['ffmpeg','-v','error','-y','-f','f32le','-ar',str(SR),'-ac','1','-i','-','-af',f'atempo={T}','voz-final.wav'],input=y.tobytes(),check=True)
json.dump(W,open('palavras-final.json','w'),ensure_ascii=False)
print('dur',len(y)/SR/T, W[-1])
