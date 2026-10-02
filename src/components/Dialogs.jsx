import { useMemo, useState } from 'react';
import { categories, categoryMap, tools } from '../data/categories.js';
import { examplePrompt, extractVariables } from '../lib/vault.js';
import Icon from './Icon.jsx';
import Modal from './Modal.jsx';
import { PromptVisual } from './PromptCard.jsx';

export function TokenText({ text }) {
  return text
    .split(/(\{\{\s*[a-zA-Z][a-zA-Z0-9_]*\s*\}\})/g)
    .map((part, index) => (part.startsWith('{{') ? <mark key={index}>{part}</mark> : part));
}

export function PromptDetail({
  prompt,
  saved,
  onClose,
  onSave,
  onCopy,
  onCustomize,
  onCollection,
  onDownload,
  onEdit,
  onDelete,
}) {
  const [mode, setMode] = useState('example');
  const category = categoryMap[prompt.category];
  return (
    <Modal
      title="A little closer look"
      subtitle="Every great idea starts somewhere."
      onClose={onClose}
      wide
      className="detail-modal"
    >
      <div className="detail-layout">
        <div className="detail-info">
          <div className="detail-visual" style={{ '--category-color': category.color }}>
            <PromptVisual prompt={prompt} />
            <span className="category-badge">
              <Icon name={category.icon} size={14} />
              {category.name}
            </span>
          </div>
          <div className="detail-title-row">
            <h2>{prompt.title}</h2>
            <button
              className={`icon-button detail-bookmark ${saved ? 'saved' : ''}`}
              aria-label={saved ? 'Unsave prompt' : 'Save prompt'}
              aria-pressed={saved}
              onClick={() => onSave(prompt.id)}
            >
              <Icon name="Bookmark" size={20} fill={saved ? 'currentColor' : 'none'} />
            </button>
          </div>
          <p className="detail-description">{prompt.description}</p>
          <div className="detail-meta">
            <span>
              <Icon name="SlidersHorizontal" size={14} />
              {prompt.level}
            </span>
            <span>
              <Icon name="WandSparkles" size={14} />
              {prompt.variables.length} customizable{' '}
              {prompt.variables.length === 1 ? 'field' : 'fields'}
            </span>
          </div>
          <div className="detail-tools">
            <h4>TAKE IT TO YOUR FAVORITE TOOL</h4>
            <div>
              {prompt.tools.map((tool) => (
                <span key={tool}>{tool}</span>
              ))}
            </div>
          </div>
          <div className="tip-box">
            <Icon name="Lightbulb" size={18} />
            <div>
              <h4>A little tip</h4>
              <p>{prompt.tip}</p>
            </div>
          </div>
          <button className="collection-link" onClick={() => onCollection(prompt)}>
            <Icon name="FolderPlus" size={16} />
            Add to a collection <Icon name="ChevronRight" size={14} />
          </button>
          {prompt.custom && (
            <div className="custom-prompt-actions">
              <button onClick={() => onEdit(prompt)}>
                <Icon name="Pencil" size={14} />
                Edit prompt
              </button>
              <button className="text-danger" onClick={() => onDelete(prompt)}>
                <Icon name="Trash2" size={14} />
                Delete
              </button>
            </div>
          )}
        </div>
        <div className="detail-prompt">
          <div className="detail-prompt-heading">
            <div className="segmented-tabs">
              <button
                className={mode === 'example' ? 'active' : ''}
                onClick={() => setMode('example')}
              >
                Ready to use
              </button>
              <button
                className={mode === 'template' ? 'active' : ''}
                onClick={() => setMode('template')}
              >
                Template
              </button>
            </div>
            <button
              className="icon-button"
              aria-label="Download prompt"
              title="Download as text"
              onClick={() => onDownload(prompt)}
            >
              <Icon name="Download" size={17} />
            </button>
          </div>
          <pre className="prompt-code">
            <TokenText text={mode === 'example' ? examplePrompt(prompt) : prompt.template} />
          </pre>
          <div className="prompt-note">
            <Icon name="Info" size={14} />
            {mode === 'template'
              ? 'Replace the highlighted fields, or customize them in the playground.'
              : 'Example values are filled in. Make it your own in the playground.'}
          </div>
          <div className="detail-footer">
            <button
              className="button button-secondary"
              onClick={() =>
                onCopy(prompt, mode === 'template' ? prompt.template : examplePrompt(prompt))
              }
            >
              <Icon name="Copy" size={16} />
              Copy prompt
            </button>
            <button className="button button-primary" onClick={() => onCustomize(prompt)}>
              Make it yours <Icon name="WandSparkles" size={16} />
            </button>
          </div>
        </div>
      </div>
    </Modal>
  );
}

