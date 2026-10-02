import { useEffect, useRef, useState } from 'react';
import { categories } from '../data/categories.js';
import Icon from './Icon.jsx';

export function VaultLogo() {
  return (
    <span className="vault-logo">
      <span className="logo-symbol">
        <Icon name="Sparkles" size={23} strokeWidth={1.8} />
      </span>
      <span className="logo-wordmark">
        Prompt
        <span>
          Vault<span className="logo-dot">.</span>
        </span>
      </span>
    </span>
  );
}

export function Sidebar({
  route,
  navigate,
  countByCategory,
  favoritesCount,
  total,
  onHelp,
  mobileOpen,
  onMobileClose,
  modalOpen,
}) {
  const sidebarRef = useRef(null);
  const [isMobile, setIsMobile] = useState(() => window.matchMedia('(max-width: 800px)').matches);
  const hidden = modalOpen || (isMobile && !mobileOpen);
  useEffect(() => {
    const media = window.matchMedia('(max-width: 800px)');
    const update = (event) => setIsMobile(event.matches);
    media.addEventListener('change', update);
    return () => media.removeEventListener('change', update);
  }, []);
  useEffect(() => {
    if (!mobileOpen || !isMobile) return;
    const previous = document.activeElement;
    sidebarRef.current?.querySelector('a, button')?.focus();
    const trapFocus = (event) => {
      if (event.key !== 'Tab') return;
      const items = [...sidebarRef.current.querySelectorAll('a[href], button')].filter(
        (item) => !item.disabled,
      );
      const first = items[0],
        last = items.at(-1);
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      }
      if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };
    document.addEventListener('keydown', trapFocus);
    return () => {
      document.removeEventListener('keydown', trapFocus);
      if (previous?.isConnected) previous.focus();
    };
  }, [mobileOpen, isMobile]);
  const nav = [
    { page: 'explore', name: 'Explore', icon: 'Compass' },
    {
      page: 'collections',
      name: 'My collections',
      icon: 'FolderHeart',
      count: favoritesCount || null,
    },
    { page: 'playground', name: 'Playground', icon: 'WandSparkles', badge: 'TRY IT' },
  ];
  return (
    <>
      {mobileOpen && <div className="sidebar-overlay" onClick={onMobileClose} />}
      <aside
        className={`sidebar ${mobileOpen ? 'sidebar-open' : ''}`}
        aria-label="Main navigation"
        ref={sidebarRef}
        inert={hidden}
        aria-hidden={hidden || undefined}
      >
        <a
          className="brand-link"
          href="#/explore"
          onClick={onMobileClose}
          aria-label="AI Prompt Vault home"
        >
          <VaultLogo />
        </a>
        <div className="workspace-label">
          <span className="workspace-dot" />
          YOUR CREATIVE SPACE
        </div>
        <nav className="primary-nav">
          {nav.map((item) => (
            <button
              key={item.page}
              className={`nav-item ${route.page === item.page ? 'active' : ''}`}
              onClick={() => {
                navigate(item.page);
                onMobileClose();
              }}
            >
              <Icon name={item.icon} size={19} />
              <span>{item.name}</span>
              {item.count && <span className="nav-count">{item.count}</span>}
              {item.badge && <span className="nav-new">{item.badge}</span>}
            </button>
          ))}
        </nav>
        <div className="sidebar-section-label">
          CATEGORIES <span>{categories.length}</span>
        </div>
        <nav className="category-nav">
          {categories.map((category) => (
            <button
              key={category.id}
              className={`nav-item category-nav-item ${route.page === 'explore' && route.category === category.id ? 'category-active' : ''}`}
              onClick={() => {
                navigate('explore', { category: category.id });
                onMobileClose();
              }}
            >
              <Icon name={category.icon} size={17} style={{ color: category.color }} />
              <span>{category.name}</span>
              <span className="category-nav-count">{countByCategory[category.id] || 0}</span>
            </button>
          ))}
        </nav>
        <div className="sidebar-bottom">
          <div className="sidebar-note">
            <span className="note-icon">
              <Icon name="Lightbulb" size={19} />
            </span>
            <h3>A spark is all it takes.</h3>
            <p>
              Your next big idea could be
              <br />
              one good prompt away.
            </p>
            <button
              onClick={() => {
                navigate('playground');
                onMobileClose();
              }}
            >
              Make it yours <Icon name="ArrowUpRight" size={14} />
            </button>
            <span className="note-decoration" />
          </div>
          <button
            className="help-link"
            onClick={() => {
              onHelp();
              onMobileClose();
            }}
          >
            <Icon name="CircleHelp" size={17} />A little help & tips
            <Icon name="ArrowUpRight" size={14} />
          </button>
          <div className="sidebar-footer">
            <span className="live-dot" />
            {total} prompts. Endless possibilities.
          </div>
        </div>
      </aside>
    </>
  );
}

export function Header({ route, query, setQuery, searchRef, onAdd, onMenu, navigate }) {
  const pageTitle =
    route.page === 'explore'
      ? 'Explore the vault'
      : route.page === 'collections'
        ? 'My collections'
        : 'Prompt playground';
  return (
    <header className="topbar">
      <div className="header-left">
        <button className="icon-button mobile-menu" onClick={onMenu} aria-label="Open navigation">
          <Icon name="Menu" size={22} />
        </button>
        <div className="breadcrumb">
          <span>Workspace</span>
          <Icon name="ChevronRight" size={14} />
          <strong>{pageTitle}</strong>
        </div>
      </div>
      <div className="header-actions">
        <div className="global-search">
          <Icon name="Search" size={17} />
          <input
            ref={searchRef}
            type="search"
            aria-label="Search prompts"
            placeholder="Search for a little inspiration..."
            value={query}
            onChange={(event) => {
              setQuery(event.target.value);
              if (route.page !== 'explore') navigate('explore', {}, false);
            }}
          />
          <kbd>
            <span>⌘</span> K
          </kbd>
          {query && (
            <button className="search-clear" aria-label="Clear search" onClick={() => setQuery('')}>
              <Icon name="X" size={14} />
            </button>
          )}
        </div>
        <button className="button button-primary add-prompt-button" onClick={onAdd}>
          <Icon name="Plus" size={17} />
          <span>Add prompt</span>
        </button>
        <button
          className="profile-button"
          aria-label="Open my collections"
          title="Your local workspace"
          onClick={() => navigate('collections')}
        >
          Y<span className="profile-dot" />
        </button>
      </div>
    </header>
  );
}
