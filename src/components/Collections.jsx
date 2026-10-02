import { categoryMap } from '../data/categories.js';
import { curatedCollections } from '../data/prompts.js';
import Icon from './Icon.jsx';
import PromptCard, { PromptVisual } from './PromptCard.jsx';
import { EmptyState } from './Explore.jsx';

function CollectionCard({ collection, prompts, onOpen, onEdit }) {
  const items = collection.ids
    .map((id) => prompts.find((prompt) => prompt.id === id))
    .filter(Boolean);
  return (
    <article className="collection-card" style={{ '--collection-color': collection.color }}>
      <button className="collection-card-main" onClick={() => onOpen(collection.id)}>
        <div className={`collection-art ${items.length ? '' : 'collection-art-empty'}`}>
          {items.length ? (
            <div className="collection-mini-grid">
              {items.slice(0, 3).map((prompt) => (
                <div
                  key={prompt.id}
                  className="collection-mini"
                  style={{ '--category-color': categoryMap[prompt.category].color }}
                >
                  <PromptVisual prompt={prompt} />
                </div>
              ))}
              {items.length === 1 && (
                <div className="collection-mini empty-mini">
                  <Icon name="Sparkles" size={34} />
                </div>
              )}
            </div>
          ) : (
            <div className="empty-collection-art">
              <div />
              <div />
              <div>
                <Icon name={collection.icon || 'Folder'} size={32} strokeWidth={1.2} />
              </div>
            </div>
          )}
          <span className="collection-art-label">
            <Icon name={collection.icon || 'Folder'} size={14} />
            {collection.curated
              ? 'CURATED FOR YOU'
              : collection.id === 'favorites'
                ? 'YOUR FAVORITES'
                : 'YOUR COLLECTION'}
          </span>
          <span className="collection-count">
            {items.length} {items.length === 1 ? 'prompt' : 'prompts'}
          </span>
        </div>
        <div className="collection-card-text">
          <h3>
            {collection.name}
            <Icon name="ArrowUpRight" size={17} />
          </h3>
          <p>{collection.description || 'A little home for your next great ideas.'}</p>
          <span>
            {items.length
              ? [...new Set(items.map((prompt) => categoryMap[prompt.category].short))]
                  .slice(0, 3)
                  .join(' · ')
              : 'Ready for a little inspiration'}
          </span>
        </div>
      </button>
      {onEdit && (
        <button
          className="icon-button collection-edit"
          aria-label={`Edit ${collection.name}`}
          onClick={() => onEdit(collection)}
        >
          <Icon name="Pencil" size={14} />
        </button>
      )}
    </article>
  );
}

