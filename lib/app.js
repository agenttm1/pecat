// Pečat! API: prijava Googleom, izbori (pojedinci), stranke i Sabor (zajednice).
// Jedna funkcija, rute po putanji: /api/<ruta>.
'use strict';
const crypto = require('crypto');
const { pipe, cmd, pairs } = require('./store');

const LANGS = ['hr', 'ba', 'rs'];
const SEATS = { hr: 151, ba: 42, rs: 250 };
const MAX_SCORE = 1200;          // 8 × 100 + bonusi iz događaja (veza ×2 i sl.)
const MIN_GAME_MS = +(process.env.PECAT_MIN_GAME_MS || 40000);  // brže od ovoga nitko ne prođe 8 šaltera
const KEEP = 60 * 86400;         // tjedne ljestvice čuvamo 60 dana
const DEV = process.env.PECAT_DEV_LOGIN === '1';
const SECRET = process.env.SESSION_SECRET || (DEV ? 'dev-secret' : '');
const GID = process.env.GOOGLE_CLIENT_ID || '';
const ADMIN_KEY = process.env.ADMIN_KEY || (DEV ? 'dev-admin' : '');

/* ---------------- pomoćno ---------------- */
function send(res, code, obj, headers) {
  res.statusCode = code;
  res.setHeader('Content-Type', 'application/json; charset=utf-8');
  res.setHeader('Cache-Control', 'no-store');
  for (const k in headers || {}) res.setHeader(k, headers[k]);
  res.end(JSON.stringify(obj));
}
class Http extends Error { constructor(code, msg) { super(msg); this.code = code; } }
const bad = (m) => new Http(400, m);

async function body(req) {
  if (req.body && typeof req.body === 'object') return req.body;
  if (typeof req.body === 'string') { try { return JSON.parse(req.body); } catch (e) { return {}; } }
  const chunks = []; let n = 0;
  for await (const c of req) { n += c.length; if (n > 1e5) throw bad('too_big'); chunks.push(c); }
  try { return JSON.parse(Buffer.concat(chunks).toString('utf8') || '{}'); } catch (e) { return {}; }
}
const b64 = (s) => Buffer.from(s).toString('base64url');
const unb64 = (s) => Buffer.from(s, 'base64url').toString('utf8');
function sign(obj) { const p = b64(JSON.stringify(obj)); return p + '.' + crypto.createHmac('sha256', SECRET).update(p).digest('base64url'); }
function unsign(tok) {
  if (!tok || typeof tok !== 'string' || !SECRET) return null;
  const [p, s] = tok.split('.'); if (!p || !s) return null;
  const want = crypto.createHmac('sha256', SECRET).update(p).digest('base64url');
  const a = Buffer.from(s), b = Buffer.from(want);
  if (a.length !== b.length || !crypto.timingSafeEqual(a, b)) return null;
  try { return JSON.parse(unb64(p)); } catch (e) { return null; }
}
function cookies(req) { const o = {}; (req.headers.cookie || '').split(';').forEach((c) => { const i = c.indexOf('='); if (i > 0) o[c.slice(0, i).trim()] = decodeURIComponent(c.slice(i + 1).trim()); }); return o; }
function isLocal(req) { return /^(localhost|127\.0\.0\.1)(:|$)/.test(req.headers.host || ''); }
function sessionCookie(req, val, maxAge) {
  return 'pecat=' + encodeURIComponent(val) + '; Path=/; HttpOnly; SameSite=Lax; Max-Age=' + maxAge + (isLocal(req) ? '' : '; Secure');
}
function me(req) { const s = unsign(cookies(req).pecat); return s && s.e > Date.now() ? s.u : null; }
function need(req) { const u = me(req); if (!u) throw new Http(401, 'login'); return u; }
function admin(req) { const k = req.headers['x-admin-key'] || ''; if (!ADMIN_KEY || k.length !== ADMIN_KEY.length || !crypto.timingSafeEqual(Buffer.from(k), Buffer.from(ADMIN_KEY))) throw new Http(403, 'admin'); }
function lang(x) { if (!LANGS.includes(x)) throw bad('lang'); return x; }

// tjedan po zagrebačkom vremenu, ISO (ponedjeljak–nedjelja)
function weekId(date) {
  const ymd = new Intl.DateTimeFormat('en-CA', { timeZone: 'Europe/Zagreb', year: 'numeric', month: '2-digit', day: '2-digit' }).format(date || new Date());
  const d = new Date(ymd + 'T00:00:00Z'); const day = (d.getUTCDay() + 6) % 7;
  d.setUTCDate(d.getUTCDate() - day + 3);
  const y = d.getUTCFullYear(); const jan4 = new Date(Date.UTC(y, 0, 4));
  const wk = 1 + Math.round(((d - jan4) / 86400000 - 3 + ((jan4.getUTCDay() + 6) % 7)) / 7);
  return y + '-W' + String(wk).padStart(2, '0');
}
// dnevni broj #1 = 1. 11. 2026. po zagrebačkom vremenu
function dayNo(date) { const ymd = new Intl.DateTimeFormat('en-CA', { timeZone: 'Europe/Zagreb', year: 'numeric', month: '2-digit', day: '2-digit' }).format(date || new Date());
  return Math.round((Date.parse(ymd + 'T00:00:00Z') - Date.parse('2026-11-01T00:00:00Z')) / 86400000) + 1; }
