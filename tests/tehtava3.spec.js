import { test, expect } from '@playwright/test';

<<<<<<< HEAD
async function fillNum(page, keys, val) {
  for (const k of keys) {
    const l = page.getByLabel(new RegExp(k, 'i'));
    if (await l.count()) { await l.first().fill(String(val)); return true; }
    const p = page.getByPlaceholder(new RegExp(k, 'i'));
    if (await p.count()) { await p.first().fill(String(val)); return true; }
    const n = page.locator(`input[name*="${k}"]`);
=======
async function fillNum(section, keys, val) {
  for (const k of keys) {
    const l = section.getByLabel(new RegExp(k, 'i'));
    if (await l.count()) { await l.first().fill(String(val)); return true; }
    const p = section.getByPlaceholder(new RegExp(k, 'i'));
    if (await p.count()) { await p.first().fill(String(val)); return true; }
    const n = section.locator(`input[name*="${k}"]`);
>>>>>>> 2090750f24202336eb7d8bddd5d8525778849908
    if (await n.count()) { await n.first().fill(String(val)); return true; }
  }
  return false;
}

test.describe('Tehtävä 3: RGB-paneli', () => {
  test.beforeEach(async ({ page }) => { await page.goto('/'); });

  test('Kelvolliset arvot päivittävät taustavärin', async ({ page }) => {
<<<<<<< HEAD
    expect(await fillNum(page, ['r','punainen','red'], 120)).toBeTruthy();
    expect(await fillNum(page, ['g','vihreä','green'], 80)).toBeTruthy();
    expect(await fillNum(page, ['b','sininen','blue'], 200)).toBeTruthy();

    const square = page.locator('.color-box, #colorBox, [data-color-box]').first();
=======
    const section = page.locator('section.rgb-panel');
    await expect(section).toBeVisible();

    expect(await fillNum(section, ['r','punainen','red'], 120)).toBeTruthy();
    expect(await fillNum(section, ['g','vihreä','green'], 80)).toBeTruthy();
    expect(await fillNum(section, ['b','sininen','blue'], 200)).toBeTruthy();

    const square = section.locator('.color-box, #colorBox, [data-color-box]').first();
>>>>>>> 2090750f24202336eb7d8bddd5d8525778849908
    await expect(square, 'Värilaatikko puuttuu').toBeVisible();

    const bg = await square.evaluate(el => getComputedStyle(el).backgroundColor.toLowerCase());
    expect(bg).toMatch(/rgb\(\s*120\s*,\s*80\s*,\s*200\s*\)/);
  });

  test('Virheellisestä arvosta näytetään virheviesti', async ({ page }) => {
<<<<<<< HEAD
    expect(await fillNum(page, ['r','punainen','red'], 300)).toBeTruthy();
    const error = page.getByText(/virhe|kelvoton|0-255/i);
=======
    const section = page.locator('section.rgb-panel');
    await expect(section).toBeVisible();

    expect(await fillNum(section, ['r','punainen','red'], 300)).toBeTruthy();
    // Haetaan virhe VAIN tästä osiosta -> ei osuta laskurin virheilmoon
    const error = section.getByText(/virhe|kelvoton|0-255/i);
>>>>>>> 2090750f24202336eb7d8bddd5d8525778849908
    await expect(error).toBeVisible();
  });
});
