# Pečat!

Igra o balkanskoj birokraciji za HR, BiH i SRB. Svaki broj dobije 8 nasumičnih pitanja, a što je tvoj odgovor rjeđi, to dalje stigneš na putu od šaltera do šaltera po karti. Igra radi u pregledniku. Prijava, izbori i stranke rade preko malog API-ja na Vercelu.

## Pokretanje

```bash
npm run dev      # lokalno na http://localhost:3000 (API s memorijskom bazom i testnom prijavom)
npm test         # provjera pitanja, odgovora i API-ja
```

## Objava na Vercelu

1. Na vercel.com: **Add New → Project → Import** ovaj repozitorij.
2. Framework: **Other**. Build naredba: prazno. Output Directory: `public` (već je u `vercel.json`).
3. Storage → **Upstash Redis** (Marketplace) → spoji na projekt. Postavi `KV_REST_API_URL` i `KV_REST_API_TOKEN`.
4. Environment Variables:
   - `GOOGLE_CLIENT_ID`: OAuth Client ID (Web) iz Google Cloud Console → APIs & Services → Credentials. U „Authorized JavaScript origins” upiši adresu stranice (npr. `https://pecat.vercel.app`).
   - `SESSION_SECRET`: dugi nasumični niz (npr. `openssl rand -base64 32`).
5. Deploy.

Bez tih varijabli igra radi normalno, samo se ne prikazuju prijava, izbori i Sabor.

## Izbori, stranke i Sabor

- **Izbori**: tjedna ljestvica pojedinaca po zemlji (HR, BiH, SRB). Broji se najbolji rezultat u tjednu. Tjedan počinje u ponedjeljak po zagrebačkom vremenu.
- **Stranke**: zajednice igrača. Svatko može osnovati stranku ili se učlaniti preko poveznice `?stranka=ŠIFRA`. Jedna stranka po zemlji.
- **Sabor** (BiH: Parlament, SRB: Skupština): stranke skupljaju zbroj najboljih rezultata svojih članova, a mjesta (151 / 42 / 250) se dijele D'Hondtovom metodom.
- **Pobjednici**: ploča prikazuje prošlotjedni pobjednika izbora i vladajuću stranku.
- Prave stranke, psovke i mržnja ne prolaze kao ime (filtar u `lib/app.js`).
- Sprema se samo ime i inicijal prezimena s Google računa, bez e-maila.
- Zaštita od varanja: ulaznica s potpisom za svaku igru, igra mora trajati barem 40 s, rezultat do 900, jedna ulaznica jednom. Igra se odvija u pregledniku, pa uporan varalica i dalje može lagati o bodovima.

## Što je gdje

| Datoteka | Sadržaj |
| --- | --- |
| `public/index.html` | Cijela igra: izgled, animacije, šalter, karta, događaji, slika za dijeljenje |
| `public/online.js` | Prijava Googleom, izbori, stranke, Sabor |
| `api/index.js`, `lib/app.js` | API (Vercel funkcija) |
| `lib/store.js` | Upstash Redis preko REST-a, ili memorija za razvoj |
| `public/engine.js` | Provjera odgovora, tipfeleri, bodovanje, rijetkost |
| `public/data_hr.js`, `data_ba.js`, `data_rs.js` | 80 pitanja po jeziku s popisima točnih odgovora |
| `public/data_fore.js` | Balkanska pitanja i „svijet očima naših” |
| `public/wiki.js` | Broj pregleda članaka na Wikipediji za odgovore (2025.) |
| `public/maps.js` | Pojednostavljene granice država za kartu (Natural Earth) |
| `public/cars.js` | Mjesto za prave slike auta (data URL), inače se crtaju |
| `tools/fetch_wiki_top.py`, `tools/match_wiki.py` | Ponovno povlačenje pregleda s Wikipedije (`npm run wiki`) |
| `tools/build_maps.js` | Ponovna izrada karata iz `world-atlas` |
| `tools/dev.js`, `tools/api_test.js` | Lokalni poslužitelj i test API-ja |

## Kako se računa rijetkost

Za zatvorena pitanja: 70 % iz broja pregleda članka na Wikipediji (hr, bs, sr) u 2025., uz korijen da veliki gradovi ne pojedu sve, a 30 % iz procjene po redoslijedu na popisu. Otvorena pitanja koriste samo procjenu. Odgovor kojeg nema na popisu, a smislen je, nosi 30 bodova.

Sljedeći korak: baza (npr. Upstash Redis preko Vercel Marketplacea) koja broji prave odgovore igrača po danu, pa rijetkost postaje stvarna.

## Format pitanja

```js
{ q: "Navedi hrvatski otok", f: "fora službenice", a: "Krk;Hvar|otok Hvar;Susak" }
```

Odgovori su odvojeni s `;`, aliasi s `|`. Redoslijed je od najčešćeg prema najrjeđem. `o:1` znači otvoreno pitanje, `raw:1` usporedbu bez skidanja kvačica, a `x` zabranjene odgovore.

Karte: Natural Earth (javno vlasništvo) preko paketa `world-atlas`.
