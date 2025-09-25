import { test, expect } from '@playwright/test';

<<<<<<< HEAD
async function findTextBox(page) {
  const a = page.getByRole('textbox', { name: /tehtävä|task|todo/i });
  if (await a.count()) return a.first();
  const b = page.getByPlaceholder(/tehtävä|task|todo/i);
  if (await b.count()) return b.first();
  return page.locator('input[type="text"]').first();
=======
async function findTextBox(section) {
  const byRole = section.getByRole('textbox', { name: /tehtävä|task|todo/i });
  if (await byRole.count()) return byRole.first();
  const byPh = section.getByPlaceholder(/tehtävä|task|todo/i);
  if (await byPh.count()) return byPh.first();
  return section.locator('input[type="text"]').first();
>>>>>>> 2090750f24202336eb7d8bddd5d8525778849908
}

test.describe('Tehtävä 4: Tehtävälista', () => {
  test.beforeEach(async ({ page }) => { await page.goto('/'); });

  test('Lisäys luo <li> listaan ja teksti vastaa syötettä', async ({ page }) => {
<<<<<<< HEAD
    const input = await findTextBox(page);
    const add = page.getByRole('button', { name: /lisää|add/i });
=======
    const section = page.locator('section.todos');
    await expect(section).toBeVisible();

    const input = await findTextBox(section);
    const add = section.getByRole('button', { name: /lisää|add/i }).first();
>>>>>>> 2090750f24202336eb7d8bddd5d8525778849908

    await expect(input, 'Syötekenttä puuttuu').toBeVisible();
    await expect(add, 'Lisää-nappi puuttuu').toBeVisible();

    await input.fill('Osta maitoa');
    await add.click();

<<<<<<< HEAD
    const list = page.locator('[data-list], ul, [role="list"]').first();
    await expect(list, 'Lista puuttuu').toBeVisible();

    const items = list.locator('li, [role="listitem"]');
    const count = await items.count();
    expect(count, 'Lisättyä listakohtaa ei löytynyt').toBeGreaterThan(0);
=======
    const list = section.locator('[data-list], ul, [role="list"]').first();
    await expect(list, 'Lista puuttuu').toBeVisible();

    const items = list.locator('li, [role="listitem"]');
    await expect(items, 'Listakohteita ei löytynyt').toHaveCountGreaterThan(0);
>>>>>>> 2090750f24202336eb7d8bddd5d8525778849908
    await expect(items.last()).toContainText(/osta maitoa/i);
  });
});
