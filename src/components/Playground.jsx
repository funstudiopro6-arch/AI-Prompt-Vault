import { useState } from 'react';
import { categories, categoryMap, tools } from '../data/categories.js';
import { extractVariables, renderTemplate } from '../lib/vault.js';
import Icon from './Icon.jsx';
import { TokenText } from './Dialogs.jsx';

const blankPrompt = {
  id: 'blank',
  title: 'Your original idea',
  description: 'Start with a thought. See where it takes you.',
  category: 'writing',
  template: '',
  variables: [],
  tags: ['Original'],
  level: 'Beginner',
  tools: ['ChatGPT', 'Claude', 'Gemini'],
};

export function createDraft(prompt) {
  return {
    promptId: prompt.id,
    values: Object.fromEntries(
      prompt.variables.map((variable) => [variable.key, variable.default]),
    ),
    notes: '',
    edited: null,
  };
}

export default function Playground({
  prompts,
  draft,
  onDraft,
  onCopyText,
  onSaveVersion,
  onDownload,
  onDetails,
}) {
  const [fieldTab, setFieldTab] = useState('fields');
  const [editing, setEditing] = useState(draft?.promptId === 'blank');
  const selected =
    draft?.promptId === 'blank'
      ? blankPrompt
      : prompts.find((prompt) => prompt.id === draft?.promptId) || prompts[0];
  const current = draft?.promptId === selected.id ? draft : createDraft(selected);
  const category = categoryMap[selected.category];
  const built =
    renderTemplate(selected.template, current.values) +
    (current.notes.trim() ? `\n\nAdditional direction: ${current.notes.trim()}` : '');
  const preview = current.edited !== null ? current.edited : built;
  const unresolved = extractVariables(preview);
  const [tool, setTool] = useState(selected.tools[0]);
  const currentTool = selected.tools.includes(tool) ? tool : selected.tools[0];
  const toolUrl = tools.find((item) => item.name === currentTool)?.url;
  const update = (changes) => onDraft({ ...current, ...changes });

  function selectPrompt(id) {
    const next = id === 'blank' ? blankPrompt : prompts.find((prompt) => prompt.id === id);
    onDraft(createDraft(next));
    setEditing(id === 'blank');
    setFieldTab('fields');
    setTool(next.tools[0]);
  }

  return (
    <div className="playground-page">
      <div className="page-title-block">
        <div className="section-eyebrow">A SPACE TO PLAY. A PLACE TO CREATE.</div>
        <h1>
          Your idea. Your way<span className="accent-dot">.</span>
        </h1>
        <p>A starting point, a few little changes, and something completely your own.</p>
      </div>
      <div className="playground-start">
        <div className="playground-start-icon">
          <Icon name="WandSparkles" size={23} />
        </div>
        <div>
          <label htmlFor="prompt-start">Choose a starting point</label>
          <p>Pick a prompt to personalize, or start with a blank canvas.</p>
        </div>
        <select
          id="prompt-start"
          value={selected.id}
          onChange={(event) => selectPrompt(event.target.value)}
        >
          <option value="blank">＋ A blank canvas</option>
          {categories.map((category) => (
            <optgroup key={category.id} label={category.name}>
              {prompts
                .filter((prompt) => prompt.category === category.id)
                .map((prompt) => (
                  <option key={prompt.id} value={prompt.id}>
                    {prompt.title}
                  </option>
                ))}
            </optgroup>
          ))}
        </select>
      </div>
      <div className="playground-layout">
        <section className="customize-panel">
          <header className="panel-header">
            <span>
              <Icon name="SlidersHorizontal" size={17} />
              Make it personal
            </span>
            <button
              className="text-button"
              onClick={() => {
                onDraft(createDraft(selected));
                setEditing(selected.id === 'blank');
              }}
            >
              Reset <Icon name="RotateCcw" size={13} />
            </button>
          </header>
          <div className="selected-prompt-info">
            <span className="plain-category" style={{ color: category.color }}>
              <Icon name={category.icon} size={14} />
              {category.name}
            </span>
            <h3>{selected.title}</h3>
            <p>{selected.description}</p>
            {selected.id !== 'blank' && (
              <button onClick={() => onDetails(selected)}>
                View prompt details <Icon name="ArrowUpRight" size={13} />
              </button>
            )}
          </div>
          <div className="field-tabs">
            <button
              className={fieldTab === 'fields' ? 'active' : ''}
              onClick={() => setFieldTab('fields')}
            >
              <Icon name="Settings2" size={14} />
              Custom fields<span>{selected.variables.length}</span>
            </button>
            <button
              className={fieldTab === 'template' ? 'active' : ''}
              onClick={() => setFieldTab('template')}
            >
              <Icon name="Code2" size={14} />
              Template
            </button>
          </div>
          <div className="customize-fields">
            {fieldTab === 'fields' ? (
              <>
                {selected.variables.length ? (
                  selected.variables.map((variable) => (
                    <label key={variable.key} className="form-field variable-field">
                      <span>
                        {variable.label}
                        <code>{`{{${variable.key}}}`}</code>
                      </span>
                      <textarea
                        rows={(current.values[variable.key] || '').length > 110 ? 3 : 2}
                        maxLength={20000}
                        placeholder={variable.default || `Enter ${variable.label.toLowerCase()}`}
                        value={current.values[variable.key] || ''}
                        onChange={(event) =>
                          update({
                            values: { ...current.values, [variable.key]: event.target.value },
                            edited: null,
                          })
                        }
                      />
                      {variable.hint && <small>{variable.hint}</small>}
                    </label>
                  ))
                ) : (
                  <div className="no-fields">
                    <Icon name="PenLine" size={26} />
                    <h4>
                      {selected.id === 'blank'
                        ? 'Every idea starts somewhere.'
                        : 'No fields to fill in.'}
                    </h4>
                    <p>
                      {selected.id === 'blank'
                        ? 'Write your original prompt in the preview. Tell the AI what to do, give it context, and describe the result you want.'
                        : 'This prompt is ready as-is. Add your own direction below, or edit the full text in the preview.'}
                    </p>
                  </div>
                )}
                {selected.id !== 'blank' && (
                  <label className="form-field additional-direction">
                    A little extra direction <span className="optional-label">OPTIONAL</span>
                    <textarea
                      rows={3}
                      maxLength={20000}
                      placeholder="Add context, constraints, or details that make it yours..."
                      value={current.notes}
                      onChange={(event) => update({ notes: event.target.value, edited: null })}
                    />
                  </label>
                )}
              </>
            ) : (
              <div className="original-template">
                <div className="template-intro">
                  <Icon name="Info" size={15} />
                  This is your starting template. Use the custom fields or edit the live preview to
                  make changes.
                </div>
                <pre className="prompt-code">
                  <TokenText
                    text={
                      selected.template ||
                      'A blank canvas — write your original idea in the preview.'
                    }
                  />
                </pre>
              </div>
            )}
          </div>
        </section>
        <section className="preview-panel">
          <header className="panel-header">
            <span>
              <Icon name="Sparkles" size={17} />
              Your prompt, coming to life
            </span>
            <span className="live-preview-tag">
              <i />
              LIVE PREVIEW
            </span>
          </header>
          <div className="preview-topline">
            <span>
              <Icon name={category.icon} size={14} />
              {selected.id === 'blank' ? 'Original prompt' : 'Your customized prompt'}
            </span>
            <button
              className={`text-button ${editing ? 'accent-text' : ''}`}
              onClick={() => {
                if (!editing) update({ edited: preview });
                setEditing(!editing);
              }}
            >
              <Icon name={editing ? 'Check' : 'Pencil'} size={13} />
              {editing ? 'Done editing' : 'Edit text'}
            </button>
          </div>
          <div className="preview-content">
            {editing ? (
              <textarea
                aria-label="Edit your full prompt"
                autoFocus
                maxLength={30000}
                value={preview}
                placeholder="You are a helpful expert in..."
                onChange={(event) => update({ edited: event.target.value })}
              />
            ) : (
              <pre className="prompt-code">
                <TokenText
                  text={
                    preview ||
                    'Your next great idea goes here. Choose a starting prompt or open “Edit text” to begin.'
                  }
                />
              </pre>
            )}
          </div>
          <div className="preview-status">
            <span>
              {preview.length.toLocaleString()} characters <i>·</i>{' '}
              {preview.trim() ? preview.trim().split(/\s+/).length : 0} words
            </span>
            <span className={unresolved.length ? 'status-warning' : 'status-ready'}>
              <Icon name={unresolved.length ? 'Info' : 'Check'} size={13} />
              {unresolved.length
                ? `${unresolved.length} unfilled ${unresolved.length === 1 ? 'field' : 'fields'}`
                : preview.trim()
                  ? 'Ready to try'
                  : 'Your canvas is ready'}
            </span>
          </div>
          {current.edited !== null && selected.variables.length > 0 && (
            <div className="edited-note">
              <Icon name="Info" size={13} />
              You’ve edited the text. Changing a field will rebuild this preview.
            </div>
          )}
          <div className="preview-actions">
            <button
              className="button button-primary copy-main"
              disabled={!preview.trim()}
              onClick={() => onCopyText(preview)}
            >
              <Icon name="Copy" size={17} />
              Copy your prompt
            </button>
            <button
              className="button button-secondary"
              disabled={!preview.trim()}
              onClick={() =>
                onSaveVersion({
                  ...selected,
                  id: undefined,
                  title:
                    selected.id === 'blank' ? '' : `${selected.title.slice(0, 78)} — my version`,
                  template: preview,
                  variables: [],
                })
              }
            >
              <Icon name="Bookmark" size={16} />
              Save as prompt
            </button>
            <button
              className="icon-button download-preview"
              aria-label="Download customized prompt"
              title="Download as text"
              disabled={!preview.trim()}
              onClick={() => onDownload(preview, selected.title)}
            >
              <Icon name="Download" size={18} />
            </button>
          </div>
          <div className="try-tool">
            <div>
              <span>Take it for a spin</span>
              <p>Copy it, open your tool, and see what happens.</p>
            </div>
            <div>
              <select
                aria-label="Choose an AI tool"
                value={currentTool}
                onChange={(event) => setTool(event.target.value)}
              >
                {selected.tools.map((name) => (
                  <option key={name}>{name}</option>
                ))}
              </select>
              <a
                className={`tool-launch ${!preview.trim() ? 'disabled' : ''}`}
                href={toolUrl}
                target="_blank"
                rel="noopener noreferrer"
                onClick={(event) => {
                  if (!preview.trim()) event.preventDefault();
                  else
                    onCopyText(preview, `Prompt copied. Paste it into ${currentTool} to try it.`);
                }}
                aria-label={`Copy prompt and open ${currentTool}`}
              >
                <Icon name="ArrowUpRight" size={19} />
              </a>
            </div>
          </div>
        </section>
      </div>
      <div className="playground-disclaimer">
        <Icon name="Info" size={17} />
        <p>
          A space to build prompts, not run AI models. Your edits stay in this browser. Copy your
          prompt into an external AI tool to generate a result — its account requirements and usage
          limits apply.
        </p>
      </div>
      <section className="prompting-tips">
        <div className="section-heading">
          <div>
            <div className="section-eyebrow">GOOD PROMPTS ARE A LITTLE MORE INTENTIONAL</div>
            <h2>Make every word work.</h2>
          </div>
          <Icon name="Lightbulb" size={24} strokeWidth={1.3} />
        </div>
        <div className="prompting-tip-grid">
          <div>
            <span>01</span>
            <h3>Give it a role.</h3>
            <p>“Act as a patient tutor” gets you closer than “help me learn.”</p>
          </div>
          <div>
            <span>02</span>
            <h3>Add the right context.</h3>
            <p>Tell it who it’s for, what matters, and what to leave out.</p>
          </div>
          <div>
            <span>03</span>
            <h3>Describe the result.</h3>
            <p>A format, a length, or a clear example gives your idea direction.</p>
          </div>
          <div>
            <span>04</span>
            <h3>Change one thing.</h3>
            <p>Try, review, refine. The second version is often where the magic is.</p>
          </div>
        </div>
      </section>
    </div>
  );
}
