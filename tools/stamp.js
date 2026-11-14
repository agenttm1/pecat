// Pečatira nova pitanja: svako pitanje koje još nije u public/since.js dobije
// sutrašnji dnevni broj, pa ulazi u dnevne partije tek od ponoći (po Zagrebu).
// Pokreni prije svakog commita koji dodaje pitanja:  node tools/stamp.js
// S --check samo provjerava (za testove) i vraća grešku ako nešto nije pečatirano.
const fs = require('fs'), path = require('path'), vm = require('vm');
const PUB = path.join(__dirname, '..', 'public');
const FILES = ['data_hr', 'data_ba', 'data_rs', 'data_hr2', 'data_ba2', 'data_rs2', 'data_teme', 'data_fore'];

function allIds() {
  const ctx = { window: {} }; vm.createContext(ctx);
  FILES.forEach((f) => vm.runInContext(fs.readFileSync(path.join(PUB, f + '.js'), 'utf8'), ctx));
  const w = ctx.window, ids = [];
  ['hr', 'ba', 'rs'].forEach((l) => {
    (w.PECAT[l] || []).forEach((day, d) => day.forEach((q, i) => ids.push(l + '-' + (d + 1) + '-' + (i + 1))));
    ((w.PECAT_FORE || {})[l] || []).forEach((q, i) => ids.push('f-' + l + '-' + i));
    ((w.PECAT_WORLD || {})[l] || []).forEach((q, i) => ids.push('w-' + l + '-' + i));
  });
  return ids;
}
function zgDayNo() {
  const ymd = new Intl.DateTimeFormat('en-CA', { timeZone: 'Europe/Zagreb', year: 'numeric', month: '2-digit', day: '2-digit' }).format(new Date());
  return Math.round((Date.parse(ymd + 'T00:00:00Z') - Date.parse('2026-11-01T00:00:00Z')) / 86400000) + 1;
}
function readSince() {
  const f = path.join(PUB, 'since.js'); if (!fs.existsSync(f)) return null;
  const ctx = { window: {} }; vm.createContext(ctx); vm.runInContext(fs.readFileSync(f, 'utf8'), ctx); return ctx.window.PECAT_SINCE;
}
const ids = allIds(), old = readSince(), check = process.argv.includes('--check');
const missing = old ? ids.filter((id) => !(id in old)) : ids;
if (check) {
  if (!old || missing.length) { console.error('Nepečatirana pitanja (pokreni node tools/stamp.js): ' + missing.slice(0, 10).join(', ')); process.exit(1); }
  console.log('since.js OK (' + ids.length + ' pitanja)'); process.exit(0);
}
const day = old ? zgDayNo() + 1 : 1; // prvi put: sve što već postoji vrijedi od dana 1
const out = Object.assign({}, old || {}); missing.forEach((id) => { out[id] = day; });
const body = '// Generira tools/stamp.js. Dnevni broj od kojeg pitanje smije ući u dnevne partije.\nwindow.PECAT_SINCE=' + JSON.stringify(out) + ';\n';
fs.writeFileSync(path.join(PUB, 'since.js'), body);
console.log(missing.length ? 'Novih pitanja: ' + missing.length + ' (ulaze u dnevne partije od dnevnog broja #' + day + ', u ponoć)' : 'Nema novih pitanja.');
