# Viikko – Vanilla JS + Playwright -testit

Tässä viikossa on 5 tehtävää (DOM-käsittely, validointi ja tapahtumat). Testit ajetaan automaattisesti GitHub Actionsissa.

## Ensimmäiseksi
1. Tarkista että sinulla on Node.js asennettu: `node -v` pitäisi tuloksena tulla versionumero.
2. Versio pitäisi olla `v22.20.0` tai uudempi.
3. Mikäli Node:a ei löytynyt tai versio oli vanha, lataa uusi: https://nodejs.org/en/download/

## Käynnistys paikallisesti
1. Asenna riippuvuudet: `npm install`
2. Asenna Playwright-selaimet (ensimmäisellä kerralla): `npx playwright install`
3. Kehitys: `npm run dev`
4. Testit: `npm test`

> CI käyttää `npm run build && npm run preview` – sinun ei tarvitse käynnistää palvelinta testejä varten.
Se tarkoittaa tätä, käytännössä:
1. CI (GitHub Actions) – ja myös paikalliset testit käynnistävät tarvittavan web-palvelimen automaattisesti Playwrightin webServer-asetuksen kautta.

2. Ensin ajetaan tuotantokäännös: npm run build. Sen jälkeen sovellus palvellaan Viten preview-palvelimella: npm run preview (portti 4173).

3. Sinun ei siis tarvitse itse käynnistää mitään palvelinta ennen testejä—riittää, että ajat npm test. Playwright hoitaa buildin ja preview’n testejä varten.

Miksi näin, eikä `npm run dev`?

preview käyttää valmista tuotantobuildia, joka on vakaampi ja deterministisempi kuin dev-palvelin (HMR ym.). Siksi CI käyttää aina build && preview.

Vinkki nopeaan paikalliseen kehitykseen:

Jos ajat usein testejä peräkkäin, voit pitää preview’n auki omassa terminaalissa:

1. `npm run build`

2. `npm run preview` (jää kuuntelemaan porttia 4173)

3. toisessa terminaalissa: `npm test`
    Tällöin Playwright havaitsee olemassa olevan palvelimen (asetuksella reuseExistingServer: !process.env.CI) eikä käynnistä sitä uudelleen. Muista kuitenkin tehdä uusi `npm run build`, kun muutat sovelluskoodia, jotta preview palvelee tuoreinta versiota.


## Mihin tiedostoihin koodaat? (**Tärkeää**)

Tämä repo on luotu Vite **Vanilla JS** -pohjaan. **Kaikki viiden tehtävän UI-komponentit ja logiikat tulee toteuttaa suoraan etusivulle** (polku `/`), jotta automaatiotestit löytävät ne ilman navigointia.

- **`index.html`**  
  - Luo tänne viisi erillistä `<section>`-osiota: **Profiilikortti**, **Laskuri**, **RGB-paneli**, **Tehtävälista** ja **Laskin**.  
  - Osiot ovat **näkyvissä oletuksena** (ei piilotettuna välilehden, modaalin tai reitityksen taakse).
  - Pidä selkeät labelit/placeholderit, jotta testit löytävät kentät (ohjeet alla).

- **`src/main.js`**  
  - Kirjoita tapahtumankäsittelijät ja DOM-päivityslogiikka tänne **tai vaihtoehtoisesti moduloi, eli** jaa alitiedostoihin (esim. `src/tasks/profile.js`, `src/tasks/counter.js` …) ja **tuo ne** `main.js`-tiedostoon:  
    ```js
    import './tasks/profile.js';
    import './tasks/counter.js';
    // ...
    ```
  - Varmista, että moduulit suoritetaan sivun latautuessa (pelkkä import riittää).

- **`src/style.css`**  
  - Tyylit tänne (tai erillisiin .css-tiedostoihin, jotka tuot `index.html`:stä tai `main.js`:stä).

- **Älä siirrä tehtäviä eri sivuille** (esim. `profile.html`), äläkä vaadi erillistä ”Siirry tehtävään” -navigointia. Testit avaavat **pääsivun** (`/`) ja tarkistavat komponentit sieltä.

