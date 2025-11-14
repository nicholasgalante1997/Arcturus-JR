import { DehydratedState } from '@tanstack/react-query';

export function createDehydrationWindowAssignmentScript(dehydration: DehydratedState) {
  return `window.__REACT_QUERY_STATE__ = ${JSON.stringify(dehydration)};`;
}
