// Lokalni poslužitelj: igra iz public/ + API s memorijskom bazom i testnom prijavom.
// node tools/dev.js  →  http://localhost:3000
process.env.PECAT_DEV_LOGIN = process.env.PECAT_DEV_LOGIN || '1';
const http = require('http'), fs = require('fs'), path = require('path');
const { handle } = require('../lib/app');
const ROOT = path.join(__dirname, '..', 'public');
const TYPES = { '.html': 'text/html; charset=utf-8', '.js': 'text/javascript; charset=utf-8', '.json': 'application/json', '.png': 'image/png', '.svg': 'image/svg+xml' };
const PORT = +process.env.PORT || 3000;
http.createServer((req, res) => {
  if (req.url.startsWith('/api/')) return handle(req, res);
  let p = decodeURIComponent(req.url.split('?')[0]); if (p.endsWith('/')) p += 'index.html';
  const f = path.join(ROOT, path.normalize(p).replace(/^(\.\.[/\\])+/, ''));
  if (!f.startsWith(ROOT)) { res.statusCode = 403; return res.end(); }
  fs.readFile(f, (e, d) => { if (e) { res.statusCode = 404; return res.end('404'); } res.setHeader('Content-Type', TYPES[path.extname(f)] || 'application/octet-stream'); res.end(d); });
}).listen(PORT, () => console.log('Pečat! na http://localhost:' + PORT));
