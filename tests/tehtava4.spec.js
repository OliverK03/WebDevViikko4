import { test, expect } from '@playwright/test';

async function findTextBox(section) {
  const byRole = section.getByRole('textbox', { name: /tehtävä|task|todo/i });
  if (await byRole.count()) return byRole.first();
  const byPh = section.getByPlaceholder(/tehtävä|task|todo/i);
  if (await byPh.count()) return byPh.first();
  return section.locator('input[type="text"]').first();
}

test.describe('Tehtävä 4: Tehtävälista', () => {
  test.beforeEach(async ({ page }) => { await page.goto('/'); });

  test('Lisäys luo <li> listaan ja teksti vastaa syötettä', async ({ page }) => {
    const section = page.locator('section.todos');
    await expect(section).toBeVisible();

    const input = await findTextBox(section);
    const add = section.getByRole('button', { name: /lisää|add/i }).first();

    await expect(input, 'Syötekenttä puuttuu').toBeVisible();
    await expect(add, 'Lisää-nappi puuttuu').toBeVisible();

    await input.fill('Osta maitoa');
    await add.click();

    const list = section.locator('[data-list], ul, [role="list"]').first();
    await expect(list, 'Lista puuttuu').toBeVisible();

    const items = list.locator('li, [role="listitem"]');
    await expect(items, 'Listakohteita ei löytynyt').toHaveCountGreaterThan(0);
    await expect(items.last()).toContainText(/osta maitoa/i);
  });
});
