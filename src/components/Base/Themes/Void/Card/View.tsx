import classnames from 'classnames';
import React, { memo, Suspense } from 'react';

import { VoidCardProps } from './types';

const ReactRouterLink = React.lazy(() =>
  import('react-router').then(({ Link }) => ({
    default: Link,
    _loaded: true
  }))
);

function VoidCard(props: VoidCardProps) {
  return (
    <div className="card">
      <div className="card-header">
        <h3 className="card-title">{props.title}</h3>
        <p className="card-subtitle">{props.subtitle}</p>
      </div>
      <div className="card-body">{props.body}</div>
      <div className="card-footer">
        {props.badge && <span className={classnames('badge', props.badge?.type)}>{props.badge?.label}</span>}
        {!props.action._preferReactRouterLink && (
          <a target={props.action.target} href={props.action.href}>
            {props.action.label}
          </a>
        )}
        {props.action._preferReactRouterLink && (
          <Suspense>
            <ReactRouterLink target={props.action.target} to={props.action.href}>
              {props.action.label}
            </ReactRouterLink>
          </Suspense>
        )}
      </div>
    </div>
  );
}

export default memo(VoidCard);