Pohjarakenne-esimerkki `index.html`:
```html
<!doctype html>
<html lang="fi">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Viikko 4</title>
  </head>
  <body>
    <main>
      <section class="profile">…</section>
      <section class="counter">…</section>
      <section class="rgb-panel">…</section>
      <section class="todos">…</section>
      <section class="calculator">…</section>
    </main>
    <script type="module" src="/src/main.js"></script>
  </body>
</html>
```

---

## Tehtävät (kuvaukset, UI-rakenne ja logiikka)

### 1) Profiilikortti
**Tavoite:** käyttäjä syöttää nimen, sähköpostin ja iän; kortissa näkyy sama tieto heti.

**Rakenne (esimerkki):**
```html
<section class="profile">
  <label> Nimi <input type="text" placeholder="Nimi" /></label>
  <label> Sähköposti <input type="email" placeholder="Sähköposti" /></label>
  <label> Ikä <input type="number" min="0" placeholder="Ikä" /></label>

  <article class="profile-card">
    <h2 class="profile-name">—</h2>
    <p class="profile-email">—</p>
    <p class="profile-age">—</p>
  </article>

  <!-- valinnainen -->
  <button type="button">Päivitä</button>
</section>
```

**Käyttölogiikka:**
- Päivitys voi tapahtua **automaattisesti** syötteen muuttuessa **tai** ”**Päivitä**”-napista.
- Nimi: esim. `Ada Lovelace`, Sähköposti: `ada@example.com`, Ikä: `36` → näkyvät kortissa tekstinä.

**Testit tarkistavat:** arvot **näkyvät** syötön jälkeen. (Testi klikkaa ”Päivitä”, jos sellainen on.)

**Vinkkejä:**
- `element.textContent = input.value.trim()` `input`/`change`/`click`-kuuntelijalla.
- Älä piilota tulosta pelkkään attribuuttiin; sen pitää näkyä sivulla.

---

### 2) Laskuri (ei negatiivisia)
**Tavoite:** lukua voi kasvattaa ja pienentää napeilla, mutta arvo ei saa mennä alle nollan. Jos käyttäjä yrittää alle 0, näytä virheviesti.

**Rakenne (esimerkki):**
```html
<section class="counter">
  <button type="button">Vähennä</button>
  <strong class="counter-value" data-counter>0</strong>
  <button type="button">Lisää</button>

  <p class="counter-error" aria-live="polite" style="display:none;"></p>
</section>
```

**Käyttölogiikka:**
- “Lisää” kasvattaa arvoa yhdellä.
- “Vähennä” pienentää arvoa **vain jos** tulos olisi ≥ 0.
- Yritys mennä < 0: arvo ei laske, ja `counter-error` näyttää selkeän viestin (esim. “Arvo ei voi olla negatiivinen.”).

**Testit tarkistavat:** kasvu, suojaraja 0 ja **näkyvä** virheviesti.

**Vinkkejä:**
- `value = Number(elem.textContent)` ja `elem.textContent = value + 1`.
- Näytä/peitä virheilmoitus tyylillä tai `hidden`-attribuutilla.

---

### 3) RGB-paneli
**Tavoite:** kolme syötekenttää (R, G, B) väliltä 0–255. Kelvollisilla arvoilla värilaatikon taustaväri päivittyy; virheellisestä arvosta näytetään virheviesti.

**Rakenne (esimerkki):**
```html
<section class="rgb-panel">
  <label>R <input type="number" min="0" max="255" placeholder="R"></label>
  <label>G <input type="number" min="0" max="255" placeholder="G"></label>
  <label>B <input type="number" min="0" max="255" placeholder="B"></label>

  <div class="color-box" style="width:120px;height:80px;"></div>
  <p class="rgb-error" aria-live="polite"></p>

  <!-- valinnainen -->
  <button type="button">Päivitä väri</button>
</section>
```

**Käyttölogiikka:**
- Kun R=120, G=80, B=200, laatikon `backgroundColor` on täsmälleen `rgb(120, 80, 200)`.
- Jos jokin arvo puuttuu tai on rajojen ulkopuolella, älä päivitä väriä – näytä virheviesti (esim. “Arvojen tulee olla välillä 0–255.”).
- Päivitys voi tapahtua automaattisesti tai “Päivitä väri” -napista.

**Testit tarkistavat:** juuri `rgb(120, 80, 200)` ja virheestä **näkyvä** viesti.

