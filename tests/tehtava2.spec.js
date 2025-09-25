import { test, expect } from '@playwright/test';

function counterLocator(section) {
  return section.locator('[data-counter], #counterValue, #counter, .counter-value');
}

test.describe('Tehtävä 2: Laskuri', () => {
  test.beforeEach(async ({ page }) => { await page.goto('/'); });

  test('Lisää/Vähennä, ei negatiivista ja virheilmoitus', async ({ page }) => {
    const section = page.locator('section.counter');
    await expect(section, 'Laskuri-osio puuttuu sivulta').toBeVisible();

    const inc = section.getByRole('button', { name: /lisää|plus|\+/i });
    const dec = section.getByRole('button', { name: /vähennä|miinus|[−-]/i }); // unicode/ascii
    await expect(inc, 'Lisää-nappi puuttuu').toBeVisible();
    await expect(dec, 'Vähennä-nappi puuttuu').toBeVisible();

    const value = counterLocator(section).first();
    await expect(value, 'Laskurin arvoelementti puuttuu').toBeVisible();

    const getNumber = async () => {
      const t = (await value.textContent()) ?? '';
      const m = t.match(/-?\d+/);
      return m ? Number(m[0]) : NaN;
    };

    await inc.click();
    expect(await getNumber(), 'Arvon kasvatus ei toiminut').toBeGreaterThanOrEqual(1);

    for (let i = 0; i < 20; i++) await dec.click();
    expect(await getNumber(), 'Arvo meni negatiiviseksi').toBeGreaterThanOrEqual(0);

    // Tunnista virheilmoitus vain laskuri-osiosta
    const error = section.getByText(/virhe|negatiiv|invalid/i);
    await expect(error, 'Virheviesti puuttuu negatiivisesta yrityksestä').toBeVisible();
  });
});
