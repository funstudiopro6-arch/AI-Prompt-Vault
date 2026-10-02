import { test, expect } from '@playwright/test';
import { readFile } from 'node:fs/promises';
import AxeBuilder from '@axe-core/playwright';

const firstTitle = 'Surreal architectural dreamscape';

test.beforeEach(async ({ page }) => {
  await page.goto('/');
  await expect(page.getByRole('heading', { name: /A little prompt/ })).toBeVisible();
});

test('explore is populated, paginated, searchable, and filterable', async ({ page }) => {
  await expect(page.locator('.prompt-card')).toHaveCount(9);
  await expect(page.locator('.hero-bottom')).toContainText('54 ready-to-use prompts');
  await page.getByRole('button', { name: 'A little more inspiration' }).click();
  await expect(page.locator('.prompt-card')).toHaveCount(18);
  await page.getByRole('button', { name: 'Coding', exact: true }).click();
  await expect(page.locator('.prompt-card')).toHaveCount(6);
  await expect(page.locator('.prompt-card .category-badge')).toHaveText(Array(6).fill('Coding'));
  await page.getByRole('button', { name: 'All prompts', exact: true }).click();
  await page.getByRole('searchbox', { name: 'Search prompts' }).fill('surreal architecture');
  await expect(page.locator('.prompt-card')).toHaveCount(1);
  await expect(page.locator('.prompt-card h3')).toHaveText(firstTitle);
  await page.getByRole('searchbox', { name: 'Search prompts' }).fill('noresultsanywhere');
  await expect(page.getByRole('heading', { name: 'No sparks here just yet.' })).toBeVisible();
  await page.getByRole('button', { name: 'Explore all prompts', exact: true }).click();
  await expect(page.locator('.prompt-card')).toHaveCount(9);
  await page.getByLabel('Filter by AI tool').selectOption('Runway');
  await expect(page.locator('.prompt-card')).toHaveCount(5);
  await page.getByLabel('Sort prompts').selectOption('az');
  const titles = await page.locator('.prompt-card h3').allTextContents();
  expect(titles).toEqual(titles.slice().sort((a, b) => a.localeCompare(b)));
});

