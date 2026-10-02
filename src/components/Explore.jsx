import { useEffect, useRef, useState } from 'react';
import { categories, categoryMap, tools } from '../data/categories.js';
import { filterPrompts } from '../lib/vault.js';
import Icon from './Icon.jsx';
import PromptCard from './PromptCard.jsx';

export function EmptyState({ icon = 'Search', title, description, action, actionLabel }) {
  return (
    <div className="empty-state">
      <div className="empty-icon">
        <Icon name={icon} size={28} strokeWidth={1.4} />
      </div>
      <h3>{title}</h3>
      <p>{description}</p>
      {action && (
        <button className="button button-secondary" onClick={action}>
          {actionLabel}
          <Icon name="ArrowRight" size={15} />
        </button>
      )}
    </div>
  );
}

export default function Explore({
  prompts,
  category,
  query,
  onCategory,
  favorites,
  onSave,
  onOpen,
  onCopy,
  onCustomize,
  onRandom,
  onAdd,
  navigate,
}) {
  const [tool, setTool] = useState('all');
  const [sort, setSort] = useState('recommended');
  const [layout, setLayout] = useState('grid');
  const [featured, setFeatured] = useState(false);
  const [limit, setLimit] = useState(9);
  const libraryRef = useRef(null);
  const activeCategory = categoryMap[category];
  const results = filterPrompts(prompts, { query, category, tool, sort, featured });
  const filtered = Boolean(query || category !== 'all' || tool !== 'all' || featured);
  useEffect(() => setLimit(9), [query, category, tool, sort, featured]);

  function resetFilters() {
    setTool('all');
    setFeatured(false);
    onCategory('all', true);
  }

  return (
    <>
      {!query && (
        <>
          <section className="hero">
            <img className="hero-art" src="/images/vault-hero.jpg" alt="" fetchPriority="high" />
            <div className="hero-content">
              <div className="hero-eyebrow">
                <span>
                  <Icon name="Sparkles" size={13} />
                </span>{' '}
                A LITTLE INSPIRATION. A LOT OF POSSIBILITY.
              </div>
              <h1>
                A little prompt.
                <br />
                <span>Limitless possibility.</span>
              </h1>
              <p>
                A growing vault of ideas for whatever’s next.
                <br className="desktop-break" /> Create, code, learn, and make something uniquely
                yours.
              </p>
              <div className="hero-actions">
                <button
                  className="button button-light"
                  onClick={() =>
                    libraryRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
                  }
                >
                  Explore prompts <Icon name="ArrowDown" size={16} />
                </button>
                <button className="hero-secondary" onClick={onRandom}>
                  <Icon name="Sparkles" size={15} />
                  Surprise me
                </button>
              </div>
              <div className="hero-bottom">
                <span>
                  <i />
                  {prompts.length} ready-to-use prompts
                </span>
                <span className="hero-divider" />
                <span>Made for curious minds</span>
              </div>
            </div>
            <span className="hero-floating-label">
              <span className="live-dot" />
              YOUR IDEAS, UNLOCKED.
            </span>
          </section>

          <section className="quick-paths" aria-label="Quick ways to explore">
            <div className="quick-path-intro">
              <Icon name="Sparkles" size={20} />
              <span>
                Where will your
                <br />
                <strong>curiosity take you?</strong>
              </span>
            </div>
            <button onClick={() => onCategory('image')}>
              <Icon name="Image" size={21} style={{ color: '#bd9aff' }} />
              <span>
                Make something visual<small>Images & imagination</small>
              </span>
              <Icon name="ArrowUpRight" size={17} />
            </button>
            <button onClick={() => onCategory('coding')}>
              <Icon name="Code2" size={21} style={{ color: '#85cbe9' }} />
              <span>
                Build something brilliant<small>Code & creative problem-solving</small>
              </span>
              <Icon name="ArrowUpRight" size={17} />
            </button>
            <button onClick={() => onCategory('productivity')}>
              <Icon name="Zap" size={21} style={{ color: '#d4d982' }} />
              <span>
                Make room for more<small>Focus & everyday productivity</small>
              </span>
              <Icon name="ArrowUpRight" size={17} />
            </button>
          </section>
        </>
      )}

      <section className="library-section" ref={libraryRef}>
        <div className="section-heading">
          <div>
            <div className="section-eyebrow">GOOD IDEAS LIVE HERE</div>
            <h2>
              {query
                ? 'A little search, a new possibility.'
                : activeCategory
                  ? activeCategory.name
                  : 'Explore the vault'}
              <span className="count-badge">{results.length}</span>
            </h2>
            <p>
              {query
                ? `Prompts matching “${query}”`
                : activeCategory
                  ? activeCategory.description
                  : 'Handpicked prompts. A head start for your next big thing.'}
            </p>
          </div>
          <div className="section-heading-actions">
            <button
              className={`featured-toggle ${featured ? 'selected' : ''}`}
              aria-pressed={featured}
              onClick={() => setFeatured(!featured)}
            >
              <Icon name="Star" size={14} fill={featured ? 'currentColor' : 'none'} />
              Handpicked
            </button>
            <div className="view-toggle" aria-label="Prompt layout">
              <button
                className={layout === 'grid' ? 'active' : ''}
                aria-pressed={layout === 'grid'}
                aria-label="Grid view"
                onClick={() => setLayout('grid')}
              >
                <Icon name="Grid2X2" size={16} />
              </button>
              <button
                className={layout === 'list' ? 'active' : ''}
                aria-pressed={layout === 'list'}
                aria-label="List view"
                onClick={() => setLayout('list')}
              >
                <Icon name="LayoutList" size={17} />
              </button>
            </div>
          </div>
        </div>
        <div className="category-pills" aria-label="Filter by category">
          <button
            className={`category-pill ${category === 'all' ? 'active' : ''}`}
            aria-pressed={category === 'all'}
            onClick={() => onCategory('all')}
          >
            <Icon name="Grid2X2" size={14} />
            All prompts
          </button>
          {categories.map((item) => (
            <button
              key={item.id}
              className={`category-pill ${category === item.id ? 'active' : ''}`}
              aria-pressed={category === item.id}
              onClick={() => onCategory(item.id)}
            >
              <Icon name={item.icon} size={14} />
              {item.short}
            </button>
          ))}
        </div>
        <div className="library-toolbar">
          <div className="result-label">
            <span className="live-dot" />
            {results.length} {results.length === 1 ? 'prompt' : 'prompts'} to get you started{' '}
            {filtered && (
              <button onClick={resetFilters}>
                Clear filters <Icon name="X" size={12} />
              </button>
            )}
          </div>
          <div className="filter-controls">
            <label className="select-control">
              <Icon name="SlidersHorizontal" size={14} />
              <span className="sr-only">Filter by AI tool</span>
              <select
                aria-label="Filter by AI tool"
                value={tool}
                onChange={(event) => setTool(event.target.value)}
              >
                <option value="all">All AI tools</option>
                {tools.map((item) => (
                  <option key={item.name}>{item.name}</option>
                ))}
              </select>
              <Icon name="ChevronDown" size={12} />
            </label>
            <label className="select-control sort-control">
              <span className="sort-prefix">Sort:</span>
              <span className="sr-only">Sort prompts</span>
              <select
                aria-label="Sort prompts"
                value={sort}
                onChange={(event) => setSort(event.target.value)}
              >
                <option value="recommended">Recommended</option>
                <option value="newest">Newest first</option>
                <option value="az">A–Z</option>
              </select>
              <Icon name="ChevronDown" size={12} />
            </label>
          </div>
        </div>
        {results.length ? (
          <>
            <div className={`prompt-grid ${layout === 'list' ? 'prompt-list' : ''}`}>
              {results.slice(0, limit).map((prompt) => (
                <PromptCard
                  key={prompt.id}
                  prompt={prompt}
                  saved={favorites.includes(prompt.id)}
                  onSave={onSave}
                  onOpen={onOpen}
                  onCopy={onCopy}
                  onCustomize={onCustomize}
                  list={layout === 'list'}
                />
              ))}
            </div>
            {results.length > limit && (
              <div className="load-more">
                <button className="button button-secondary" onClick={() => setLimit(limit + 9)}>
                  A little more inspiration <Icon name="ArrowDown" size={16} />
                </button>
                <span>
                  Showing {Math.min(limit, results.length)} of {results.length} prompts
                </span>
              </div>
            )}
          </>
        ) : (
          <EmptyState
            title="No sparks here just yet."
            description="Try a different search, pick another category, or clear your filters. Your next idea is out there."
            action={resetFilters}
            actionLabel="Explore all prompts"
          />
        )}
      </section>
      <section className="contribute-banner">
        <div className="contribute-icon">
          <Icon name="Lightbulb" size={27} strokeWidth={1.3} />
        </div>
        <div>
          <h3>Found a prompt that works like magic?</h3>
          <p>Give it a home in your vault. Great ideas deserve to be kept.</p>
        </div>
        <button className="button button-secondary" onClick={onAdd}>
          Add your own prompt <Icon name="Plus" size={15} />
        </button>
      </section>
      <footer className="page-footer">
        <span>
          <Icon name="Sparkles" size={13} />
          Built for a little more possibility.
        </span>
        <button onClick={() => navigate('playground')}>
          Your next idea starts here <Icon name="ArrowUpRight" size={13} />
        </button>
      </footer>
    </>
  );
}
