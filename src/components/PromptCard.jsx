import { categoryMap } from '../data/categories.js';
import Icon from './Icon.jsx';

export function PromptVisual({ prompt }) {
  const category = categoryMap[prompt.category];
  if (prompt.image)
    return <img src={prompt.image} alt="" loading="lazy" className="prompt-image" />;
  if (prompt.category === 'coding')
    return (
      <div className="visual visual-code" aria-hidden="true">
        <div className="code-window">
          <div className="code-window-bar">
            <i />
            <i />
            <i />
            <span>something-brilliant.jsx</span>
          </div>
          <div className="code-lines">
            <p>
              <span className="code-purple">const</span>{' '}
              <span className="code-blue">yourNextIdea</span> = (){' '}
              <span className="code-purple">=&gt;</span> {'{'}
            </p>
            <p>
              &nbsp;&nbsp;<span className="code-purple">return</span> (
            </p>
            <p>
              &nbsp;&nbsp;&nbsp;&nbsp;&lt;<span className="code-green">SomethingBrilliant</span>
            </p>
            <p>
              &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; <span className="code-blue">possibilities</span>=
              {'{'}
              <span className="code-orange">Infinity</span>
              {'}'}
            </p>
            <p>&nbsp;&nbsp;&nbsp;&nbsp;/&gt;</p>
            <p>&nbsp;&nbsp;);</p>
          </div>
        </div>
      </div>
    );
  if (prompt.category === 'productivity')
    return (
      <div className="visual visual-productivity" aria-hidden="true">
        <div className="mini-planner">
          <div className="mini-planner-heading">
            <span>A little more focus.</span>
            <Icon name="Sun" size={14} />
          </div>
          <div className="planner-days">
            <span>MON</span>
            <span>TUE</span>
            <span>WED</span>
            <span>THU</span>
            <span>FRI</span>
          </div>
          <div className="planner-blocks">
            <i />
            <i />
            <i />
            <i />
            <i />
            <i />
            <i />
            <i />
          </div>
          <div className="planner-check">
            <Icon name="Check" size={13} />
            <span>Make room for what matters</span>
          </div>
        </div>
      </div>
    );
  if (prompt.category === 'education')
    return (
      <div className="visual visual-education" aria-hidden="true">
        <div className="education-orbits">
          <i />
          <i />
          <i />
          <span>
            <Icon name="Sparkles" size={34} strokeWidth={1.3} />
          </span>
          <b />
          <b />
        </div>
        <div className="visual-caption">Curiosity looks good on you.</div>
      </div>
    );
  if (prompt.category === 'research')
    return (
      <div className="visual visual-research" aria-hidden="true">
        <div className="research-paper">
          <div className="research-paper-title">
            <Icon name="FlaskConical" size={15} />
            <span>Follow the evidence.</span>
          </div>
          <div className="paper-line" />
          <div className="paper-line short" />
          <div className="paper-chart">
            {[26, 42, 35, 61, 53, 76, 89].map((height, i) => (
              <i key={i} style={{ height: `${height}%` }} />
            ))}
          </div>
          <div className="paper-line" />
        </div>
        <div className="research-stamp">
          <Icon name="Check" size={16} />
        </div>
      </div>
    );
  if (prompt.category === 'automation')
    return (
      <div className="visual visual-automation" aria-hidden="true">
        <div className="flow-node flow-first">
          <Icon name="Zap" size={22} />
        </div>
        <div className="flow-connector">
          <i />
          <i />
          <i />
        </div>
        <div className="flow-node flow-second">
          <Icon name="Settings2" size={23} />
        </div>
        <div className="flow-connector">
          <i />
          <i />
          <i />
        </div>
        <div className="flow-node flow-last">
          <Icon name="CheckCheck" size={24} />
        </div>
        <div className="visual-caption">Less doing. More done.</div>
      </div>
    );
  if (prompt.category === 'writing')
    return (
      <div className="visual visual-writing" aria-hidden="true">
        <div className="writing-page">
          <span className="writing-quotes">“</span>
          <p>
            And then,
            <br />
            <em>
              an idea became
              <br />a story.
            </em>
          </p>
          <div className="writing-line" />
        </div>
        <Icon name="PenLine" size={42} strokeWidth={1} className="writing-pen" />
      </div>
    );
  if (prompt.category === 'marketing')
    return (
      <div className="visual visual-marketing" aria-hidden="true">
        <div className="marketing-type">
          Make a<br />
          <em>little noise.</em>
          <span>
            <Icon name="ArrowUpRight" size={30} strokeWidth={1.4} />
          </span>
        </div>
        <div className="marketing-spark">
          <Icon name="Sparkles" size={40} strokeWidth={1} />
        </div>
      </div>
    );
  return (
    <div className={`visual visual-${prompt.category}`} aria-hidden="true">
      <Icon name={category.icon} size={52} strokeWidth={1} />
      <div className="visual-caption">A new idea starts here.</div>
    </div>
  );
}

export default function PromptCard({
  prompt,
  saved,
  onSave,
  onOpen,
  onCopy,
  onCustomize,
  list = false,
}) {
  const category = categoryMap[prompt.category];
  return (
    <article
      className={`prompt-card ${list ? 'prompt-card-list' : ''}`}
      style={{ '--category-color': category.color }}
    >
      <div className="prompt-visual-wrap">
        <button
          className="visual-open"
          onClick={() => onOpen(prompt)}
          aria-label={`View ${prompt.title}`}
          tabIndex={-1}
        >
          <PromptVisual prompt={prompt} />
        </button>
        <span className="category-badge">
          <Icon name={category.icon} size={13} />
          {category.short}
        </span>
        <button
          className={`bookmark-button ${saved ? 'saved' : ''}`}
          onClick={() => onSave(prompt.id)}
          aria-label={`${saved ? 'Unsave' : 'Save'} ${prompt.title}`}
          aria-pressed={saved}
        >
          <Icon name="Bookmark" size={16} fill={saved ? 'currentColor' : 'none'} />
        </button>
      </div>
      <div className="prompt-card-body">
        <div className="prompt-card-title-row">
          <h3 className="prompt-card-heading">
            <button className="prompt-title-button" onClick={() => onOpen(prompt)}>
              {prompt.title}
            </button>
          </h3>
          {prompt.custom && <span className="personal-badge">Yours</span>}
        </div>
        <p className="prompt-description">{prompt.description}</p>
        <div className="prompt-tags">
          {prompt.tags.slice(0, 2).map((tag) => (
            <span key={tag}>{tag}</span>
          ))}
        </div>
        <footer className="prompt-card-footer">
          <span className="tool-label">
            <span className={`tool-dot tool-dot-${prompt.category}`} />
            <span>{prompt.tools[0]}</span>
            {prompt.tools.length > 1 && <small>+{prompt.tools.length - 1}</small>}
          </span>
          <div className="card-actions">
            <button
              className="icon-button copy-card"
              onClick={() => onCopy(prompt)}
              aria-label={`Copy ${prompt.title}`}
              title="Copy prompt"
            >
              <Icon name="Copy" size={16} />
            </button>
            <button className="use-prompt" onClick={() => onCustomize(prompt)}>
              Use prompt <Icon name="ArrowUpRight" size={14} />
            </button>
          </div>
        </footer>
      </div>
    </article>
  );
}
