import { test, expect } from '@playwright/test';

function counterLocator(page) {
  return page.locator('[data-counter], #counterValue, #counter, .counter-value');
}

test.describe('Tehtävä 2: Laskuri', () => {
  test.beforeEach(async ({ page }) => { await page.goto('/'); });

  test('Lisää/Vähennä, ei negatiivista ja virheilmoitus', async ({ page }) => {
    const inc = page.getByRole('button', { name: /lisää|plus|\+/i });
    const dec = page.getByRole('button', { name: /vähennä|miinus|-\b/i });

    await expect(inc, 'Lisää-nappi puuttuu').toBeVisible();
    await expect(dec, 'Vähennä-nappi puuttuu').toBeVisible();

    const value = counterLocator(page).first();
    await expect(value, 'Laskurin arvoelementti puuttuu').toBeVisible();

    const getNumber = async () => {
      const t = (await value.textContent()) ?? '';
      const m = t.match(/-?\d+/);
      return m ? Number(m[0]) : NaN;
    };

    // Nosta arvoa
    await inc.click();
    expect(await getNumber(), 'Arvon kasvatus ei toiminut').toBeGreaterThanOrEqual(1);

    // Yritä laskea negatiiviseksi
    for (let i = 0; i < 20; i++) await dec.click();

    // Arvo ei saa mennä alle nollan
    expect(await getNumber(), 'Arvo meni negatiiviseksi').toBeGreaterThanOrEqual(0);

    // Virheviesti näkyy yrityksestä mennä < 0
    const error = page.getByText(/virhe|ei voi mennä negatiiviseksi|invalid/i);
    await expect(error, 'Virheviesti puuttuu negatiivisesta yrityksestä').toBeVisible();
  });
});
