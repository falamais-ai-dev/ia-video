import json, subprocess, numpy as np, sys
SR=44100
x=np.frombuffer(subprocess.run(['ffmpeg','-v','error','-i','voz.mp3','-ac','1','-ar',str(SR),'-f','f32le','-'],capture_output=True,check=True).stdout,dtype=np.float32).copy()
W=json.load(open('palavras.json'))
def fim(w): return [p for p in W if p['w']==w][0]
PAUS=[('gênio!',0.25),('cochilar.',0.3),('demais...',0.45),('efeito.',0.35)]
win=int(0.01*SR)
rms=np.sqrt(np.convolve(x**2,np.ones(win)/win,mode='same'))
cortes=[]
for w,d in PAUS:
    i=[k for k,p in enumerate(W) if p['w']==w][0]
    a,b=W[i]['e']-0.08,W[i+1]['s']+0.05
    ia,ib=int(a*SR),int(b*SR)
    j=ia+int(np.argmin(rms[ia:ib])); print(w,'corte',round(j/SR,3),'rms',float(rms[j]),'max janela',float(rms[ia:ib].max()))
    cortes.append((j,d))
out=[];prev=0;f=int(0.012*SR)
for j,d in cortes:
    seg=x[prev:j].copy(); seg[-f:]*=np.linspace(1,0,f)
    if prev: seg[:f]*=np.linspace(0,1,f)
    out+= [seg,np.zeros(int(d*SR),np.float32)]; prev=j
seg=x[prev:].copy(); seg[:f]*=np.linspace(0,1,f); out.append(seg)
y=np.concatenate(out)
subprocess.run(['ffmpeg','-v','error','-y','-f','f32le','-ar',str(SR),'-ac','1','-i','-','voz-final.wav'],input=y.tobytes(),check=True)
for p in W:
    add=sum(d for j,d in cortes if j/SR<=p['s'])
    p['s']=round(p['s']+add,3); p['e']=round(p['e']+add,3)
json.dump(W,open('palavras-final.json','w'),ensure_ascii=False)
open('../src/palavras.js','w').write('export const PALAVRAS = '+json.dumps(W,ensure_ascii=False)+';\n')
print('dur',len(y)/SR)