test('handpicked and list views work, and a category deep link survives reload', async ({
  page,
}) => {
  await page.getByRole('button', { name: 'Handpicked', exact: true }).click();
  await expect(page.locator('.count-badge').first()).toHaveText('9');
  await expect(page.getByRole('button', { name: 'A little more inspiration' })).toHaveCount(0);
  await page.getByRole('button', { name: 'List view', exact: true }).click();
  await expect(page.locator('.prompt-list')).toBeVisible();
  await page
    .locator('.category-nav')
    .getByRole('button', { name: /Research/ })
    .click();
  await expect(page).toHaveURL(/#\/explore\/research$/);
  await page.reload();
  await expect(page.locator('.prompt-card')).toHaveCount(6);
  await expect(page.locator('.category-nav .category-active')).toContainText('Research');
});

test('favorites persist and appear in the saved collection', async ({ page }) => {
  await page.getByRole('button', { name: `Save ${firstTitle}`, exact: true }).click();
  await expect(
    page.getByRole('button', { name: `Unsave ${firstTitle}`, exact: true }),
  ).toHaveAttribute('aria-pressed', 'true');
  await page
    .locator('.primary-nav')
    .getByRole('button', { name: /My collections/ })
    .click();
  await page
    .locator('.collection-card')
    .filter({ hasText: 'Saved for later' })
    .getByRole('button')
    .click();
  await expect(page.locator('.prompt-card')).toHaveCount(1);
  await page.reload();
  await expect(page.locator('.prompt-card h3')).toHaveText(firstTitle);
  await page.getByRole('button', { name: `Unsave ${firstTitle}`, exact: true }).click();
  await expect(
    page.getByRole('heading', { name: 'An empty space for your next big thing.' }),
  ).toBeVisible();
});

test('details show the real template, copy it, and support Escape and focus trapping', async ({
  page,
  context,
}) => {
  await context.grantPermissions(['clipboard-read', 'clipboard-write']);
  await page.getByRole('button', { name: firstTitle, exact: true }).click();
  const dialog = page.getByRole('dialog');
  await expect(dialog).toBeVisible();
  await dialog.getByRole('button', { name: 'Template', exact: true }).click();
  await expect(dialog.locator('mark').first()).toHaveText('{{subject}}');
  await dialog.getByRole('button', { name: 'Copy prompt', exact: true }).click();
  await expect(page.getByRole('status')).toContainText('Prompt copied');
  expect(await page.evaluate(() => navigator.clipboard.readText())).toContain('{{subject}}');
  await dialog.getByRole('button', { name: 'Close dialog' }).focus();
  await page.keyboard.press('Shift+Tab');
  expect(
    await page.evaluate(() => document.activeElement.closest('[role="dialog"]') !== null),
  ).toBe(true);
  await page.keyboard.press('Escape');
  await expect(dialog).toHaveCount(0);
  await expect(page.getByRole('button', { name: firstTitle, exact: true })).toBeFocused();
  await page.keyboard.press('Control+k');
  await expect(page.getByRole('searchbox', { name: 'Search prompts' })).toBeFocused();
});

test('playground personalizes a prompt, preserves drafts, resets, and saves a version', async ({
  page,
}) => {
  await page.locator('.prompt-card').first().getByRole('button', { name: 'Use prompt' }).click();
  await expect(page).toHaveURL(/#\/playground$/);
  await page.getByLabel(/Architecture\{\{subject\}\}/).fill('a floating mountain observatory');
  await expect(page.locator('.preview-content')).toContainText('a floating mountain observatory');
  await page.getByLabel(/A little extra direction/).fill('Use softer shadows and a calm blue sky.');
  await expect(page.locator('.preview-content')).toContainText(
    'Additional direction: Use softer shadows',
  );
  await page.reload();
  await expect(page.getByLabel(/Architecture\{\{subject\}\}/)).toHaveValue(
    'a floating mountain observatory',
  );
  await page.getByRole('button', { name: 'Save as prompt', exact: true }).click();
  await expect(page.getByRole('dialog')).toBeVisible();
  await page.getByLabel(/Prompt title/).fill('My floating observatory');
  await page.getByRole('button', { name: 'Add to my vault', exact: true }).click();
  await page.getByRole('searchbox', { name: 'Search prompts' }).fill('My floating observatory');
  await expect(page.locator('.prompt-card')).toHaveCount(1);
  await expect(page.locator('.personal-badge')).toHaveText('Yours');
  await page
    .locator('.primary-nav')
    .getByRole('button', { name: /Playground/ })
    .click();
  await page.getByRole('button', { name: 'Reset', exact: true }).click();
  await expect(page.getByLabel(/Architecture\{\{subject\}\}/)).toHaveValue(
    'a minimalist desert retreat',
  );
});

test('personal prompts can be added with variables, edited, and deleted', async ({ page }) => {
  await page.getByRole('button', { name: 'Add prompt', exact: true }).click();
  await page.getByLabel(/Prompt title/).fill('My useful writing helper');
  await page.getByRole('combobox', { name: 'Category', exact: true }).selectOption('writing');
  await page.getByLabel('A short description').fill('A simple prompt to test a personal workflow.');
  await page
    .getByLabel(/Your prompt/)
    .fill('Write a thoughtful poem about {{topic}} in a {{tone}} voice.');
  await expect(page.locator('.variable-default-grid input')).toHaveCount(2);
  await page.locator('.variable-default-grid input').nth(0).fill('the first day of autumn');
  await page.locator('.variable-default-grid input').nth(1).fill('hopeful');
  await page.getByRole('button', { name: 'Add to my vault', exact: true }).click();
  await page.getByRole('searchbox', { name: 'Search prompts' }).fill('My useful writing helper');
  await expect(page.locator('.prompt-card')).toHaveCount(1);
  await page.getByRole('button', { name: 'My useful writing helper', exact: true }).click();
  await page.getByRole('dialog').getByRole('button', { name: 'Edit prompt', exact: true }).click();
  await page.getByLabel(/Prompt title/).fill('My polished writing helper');
  await page.getByRole('button', { name: 'Save changes', exact: true }).click();
  await page.getByRole('searchbox', { name: 'Search prompts' }).fill('My polished writing helper');
  await page.getByRole('button', { name: 'My polished writing helper', exact: true }).click();
  await page.getByRole('dialog').getByRole('button', { name: 'Delete', exact: true }).click();
  await expect(page.getByRole('heading', { name: 'Let this idea go?' })).toBeVisible();
  await page.getByRole('dialog').getByRole('button', { name: 'Delete', exact: true }).click();
  await expect(page.locator('.prompt-card')).toHaveCount(0);
});

test('collections can be created, filled, renamed, exported, and deleted without deleting prompts', async ({
  page,
}) => {
  await page
    .locator('.primary-nav')
    .getByRole('button', { name: /My collections/ })
    .click();
  await page.getByRole('button', { name: 'New collection', exact: true }).click();
  await page.getByLabel('Collection name').fill('My little design world');
  await page.getByLabel('A little description').fill('Ideas for my next project.');
  await page.getByRole('button', { name: 'Create collection', exact: true }).click();
  await page.locator('.primary-nav').getByRole('button', { name: 'Explore', exact: true }).click();
  await page.getByRole('button', { name: firstTitle, exact: true }).click();
  await page.getByRole('button', { name: 'Add to a collection', exact: true }).click();
  await page
    .getByRole('dialog')
    .getByRole('button', { name: /My little design world/ })
    .click();
  await page.getByRole('button', { name: 'All done', exact: true }).click();
  await page
    .locator('.primary-nav')
    .getByRole('button', { name: /My collections/ })
    .click();
  await page
    .locator('.collection-card')
    .filter({ hasText: 'My little design world' })
    .locator('.collection-card-main')
    .click();
  await expect(page.locator('.prompt-card')).toHaveCount(1);
  const downloadPromise = page.waitForEvent('download');
  await page.getByRole('button', { name: 'Export prompts', exact: true }).click();
  const download = await downloadPromise;
  expect(download.suggestedFilename()).toBe('my-little-design-world.md');
  expect(await readFile(await download.path(), 'utf8')).toContain('a minimalist desert retreat');
  await page.getByRole('button', { name: 'Edit collection', exact: true }).click();
  await page.getByLabel('Collection name').fill('Renamed design world');
  await page.getByRole('button', { name: 'Save changes', exact: true }).click();
  await expect(page.getByRole('heading', { name: /Renamed design world/ })).toBeVisible();
  await page.getByRole('button', { name: 'Delete collection', exact: true }).click();
  await page.getByRole('dialog').getByRole('button', { name: 'Delete', exact: true }).click();
  await expect(
    page.locator('.collection-card').filter({ hasText: 'Renamed design world' }),
  ).toHaveCount(0);
  await page.locator('.primary-nav').getByRole('button', { name: 'Explore', exact: true }).click();
  await expect(page.locator('.prompt-card')).toHaveCount(9);
});

test('backup export and import work and invalid backups do not replace personal data', async ({
  page,
}) => {
  await page.getByRole('button', { name: `Save ${firstTitle}`, exact: true }).click();
  await page.getByRole('button', { name: 'A little help & tips', exact: true }).click();
  const downloadPromise = page.waitForEvent('download');
  await page.getByRole('button', { name: 'Export my vault', exact: true }).click();
  const download = await downloadPromise;
  const backup = JSON.parse(await readFile(await download.path(), 'utf8'));
  expect(backup.favorites).toContain('surreal-architecture');
  expect(backup.playground).toBeNull();
  await page.getByLabel('Import a vault backup').setInputFiles({
    name: 'invalid.json',
    mimeType: 'application/json',
    buffer: Buffer.from('{"version":900}'),
  });
  await expect(page.getByRole('alert')).toContainText('not a valid Prompt Vault backup');
  expect(
    await page.evaluate(() => JSON.parse(localStorage.getItem('ai-prompt-vault:v1')).favorites),
  ).toContain('surreal-architecture');
  const merged = { ...backup, favorites: [...backup.favorites, 'react-component'] };
  await page.getByLabel('Import a vault backup').setInputFiles({
    name: 'backup.json',
    mimeType: 'application/json',
    buffer: Buffer.from(JSON.stringify(merged)),
  });
  await expect(page.getByRole('status')).toContainText('Backup imported');
  await page.getByRole('button', { name: 'Close dialog', exact: true }).click();
  await expect(
    page.getByRole('button', { name: 'Unsave Your next great React component', exact: true }),
  ).toBeVisible();
});

test('blank canvas accepts original text and downloads it', async ({ page }) => {
  await page
    .locator('.primary-nav')
    .getByRole('button', { name: /Playground/ })
    .click();
  await page.getByLabel('Choose a starting point', { exact: true }).selectOption('blank');
  await page
    .getByLabel('Edit your full prompt')
    .fill(
      'Act as a creative thinking partner. Help me brainstorm five ideas for a small community art project.',
    );
  await expect(page.locator('.preview-status')).toContainText('Ready to try');
  const downloadPromise = page.waitForEvent('download');
  await page.getByRole('button', { name: 'Download customized prompt', exact: true }).click();
  const download = await downloadPromise;
  expect(await readFile(await download.path(), 'utf8')).toContain('community art project');
  await page.reload();
  await expect(page.getByLabel('Edit your full prompt')).toHaveValue(/community art project/);
});

test('mobile navigation and core pages have no horizontal overflow', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await expect(page.getByRole('button', { name: 'Open navigation' })).toBeVisible();
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  await page.getByRole('button', { name: 'Open navigation' }).click();
  await page
    .locator('.category-nav')
    .getByRole('button', { name: /Education/ })
    .click();
  await expect(page.locator('.sidebar-overlay')).toHaveCount(0);
  await expect(page.locator('.prompt-card')).toHaveCount(6);
  await page.locator('.prompt-card').first().getByRole('button', { name: 'Use prompt' }).click();
  await expect(page.getByRole('heading', { name: /Your idea. Your way/ })).toBeVisible();
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  await page.getByRole('button', { name: 'Open navigation' }).click();
  await page
    .locator('.primary-nav')
    .getByRole('button', { name: /My collections/ })
    .click();
  await expect(page.getByRole('heading', { name: /A home for your ideas/ })).toBeVisible();
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
});

test('no runtime errors or broken local assets on the main views', async ({ page }) => {
  const errors = [];
  const brokenAssets = [];
  page.on('pageerror', (error) => errors.push(error.message));
  page.on('response', (response) => {
    if (response.url().startsWith('http://127.0.0.1:5173') && response.status() >= 400)
      brokenAssets.push(response.url());
  });
  await page.reload();
  await page
    .locator('.primary-nav')
    .getByRole('button', { name: /My collections/ })
    .click();
  await page
    .locator('.primary-nav')
    .getByRole('button', { name: /Playground/ })
    .click();
  await expect(page.locator('.preview-content')).toBeVisible();
  expect(errors).toEqual([]);
  expect(brokenAssets).toEqual([]);
});

test('core pages and dialogs pass automated accessibility checks', async ({ page }) => {
  for (const route of ['explore', 'collections', 'playground']) {
    await page.goto(`/#/${route}`);
    const audit = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa', 'wcag21aa'])
      .analyze();
    expect(audit.violations).toEqual([]);
  }
  await page.goto('/#/explore');
  for (const trigger of [
    'Add prompt',
    'Surreal architectural dreamscape',
    'A little help & tips',
  ]) {
    await page.getByRole('button', { name: trigger, exact: true }).click();
    await expect(page.locator('.modal')).toHaveCSS('opacity', '1');
    const audit = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa', 'wcag21aa'])
      .analyze();
    expect(audit.violations).toEqual([]);
    await page.getByRole('button', { name: 'Close dialog', exact: true }).click();
  }
});

test('mobile menu traps focus and restores the workspace after closing a dialog', async ({
  page,
}) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.getByRole('button', { name: 'Open navigation', exact: true }).click();
  await expect(page.getByRole('link', { name: 'AI Prompt Vault home' })).toBeFocused();
  await page.keyboard.press('Shift+Tab');
  await expect(
    page.getByRole('button', { name: 'A little help & tips', exact: true }),
  ).toBeFocused();
  await page.getByRole('button', { name: 'A little help & tips', exact: true }).click();
  await expect(page.getByRole('dialog')).toBeVisible();
  await page.keyboard.press('Escape');
  await expect(page.getByRole('dialog')).toHaveCount(0);
  await expect(page.locator('.main-shell')).not.toHaveAttribute('inert');
  await expect(page.locator('body')).not.toHaveCSS('overflow', 'hidden');
  await page.getByRole('searchbox', { name: 'Search prompts' }).fill('React');
  await expect(page.locator('.prompt-card')).toHaveCount(1);
});
