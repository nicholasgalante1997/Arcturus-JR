import { memo, use } from 'react';
import { Link } from 'react-router';

import { pipeline } from '@/utils/pipeline';
import { withProfiler } from '@/utils/profiler';

import type { V2RfcsPageViewProps } from './types';

function V2RfcsPageView({ queries }: V2RfcsPageViewProps) {
  const [rfcsQuery] = queries;
  const rfcs = use(rfcsQuery.promise);

  return (
    <div className="v2-rfcs-page">
      <div className="container">
        <header className="v2-rfcs-page__header">
          <h1 className="v2-rfcs-page__title">RFCs</h1>
          <p className="v2-rfcs-page__description">
            Requests for Comments — technical specifications and protocol drafts.
          </p>
        </header>

        <div className="v2-rfcs-page__grid">
          {rfcs.map((rfc) => (
            <Link key={rfc.id} to={`/rfc/${rfc.id}`} className="v2-rfc-card">
              <article className="v2-rfc-card__inner">
                <div className="v2-rfc-card__meta">
                  <span className="v2-rfc-card__status" data-status={rfc.status.toLowerCase().replace(/\s+/g, '-')}>
                    {rfc.status}
                  </span>
                  <span className="v2-rfc-card__version">v{rfc.version}</span>
                </div>
                <h2 className="v2-rfc-card__title">{rfc.title}</h2>
                <p className="v2-rfc-card__excerpt">{rfc.excerpt}</p>
                <div className="v2-rfc-card__footer">
                  <span className="v2-rfc-card__author">{rfc.author}</span>
                  <time className="v2-rfc-card__date" dateTime={rfc.date}>
                    {new Date(rfc.date).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </time>
                </div>
                <div className="v2-rfc-card__tags">
                  {rfc.tags.map((tag) => (
                    <span key={tag} className="v2-rfc-card__tag">
                      {tag}
                    </span>
                  ))}
                </div>
              </article>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}

export default pipeline(memo, withProfiler('v2_Rfcs_Page_View'))(V2RfcsPageView);
