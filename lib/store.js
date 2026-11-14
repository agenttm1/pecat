// Spremište: Upstash Redis preko REST-a (Vercel Marketplace postavi KV_REST_API_URL/TOKEN
// ili UPSTASH_REDIS_REST_URL/TOKEN). Bez tih varijabli radi memorijska baza za lokalni razvoj.
'use strict';

const URL_ = process.env.KV_REST_API_URL || process.env.UPSTASH_REDIS_REST_URL || '';
const TOKEN = process.env.KV_REST_API_TOKEN || process.env.UPSTASH_REDIS_REST_TOKEN || '';

async function rest(cmds) {
  const r = await fetch(URL_.replace(/\/$/, '') + '/pipeline', {
    method: 'POST',
    headers: { Authorization: 'Bearer ' + TOKEN, 'Content-Type': 'application/json' },
    body: JSON.stringify(cmds.map((c) => c.map(String))),
  });
  if (!r.ok) throw new Error('redis ' + r.status);
  const out = await r.json();
  return out.map((x) => { if (x.error) throw new Error(x.error); return x.result; });
}

/* ---- memorijska zamjena (samo za razvoj i testove) ---- */
const M = new Map(); const EXP = new Map();
function alive(k) { const e = EXP.get(k); if (e && e < Date.now()) { M.delete(k); EXP.delete(k); } return M.has(k); }
function z(k) { if (!alive(k)) M.set(k, new Map()); return M.get(k); }
function h(k) { if (!alive(k)) M.set(k, new Map()); return M.get(k); }
function sorted(k) { return alive(k) ? [...M.get(k).entries()].sort((a, b) => b[1] - a[1] || (a[0] < b[0] ? -1 : 1)) : []; }
function mem1(c) {
  const [cmd, k, ...a] = c; const C = cmd.toUpperCase();
  switch (C) {
    case 'GET': return alive(k) ? M.get(k) : null;
    case 'SET': {
      const nx = a.includes('NX'); const ex = a.indexOf('EX');
      if (nx && alive(k)) return null;
      M.set(k, String(a[0])); if (ex >= 0) EXP.set(k, Date.now() + a[ex + 1] * 1000); else EXP.delete(k);
      return 'OK';
    }
    case 'DEL': { const had = alive(k); M.delete(k); EXP.delete(k); return had ? 1 : 0; }
    case 'EXPIRE': if (alive(k)) EXP.set(k, Date.now() + a[0] * 1000); return 1;
    case 'HSET': { const m = h(k); for (let i = 0; i < a.length; i += 2) m.set(a[i], String(a[i + 1])); return 1; }
    case 'HSETNX': { const m = h(k); if (m.has(a[0])) return 0; m.set(a[0], String(a[1])); return 1; }
    case 'HGET': return alive(k) && M.get(k).has(a[0]) ? M.get(k).get(a[0]) : null;
    case 'HDEL': { if (alive(k)) M.get(k).delete(a[0]); return 1; }
    case 'HGETALL': { if (!alive(k)) return []; const o = []; M.get(k).forEach((v, f) => o.push(f, v)); return o; }
    case 'HINCRBY': { const m = h(k); const v = (+(m.get(a[0]) || 0)) + +a[1]; m.set(a[0], String(v)); return v; }
    case 'ZADD': {
      const gt = a[0] === 'GT'; const s = +a[gt ? 1 : 0], mem = a[gt ? 2 : 1]; const m = z(k);
      if (gt && m.has(mem) && m.get(mem) >= s) return 0; const n = m.has(mem) ? 0 : 1; m.set(mem, s); return n;
    }
    case 'ZINCRBY': { const m = z(k); const v = (m.get(a[1]) || 0) + +a[0]; m.set(a[1], v); return String(v); }
    case 'ZSCORE': return alive(k) && M.get(k).has(a[0]) ? String(M.get(k).get(a[0])) : null;
    case 'ZREM': { if (alive(k)) M.get(k).delete(a[0]); return 1; }
    case 'ZCARD': return alive(k) ? M.get(k).size : 0;
    case 'ZREVRANK': { const i = sorted(k).findIndex((e) => e[0] === a[0]); return i < 0 ? null : i; }
    case 'ZREVRANGE': {
      const L = sorted(k); const st = +a[0], en = +a[1] < 0 ? L.length + +a[1] : +a[1];
      const part = L.slice(st, en + 1); return a[2] ? part.flatMap((e) => [e[0], String(e[1])]) : part.map((e) => e[0]);
    }
    case 'SADD': { if (!alive(k)) M.set(k, new Set()); M.get(k).add(a[0]); return 1; }
    case 'SREM': { if (alive(k)) M.get(k).delete(a[0]); return 1; }
    case 'LPUSH': case 'RPUSH': { if (!alive(k)) M.set(k, []); const l = M.get(k); a.forEach((v) => C === 'LPUSH' ? l.unshift(String(v)) : l.push(String(v))); return l.length; }
    case 'LRANGE': { if (!alive(k)) return []; const l = M.get(k); const st = +a[0], en = +a[1] < 0 ? l.length + +a[1] : +a[1]; return l.slice(st, en + 1); }
    case 'LTRIM': { if (!alive(k)) return 'OK'; const l = M.get(k); const st = +a[0], en = +a[1] < 0 ? l.length + +a[1] : +a[1]; M.set(k, l.slice(st, en + 1)); return 'OK'; }
    case 'LLEN': return alive(k) ? M.get(k).length : 0;
    case 'HLEN': return alive(k) ? M.get(k).size : 0;
    case 'SMEMBERS': return alive(k) ? [...M.get(k)] : [];
    case 'SCARD': return alive(k) ? M.get(k).size : 0;
    case 'INCR': { const v = (+(alive(k) ? M.get(k) : 0)) + 1; M.set(k, String(v)); return v; }
    default: throw new Error('mem: ' + C);
  }
}

const usingRedis = !!(URL_ && TOKEN);
async function pipe(cmds) { if (!cmds.length) return []; return usingRedis ? rest(cmds) : cmds.map(mem1); }
async function cmd(...c) { return (await pipe([c]))[0]; }
function pairs(arr) { const o = {}; for (let i = 0; i < (arr || []).length; i += 2) o[arr[i]] = arr[i + 1]; return o; }

module.exports = { pipe, cmd, pairs, usingRedis, _mem: M };
