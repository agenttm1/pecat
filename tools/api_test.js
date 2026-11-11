// Test API-ja bez mreže: memorijska baza, testna prijava, lažni req/res.
process.env.PECAT_DEV_LOGIN = '1'; process.env.PECAT_MIN_GAME_MS = '0';
delete process.env.KV_REST_API_URL; delete process.env.UPSTASH_REDIS_REST_URL;
const { handle, nameProblem, dhondt, weekId } = require('../lib/app');
const assert = require('assert');
function call(method, url, body, cookie, extra) {
  return new Promise((resolve) => {
    const req = { method, url, headers: { host: 'localhost:3000', 'content-type': 'application/json', cookie: cookie || '', ...(extra || {}) }, body };
    const h = {}; const res = { statusCode: 200, setHeader: (k, v) => { h[k.toLowerCase()] = v; },
      end: (s) => resolve({ code: res.statusCode, json: JSON.parse(s), cookie: (h['set-cookie'] || '').split(';')[0] }) };
    handle(req, res);
  });
}
(async () => {
  // filtar imena
  ['HDZ ekipa', 'Za dom', 'Mi Možemo sve', 'k*rac', 'Kurčevi', 'SNSD', 'Naša Stranka', 'ustaše'].forEach((n) => assert(nameProblem(n, 3, 28), 'trebalo odbiti: ' + n));
  ['Stranka penzionera s kavom', 'Kavopije', 'Šalter 3', 'Pečatari Zagreb', 'Ekipa iz Mostara', 'Mostarci'].forEach((n) => assert.equal(nameProblem(n, 3, 28), null, 'trebalo pustiti: ' + n));
  // D'Hondt
  const d = dhondt([{ score: 600 }, { score: 300 }, { score: 100 }], 10); assert.deepEqual(d.map((x) => x.seats), [6, 3, 1]);
  assert(/^\d{4}-W\d\d$/.test(weekId()));

  assert.equal((await call('GET', '/api/me')).json.user, null);
  assert.equal((await call('POST', '/api/score', { lang: 'hr', score: 500 })).code, 401);
  const a = await call('POST', '/api/auth', { credential: 'dev:Ana' }); assert.equal(a.code, 200); const A = a.cookie;
  const b = await call('POST', '/api/auth', { credential: 'dev:Ivo' }); const B = b.cookie;
  const c = await call('POST', '/api/auth', { credential: 'dev:Mia' }); const Cc = c.cookie;
  assert.equal((await call('GET', '/api/me', null, A)).json.user.name, 'Ana');
  // stranke
  assert.equal((await call('POST', '/api/party/create', { lang: 'hr', name: 'HDZ 2' }, A)).json.error, 'name_real');
  const p = await call('POST', '/api/party/create', { lang: 'hr', name: 'Stranka Kave' }, A); assert.equal(p.code, 200, JSON.stringify(p.json)); const pid = p.json.party.id;
  assert.equal((await call('POST', '/api/party/create', { lang: 'hr', name: 'stranka  kave' }, B)).code, 409);
  const q = await call('POST', '/api/party/create', { lang: 'hr', name: 'Pečatari' }, B); const qid = q.json.party.id;
  assert.equal((await call('POST', '/api/party/join', { id: pid.toLowerCase() }, Cc)).code, 200);
  // rezultati
  async function play(cookie, score) { const g = (await call('POST', '/api/start', { lang: 'hr' })).json.gt; return call('POST', '/api/score', { lang: 'hr', score, gt: g }, cookie); }
  assert.equal((await play(A, 640)).json.rank, 1);
  const r2 = await play(B, 700); assert.equal(r2.json.rank, 1);
  await play(Cc, 300);
  assert.equal((await play(A, 900.5 + 100)).json.error, 'score');
  assert.equal((await play(A, 600)).code, 429, 'brzo ponavljanje');
  const g = (await call('POST', '/api/start', { lang: 'hr' })).json.gt;
  assert.equal((await call('POST', '/api/score', { lang: 'ba', score: 1, gt: g }, B)).json.error, 'ticket');
  let bd = (await call('GET', '/api/board?lang=hr', null, A)).json;
  assert.deepEqual(bd.izbori.map((x) => x.score), [700, 640, 300]);
  assert.deepEqual(bd.me, { rank: 2, score: 640 });
  assert.deepEqual(bd.sabor.map((x) => [x.name, x.score]), [['Stranka Kave', 940], ['Pečatari', 700]]);
  assert.equal(bd.sabor.reduce((s, x) => s + x.seats, 0), 151);
  // prelazak u drugu stranku nosi bodove sa sobom
  await call('POST', '/api/party/join', { id: qid }, Cc);
  bd = (await call('GET', '/api/board?lang=hr')).json;
  assert.deepEqual(bd.sabor.map((x) => [x.name, x.score, x.members]), [['Pečatari', 1000, 2], ['Stranka Kave', 640, 1]]);
  await call('POST', '/api/party/leave', { lang: 'hr' }, Cc);
  bd = (await call('GET', '/api/board?lang=hr')).json; assert.equal(bd.sabor[0].score, 700);
  const pi = (await call('GET', '/api/party?id=' + pid)).json.party; assert.equal(pi.members.length, 1);
  assert.equal((await call('GET', '/api/parties?lang=hr&q=pecat')).json.parties[0].name, 'Pečatari');
  assert.equal((await call('POST', '/api/nick', { name: 'Ana iz Splita' }, A)).json.user.name, 'Ana iz Splita');
  assert.equal((await call('POST', '/api/nick', { name: 'peder' }, A)).code, 400);
  assert.equal((await call('POST', '/api/logout', {}, A)).cookie, 'pecat=');
  // prebjeg samo jednom tjedno (Mia je već prešla)
  await call('POST', '/api/party/join', { id: pid }, Cc);
  assert.equal((await call('POST', '/api/party/join', { id: qid }, Cc)).json.error, 'one_switch');
  // koalicije: Ana (Stranka Kave) zove Ivu (Pečatari)
  assert.equal((await call('POST', '/api/coalition/invite', { lang: 'hr', to: qid }, Cc)).code, 403, 'samo osnivač');
  assert.equal((await call('POST', '/api/coalition/invite', { lang: 'hr', to: qid }, A)).code, 200);
  bd = (await call('GET', '/api/board?lang=hr', null, B)).json; assert.equal(bd.party.invites[0].name, 'Stranka Kave');
  assert.equal((await call('POST', '/api/coalition/accept', { lang: 'hr', from: pid }, B)).code, 200);
  bd = (await call('GET', '/api/board?lang=hr', null, B)).json;
  assert.equal(bd.blocs.length, 1); assert.equal(bd.blocs[0].seats, 151); assert(bd.vlada && bd.vlada.coalition);
  assert(bd.news.some((n) => n.t === 'koalicija') && bd.news.some((n) => n.t === 'prebjeg') && bd.news.some((n) => n.t === 'nova'));
  await call('POST', '/api/coalition/leave', { lang: 'hr' }, A);
  bd = (await call('GET', '/api/board?lang=hr', null, B)).json; assert.equal(bd.blocs.length, 2);
  // rijetkost i odgovori
  const g2 = (await call('POST', '/api/start', { lang: 'hr' })).json.gt;
  assert.equal((await call('POST', '/api/answers', { lang: 'hr', gt: g2, a: [['hr-1-1', 'a:susak', 97, 'Susak', 'Navedi hrvatski otok'], ['hr-1-2', 'x'], ['bad id', 'a:x']] })).code, 200);
  assert.equal((await call('POST', '/api/answers', { lang: 'hr', gt: g2, a: [] })).json.error, 'ticket_used');
  const rr = (await call('GET', '/api/rarity?lang=hr&ids=hr-1-1,hr-1-2')).json.rarity;
  assert.deepEqual(rr['hr-1-1'], { n: 1, c: { 'a:susak': 1 } }); assert.equal(rr['hr-1-2'].n, 1);
  const nn = (await call('GET', '/api/nn?lang=hr')).json; assert.equal(nn.rare.a, 'Susak'); assert.equal(nn.top[0].score, 700); assert.equal(nn.prebjezi, 1);
  // Šef odsjeka: dupli glasovi
  const gh = (await call('POST', '/api/start', { lang: 'ba', hard: true })).json.gt;
  const D = (await call('POST', '/api/auth', { credential: 'dev:Dino' })).cookie;
  const hs = (await call('POST', '/api/score', { lang: 'ba', score: 400, gt: gh }, D)).json; assert.equal(hs.counted, 800);
  // prijedlozi
  assert.equal((await call('POST', '/api/suggest', { lang: 'hr', q: 'Navedi nešto', a: 'a;b;c' })).code, 401);
  assert.equal((await call('POST', '/api/suggest', { lang: 'hr', q: 'Navedi vrstu burek', a: 'sir, meso, krumpir, jabuka', f: 'Burek je jedan' }, B)).code, 200);
  assert.equal((await call('GET', '/api/admin/suggestions?lang=hr')).code, 403);
  const sg = (await call('GET', '/api/admin/suggestions?lang=hr', null, '', { 'x-admin-key': 'dev-admin' })).json.suggestions; assert.equal(sg[0].a, 'sir; meso; krumpir; jabuka');
  await call('POST', '/api/admin/approve', { lang: 'hr', id: sg[0].id, q: sg[0].q, a: 'sir;meso;krumpir;jabuka|jabuke', f: sg[0].f }, '', { 'x-admin-key': 'dev-admin' });
  assert.equal((await call('GET', '/api/questions?lang=hr')).json.questions[0].q, 'Navedi vrstu burek');
  assert.equal((await call('GET', '/api/admin/suggestions?lang=hr', null, '', { 'x-admin-key': 'dev-admin' })).json.suggestions.length, 0);
  console.log('API OK');
})().catch((e) => { console.error(e); process.exit(1); });
