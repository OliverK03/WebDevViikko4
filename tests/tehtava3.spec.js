import { test, expect } from '@playwright/test';

async function fillNum(page, keys, val) {
  for (const k of keys) {
    const l = page.getByLabel(new RegExp(k, 'i'));
    if (await l.count()) { await l.first().fill(String(val)); return true; }
    const p = page.getByPlaceholder(new RegExp(k, 'i'));
    if (await p.count()) { await p.first().fill(String(val)); return true; }
    const n = page.locator(`input[name*="${k}"]`);
    if (await n.count()) { await n.first().fill(String(val)); return true; }
  }
  return false;
}

test.describe('Tehtävä 3: RGB-paneli', () => {
  test.beforeEach(async ({ page }) => { await page.goto('/'); });

  test('Kelvolliset arvot päivittävät taustavärin', async ({ page }) => {
    expect(await fillNum(page, ['r','punainen','red'], 120)).toBeTruthy();
    expect(await fillNum(page, ['g','vihreä','green'], 80)).toBeTruthy();
    expect(await fillNum(page, ['b','sininen','blue'], 200)).toBeTruthy();

    const square = page.locator('.color-box, #colorBox, [data-color-box]').first();
    await expect(square, 'Värilaatikko puuttuu').toBeVisible();

    const bg = await square.evaluate(el => getComputedStyle(el).backgroundColor.toLowerCase());
    expect(bg).toMatch(/rgb\(\s*120\s*,\s*80\s*,\s*200\s*\)/);
  });

  test('Virheellisestä arvosta näytetään virheviesti', async ({ page }) => {
    expect(await fillNum(page, ['r','punainen','red'], 300)).toBeTruthy();
    const error = page.getByText(/virhe|kelvoton|0-255/i);
    await expect(error).toBeVisible();
  });
});
