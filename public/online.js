/* Pečat! online: prijava Googleom, izbori (pojedinci), stranke i Sabor (zajednice).
   Radi samo kad postoji /api (Vercel). U pregledu bez poslužitelja sve ostaje skriveno. */
(function () {
  'use strict';
  var TX = {
    hr: { login: 'Prijava Googleom', board: 'Sabor i izbori', parl: 'Sabor', izb: 'Izbori', party: 'Stranka', week: 'tjedan', close: 'Zatvori',
      lastWin: 'Prošli tjedan izbore je dobio/la', lastParty: 'Vladajuća stranka prošlog tjedna', none: 'Još nitko nije glasao ovaj tjedan. Budi prvi!',
      noParty: 'Nijedna stranka još nema bodove ovaj tjedan.', seats: 'mjesta', members: 'članova', pts: 'bodova', you: 'ti',
      needLogin: 'Prijavi se da ti se rezultat broji na izborima i da se možeš učlaniti u stranku.', as: 'Prijavljen/a kao', logout: 'Odjava', rename: 'Promijeni ime',
      found: 'Osnuj stranku', name: 'Ime stranke', create: 'Osnuj', join: 'Učlani se', leave: 'Izađi iz stranke', search: 'Traži stranku…', invite: 'Pozovi ekipu',
      copied: 'Poveznica kopirana!', code: 'Šifra stranke', yourParty: 'Tvoja stranka', inviteQ: 'Pozvan/a si u stranku', rules: 'Svaki član donosi svoj najbolji rezultat tjedna. Mjesta u Saboru dijele se D’Hondtovom metodom, kao u pravom.',
      voted: function (r, n) { return 'Glas je ubrojen: ' + r + '. mjesto od ' + n + ' ovaj tjedan.'; }, notBest: function (b) { return 'Tvoj najbolji ovaj tjedan ostaje ' + b + '.'; },
      tooFast: 'Ovaj rezultat se ne broji (igra je bila prebrza).', voteLogin: 'Prijavi se Googleom i ovaj rezultat ide na izbore.', open: 'Otvori Sabor', devName: 'Testno ime', devGo: 'Testna prijava',
      err: { name_real: 'Prave stranke ne primamo. Ovo je šalter, ne izborna komisija.', name_ugly: 'To ime ne prolazi na šalteru.', name_len: 'Ime mora imati 3 do 28 znakova.', name_chars: 'Samo slova, brojevi i razmaci.', name_taken: 'Ta stranka već postoji.', slow_down: 'Polako, šalter radi i sutra.', no_party: 'Nema takve stranke.', def: 'Šalter ne radi. Pokušaj kasnije.' } },
    ba: { login: 'Prijava Googleom', board: 'Parlament i izbori', parl: 'Parlament', izb: 'Izbori', party: 'Stranka', week: 'sedmica', close: 'Zatvori',
      lastWin: 'Prošle sedmice izbore je dobio/la', lastParty: 'Vladajuća stranka prošle sedmice', none: 'Još niko nije glasao ove sedmice. Budi prvi!',
      noParty: 'Nijedna stranka još nema bodove ove sedmice.', seats: 'mjesta', members: 'članova', pts: 'bodova', you: 'ti',
      needLogin: 'Prijavi se da ti se rezultat broji na izborima i da se možeš učlaniti u stranku.', as: 'Prijavljen/a kao', logout: 'Odjava', rename: 'Promijeni ime',
      found: 'Osnuj stranku', name: 'Ime stranke', create: 'Osnuj', join: 'Učlani se', leave: 'Izađi iz stranke', search: 'Traži stranku…', invite: 'Pozovi raju',
      copied: 'Link kopiran!', code: 'Šifra stranke', yourParty: 'Tvoja stranka', inviteQ: 'Pozvan/a si u stranku', rules: 'Svaki član donosi svoj najbolji rezultat sedmice. Mjesta u Parlamentu dijele se D’Hondtovom metodom.',
      voted: function (r, n) { return 'Glas je ubrojen: ' + r + '. mjesto od ' + n + ' ove sedmice.'; }, notBest: function (b) { return 'Tvoj najbolji ove sedmice ostaje ' + b + '.'; },
      tooFast: 'Ovaj rezultat se ne broji (igra je bila prebrza).', voteLogin: 'Prijavi se Googleom i ovaj rezultat ide na izbore.', open: 'Otvori Parlament', devName: 'Testno ime', devGo: 'Testna prijava',
      err: { name_real: 'Prave stranke ne primamo. Ovo je šalter, ne CIK.', name_ugly: 'To ime ne prolazi na šalteru.', name_len: 'Ime mora imati 3 do 28 znakova.', name_chars: 'Samo slova, brojevi i razmaci.', name_taken: 'Ta stranka već postoji.', slow_down: 'Polahko, šalter radi i sutra.', no_party: 'Nema takve stranke.', def: 'Šalter ne radi. Pokušaj kasnije.' } },
    rs: { login: 'Prijava Guglom', board: 'Skupština i izbori', parl: 'Skupština', izb: 'Izbori', party: 'Stranka', week: 'nedelja', close: 'Zatvori',
      lastWin: 'Prošle nedelje izbore je dobio/la', lastParty: 'Vladajuća stranka prošle nedelje', none: 'Još niko nije glasao ove nedelje. Budi prvi!',
      noParty: 'Nijedna stranka još nema bodove ove nedelje.', seats: 'mesta', members: 'članova', pts: 'bodova', you: 'ti',
      needLogin: 'Prijavi se da ti se rezultat računa na izborima i da možeš da se učlaniš u stranku.', as: 'Prijavljen/a kao', logout: 'Odjava', rename: 'Promeni ime',
      found: 'Osnuj stranku', name: 'Ime stranke', create: 'Osnuj', join: 'Učlani se', leave: 'Izađi iz stranke', search: 'Traži stranku…', invite: 'Pozovi ekipu',
      copied: 'Link kopiran!', code: 'Šifra stranke', yourParty: 'Tvoja stranka', inviteQ: 'Pozvan/a si u stranku', rules: 'Svaki član donosi svoj najbolji rezultat nedelje. Mesta u Skupštini dele se D’Ontovom metodom.',
      voted: function (r, n) { return 'Glas je uračunat: ' + r + '. mesto od ' + n + ' ove nedelje.'; }, notBest: function (b) { return 'Tvoj najbolji ove nedelje ostaje ' + b + '.'; },
      tooFast: 'Ovaj rezultat se ne računa (igra je bila prebrza).', voteLogin: 'Prijavi se Guglom i ovaj rezultat ide na izbore.', open: 'Otvori Skupštinu', devName: 'Probno ime', devGo: 'Probna prijava',
      err: { name_real: 'Prave stranke ne primamo. Ovo je šalter, ne RIK.', name_ugly: 'To ime ne prolazi na šalteru.', name_len: 'Ime mora da ima 3 do 28 znakova.', name_chars: 'Samo slova, brojevi i razmaci.', name_taken: 'Ta stranka već postoji.', slow_down: 'Polako, šalter radi i sutra.', no_party: 'Nema takve stranke.', def: 'Šalter ne radi. Pokušaj kasnije.' } }
  };
  var COLORS = ['#3b37a6', '#b3271d', '#2e6b3f', '#c99a2e', '#7a4b8c', '#2b8a99', '#d0662b', '#6b7d2a', '#a23b72', '#44546a'];

  var CFG = null, ME = null, LANG = 'hr', GT = null, PENDING = null, heroEl = null, gisLoading = null;
  var INVITE = (new URLSearchParams(location.search).get('stranka') || '').toUpperCase().replace(/[^A-Z0-9]/g, '');

  function tx() { return TX[LANG] || TX.hr; }
  function esc(s) { return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; }); }
  function clan(n) { var d = n % 10, h = n % 100; return n + ' ' + (d === 1 && h !== 11 ? 'član' : (d >= 2 && d <= 4 && (h < 12 || h > 14) ? 'člana' : 'članova')); }
  function errText(e) { var E = tx().err; return E[e] || E.def; }
  function api(path, body) {
    var o = body ? { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body), credentials: 'same-origin' } : { credentials: 'same-origin' };
    return fetch('/api/' + path, o).then(function (r) { return r.json().catch(function () { return {}; }).then(function (j) { if (!r.ok) { var e = new Error(j.error || 'http'); e.code = j.error; throw e; } return j; }); });
  }
  function ready() { return !!(CFG && (CFG.google || CFG.dev)); }

  /* ---------- stil ---------- */
  var css = document.createElement('style');
  css.textContent = [
    '.acct{display:flex;flex-wrap:wrap;gap:8px;justify-content:center;align-items:center;min-height:0}',
    '.acct:empty{display:none}',
    '.acct .who{font-family:var(--f-type);font-size:13px;color:var(--ink-soft);width:100%}',
    '.obtn{display:inline-flex;align-items:center;gap:6px;border:2px solid var(--ink);background:var(--paper);color:var(--ink);padding:8px 12px;font-weight:700;font-size:15px;border-radius:2px;box-shadow:2px 2px 0 rgba(0,0,0,.2)}',
    '.obtn.dark{background:var(--ink);color:var(--paper)}',
    '.obtn svg{width:18px;height:18px}',
    '.vote{display:flex;flex-direction:column;align-items:center;gap:8px;text-align:center;font-size:15px}',
    '.vote:empty{display:none}',
    '.vote p{margin:0}',
    '#pnl{border:0;padding:0;background:transparent;max-width:min(520px,100vw);width:100%;max-height:100dvh;margin:auto}',
    '#pnl::backdrop{background:rgba(20,25,22,.6)}',
    '.pnl{background:var(--paper);border:3px solid var(--ink);margin:10px;display:flex;flex-direction:column;max-height:calc(100dvh - 20px);box-shadow:0 10px 40px rgba(0,0,0,.4)}',
    '.pnl header{display:flex;align-items:center;gap:8px;padding:10px 12px;border-bottom:2px solid var(--ink)}',
    '.pnl header h2{margin:0;font-family:var(--f-stamp);font-size:20px;letter-spacing:.04em;flex:1;text-transform:uppercase}',
    '.pnl header small{font-family:var(--f-type);font-size:11px;color:var(--ink-soft);display:block;letter-spacing:0;text-transform:none;font-weight:400}',
    '.pnl .x{border:2px solid var(--ink);background:none;width:34px;height:34px;font-size:20px;line-height:1;border-radius:2px}',
    '.ptabs{display:flex;border-bottom:2px solid var(--ink)}',
    '.ptabs button{flex:1;border:0;background:none;padding:9px 4px;font-weight:700;font-size:15px}',
    '.ptabs button+button{border-left:2px solid var(--ink)}',
    '.ptabs button[aria-selected=true]{background:var(--ink);color:var(--paper)}',
    '.pbody{overflow:auto;padding:12px;display:flex;flex-direction:column;gap:10px}',
    '.win{background:#fff8e1;border:2px solid var(--gold);padding:8px 10px;font-size:14px}',
    '.win b{font-size:16px}',
    '.lb{list-style:none;margin:0;padding:0;font-family:var(--f-type);font-size:14px}',
    '.lb li{display:flex;gap:8px;align-items:center;padding:6px 4px;border-bottom:1px dashed var(--paper-edge)}',
    '.lb li .n{width:2.2em;text-align:right;color:var(--ink-soft)}',
    '.lb li .nm{flex:1;font-family:var(--f-label);font-size:16px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}',
    '.lb li.me{background:#e7e5ff}',
    '.lb li .sw{width:12px;height:12px;border-radius:50%;flex:none}',
    '.lb li small{color:var(--ink-soft)}',
    '.lb li:first-child .n{color:var(--gold);font-weight:700}',
    '.hemi{width:100%;height:auto;display:block}',
    '.pmsg{margin:0;font-size:14px;color:var(--ink-soft)}',
    '.perr{margin:0;font-size:14px;color:var(--alarm);min-height:1em}',
    '.pform{display:flex;gap:6px}',
    '.pform input{flex:1;min-width:0;border:2px solid var(--ink);background:#fff;padding:8px;font:inherit;font-size:16px}',
    '.pcard{border:2px solid var(--ink);padding:10px;background:#fff;display:flex;flex-direction:column;gap:6px}',
    '.pcard h3{margin:0;font-family:var(--f-stamp);font-size:20px}',
    '.pcard code{font-family:var(--f-type);font-size:15px;background:var(--paper);padding:1px 6px;border:1px dashed var(--ink-soft)}',
    '.gbox{display:flex;justify-content:center;min-height:44px}',
    '.prow{display:flex;gap:8px;flex-wrap:wrap}'
  ].join('\n');
  document.head.appendChild(css);

  /* ---------- Google ---------- */
  function loadGis() {
    if (window.google && google.accounts) return Promise.resolve();
    if (gisLoading) return gisLoading;
    gisLoading = new Promise(function (res, rej) { var s = document.createElement('script'); s.src = 'https://accounts.google.com/gsi/client'; s.async = true; s.onload = res; s.onerror = rej; document.head.appendChild(s); });
    return gisLoading;
  }
  function onCredential(cred) {
    return api('auth', { credential: cred }).then(function (j) { ME = j.user; afterLogin(); }).catch(function (e) { var el = document.querySelector('.perr'); if (el) el.textContent = errText(e.code); });
  }
  function loginBox(el) {
    if (!el) return;
    if (CFG.google) {
      el.innerHTML = '<div class="gbox"></div>';
      loadGis().then(function () {
        google.accounts.id.initialize({ client_id: CFG.google, callback: function (r) { onCredential(r.credential); }, ux_mode: 'popup' });
        google.accounts.id.renderButton(el.querySelector('.gbox'), { theme: 'outline', size: 'large', text: 'signin_with', shape: 'rectangular', locale: LANG === 'rs' ? 'sr' : (LANG === 'ba' ? 'bs' : 'hr') });
      }).catch(function () { el.innerHTML = '<p class="perr">' + esc(errText()) + '</p>'; });
    } else if (CFG.dev) {
      el.innerHTML = '<div class="pform"><input id="devn" placeholder="' + esc(tx().devName) + '" maxlength="20"><button type="button" class="obtn dark" id="devgo">' + esc(tx().devGo) + '</button></div>';
      el.querySelector('#devgo').onclick = function () { var n = el.querySelector('#devn').value.trim() || 'Test'; onCredential('dev:' + n); };
    }
  }
  function afterLogin() {
    if (PENDING) { var p = PENDING; PENDING = null; submit(p.data, p.el); }
    if (INVITE && ME && !ME.parties[LANG]) openPanel('party'); else if (dlg && dlg.open) drawTab();
    drawHero();
  }

  /* ---------- početni ekran ---------- */
  var ICON = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M3 10h18M5 10v8M9 10v8M15 10v8M19 10v8M3 20h18M12 3l9 5H3z" fill="none" stroke="currentColor" stroke-width="2" stroke-linejoin="round"/></svg>';
  function drawHero() {
    if (!heroEl || !document.body.contains(heroEl)) return;
    if (!ready()) { heroEl.innerHTML = ''; return; }
    var t = tx(), h = '<button type="button" class="obtn" id="o-board">' + ICON + esc(t.board) + '</button>';
    if (ME) h += '<p class="who">' + esc(t.as) + ' <b>' + esc(ME.name) + '</b>' + (ME.parties[LANG] ? ' · ' + esc(ME.parties[LANG].name) : '') + '</p>';
    else h += '<button type="button" class="obtn" id="o-login">' + esc(t.login) + '</button>';
    heroEl.innerHTML = h;
    heroEl.querySelector('#o-board').onclick = function () { openPanel('izb'); };
    var l = heroEl.querySelector('#o-login'); if (l) l.onclick = function () { openPanel('party'); };
  }

  /* ---------- ploča ---------- */
  var dlg = null, TAB = 'izb', BOARD = null;
  function openPanel(tab) {
    if (!ready()) return;
    if (!dlg) { dlg = document.createElement('dialog'); dlg.id = 'pnl'; document.body.appendChild(dlg); dlg.addEventListener('click', function (e) { if (e.target === dlg) dlg.close(); }); }
    TAB = tab || TAB; drawShell();
    if (!dlg.open) { try { dlg.showModal(); } catch (e) { dlg.setAttribute('open', ''); } }
    BOARD = null; api('board?lang=' + LANG).then(function (j) { BOARD = j; drawTab(); }).catch(function () { BOARD = { error: 1 }; drawTab(); });
  }
  function drawShell() {
    var t = tx();
    dlg.innerHTML = '<div class="pnl"><header><h2>' + esc(t.board) + '<small id="pwk"></small></h2><button type="button" class="x" aria-label="' + esc(t.close) + '">×</button></header>' +
      '<div class="ptabs" role="tablist">' + [['izb', t.izb], ['parl', t.parl], ['party', t.party]].map(function (x) { return '<button type="button" role="tab" data-t="' + x[0] + '" aria-selected="' + (TAB === x[0]) + '">' + esc(x[1]) + '</button>'; }).join('') + '</div>' +
      '<div class="pbody" id="pbody"></div></div>';
    dlg.querySelector('.x').onclick = function () { dlg.close(); };
    Array.prototype.forEach.call(dlg.querySelectorAll('.ptabs button'), function (b) { b.onclick = function () { TAB = b.dataset.t; Array.prototype.forEach.call(dlg.querySelectorAll('.ptabs button'), function (c) { c.setAttribute('aria-selected', c === b); }); drawTab(); }; });
    drawTab();
  }
  function drawTab() {
    var el = dlg && dlg.querySelector('#pbody'); if (!el) return; var t = tx();
    if (BOARD && BOARD.week) dlg.querySelector('#pwk').textContent = t.week + ' ' + BOARD.week.split('-W')[1] + '. · ' + BOARD.week.split('-')[0] + ' · ' + BOARD.voters + ' 🗳';
    if (TAB === 'party') return drawParty(el);
    if (!BOARD) { el.innerHTML = '<p class="pmsg">…</p>'; return; }
    if (BOARD.error) { el.innerHTML = '<p class="perr">' + esc(errText()) + '</p>'; return; }
    if (TAB === 'izb') {
      var w = BOARD.last && BOARD.last.winner;
      var h = w ? '<div class="win">🏆 ' + esc(t.lastWin) + ': <b>' + esc(w.name) + '</b> (' + w.score + ')</div>' : '';
      h += BOARD.izbori.length ? '<ol class="lb">' + BOARD.izbori.map(function (p, i) { return '<li' + (p.me ? ' class="me"' : '') + '><span class="n">' + (i + 1) + '.</span><span class="nm">' + esc(p.name) + (p.me ? ' <small>(' + esc(t.you) + ')</small>' : '') + '</span><b>' + p.score + '</b></li>'; }).join('') + '</ol>' : '<p class="pmsg">' + esc(t.none) + '</p>';
      if (BOARD.me && BOARD.me.rank > BOARD.izbori.length) h += '<ol class="lb"><li class="me"><span class="n">' + BOARD.me.rank + '.</span><span class="nm">' + esc(ME ? ME.name : t.you) + '</span><b>' + BOARD.me.score + '</b></li></ol>';
      if (!ME) h += '<p class="pmsg">' + esc(t.needLogin) + '</p><div id="lgn"></div><p class="perr"></p>';
      el.innerHTML = h; if (!ME) loginBox(el.querySelector('#lgn'));
    } else {
      var lp = BOARD.last && BOARD.last.party, P = BOARD.sabor;
      var h2 = lp ? '<div class="win">🏛 ' + esc(t.lastParty) + ': <b>' + esc(lp.name) + '</b></div>' : '';
      h2 += hemicycle(P, BOARD.seats);
      h2 += P.length ? '<ul class="lb">' + P.map(function (p, i) { return '<li><span class="sw" style="background:' + (COLORS[i] || '#9aa3a8') + '"></span><span class="nm">' + esc(p.name) + ' <small>' + clan(p.members) + '</small></span><b>' + p.seats + '</b></li>'; }).join('') + '</ul>' : '<p class="pmsg">' + esc(t.noParty) + '</p>';
      h2 += '<p class="pmsg">' + esc(t.rules) + '</p>';
      el.innerHTML = h2;
    }
  }
  // polukrug zastupnika: sjedala po redovima, boje slijeva nadesno po strankama
  function hemicycle(parties, N) {
    var rows = N <= 60 ? 4 : N <= 160 ? 7 : 10, inner = .42, R = [], sum = 0, i, j;
    for (i = 0; i < rows; i++) { R.push(inner + (1 - inner) * i / (rows - 1)); sum += R[i]; }
    var cnt = R.map(function (r) { return Math.round(N * r / sum); }); cnt[rows - 1] += N - cnt.reduce(function (a, b) { return a + b; }, 0);
    var pts = [];
    for (i = 0; i < rows; i++) for (j = 0; j < cnt[i]; j++) { var a = Math.PI * (1 - (cnt[i] > 1 ? j / (cnt[i] - 1) : .5)); pts.push({ a: a, r: R[i] }); }
    pts.sort(function (p, q) { return q.a - p.a || p.r - q.r; });
    var col = []; (parties || []).forEach(function (p, k) { for (var s = 0; s < p.seats; s++) col.push(COLORS[k] || '#9aa3a8'); });
    var dot = Math.min(.045, 1.6 / Math.sqrt(N) / 4.2), svg = '';
    pts.forEach(function (p, k) { svg += '<circle cx="' + (Math.cos(p.a) * p.r).toFixed(3) + '" cy="' + (-Math.sin(p.a) * p.r).toFixed(3) + '" r="' + dot.toFixed(3) + '" fill="' + (col[k] || '#d9d4c0') + '"/>'; });
    return '<svg class="hemi" viewBox="-1.08 -1.08 2.16 1.2" role="img" aria-label="' + N + '">' + svg + '<text x="0" y="-.08" text-anchor="middle" font-size=".2" font-family="Archivo Black,Arial Black,sans-serif" fill="#1f252b">' + N + '</text></svg>';
  }

  function drawParty(el) {
    var t = tx();
    if (!ME) {
      var inv = INVITE ? '<div class="win">' + esc(t.inviteQ) + ' <b id="invn">' + esc(INVITE) + '</b></div>' : '';
      el.innerHTML = inv + '<p class="pmsg">' + esc(t.needLogin) + '</p><div id="lgn"></div><p class="perr"></p>';
      loginBox(el.querySelector('#lgn'));
      if (INVITE) api('party?id=' + INVITE).then(function (j) { var n = el.querySelector('#invn'); if (n) n.textContent = j.party.name; }).catch(function () {});
      return;
    }
    var head = '<p class="pmsg">' + esc(t.as) + ' <b>' + esc(ME.name) + '</b> · <a href="#" id="o-ren">' + esc(t.rename) + '</a> · <a href="#" id="o-out">' + esc(t.logout) + '</a></p>';
    var mine = ME.parties[LANG];
    if (mine) {
      el.innerHTML = head + '<div class="pcard"><small>' + esc(t.yourParty) + '</small><h3>' + esc(mine.name) + '</h3><span>' + esc(t.code) + ': <code>' + esc(mine.id) + '</code></span>' +
        '<div class="prow"><button type="button" class="obtn dark" id="o-inv">' + esc(t.invite) + '</button><button type="button" class="obtn" id="o-leave">' + esc(t.leave) + '</button></div><p class="perr" id="perr"></p></div><ol class="lb" id="pmem"></ol>';
      api('party?id=' + mine.id).then(function (j) { var m = el.querySelector('#pmem'); if (m) m.innerHTML = j.party.members.map(function (p, i) { return '<li><span class="n">' + (i + 1) + '.</span><span class="nm">' + esc(p.name) + '</span><b>' + p.score + '</b></li>'; }).join(''); }).catch(function () {});
      el.querySelector('#o-inv').onclick = function () {
        var url = location.origin + location.pathname + '?stranka=' + mine.id, msg = el.querySelector('#perr');
        if (navigator.share) navigator.share({ title: 'Pečat!', text: mine.name, url: url }).catch(function () {});
        else if (navigator.clipboard) navigator.clipboard.writeText(url).then(function () { msg.style.color = 'var(--ok)'; msg.textContent = t.copied; });
      };
      el.querySelector('#o-leave').onclick = function () { api('party/leave', { lang: LANG }).then(function (j) { ME = j.user; drawTab(); drawHero(); }); };
    } else {
      el.innerHTML = head + (INVITE ? '<div class="pcard"><small>' + esc(t.inviteQ) + '</small><h3 id="invn">' + esc(INVITE) + '</h3><button type="button" class="obtn dark" id="o-ij">' + esc(t.join) + '</button></div>' : '') +
        '<h3 style="margin:4px 0 0">' + esc(t.found) + '</h3><div class="pform"><input id="o-pn" maxlength="28" placeholder="' + esc(t.name) + '"><button type="button" class="obtn dark" id="o-pc">' + esc(t.create) + '</button></div><p class="perr" id="perr"></p>' +
        '<div class="pform"><input id="o-q" placeholder="' + esc(t.search) + '"></div><ul class="lb" id="o-list"></ul>';
      var err = el.querySelector('#perr');
      function joined(j) { ME = j.user; INVITE = ''; try { history.replaceState(null, '', location.pathname); } catch (e) {} drawTab(); drawHero(); }
      if (INVITE) {
        api('party?id=' + INVITE).then(function (j) { var n = el.querySelector('#invn'); if (n) n.textContent = j.party.name; }).catch(function () {});
        el.querySelector('#o-ij').onclick = function () { api('party/join', { id: INVITE }).then(joined).catch(function (e) { err.textContent = errText(e.code); }); };
      }
      el.querySelector('#o-pc').onclick = function () { api('party/create', { lang: LANG, name: el.querySelector('#o-pn').value }).then(joined).catch(function (e) { err.textContent = errText(e.code); }); };
      var tm = null; function list() { api('parties?lang=' + LANG + '&q=' + encodeURIComponent(el.querySelector('#o-q').value)).then(function (j) {
        var ul = el.querySelector('#o-list'); if (!ul) return;
        ul.innerHTML = j.parties.map(function (p) { return '<li><span class="nm">' + esc(p.name) + ' <small>' + clan(p.members) + '</small></span><button type="button" class="obtn" data-id="' + esc(p.id) + '">' + esc(t.join) + '</button></li>'; }).join('');
        Array.prototype.forEach.call(ul.querySelectorAll('button'), function (b) { b.onclick = function () { api('party/join', { id: b.dataset.id }).then(joined).catch(function (e) { err.textContent = errText(e.code); }); }; });
      }).catch(function () {}); }
      el.querySelector('#o-q').oninput = function () { clearTimeout(tm); tm = setTimeout(list, 250); }; list();
    }
    el.querySelector('#o-out').onclick = function (e) { e.preventDefault(); api('logout', {}).then(function () { ME = null; drawTab(); drawHero(); }); };
    el.querySelector('#o-ren').onclick = function (e) { e.preventDefault(); var n = prompt(t.rename, ME.name); if (!n) return; api('nick', { name: n }).then(function (j) { ME = j.user; drawTab(); drawHero(); }).catch(function (er) { alert(errText(er.code === 'name_len' ? 'name_len' : er.code)); }); };
  }

  /* ---------- kraj igre: glas na izbore ---------- */
  function submit(data, el) {
    if (!GT || GT.lang !== data.lang) return;
    var t = tx(), gt = GT.gt; GT = null;
    api('score', { lang: data.lang, score: data.score, gt: gt }).then(function (j) {
      if (!el || !document.body.contains(el)) return;
      el.innerHTML = '<p>🗳 ' + esc(t.voted(j.rank, j.voters)) + (j.improved ? '' : ' ' + esc(t.notBest(j.best))) + '</p><button type="button" class="obtn" id="o-open">' + ICON + esc(t.open) + '</button>';
      el.querySelector('#o-open').onclick = function () { openPanel('izb'); };
    }).catch(function (e) {
      if (!el || !document.body.contains(el)) return;
      el.innerHTML = '<p class="pmsg">' + esc(/ticket/.test(e.code || '') ? t.tooFast : errText(e.code)) + '</p>';
    });
  }

  window.PECAT_HOOKS = {
    hero: function (el, lang) { LANG = lang; heroEl = el; drawHero(); if (INVITE && ready() && !(ME && ME.parties[LANG])) { INVITE_SHOWN || (INVITE_SHOWN = 1, openPanel('party')); } },
    lang: function (lang) { LANG = lang; drawHero(); },
    start: function (lang) { LANG = lang; GT = null; if (!ready()) return; api('start', { lang: lang }).then(function (j) { GT = { gt: j.gt, lang: lang }; }).catch(function () {}); },
    end: function (data, el) {
      LANG = data.lang; if (!ready() || !el) return; var t = tx();
      if (ME) return submit(data, el);
      if (!GT) return;
      PENDING = { data: data, el: el };
      el.innerHTML = '<p>' + esc(t.voteLogin) + '</p><div id="lgn2"></div><p class="perr"></p>';
      loginBox(el.querySelector('#lgn2'));
    }
  };
  var INVITE_SHOWN = 0;

  fetch('/api/config', { credentials: 'same-origin' }).then(function (r) { return r.ok ? r.json() : null; }).then(function (c) {
    if (!c || !(c.google || c.dev)) return; CFG = c;
    return api('me').then(function (j) { ME = j.user; }).catch(function () {}).then(function () { drawHero(); if (INVITE && heroEl && document.body.contains(heroEl) && !INVITE_SHOWN) { INVITE_SHOWN = 1; openPanel('party'); } });
  }).catch(function () {});
})();
