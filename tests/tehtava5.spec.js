import { test, expect } from '@playwright/test';

async function fillBy(section, keys, val) {
  for (const k of keys) {
    const l = section.getByLabel(new RegExp(k, 'i'));
    if (await l.count()) { await l.first().fill(String(val)); return true; }
    const p = section.getByPlaceholder(new RegExp(k, 'i'));
    if (await p.count()) { await p.first().fill(String(val)); return true; }
    const n = section.locator(`input[name*="${k}"]`);
    if (await n.count()) { await n.first().fill(String(val)); return true; }
  }
  return false;
}
async function chooseOp(section, opText) {
  const sel = section.locator('select[name*="op"], select#op, select.operator');
  if (await sel.count()) {
    try { await sel.first().selectOption({ label: opText }); }
    catch { await sel.first().selectOption({ value: opText }); }
    return;
  }
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
}

test.describe('Tehtävä 5: Laskin', () => {
  test.beforeEach(async ({ page }) => { await page.goto('/'); });

  test('+, -, *, / toimivat', async ({ page }) => {
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
    await expect(err).toBeVisible();
  });
});
