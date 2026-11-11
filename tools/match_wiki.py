import json,os
exec(open('fetch_wiki_per_article.py').read().split("cache_f=")[0])
exec("def titles_all(l,q,alias):\n"+open('fetch_wiki_per_article.py').read().split("def titles(l,q,alias):\n")[1].split("qs=json.load")[0].replace("return out[:2]","return out[:6]"))
top=json.load(open('top.json'))
tot={'hr.wikipedia':{},'bs.wikipedia':{},'sr.wikipedia':{}}
months={}
for k,arts in top.items():
    proj=k.rsplit('-',1)[0]; months[proj]=months.get(proj,0)+1
    for a,v in arts.items(): t=a.replace('_',' '); tot[proj][t]=tot[proj].get(t,0)+v
# skaliraj na 12 mjeseci ako fali koji
for p in tot:
    f=12/months.get(p,12)
    for t in tot[p]: tot[p][t]=int(tot[p][t]*f)
cache=json.load(open('cache.json')) if os.path.exists('cache.json') else {}
qs=json.load(open('qs.json'))
out={}; hits=0; n=0
for q in qs:
    proj=WIKI[q['l']]; d={}
    for it in q['items'][:40]:
        best=0
        for t in titles_all(q['l'],q['q'],it):
            best=max(best,tot[proj].get(t,0),cache.get(proj+'|'+t,0))
        d[it[0]]=best; n+=1; hits+=best>0
    out[q['id']]=d
json.dump(out,open('views.json','w'),ensure_ascii=False)
print('odgovora',n,'s pregledima',hits)
for qid in ['hr-1-1','hr-1-5','ba-1-1','rs-1-1','rs-4-1','hr-7-4']:
    d=out.get(qid,{}); print(qid, sorted(d.items(),key=lambda x:-x[1])[:6])
# zapiši za igru
d={k:{a:v for a,v in m.items() if v>0} for k,m in out.items()}
d={k:m for k,m in d.items() if m}
open('../public/wiki.js','w').write('// Godišnji pregledi članaka na Wikipediji (hr/bs/sr, liste top 1000 po mjesecu). Odgovori kojih nema na listi tretiraju se kao rijetki.\nwindow.PECAT_VIEWS='+json.dumps(d,ensure_ascii=False,separators=(',',':'))+';\n')
print('zapisano public/wiki.js')
