import { memo } from 'react';

import type { PostListProps } from './types';

function PostListView({ items, selectedId, onSelect, emptyLabel = 'No items yet.' }: PostListProps) {
  if (items.length === 0) {
    return <div className="editor-empty-state">{emptyLabel}</div>;
  }

  return (
    <ul className="editor-post-list">
      {items.map((item) => (
        <li
          key={item.id}
          className={`editor-post-list__item${item.id === selectedId ? ' editor-post-list__item--active' : ''}`}
          onClick={() => onSelect(item.id)}
        >
          <span className="editor-post-list__title">{item.title || item.id}</span>
          <span className="editor-post-list__meta">
            <span className={`editor-badge editor-badge--${item.visible ? 'visible' : 'draft'}`}>
              {item.visible ? 'visible' : 'draft'}
            </span>
            <span>{item.date}</span>
          </span>
        </li>
      ))}
    </ul>
  );
}

export default memo(PostListView);
