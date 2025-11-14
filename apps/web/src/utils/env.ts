export function getJavascriptEnvironment(): 'browser' | 'server' {
  if (process?.env?.ARCJR_PRERENDERING) return 'server';
  if (typeof window === 'undefined') return 'server';
  return 'browser';
}
