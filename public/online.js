/* Pečat! online: prijava Googleom, izbori (pojedinci), stranke i Sabor (zajednice).
   Radi samo kad postoji /api (Vercel). U pregledu bez poslužitelja sve ostaje skriveno. */
(function () {
  'use strict';
  var TX = {
    hr: {
      nn: 'Novine', nnTitle: 'Narodne novine', nnSub: function (w, f) { return (f ? 'Službeno izdanje' : 'Izdanje u tisku') + ' · tjedan ' + w; }, nnWin: 'Pobjednik izbora', nnParty: 'Najjača stranka', nnVlada: 'Vlada', nnNoVlada: 'Nitko nema većinu. Pregovori traju.',
      nnRare: 'Najrjeđi odgovor tjedna', nnPx: function (n) { return n + ' prebjega ovaj tjedan'; }, nnVoters: function (n) { return n + ' glasača'; }, nnShare: 'Podijeli novine', nnEmpty: 'Novine još nemaju o čemu pisati. Odigraj partiju!', feed: 'Iz Sabora',
      ev: { prebjeg: function (e) { return e.who + ' prelazi iz stranke ' + e.from + ' u ' + e.to + '!'; }, nova: function (e) { return e.who + ' osniva stranku ' + e.to + '.'; }, koalicija: function (e) { return 'Koalicija: ' + e.from + ' + ' + e.to + '.'; }, raskid: function (e) { return e.from + ' izlazi iz koalicije.'; } },
      vlada: function (p, n) { return 'Vlada: ' + p + ' (' + n + ' mjesta)'; }, noVlada: function (n) { return 'Nitko nema većinu (treba ' + n + ').'; }, coalition: 'koalicija',
      roles: ['Predsjednik stranke', 'Glasnogovornik', 'Član', 'Zamjenik za protokol'], founder: 'osnivač', inviteCo: 'Pozovi u koaliciju', invited: 'Poziv poslan.', coInv: 'Pozivi u koaliciju', accept: 'Prihvati', decline: 'Odbij', leaveCo: 'Izađi iz koalicije', inCo: 'U koaliciji',
      sug: 'Predloži pitanje', sugQ: 'Pitanje (npr. Navedi vrstu bureka)', sugA: 'Točni odgovori, odvojeni zarezom (barem 3)', sugF: 'Fora službenice (nije obavezno)', sugSend: 'Pošalji na šalter', sugOk: 'Primljeno! Šef će pregledati u roku od 60 radnih dana. Ili sutra.', hardVote: ' (ljestvica Šefa odsjeka)', sefTitle: 'Šef odsjeka: posebna ljestvica',
      zak: 'Zakoni', zakTitle: 'Peticije građana', zakIntro: 'Predloži zakon i skupljaj potpise. Peticija s najviše potpisa u tjednu ide u Sabor i izglasava se u nedjelju.', zakPh: 'Zakon o …', zakSend: 'Predaj peticiju', zakSign: 'Potpiši', zakSigned: 'Potpisano', zakMine: 'tvoja', zakVotes: function (n) { var d = n % 10, h = n % 100; return n + (d === 1 && h !== 11 ? ' potpis' : (d >= 2 && d <= 4 && (h < 12 || h > 14) ? ' potpisa' : ' potpisa')); }, zakPassed: 'Sabor je izglasao', zakLead: 'Vodi u Saboru', zakNone: 'Još nema peticija ovaj tjedan. Budi prvi!', zakDaily: 'Danas si već predao/la peticiju. Sutra opet.', zakOk: 'Peticija predana i potpisana!', zakEnd: 'Predloži zakon', zakBy: 'predlaže', login: 'Prijava Googleom', board: 'Sabor i izbori', parl: 'Sabor', izb: 'Izbori', party: 'Stranka', week: 'tjedan', close: 'Zatvori',
      ttl: 'Titula tjedna', lastWin: 'Prošli tjedan izbore je dobio/la', lastParty: 'Vladajuća stranka prošlog tjedna', none: 'Još nitko nije glasao ovaj tjedan. Budi prvi!',
      noParty: 'Nijedna stranka još nema bodove ovaj tjedan.', seats: 'mjesta', members: 'članova', pts: 'bodova', you: 'ti',
      needLogin: 'Prijavi se da ti se rezultat broji na izborima i da se možeš učlaniti u stranku.', as: 'Prijavljen/a kao', logout: 'Odjava', rename: 'Promijeni ime',
      found: 'Osnuj stranku', name: 'Ime stranke', create: 'Osnuj', join: 'Učlani se', leave: 'Izađi iz stranke', search: 'Traži stranku…', invite: 'Pozovi ekipu',
      copied: 'Poveznica kopirana!', code: 'Šifra stranke', yourParty: 'Tvoja stranka', inviteQ: 'Pozvan/a si u stranku', rules: 'Svaki član donosi svoj najbolji rezultat tjedna. Mjesta u Saboru dijele se D’Hondtovom metodom, kao u pravom.',
      voted: function (r, n) { return 'Glas je ubrojen: ' + r + '. mjesto od ' + n + ' ovaj tjedan.'; }, notBest: function (b) { return 'Tvoj najbolji ovaj tjedan ostaje ' + b + '.'; },
      chalNoVote: 'Izazovi ne ulaze na izbore. Na izbore idu samo tvoje 2 dnevne partije.', tooFast: 'Ovaj rezultat se ne broji (igra je bila prebrza).', voteLogin: 'Prijavi se Googleom i ovaj rezultat ide na izbore.', biser: 'Biser dana', biserSub: 'Najluđi odgovor kojeg nema u papirima', biserQ: 'na pitanje', ballot: 'Glasački listić', ballotSub: function (w) { return 'Izbori · ' + w + '. tjedan'; }, open: 'Otvori Sabor', devName: 'Testno ime', devGo: 'Testna prijava',
      err: { pet_len: 'Zakon mora imati 10 do 110 znakova.', daily_limit: 'Danas su već predana 2 listića. Novi sutra.', pet_daily: 'Jedna peticija dnevno. Šalter za peticije radi sutra.', no_petition: 'Te peticije više nema.', name_real: 'Prave stranke ne primamo. Ovo je šalter, ne izborna komisija.', name_ugly: 'To ime ne prolazi na šalteru.', name_len: 'Ime mora imati 3 do 28 znakova.', name_chars: 'Samo slova, brojevi i razmaci.', name_taken: 'Ta stranka već postoji.', slow_down: 'Polako, šalter radi i sutra.', no_party: 'Nema takve stranke.', one_switch: 'Prebjeg je dozvoljen jednom tjedno. Pričekaj ponedjeljak.', not_manager: 'To može samo osnivač stranke.', suggest_short: 'Pitanje mora imati barem 3 odgovora.', already: 'Već ste u istoj koaliciji.', def: 'Šalter ne radi. Pokušaj kasnije.' } },
    ba: {
      nn: 'Novine', nnTitle: 'Službene novine', nnSub: function (w, f) { return (f ? 'Službeno izdanje' : 'Izdanje u tisku') + ' · sedmica ' + w; }, nnWin: 'Pobjednik izbora', nnParty: 'Najjača stranka', nnVlada: 'Vijeće ministara', nnNoVlada: 'Niko nema većinu. Pregovori traju.',
      nnRare: 'Najrjeđi odgovor sedmice', nnPx: function (n) { return n + ' prebjega ove sedmice'; }, nnVoters: function (n) { return n + ' glasača'; }, nnShare: 'Podijeli novine', nnEmpty: 'Novine još nemaju o čemu pisati. Odigraj partiju!', feed: 'Iz Parlamenta',
      ev: { prebjeg: function (e) { return e.who + ' prelazi iz stranke ' + e.from + ' u ' + e.to + '!'; }, nova: function (e) { return e.who + ' osniva stranku ' + e.to + '.'; }, koalicija: function (e) { return 'Koalicija: ' + e.from + ' + ' + e.to + '.'; }, raskid: function (e) { return e.from + ' izlazi iz koalicije.'; } },
      vlada: function (p, n) { return 'Vijeće ministara: ' + p + ' (' + n + ' mjesta)'; }, noVlada: function (n) { return 'Niko nema većinu (treba ' + n + ').'; }, coalition: 'koalicija',
      roles: ['Predsjednik stranke', 'Glasnogovornik', 'Član', 'Zamjenik za protokol'], founder: 'osnivač', inviteCo: 'Pozovi u koaliciju', invited: 'Poziv poslan.', coInv: 'Pozivi u koaliciju', accept: 'Prihvati', decline: 'Odbij', leaveCo: 'Izađi iz koalicije', inCo: 'U koaliciji',
      sug: 'Predloži pitanje', sugQ: 'Pitanje (npr. Navedi vrstu bureka)', sugA: 'Tačni odgovori, odvojeni zarezom (barem 3)', sugF: 'Fora službenice (nije obavezno)', sugSend: 'Pošalji na šalter', sugOk: 'Primljeno! Šef će pregledati u roku od 60 radnih dana. Ili sutra.', hardVote: ' (ljestvica Šefa odsjeka)', sefTitle: 'Šef odsjeka: posebna ljestvica',
      zak: 'Zakoni', zakTitle: 'Peticije građana', zakIntro: 'Predloži zakon i skupljaj potpise. Peticija s najviše potpisa u sedmici ide u Parlament i izglasava se u nedjelju.', zakPh: 'Zakon o …', zakSend: 'Predaj peticiju', zakSign: 'Potpiši', zakSigned: 'Potpisano', zakMine: 'tvoja', zakVotes: function (n) { var d = n % 10, h = n % 100; return n + (d === 1 && h !== 11 ? ' potpis' : ' potpisa'); }, zakPassed: 'Parlament je izglasao', zakLead: 'Vodi u Parlamentu', zakNone: 'Još nema peticija ove sedmice. Budi prvi!', zakDaily: 'Danas si već predao/la peticiju. Sutra opet.', zakOk: 'Peticija predana i potpisana!', zakEnd: 'Predloži zakon', zakBy: 'predlaže', login: 'Prijava Googleom', board: 'Parlament i izbori', parl: 'Parlament', izb: 'Izbori', party: 'Stranka', week: 'sedmica', close: 'Zatvori',
      ttl: 'Titula sedmice', lastWin: 'Prošle sedmice izbore je dobio/la', lastParty: 'Vladajuća stranka prošle sedmice', none: 'Još niko nije glasao ove sedmice. Budi prvi!',
      noParty: 'Nijedna stranka još nema bodove ove sedmice.', seats: 'mjesta', members: 'članova', pts: 'bodova', you: 'ti',
      needLogin: 'Prijavi se da ti se rezultat broji na izborima i da se možeš učlaniti u stranku.', as: 'Prijavljen/a kao', logout: 'Odjava', rename: 'Promijeni ime',
      found: 'Osnuj stranku', name: 'Ime stranke', create: 'Osnuj', join: 'Učlani se', leave: 'Izađi iz stranke', search: 'Traži stranku…', invite: 'Pozovi raju',
      copied: 'Link kopiran!', code: 'Šifra stranke', yourParty: 'Tvoja stranka', inviteQ: 'Pozvan/a si u stranku', rules: 'Svaki član donosi svoj najbolji rezultat sedmice. Mjesta u Parlamentu dijele se D’Hondtovom metodom.',
      voted: function (r, n) { return 'Glas je ubrojen: ' + r + '. mjesto od ' + n + ' ove sedmice.'; }, notBest: function (b) { return 'Tvoj najbolji ove sedmice ostaje ' + b + '.'; },
      chalNoVote: 'Izazovi ne ulaze na izbore. Na izbore idu samo tvoje 2 dnevne partije.', tooFast: 'Ovaj rezultat se ne broji (igra je bila prebrza).', voteLogin: 'Prijavi se Googleom i ovaj rezultat ide na izbore.', biser: 'Biser dana', biserSub: 'Najluđi odgovor kojeg nema u papirima', biserQ: 'na pitanje', ballot: 'Glasački listić', ballotSub: function (w) { return 'Izbori · ' + w + '. sedmica'; }, open: 'Otvori Parlament', devName: 'Testno ime', devGo: 'Testna prijava',
      err: { pet_len: 'Zakon mora imati 10 do 110 znakova.', daily_limit: 'Danas su već predana 2 listića. Novi sutra.', pet_daily: 'Jedna peticija dnevno. Šalter za peticije radi sutra.', no_petition: 'Te peticije više nema.', name_real: 'Prave stranke ne primamo. Ovo je šalter, ne CIK.', name_ugly: 'To ime ne prolazi na šalteru.', name_len: 'Ime mora imati 3 do 28 znakova.', name_chars: 'Samo slova, brojevi i razmaci.', name_taken: 'Ta stranka već postoji.', slow_down: 'Polahko, šalter radi i sutra.', no_party: 'Nema takve stranke.', one_switch: 'Prebjeg je dozvoljen jednom tjedno. Pričekaj ponedjeljak.', not_manager: 'To može samo osnivač stranke.', suggest_short: 'Pitanje mora imati barem 3 odgovora.', already: 'Već ste u istoj koaliciji.', def: 'Šalter ne radi. Pokušaj kasnije.' } },
    rs: {
      nn: 'Novine', nnTitle: 'Službeni glasnik', nnSub: function (w, f) { return (f ? 'Službeno izdanje' : 'Izdanje u tisku') + ' · nedelja ' + w; }, nnWin: 'Pobjednik izbora', nnParty: 'Najjača stranka', nnVlada: 'Vlada', nnNoVlada: 'Niko nema većinu. Pregovori traju.',
      nnRare: 'Najređi odgovor nedelje', nnPx: function (n) { return n + ' prebega ove nedelje'; }, nnVoters: function (n) { return n + ' glasača'; }, nnShare: 'Podijeli novine', nnEmpty: 'Novine još nemaju o čemu pisati. Odigraj partiju!', feed: 'Iz Skupštine',
      ev: { prebjeg: function (e) { return e.who + ' prelazi iz stranke ' + e.from + ' u ' + e.to + '!'; }, nova: function (e) { return e.who + ' osniva stranku ' + e.to + '.'; }, koalicija: function (e) { return 'Koalicija: ' + e.from + ' + ' + e.to + '.'; }, raskid: function (e) { return e.from + ' izlazi iz koalicije.'; } },
      vlada: function (p, n) { return 'Vlada: ' + p + ' (' + n + ' mesta)'; }, noVlada: function (n) { return 'Niko nema većinu (treba ' + n + ').'; }, coalition: 'koalicija',
      roles: ['Predsjednik stranke', 'Glasnogovornik', 'Član', 'Zamjenik za protokol'], founder: 'osnivač', inviteCo: 'Pozovi u koaliciju', invited: 'Poziv poslan.', coInv: 'Pozivi u koaliciju', accept: 'Prihvati', decline: 'Odbij', leaveCo: 'Izađi iz koalicije', inCo: 'U koaliciji',
      sug: 'Predloži pitanje', sugQ: 'Pitanje (npr. Navedi vrstu bureka)', sugA: 'Tačni odgovori, odvojeni zarezom (bar 3)', sugF: 'Fora službenice (nije obavezno)', sugSend: 'Pošalji na šalter', sugOk: 'Primljeno! Šef će pregledati u roku od 60 radnih dana. Ili sutra.', hardVote: ' (lestvica Šefa odseka)', sefTitle: 'Šef odseka: posebna lestvica',
      zak: 'Zakoni', zakTitle: 'Peticije građana', zakIntro: 'Predloži zakon i skupljaj potpise. Peticija sa najviše potpisa u nedelji ide u Skupštinu i izglasava se u nedelju.', zakPh: 'Zakon o …', zakSend: 'Predaj peticiju', zakSign: 'Potpiši', zakSigned: 'Potpisano', zakMine: 'tvoja', zakVotes: function (n) { var d = n % 10, h = n % 100; return n + (d === 1 && h !== 11 ? ' potpis' : ' potpisa'); }, zakPassed: 'Skupština je izglasala', zakLead: 'Vodi u Skupštini', zakNone: 'Još nema peticija ove nedelje. Budi prvi!', zakDaily: 'Danas si već predao/la peticiju. Sutra opet.', zakOk: 'Peticija predata i potpisana!', zakEnd: 'Predloži zakon', zakBy: 'predlaže', login: 'Prijava Guglom', board: 'Skupština i izbori', parl: 'Skupština', izb: 'Izbori', party: 'Stranka', week: 'nedelja', close: 'Zatvori',
      ttl: 'Titula nedelje', lastWin: 'Prošle nedelje izbore je dobio/la', lastParty: 'Vladajuća stranka prošle nedelje', none: 'Još niko nije glasao ove nedelje. Budi prvi!',
      noParty: 'Nijedna stranka još nema bodove ove nedelje.', seats: 'mesta', members: 'članova', pts: 'bodova', you: 'ti',
      needLogin: 'Prijavi se da ti se rezultat računa na izborima i da možeš da se učlaniš u stranku.', as: 'Prijavljen/a kao', logout: 'Odjava', rename: 'Promeni ime',
      found: 'Osnuj stranku', name: 'Ime stranke', create: 'Osnuj', join: 'Učlani se', leave: 'Izađi iz stranke', search: 'Traži stranku…', invite: 'Pozovi ekipu',
      copied: 'Link kopiran!', code: 'Šifra stranke', yourParty: 'Tvoja stranka', inviteQ: 'Pozvan/a si u stranku', rules: 'Svaki član donosi svoj najbolji rezultat nedelje. Mesta u Skupštini dele se D’Ontovom metodom.',
      voted: function (r, n) { return 'Glas je uračunat: ' + r + '. mesto od ' + n + ' ove nedelje.'; }, notBest: function (b) { return 'Tvoj najbolji ove nedelje ostaje ' + b + '.'; },
      chalNoVote: 'Izazovi ne ulaze na izbore. Na izbore idu samo tvoje 2 dnevne partije.', tooFast: 'Ovaj rezultat se ne računa (igra je bila prebrza).', voteLogin: 'Prijavi se Guglom i ovaj rezultat ide na izbore.', biser: 'Biser dana', biserSub: 'Najluđi odgovor kojeg nema u papirima', biserQ: 'na pitanje', ballot: 'Glasački listić', ballotSub: function (w) { return 'Izbori · ' + w + '. nedelja'; }, open: 'Otvori Skupštinu', devName: 'Probno ime', devGo: 'Probna prijava',
      err: { pet_len: 'Zakon mora da ima 10 do 110 znakova.', daily_limit: 'Danas su već predata 2 listića. Novi sutra.', pet_daily: 'Jedna peticija dnevno. Šalter za peticije radi sutra.', no_petition: 'Te peticije više nema.', name_real: 'Prave stranke ne primamo. Ovo je šalter, ne RIK.', name_ugly: 'To ime ne prolazi na šalteru.', name_len: 'Ime mora da ima 3 do 28 znakova.', name_chars: 'Samo slova, brojevi i razmaci.', name_taken: 'Ta stranka već postoji.', slow_down: 'Polako, šalter radi i sutra.', no_party: 'Nema takve stranke.', one_switch: 'Prebjeg je dozvoljen jednom tjedno. Pričekaj ponedjeljak.', not_manager: 'To može samo osnivač stranke.', suggest_short: 'Pitanje mora imati barem 3 odgovora.', already: 'Već ste u istoj koaliciji.', def: 'Šalter ne radi. Pokušaj kasnije.' } }
  };
  var COLORS = ['#3b37a6', '#b3271d', '#2e6b3f', '#c99a2e', '#7a4b8c', '#2b8a99', '#d0662b', '#6b7d2a', '#a23b72', '#44546a'];

  var CFG = null, ME = null, LANG = 'hr', GT = null, PENDING = null, heroEl = null, gisLoading = null;
  var INVITE = (new URLSearchParams(location.search).get('stranka') || '').toUpperCase().replace(/[^A-Z0-9]/g, '');

  function tx() { return TX[LANG] || TX.hr; }
  function esc(s) { return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; }); }
  function clan(n) { var d = n % 10, h = n % 100; return n + ' ' + (d === 1 && h !== 11 ? 'član' : (d >= 2 && d <= 4 && (h < 12 || h > 14) ? 'člana' : 'članova')); }
  function ago(ts) { var m = Math.round((Date.now() - ts) / 60000); return m < 60 ? m + ' min' : (m < 1440 ? Math.round(m / 60) + ' h' : Math.round(m / 1440) + ' d'); }
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
    '.lb.zak li{align-items:center}.lb.zak .nm{font-weight:600;white-space:normal;overflow:visible;text-overflow:clip}.lb.zak .nm small{display:block;font-weight:400;white-space:normal}.lb.zak .perr:empty{display:none}.zsig{padding:6px 10px;font-size:13px;white-space:nowrap}.zok{font-size:12px;color:var(--ok,#2e6b3f);white-space:nowrap;font-weight:700}.zakend{display:flex;margin:10px auto 0}',
    '.acct .who{font-family:var(--f-type);font-size:13px;color:var(--ink-soft);width:100%}',
    '.obtn{display:inline-flex;align-items:center;gap:6px;border:2px solid var(--ink);background:var(--paper);color:var(--ink);padding:8px 12px;font-weight:700;font-size:15px;border-radius:2px;box-shadow:2px 2px 0 rgba(0,0,0,.2)}',
    '.obtn.dark{background:var(--ink);color:var(--paper)}',
    '.obtn svg{width:18px;height:18px}',
    '.vote{display:flex;flex-direction:column;align-items:center;gap:8px;text-align:center;font-size:15px}',
    '.vote:empty{display:none}',
    '.vote p{margin:0}',
    '.vote{width:100%;align-items:stretch}',
    '.ballot{position:relative;background:#fffdf5;border:2px solid var(--ink);padding:12px 14px 14px;display:flex;flex-direction:column;align-items:center;gap:10px;max-width:360px;width:100%;align-self:center;box-shadow:4px 4px 0 rgba(0,0,0,.18);background-image:repeating-linear-gradient(0deg,transparent 0 27px,rgba(59,55,166,.08) 27px 28px)}',
    '.ballot::before{content:"";position:absolute;inset:5px;border:1px dashed rgba(31,37,43,.35);pointer-events:none}',
    '.bhead{display:flex;align-items:center;gap:10px;align-self:stretch;border-bottom:2px solid var(--ink);padding-bottom:8px;text-align:left}',
    '.bhead .bbox{display:grid;place-items:center;width:34px;height:34px;border:2px solid var(--ink);font-size:18px;background:var(--paper)}',
    '.bhead b{display:block;font-family:var(--f-stamp);font-size:17px;letter-spacing:.06em;text-transform:uppercase}',
    '.bhead small{font-family:var(--f-type);font-size:12px;color:var(--ink-soft)}',
    '.bmain{font-size:16px;font-weight:700;line-height:1.3}',
    '.bsub{font-size:14px;color:var(--ink-soft)}',
    '.glogin{display:flex;justify-content:center;width:100%;min-height:44px}',
    '.glogin .gbox{justify-content:center}',
    '.ballot .perr:empty{display:none}',
    '.biser:empty{display:none}',
    '.biser{width:100%;max-width:360px;align-self:center}',
    '.biserc{display:flex;gap:12px;align-items:center;padding:12px 14px;background:#fff;border:2px solid var(--ink);box-shadow:4px 4px 0 rgba(0,0,0,.18);text-align:left;animation:shpop .4s ease both}',
    '.biserc small{display:block;font-family:var(--f-type);font-size:11.5px;color:var(--ink-soft);text-transform:uppercase;letter-spacing:.05em}',
    '.biserc b{display:block;font-size:20px;line-height:1.2;margin:3px 0 2px;word-break:break-word}',
    '.biserc em{display:block;font-size:13px;color:var(--ink-soft);font-style:normal}',
    '.pearl{flex:none;width:38px;height:38px;border-radius:50%;background:radial-gradient(circle at 35% 30%,#fff 0 18%,#f1ecf7 30%,#d9d1e6 60%,#b8adc9 100%);box-shadow:inset -3px -4px 8px rgba(80,60,110,.25),0 2px 4px rgba(0,0,0,.2)}',
    '.paper-nn .biserc{box-shadow:none;margin-top:10px}',
    '.bstamp{position:absolute;right:10px;top:8px;width:40px;height:40px;border:3px solid var(--ok);border-radius:50%;color:var(--ok);display:grid;place-items:center;font-size:22px;font-weight:900;transform:rotate(-14deg);opacity:.85}',
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
    '.prow{display:flex;gap:8px;flex-wrap:wrap}',
    '.sin{border:2px solid var(--ink);background:#fff;padding:8px;font:inherit;font-size:16px;width:100%;box-sizing:border-box}',
    '.paper-nn{background:#f3efe1;border:1px solid var(--paper-edge);padding:12px 14px;font-family:Georgia,serif;box-shadow:2px 3px 0 rgba(0,0,0,.12)}',
    '.paper-nn h2{margin:0;font-size:28px;text-align:center;text-transform:uppercase;letter-spacing:.02em}',
    '.paper-nn>small{display:block;text-align:center;font-family:var(--f-type);font-size:11px;color:var(--ink-soft)}',
    '.paper-nn hr{border:0;border-top:3px double var(--ink);margin:8px 0}',
    '.paper-nn .kick{margin:10px 0 0;font-family:var(--f-label);font-weight:700;color:var(--alarm);text-transform:uppercase;font-size:13px;letter-spacing:.06em}',
    '.paper-nn .head{margin:0;font-size:26px;font-weight:900;line-height:1.1}',
    '.paper-nn .sub2{margin:0;font-size:19px;font-weight:700}',
    '.paper-nn .small{margin:4px 0 0;font-size:14px}',
    '.lb.feed li{font-size:14px}',
    '.ptabs button{font-size:14px}'
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
        google.accounts.id.renderButton(el.querySelector('.gbox'), { theme: 'filled_black', size: 'large', text: 'continue_with', shape: 'pill', logo_alignment: 'left', width: Math.min(300, (el.clientWidth || 300) - 8), locale: LANG === 'rs' ? 'sr' : (LANG === 'ba' ? 'bs' : 'hr') });
      }).catch(function () { el.innerHTML = '<p class="perr">' + esc(errText()) + '</p>'; });
    } else if (CFG.dev) {
      el.innerHTML = '<div class="pform"><input id="devn" placeholder="' + esc(tx().devName) + '" maxlength="20"><button type="button" class="obtn dark" id="devgo">' + esc(tx().devGo) + '</button></div>';
      el.querySelector('#devgo').onclick = function () { var n = el.querySelector('#devn').value.trim() || 'Test'; onCredential('dev:' + n); };
    }
  }
  function afterLogin() {
    syncFromServer();
    if (PENDING) { var p = PENDING; PENDING = null; submit(p.data, p.el); }
    if (INVITE && ME && !ME.parties[LANG]) openPanel('party'); else if (dlg && dlg.open) { drawTab(); api('board?lang=' + LANG).then(function (j) { BOARD = j; drawTab(); }).catch(function () {}); }
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
    h += '<button type="button" class="obtn" id="o-sug">✍ ' + esc(t.sug) + '</button>';
    heroEl.innerHTML = h;
    heroEl.querySelector('#o-board').onclick = function () { openPanel('izb'); };
    heroEl.querySelector('#o-sug').onclick = function () { openPanel('sug'); };
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
      '<div class="ptabs" role="tablist">' + [['izb', t.izb], ['parl', t.parl], ['party', t.party], ['zak', t.zak], ['nn', t.nn]].map(function (x) { return '<button type="button" role="tab" data-t="' + x[0] + '" aria-selected="' + (TAB === x[0]) + '">' + esc(x[1]) + '</button>'; }).join('') + '</div>' +
      '<div class="pbody" id="pbody"></div></div>';
    dlg.querySelector('.x').onclick = function () { dlg.close(); };
    Array.prototype.forEach.call(dlg.querySelectorAll('.ptabs button'), function (b) { b.onclick = function () { TAB = b.dataset.t; Array.prototype.forEach.call(dlg.querySelectorAll('.ptabs button'), function (c) { c.setAttribute('aria-selected', c === b); }); drawTab(); }; });
    drawTab();
  }
  function drawTab() {
    var el = dlg && dlg.querySelector('#pbody'); if (!el) return; var t = tx();
    if (BOARD && BOARD.week) dlg.querySelector('#pwk').textContent = t.week + ' ' + BOARD.week.split('-W')[1] + '. · ' + BOARD.week.split('-')[0] + ' · ' + BOARD.voters + ' 🗳';
    if (TAB === 'party') return drawParty(el);
    if (TAB === 'nn') return drawNN(el);
    if (TAB === 'sug') return drawSug(el);
    if (TAB === 'zak') return drawZak(el);
    if (!BOARD) { el.innerHTML = '<p class="pmsg">…</p>'; return; }
    if (BOARD.error) { el.innerHTML = '<p class="perr">' + esc(errText()) + '</p>'; return; }
    if (TAB === 'izb') {
      var w = BOARD.last && BOARD.last.winner;
      var h = w ? '<div class="win">🏆 ' + esc(t.lastWin) + ': <b>' + esc(w.name) + '</b> (' + w.score + ')' + (window.PECAT_THEMES ? '<br><small>🎖 ' + esc(window.PECAT_THEMES.title(BOARD.last.week, LANG)) + '</small>' : '') + '</div>' : '';
      h += BOARD.izbori.length ? '<ol class="lb">' + BOARD.izbori.map(function (p, i) { return '<li' + (p.me ? ' class="me"' : '') + '><span class="n">' + (i + 1) + '.</span><span class="nm">' + esc(p.name) + (p.me ? ' <small>(' + esc(t.you) + ')</small>' : '') + '</span><b>' + p.score + '</b></li>'; }).join('') + '</ol>' : '<p class="pmsg">' + esc(t.none) + '</p>';
      if (BOARD.me && BOARD.me.rank > BOARD.izbori.length) h += '<ol class="lb"><li class="me"><span class="n">' + BOARD.me.rank + '.</span><span class="nm">' + esc(ME ? ME.name : t.you) + '</span><b>' + BOARD.me.score + '</b></li></ol>';
      if (BOARD.sef && BOARD.sef.length) h += '<h3 style="margin:8px 0 0">🔥 ' + esc(t.sefTitle) + '</h3><ol class="lb">' + BOARD.sef.slice(0, 10).map(function (p, i) { return '<li' + (p.me ? ' class="me"' : '') + '><span class="n">' + (i + 1) + '.</span><span class="nm">' + esc(p.name) + '</span><b>' + p.score + '</b></li>'; }).join('') + '</ol>';
      if (!ME) h += '<p class="pmsg">' + esc(t.needLogin) + '</p><div id="lgn"></div><p class="perr"></p>';
      el.innerHTML = h; if (!ME) loginBox(el.querySelector('#lgn'));
    } else {
      var lp = BOARD.last && BOARD.last.party, P = BOARD.sabor;
      var h2 = lp ? '<div class="win">🏛 ' + esc(t.lastParty) + ': <b>' + esc(lp.name) + '</b></div>' : '';
      var need = Math.floor(BOARD.seats / 2) + 1;
      h2 += '<div class="win" style="border-color:' + (BOARD.vlada ? 'var(--ok)' : 'var(--ink-soft)') + ';background:#fff">' + esc(BOARD.vlada ? t.vlada(BOARD.vlada.parties.join(' + '), BOARD.vlada.seats) : t.noVlada(need)) + '</div>';
      h2 += hemicycle(P, BOARD.seats);
      var co = (BOARD.blocs || []).filter(function (b) { return b.coalition; });
      if (co.length) h2 += '<ul class="lb">' + co.map(function (b) { return '<li><span class="nm">🤝 ' + esc(b.parties.join(' + ')) + ' <small>' + esc(t.coalition) + '</small></span><b>' + b.seats + '</b></li>'; }).join('') + '</ul>';
      h2 += P.length ? '<ul class="lb">' + P.map(function (p, i) { return '<li><span class="sw" style="background:' + (COLORS[i] || '#9aa3a8') + '"></span><span class="nm">' + esc(p.name) + ' <small>' + clan(p.members) + '</small></span><b>' + p.seats + '</b></li>'; }).join('') + '</ul>' : '<p class="pmsg">' + esc(t.noParty) + '</p>';
      h2 += '<p class="pmsg">' + esc(t.rules) + '</p>';
      if (BOARD.news && BOARD.news.length) h2 += '<h3 style="margin:6px 0 0">' + esc(t.feed) + '</h3><ul class="lb feed">' + BOARD.news.slice(0, 10).map(function (e) { var f = t.ev[e.t]; return f ? '<li><span class="nm" style="white-space:normal">' + esc(f(e)) + '</span><small>' + ago(e.ts) + '</small></li>' : ''; }).join('') + '</ul>';
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

  function drawCoalition(box) {
    var t = tx(), P = BOARD && BOARD.party; if (!box || !P || !P.manager) return;
    var h = '';
    if (P.invites.length) h += '<h3 style="margin:6px 0 0">' + esc(t.coInv) + '</h3><ul class="lb">' + P.invites.map(function (x) { return '<li><span class="nm">' + esc(x.name) + '</span><button type="button" class="obtn dark" data-acc="' + esc(x.id) + '">' + esc(t.accept) + '</button><button type="button" class="obtn" data-dec="' + esc(x.id) + '">' + esc(t.decline) + '</button></li>'; }).join('') + '</ul>';
    if (P.coalition) h += '<p class="pmsg">🤝 ' + esc(t.inCo) + ' <button type="button" class="obtn" id="o-col">' + esc(t.leaveCo) + '</button></p>';
    h += '<h3 style="margin:6px 0 0">' + esc(t.inviteCo) + '</h3><ul class="lb" id="o-cl"></ul><p class="perr" id="coerr"></p>';
    box.innerHTML = h;
    var err = box.querySelector('#coerr');
    function reload() { api('board?lang=' + LANG).then(function (j) { BOARD = j; drawTab(); }); }
    Array.prototype.forEach.call(box.querySelectorAll('[data-acc]'), function (b) { b.onclick = function () { api('coalition/accept', { lang: LANG, from: b.dataset.acc }).then(reload).catch(function (e) { err.textContent = errText(e.code); }); }; });
    Array.prototype.forEach.call(box.querySelectorAll('[data-dec]'), function (b) { b.onclick = function () { api('coalition/decline', { lang: LANG, from: b.dataset.dec }).then(reload); }; });
    var lc = box.querySelector('#o-col'); if (lc) lc.onclick = function () { api('coalition/leave', { lang: LANG }).then(reload); };
    api('parties?lang=' + LANG).then(function (j) {
      var ul = box.querySelector('#o-cl'); if (!ul) return;
      ul.innerHTML = j.parties.filter(function (p) { return p.id !== P.id; }).slice(0, 12).map(function (p) { return '<li><span class="nm">' + esc(p.name) + ' <small>' + clan(p.members) + '</small></span><button type="button" class="obtn" data-inv="' + esc(p.id) + '">🤝</button></li>'; }).join('');
      Array.prototype.forEach.call(ul.querySelectorAll('[data-inv]'), function (b) { b.onclick = function () { api('coalition/invite', { lang: LANG, to: b.dataset.inv }).then(function () { err.style.color = 'var(--ok)'; err.textContent = t.invited; b.disabled = true; }).catch(function (e) { err.style.color = ''; err.textContent = errText(e.code); }); }; });
    }).catch(function () {});
  }

  /* ---------- Narodne novine ---------- */
  var NN = null;
  function drawNN(el) {
    var t = tx(); el.innerHTML = '<p class="pmsg">…</p>';
    api('nn?lang=' + LANG).then(function (j) {
      NN = j; if (!j.voters) { el.innerHTML = '<p class="pmsg">' + esc(t.nnEmpty) + '</p>'; return; }
      var w = j.week.split('-W'), h = '<div class="paper-nn"><h2>' + esc(t.nnTitle) + '</h2><small>' + esc(t.nnSub(w[1] + '. · ' + w[0], j.final)) + ' · ' + esc(t.nnVoters(j.voters)) + '</small><hr>';
      if (j.top[0]) h += '<p class="kick">' + esc(t.nnWin) + '</p><p class="head">' + esc(j.top[0].name) + ' · ' + j.top[0].score + '</p>' + (window.PECAT_THEMES ? '<p class="small">🎖 ' + esc(t.ttl) + ': <b>' + esc(window.PECAT_THEMES.title(j.week, LANG)) + '</b></p>' : '');
      if (j.top.length > 1) h += '<p class="small">2. ' + esc(j.top[1].name) + (j.top[2] ? ' · 3. ' + esc(j.top[2].name) : '') + '</p>';
      h += '<p class="kick">' + esc(t.nnVlada) + '</p><p class="sub2">' + esc(j.vlada ? j.vlada.parties.join(' + ') + ' (' + j.vlada.seats + '/' + j.seats + ')' : t.nnNoVlada) + '</p>';
      if (j.rare) h += '<p class="kick">' + esc(t.nnRare) + '</p><p class="sub2">„' + esc(j.rare.a) + '” <small>(' + esc(j.rare.q) + ')</small></p>';
      if (j.zakon) h += '<p class="kick">' + esc(j.final ? t.zakPassed : t.zakLead) + '</p><p class="sub2">„' + esc(j.zakon.text) + '” <small>(' + esc(t.zakVotes(j.zakon.votes)) + ')</small></p>';
      if (j.prebjezi) h += '<p class="small">🏃 ' + esc(t.nnPx(j.prebjezi)) + '</p>';
      h += '<div id="nnbiser"></div>';
      h += '</div><button type="button" class="obtn dark" id="o-nns">' + esc(t.nnShare) + '</button><img id="o-nni" style="width:100%;display:none">';
      el.innerHTML = h; showBiser(el.querySelector('#nnbiser'), LANG);
      el.querySelector('#o-nns').onclick = function () { nnImage(j).then(function (cv) { var url = cv.toDataURL('image/png'); var im = el.querySelector('#o-nni'); im.src = url; im.style.display = 'block';
        cv.toBlob(function (b) { try { var f = new File([b], 'narodne-novine.png', { type: 'image/png' }); if (navigator.canShare && navigator.canShare({ files: [f] })) navigator.share({ files: [f], text: t.nnTitle }).catch(function () {}); } catch (e) {} }); }); };
    }).catch(function () { el.innerHTML = '<p class="perr">' + esc(errText()) + '</p>'; });
  }
  function nnImage(j) {
    var t = tx(), W = 1080, H = 1350, cv = document.createElement('canvas'); cv.width = W; cv.height = H; var x = cv.getContext('2d');
    var FS = '"Archivo Black","Arial Black",Impact,sans-serif', FL = '"Archivo Narrow","Arial Narrow",Arial,sans-serif', FT = '"IBM Plex Mono","Courier New",monospace', SER = 'Georgia,"Times New Roman",serif';
    function wrap(txt, max) { var w = String(txt).split(' '), out = [], line = ''; w.forEach(function (z) { var tt = line ? line + ' ' + z : z; if (x.measureText(tt).width > max && line) { out.push(line); line = z; } else line = tt; }); if (line) out.push(line); return out; }
    x.fillStyle = '#3e5947'; x.fillRect(0, 0, W, H); x.save(); x.rotate(-0.015); x.fillStyle = '#f3efe1'; x.fillRect(70, 80, W - 140, H - 150); x.restore();
    x.fillStyle = '#1f252b'; x.textAlign = 'center'; x.font = '900 92px ' + SER; x.fillText(t.nnTitle.toUpperCase(), W / 2, 210);
    x.font = '500 26px ' + FT; x.fillStyle = '#5b6168'; var w = j.week.split('-W'); x.fillText(t.nnSub(w[1] + '. · ' + w[0], j.final) + ' · ' + t.nnVoters(j.voters), W / 2, 258);
    x.fillStyle = '#1f252b'; x.fillRect(110, 285, W - 220, 6); x.fillRect(110, 297, W - 220, 2);
    var y = 380;
    function kick(s2) { x.textAlign = 'left'; x.fillStyle = '#b3271d'; x.font = '700 30px ' + FL; x.fillText(s2.toUpperCase(), 120, y); y += 20; }
    function head(s2, size) { x.fillStyle = '#1f252b'; x.font = '900 ' + (size || 70) + 'px ' + SER; wrap(s2, W - 240).slice(0, 2).forEach(function (l) { y += (size || 70) + 6; x.fillText(l, 120, y); }); y += 85; }
    if (j.top[0]) { kick(t.nnWin); head(j.top[0].name + ' (' + j.top[0].score + ')', 84); if (window.PECAT_THEMES) { x.font = '700 32px ' + FL; x.fillStyle = '#3e5947'; x.fillText(t.ttl.toUpperCase() + ': ' + window.PECAT_THEMES.title(j.week, LANG), 120, y - 55); y += 25; }
      if (j.top.length > 1) { x.font = '500 30px ' + FT; x.fillStyle = '#5b6168'; x.fillText(j.top.slice(1).map(function (p, i) { return (i + 2) + '. ' + p.name + ' ' + p.score; }).join('   '), 120, y - 45); y += 20; } }
    kick(t.nnVlada); head(j.vlada ? j.vlada.parties.join(' + ') : t.nnNoVlada, 56);
    if (j.rare) { kick(t.nnRare); head('„' + j.rare.a + '”', 60); x.font = '400 28px ' + FT; x.fillStyle = '#5b6168'; x.fillText(j.rare.q, 120, y - 45); y += 20; }
    if (j.zakon && y < H - 430) { kick(j.final ? t.zakPassed : t.zakLead); head('„' + j.zakon.text + '”', 44); }
    if (j.prebjezi && y < H - 220) { x.font = '700 32px ' + FL; x.fillStyle = '#1f252b'; x.fillText('🏃 ' + t.nnPx(j.prebjezi), 120, y); }
    x.fillStyle = '#1f252b'; x.fillRect(110, H - 190, W - 220, 2); x.textAlign = 'center'; x.font = '700 34px ' + FL; x.fillText('Pečat! · ' + location.hostname, W / 2, H - 135);
    x.save(); x.translate(W - 250, H - 330); x.rotate(-0.25); x.strokeStyle = '#3b37a6'; x.globalAlpha = .85; x.lineWidth = 8; x.beginPath(); x.arc(0, 0, 105, 0, 7); x.stroke(); x.lineWidth = 3; x.beginPath(); x.arc(0, 0, 88, 0, 7); x.stroke();
    x.fillStyle = '#3b37a6'; x.font = '900 40px ' + FS; x.textAlign = 'center'; x.fillText('PEČAT!', 0, 14); x.restore();
    return Promise.resolve(cv);
  }

  /* ---------- prijedlog pitanja ---------- */
  function drawZak(el) {
    var t = tx(); el.innerHTML = '<p class="pmsg">…</p>';
    api('petitions?lang=' + LANG).then(function (j) {
      var h = '<h3 style="margin:0">📜 ' + esc(t.zakTitle) + '</h3><p class="pmsg" style="text-align:left">' + esc(t.zakIntro) + '</p>';
      if (j.passed) h += '<div class="win">🏛 ' + esc(t.zakPassed) + ': <b>„' + esc(j.passed.text) + '”</b><br><small>' + esc(j.passed.who) + ' · ' + esc(t.zakVotes(j.passed.votes)) + '</small></div>';
      if (!ME) h += '<p class="pmsg">' + esc(t.needLogin) + '</p><div id="lgn"></div>';
      else if (j.canPost) h += '<div class="pform"><input id="ztx" class="sin" maxlength="110" placeholder="' + esc(t.zakPh) + '"><button type="button" class="obtn dark" id="o-zs">' + esc(t.zakSend) + '</button></div>';
      else h += '<p class="pmsg">' + esc(t.zakDaily) + '</p>';
      h += '<p class="perr" id="zerr"></p>';
      h += j.list.length ? '<ol class="lb zak">' + j.list.map(function (p, i) {
        return '<li><span class="n">' + (i + 1) + '.</span><span class="nm">„' + esc(p.text) + '”<small>' + esc(p.who) + ' ' + esc(t.zakBy) + (p.mine ? ' · ' + esc(t.zakMine) : '') + ' · ' + esc(t.zakVotes(p.votes)) + (i === 0 ? ' · ' + esc(t.zakLead) : '') + '</small></span>' +
          (ME ? (p.voted ? '<span class="zok">✓ ' + esc(t.zakSigned) + '</span>' : '<button type="button" class="obtn zsig" data-id="' + esc(p.id) + '">✍ ' + esc(t.zakSign) + '</button>') : '<b>' + p.votes + '</b>') + '</li>'; }).join('') + '</ol>'
        : '<p class="pmsg">' + esc(t.zakNone) + '</p>';
      el.innerHTML = h;
      if (!ME) loginBox(el.querySelector('#lgn'));
      var err = el.querySelector('#zerr');
      var send = el.querySelector('#o-zs'); if (send) send.onclick = function () { send.disabled = true;
        api('petition', { lang: LANG, text: el.querySelector('#ztx').value }).then(function () { drawZak(el); }).catch(function (e) { send.disabled = false; err.style.color = ''; err.textContent = errText(e.code); }); };
      Array.prototype.forEach.call(el.querySelectorAll('.zsig'), function (b) { b.onclick = function () { b.disabled = true;
        api('petition/vote', { lang: LANG, id: b.dataset.id }).then(function () { drawZak(el); }).catch(function (e) { b.disabled = false; err.textContent = errText(e.code); }); }; });
    }).catch(function () { el.innerHTML = '<p class="perr">' + esc(errText()) + '</p>'; });
  }
  function drawSug(el) {
    var t = tx();
    if (!ME) { el.innerHTML = '<p class="pmsg">' + esc(t.needLogin) + '</p><div id="lgn"></div><p class="perr"></p>'; loginBox(el.querySelector('#lgn')); return; }
    el.innerHTML = '<h3 style="margin:0">' + esc(t.sug) + '</h3><input id="sq" class="sin" maxlength="90" placeholder="' + esc(t.sugQ) + '"><textarea id="sa" class="sin" rows="3" maxlength="600" placeholder="' + esc(t.sugA) + '"></textarea><input id="sf" class="sin" maxlength="120" placeholder="' + esc(t.sugF) + '"><button type="button" class="obtn dark" id="o-sg">' + esc(t.sugSend) + '</button><p class="perr" id="serr"></p>';
    el.querySelector('#o-sg').onclick = function () { var e2 = el.querySelector('#serr');
      api('suggest', { lang: LANG, q: el.querySelector('#sq').value, a: el.querySelector('#sa').value, f: el.querySelector('#sf').value }).then(function () { e2.style.color = 'var(--ok)'; e2.textContent = t.sugOk; ['#sq', '#sa', '#sf'].forEach(function (k) { el.querySelector(k).value = ''; }); }).catch(function (e) { e2.style.color = ''; e2.textContent = errText(e.code); }); };
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
        '<div class="prow"><button type="button" class="obtn dark" id="o-inv">' + esc(t.invite) + '</button><button type="button" class="obtn" id="o-leave">' + esc(t.leave) + '</button></div><p class="perr" id="perr"></p></div><ol class="lb" id="pmem"></ol><div id="pco"></div>';
      api('party?id=' + mine.id).then(function (j) { var m = el.querySelector('#pmem'); if (!m) return; var M = j.party.members, n = M.length;
        m.innerHTML = M.map(function (p, i) { var role = i === 0 ? t.roles[0] : (n >= 3 && i === n - 1 ? t.roles[3] : (i === 1 ? t.roles[1] : t.roles[2]));
          return '<li><span class="n">' + (i + 1) + '.</span><span class="nm">' + esc(p.name) + ' <small>' + esc(role) + (p.founder ? ' · ' + esc(t.founder) : '') + '</small></span><b>' + p.score + '</b></li>'; }).join(''); }).catch(function () {});
      drawCoalition(el.querySelector('#pco'));
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
      function joined(j) { ME = j.user; INVITE = ''; try { history.replaceState(null, '', location.pathname); } catch (e) {} drawTab(); drawHero(); api('board?lang=' + LANG).then(function (b2) { BOARD = b2; drawTab(); }).catch(function () {}); }
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

  /* ---------- Biser dana ---------- */
  function biserHTML(b) {
    var t = tx(); if (!b) return '';
    return '<div class="biserc"><span class="pearl" aria-hidden="true"></span><div><small>' + esc(t.biser) + ' · ' + esc(t.biserSub) + '</small>' +
      '<b>„' + esc(b.a.charAt(0).toUpperCase() + b.a.slice(1)) + '”</b><em>' + esc(t.biserQ) + ' „' + esc(b.q) + '”</em></div></div>';
  }
  function showBiser(el, lang) { if (!el || !CFG) return; api('biser?lang=' + lang).then(function (j) { if (document.body.contains(el)) el.innerHTML = biserHTML(j.biser); }).catch(function () {}); }

  /* ---------- kraj igre: glas na izbore ---------- */
  function ballot(inner, stamped) {
    var t = tx(), w = (CFG && CFG.week ? CFG.week.split('-W')[1] : '').replace(/^0/, '');
    return '<div class="ballot' + (stamped ? ' stamped' : '') + '"><div class="bhead"><span class="bbox">🗳</span><span><b>' + esc(t.ballot) + '</b><small>' + esc(t.ballotSub(w)) + '</small></span></div>' + inner + (stamped ? '<span class="bstamp">✓</span>' : '') + '</div>';
  }
  function submit(data, el) {
    if (!GT || GT.lang !== data.lang) return;
    var t = tx(), gt = GT.gt; GT = null;
    api('score', { lang: data.lang, score: data.score, gt: gt }).then(function (j) {
      if (!el || !document.body.contains(el)) return;
      el.innerHTML = ballot('<p class="bmain">' + esc(t.voted(j.rank, j.voters)) + (j.hard ? esc(t.hardVote) : '') + '</p>' + (j.improved ? '' : '<p class="bsub">' + esc(t.notBest(j.best)) + '</p>') + '<button type="button" class="obtn" id="o-open">' + ICON + esc(t.open) + '</button>', true);
      el.querySelector('#o-open').onclick = function () { openPanel('izb'); };
    }).catch(function (e) {
      if (!el || !document.body.contains(el)) return;
      el.innerHTML = ballot('<p class="bsub">' + esc(/ticket_time|ticket_used/.test(e.code || '') ? t.tooFast : errText(e.code)) + '</p>');
    });
  }

  window.PECAT_HOOKS = {
    hero: function (el, lang) { LANG = lang; heroEl = el; drawHero(); if (INVITE && ready() && !(ME && ME.parties[LANG])) { INVITE_SHOWN || (INVITE_SHOWN = 1, openPanel('party')); } },
    lang: function (lang) { LANG = lang; drawHero(); },
    start: function (lang, o) { LANG = lang; GT = null; if (!CFG) return; api('start', { lang: lang, hard: !!(o && o.hard), chal: !!(o && o.mode === 'chal') }).then(function (j) { GT = { gt: j.gt, lang: lang }; }).catch(function () {}); },
    questions: function (lang, ids) { if (!CFG) return;
      api('rarity?lang=' + lang + '&ids=' + ids.join(',')).then(function (j) { Object.keys(j.rarity).forEach(function (id) { var q = window.PECAT_Q && window.PECAT_Q(id); if (q) q.live = j.rarity[id]; }); }).catch(function () {}); },
    end: function (data, el) {
      LANG = data.lang; if (!CFG) return; var t = tx();
      var bel = document.getElementById('biser');
      if (GT && GT.lang === data.lang && data.answers) api('answers', { lang: data.lang, gt: GT.gt, a: data.answers }).catch(function () {}).then(function () { showBiser(bel, data.lang); });
      else showBiser(bel, data.lang);
      if (ME && data.mode === 'daily' && data.day) pushDaily(data.lang, data.day, data.score);
      if (!ready() || !el) return;
      if (data.mode === 'chal') { el.innerHTML = ballot('<p class="bsub">' + esc(t.chalNoVote) + '</p>'); return; }
      if (ME) return submit(data, el);
      if (!GT) return;
      PENDING = { data: data, el: el };
      el.innerHTML = ballot('<p class="bmain">' + esc(t.voteLogin) + '</p><div id="lgn2" class="glogin"></div><p class="perr"></p>');
      loginBox(el.querySelector('#lgn2'));
    }
  };
  var INVITE_SHOWN = 0;
  window.PECAT_OPEN = function (tab) { if (!ready()) return false; if (tab) openPanel(tab); return true; };
  window.PECAT_ME = function () { return ME ? ME.name : ''; };
  // radni staž i dnevni rezultat: server je glavni za prijavljene, a mobitel pamti za neprijavljene
  function dayDate(d) { return new Date(Date.parse('2026-11-01T00:00:00Z') + (d - 1) * 86400000).toISOString().slice(0, 10); }
  function lsGet(k) { try { return JSON.parse(localStorage.getItem(k)); } catch (e) { return null; } }
  function lsSet(k, v) { try { localStorage.setItem(k, JSON.stringify(v)); } catch (e) {} }
  function syncFromServer() {
    if (!ME || !ME.staz) return; var ch = false, loc = lsGet('pecat:staz') || { n: 0, last: '', best: 0 }, sv = ME.staz;
    if (sv.last) { var sl = dayDate(sv.last); if (sl > (loc.last || '') || (sl === loc.last && sv.n > loc.n)) { loc.n = sv.n; loc.last = sl; ch = true; } }
    if ((sv.best || 0) > (loc.best || 0)) { loc.best = sv.best; ch = true; }
    if (ch) lsSet('pecat:staz', loc);
    Object.keys(ME.daily || {}).forEach(function (l) { var k = 'pecat:daily:' + l + ':' + ME.day; if (!lsGet(k)) { lsSet(k, { score: ME.daily[l] }); ch = true; } });
    // odigrano na ovom mobitelu prije prijave: pošalji na server
    ['hr', 'ba', 'rs'].forEach(function (l) { var k = lsGet('pecat:daily:' + l + ':' + ME.day); if (k && !(ME.daily || {})[l]) pushDaily(l, ME.day, k.score); });
    if (ch && window.PECAT_RERENDER) window.PECAT_RERENDER();
  }
  function pushDaily(l, day, score) { return api('daily', { lang: l, day: day, score: score }).then(function (j) { if (ME) { ME.daily = ME.daily || {}; ME.daily[l] = ME.daily[l] || score; ME.staz = j.staz; } return j; }).catch(function () {}); }

  fetch('/api/config', { credentials: 'same-origin' }).then(function (r) { return r.ok ? r.json() : null; }).then(function (c) {
    if (!c) return; CFG = c; window.PECAT_USERQ = window.PECAT_USERQ || {};
    ['hr', 'ba', 'rs'].forEach(function (l) { api('questions?lang=' + l).then(function (j) { window.PECAT_USERQ[l] = j.questions || []; }).catch(function () {}); });
    if (!(c.google || c.dev)) return;
    return api('me').then(function (j) { ME = j.user; syncFromServer(); }).catch(function () {}).then(function () { drawHero(); if (INVITE && heroEl && document.body.contains(heroEl) && !INVITE_SHOWN) { INVITE_SHOWN = 1; openPanel('party'); } });
  }).catch(function () {});
})();
