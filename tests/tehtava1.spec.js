import { test, expect } from '@playwright/test';

async function findInput(page, keys) {
  for (const k of keys) {
    const byLabel = page.getByLabel(new RegExp(k, 'i'));
    if (await byLabel.count()) return byLabel.first();
    const byPlaceholder = page.getByPlaceholder(new RegExp(k, 'i'));
    if (await byPlaceholder.count()) return byPlaceholder.first();
    const byName = page.locator(`input[name*="${k}"]`);
    if (await byName.count()) return byName.first();
    const anyInput = page.locator(`input[id*="${k}"], input[class*="${k}"]`);
    if (await anyInput.count()) return anyInput.first();
  }
  return null;
}

test.describe('Tehtävä 1: Profiilikortti', () => {
  test.beforeEach(async ({ page }) => { await page.goto('/'); });

  test('Nimi, sähköposti ja ikä päivittyvät näkyviin', async ({ page }) => {
    const nameInput = await findInput(page, ['nimi', 'name']);
    const emailInput = await findInput(page, ['sähköposti', 'email']);
    const ageInput = await findInput(page, ['ikä', 'age']);

    expect(nameInput, 'Syötekenttä nimelle puuttuu').not.toBeNull();
    expect(emailInput, 'Syötekenttä sähköpostille puuttuu').not.toBeNull();
    expect(ageInput, 'Syötekenttä iälle puuttuu').not.toBeNull();

    await nameInput.fill('Ada Lovelace');
    await emailInput.fill('ada@example.com');
    await ageInput.fill('36');

    await expect(page.getByText(/ada lovelace/i), 'Nimi ei päivittynyt näkyviin').toBeVisible();
    await expect(page.getByText(/ada@example\.com/i), 'Sähköposti ei päivittynyt näkyviin').toBeVisible();
    await expect(page.getByText(/\b36\b/), 'Ikä ei päivittynyt näkyviin').toBeVisible();
  });
});
