import { test, expect } from '@playwright/test';

<<<<<<< HEAD
async function findInput(page, keys) {
  for (const k of keys) {
    const byLabel = page.getByLabel(new RegExp(k, 'i'));
    if (await byLabel.count()) return byLabel.first();
    const byPlaceholder = page.getByPlaceholder(new RegExp(k, 'i'));
    if (await byPlaceholder.count()) return byPlaceholder.first();
    const byName = page.locator(`input[name*="${k}"]`);
    if (await byName.count()) return byName.first();
    const anyInput = page.locator(`input[id*="${k}"], input[class*="${k}"]`);
=======
async function findInput(section, keys) {
  for (const k of keys) {
    const byLabel = section.getByLabel(new RegExp(k, 'i'));
    if (await byLabel.count()) return byLabel.first();
    const byPlaceholder = section.getByPlaceholder(new RegExp(k, 'i'));
    if (await byPlaceholder.count()) return byPlaceholder.first();
    const byName = section.locator(`input[name*="${k}"]`);
    if (await byName.count()) return byName.first();
    const anyInput = section.locator(`input[id*="${k}"], input[class*="${k}"]`);
>>>>>>> 2090750f24202336eb7d8bddd5d8525778849908
    if (await anyInput.count()) return anyInput.first();
  }
  return null;
}

test.describe('Tehtävä 1: Profiilikortti', () => {
  test.beforeEach(async ({ page }) => { await page.goto('/'); });

  test('Nimi, sähköposti ja ikä päivittyvät näkyviin', async ({ page }) => {
<<<<<<< HEAD
    const nameInput = await findInput(page, ['nimi', 'name']);
    const emailInput = await findInput(page, ['sähköposti', 'email']);
    const ageInput = await findInput(page, ['ikä', 'age']);

    expect(nameInput, 'Syötekenttä nimelle puuttuu').not.toBeNull();
    expect(emailInput, 'Syötekenttä sähköpostille puuttuu').not.toBeNull();
    expect(ageInput, 'Syötekenttä iälle puuttuu').not.toBeNull();
=======
    const section = page.locator('section.profile');
    await expect(section, 'Profiilikortti-osio puuttuu sivulta').toBeVisible();

    const nameInput  = await findInput(section, ['nimi', 'name']);
    const emailInput = await findInput(section, ['sähköposti', 'email']);
    const ageInput   = await findInput(section, ['ikä', 'age']);

    expect(nameInput,  'Syötekenttä nimelle puuttuu').not.toBeNull();
    expect(emailInput, 'Syötekenttä sähköpostille puuttuu').not.toBeNull();
    expect(ageInput,   'Syötekenttä iälle puuttuu').not.toBeNull();
>>>>>>> 2090750f24202336eb7d8bddd5d8525778849908

    await nameInput.fill('Ada Lovelace');
    await emailInput.fill('ada@example.com');
    await ageInput.fill('36');

<<<<<<< HEAD
    // Jos toteutus vaatii "Päivitä"-napin, klikkaa sitä; muuten no-op.
    const updateBtn = page.getByRole('button', { name: /päivitä|update/i });
    if (await updateBtn.count()) { await updateBtn.first().click(); }

    await expect(page.getByText(/ada lovelace/i), 'Nimi ei päivittynyt näkyviin').toBeVisible();
    await expect(page.getByText(/ada@example\.com/i), 'Sähköposti ei päivittynyt näkyviin').toBeVisible();
    await expect(page.getByText(/\b36\b/), 'Ikä ei päivittynyt näkyviin').toBeVisible();
=======
    // Jos toteutus vaatii napin, klikkaa sitä; muuten ohitetaan
    const updateBtn = section.getByRole('button', { name: /päivitä|update/i });
    if (await updateBtn.count()) await updateBtn.first().click();

    await expect(section.getByText(/ada lovelace/i), 'Nimi ei päivittynyt näkyviin').toBeVisible();
    await expect(section.getByText(/ada@example\.com/i), 'Sähköposti ei päivittynyt näkyviin').toBeVisible();
    await expect(section.getByText(/\b36\b/), 'Ikä ei päivittynyt näkyviin').toBeVisible();
>>>>>>> 2090750f24202336eb7d8bddd5d8525778849908
  });
});
