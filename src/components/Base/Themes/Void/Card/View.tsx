import classnames from 'classnames';
import React, { memo, Suspense } from 'react';

import { VoidCardProps } from './types';

const ReactRouterLink = React.lazy(() =>
  import('react-router').then(({ Link }) => ({
    default: Link,
    _loaded: true
  }))
);

function VoidCard({ action, badge, body, subtitle, title, className, ...props }: VoidCardProps) {
  return (
    <div className={classnames('card', className)} {...props}>
      <div className="card-header">
        <h3 className="card-title">{title}</h3>
        <p className="card-subtitle">{subtitle}</p>
      </div>
      <div className="card-body">{body}</div>
      <div className="card-footer">
        {badge && <span className={classnames('badge', badge?.type)}>{badge?.label}</span>}
        {!action._preferReactRouterLink && (
          <a target={action.target} href={action.href}>
            {action.label}
          </a>
        )}
        {action._preferReactRouterLink && (
          <Suspense
            fallback={
              <a target={action.target} href={action.href}>
                {action.label}
              </a>
            }
          >
            <ReactRouterLink target={action.target} to={action.href}>
              {action.label}
            </ReactRouterLink>
          </Suspense>
        )}
      </div>
    </div>
  );
}

export default memo(VoidCard);
