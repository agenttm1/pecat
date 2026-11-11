import json,time,urllib.request,urllib.parse,threading,sys,os
from concurrent.futures import ThreadPoolExecutor
UA='PecatQuizBot/1.0 (https://github.com/agenttm1/pecat; educational quiz game) python-urllib'
WIKI={'hr':'hr.wikipedia','ba':'bs.wikipedia','rs':'sr.wikipedia'}
CYR=[('dž','џ'),('Dž','Џ'),('DŽ','Џ'),('lj','љ'),('Lj','Љ'),('LJ','Љ'),('nj','њ'),('Nj','Њ'),('NJ','Њ')]
M=dict(zip('abvgdđežzijklmnoprstćufhcčšABVGDĐEŽZIJKLMNOPRSTĆUFHCČŠ','абвгдђежзијклмнопрстћуфхцчшАБВГДЂЕЖЗИЈКЛМНОПРСТЋУФХЦЧШ'))
def cyr(s):
    for a,b in CYR: s=s.replace(a,b)
    return ''.join(M.get(c,c) for c in s)
def suffixes(l,q):
    ql=q.lower(); S=[]
    def add(hr,sr): S.append(sr if l=='rs' else hr)
    if 'otok' in ql: add(' (otok)',' (ostrvo)')
    if 'rijek' in ql or 'reku' in ql or 'rafting' in ql: add(' (rijeka)',' (reka)')
    if 'planin' in ql or 'skijali' in ql: add(' (planina)',' (planina)')
    if 'grad' in ql or 'kvart' in ql or 'naselje' in ql: add(' (grad)',' (grad)')
    if 'jezero' in ql: S.append(' jezero')
    if 'nacionalni park' in ql: S.append('PREFIX:Nacionalni park ')
    if 'park prirode' in ql: S.append('PREFIX:Park prirode ')
    if 'banj' in ql: S.append('PREFIX:Banja ')
    return S
cache_f='cache.json'; cache=json.load(open(cache_f)) if os.path.exists(cache_f) else {}
lock=threading.Lock()
def views(project,title):
    k=project+'|'+title
    if k in cache: return cache[k]
    url='https://wikimedia.org/api/rest_v1/metrics/pageviews/per-article/%s/all-access/user/%s/monthly/2025010100/2025123100'%(project,urllib.parse.quote(title.replace(' ','_'),safe=''))
    v=0
    for attempt in range(6):
        try:
            r=urllib.request.urlopen(urllib.request.Request(url,headers={'User-Agent':UA}),timeout=20)
            d=json.load(r); v=sum(i['views'] for i in d.get('items',[])); break
        except urllib.error.HTTPError as e:
            if e.code==404: v=0; break
            ra=e.headers.get('Retry-After'); time.sleep(float(ra) if ra and ra.isdigit() else 3*(attempt+1))
        except Exception:
            time.sleep(1.5*(attempt+1))
    with lock: cache[k]=v
    return v
def titles(l,q,alias):
    base=[]
    long=[a for a in alias if ' ' in a]
    for a in ([alias[0]]+long[:1]):
        if a not in base: base.append(a)
    out=[]
    for b in base:
        b=b[0].upper()+b[1:]
        out.append(b)
        for s in suffixes(l,q):
            out.append(s[7:]+b if s.startswith('PREFIX:') else b+s)
    if l=='rs': out=[cyr(t) for t in out]
    return out[:2]
qs=json.load(open('qs.json'))
jobs=[(qi,ii,WIKI[q['l']],t) for qi,q in enumerate(qs) for ii,it in enumerate(q['items'][:20]) for t in titles(q['l'],q['q'],it)]
print('requests',len(jobs),flush=True)
res={}
done=[0]
def run(j):
    qi,ii,p,t=j; v=views(p,t); time.sleep(.3)
    with lock:
        res[(qi,ii)]=max(res.get((qi,ii),0),v); done[0]+=1
        if done[0]%100==0:
            print('done',done[0],flush=True); json.dump(cache,open(cache_f,'w'))
with ThreadPoolExecutor(2) as ex: list(ex.map(run,jobs))
json.dump(cache,open(cache_f,'w'))
out={}
for qi,q in enumerate(qs):
    out[q['id']]={it[0]:res.get((qi,ii),0) for ii,it in enumerate(q['items'])}
json.dump(out,open('views.json','w'),ensure_ascii=False)
print('finished',flush=True)
