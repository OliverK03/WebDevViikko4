import { test, expect } from '@playwright/test';

<<<<<<< HEAD
function counterLocator(page) {
  return page.locator('[data-counter], #counterValue, #counter, .counter-value');
=======
function counterLocator(section) {
  return section.locator('[data-counter], #counterValue, #counter, .counter-value');
>>>>>>> 2090750f24202336eb7d8bddd5d8525778849908
}

test.describe('Tehtävä 2: Laskuri', () => {
  test.beforeEach(async ({ page }) => { await page.goto('/'); });

  test('Lisää/Vähennä, ei negatiivista ja virheilmoitus', async ({ page }) => {
<<<<<<< HEAD
    const inc = page.getByRole('button', { name: /lisää|plus|\+/i });
    const dec = page.getByRole('button', { name: /vähennä|miinus|[−-]/i }); // tukee unicode- ja ascii-miinusta

    await expect(inc, 'Lisää-nappi puuttuu').toBeVisible();
    await expect(dec, 'Vähennä-nappi puuttuu').toBeVisible();

    const value = counterLocator(page).first();
=======
    const section = page.locator('section.counter');
    await expect(section, 'Laskuri-osio puuttuu sivulta').toBeVisible();

    const inc = section.getByRole('button', { name: /lisää|plus|\+/i });
    const dec = section.getByRole('button', { name: /vähennä|miinus|[−-]/i }); // unicode/ascii
    await expect(inc, 'Lisää-nappi puuttuu').toBeVisible();
    await expect(dec, 'Vähennä-nappi puuttuu').toBeVisible();

    const value = counterLocator(section).first();
>>>>>>> 2090750f24202336eb7d8bddd5d8525778849908
    await expect(value, 'Laskurin arvoelementti puuttuu').toBeVisible();

    const getNumber = async () => {
      const t = (await value.textContent()) ?? '';
      const m = t.match(/-?\d+/);
      return m ? Number(m[0]) : NaN;
    };

    await inc.click();
    expect(await getNumber(), 'Arvon kasvatus ei toiminut').toBeGreaterThanOrEqual(1);

    for (let i = 0; i < 20; i++) await dec.click();
<<<<<<< HEAD

    expect(await getNumber(), 'Arvo meni negatiiviseksi').toBeGreaterThanOrEqual(0);

    // Salli "virhe" TAI mikä tahansa sana, jossa esiintyy "negatiiv"
    const error = page.getByText(/virhe|negatiiv|invalid/i);
=======
    expect(await getNumber(), 'Arvo meni negatiiviseksi').toBeGreaterThanOrEqual(0);

    // Tunnista virheilmoitus vain laskuri-osiosta
    const error = section.getByText(/virhe|negatiiv|invalid/i);
>>>>>>> 2090750f24202336eb7d8bddd5d8525778849908
    await expect(error, 'Virheviesti puuttuu negatiivisesta yrityksestä').toBeVisible();
  });
});
