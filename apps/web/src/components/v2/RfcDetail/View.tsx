import { memo, use } from 'react';
import { Link } from 'react-router';

import copy from '@/content/en.json';
import { pipeline } from '@/utils/pipeline';
import { withProfiler } from '@/utils/profiler';

import type { V2RfcDetailViewProps } from './types';

function V2RfcDetailView({ queries }: V2RfcDetailViewProps) {
  const [rfcQuery] = queries;
  const rfc = use(rfcQuery.promise);

  return (
    <div className="v2-rfc-detail">
      <div className="v2-container">
        <nav className="v2-rfc-detail__breadcrumb" aria-label={copy.rfcDetail.breadcrumbLabel}>
          <Link to="/rfcs">{copy.rfcDetail.rfcsLabel}</Link>
          <span className="v2-rfc-detail__breadcrumb-separator" aria-hidden="true">
            /
          </span>
          <span>{rfc.id}</span>
        </nav>

        <header className="v2-rfc-detail__header">
          <div className="v2-rfc-detail__meta">
            <span
              className="v2-rfc-detail__status"
              data-status={rfc.status.toLowerCase().replace(/\s+/g, '-')}
            >
              {rfc.status}
            </span>
            <span className="v2-rfc-detail__version">v{rfc.version}</span>
            <time className="v2-rfc-detail__date" dateTime={rfc.date}>
              {new Date(rfc.date).toLocaleDateString(copy.site.locale, {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              })}
            </time>
          </div>
          <h1 className="v2-rfc-detail__title">{rfc.title}</h1>
          <p className="v2-rfc-detail__author">
            {copy.rfcDetail.authorLabel}: {rfc.author}
          </p>
          <div className="v2-rfc-detail__tags">
            {rfc.tags.map((tag) => (
              <span key={tag} className="v2-rfc-detail__tag">
                {tag}
              </span>
            ))}
          </div>
          <div className="v2-rfc-detail__original-format">
            <a
              style={{ marginTop: '24px', color: 'var(--color-void-azure)' }}
              rel="noreferrer"
              target="_blank"
              href={`/content/rfcs/${rfc.id}.txt`}
            >
              {copy.rfcDetail.originalFormatLabel}
            </a>
          </div>
        </header>

        <div className="v2-rfc-detail__content">
          <pre className="v2-rfc-detail__document">{rfc.content}</pre>
        </div>
      </div>
    </div>
  );
}

export default pipeline(memo, withProfiler('v2_Rfc_Detail_View'))(V2RfcDetailView);
