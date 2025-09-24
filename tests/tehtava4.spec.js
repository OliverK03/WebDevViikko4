import { test, expect } from '@playwright/test';

async function findTextBox(page) {
  const a = page.getByRole('textbox', { name: /tehtävä|task|todo/i });
  if (await a.count()) return a.first();
  const b = page.getByPlaceholder(/tehtävä|task|todo/i);
  if (await b.count()) return b.first();
  return page.locator('input[type="text"]').first();
}

test.describe('Tehtävä 4: Tehtävälista', () => {
  test.beforeEach(async ({ page }) => { await page.goto('/'); });

  test('Lisäys luo <li> listaan ja teksti vastaa syötettä', async ({ page }) => {
    const input = await findTextBox(page);
    const add = page.getByRole('button', { name: /lisää|add/i });

    await expect(input, 'Syötekenttä puuttuu').toBeVisible();
    await expect(add, 'Lisää-nappi puuttuu').toBeVisible();

    await input.fill('Osta maitoa');
    await add.click();

    const list = page.locator('[data-list], ul, [role="list"]').first();
    await expect(list, 'Lista puuttuu').toBeVisible();

    const items = list.locator('li, [role="listitem"]');
    const count = await items.count();
    expect(count, 'Lisättyä listakohtaa ei löytynyt').toBeGreaterThan(0);
    await expect(items.last()).toContainText(/osta maitoa/i);
  });
});
