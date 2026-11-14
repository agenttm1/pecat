/* Pečat! · Tjedni ured: tema tjedna (isti izračun u igri i na ploči) */
(function () {
  var W = { hr: 'TJEDAN', ba: 'SEDMICA', rs: 'NEDELJA' };
  var THEMES = [
    { k: 'zdr', re: /(lije[čk]|le[čk]a?r|doktor|bolnic|ljekarn|apotek|lijek|\blek(ar|ov|a\b)|\bzdravstv|\bzdravlj|hitn|ambulant|zub|bolest|bolovanj|prehlad|uput|recept)/i,
      sign: { hr: 'TJEDAN HZZO-A', ba: 'SEDMICA DOMA ZDRAVLJA', rs: 'NEDELJA DOMA ZDRAVLJA' },
      title: { hr: 'Ravnatelj/ica HZZO-a', ba: 'Direktor/ica doma zdravlja', rs: 'Direktor/ka doma zdravlja' } },
    { k: 'kat', re: /(zemljiš|katast|gruntov|vikendic|\bkuć[aeiu]\b|\bkuc[aeiu]\b|\bstan\b|\bstan[au]\b|parcel|nekretn|\bplac|\bvrt\b|bašt[aeu]\b|dvori|vinogr|gradilišt|zgrad|građevin|kućan)/i,
      sign: { hr: 'TJEDAN KATASTRA', ba: 'SEDMICA KATASTRA', rs: 'NEDELJA KATASTRA' },
      title: { hr: 'Pročelnik/ca katastra', ba: 'Šef/ica katastra', rs: 'Šef/ica katastra' } },
    { k: 'mup', re: /(polic|osobn|putovnic|pasoš|vozač|registrac|\bauto|automobil|kazn|promet|radar|semafor|granic|carin)/i,
      sign: { hr: 'TJEDAN MUP-A', ba: 'SEDMICA MUP-A', rs: 'NEDELJA MUP-A' },
      title: { hr: 'Načelnik/ca policijske uprave', ba: 'Načelnik/ca policijske uprave', rs: 'Načelnik/ca policijske uprave' } },
    { k: 'por', re: /(porez|poresk|novac|novc|\bkun[aei]?\b|\beur[ao]?\b|plać|plaća|plat[ae]|račun|cijen|cen[aeu]\b|bank|kredit|mirovin|penzi|štedi|skup|\bkupi)/i,
      sign: { hr: 'TJEDAN POREZNE', ba: 'SEDMICA POREZNE UPRAVE', rs: 'NEDELJA PORESKE UPRAVE' },
      title: { hr: 'Glavni/a porezni/a inspektor/ica', ba: 'Glavni/a porezni/a inspektor/ica', rs: 'Glavni/a poreski/a inspektor/ka' } },
    { k: 'mat', re: /(vjenč|venč|svadb|krst|krštenj|rođen|rodjen|\bime\b|imena|prezim|bak[aeu]\b|djed|deda|\bkum|obitelj|porodic|svekr|punic|mam[aeu]\b|tat[aeu]\b|sestr|brat)/i,
      sign: { hr: 'TJEDAN MATIČNOG UREDA', ba: 'SEDMICA MATIČNOG UREDA', rs: 'NEDELJA MATIČNE SLUŽBE' },
      title: { hr: 'Matičar/ka godine', ba: 'Matičar/ka godine', rs: 'Matičar/ka godine' } },
    { k: 'tur', re: /(more|mora\b|plaž|turist|ljet|leto|leta\b|otok|ostrv|odmor|apartm|sladoled|kupa|jezer|planin|izlet|putova)/i,
      sign: { hr: 'TJEDAN TURISTIČKE ZAJEDNICE', ba: 'SEDMICA TURISTIČKE ZAJEDNICE', rs: 'NEDELJA TURISTIČKE ORGANIZACIJE' },
      title: { hr: 'Direktor/ica turističke zajednice', ba: 'Direktor/ica turističke zajednice', rs: 'Direktor/ka turističke organizacije' } },
    { k: 'kul', re: /(pjesm|pesm|pjev|pev|film|serij|knjig|pisac|pisc|kazališ|pozori|glazb|muzi|televiz|\btv\b|crtić|crtan|slikar|bend|koncert)/i,
      sign: { hr: 'TJEDAN MINISTARSTVA KULTURE', ba: 'SEDMICA KULTURE', rs: 'NEDELJA KULTURE' },
      title: { hr: 'Ministar/ica kulture u sjeni', ba: 'Ministar/ica kulture u sjeni', rs: 'Ministar/ka kulture u senci' } },
    { k: 'spo', re: /(nogomet|fudbal|košark|rukomet|tenis|utakmic|klub|igrač|sport|vaterpol|reprezent|trener|navija|gol\b|golova|olimpij|skij)/i,
      sign: { hr: 'TJEDAN SPORTSKOG SAVEZA', ba: 'SEDMICA SPORTSKOG SAVEZA', rs: 'NEDELJA SPORTSKOG SAVEZA' },
      title: { hr: 'Izbornik/ca reprezentacije', ba: 'Selektor/ica reprezentacije', rs: 'Selektor/ka reprezentacije' } },
  ];
  // isti ISO tjedan kao na poslužitelju (lib/app.js weekId)
  function weekId(date) {
    var ymd; try { ymd = new Intl.DateTimeFormat('en-CA', { timeZone: 'Europe/Zagreb', year: 'numeric', month: '2-digit', day: '2-digit' }).format(date || new Date()); } catch (e) { ymd = (date || new Date()).toISOString().slice(0, 10); }
    var d = new Date(ymd + 'T00:00:00Z'), day = (d.getUTCDay() + 6) % 7; d.setUTCDate(d.getUTCDate() - day + 3);
    var y = d.getUTCFullYear(), jan4 = new Date(Date.UTC(y, 0, 4));
    var wk = 1 + Math.round(((d - jan4) / 86400000 - 3 + ((jan4.getUTCDay() + 6) % 7)) / 7);
    return y + '-W' + (wk < 10 ? '0' : '') + wk;
  }
  function forWeek(w) {
    var p = String(w || weekId()).split('-W'), n = (+p[0] || 2026) * 53 + (+p[1] || 1);
    return THEMES[n % THEMES.length];
  }
  function qtext(q) { return (q && (q.q || '')) + ' ' + ((q && q.e) || ''); }
  window.PECAT_THEMES = { list: THEMES, weekId: weekId, forWeek: forWeek, word: W,
    now: function () { return forWeek(weekId()); },
    match: function (th, q) { return !!(th && q && th.re.test(qtext(q))); },
    title: function (w, lang) { var th = forWeek(w); return th.title[lang] || th.title.hr; } };
})();
