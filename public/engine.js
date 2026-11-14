// Pečat! – provjera odgovora i bodovanje (bez DOM-a, da se može testirati).
(function (root) {
  var CYR = {'а':'a','б':'b','в':'v','г':'g','д':'d','ђ':'đ','е':'e','ж':'ž','з':'z','и':'i','ј':'j','к':'k','л':'l','љ':'lj','м':'m','н':'n','њ':'nj','о':'o','п':'p','р':'r','с':'s','т':'t','ћ':'ć','у':'u','ф':'f','х':'h','ц':'c','ч':'č','џ':'dž','ш':'š'};
  var STOP = {};
  ('otok ostrvo grad rijeka reka planina jezero np pp nacionalni park prirode zupanija kanton opcina opstina most dvorac manastir banja tvrdava ' +
   'nk fk hnk gnk rk hsk kralj knez car ban despot zracna luka aerodrom sveti sveta sv torta corba sir pivo rakija festival fest kafa kava kahva ' +
   'hleb hljeb kruh plaza klisura kanjon vodopad pita od sa s').split(' ').forEach(function (w) { STOP[w] = 1; });
  var BAD = ['jeb', 'kurac', 'kurc', 'pick', 'pizd', 'sranj', 'govn', 'supak', 'kurv'];

  function norm(s, raw) {
    s = String(s || '').toLowerCase().trim();
    if (raw) return s.replace(/\s+/g, '');
    s = s.replace(/[Ѐ-ӿ]/g, function (c) { return CYR[c] !== undefined ? CYR[c] : c; });
    s = s.replace(/đ/g, 'd').normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/dj/g, 'd');
    var all = s.split(/[^a-z0-9]+/).filter(Boolean);
    var kept = all.filter(function (t) { return !STOP[t]; });
    return (kept.length ? kept : all).join('');
  }

  // Odbija tipkanje nasumičnih slova na otvorenim pitanjima
  function nonsense(input) {
    var s = norm(input).replace(/[0-9]/g, '');
    if (s.length < 2) return true;
    if (/(.)\1\1/.test(s)) return true;
    if (/[^aeiour]{5,}/.test(s)) return true;
    if (!/[aeiou]/.test(s) && !/[^aeiou]r[^aeiou]/.test(s)) return true;
    if (/(asdf|qwer|wert|sdfg|dfgh|fghj|ghjk|hjkl|zxcv|xcvb|yxcv|qwertz|uiop|jklj)/.test(s)) return true;
    var vow = (s.match(/[aeiou]/g) || []).length;
    if (s.length >= 6 && vow / s.length < 0.2) return true;
    return false;
  }

  function lev(a, b, max) {
    if (Math.abs(a.length - b.length) > max) return max + 1;
    var prev = [], i, j;
    for (j = 0; j <= b.length; j++) prev[j] = j;
    for (i = 1; i <= a.length; i++) {
      var cur = [i], best = i;
      for (j = 1; j <= b.length; j++) {
        cur[j] = Math.min(prev[j] + 1, cur[j - 1] + 1, prev[j - 1] + (a[i - 1] === b[j - 1] ? 0 : 1));
        if (cur[j] < best) best = cur[j];
      }
      if (best > max) return max + 1;
      prev = cur;
    }
    return prev[b.length];
  }

  // Pretvara zapis pitanja u indeks: ključ -> {text, pct}
  function build(q) {
    if (q._idx) return q;
    var entries = [];
    String(q.a || '').split(';').forEach(function (e) {
      var parts = e.split('|').map(function (p) { return p.trim(); }).filter(Boolean);
      if (!parts.length || parts[0].indexOf('?') >= 0) return;
      parts = parts.filter(function (p) { return p.indexOf('?') < 0; });
      entries.push(parts);
    });
    var idx = {}, list = [], seen = {};
    entries.forEach(function (parts) {
      var keys = parts.map(function (p) { return norm(p, q.raw); }).filter(Boolean);
      if (!keys.length || seen[keys[0]]) return;
      var item = { text: parts[0], rank: list.length };
      list.push(item);
      keys.forEach(function (k) { if (!seen[k]) { seen[k] = 1; idx[k] = item; } });
    });
    var sum = 0, rs = 0, vs = 0, V = q.views || null, hasV = false;
    list.forEach(function (it) { it.rw = 1 / Math.pow(it.rank + 1, 1.15); rs += it.rw;
      if (V && V[it.text] !== undefined) { it.vw = Math.sqrt(V[it.text] + 1); vs += it.vw; if (V[it.text] > 0) hasV = true; } });
    // Rijetkost: 70 % pregledi članka na Wikipediji (korijen, da veliki gradovi ne pojedu sve), 30 % procjena po redoslijedu
    list.forEach(function (it) {
      var r = it.rw / rs;
      it.w = (hasV && it.vw !== undefined) ? 0.7 * (it.vw / vs) + 0.3 * r : (hasV ? 0.3 * r : r);
      sum += it.w; });
    var mass = q.o ? 75 : 100;
    list.forEach(function (it) {
      var p = mass * it.w / sum;
      it.pct = p >= 10 ? Math.round(p) : Math.max(0.1, Math.round(p * 10) / 10);
    });
    q._idx = idx; q._list = list;
    q._ban = {};
    String(q.x || '').split('|').forEach(function (b) { var k = norm(b, q.raw); if (k) q._ban[k] = 1; });
    return q;
  }

  function find(q, key) {
    if (q._idx[key]) return q._idx[key];
    if (q.raw || key.length < 4) return null;
    var best = null, bestD = 9, k;
    for (k in q._idx) {
      if (k.length < 4) continue;
      var max = k.length >= 9 ? 2 : 1;
      var d = lev(key, k, max);
      if (d <= max && d < bestD) { bestD = d; best = q._idx[k]; }
    }
    return best;
  }

  // Prava rijetkost: q.live = {n: broj igrača, c: {id: koliko ih je to reklo}}.
  // Što je više igrača, to se više vjeruje njima, a manje procjeni.
  function live(q, id, est) {
    var L = q.live; if (!L || !L.n || L.n < 15) return { pct: est };
    var lp = 100 * (L.c && L.c[id] || 0) / L.n, w = Math.min(0.85, L.n / 250), p = (1 - w) * est + w * lp;
    return { pct: p >= 10 ? Math.round(p) : Math.max(0.1, Math.round(p * 10) / 10), live: L.n };
  }

  // used = objekt s već predanim ključevima u ovoj igri
  function check(q, input, used) {
    build(q);
    var key = norm(input, q.raw);
    if (key.length < (q.raw ? 1 : 2)) return { ok: false, reason: 'short' };
    // psovke tražimo unutar pojedinih riječi, da „nije bilo” ili „bacanje buketa” ne ispadnu psovka
    var words = String(input || '').split(/[\s,.;:!?-]+/).map(function (w) { return norm(w, false); });
    if (q._ban[key] || words.some(function (w) { return BAD.some(function (b) { var i = w.indexOf(b); return i >= 0 && !(b === 'jeb' && w.charAt(i - 1) === 'l'); }); })) return { ok: false, reason: 'banned' };
    var hit = find(q, key);
    var id = hit ? 'a:' + norm(hit.text, q.raw) : 'o:' + key;
    if (used && used[id]) return { ok: false, reason: 'dup' };
    if (hit) { var h = live(q, id, hit.pct); return { ok: true, id: id, text: hit.text, pct: h.pct, live: h.live, fuzzy: !q._idx[key] }; }
    if (q.o) {
      if (nonsense(input)) return { ok: false, reason: 'nonsense' };
      var f = live(q, id, 70);
      return { ok: true, id: id, text: String(input).trim(), pct: f.pct, live: f.live, fresh: !f.live };
    }
    return { ok: false, reason: 'wrong' };
  }

  function points(pct) { return Math.round(100 - pct); }
  function reached(total) { return total >= 760 ? 8 : Math.min(7, Math.floor(total / 95)); }
  function toNext(total) { var r = reached(total); return r >= 8 ? 0 : (r === 7 ? 760 : (r + 1) * 95) - total; }

  var api = { norm: norm, build: build, check: check, points: points, reached: reached, toNext: toNext };
  if (typeof module !== 'undefined' && module.exports) module.exports = api;
  root.PECAT_ENGINE = api;
})(typeof window !== 'undefined' ? window : globalThis);
