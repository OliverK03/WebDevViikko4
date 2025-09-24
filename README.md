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
</section>
```

**Käyttölogiikka:**
- Kun kenttiin kirjoitetaan (tai painetaan erillistä “Päivitä”-nappia, jos haluat), kortin tekstit päivittyvät näkyviin:
  - Nimi: esimerkiksi `Ada Lovelace`
  - Sähköposti: `ada@example.com`
  - Ikä: `36`

**Testit tarkistavat:** että jokainen arvo todella **näkyy sivulla** käyttäjän syötön jälkeen.

**Vinkkejä:**
- Päivitä tekstit esim. `element.textContent = input.value.trim()` tapahtumakuuntelijalla (`input`/`change`/`click`).
- Älä piilota tulosta pelkkään `title`/`aria-label` -attribuuttiin; sen pitää olla näkyvää tekstiä.

---

### 2) Laskuri (ei negatiivisia)
**Tavoite:** lukua voi kasvattaa ja pienentää napeilla, mutta arvo ei saa mennä alle nollan. Jos käyttäjä yrittää alle 0, näytä virheilmoitus.

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
- Jos käyttäjä yrittää mennä negatiiviseksi, arvo pysyy nollassa **ja** `counter-error` näyttää selkeän viestin (esim. “Arvo ei voi olla negatiivinen.”).

**Testit tarkistavat:** että arvo kasvaa, ei mene < 0 ja virheviesti **näkyy** yrityksestä mennä negatiiviseksi.

**Vinkkejä:**
- Parsinta: `value = Number(elem.textContent)`.
- Päivitä virheilmoitus näkyviin piilottamisen sijaan (esim. `style.display = ""` tai lisää/poista `hidden`).

---

### 3) RGB-paneli
**Tavoite:** kolme syötekenttää (R, G, B) väliltä 0–255. Kun arvot ovat kelvolliset, värilaatikon taustaväri päivittyy. Virheellisestä arvosta näytetään virheviesti.

**Rakenne (esimerkki):**
```html
<section class="rgb-panel">
  <label>R <input type="number" min="0" max="255" placeholder="R"></label>
  <label>G <input type="number" min="0" max="255" placeholder="G"></label>
  <label>B <input type="number" min="0" max="255" placeholder="B"></label>

  <div class="color-box" style="width:120px;height:80px;"></div>
  <p class="rgb-error" aria-live="polite"></p>
</section>
```

**Käyttölogiikka:**
- Kun käyttäjä syöttää **kelvolliset** arvot kaikkiin kolmeen kenttään, aseta laatikolle tyyli:  
  `div.style.backgroundColor = 'rgb(R, G, B)'`
- Jos jokin arvo on puuttuva tai rajojen ulkopuolella, **älä** päivitä väriä ja näytä virheviesti (esim. “Arvojen tulee olla välillä 0–255.”).

**Testit tarkistavat:** että kelvollisilla arvoilla taustaväri on **täsmälleen** `rgb(120, 80, 200)` ja virheellisestä arvosta tulee **näkyvä** virheviesti.

**Vinkkejä:**
- Älä “hiljaa korjaa” (clamp) arvoja; näytä **virhe**.
- Voit päivittää väriä `input`-tapahtumassa tai “Päivitä”-napilla, kunhan lopputulos toimii.

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
- Kun käyttäjä kirjoittaa esim. “Osta maitoa” ja painaa “Lisää”, luo uusi `<li>` ja aseta sen tekstiksi syötteen arvo.
- Voit tyhjentää kentän lisäyksen jälkeen.

**Testit tarkistavat:** että listaan ilmestyy uusi kohta ja **viimeisen** listakohdan teksti vastaa syötettä (esim. “Osta maitoa”).

**Vinkkejä:**
- Luo elementti: `const li = document.createElement('li')`.
- Älä unohda liittää `li` osaksi `ul`-elementtiä (`appendChild` / `append`).

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
- Kun käyttäjä syöttää luvut ja valitsee operaation, painike laskee tuloksen ja näyttää sen `#result`-elementissä.
- Jos jakaja on 0 ja op on “/”, älä laske — näytä **virheviesti** (esim. “Nollalla ei voi jakaa.”).

**Testit tarkistavat:** että 5+7=12, 10−3=7, 4*6=24, 20/5=4 **näkyvät** tuloksina sekä nollalla jakamisesta tulee **näkyvä** virhe.

**Vinkkejä:**
- Muunna merkkijonot numeroiksi: `const a = Number(inputA.value)` jne.
- Voit toteuttaa logiikan `switch(op) { case '+': ... }`.

---

## Selektori- ja nimeämisvinkit (jotta testit löytävät asiat)

Nämä **eivät ole pakollisia**, mutta helpoimmat tavat varmistaa, että automaattitestit löytävät oikeat elementit:

- Käytä **label**-elementtejä tai selkeitä **placeholder**-tekstejä:
  - Profiilikortti: “Nimi”, “Sähköposti”, “Ikä”.
  - RGB: “R”, “G”, “B”.
  - Tehtävälista: “Tehtävä”.
- Painikkeiden tekstit:
  - Laskuri: “Lisää”, “Vähennä” (tai “+”, “−”).
  - Tehtävälista: “Lisää”.
  - Laskin: “Laske” (tai vaihtoehtoisesti suorat op-napit “+”, “−”, “*”, “/” — molemmat käy).
- Anna tulos-/kohde-elementeille jokin seuraavista tunnisteista (testit etsivät näitä):
  - **Laskuriarvo:** `[data-counter]`, `#counter`, `#counterValue` tai `.counter-value`.
  - **Värilaatikko:** `.color-box`, `#colorBox` tai `[data-color-box]`.
  - **Laskimen tulos:** `#result`, `.result` tai `[data-result]`.
  - **Lista:** `[data-list]` tai tavallinen `<ul>`.
- Virheilmoitukset:
  - Näytä ne **sivulla** (ei pelkkä `alert`) ja anna niille selkeä teksti, jossa esiintyy jokin sanoista **“virhe”**, **“invalid”**, **“kelvoton”** tai **“0–255”** (RGB), jotta viesti on helposti tunnistettavissa.
  - Käytä `aria-live="polite"` niin ruudunlukija havaitsee muutokset.

---

## Pisteytys

- 1 spec/tehtävä. Tehtävä on **hyväksytty** vain, jos sen kaikki alatestit menevät läpi.
- Lopullinen pistemäärä skaalataan **0–10** kaavalla `round(läpisseet / kaikki * 10)`.
- CI tallettaa **HTML-raportin** (Playwright) ja `score.json`-tiedoston artefakteihin.

Onnea matkaan!