export function PromptForm({ initial, editing = false, onClose, onSubmit }) {
  const [form, setForm] = useState({
    title: initial?.title || '',
    description: initial?.description || '',
    category: initial?.category || 'image',
    template: initial?.template || '',
    tags: initial?.tags?.join(', ') || '',
    level: initial?.level || 'Beginner',
    tools: initial?.tools || ['Midjourney', 'DALL·E', 'Flux'],
  });
  const [values, setValues] = useState(
    Object.fromEntries((initial?.variables || []).map((item) => [item.key, item.default])),
  );
  const [error, setError] = useState('');
  const variableKeys = useMemo(() => extractVariables(form.template), [form.template]);
  const update = (key, value) => setForm((current) => ({ ...current, [key]: value }));
  function submit(event) {
    event.preventDefault();
    if (form.title.trim().length < 3)
      return setError('Give your prompt a title with at least 3 characters.');
    if (form.template.trim().length < 10)
      return setError('Add a prompt with at least 10 characters.');
    if (!form.tools.length) return setError('Choose at least one compatible AI tool.');
    if (variableKeys.length > 100) return setError('Use no more than 100 customizable fields.');
    if (variableKeys.some((key) => key.length > 64))
      return setError('Keep customizable field names to 64 characters or fewer.');
    const tags = [
      ...new Set(
        form.tags
          .split(',')
          .map((tag) => tag.trim())
          .filter(Boolean),
      ),
    ];
    if (tags.length > 10 || tags.some((tag) => tag.length > 40))
      return setError('Use up to 10 tags, each 40 characters or fewer.');
    onSubmit({
      ...initial,
      ...form,
      title: form.title.trim(),
      description: form.description.trim() || 'A personal prompt, ready for your next idea.',
      template: form.template.trim(),
      tags,
      variables: variableKeys.map((key) => ({
        key,
        label: key.replaceAll('_', ' '),
        default: values[key] || '',
      })),
      id: editing ? initial.id : `custom-${crypto.randomUUID()}`,
      createdAt: editing ? initial.createdAt : new Date().toISOString(),
      custom: true,
      tip: 'This is one of your personal prompts. Customize it, test it in your preferred AI tool, and refine it over time.',
    });
  }
  return (
    <Modal
      title={editing ? 'Polish your prompt' : 'Give your idea a home'}
      subtitle={
        editing
          ? 'A good prompt grows with you.'
          : 'Add a prompt to your personal, browser-local vault.'
      }
      onClose={onClose}
      wide
      className="form-modal"
    >
      <form onSubmit={submit} className="prompt-form">
        <div className="form-row">
          <label className="form-field">
            Prompt title <span>*</span>
            <input
              autoFocus
              required
              minLength={3}
              maxLength={100}
              placeholder="A little name for your big idea"
              value={form.title}
              onChange={(event) => update('title', event.target.value)}
            />
          </label>
          <label className="form-field">
            Category
            <select
              value={form.category}
              onChange={(event) => {
                const category = event.target.value;
                setForm((current) => ({
                  ...current,
                  category,
                  tools:
                    category === 'image'
                      ? ['Midjourney', 'DALL·E', 'Flux']
                      : category === 'video'
                        ? ['Runway', 'Sora', 'Kling']
                        : ['ChatGPT', 'Claude', 'Gemini'],
                }));
              }}
            >
              {categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
          </label>
        </div>
        <label className="form-field">
          A short description
          <input
            maxLength={500}
            placeholder="What will this prompt help you create?"
            value={form.description}
            onChange={(event) => update('description', event.target.value)}
          />
        </label>
        <label className="form-field">
          Your prompt <span>*</span>
          <textarea
            required
            minLength={10}
            maxLength={20000}
            rows={7}
            placeholder={
              'Write your prompt here.\n\nUse {{subject}} or {{tone}} for customizable fields.'
            }
            value={form.template}
            onChange={(event) => update('template', event.target.value)}
          />
          <small>
            Make it reusable with fields like <code>{'{{subject}}'}</code>. We’ll turn them into
            inputs for you.
          </small>
        </label>
        {variableKeys.length > 0 && (
          <fieldset className="variable-defaults">
            <legend>
              Example values <span>Optional, but a helpful starting point</span>
            </legend>
            <div className="variable-default-grid">
              {variableKeys.map((key) => (
                <label className="form-field" key={key}>
                  <code>{`{{${key}}}`}</code>
                  <input
                    maxLength={20000}
                    placeholder={`Example ${key.replaceAll('_', ' ')}`}
                    value={values[key] || ''}
                    onChange={(event) =>
                      setValues((current) => ({ ...current, [key]: event.target.value }))
                    }
                  />
                </label>
              ))}
            </div>
          </fieldset>
        )}
        <div className="form-row">
          <label className="form-field">
            Tags
            <input
              placeholder="Creative, Planning, Photography"
              maxLength={400}
              value={form.tags}
              onChange={(event) => update('tags', event.target.value)}
            />
            <small>Separate tags with commas.</small>
          </label>
          <label className="form-field">
            Experience level
            <select value={form.level} onChange={(event) => update('level', event.target.value)}>
              <option>Beginner</option>
              <option>Intermediate</option>
              <option>Advanced</option>
            </select>
          </label>
        </div>
        <fieldset className="tools-field">
          <legend>
            Compatible AI tools <span>*</span>
          </legend>
          <div className="tool-checkboxes">
            {tools.map((tool) => (
              <label key={tool.name} className={form.tools.includes(tool.name) ? 'selected' : ''}>
                <input
                  type="checkbox"
                  checked={form.tools.includes(tool.name)}
                  onChange={() =>
                    update(
                      'tools',
                      form.tools.includes(tool.name)
                        ? form.tools.filter((name) => name !== tool.name)
                        : [...form.tools, tool.name],
                    )
                  }
                />
                <Icon name={form.tools.includes(tool.name) ? 'Check' : 'Plus'} size={13} />
                {tool.name}
              </label>
            ))}
          </div>
        </fieldset>
        {error && (
          <p className="form-error" role="alert">
            {error}
          </p>
        )}
        <div className="form-footer">
          <span>
            <Icon name="Info" size={14} />
            Saved on this browser. Export a backup to keep it safe.
          </span>
          <button type="button" className="button button-secondary" onClick={onClose}>
            Cancel
          </button>
          <button type="submit" className="button button-primary">
            <Icon name="Plus" size={16} />
            {editing ? 'Save changes' : 'Add to my vault'}
          </button>
        </div>
      </form>
    </Modal>
  );
}

export function CollectionForm({ initial, onClose, onSubmit }) {
  const [name, setName] = useState(initial?.name || '');
  const [description, setDescription] = useState(initial?.description || '');
  return (
    <Modal
      title={initial ? 'A little collection edit' : 'Gather your next big ideas'}
      subtitle="A home for prompts that belong together."
      onClose={onClose}
    >
      <form
        className="collection-form"
        onSubmit={(event) => {
          event.preventDefault();
          if (name.trim())
            onSubmit({
              id: initial?.id || `collection-${crypto.randomUUID()}`,
              name: name.trim(),
              description: description.trim(),
              ids: initial?.ids || [],
              color: '#c3aaf5',
              icon: 'Folder',
            });
        }}
      >
        <label className="form-field">
          Collection name
          <input
            autoFocus
            required
            maxLength={80}
            value={name}
            onChange={(event) => setName(event.target.value)}
            placeholder="e.g. My next creative project"
          />
        </label>
        <label className="form-field">
          A little description
          <textarea
            maxLength={240}
            rows={3}
            value={description}
            onChange={(event) => setDescription(event.target.value)}
            placeholder="What will you keep here?"
          />
        </label>
        <div className="form-footer">
          <button type="button" className="button button-secondary" onClick={onClose}>
            Cancel
          </button>
          <button type="submit" className="button button-primary">
            <Icon name="FolderPlus" size={16} />
            {initial ? 'Save changes' : 'Create collection'}
          </button>
        </div>
      </form>
    </Modal>
  );
}

export function CollectionPicker({
  prompt,
  collections,
  favorites,
  onToggleFavorite,
  onToggleCollection,
  onCreate,
  onClose,
}) {
  return (
    <Modal
      title="Keep your inspiration close"
      subtitle={`Add “${prompt.title}” to your collections.`}
      onClose={onClose}
    >
      <div className="collection-picker">
        <button
          className={`collection-choice ${favorites.includes(prompt.id) ? 'chosen' : ''}`}
          onClick={() => onToggleFavorite(prompt.id)}
        >
          <span className="collection-choice-icon">
            <Icon name="Bookmark" size={20} />
          </span>
          <span>
            <strong>Saved for later</strong>
            <small>Your favorite little sparks</small>
          </span>
          <span className="choice-checkbox">
            {favorites.includes(prompt.id) && <Icon name="Check" size={14} />}
          </span>
        </button>
        {collections.map((collection) => (
          <button
            key={collection.id}
            className={`collection-choice ${collection.ids.includes(prompt.id) ? 'chosen' : ''}`}
            onClick={() => onToggleCollection(collection.id, prompt.id)}
          >
            <span className="collection-choice-icon">
              <Icon name="Folder" size={20} />
            </span>
            <span>
              <strong>{collection.name}</strong>
              <small>
                {collection.ids.length} {collection.ids.length === 1 ? 'prompt' : 'prompts'}
              </small>
            </span>
            <span className="choice-checkbox">
              {collection.ids.includes(prompt.id) && <Icon name="Check" size={14} />}
            </span>
          </button>
        ))}
        <button className="new-collection-choice" onClick={() => onCreate(prompt)}>
          <Icon name="Plus" size={17} />
          Create a new collection
        </button>
        <div className="form-footer">
          <span>Changes are saved as you go.</span>
          <button className="button button-primary" onClick={onClose}>
            All done <Icon name="Check" size={16} />
          </button>
        </div>
      </div>
    </Modal>
  );
}

export function ConfirmDialog({ title, description, confirmLabel = 'Delete', onConfirm, onClose }) {
  return (
    <Modal title={title} onClose={onClose}>
      <div className="confirm-content">
        <p>{description}</p>
        <div className="form-footer">
          <button className="button button-secondary" onClick={onClose}>
            Keep it
          </button>
          <button className="button button-danger" onClick={onConfirm}>
            <Icon name="Trash2" size={16} />
            {confirmLabel}
          </button>
        </div>
      </div>
    </Modal>
  );
}

export function HelpDialog({ onClose, onExport, onImport }) {
  const [importError, setImportError] = useState('');
  const [importing, setImporting] = useState(false);
  return (
    <Modal
      title="A little guidance. A better start."
      subtitle="Your ideas do the driving. These prompts are a head start."
      onClose={onClose}
      wide
      className="help-modal"
    >
      <div className="help-content">
        <div className="help-steps">
          <div>
            <span>01</span>
            <h3>Find your spark</h3>
            <p>Explore by category, search an idea, or let “Surprise me” take you somewhere new.</p>
          </div>
          <div>
            <span>02</span>
            <h3>Make it your own</h3>
            <p>
              Open a prompt in the playground. Change its fields, add direction, and keep a version
              you love.
            </p>
          </div>
          <div>
            <span>03</span>
            <h3>See where it goes</h3>
            <p>
              Copy your prompt into a compatible AI tool. Try it, review the result, then refine one
              thing at a time.
            </p>
          </div>
        </div>
        <div className="help-note">
          <Icon name="Info" size={19} />
          <p>
            The vault is a prompt library and builder, not an AI generation service. External tools
            may need an account or a paid plan. Always review generated code, verify research
            sources, and avoid putting sensitive data in prompts.
          </p>
        </div>
        <div className="backup-section">
          <div>
            <h3>Your vault, your browser.</h3>
            <p>
              Favorites, collections, and personal prompts live in this browser’s local storage.
              There is no account or cloud sync. Back them up before clearing browser data.
            </p>
          </div>
          <div className="backup-actions">
            <button className="button button-secondary" onClick={onExport}>
              <Icon name="Download" size={16} />
              Export my vault
            </button>
            <label
              className={`button button-secondary import-button ${importing ? 'disabled' : ''}`}
            >
              <Icon name="Upload" size={16} />
              {importing ? 'Importing…' : 'Import a backup'}
              <input
                type="file"
                accept=".json,application/json"
                disabled={importing}
                aria-label="Import a vault backup"
                onChange={async (event) => {
                  const file = event.target.files?.[0];
                  if (!file) return;
                  setImportError('');
                  setImporting(true);
                  try {
                    if (file.size > 5 * 1024 * 1024)
                      throw new Error('Choose a backup smaller than 5 MB.');
                    await onImport(JSON.parse(await file.text()));
                  } catch (error) {
                    setImportError(
                      error instanceof SyntaxError
                        ? 'That file is not valid JSON. Please choose a vault backup.'
                        : error.message,
                    );
                  } finally {
                    setImporting(false);
                    event.target.value = '';
                  }
                }}
              />
            </label>
          </div>
          {importError && (
            <p className="form-error" role="alert">
              {importError}
            </p>
          )}
        </div>
        <div className="shortcut-row">
          <span>
            <Icon name="Command" size={15} />A few useful shortcuts
          </span>
          <span>
            <kbd>⌘ / Ctrl</kbd> + <kbd>K</kbd> Search
          </span>
          <span>
            <kbd>Esc</kbd> Close a dialog
          </span>
        </div>
        <div className="help-description">
          <Icon name="Sparkles" size={18} />
          <p>
            AI Prompt Vault is a growing collection of powerful, creative, and practical AI prompts
            for image generation, video creation, coding, productivity, education, research,
            automation, and more. Explore ready-to-use prompts, customize them for your needs,
            experiment with AI, and unlock new possibilities for creativity and innovation.
          </p>
        </div>
      </div>
    </Modal>
  );
}
