import test from 'node:test';
import assert from 'node:assert/strict';
import { categories, categoryMap } from '../src/data/categories.js';
import { prompts, curatedCollections } from '../src/data/prompts.js';
import {
  defaultState,
  examplePrompt,
  extractVariables,
  filterPrompts,
  isValidPrompt,
  mergeBackup,
  normalizePrompt,
  renderTemplate,
  validateBackup,
} from '../src/lib/vault.js';

const customPrompt = () => ({
  id: 'custom-example',
  title: 'A personal prompt',
  description: 'A clear starting point.',
  category: 'writing',
  template: 'Write a story about {{subject}} in a {{tone}} tone.',
  variables: [
    { key: 'subject', label: 'Subject', default: 'a garden' },
    { key: 'tone', label: 'Tone', default: 'hopeful' },
  ],
  tags: ['Creative'],
  tools: ['ChatGPT'],
  level: 'Beginner',
  createdAt: '2026-09-30T00:00:00.000Z',
});

// The catalog is deliberately the single source for both the UI and Markdown vault.
test('54 complete prompts cover all nine requested areas', () => {
  assert.equal(prompts.length, 54);
  assert.equal(categories.length, 9);
  assert.equal(new Set(prompts.map((prompt) => prompt.id)).size, prompts.length);
  for (const category of categories)
    assert.equal(prompts.filter((prompt) => prompt.category === category.id).length, 6);
  for (const prompt of prompts) {
    assert.ok(categoryMap[prompt.category]);
    assert.ok(
      prompt.title &&
        prompt.description &&
        prompt.template &&
        prompt.tip &&
        prompt.tools.length &&
        prompt.tags.length,
    );
    assert.deepEqual(
      extractVariables(prompt.template).sort(),
      prompt.variables.map((field) => field.key).sort(),
    );
    assert.ok(!examplePrompt(prompt).includes('{{'), `${prompt.id} has an unfilled example`);
  }
});

test('curated collections reference real, unique prompts', () => {
  const ids = new Set(prompts.map((prompt) => prompt.id));
  for (const collection of curatedCollections) {
    assert.ok(collection.ids.length >= 6);
    assert.equal(new Set(collection.ids).size, collection.ids.length);
    assert.ok(collection.ids.every((id) => ids.has(id)));
  }
});

test('template substitution handles repeated variables, whitespace, and dollar characters', () => {
  assert.deepEqual(extractVariables('{{ subject }} and {{subject}} with {{tone_2}}'), [
    'subject',
    'tone_2',
  ]);
  assert.equal(
    renderTemplate('Make {{ subject }} cost {{price}}.', { subject: ' tea ', price: '$5' }),
    'Make tea cost $5.',
  );
  assert.equal(renderTemplate('Hello {{name}}.', { name: '' }), 'Hello {{name}}.');
  assert.equal(renderTemplate('{{constructor}}', {}), '{{constructor}}');
  assert.equal(
    renderTemplate('{{empty}} and {{zero}}', { empty: '  ', zero: 0 }),
    '{{empty}} and 0',
  );
});

test('search is case-insensitive, multiword, and supports tags and tools', () => {
  assert.equal(filterPrompts(prompts, { query: 'SURREAL architecture' }).length, 1);
  assert.ok(
    filterPrompts(prompts, { query: 'n8n' }).some((prompt) => prompt.id === 'workflow-builder'),
  );
  assert.equal(filterPrompts(prompts, { query: 'definitelynothingmatches' }).length, 0);
  assert.equal(filterPrompts(prompts, { query: '   ' }).length, 54);
  assert.equal(filterPrompts(prompts, { category: 'coding' }).length, 6);
  assert.ok(filterPrompts(prompts, { category: 'image', tool: 'ChatGPT' }).length === 0);
});

