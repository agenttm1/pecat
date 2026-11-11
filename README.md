# Pečat!

Igra o balkanskoj birokraciji za HR, BiH i SRB. Svaki broj dobije 8 nasumičnih pitanja, a što je tvoj odgovor rjeđi, to dalje stigneš na putu od šaltera do šaltera po karti. Sve se igra u pregledniku, bez servera.

## Pokretanje

```bash
npm run dev      # lokalno na http://localhost:3000
npm test         # provjera pitanja i odgovora
```

## Objava na Vercelu

1. Na vercel.com: **Add New → Project → Import** ovaj repozitorij.
2. Framework: **Other**. Build naredba: prazno. Output Directory: `public` (već je u `vercel.json`).
3. Deploy.

## Što je gdje

| Datoteka | Sadržaj |
| --- | --- |
| `public/index.html` | Cijela igra: izgled, animacije, šalter, karta, događaji |
| `public/engine.js` | Provjera odgovora, tipfeleri, bodovanje, rijetkost |
| `public/data_hr.js`, `data_ba.js`, `data_rs.js` | 80 pitanja po jeziku s popisima točnih odgovora |
| `public/data_fore.js` | Balkanska pitanja i „svijet očima naših” |
| `public/wiki.js` | Broj pregleda članaka na Wikipediji za odgovore (2025.) |
| `public/maps.js` | Pojednostavljene granice država za kartu (Natural Earth) |
| `public/cars.js` | Mjesto za prave slike auta (data URL), inače se crtaju |
| `tools/fetch_wiki_top.py`, `tools/match_wiki.py` | Ponovno povlačenje pregleda s Wikipedije (`npm run wiki`) |
| `tools/build_maps.js` | Ponovna izrada karata iz `world-atlas` |

## Kako se računa rijetkost

Za zatvorena pitanja: 70 % iz broja pregleda članka na Wikipediji (hr, bs, sr) u 2025., uz korijen da veliki gradovi ne pojedu sve, a 30 % iz procjene po redoslijedu na popisu. Otvorena pitanja koriste samo procjenu. Odgovor kojeg nema na popisu, a smislen je, nosi 30 bodova.

Sljedeći korak: baza (npr. Upstash Redis preko Vercel Marketplacea) koja broji prave odgovore igrača po danu, pa rijetkost postaje stvarna.

## Format pitanja

```js
{ q: "Navedi hrvatski otok", f: "fora službenice", a: "Krk;Hvar|otok Hvar;Susak" }
```

Odgovori su odvojeni s `;`, aliasi s `|`. Redoslijed je od najčešćeg prema najrjeđem. `o:1` znači otvoreno pitanje, `raw:1` usporedbu bez skidanja kvačica, a `x` zabranjene odgovore.

Karte: Natural Earth (javno vlasništvo) preko paketa `world-atlas`.
