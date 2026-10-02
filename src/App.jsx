import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { categories, categoryMap } from './data/categories.js';
import { prompts as catalog } from './data/prompts.js';
import {
  copyToClipboard,
  downloadFile,
  examplePrompt,
  isValidPrompt,
  loadState,
  mergeBackup,
  normalizePrompt,
  STORAGE_KEY,
  validateBackup,
} from './lib/vault.js';
import { Header, Sidebar } from './components/Layout.jsx';
import Explore from './components/Explore.jsx';
import Collections from './components/Collections.jsx';
import Playground, { createDraft } from './components/Playground.jsx';
import {
  CollectionForm,
  CollectionPicker,
  ConfirmDialog,
  HelpDialog,
  PromptDetail,
  PromptForm,
} from './components/Dialogs.jsx';
import Icon from './components/Icon.jsx';

function readRoute() {
  const [page, parameter] = window.location.hash.replace(/^#\/?/, '').split('/');
  return {
    page: ['explore', 'collections', 'playground'].includes(page) ? page : 'explore',
    category: page === 'explore' && Object.hasOwn(categoryMap, parameter) ? parameter : 'all',
    collectionId: page === 'collections' && parameter ? parameter : null,
  };
}

const slug = (text) =>
  text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '') || 'my-prompt';

