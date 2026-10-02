import { categoryMap, tools } from '../data/categories.js';

export const STORAGE_KEY = 'ai-prompt-vault:v1';
export const defaultState = () => ({
  version: 1,
  favorites: [],
  collections: [],
  customPrompts: [],
  playground: null,
});
export const allowedToolNames = new Set(tools.map((tool) => tool.name));

export function extractVariables(template) {
  return [
    ...new Set(
      [...String(template).matchAll(/\{\{\s*([a-zA-Z][a-zA-Z0-9_]*)\s*\}\}/g)].map(
        (match) => match[1],
      ),
    ),
  ];
}

export function renderTemplate(template, values = {}) {
  return String(template).replace(/\{\{\s*([a-zA-Z][a-zA-Z0-9_]*)\s*\}\}/g, (match, key) => {
    const value = Object.hasOwn(values, key) ? values[key] : undefined;
    return value !== undefined && String(value).trim() !== '' ? String(value).trim() : match;
  });
}

export function examplePrompt(prompt) {
  const values = Object.fromEntries(
    (prompt.variables || []).map((item) => [item.key, item.default]),
  );
  return renderTemplate(prompt.template, values);
}

export function filterPrompts(
  prompts,
  { query = '', category = 'all', tool = 'all', featured = false, sort = 'recommended' } = {},
) {
  const words = query.trim().toLowerCase().split(/\s+/).filter(Boolean);
  const result = prompts.filter((prompt) => {
    if (category !== 'all' && prompt.category !== category) return false;
    if (tool !== 'all' && !prompt.tools.includes(tool)) return false;
    if (featured && !prompt.featured) return false;
    const searchable = [
      prompt.title,
      prompt.description,
      categoryMap[prompt.category]?.name,
      ...prompt.tags,
      ...prompt.tools,
    ]
      .join(' ')
      .toLowerCase();
    return words.every((word) => searchable.includes(word));
  });
  if (sort === 'az') result.sort((a, b) => a.title.localeCompare(b.title));
  if (sort === 'newest') result.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  return result;
}

export function isValidPrompt(prompt) {
  return Boolean(
    prompt &&
    typeof prompt.id === 'string' &&
    prompt.id.startsWith('custom-') &&
    prompt.id.length <= 150 &&
    typeof prompt.title === 'string' &&
    prompt.title.trim().length >= 3 &&
    prompt.title.length <= 100 &&
    typeof prompt.description === 'string' &&
    prompt.description.length <= 500 &&
    Object.hasOwn(categoryMap, prompt.category) &&
    typeof prompt.template === 'string' &&
    prompt.template.trim().length >= 10 &&
    prompt.template.length <= 20000 &&
    extractVariables(prompt.template).length <= 100 &&
    extractVariables(prompt.template).every((key) => key.length <= 64) &&
    Array.isArray(prompt.tags) &&
    prompt.tags.length <= 10 &&
    prompt.tags.every((tag) => typeof tag === 'string' && tag.length <= 40) &&
    Array.isArray(prompt.tools) &&
    prompt.tools.length > 0 &&
    prompt.tools.every((tool) => allowedToolNames.has(tool)) &&
    Array.isArray(prompt.variables) &&
    prompt.variables.length <= 100 &&
    prompt.variables.every(
      (item) =>
        item &&
        typeof item.key === 'string' &&
        item.key.length <= 64 &&
        /^[a-zA-Z][a-zA-Z0-9_]*$/.test(item.key) &&
        typeof item.label === 'string' &&
        item.label.length <= 100 &&
        typeof item.default === 'string' &&
        item.default.length <= 20000,
    ) &&
    ['Beginner', 'Intermediate', 'Advanced'].includes(prompt.level) &&
    typeof prompt.createdAt === 'string' &&
    !Number.isNaN(Date.parse(prompt.createdAt)),
  );
}

export function normalizePrompt(prompt) {
  return {
    id: prompt.id,
    title: prompt.title.trim(),
    description: prompt.description.trim(),
    category: prompt.category,
    template: prompt.template,
    tags: prompt.tags.slice(0, 10),
    tools: [...new Set(prompt.tools)],
    variables: extractVariables(prompt.template).map((key) => {
      const found = prompt.variables.find((item) => item.key === key);
      return {
        key,
        label: found?.label || key.replaceAll('_', ' '),
        default: found?.default || '',
      };
    }),
    level: prompt.level,
    createdAt: prompt.createdAt,
    custom: true,
    tip: 'This is one of your personal prompts. Customize it, test it in your preferred AI tool, and refine it over time.',
  };
}

