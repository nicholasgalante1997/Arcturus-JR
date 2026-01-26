import clsx from 'clsx';
import { memo } from 'react';

import { pipeline } from '@/utils/pipeline';

import type { TableOfContentsProps } from '../../types';

function TableOfContentsView({ headings, activeId }: TableOfContentsProps) {
  if (headings.length === 0) return null;

  return (
    <aside className="v2-toc" aria-labelledby="toc-title">
      <h2 id="toc-title" className="v2-toc__title">
        On this page
      </h2>
      <nav className="v2-toc__nav">
        <ul className="v2-toc__list">
          {headings.map((heading) => (
            <li key={heading.id} className={clsx('v2-toc__item', `v2-toc__item--level-${heading.level}`)}>
              <a
                href={`#${heading.id}`}
                className={clsx('v2-toc__link', activeId === heading.id && 'v2-toc__link--active')}
              >
                {heading.text}
              </a>
            </li>
          ))}
        </ul>
      </nav>
    </aside>
  );
}

export default pipeline(memo)(TableOfContentsView);
