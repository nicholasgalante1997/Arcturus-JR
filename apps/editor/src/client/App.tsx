import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

import type { Post, PostFrontmatter, Rfc, RfcFrontmatter } from '@arcjr/content';

import { api, type CollectionName } from './api';
import { BuildErrorPanel } from './components/BuildErrorPanel';
import type { ListItem } from './components/PostList';
import { PostList } from './components/PostList';
import { MarkdownEditor } from './components/MarkdownEditor';
import { PostMetadataForm, RfcMetadataForm } from './components/MetadataForm';
import type { PostMetadataFormHandle, RfcMetadataFormHandle } from './components/MetadataForm';
import { Toaster, useToasts } from './components/Toaster';
import { ViewToggle, type ViewMode } from './components/ViewToggle';

const DEFAULT_POST_FRONTMATTER: PostFrontmatter = {
  title: '',
  date: new Date().toISOString().slice(0, 10),
  excerpt: '',
  tags: [],
  image: { src: '', alt: '', aspectRatio: '16 / 9' },
  category: 'GENERAL',
  subcategory: '',
  visible: false
};

const DEFAULT_RFC_FRONTMATTER: RfcFrontmatter = {
  title: '',
  version: '0.1.0-draft',
  status: 'Draft',
  date: new Date().toISOString().slice(0, 10),
  author: '',
  excerpt: '',
  tags: [],
  visible: false
};

type Tab = 'write' | 'settings';
type SaveState = 'saved' | 'saving' | 'unsaved';

const SAVE_CHIP_LABEL: Record<SaveState, string> = {
  saved: 'Saved',
  saving: 'Saving…',
  unsaved: 'Unsaved'
};

function toListItems(items: Array<Post | Rfc>): ListItem[] {
  return items.map((item) => ({ id: item.id, title: item.title, date: item.date, visible: item.visible }));
}

