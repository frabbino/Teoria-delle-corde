'use strict';
/* Teoria delle Corde · funzione che calcola il consiglio (Vercel Functions, Node.js).
   POST /api/consiglio  { risposte, braccio, ultimo }  ->  consiglio pronto da mostrare.
   GET  /api/consiglio  ->  prova di funzionamento con risposte fisse.
   Le risposte servono solo per il calcolo: non vengono salvate né scritte nei log. */
const { consiglio, prova } = require('../lib/motore.js');

const MAX_BYTE = 20000;

async function leggiCorpo(req) {
  // Vercel di solito ha già letto il JSON in req.body; altrimenti lo leggiamo dallo stream
  if (req.body !== undefined && req.body !== null && req.body !== '') {
    return typeof req.body === 'string' ? JSON.parse(req.body) : req.body;
  }
  const parti = [];
  let dimensione = 0;
  for await (const pezzo of req) {
    dimensione += pezzo.length;
    if (dimensione > MAX_BYTE) {
      const e = new Error('Richiesta troppo grande');
      e.status = 413;
      throw e;
    }
    parti.push(pezzo);
  }
  const testo = Buffer.concat(parti).toString('utf8');
  return testo ? JSON.parse(testo) : {};
}

function invia(res, stato, dati) {
  res.statusCode = stato;
  res.setHeader('Content-Type', 'application/json; charset=utf-8');
  res.setHeader('Cache-Control', 'no-store');
  res.setHeader('X-Robots-Tag', 'noindex');
  res.end(JSON.stringify(dati));
}

module.exports = async function handler(req, res) {
  if (req.method === 'GET') return invia(res, 200, { stato: 'ok', prova: prova() });
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'GET, POST');
    return invia(res, 405, { errore: 'Metodo non consentito' });
  }
  let corpo;
  try {
    corpo = await leggiCorpo(req);
  } catch (err) {
    return invia(res, err.status === 413 ? 413 : 400, { errore: err.status === 413 ? 'Richiesta troppo grande' : 'Richiesta non leggibile' });
  }
  try {
    return invia(res, 200, consiglio(corpo));
  } catch (err) {
    if (err.richiesta) return invia(res, 400, { errore: err.message });
    console.error('Errore nel calcolo del consiglio:', err && err.message); // mai le risposte dell'utente
    return invia(res, 500, { errore: 'Errore interno' });
  }
};
