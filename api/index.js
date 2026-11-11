// Sve /api/* rute idu ovamo (vidi rewrites u vercel.json).
const { handle } = require('../lib/app');
module.exports = (req, res) => handle(req, res);