export default function Collections({
  prompts,
  favorites,
  collections,
  collectionId,
  onOpenCollection,
  navigate,
  onCreate,
  onEdit,
  onDelete,
  onSave,
  onOpenPrompt,
  onCopy,
  onCustomize,
  onExport,
  onRemove,
}) {
  const favoriteCollection = {
    id: 'favorites',
    name: 'Saved for later',
    description: 'Little sparks you don’t want to lose. Your favorite prompts, all in one place.',
    ids: favorites,
    color: '#c3aaf5',
    icon: 'Bookmark',
  };
  const allCollections = [
    favoriteCollection,
    ...collections,
    ...curatedCollections.map((item) => ({ ...item, curated: true })),
  ];
  const collection = collectionId ? allCollections.find((item) => item.id === collectionId) : null;
  const items =
    collection?.ids.map((id) => prompts.find((prompt) => prompt.id === id)).filter(Boolean) || [];
  const myCollections = [favoriteCollection, ...collections];
  if (collectionId && !collection)
    return (
      <div className="collections-page">
        <EmptyState
          icon="Folder"
          title="This collection has wandered off."
          description="It might have been removed. Let’s find your other ideas."
          action={() => navigate('collections')}
          actionLabel="Back to collections"
        />
      </div>
    );
  if (collection)
    return (
      <div className="collections-page">
        <button className="back-link" onClick={() => navigate('collections')}>
          <Icon name="ArrowLeft" size={16} />
          All collections
        </button>
        <div className="collection-detail-header">
          <div
            className="collection-heading-icon"
            style={{ color: collection.color, background: `${collection.color}15` }}
          >
            <Icon name={collection.icon} size={29} />
          </div>
          <div className="page-title-block">
            <div className="section-eyebrow">
              {collection.curated ? 'HANDPICKED FOR CURIOUS MINDS' : 'YOUR INSPIRATION, TOGETHER'}
            </div>
            <h1>
              {collection.name}
              <span className="count-badge">{items.length}</span>
            </h1>
            <p>{collection.description || 'A little home for your next great ideas.'}</p>
          </div>
        </div>
        <div className="collection-detail-toolbar">
          <span>
            {items.length} {items.length === 1 ? 'prompt' : 'prompts'} ·{' '}
            {[...new Set(items.map((item) => item.category))].length} categories
          </span>
          <div>
            {!collection.curated && collection.id !== 'favorites' && (
              <>
                <button
                  className="button button-secondary button-small"
                  onClick={() => onEdit(collection)}
                >
                  <Icon name="Pencil" size={14} />
                  Edit collection
                </button>
                <button
                  className="icon-button text-danger"
                  aria-label="Delete collection"
                  title="Delete collection"
                  onClick={() => onDelete(collection)}
                >
                  <Icon name="Trash2" size={16} />
                </button>
              </>
            )}
            <button
              className="button button-secondary button-small"
              disabled={!items.length}
              onClick={() => onExport(collection, items)}
            >
              <Icon name="Download" size={14} />
              Export prompts
            </button>
            {!collection.curated && (
              <button
                className="button button-primary button-small"
                onClick={() => navigate('explore')}
              >
                <Icon name="Plus" size={14} />
                Find more sparks
              </button>
            )}
          </div>
        </div>
        {items.length ? (
          <div className="prompt-grid">
            {items.map((prompt) => (
              <div className="collection-prompt-wrap" key={prompt.id}>
                <PromptCard
                  prompt={prompt}
                  saved={favorites.includes(prompt.id)}
                  onSave={onSave}
                  onOpen={onOpenPrompt}
                  onCopy={onCopy}
                  onCustomize={onCustomize}
                />
                {!collection.curated && collection.id !== 'favorites' && (
                  <button
                    className="remove-from-collection"
                    onClick={() => onRemove(collection.id, prompt.id)}
                  >
                    <Icon name="X" size={12} />
                    Remove from collection
                  </button>
                )}
              </div>
            ))}
          </div>
        ) : (
          <EmptyState
            icon={collection.id === 'favorites' ? 'Bookmark' : 'FolderPlus'}
            title="An empty space for your next big thing."
            description={
              collection.id === 'favorites'
                ? 'Tap the bookmark on any prompt to keep it here. A little inspiration is worth saving.'
                : 'Open a prompt and choose “Add to a collection” to gather your ideas here.'
            }
            action={() => navigate('explore')}
            actionLabel="Find your first prompt"
          />
        )}
      </div>
    );

  return (
    <div className="collections-page">
      <div className="page-title-block title-with-action">
        <div>
          <div className="section-eyebrow">KEEP YOUR INSPIRATION CLOSE</div>
          <h1>
            A home for your ideas<span className="accent-dot">.</span>
          </h1>
          <p>Your favorite prompts, gathered into little worlds of possibility.</p>
        </div>
        <button className="button button-primary" onClick={() => onCreate()}>
          <Icon name="FolderPlus" size={17} />
          New collection
        </button>
      </div>
      <section className="my-collections">
        <div className="section-heading">
          <div>
            <h2>
              Your collections<span className="count-badge">{myCollections.length}</span>
            </h2>
            <p>Saved in this browser. Always ready when inspiration strikes.</p>
          </div>
          <Icon name="FolderHeart" size={22} className="muted-icon" />
        </div>
        <div className="collection-grid">
          {myCollections.map((item) => (
            <CollectionCard
              key={item.id}
              collection={item}
              prompts={prompts}
              onOpen={onOpenCollection}
              onEdit={item.id !== 'favorites' ? onEdit : undefined}
            />
          ))}
          <button className="new-collection-card" onClick={() => onCreate()}>
            <span>
              <Icon name="Plus" size={26} strokeWidth={1.4} />
            </span>
            <h3>Room for another idea.</h3>
            <p>
              Create a collection for your next
              <br />
              project, interest, or little obsession.
            </p>
            <span className="new-collection-label">
              Create a collection <Icon name="ArrowRight" size={14} />
            </span>
          </button>
        </div>
      </section>
      <section className="curated-collections">
        <div className="section-heading">
          <div>
            <div className="section-eyebrow">A FEW GOOD PLACES TO START</div>
            <h2>Collected for the curious.</h2>
            <p>Thoughtful little bundles to get your ideas moving.</p>
          </div>
          <span className="curated-label">
            <Icon name="Sparkles" size={14} />
            HANDPICKED
          </span>
        </div>
        <div className="collection-grid">
          {curatedCollections.map((item) => (
            <CollectionCard
              key={item.id}
              collection={{ ...item, curated: true }}
              prompts={prompts}
              onOpen={onOpenCollection}
            />
          ))}
        </div>
      </section>
      <div className="local-notice">
        <Icon name="Info" size={17} />
        <span>
          Your collections stay on this device. Export your vault from “A little help & tips” to
          back it up or move it to another browser.
        </span>
      </div>
    </div>
  );
}