export default function App() {
  const [vault, setVault] = useState(loadState);
  const [route, setRoute] = useState(readRoute);
  const [query, setQuery] = useState('');
  const [modal, setModal] = useState(null);
  const [toast, setToast] = useState(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const searchRef = useRef(null);
  const modalTrigger = useRef(null);
  const toastTimer = useRef(null);
  const storageWarning = useRef(false);
  const allPrompts = useMemo(
    () => [...vault.customPrompts.slice().reverse(), ...catalog],
    [vault.customPrompts],
  );
  const validIds = useMemo(() => new Set(allPrompts.map((prompt) => prompt.id)), [allPrompts]);
  const favorites = useMemo(
    () => vault.favorites.filter((id) => validIds.has(id)),
    [vault.favorites, validIds],
  );
  const countByCategory = useMemo(
    () =>
      Object.fromEntries(
        categories.map((category) => [
          category.id,
          allPrompts.filter((prompt) => prompt.category === category.id).length,
        ]),
      ),
    [allPrompts],
  );

  const notify = useCallback((message, kind = 'success') => {
    clearTimeout(toastTimer.current);
    setToast({ message, kind, id: Date.now() });
    toastTimer.current = setTimeout(() => setToast(null), 4200);
  }, []);

  const showModal = useCallback((next) => {
    const active = document.activeElement;
    if (next && active && !active.closest('[role="dialog"]')) {
      modalTrigger.current =
        active.closest('.sidebar') && window.matchMedia('(max-width: 800px)').matches
          ? document.querySelector('.mobile-menu')
          : active;
    }
    setModal(next);
  }, []);
  const closeModal = useCallback(() => setModal(null), []);
  useEffect(() => {
    if (modal || !modalTrigger.current) return;
    const previous = modalTrigger.current;
    modalTrigger.current = null;
    if (previous.isConnected && !previous.closest('[inert]'))
      previous.focus({ preventScroll: true });
    else document.getElementById('main-content')?.focus({ preventScroll: true });
  }, [modal]);
  const navigate = useCallback((page, options = {}, clearSearch = true) => {
    const next = {
      page,
      category: options.category || 'all',
      collectionId: options.collectionId || null,
    };
    const hash = `#/${page}${page === 'explore' && next.category !== 'all' ? `/${next.category}` : page === 'collections' && next.collectionId ? `/${next.collectionId}` : ''}`;
    setRoute(next);
    if (window.location.hash !== hash) window.location.hash = hash;
    if (clearSearch) setQuery('');
    setMobileOpen(false);
  }, []);

  useEffect(() => {
    const onHashChange = () => {
      setRoute(readRoute());
      setMobileOpen(false);
    };
    window.addEventListener('hashchange', onHashChange);
    return () => {
      window.removeEventListener('hashchange', onHashChange);
      clearTimeout(toastTimer.current);
    };
  }, []);

  useEffect(() => {
    document.title = `${route.page === 'explore' ? 'Explore' : route.page === 'collections' ? 'My collections' : 'Playground'} — AI Prompt Vault`;
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, [route.page, route.collectionId]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(vault));
      storageWarning.current = false;
    } catch {
      if (!storageWarning.current) {
        notify(
          'Browser storage is unavailable or full. Export your vault to keep your changes safe.',
          'error',
        );
        storageWarning.current = true;
      }
    }
  }, [vault, notify]);

  useEffect(() => {
    const handleKey = (event) => {
      if (
        (event.metaKey || event.ctrlKey) &&
        event.key.toLowerCase() === 'k' &&
        !modal &&
        !mobileOpen
      ) {
        event.preventDefault();
        searchRef.current?.focus();
        searchRef.current?.select();
      }
      if (event.key === 'Escape') setMobileOpen(false);
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [modal, mobileOpen]);

  useEffect(() => {
    if (!mobileOpen) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = previous;
    };
  }, [mobileOpen]);

  function toggleFavorite(id) {
    const isSaved = vault.favorites.includes(id);
    setVault((current) => ({
      ...current,
      favorites: current.favorites.includes(id)
        ? current.favorites.filter((item) => item !== id)
        : [...current.favorites, id],
    }));
    notify(isSaved ? 'Removed from Saved for later.' : 'A little inspiration, saved for later.');
  }

  function toggleCollection(collectionId, promptId) {
    setVault((current) => ({
      ...current,
      collections: current.collections.map((collection) =>
        collection.id === collectionId
          ? {
              ...collection,
              ids: collection.ids.includes(promptId)
                ? collection.ids.filter((id) => id !== promptId)
                : [...collection.ids, promptId],
            }
          : collection,
      ),
    }));
  }

  async function copyText(text, message = 'Prompt copied. Your next idea is ready to go.') {
    try {
      await copyToClipboard(text);
      notify(message);
    } catch (error) {
      notify(error.message, 'error');
    }
  }

  function copyPrompt(prompt, text) {
    return copyText(text || examplePrompt(prompt));
  }
  function customize(prompt) {
    setVault((current) => ({ ...current, playground: createDraft(prompt) }));
    closeModal();
    navigate('playground');
  }
  function openPrompt(prompt) {
    showModal({ type: 'detail', prompt });
  }
  function downloadPrompt(prompt) {
    downloadFile(
      `${slug(prompt.title)}.txt`,
      `${prompt.title}\n${'—'.repeat(40)}\n\n${examplePrompt(prompt)}\n\nAI Prompt Vault · ${categoryMap[prompt.category].name}\n`,
    );
    notify('Prompt downloaded. Take your idea anywhere.');
  }
  function downloadText(text, title) {
    downloadFile(`${slug(title)}.txt`, text);
    notify('Your customized prompt is downloaded.');
  }

  function submitPrompt(prompt) {
    if (!isValidPrompt(prompt))
      return notify('Please check the prompt fields before saving.', 'error');
    const normalized = normalizePrompt(prompt);
    const editing = modal?.editing;
    if (!editing && vault.customPrompts.length >= 1000)
      return notify(
        'Your personal vault supports up to 1,000 prompts. Export a backup or edit an existing prompt.',
        'error',
      );
    setVault((current) => ({
      ...current,
      customPrompts: editing
        ? current.customPrompts.map((item) => (item.id === normalized.id ? normalized : item))
        : [...current.customPrompts, normalized],
      playground:
        current.playground?.promptId === normalized.id
          ? createDraft(normalized)
          : current.playground,
    }));
    closeModal();
    notify(
      editing
        ? 'Your prompt has a little more polish.'
        : 'Your idea has a home. Added to your vault.',
    );
    if (!editing) navigate('explore', { category: normalized.category });
  }

  function submitCollection(collection) {
    const promptId = modal?.promptId;
    const isEditing = Boolean(modal?.initial);
    if (!isEditing && vault.collections.length >= 200)
      return notify(
        'Your vault supports up to 200 personal collections. Reuse an existing one or export a backup.',
        'error',
      );
    if (promptId && !collection.ids.includes(promptId))
      collection = { ...collection, ids: [...collection.ids, promptId] };
    setVault((current) => ({
      ...current,
      collections: isEditing
        ? current.collections.map((item) => (item.id === collection.id ? collection : item))
        : [...current.collections, collection],
    }));
    closeModal();
    notify(isEditing ? 'Collection updated.' : 'A new home for your ideas. Collection created.');
  }

  function deletePrompt(prompt) {
    showModal({
      type: 'confirm',
      title: 'Let this idea go?',
      description: `“${prompt.title}” will be removed from your vault and any saved collections. This cannot be undone.`,
      onConfirm: () => {
        setVault((current) => ({
          ...current,
          customPrompts: current.customPrompts.filter((item) => item.id !== prompt.id),
          favorites: current.favorites.filter((id) => id !== prompt.id),
          collections: current.collections.map((item) => ({
            ...item,
            ids: item.ids.filter((id) => id !== prompt.id),
          })),
          playground: current.playground?.promptId === prompt.id ? null : current.playground,
        }));
        closeModal();
        notify('Personal prompt removed.');
      },
    });
  }

  function deleteCollection(collection) {
    showModal({
      type: 'confirm',
      title: 'Remove this collection?',
      description: `“${collection.name}” will be deleted. The prompts inside it will stay in your vault.`,
      onConfirm: () => {
        setVault((current) => ({
          ...current,
          collections: current.collections.filter((item) => item.id !== collection.id),
        }));
        closeModal();
        navigate('collections');
        notify('Collection removed. Your prompts are safe.');
      },
    });
  }

  function exportCollection(collection, items) {
    const content = `# ${collection.name}\n\n${collection.description}\n\n${items.map((prompt) => `## ${prompt.title}\n\n${prompt.description}\n\n\`\`\`text\n${examplePrompt(prompt)}\n\`\`\`\n\nCompatible tools: ${prompt.tools.join(', ')}\n`).join('\n---\n\n')}\nExported from AI Prompt Vault.\n`;
    downloadFile(`${slug(collection.name)}.md`, content, 'text/markdown');
    notify('Collection exported as Markdown.');
  }

  function exportVault() {
    downloadFile(
      `prompt-vault-backup-${new Date().toISOString().slice(0, 10)}.json`,
      JSON.stringify({ ...vault, playground: null }, null, 2),
      'application/json',
    );
    notify('Your vault backup is downloaded. Keep it somewhere safe.');
  }
  async function importVault(data) {
    const incoming = validateBackup(data);
    const merged = mergeBackup(vault, incoming);
    if (merged.customPrompts.length > 1000 || merged.collections.length > 200)
      throw new Error('This import would exceed the supported vault size. Nothing was changed.');
    setVault(merged);
    notify('Backup imported. Your existing ideas are still here.');
  }

  function onCategory(category, clear = false) {
    navigate('explore', { category }, clear);
  }

  return (
    <div className="app-shell">
      <a
        className="skip-link"
        inert={Boolean(modal) || mobileOpen}
        href="#main-content"
        onClick={(event) => {
          event.preventDefault();
          document.getElementById('main-content')?.focus();
        }}
      >
        Skip to content
      </a>
      <Sidebar
        route={route}
        navigate={navigate}
        countByCategory={countByCategory}
        favoritesCount={favorites.length}
        total={allPrompts.length}
        onHelp={() => showModal({ type: 'help' })}
        mobileOpen={mobileOpen}
        modalOpen={Boolean(modal)}
        onMobileClose={() => setMobileOpen(false)}
      />
      <div
        className="main-shell"
        inert={Boolean(modal) || mobileOpen}
        aria-hidden={modal || mobileOpen ? true : undefined}
      >
        <Header
          route={route}
          query={query}
          setQuery={setQuery}
          searchRef={searchRef}
          navigate={navigate}
          onAdd={() => showModal({ type: 'prompt-form' })}
          onMenu={() => setMobileOpen(true)}
        />
        <main id="main-content" tabIndex={-1} className="main-content">
          {route.page === 'explore' && (
            <Explore
              prompts={allPrompts}
              category={route.category}
              query={query}
              onCategory={onCategory}
              favorites={favorites}
              onSave={toggleFavorite}
              onOpen={openPrompt}
              onCopy={copyPrompt}
              onCustomize={customize}
              onRandom={() => openPrompt(allPrompts[Math.floor(Math.random() * allPrompts.length)])}
              onAdd={() => showModal({ type: 'prompt-form' })}
              navigate={navigate}
            />
          )}
          {route.page === 'collections' && (
            <Collections
              prompts={allPrompts}
              favorites={favorites}
              collections={vault.collections}
              collectionId={route.collectionId}
              onOpenCollection={(collectionId) => navigate('collections', { collectionId })}
              navigate={navigate}
              onCreate={() => showModal({ type: 'collection-form' })}
              onEdit={(initial) => showModal({ type: 'collection-form', initial })}
              onDelete={deleteCollection}
              onSave={toggleFavorite}
              onOpenPrompt={openPrompt}
              onCopy={copyPrompt}
              onCustomize={customize}
              onExport={exportCollection}
              onRemove={toggleCollection}
            />
          )}
          {route.page === 'playground' && (
            <Playground
              prompts={allPrompts}
              draft={vault.playground}
              onDraft={(playground) => setVault((current) => ({ ...current, playground }))}
              onCopyText={copyText}
              onSaveVersion={(initial) => showModal({ type: 'prompt-form', initial })}
              onDownload={downloadText}
              onDetails={openPrompt}
            />
          )}
        </main>
      </div>
      {modal?.type === 'detail' && (
        <PromptDetail
          key={modal.prompt.id}
          prompt={allPrompts.find((item) => item.id === modal.prompt.id) || modal.prompt}
          saved={favorites.includes(modal.prompt.id)}
          onClose={closeModal}
          onSave={toggleFavorite}
          onCopy={copyPrompt}
          onCustomize={customize}
          onCollection={(prompt) => showModal({ type: 'collection-picker', prompt })}
          onDownload={downloadPrompt}
          onEdit={(initial) => showModal({ type: 'prompt-form', initial, editing: true })}
          onDelete={deletePrompt}
        />
      )}
      {modal?.type === 'prompt-form' && (
        <PromptForm
          key={modal.initial?.id || 'new'}
          initial={modal.initial}
          editing={modal.editing}
          onClose={closeModal}
          onSubmit={submitPrompt}
        />
      )}
      {modal?.type === 'collection-form' && (
        <CollectionForm initial={modal.initial} onClose={closeModal} onSubmit={submitCollection} />
      )}
      {modal?.type === 'collection-picker' && (
        <CollectionPicker
          prompt={modal.prompt}
          collections={vault.collections}
          favorites={favorites}
          onToggleFavorite={toggleFavorite}
          onToggleCollection={toggleCollection}
          onCreate={(prompt) => showModal({ type: 'collection-form', promptId: prompt.id })}
          onClose={closeModal}
        />
      )}
      {modal?.type === 'confirm' && (
        <ConfirmDialog
          title={modal.title}
          description={modal.description}
          onClose={closeModal}
          onConfirm={modal.onConfirm}
        />
      )}
      {modal?.type === 'help' && (
        <HelpDialog onClose={closeModal} onExport={exportVault} onImport={importVault} />
      )}
      <div className="toast-region" role="status" aria-live="polite" aria-atomic="true">
        {toast && (
          <div key={toast.id} className={`toast ${toast.kind === 'error' ? 'toast-error' : ''}`}>
            <span>
              <Icon name={toast.kind === 'error' ? 'Info' : 'Check'} size={17} />
            </span>
            <p>{toast.message}</p>
            <button
              className="icon-button"
              aria-label="Dismiss notification"
              onClick={() => setToast(null)}
            >
              <Icon name="X" size={15} />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