---

### 4) Tehtävälista
**Tavoite:** syötekentästä lisätään uusi listakohta napilla. Listan viimeinen kohta vastaa syötteen sisältöä.

**Rakenne (esimerkki):**
```html
<section class="todos">
  <input type="text" placeholder="Tehtävä">
  <button type="button">Lisää</button>

  <ul class="todo-list" data-list></ul>
</section>
```

**Käyttölogiikka:**
- Kirjoita “Osta maitoa” → “Lisää” → listaan syntyy uusi `<li>`, jonka teksti on “Osta maitoa”.

**Testit tarkistavat:** että viimeinen `<li>` sisältää syötteen tekstin.

---

### 5) Laskin (switch)
**Tavoite:** kahden luvun peruslaskut ( +, −, *, / ). Nollalla jakamisesta näytetään virhe.

**Rakenne (esimerkki):**
```html
<section class="calculator">
  <input type="number" placeholder="Luku 1">
  <select name="op">
    <option>+</option><option>-</option><option>*</option><option>/</option>
  </select>
  <input type="number" placeholder="Luku 2">
  <button type="button">Laske</button>

  <div id="result" aria-live="polite">—</div>
  <p class="calc-error" aria-live="polite"></p>
</section>
```

**Käyttölogiikka:**
- Syötä luvut, valitse operaatio ja paina “Laske” **tai** laske heti operaation valinnasta.
- 5+7=12, 10−3=7, 4*6=24, 20/5=4 → näytetään `#result`-elementissä.
- 10/0 → älä laske, näytä virheviesti (esim. “Nollalla ei voi jakaa.”).

**Testit tarkistavat:** tulokset näkyvät ja virheviesti nollalla jaosta näkyy. (Testi klikkaa “Laske”, jos sellainen on.)

---

## Selektori- ja nimeämisvinkit (jotta testit löytävät asiat)

Nämä **eivät ole pakollisia**, mutta helpoimmat tavat varmistaa, että automaattitestit löytävät oikeat elementit:

- **Käytä label- tai placeholder-tekstejä**:  
  - Profiilikortti: “Nimi”, “Sähköposti”, “Ikä”.  
  - RGB: “R”, “G”, “B”.  
  - Tehtävälista: “Tehtävä”.

- **Nappien tekstit**:  
  - Laskuri: “Lisää”, “Vähennä” (tai “+”, “−”).  
  - Tehtävälista: “Lisää”.  
  - Laskin: “Laske” (tai suorat op-napit “+”, “−”, “*”, “/”).

- **Tunnisteet (testit etsivät näitä, mutta eivät vaadi kaikkia)**:  
  - Laskuriarvo: `[data-counter]`, `#counter`, `#counterValue`, `.counter-value`  
  - Värilaatikko: `.color-box`, `#colorBox`, `[data-color-box]`  
  - Laskimen tulos: `#result`, `.result`, `[data-result]`  
  - Lista: `[data-list]` tai tavallinen `<ul>`

- **Virheilmoitukset**:  
  - Näytä sivulla (ei pakollinen `alert`).  
  - Tekstissä saa esiintyä joku näistä: “**virhe**”, “**negatiiv**”, “**invalid**”, “**0–255**” (RGB) → testit tunnistavat joustavasti.

---

## Yhteensopivuus testien kanssa

- Kaikki komponentit ovat **samalla sivulla** (`/`) ja **näkyvissä**.  
- Profiilikortti ja RGB: päivitys voi tapahtua **automaattisesti tai napista** – testit tukevat molempia.  
- Laskin: tulos voi syntyä **napista tai heti operaattorin valinnasta** – testit tukevat molempia.  
- Laskuri: virheestä riittää mikä tahansa teksti, jossa esiintyy “virhe” **tai** sanaan *negatiiv* viittaava ilmaus – testit hyväksyvät molemmat.

---

## Pisteytys

- 1 spec/tehtävä. Tehtävä on **hyväksytty** vain, jos sen kaikki alatestit menevät läpi.
- Lopullinen pistemäärä skaalataan **0–10** kaavalla `round(läpisseet / kaikki * 10)`.
- CI tallettaa **HTML-raportin** (Playwright) ja `score.json`-tiedoston artefakteihin.