function prevWeek() { return weekId(new Date(Date.now() - 7 * 86400000)); }

/* ---------------- filtar imena: bez pravih stranaka, psovki i mržnje ---------------- */
function fold(s) {
  return String(s || '').toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/đ/g, 'dj')
    .replace(/[0@]/g, 'o').replace(/[1!|]/g, 'i').replace(/3/g, 'e').replace(/4/g, 'a').replace(/[5$]/g, 's').replace(/7/g, 't');
}
const REAL_WORDS = ['hdz', 'sdp', 'hss', 'hns', 'ids', 'hsls', 'hsp', 'dp', 'dpms', 'sns', 'sps', 'srs', 'dss', 'ldp', 'sda', 'snsd', 'sds', 'sbb', 'df', 'nip', 'pdp', 'dnz', 'sdu', 'hdssb', 'most', 'mozemo', 'srce', 'zlf', 'nps', 'ns', 'dveri', 'zavetnici', 'sns'];
const REAL_PHRASES = ['domovinski pokret', 'demokratska fronta', 'nasa stranka', 'narod i pravda', 'zeleno-levi', 'zeleno levi', 'savez nezavisnih', 'stranka demokratske akcije', 'hrvatska demokratska zajednica', 'socijaldemokratska partija', 'srpska napredna', 'socijalisticka partija', 'srpska radikalna', 'srpska demokratska', 'mi mozemo', 'hrvatski suverenisti', 'savez za bolju', 'pokret za', 'za dom spremni', 'za dom'];
const UGLY = ['kurac', 'kurc', 'picka', 'pick', 'pizd', 'jeb', 'kurv', 'drolj', 'peder', 'pedera', 'cigan', 'ustas', 'ustas', 'cetni', 'chetni', 'balij', 'siptar', 'shiptar', 'nazi', 'hitler', 'pavelic', 'mladic', 'karadzic', 'jasenovac', 'srebrenic', 'zds', 'sieg', 'heil', 'nigg', 'fuck', 'shit', 'govno', 'sranje', 'retard', 'mongol', 'debil', 'gej'];
function nameProblem(raw, min, max) {
  const s = String(raw || '').replace(/\s+/g, ' ').trim();
  if (s.length < min || s.length > max) return 'len';
  if (!/^[\p{L}\p{N} .,'’!?&-]+$/u.test(s)) return 'chars';
  const f = fold(s), squash = f.replace(/[^a-z]/g, ''), words = f.split(/[^a-z]+/).filter(Boolean);
  if (UGLY.some((w) => squash.includes(w))) return 'ugly';
  if (words.some((w) => REAL_WORDS.includes(w)) || REAL_PHRASES.some((p) => f.replace(/[^a-z ]+/g, ' ').replace(/\s+/g, ' ').includes(p))) return 'real';
  return null;
}
function cleanName(s) { return String(s || '').replace(/\s+/g, ' ').trim(); }

/* ---------------- Google ---------------- */
async function verifyGoogle(credential) {
  if (DEV && /^dev:/.test(credential || '')) { const n = credential.slice(4, 30) || 'Test'; return { sub: 'dev-' + fold(n).replace(/[^a-z0-9]/g, ''), given_name: n }; }
  if (!GID) throw new Http(503, 'google_not_configured');
  const r = await fetch('https://oauth2.googleapis.com/tokeninfo?id_token=' + encodeURIComponent(credential || ''));
  if (!r.ok) throw new Http(401, 'bad_token');
  const t = await r.json();
  if (t.aud !== GID || !['accounts.google.com', 'https://accounts.google.com'].includes(t.iss) || +t.exp * 1000 < Date.now()) throw new Http(401, 'bad_token');
  return t;
}
// javno ime: ime + inicijal prezimena. E-mail se ne sprema.
function publicName(t) {
  const g = cleanName(t.given_name || (t.name || '').split(' ')[0] || 'Građanin').slice(0, 16);
  const f = cleanName(t.family_name || ''); return f ? g + ' ' + f[0].toUpperCase() + '.' : g;
}

/* ---------------- D'Hondt ---------------- */
function dhondt(rows, seats) {
  const q = []; rows.forEach((r, i) => { r.seats = 0; if (r.score > 0) for (let d = 1; d <= seats; d++) q.push([r.score / d, i]); });
  q.sort((a, b) => b[0] - a[0] || a[1] - b[1]); q.slice(0, seats).forEach(([, i]) => rows[i].seats++);
  return rows;
}

/* ---------------- koalicije ---------------- */
async function isManager(uid, pid) {
  const [owner, isMem] = await pipe([['HGET', K.party(pid), 'owner'], ['SMEMBERS', K.pm(pid)]]);
  if (!isMem.includes(uid)) return false;
  return owner === uid || !isMem.includes(owner);
}
async function myManagedParty(uid, l) {
  const pid = await cmd('HGET', K.up(uid), l); if (!pid) throw bad('no_party');
  if (!(await isManager(uid, pid))) throw new Http(403, 'not_manager');
  return pid;
}
// grupira stranke s mjestima u blokove (koalicije ili same) i traži većinu
async function makeBlocs(l, parties) {
  const coal = pairs(await cmd('HGETALL', K.coal(l))); const by = {};
  parties.forEach((p) => { const c = coal[p.id] || ('solo:' + p.id); (by[c] = by[c] || []).push(p); });
  const list = Object.keys(by).map((c) => ({ coalition: !c.startsWith('solo:'), parties: by[c].map((p) => p.name), seats: by[c].reduce((a, p) => a + p.seats, 0) }))
    .sort((a, b) => b.seats - a.seats);
  const need = Math.floor(SEATS[l] / 2) + 1;
  const vlada = list.length && list[0].seats >= need ? list[0] : null;
  return { list, vlada, need };
}

/* ---------------- rute ---------------- */
const K = {
  user: (u) => 'u:' + u, iz: (l, w) => 'iz:' + l + ':' + w, sb: (l, w) => 'sb:' + l + ':' + w,
  coal: (l) => 'coal:' + l, cm: (c) => 'cm:' + c, inv: (l, p) => 'inv:' + l + ':' + p, news: (l) => 'news:' + l,
  ih: (l, w) => 'ih:' + l + ':' + w, dly: (u) => 'dly:' + u, stz: (u) => 'stz:' + u,
  rar: (l, q) => 'rar:' + l + ':' + q, rw: (l, w) => 'rw:' + l + ':' + w, pxn: (l, w) => 'pxn:' + l + ':' + w,
  miss: (l) => 'miss:' + l, missq: (l) => 'missq:' + l,
  sug: (l) => 'sug:' + l, uq: (l) => 'uq:' + l,
  up: (u) => 'up:' + u, party: (p) => 'p:' + p, pm: (p) => 'pm:' + p, pn: (l, n) => 'pn:' + l + ':' + n, pl: (l) => 'pl:' + l,
};
const partyKey = (name) => fold(name).replace(/[^a-z0-9]/g, '');

async function userInfo(uid) {
  const [u, up] = await pipe([['HGETALL', K.user(uid)], ['HGETALL', K.up(uid)]]);
  const user = pairs(u); const parties = pairs(up); const ids = Object.values(parties);
  const pinfo = ids.length ? await pipe(ids.map((p) => ['HGETALL', K.party(p)])) : [];
  const out = {}; Object.keys(parties).forEach((l) => { const p = pairs(pinfo[ids.indexOf(parties[l])]); out[l] = { id: parties[l], name: p.name }; });
  const wk = weekId(); const best = await pipe(LANGS.map((l) => ['ZSCORE', K.iz(l, wk), uid]));
  const [st, dl] = await pipe([['HGETALL', K.stz(uid)], ['HGETALL', K.dly(uid)]]); const S0 = pairs(st), D0 = pairs(dl), today = dayNo();
  const daily = {}; LANGS.forEach((l) => { if (D0[l + ':' + today]) daily[l] = +D0[l + ':' + today]; });
  let n = +(S0.n || 0); if (+S0.last < today - 1) n = 0;
  return { id: uid, name: user.name, parties: out, day: today, daily, staz: { n, last: +(S0.last || 0), best: +(S0.best || 0) }, best: Object.fromEntries(LANGS.map((l, i) => [l, best[i] ? +best[i] : 0])) };
}

async function news(l, item) { item.ts = Date.now(); await pipe([['LPUSH', K.news(l), JSON.stringify(item)], ['LTRIM', K.news(l), 0, 39]]); }
async function moveParty(uid, l, newPid) {
  const wk = weekId();
  const [oldPid, best] = await pipe([['HGET', K.up(uid), l], ['ZSCORE', K.iz(l, wk), uid]]);
  const b = best ? +best : 0; const c = [];
  if (oldPid === newPid) return;
  if (oldPid && newPid) {
    const ok = await cmd('SET', 'px:' + uid + ':' + l + ':' + wk, 1, 'NX', 'EX', 8 * 86400);
    if (!ok) throw new Http(429, 'one_switch');
    const [who, a, b2] = await pipe([['HGET', K.user(uid), 'name'], ['HGET', K.party(oldPid), 'name'], ['HGET', K.party(newPid), 'name'], ['INCR', K.pxn(l, wk)]]);
    await news(l, { t: 'prebjeg', who, from: a, to: b2 });
  }
  if (oldPid) {
    c.push(['SREM', K.pm(oldPid), uid], ['ZINCRBY', K.pl(l), -1, oldPid], ['HDEL', K.up(uid), l]);
    if (b) c.push(['ZINCRBY', K.sb(l, wk), -b, oldPid]);
  }
  if (newPid) {
    c.push(['SADD', K.pm(newPid), uid], ['ZINCRBY', K.pl(l), 1, newPid], ['HSET', K.up(uid), l, newPid]);
    if (b) c.push(['ZINCRBY', K.sb(l, wk), b, newPid], ['EXPIRE', K.sb(l, wk), KEEP]);
  }
  if (c.length) await pipe(c);
}

const routes = {
  'GET config': async () => ({ google: GID || null, dev: DEV, seats: SEATS, week: weekId() }),

  'POST auth': async (req, res, b) => {
    const t = await verifyGoogle(b.credential);
    const uid = 'g' + t.sub; const exists = await cmd('HGET', K.user(uid), 'name');
    if (!exists) await cmd('HSET', K.user(uid), 'name', publicName(t), 'created', Date.now());
    const tok = sign({ u: uid, e: Date.now() + 60 * 86400000 });
    res.setHeader('Set-Cookie', sessionCookie(req, tok, 60 * 86400));
    return { user: await userInfo(uid) };
  },
  'POST logout': async (req, res) => { res.setHeader('Set-Cookie', sessionCookie(req, '', 0)); return { ok: true }; },
  'GET me': async (req) => { const u = me(req); return { user: u ? await userInfo(u) : null }; },
  'POST nick': async (req, res, b) => {
    const u = need(req); const p = nameProblem(b.name, 2, 20); if (p) throw bad('name_' + p);
    await cmd('HSET', K.user(u), 'name', cleanName(b.name)); return { user: await userInfo(u) };
  },

  // ulaznica za igru: bez nje nema rezultata, a ne vrijedi ako je igra prebrza
  'POST start': async (req, res, b) => ({ gt: sign({ l: lang(b.lang), t: Date.now(), n: crypto.randomBytes(8).toString('hex'), h: b.hard ? 1 : 0 }) }),

  'POST score': async (req, res, b) => {
    const u = need(req); const l = lang(b.lang); const g = unsign(b.gt);
    if (!g || g.l !== l) throw bad('ticket');
    const age = Date.now() - g.t; if (age < MIN_GAME_MS || age > 3 * 3600000) throw bad('ticket_time');
    const raw = Math.round(+b.score); if (!Number.isFinite(raw) || raw < 0 || raw > MAX_SCORE) throw bad('score');
    const score = raw;
    const IZ = g.h ? K.ih : K.iz; // Šef odsjeka ima svoju ljestvicu i ne ulazi u Sabor
    const [fresh, slow] = await pipe([['SET', 'gt:' + g.n, 1, 'NX', 'EX', 4 * 3600], ['SET', 'rl:' + u, 1, 'NX', 'EX', 20]]);
    if (!fresh) throw bad('ticket_used'); if (!slow) throw new Http(429, 'slow_down');
    const wk = weekId();
    const [old, pid] = await pipe([['ZSCORE', IZ(l, wk), u], ['HGET', K.up(u), l]]);
    const prev = old ? +old : 0; const c = [];
    if (score > prev) {
      c.push(['ZADD', IZ(l, wk), score, u], ['EXPIRE', IZ(l, wk), KEEP]);
      if (pid && !g.h) c.push(['ZINCRBY', K.sb(l, wk), score - prev, pid], ['EXPIRE', K.sb(l, wk), KEEP]);
    }
    c.push(['HINCRBY', K.user(u), 'games', 1]);
    await pipe(c);
    const [rank, n] = await pipe([['ZREVRANK', IZ(l, wk), u], ['ZCARD', IZ(l, wk)]]);
    return { best: Math.max(prev, score), counted: score, hard: !!g.h, improved: score > prev, rank: rank === null ? null : rank + 1, voters: n };
  },

  // dnevni broj i radni staž za prijavljene (da se ne izgubi s mobitelom)
  'POST daily': async (req, res, b) => {
    const u = need(req); const l = lang(b.lang); const today = dayNo();
    if (+b.day !== today) throw bad('day');
    const sc = Math.round(+b.score); if (!Number.isFinite(sc) || sc < 0 || sc > MAX_SCORE) throw bad('score');
    const first = await cmd('HSETNX', K.dly(u), l + ':' + today, sc);
    const S0 = pairs(await cmd('HGETALL', K.stz(u))); let n = +(S0.n || 0), last = +(S0.last || 0), best = +(S0.best || 0);
    if (last !== today) { n = last === today - 1 ? n + 1 : 1; last = today; best = Math.max(best, n); await cmd('HSET', K.stz(u), 'n', n, 'last', last, 'best', best); }
    return { first: !!first, staz: { n, last, best } };
  },
  'POST party/create': async (req, res, b) => {
    const u = need(req); const l = lang(b.lang); const name = cleanName(b.name);
    const p = nameProblem(name, 3, 28); if (p) throw bad('name_' + p);
    const ok = await cmd('SET', 'rlp:' + u, 1, 'NX', 'EX', 600); if (!ok) throw new Http(429, 'slow_down');
    const id = crypto.randomBytes(4).toString('hex').slice(0, 6).toUpperCase();
    const free = await cmd('SET', K.pn(l, partyKey(name)), id, 'NX');
    if (!free) { await cmd('DEL', 'rlp:' + u); throw new Http(409, 'name_taken'); }
    await pipe([['HSET', K.party(id), 'name', name, 'lang', l, 'owner', u, 'created', Date.now()], ['ZADD', K.pl(l), 0, id]]);
    await moveParty(u, l, id);
    await news(l, { t: 'nova', who: await cmd('HGET', K.user(u), 'name'), to: name });
    return { party: { id, name }, user: await userInfo(u) };
  },
  'POST party/join': async (req, res, b) => {
    const u = need(req); const id = String(b.id || '').toUpperCase().replace(/[^A-Z0-9]/g, '');
    const p = pairs(await cmd('HGETALL', K.party(id))); if (!p.name) throw new Http(404, 'no_party');
    await moveParty(u, p.lang, id); return { party: { id, name: p.name, lang: p.lang }, user: await userInfo(u) };
  },
  'POST party/leave': async (req, res, b) => { const u = need(req); await moveParty(u, lang(b.lang), null); return { user: await userInfo(u) }; },

  'GET party': async (req, res, b, q) => {
    const id = String(q.get('id') || '').toUpperCase(); const p = pairs(await cmd('HGETALL', K.party(id)));
    if (!p.name) throw new Http(404, 'no_party');
    const wk = weekId(); const mem = (await cmd('SMEMBERS', K.pm(id))).slice(0, 200);
    const rows = mem.length ? await pipe(mem.flatMap((m) => [['HGET', K.user(m), 'name'], ['ZSCORE', K.iz(p.lang, wk), m]])) : [];
    const members = mem.map((m, i) => ({ name: rows[i * 2] || '?', score: rows[i * 2 + 1] ? +rows[i * 2 + 1] : 0, founder: m === p.owner || undefined })).sort((a, b2) => b2.score - a.score);
    const sc = await cmd('ZSCORE', K.sb(p.lang, wk), id);
    return { party: { id, name: p.name, lang: p.lang, score: sc ? +sc : 0, members } };
  },
  'GET parties': async (req, res, b, q) => {
    const l = lang(q.get('lang')); const s = fold(q.get('q') || '').replace(/[^a-z0-9]/g, '');
    const ids = await cmd('ZREVRANGE', K.pl(l), 0, 199, 'WITHSCORES'); const list = [];
    for (let i = 0; i < ids.length; i += 2) list.push({ id: ids[i], n: +ids[i + 1] });
    const names = list.length ? await pipe(list.map((x) => ['HGET', K.party(x.id), 'name'])) : [];
    return { parties: list.map((x, i) => ({ id: x.id, name: names[i], members: x.n })).filter((x) => x.name && (!s || partyKey(x.name).includes(s))).slice(0, 30) };
  },

  'POST coalition/invite': async (req, res, b) => {
    const u = need(req); const l = lang(b.lang); const mine = await myManagedParty(u, l);
    const to = String(b.to || '').toUpperCase(); if (to === mine) throw bad('self');
    const p = pairs(await cmd('HGETALL', K.party(to))); if (!p.name || p.lang !== l) throw new Http(404, 'no_party');
    const [c1, c2] = await pipe([['HGET', K.coal(l), mine], ['HGET', K.coal(l), to]]); if (c1 && c1 === c2) throw bad('already');
    await cmd('HSET', K.inv(l, to), mine, Date.now()); return { ok: true };
  },
  'POST coalition/accept': async (req, res, b) => {
    const u = need(req); const l = lang(b.lang); const mine = await myManagedParty(u, l); const from = String(b.from || '').toUpperCase();
    if (!(await cmd('HGET', K.inv(l, mine), from))) throw new Http(404, 'no_invite');
    const [ca, cb] = await pipe([['HGET', K.coal(l), from], ['HGET', K.coal(l), mine]]);
    let cid = ca || cb || ('K' + crypto.randomBytes(4).toString('hex'));
    const c = [['HDEL', K.inv(l, mine), from]];
    if (ca && cb && ca !== cb) { // spajanje dviju koalicija
      const mem = await cmd('SMEMBERS', K.cm(cb)); mem.forEach((x) => c.push(['HSET', K.coal(l), x, ca], ['SADD', K.cm(ca), x])); c.push(['DEL', K.cm(cb)]); cid = ca;
    }
    [from, mine].forEach((x) => c.push(['HSET', K.coal(l), x, cid], ['SADD', K.cm(cid), x]));
    await pipe(c);
    const names = await pipe([['HGET', K.party(from), 'name'], ['HGET', K.party(mine), 'name']]);
    await news(l, { t: 'koalicija', from: names[0], to: names[1] });
    return { ok: true, coalition: cid };
  },
  'POST coalition/decline': async (req, res, b) => { const u = need(req); const l = lang(b.lang); const mine = await myManagedParty(u, l); await cmd('HDEL', K.inv(l, mine), String(b.from || '').toUpperCase()); return { ok: true }; },
  'POST coalition/leave': async (req, res, b) => {
    const u = need(req); const l = lang(b.lang); const mine = await myManagedParty(u, l);
    const cid = await cmd('HGET', K.coal(l), mine); if (!cid) return { ok: true };
    await pipe([['SREM', K.cm(cid), mine], ['HDEL', K.coal(l), mine]]);
    const rest = await cmd('SMEMBERS', K.cm(cid));
    if (rest.length < 2) await pipe([...rest.map((x) => ['HDEL', K.coal(l), x]), ['DEL', K.cm(cid)]]);
    await news(l, { t: 'raskid', from: await cmd('HGET', K.party(mine), 'name') });
    return { ok: true };
  },

  // prava rijetkost: brojimo što su ljudi stvarno odgovorili
  'GET rarity': async (req, res, b, q) => {
    const l = lang(q.get('lang')); const ids = String(q.get('ids') || '').split(',').filter((x) => /^[a-z]{1,2}(-[a-z]{2})?-\d+(-\d+)?$/.test(x)).slice(0, 12);
    const r = ids.length ? await pipe(ids.map((x) => ['HGETALL', K.rar(l, x)])) : [];
    const out = {}; ids.forEach((x, i) => { const h = pairs(r[i]); const n = +(h._n || 0); delete h._n; Object.keys(h).forEach((k2) => { h[k2] = +h[k2]; }); out[x] = { n, c: h }; });
    return { rarity: out };
  },
  'POST answers': async (req, res, b) => {
    const l = lang(b.lang); const g = unsign(b.gt); if (!g || g.l !== l) throw bad('ticket');
    const age = Date.now() - g.t; if (age < MIN_GAME_MS || age > 3 * 3600000) throw bad('ticket_time');
    if (!(await cmd('SET', 'ga:' + g.n, 1, 'NX', 'EX', 4 * 3600))) throw bad('ticket_used');
    const list = Array.isArray(b.a) ? b.a.slice(0, 8) : []; const wk = weekId(); const c = [];
    list.forEach((x) => {
      if (!Array.isArray(x)) return; const qid = String(x[0] || ''), aid = String(x[1] || '').slice(0, 60);
      if (!/^[a-z]{1,2}(-[a-z]{2})?-\d+(-\d+)?$/.test(qid)) return;
      c.push(['HINCRBY', K.rar(l, qid), '_n', 1]);
      // odgovori kojih nema u papirima: skupljamo ih da se popis može dopuniti
      (Array.isArray(x[5]) ? x[5].slice(0, 3) : []).forEach((m) => { const t = cleanName(m).slice(0, 40); if (t.length >= 2 && !nameProblem(t, 1, 40)) c.push(['ZINCRBY', K.miss(l), 1, qid + '\t' + t.toLowerCase()], ['HSET', K.missq(l), qid, cleanName(x[4]).slice(0, 90)]); });
      if (/^[ao]:[a-z0-9]{1,50}$/.test(aid)) {
        c.push(['HINCRBY', K.rar(l, qid), aid, 1]);
        const pts = Math.max(0, Math.min(100, Math.round(+x[2] || 0))); const txt = cleanName(x[3]).slice(0, 40), qq = cleanName(x[4]).slice(0, 80);
        if (pts >= 90 && txt && qq && !nameProblem(txt, 1, 40)) c.push(['ZADD', K.rw(l, wk), 'GT', pts, JSON.stringify([qq, txt])], ['EXPIRE', K.rw(l, wk), KEEP]);
      }
    });
    if (c.length) await pipe(c); return { ok: true };
  },

  // Narodne novine: tjedni izvještaj
  'GET nn': async (req, res, b, q) => {
    const l = lang(q.get('lang')); const cur = weekId(), pw = prevWeek();
    const nPrev = await cmd('ZCARD', K.iz(l, pw)); const wk = nPrev ? pw : cur;
    const [top, sab, n, rw, px] = await pipe([['ZREVRANGE', K.iz(l, wk), 0, 2, 'WITHSCORES'], ['ZREVRANGE', K.sb(l, wk), 0, 39, 'WITHSCORES'], ['ZCARD', K.iz(l, wk)],
      ['ZREVRANGE', K.rw(l, wk), 0, 0, 'WITHSCORES'], ['GET', K.pxn(l, wk)]]);
    const ppl = []; for (let i = 0; i < top.length; i += 2) ppl.push({ id: top[i], score: +top[i + 1] });
    const parties = []; for (let i = 0; i < sab.length; i += 2) parties.push({ id: sab[i], score: +sab[i + 1] });
    const r = await pipe([...ppl.map((p) => ['HGET', K.user(p.id), 'name']), ...parties.map((p) => ['HGET', K.party(p.id), 'name'])]); let k = 0;
    ppl.forEach((p) => { p.name = r[k++] || '?'; delete p.id; }); parties.forEach((p) => { p.name = r[k++] || '?'; });
    dhondt(parties, SEATS[l]); const bl = await makeBlocs(l, parties.filter((p) => p.score > 0));
    let rare = null; if (rw.length) { try { const z = JSON.parse(rw[0]); rare = { q: z[0], a: z[1], pts: +rw[1] }; } catch (e) {} }
    return { week: wk, final: wk !== cur, voters: n, top: ppl, party: parties[0] ? { name: parties[0].name, seats: parties[0].seats } : null, vlada: bl.vlada, rare, prebjezi: +(px || 0), seats: SEATS[l] };
  },

  // prijedlozi pitanja (prijavljeni) i odobrena pitanja
  'POST suggest': async (req, res, b) => {
    const u = need(req); const l = lang(b.lang);
    const qq = cleanName(b.q).slice(0, 90), aa = String(b.a || '').replace(/\s+/g, ' ').trim().slice(0, 600), f = cleanName(b.f).slice(0, 120);
    if (qq.length < 8 || aa.split(/[;,]/).filter((x) => x.trim()).length < 3) throw bad('suggest_short');
    if (nameProblem(qq.replace(/[^\p{L}\p{N} ]/gu, ' '), 1, 200) === 'ugly') throw bad('name_ugly');
    const n = await cmd('INCR', 'sgc:' + u + ':' + new Date().toISOString().slice(0, 10)); await cmd('EXPIRE', 'sgc:' + u + ':' + new Date().toISOString().slice(0, 10), 86400);
    if (n > 5) throw new Http(429, 'slow_down');
    const id = crypto.randomBytes(4).toString('hex'); const who = await cmd('HGET', K.user(u), 'name');
    await cmd('HSET', K.sug(l), id, JSON.stringify({ id, q: qq, a: aa.replace(/,/g, ';'), f, who, ts: Date.now() }));
    return { ok: true };
  },
  'GET questions': async (req, res, b, q) => {
    const l = lang(q.get('lang')); const list = await cmd('LRANGE', K.uq(l), 0, 199);
    return { questions: list.map((x) => { try { return JSON.parse(x); } catch (e) { return null; } }).filter(Boolean) };
  },
  'GET admin/suggestions': async (req, res, b, q) => { admin(req); const l = lang(q.get('lang'));
    const h = pairs(await cmd('HGETALL', K.sug(l))); const uq = await cmd('LLEN', K.uq(l));
    return { approved: uq, suggestions: Object.values(h).map((x) => JSON.parse(x)).sort((a, b2) => a.ts - b2.ts) }; },
  'POST admin/approve': async (req, res, b) => { admin(req); const l = lang(b.lang);
    const qq = cleanName(b.q), aa = String(b.a || '').trim(); if (!qq || aa.split(';').length < 3) throw bad('suggest_short');
    const item = { q: qq, f: cleanName(b.f) || '', a: aa }; if (b.o) item.o = 1;
    await pipe([['RPUSH', K.uq(l), JSON.stringify(item)], ['HDEL', K.sug(l), String(b.id || '')]]); return { ok: true }; },
  'GET admin/missing': async (req, res, b, q) => { admin(req); const l = lang(q.get('lang'));
    const [z, qs] = await pipe([['ZREVRANGE', K.miss(l), 0, 99, 'WITHSCORES'], ['HGETALL', K.missq(l)]]); const Q = pairs(qs); const out = [];
    for (let i = 0; i < z.length; i += 2) { const [qid, a] = z[i].split('\t'); out.push({ key: z[i], qid, q: Q[qid] || qid, a, n: +z[i + 1] }); }
    return { missing: out }; },
  'POST admin/missing/done': async (req, res, b) => { admin(req); await cmd('ZREM', K.miss(lang(b.lang)), String(b.key || '')); return { ok: true }; },
  'POST admin/reject': async (req, res, b) => { admin(req); await cmd('HDEL', K.sug(lang(b.lang)), String(b.id || '')); return { ok: true }; },

  'GET board': async (req, res, b, q) => {
    const l = lang(q.get('lang')); const wk = weekId(), pw = prevWeek(); const u = me(req);
    const [top, sab, n, myRank, myScore, lastTop, lastSab] = await pipe([
      ['ZREVRANGE', K.iz(l, wk), 0, 49, 'WITHSCORES'], ['ZREVRANGE', K.sb(l, wk), 0, 39, 'WITHSCORES'], ['ZCARD', K.iz(l, wk)],
      ['ZREVRANK', K.iz(l, wk), u || '-'], ['ZSCORE', K.iz(l, wk), u || '-'],
      ['ZREVRANGE', K.iz(l, pw), 0, 0, 'WITHSCORES'], ['ZREVRANGE', K.sb(l, pw), 0, 0, 'WITHSCORES'],
    ]);
    const people = []; for (let i = 0; i < top.length; i += 2) people.push({ id: top[i], score: +top[i + 1] });
    const parties = []; for (let i = 0; i < sab.length; i += 2) parties.push({ id: sab[i], score: +sab[i + 1] });
    const look = [...people.map((p) => ['HGET', K.user(p.id), 'name']), ...parties.flatMap((p) => [['HGET', K.party(p.id), 'name'], ['ZSCORE', K.pl(l), p.id]]),
      ['HGET', K.user(lastTop[0] || '-'), 'name'], ['HGET', K.party(lastSab[0] || '-'), 'name']];
    const r = await pipe(look); let k = 0;
    people.forEach((p) => { p.name = r[k++] || '?'; p.me = p.id === u; delete p.id; });
    parties.forEach((p) => { p.name = r[k++] || '?'; p.members = +(r[k++] || 0); });
    dhondt(parties, SEATS[l]);
    const winner = lastTop.length ? { name: r[k] || '?', score: +lastTop[1] } : null; k++;
    const winParty = lastSab.length ? { name: r[k] || '?', score: +lastSab[1] } : null;
    const sab2 = parties.filter((p) => p.score > 0);
    const blocs = await makeBlocs(l, sab2);
    const [nw, mine, sefRaw] = await pipe([['LRANGE', K.news(l), 0, 14], ['HGET', K.up(u || '-'), l], ['ZREVRANGE', K.ih(l, wk), 0, 19, 'WITHSCORES']]);
    const sef = []; for (let i = 0; i < sefRaw.length; i += 2) sef.push({ id: sefRaw[i], score: +sefRaw[i + 1] });
    const sefN = sef.length ? await pipe(sef.map((p) => ['HGET', K.user(p.id), 'name'])) : [];
    sef.forEach((p, i) => { p.name = sefN[i] || '?'; p.me = p.id === u; delete p.id; });
    let party = null;
    if (u && mine) {
      const [inv, co] = await pipe([['HGETALL', K.inv(l, mine)], ['HGET', K.coal(l), mine]]);
      const fromIds = Object.keys(pairs(inv));
      const fromNames = fromIds.length ? await pipe(fromIds.map((x) => ['HGET', K.party(x), 'name'])) : [];
      party = { id: mine, manager: await isManager(u, mine), coalition: co || null, invites: fromIds.map((x, i) => ({ id: x, name: fromNames[i] || '?' })) };
    }
    sab2.forEach((p) => { delete p.id; });
    return { week: wk, seats: SEATS[l], voters: n, izbori: people, sef, sabor: sab2, blocs: blocs.list, vlada: blocs.vlada,
      news: nw.map((x) => { try { return JSON.parse(x); } catch (e) { return null; } }).filter(Boolean), party,
      me: u && myScore !== null ? { rank: myRank + 1, score: +myScore } : null, last: { week: pw, winner, party: winParty } };
  },
};

async function handle(req, res) {
  try {
    const url = new URL(req.url, 'http://x'); const path = (url.searchParams.get('p') || url.pathname.replace(/^\/api\/?/, '')).replace(/\/+$/, '');
    const key = req.method + ' ' + path; const fn = routes[key];
    if (!fn) throw new Http(404, 'no_route');
    if (req.method === 'POST') {
      const o = req.headers.origin; if (o && new URL(o).host !== req.headers.host) throw new Http(403, 'origin');
      if (!/json/.test(req.headers['content-type'] || '')) throw bad('json');
    }
    if (!SECRET && !/^GET config$/.test(key)) throw new Http(503, 'not_configured');
    const b = req.method === 'POST' ? await body(req) : {};
    send(res, 200, await fn(req, res, b, url.searchParams));
  } catch (e) {
    const code = e.code && e.code >= 400 && e.code < 600 ? e.code : 500;
    if (code === 500) console.error(e);
    send(res, code, { error: code === 500 ? 'server' : e.message });
  }
}

module.exports = { handle, nameProblem, dhondt, weekId, dayNo };
