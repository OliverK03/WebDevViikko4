import { test, expect } from '@playwright/test';

async function fillBy(page, keys, val) {
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

async function chooseOp(page, opText) {
  const sel = page.locator('select[name*="op"], select#op, select.operator');
  if (await sel.count()) {
    try { await sel.first().selectOption({ label: opText }); }
    catch { await sel.first().selectOption({ value: opText }); }
    return;
  }
  await page.getByRole('button', { name: new RegExp(`^\\s*${opText}\\s*$`, 'i') }).click();
}

function resultLocator(page) {
  return page.locator('#result, .result, [data-result]').first();
}

test.describe('Tehtävä 5: Laskin', () => {
  test.beforeEach(async ({ page }) => { await page.goto('/'); });

  test('+, -, *, / toimivat', async ({ page }) => {
    expect(await fillBy(page, ['ensimmäinen','a','luku 1','num1'], 5)).toBeTruthy();
    expect(await fillBy(page, ['toinen','b','luku 2','num2'], 7)).toBeTruthy();
    await chooseOp(page, '+');
    await expect(resultLocator(page)).toContainText(/\b12\b/);

    await fillBy(page, ['ensimmäinen','a','luku 1','num1'], 10);
    await fillBy(page, ['toinen','b','luku 2','num2'], 3);
    await chooseOp(page, '-');
    await expect(resultLocator(page)).toContainText(/\b7\b/);

    await fillBy(page, ['ensimmäinen','a','luku 1','num1'], 4);
    await fillBy(page, ['toinen','b','luku 2','num2'], 6);
    await chooseOp(page, '*');
    await expect(resultLocator(page)).toContainText(/\b24\b/);

    await fillBy(page, ['ensimmäinen','a','luku 1','num1'], 20);
    await fillBy(page, ['toinen','b','luku 2','num2'], 5);
    await chooseOp(page, '/');
    await expect(resultLocator(page)).toContainText(/\b4\b/);
  });

  test('Nollalla jakaminen → virheviesti', async ({ page }) => {
    await fillBy(page, ['ensimmäinen','a','luku 1','num1'], 10);
    await fillBy(page, ['toinen','b','luku 2','num2'], 0);
    await chooseOp(page, '/');
    const err = page.getByText(/virhe|nollalla ei voi jakaa/i);
    await expect(err).toBeVisible();
  });
});
