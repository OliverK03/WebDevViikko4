import { test, expect } from '@playwright/test';

<<<<<<< HEAD
async function fillBy(page, keys, val) {
  for (const k of keys) {
    const l = page.getByLabel(new RegExp(k, 'i'));
    if (await l.count()) { await l.first().fill(String(val)); return true; }
    const p = page.getByPlaceholder(new RegExp(k, 'i'));
    if (await p.count()) { await p.first().fill(String(val)); return true; }
    const n = page.locator(`input[name*="${k}"]`);
=======
async function fillBy(section, keys, val) {
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
<<<<<<< HEAD

async function chooseOp(page, opText) {
  const sel = page.locator('select[name*="op"], select#op, select.operator');
=======
async function chooseOp(section, opText) {
  const sel = section.locator('select[name*="op"], select#op, select.operator');
>>>>>>> 2090750f24202336eb7d8bddd5d8525778849908
  if (await sel.count()) {
    try { await sel.first().selectOption({ label: opText }); }
    catch { await sel.first().selectOption({ value: opText }); }
    return;
  }
<<<<<<< HEAD
  await page.getByRole('button', { name: new RegExp(`^\\s*${opText}\\s*$`, 'i') }).click();
}

async function clickCalculateIfPresent(page) {
  const calcBtn = page.getByRole('button', { name: /laske|calculate/i });
  if (await calcBtn.count()) await calcBtn.first().click();
}

function resultLocator(page) {
  return page.locator('#result, .result, [data-result]').first();
=======
  await section.getByRole('button', { name: new RegExp(`^\\s*${opText}\\s*$`, 'i') }).click();
}
async function clickCalculateIfPresent(section) {
  const calcBtn = section.getByRole('button', { name: /laske|calculate/i });
  if (await calcBtn.count()) await calcBtn.first().click();
}
function resultLocator(section) {
  return section.locator('#result, .result, [data-result]').first();
}

async function computeAndExpect(section, a, op, b, expectedPattern) {
  // Täytä molemmat kentät VARMUUDEKSI aina uudelleen
  expect(await fillBy(section, ['ensimmäinen','a','luku 1','num1'], a)).toBeTruthy();
  expect(await fillBy(section, ['toinen','b','luku 2','num2'], b)).toBeTruthy();

  await chooseOp(section, op);
  await clickCalculateIfPresent(section);

  // Jos toteutus laskee vasta 'change'-eventistä, valitse op vielä kerran
  await chooseOp(section, op);

  await expect(resultLocator(section)).toContainText(expectedPattern);
>>>>>>> 2090750f24202336eb7d8bddd5d8525778849908
}

test.describe('Tehtävä 5: Laskin', () => {
  test.beforeEach(async ({ page }) => { await page.goto('/'); });

  test('+, -, *, / toimivat', async ({ page }) => {
<<<<<<< HEAD
    expect(await fillBy(page, ['ensimmäinen','a','luku 1','num1'], 5)).toBeTruthy();
    expect(await fillBy(page, ['toinen','b','luku 2','num2'], 7)).toBeTruthy();
    await chooseOp(page, '+');
    await clickCalculateIfPresent(page);
    await expect(resultLocator(page)).toContainText(/\b12\b/);

    await fillBy(page, ['ensimmäinen','a','luku 1','num1'], 10);
    await fillBy(page, ['toinen','b','luku 2','num2'], 3);
    await chooseOp(page, '-');
    await clickCalculateIfPresent(page);
    await expect(resultLocator(page)).toContainText(/\b7\b/);

    await fillBy(page, ['ensimmäinen','a','luku 1','num1'], 4);
    await fillBy(page, ['toinen','b','luku 2','num2'], 6);
    await chooseOp(page, '*');
    await clickCalculateIfPresent(page);
    await expect(resultLocator(page)).toContainText(/\b24\b/);

    await fillBy(page, ['ensimmäinen','a','luku 1','num1'], 20);
    await fillBy(page, ['toinen','b','luku 2','num2'], 5);
    await chooseOp(page, '/');
    await clickCalculateIfPresent(page);
    await expect(resultLocator(page)).toContainText(/\b4\b/);
  });

  test('Nollalla jakaminen → virheviesti', async ({ page }) => {
    await fillBy(page, ['ensimmäinen','a','luku 1','num1'], 10);
    await fillBy(page, ['toinen','b','luku 2','num2'], 0);
    await chooseOp(page, '/');
    await clickCalculateIfPresent(page);
    const err = page.getByText(/virhe|nollalla ei voi jakaa/i);
=======
    const section = page.locator('section.calculator');
    await expect(section).toBeVisible();

    await computeAndExpect(section, 5, '+', 7, /\b12\b/);
    await computeAndExpect(section, 10, '-', 3, /\b7\b/);
    await computeAndExpect(section, 4, '*', 6, /\b24\b/);
    await computeAndExpect(section, 20, '/', 5, /\b4\b/);
  });

  test('Nollalla jakaminen → virheviesti', async ({ page }) => {
    const section = page.locator('section.calculator');
    await expect(section).toBeVisible();

    expect(await fillBy(section, ['ensimmäinen','a','luku 1','num1'], 10)).toBeTruthy();
    expect(await fillBy(section, ['toinen','b','luku 2','num2'], 0)).toBeTruthy();
    await chooseOp(section, '/');
    await clickCalculateIfPresent(section);
    const err = section.getByText(/virhe|nollalla ei voi jakaa/i);
>>>>>>> 2090750f24202336eb7d8bddd5d8525778849908
    await expect(err).toBeVisible();
  });
});