export function validateBackup(data) {
  if (
    !data ||
    data.version !== 1 ||
    !Array.isArray(data.favorites) ||
    !Array.isArray(data.collections) ||
    !Array.isArray(data.customPrompts)
  ) {
    throw new Error(
      'This is not a valid Prompt Vault backup. Please choose an exported vault JSON file.',
    );
  }
  if (
    data.customPrompts.length > 1000 ||
    data.collections.length > 200 ||
    data.favorites.length > 10000
  ) {
    throw new Error('This backup exceeds the supported vault size.');
  }
  if (data.customPrompts.some((prompt) => !isValidPrompt(prompt)))
    throw new Error('The backup contains an invalid personal prompt. Nothing was imported.');
  if (new Set(data.customPrompts.map((prompt) => prompt.id)).size !== data.customPrompts.length)
    throw new Error('The backup contains duplicate prompt IDs.');
  if (data.favorites.some((id) => typeof id !== 'string' || id.length > 150))
    throw new Error('The saved prompt list is invalid.');
  const collections = data.collections.map((collection) => {
    if (
      !collection ||
      typeof collection.id !== 'string' ||
      collection.id.length > 150 ||
      !collection.id.startsWith('collection-') ||
      typeof collection.name !== 'string' ||
      !collection.name.trim() ||
      collection.name.length > 80 ||
      typeof collection.description !== 'string' ||
      collection.description.length > 240 ||
      !Array.isArray(collection.ids) ||
      collection.ids.length > 10000 ||
      collection.ids.some((id) => typeof id !== 'string' || id.length > 150)
    ) {
      throw new Error('The backup contains an invalid collection. Nothing was imported.');
    }
    return {
      id: collection.id,
      name: collection.name.trim(),
      description: collection.description,
      ids: [...new Set(collection.ids)],
      color: '#c3aaf5',
      icon: 'Folder',
    };
  });
  if (new Set(collections.map((collection) => collection.id)).size !== collections.length)
    throw new Error('The backup contains duplicate collection IDs.');
  return {
    version: 1,
    favorites: [...new Set(data.favorites)],
    collections,
    customPrompts: data.customPrompts.map(normalizePrompt),
    playground: null,
  };
}

export function loadState() {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) return defaultState();
    const data = JSON.parse(stored);
    const normalized = validateBackup(data);
    // Draft content is local-only and is never trusted as executable data.
    if (
      data.playground &&
      typeof data.playground === 'object' &&
      typeof data.playground.promptId === 'string' &&
      data.playground.values &&
      typeof data.playground.values === 'object'
    ) {
      normalized.playground = {
        promptId: data.playground.promptId,
        values: Object.fromEntries(
          Object.entries(data.playground.values)
            .filter(
              ([key, value]) => /^[a-zA-Z][a-zA-Z0-9_]*$/.test(key) && typeof value === 'string',
            )
            .slice(0, 100),
        ),
        notes:
          typeof data.playground.notes === 'string' ? data.playground.notes.slice(0, 20000) : '',
        edited:
          typeof data.playground.edited === 'string'
            ? data.playground.edited.slice(0, 30000)
            : null,
      };
    }
    return normalized;
  } catch {
    return defaultState();
  }
}

export function mergeBackup(current, incoming) {
  const prompts = new Map(current.customPrompts.map((item) => [item.id, item]));
  incoming.customPrompts.forEach((item) => prompts.set(item.id, item));
  const collections = new Map(current.collections.map((item) => [item.id, item]));
  incoming.collections.forEach((item) => {
    const existing = collections.get(item.id);
    collections.set(item.id, {
      ...item,
      ids: [...new Set([...(existing?.ids || []), ...item.ids])],
    });
  });
  return {
    ...current,
    favorites: [...new Set([...current.favorites, ...incoming.favorites])],
    customPrompts: [...prompts.values()],
    collections: [...collections.values()],
  };
}

export function downloadFile(filename, content, type = 'text/plain') {
  const url = URL.createObjectURL(new Blob([content], { type }));
  const anchor = document.createElement('a');
  anchor.href = url;
  anchor.download = filename;
  document.body.appendChild(anchor);
  anchor.click();
  anchor.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

export async function copyToClipboard(text) {
  if (navigator.clipboard?.writeText) {
    try {
      await navigator.clipboard.writeText(text);
      return;
    } catch {
      /* Use the compatible fallback below. */
    }
  }
  const previous = document.activeElement;
  const textarea = document.createElement('textarea');
  textarea.value = text;
  textarea.style.position = 'fixed';
  textarea.style.opacity = '0';
  document.body.appendChild(textarea);
  textarea.select();
  const copied = document.execCommand('copy');
  textarea.remove();
  previous?.focus();
  if (!copied)
    throw new Error('Clipboard access is unavailable. Select and copy the prompt manually.');
}