export function App() {
  const [collection, setCollection] = useState<CollectionName>('posts');
  const [items, setItems] = useState<Array<Post | Rfc>>([]);
  const [imageOptions, setImageOptions] = useState<string[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [postFrontmatter, setPostFrontmatter] = useState<PostFrontmatter>(DEFAULT_POST_FRONTMATTER);
  const [rfcFrontmatter, setRfcFrontmatter] = useState<RfcFrontmatter>(DEFAULT_RFC_FRONTMATTER);
  const [body, setBody] = useState('');
  const [savedBody, setSavedBody] = useState('');
  const [formDirty, setFormDirty] = useState(false);
  const [isCreatingNew, setIsCreatingNew] = useState(false);
  const [newId, setNewId] = useState('');
  const [query, setQuery] = useState('');
  const [tab, setTab] = useState<Tab>('write');
  const [viewMode, setViewMode] = useState<ViewMode>('split');
  const [settingsInvalid, setSettingsInvalid] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [buildError, setBuildError] = useState<string | null>(null);

  const { toasts, push } = useToasts();

  const postFormRef = useRef<PostMetadataFormHandle>(null);
  const rfcFormRef = useRef<RfcMetadataFormHandle>(null);

  const handleFormDirty = useCallback((dirty: boolean) => setFormDirty(dirty), []);

  const listItems = useMemo(() => {
    const q = query.trim().toLowerCase();
    return toListItems(items)
      .filter((item) => !q || item.title.toLowerCase().includes(q) || item.id.toLowerCase().includes(q))
      .sort((a, b) => (a.date < b.date ? 1 : a.date > b.date ? -1 : 0));
  }, [items, query]);

  const hasActiveDocument = isCreatingNew || selectedId !== null;
  const dirty = isCreatingNew || body !== savedBody || formDirty;
  const saveState: SaveState = isSaving ? 'saving' : dirty ? 'unsaved' : 'saved';

  async function refreshList() {
    const next = collection === 'posts' ? await api.listPosts() : await api.listRfcs();
    setItems(next);
  }

  useEffect(() => {
    refreshList();
    setSelectedId(null);
    setIsCreatingNew(false);
    setQuery('');
    setTab('write');
    setSettingsInvalid(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [collection]);

  useEffect(() => {
    api.listAssets().then(setImageOptions).catch(() => setImageOptions([]));
  }, []);

  async function selectItem(id: string) {
    setIsCreatingNew(false);
    setSelectedId(id);
    setTab('write');
    setSettingsInvalid(false);
    setBuildError(null);
    if (collection === 'posts') {
      const doc = await api.getPost(id);
      setPostFrontmatter(doc.frontmatter);
      setBody(doc.body);
      setSavedBody(doc.body);
    } else {
      const doc = await api.getRfc(id);
      setRfcFrontmatter(doc.frontmatter);
      setBody(doc.body);
      setSavedBody(doc.body);
    }
  }

  function startNew() {
    setSelectedId(null);
    setIsCreatingNew(true);
    setNewId('');
    setBody('');
    setSavedBody('');
    setTab('write');
    setSettingsInvalid(false);
    setBuildError(null);
    if (collection === 'posts') setPostFrontmatter(DEFAULT_POST_FRONTMATTER);
    else setRfcFrontmatter(DEFAULT_RFC_FRONTMATTER);
  }

  function reportSaveResult(id: string, rebuildOk: boolean, output: string) {
    push('success', `Saved "${id}"`);
    setBuildError(rebuildOk ? null : output);
  }

  async function save() {
    const id = isCreatingNew ? newId.trim() : selectedId;
    if (!id) {
      push('error', 'Enter an id before saving.');
      return;
    }

    setIsSaving(true);
    try {
      if (collection === 'posts') {
        const frontmatter = await postFormRef.current?.submit();
        if (!frontmatter) {
          setSettingsInvalid(true);
          setTab('settings');
          push('error', 'Fix the highlighted fields before saving.');
          return;
        }
        const result = isCreatingNew
          ? await api.createPost({ id, frontmatter, body })
          : await api.updatePost({ id, frontmatter, body });
        setPostFrontmatter(frontmatter);
        reportSaveResult(id, result.manifestRebuild.ok, result.manifestRebuild.output);
      } else {
        const frontmatter = await rfcFormRef.current?.submit();
        if (!frontmatter) {
          setSettingsInvalid(true);
          setTab('settings');
          push('error', 'Fix the highlighted fields before saving.');
          return;
        }
        const result = isCreatingNew
          ? await api.createRfc({ id, frontmatter, body })
          : await api.updateRfc({ id, frontmatter, body });
        setRfcFrontmatter(frontmatter);
        reportSaveResult(id, result.manifestRebuild.ok, result.manifestRebuild.output);
      }
      setSettingsInvalid(false);
      setIsCreatingNew(false);
      setSelectedId(id);
      setSavedBody(body);
      await refreshList();
    } catch (error) {
      push('error', error instanceof Error ? error.message : 'Save failed.');
    } finally {
      setIsSaving(false);
    }
  }

  async function remove() {
    if (!selectedId) return;
    if (!confirm(`Delete "${selectedId}"? This cannot be undone.`)) return;

    try {
      const result = collection === 'posts' ? await api.deletePost(selectedId) : await api.deleteRfc(selectedId);
      push('success', `Deleted "${selectedId}"`);
      setBuildError(result.manifestRebuild.ok ? null : result.manifestRebuild.output);
      setSelectedId(null);
      await refreshList();
    } catch (error) {
      push('error', error instanceof Error ? error.message : 'Delete failed.');
    }
  }

  const collectionLabel = collection === 'posts' ? 'post' : 'RFC';

  return (
    <div className="editor-app">
      <aside className="editor-app__sidebar">
        <div className="editor-collection-switch">
          <button
            className={`editor-collection-switch__button${collection === 'posts' ? ' editor-collection-switch__button--active' : ''}`}
            onClick={() => setCollection('posts')}
          >
            Posts
          </button>
          <button
            className={`editor-collection-switch__button${collection === 'rfcs' ? ' editor-collection-switch__button--active' : ''}`}
            onClick={() => setCollection('rfcs')}
          >
            RFCs
          </button>
        </div>

        <div className="editor-search">
          <input
            className="editor-search__input"
            type="text"
            placeholder={`Filter ${collection}…`}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </div>

        <PostList
          items={listItems}
          selectedId={selectedId}
          onSelect={selectItem}
          emptyLabel={query ? 'No matches.' : 'No items yet.'}
        />

        <div className="editor-app__sidebar-footer">
          <button className="editor-button editor-button--secondary editor-button--full" onClick={startNew}>
            + New {collectionLabel}
          </button>
        </div>
      </aside>

      <main className="editor-app__main">
        <header className="editor-topbar">
          <span className="editor-topbar__brand">
            <span className="editor-topbar__brand-mark" />
            arcjr editor
          </span>
          {hasActiveDocument &&
            (isCreatingNew ? (
              <input
                className="editor-topbar__idinput"
                type="text"
                placeholder={`new-${collectionLabel.toLowerCase()}-id`}
                value={newId}
                onChange={(e) => setNewId(e.target.value)}
              />
            ) : (
              <span className="editor-topbar__docid">{selectedId}</span>
            ))}
          <div className="editor-topbar__spacer" />
          {hasActiveDocument && (
            <>
              <span className={`editor-savechip editor-savechip--${saveState}`}>
                <span className="editor-savechip__dot" />
                {SAVE_CHIP_LABEL[saveState]}
              </span>
              {!isCreatingNew && (
                <button className="editor-button editor-button--danger" onClick={remove}>
                  Delete
                </button>
              )}
              <button className="editor-button" onClick={save} disabled={isSaving}>
                Save
              </button>
            </>
          )}
        </header>

        {!hasActiveDocument && (
          <div className="editor-empty-state">Select {collectionLabel === 'post' ? 'a post' : 'an RFC'} or create a new one.</div>
        )}

        {hasActiveDocument && (
          <>
            <div className="editor-tabbar">
              <button
                className={`editor-tab${tab === 'write' ? ' editor-tab--active' : ''}`}
                onClick={() => setTab('write')}
              >
                Write
              </button>
              <button
                className={`editor-tab${tab === 'settings' ? ' editor-tab--active' : ''}`}
                onClick={() => setTab('settings')}
              >
                Settings
                {settingsInvalid && <span className="editor-tab__dot" />}
              </button>
              <div className="editor-tabbar__spacer" />
              {tab === 'write' && collection === 'posts' && <ViewToggle value={viewMode} onChange={setViewMode} />}
            </div>

            {buildError && <BuildErrorPanel output={buildError} onDismiss={() => setBuildError(null)} />}

            <div className="editor-workspace">
              <div className={`editor-pane${tab === 'write' ? '' : ' editor-pane--hidden'}`}>
                <MarkdownEditor
                  value={body}
                  onChange={setBody}
                  language={collection === 'posts' ? 'markdown' : 'plain'}
                  viewMode={viewMode}
                />
              </div>

              <div className={`editor-pane${tab === 'settings' ? '' : ' editor-pane--hidden'}`}>
                <div className="editor-settings">
                  {collection === 'posts' ? (
                    <PostMetadataForm
                      ref={postFormRef}
                      values={postFrontmatter}
                      imageOptions={imageOptions}
                      onDirtyChange={handleFormDirty}
                    />
                  ) : (
                    <RfcMetadataForm ref={rfcFormRef} values={rfcFrontmatter} onDirtyChange={handleFormDirty} />
                  )}
                </div>
              </div>
            </div>
          </>
        )}
      </main>

      <Toaster toasts={toasts} />
    </div>
  );
}
