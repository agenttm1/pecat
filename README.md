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
   - `ADMIN_KEY`: lozinka za `/admin.html` (pregled prijedloga pitanja).
5. Deploy.

Bez tih varijabli igra radi normalno, samo se ne prikazuju prijava, izbori i Sabor.

## Načini igre

- **Slobodna igra**: nasumična pitanja, bez ponavljanja nedavnih.
- **Dnevni broj**: isti set pitanja i događaja za sve na dan (broj #1 = 1. 11. 2026.). Računa se u **radni staž** (niz dana), uz pečate za 7, 30 i 100 dana.
- **Šef odsjeka**: 15 sekundi po pitanju, jedan pokušaj, tipfeleri se ne priznaju. Ima svoju ljestvicu i ne ulazi u Sabor.
- **Izazov**: poveznica `?izazov=…` nosi ista pitanja, iste događaje i rezultat izazivača.
- **Prava rijetkost**: svaki odgovor se broji u bazi. Kad pitanje ima barem 15 igrača, postotak se miješa sa stvarnim odgovorima (do 85 % kod 250+ igrača).
- **Prijedlozi pitanja**: prijavljeni igrači šalju pitanja, a ti ih odobravaš na `/admin.html`. Odobrena pitanja ulaze u slobodnu igru.

## Izbori, stranke i Sabor

- **Izbori**: tjedna ljestvica pojedinaca po zemlji (HR, BiH, SRB). Broji se najbolji rezultat u tjednu. Tjedan počinje u ponedjeljak po zagrebačkom vremenu.
- **Stranke**: zajednice igrača. Svatko može osnovati stranku ili se učlaniti preko poveznice `?stranka=ŠIFRA`. Jedna stranka po zemlji.
- **Sabor** (BiH: Parlament, SRB: Skupština): stranke skupljaju zbroj najboljih rezultata svojih članova, a mjesta (151 / 42 / 250) se dijele D'Hondtovom metodom.
- **Pobjednici**: ploča prikazuje prošlotjednog pobjednika izbora i vladajuću stranku.
- **Koalicije**: osnivač stranke poziva drugu stranku, a njen osnivač prihvaća. Blok s više od pola mjesta je **Vlada**.
- **Prebjezi**: promjena stranke je dozvoljena jednom tjedno i objavljuje se u vijestima.
- **Funkcije**: najbolji član je predsjednik stranke, drugi glasnogovornik, a najslabiji (od 3 člana naviše) zamjenik za protokol.
- **Narodne novine**: tjedni izvještaj (pobjednik, Vlada, najrjeđi odgovor, prebjezi) i slika za dijeljenje.
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
| `public/admin.html` | Pregled i odobravanje prijedloga pitanja |

## Kako se računa rijetkost

Za zatvorena pitanja: 70 % iz broja pregleda članka na Wikipediji (hr, bs, sr) u 2025., uz korijen da veliki gradovi ne pojedu sve, a 30 % iz procjene po redoslijedu na popisu. Otvorena pitanja koriste samo procjenu. Odgovor kojeg nema na popisu, a smislen je, nosi 30 bodova.

Sljedeći korak: baza (npr. Upstash Redis preko Vercel Marketplacea) koja broji prave odgovore igrača po danu, pa rijetkost postaje stvarna.

## Format pitanja

```js
{ q: "Navedi hrvatski otok", f: "fora službenice", a: "Krk;Hvar|otok Hvar;Susak" }
```

Odgovori su odvojeni s `;`, aliasi s `|`. Redoslijed je od najčešćeg prema najrjeđem. `o:1` znači otvoreno pitanje, `raw:1` usporedbu bez skidanja kvačica, a `x` zabranjene odgovore.

Karte: Natural Earth (javno vlasništvo) preko paketa `world-atlas`.
