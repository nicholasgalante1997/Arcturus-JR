export type SerializableCacheKey = symbol | string;

export default class CacheWithExpiry<K extends SerializableCacheKey = string, V = unknown> {
  static defaultExpirationTimeout = 1000 * 60 * 2; // 2 hours
  private _timeouts: Map<string, NodeJS.Timeout> = new Map();
  private _cache = new Map<K, V>();

  has(key: K) {
    return this._cache.has(key);
  }

  set(key: K, value: V, expiry = CacheWithExpiry.defaultExpirationTimeout) {
    this._cache.set(key, value);
    const id = 'cwe-' + (performance ? "now" in performance ? performance.now() : Date.now() : Date.now());
    const timeout = setTimeout(() => {
      this._cache.delete(key);
      queueMicrotask(() => {
        if (this._timeouts.has(id)) {
          const timeout = this._timeouts.get(id);
          try {
            if (timeout) clearTimeout(timeout);
          } catch (e) {
            console.error('Error clearing timeout:', e);
          }
        }
        this._timeouts.delete(id);
      });
    }, expiry);
    this._timeouts.set(id, timeout);
  }

  get(key: K) {
    return this._cache.get(key);
  }
}
