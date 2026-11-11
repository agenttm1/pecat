import json,time,urllib.request,os
UA='PecatQuizBot/1.0 (https://github.com/agenttm1/pecat; educational quiz game) python-urllib'
out=json.load(open('top.json')) if os.path.exists('top.json') else {}
for proj in ['hr.wikipedia','bs.wikipedia','sr.wikipedia']:
    for m in range(1,13):
        k='%s-%02d'%(proj,m)
        if k in out: continue
        url='https://wikimedia.org/api/rest_v1/metrics/pageviews/top/%s/all-access/2025/%02d/all-days'%(proj,m)
        for att in range(8):
            try:
                d=json.load(urllib.request.urlopen(urllib.request.Request(url,headers={'User-Agent':UA}),timeout=30))
                out[k]={a['article']:a['views'] for a in d['items'][0]['articles']}; print(k,len(out[k]),flush=True); break
            except urllib.error.HTTPError as e:
                ra=e.headers.get('Retry-After'); w=min(90,float(ra)) if ra and ra.replace('.','').isdigit() else 20*(att+1)
                print(k,e.code,'wait',w,flush=True); time.sleep(w)
            except Exception as e:
                print(k,repr(e)[:60],flush=True); time.sleep(10)
        json.dump(out,open('top.json','w'))
        time.sleep(3)
print('finished',len(out),flush=True)
