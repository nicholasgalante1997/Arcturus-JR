export function createMockRequest(url: string): Request {
  return new Request(url, {
    method: 'GET',
    signal: new AbortController().signal,
  });
}
