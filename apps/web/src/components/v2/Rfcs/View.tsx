import { memo, use, useMemo } from 'react';
import { Link } from 'react-router';

import copy from '@/content/en.json';
import { pipeline } from '@/utils/pipeline';
import { formatPostDate } from '@/utils/postPresentation';
import { withProfiler } from '@/utils/profiler';

import { sortRfcs } from './sortRfcs';

import type { V2RfcsPageViewProps } from './types';

function V2RfcsPageView({ queries }: V2RfcsPageViewProps) {
  const [rfcsQuery] = queries;
  const rfcs = use(rfcsQuery.promise);
  const sortedRfcs = useMemo(() => sortRfcs(rfcs), [rfcs]);

  return (
    <div className="v2-rfcs-page">
      <div className="wrapper">
        <header className="v2-rfcs-page__header">
          <h1 id="rfc-registry-title" className="v2-rfcs-page__title">
            {copy.rfcs.title}
          </h1>
          <p className="v2-rfcs-page__description">{copy.rfcs.intro}</p>
        </header>

        <section className="v2-rfc-registry" aria-labelledby="rfc-registry-title">
          {sortedRfcs.map((rfc) => (
            <article key={rfc.id} className="v2-rfc-record">
              <div className="v2-rfc-record__identity">
                <Link to={`/rfc/${rfc.id}`} className="v2-rfc-record__code">
                  {rfc.code}
                </Link>
                <div
                  className="v2-rfc-record__status"
                  data-status={rfc.status.toLocaleLowerCase()}
                >
                  <span className="v2-rfc-record__status-dot" aria-hidden="true" />
                  <span>{rfc.status}</span>
                </div>
              </div>

              <div className="v2-rfc-record__content">
                <h2 className="v2-rfc-record__title">
                  <Link to={`/rfc/${rfc.id}`}>{rfc.title}</Link>
                </h2>
                <p className="v2-rfc-record__abstract">{rfc.excerpt}</p>
              </div>

              <dl className="v2-rfc-record__revision">
                <div>
                  <dt>{copy.rfcs.versionLabel}</dt>
                  <dd>v{rfc.version}</dd>
                </div>
                <div>
                  <dt>{copy.rfcs.updatedLabel}</dt>
                  <dd>
                    <time dateTime={rfc.updated}>{formatPostDate(rfc.updated)}</time>
                  </dd>
                </div>
              </dl>
            </article>
          ))}
        </section>
      </div>
    </div>
  );
}

export default pipeline(memo, withProfiler('v2_Rfcs_Page_View'))(V2RfcsPageView);
