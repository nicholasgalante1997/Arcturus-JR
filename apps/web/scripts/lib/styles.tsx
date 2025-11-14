import React from 'react';

export function mapHREFToReactLinkJSX(style: string): React.ReactNode {
  return (
    <React.Fragment key={style}>
      <link rel="preload" as="style" href={style} precedence="low" key={`${style}-preload-link`} />
      <link rel="stylesheet" href={style} precedence="high" key={`${style}-stylesheet-link`} />
    </React.Fragment>
  );
}