test('featured, tool, and sort filters are deterministic without mutating the catalog', () => {
  assert.equal(filterPrompts(prompts, { featured: true }).length, 9);
  assert.equal(filterPrompts(prompts, { tool: 'Runway' }).length, 5);
  const original = prompts.map((prompt) => prompt.id);
  const alphabetical = filterPrompts(prompts, { sort: 'az' });
  assert.deepEqual(
    alphabetical.map((prompt) => prompt.title),
    alphabetical
      .map((prompt) => prompt.title)
      .slice()
      .sort((a, b) => a.localeCompare(b)),
  );
  assert.deepEqual(
    prompts.map((prompt) => prompt.id),
    original,
  );
  const newest = { ...customPrompt(), createdAt: '2026-10-01T00:00:00.000Z' };
  assert.equal(filterPrompts([...prompts, newest], { sort: 'newest' })[0].id, newest.id);
});

test('backup validation and normalization preserve personal data, discard untrusted image links', () => {
  const custom = { ...customPrompt(), image: 'javascript:untrusted', maliciousExtra: '<script>' };
  assert.ok(isValidPrompt(custom));
  const result = validateBackup({
    ...defaultState(),
    favorites: ['surreal-architecture', 'surreal-architecture'],
    customPrompts: [custom],
    collections: [
      {
        id: 'collection-test',
        name: 'My ideas',
        description: '',
        ids: ['surreal-architecture', 'surreal-architecture'],
      },
    ],
  });
  assert.deepEqual(result.favorites, ['surreal-architecture']);
  assert.equal(result.collections[0].ids.length, 1);
  assert.equal(result.customPrompts[0].image, undefined);
  assert.equal(result.customPrompts[0].maliciousExtra, undefined);
  assert.equal(normalizePrompt(custom).custom, true);
});

test('malformed backups are rejected atomically', () => {
  assert.equal(
    isValidPrompt({
      ...customPrompt(),
      template: 'Write about {{' + 'x'.repeat(65) + '}}.',
      variables: [],
    }),
    false,
  );
  assert.throws(() => validateBackup({}), /valid Prompt Vault backup/);
  assert.throws(
    () =>
      validateBackup({
        ...defaultState(),
        customPrompts: [{ ...customPrompt(), category: '__proto__' }],
      }),
    /invalid personal prompt/,
  );
  assert.throws(
    () =>
      validateBackup({
        ...defaultState(),
        customPrompts: [{ ...customPrompt(), tools: ['Unknown'] }],
      }),
    /invalid personal prompt/,
  );
  assert.throws(
    () =>
      validateBackup({ ...defaultState(), customPrompts: [{ ...customPrompt(), template: '' }] }),
    /invalid personal prompt/,
  );
  assert.throws(
    () => validateBackup({ ...defaultState(), customPrompts: [customPrompt(), customPrompt()] }),
    /duplicate prompt IDs/,
  );
  assert.throws(
    () =>
      validateBackup({
        ...defaultState(),
        collections: [{ id: 'collection-bad', name: '', ids: [] }],
      }),
    /invalid collection/,
  );
  assert.throws(() => validateBackup({ ...defaultState(), favorites: [1] }), /saved prompt list/);
});

test('import merges without losing existing favorites, collections, or drafts', () => {
  const existing = {
    ...defaultState(),
    favorites: ['a'],
    customPrompts: [customPrompt()],
    collections: [{ id: 'collection-test', name: 'Old name', description: '', ids: ['a'] }],
    playground: { promptId: 'a', values: {} },
  };
  const incoming = {
    ...defaultState(),
    favorites: ['b', 'a'],
    customPrompts: [{ ...customPrompt(), title: 'Updated personal prompt' }],
    collections: [{ id: 'collection-test', name: 'New name', description: '', ids: ['b'] }],
  };
  const merged = mergeBackup(existing, incoming);
  assert.deepEqual(merged.favorites, ['a', 'b']);
  assert.equal(merged.customPrompts.length, 1);
  assert.equal(merged.customPrompts[0].title, 'Updated personal prompt');
  assert.deepEqual(merged.collections[0].ids, ['a', 'b']);
  assert.equal(merged.playground.promptId, 'a');
});
