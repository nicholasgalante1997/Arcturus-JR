/* eslint-disable no-useless-escape */
/* eslint-disable @typescript-eslint/no-unused-vars */

/*
 Copyright 2014 Google Inc. All Rights Reserved.
 Licensed under the Apache License, Version 2.0 (the "License");
 you may not use this file except in compliance with the License.
 You may obtain a copy of the License at
 http://www.apache.org/licenses/LICENSE-2.0
 Unless required by applicable law or agreed to in writing, software
 distributed under the License is distributed on an "AS IS" BASIS,
 WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 See the License for the specific language governing permissions and
 limitations under the License.
*/

// ############### Start Original Notes ###############

// While overkill for this specific sample in which there is only one cache,
// this is one best practice that can be followed in general to keep track of
// multiple caches used by a given service worker, and keep them all versioned.
// It maps a shorthand identifier for a cache to a specific, versioned cache name.

// Note that since global state is discarded in between service worker restarts, these
// variables will be reinitialized each time the service worker handles an event, and you
// should not attempt to change their values inside an event handler. (Treat them as constants.)

// If at any point you want to force pages that use this service worker to start using a fresh
// cache, then increment the CACHE_VERSION value. It will kick off the service worker update
// flow and the old cache(s) will be purged as part of the activate event handler when the
// updated service worker is activated.

// ############### End Original Notes ###############

/**
 * What makes sense for our use-case?
 *
 * Pages share mostly the same entrypoint + chunks,
 * They only dynamically load a single chunk specific to their page content
 * which is contenthashed so is not going to reliably be inserted across builds
 * unless we bake in some additional prop-passing into our prerender-script,
 * I'd say the site is fast enough we likely do not need to prefetch these JS resources
 * since React-Router is handing automatically pre-loading them.
 *
 * CSS is reliably and deterministically named, so it can be prefetched,
 * Also MEDIA
 *
 * So we likely have three "events" so to speak
 *
 * - A clear caches event
 *  - This can be dispatched via a message event
 *  - This is dispatched on the Worker activation event [TODO check if this needs to be replaced with install]
 *
 * - A fetch event
 *  - We want to intercept fetch events so we can attempt to fulfill the request with a cached response
 *    - We only want to do so for specific resources,
 *    - i.e. Media, CSS
 */

/**
 * Relevant documentation:
 *
 * @see https://github.com/GoogleChrome/samples/blob/gh-pages/service-worker/selective-caching/service-worker.js
 * @see https://developer.mozilla.org/en-US/docs/Web/API/Web_Workers_API/Using_web_workers
 * @see https://developer.mozilla.org/en-US/docs/Web/API/Cache#examples
 * @see https://developer.mozilla.org/en-US/docs/Web/API/ExtendableEvent/waitUntil
 * @see https://developer.mozilla.org/en-US/docs/Web/API/FetchEvent/respondWith
 * @see https://developer.mozilla.org/en-US/docs/Web/API/Window/caches
 * @see https://developer.mozilla.org/en-US/docs/Web/API/URL/URL
 * @see https://developer.mozilla.org/en-US/docs/Web/API/URL_API/Resolving_relative_references
 */

var CACHE_VERSION = 1;
var CURRENT_CACHES = Object.freeze({
  css: 'css-cache-v' + CACHE_VERSION,
  data: 'data-cache-v' + CACHE_VERSION,
  font: 'font-cache-v' + CACHE_VERSION,
  html: 'html-cache-v' + CACHE_VERSION,
  markdown: 'markdown-cache-v' + CACHE_VERSION,
  media: 'media-cache-v' + CACHE_VERSION
});
var MIME_TYPES = Object.freeze({
  '.pdf': 'application/pdf',
  '.json': 'application/json',
  '.map': 'application/json',
  '.xml': 'application/xml',
  '.ttf': 'font/ttf',
  '.woff': 'font/woff',
  '.woff2': 'font/woff2',
  '.gif': 'image/gif',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.png': 'image/png',
  '.svg': 'image/svg',
  '.htm': 'text/html',
  '.html': 'text/html',
  '.md': 'text/markdown',
  '.txt': 'text/plain',
  '.webp': 'image/webp',
  '.css': 'text/css'
});
var SUPPORTED_CONTENT_TYPES = Object.values(MIME_TYPES);

/**
 * @param {string} event
 */
const event_log = (event) => console.log('worker---prefetch-cache has received event ' + event);

const PROD_DOMAIN = new RegExp(/(www\.)?nickgalante\.tech\/[\w\d\/]*/gm);
const LOCALHOST_DOMAIN = new RegExp(/localhost:3000\/[\w\d\/]*/gm);
const ENABLE_LOCALHOST_DOMAIN_CHECK = true;

self.addEventListener('activate', handleActivateEvent);

self.addEventListener('fetch', function (event) {
  console.log('Handling fetch event for', event.request.url);
  const url = new URL(event.request.url);
  const { cache, isSameOriginResource } = getFetchEventMetadata(url);
  const useCache = !!cache && !!isSameOriginResource;

  event.respondWith(handleFetchEvent({ event, cache, useCache }));
});

self.onmessage = async (event) => {
  console.log('received an event in the worker thread: ', event.data);
  if (typeof event.data === 'object' && 'type' in event.data) {
    event_log(event.data.type);
    switch (event.data.type) {
      case 'caches.clear': {
        clearResponseCaches(event);
        break;
      }
      case 'caches.prefetch': {
        const resourceURI = event.data?.prefetch;
        const resourceRequestInit = event.data?.prefetchHttpOptions;
        if (typeof resourceURI !== 'string') {
          console.warn('Invalid resourceURI passed to prefetch cache event: ', resourceURI);
          break;
        }

        const url = new URL(resourceURI, window.location.href);
        console.log(`Prefetching Resource:
              - Resource URI: ${resourceURI}
              - Resource URL: ${url.href}
              - Resource Request Init: ${JSON.stringify(resourceRequestInit, null, 2)}
        `);

        try {
          await handlePrefetchEvent(url, resourceRequestInit);
        } catch (e) {
          console.warn(`An error occurred prefetching resource:
              - Resource URI: ${resourceURI}
              - Resource URL: ${url.href}
              - Resource Request Init: ${JSON.stringify(resourceRequestInit, null, 2)}
              - Error: ${e}
          `);
        }
        break;
      }
      default: {
        console.warn('Unknown event type dispatched: ', event.data.type);
      }
    }
  }
};

let isActivated = false;

function handleActivateEvent(event) {
  if ('waitUntil' in event && caches) {
    clearResponseCaches(event, () => {
      isActivated = true;
    });
  }
}

/**
 * @param {Event} event
 * @param {Array<() => void>} callbacks
 */
function clearResponseCaches(event, ...callbacks) {
  if ('waitUntil' in event && typeof event.waitUntil === 'function') {
    // Delete all caches that aren't named in CURRENT_CACHES.
    var expectedCacheNamesSet = new Set(Object.values(CURRENT_CACHES));
    event.waitUntil(
      caches
        .keys()
        .then(function (cacheNames) {
          return Promise.all(
            cacheNames.map(function (cacheName) {
              if (!expectedCacheNamesSet.has(cacheName)) {
                // If this cache name isn't present in the set of "expected" cache names, then delete it.
                console.log('Deleting out of date cache:', cacheName);
                return caches.delete(cacheName);
              }
            })
          );
        })
        .then(() => {
          for (const callback of callbacks) {
            if (callback && typeof callback === 'function') {
              try {
                callback();
              } catch (e) {
                console.warn('An error occurred invoking callback %callback% %error%: ', callback?.name, e);
              }
            }
          }
        })
        .catch((e) => {
          console.warn('An error occurred when trying to clear worker caches: ', e);
        })
    );
  }
}

/**
 * @param {{
 *  event: FetchEvent;
 *  cache?: {
 *    name?: string;
 *  }
 *  useCache?: boolean;
 * }} options
 */
async function handleFetchEvent({ cache, event, useCache }) {
  if (useCache && cache?.name && event) {
    return caches.open(cache.name).then(async function (cache) {
      return cache
        .match(event.request)
        .then(function (response) {
          if (response) {
            // If there is an entry in the cache for event.request, then response will be defined
            // and we can just return it.
            console.log(' Found response in cache:', response);
            return response;
          }

          // Otherwise, if there is no entry in the cache for event.request, response will be
          // undefined, and we need to fetch() the resource.
          console.log(
            ' No response for %s found in cache. About to fetch ' + 'from network...',
            event.request.url
          );

          // We call .clone() on the request since we might use it in a call to cache.put() later on.
          // Both fetch() and cache.put() "consume" the request, so we need to make a copy.
          // (see https://fetch.spec.whatwg.org/#dom-request-clone)
          return fetch(event.request.clone()).then(function (response) {
            console.log('  Response for %s from network is: %O', event.request.url, response);
            cacheResponse(response.clone(), cache, event);
            // Return the original response object, which will be used to fulfill the resource request.
            return response;
          });
        })
        .catch(function (error) {
          // This catch() will handle exceptions that arise from the match() or fetch() operations.
          // Note that a HTTP error response (e.g. 404) will NOT trigger an exception.
          // It will return a normal response object that has the appropriate error code set.
          console.error('  Error in fetch handler:', error);

          throw error;
        });
    });
  } else {
    // This catch() will handle exceptions that arise from the match() or fetch() operations.
    // Note that a HTTP error response (e.g. 404) will NOT trigger an exception.
    // It will return a normal response object that has the appropriate error code set.
    return fetch(event.request).catch(function (error) {
      console.error('  Error in fetch handler:', error);

      throw error;
    });
  }
}

/**
 * @param {URL} url
 * @param {RequestInit | undefined} requestInit
 * @returns {Promise<void>}
 */
async function handlePrefetchEvent(url, requestInit) {
  const fileType = url.href.slice(url.href.lastIndexOf('.'));
  const mimeType = MIME_TYPES[fileType];
  if (!mimeType) {
    console.warn('Unknown MIME type for file type: ', fileType);
    console.warn('Issue originated prefetching ', url);
    return;
  }

  const cacheOrNull = getCacheFromMimeType(mimeType);

  if (!cacheOrNull) {
    console.warn('Unknown cache for MIME type: ', mimeType);
    console.warn('Issue originated prefetching ', url);
    return;
  }

  const cache = await caches.open(cacheOrNull.name);
  const hasCachedResponse = await cache.match(url);

  if (hasCachedResponse) {
    console.log('Already cached resource: ', url.href);
    return;
  }

  const request = new Request(url.href, requestInit || getDefaultRequestInit(mimeType));
  const response = await fetch(request);

  if (response.status >= 400) {
    console.warn('Failed to fetch resource: ', url.href);
    console.warn('Issue originated prefetching ', url);
    return;
  }

  const mockFetchEvent = createMockFetchEvent(url.href, request);

  return cacheResponse(response.clone(), cache, mockFetchEvent);
}

/**
 * @param {Response} response
 * @param {Cache} cache
 * @param {FetchEvent} event
 */
function cacheResponse(response, cache, event) {
  if (
    response.status < 400 &&
    response.headers.has('content-type') &&
    SUPPORTED_CONTENT_TYPES.includes(response.headers.get('content-type'))
  ) {
    // This avoids caching responses that we know are errors (i.e. HTTP status code of 4xx or 5xx).
    // We also only want to cache responses that correspond to fonts,
    // i.e. have a Content-Type response header that starts with "font/".
    // Note that for opaque filtered responses (https://fetch.spec.whatwg.org/#concept-filtered-response-opaque)
    // we can't access to the response headers, so this check will always fail and the font won't be cached.
    // All of the Google Web Fonts are served off of a domain that supports CORS, so that isn't an issue here.
    // It is something to keep in mind if you're attempting to cache other resources from a cross-origin
    // domain that doesn't support CORS, though!
    // We call .clone() on the response to save a copy of it to the cache. By doing so, we get to keep
    // the original response object which we will return back to the controlled page.
    // (see https://fetch.spec.whatwg.org/#dom-response-clone)
    console.log('  Caching the response to', event.request.url);
    cache.put(event.request, response.clone());
  } else {
    console.log('  Not caching the response to', event.request.url);
  }
}

/**
 * @param {URL} url
 * @returns {{
 *  isSameOriginResource: boolean;
 *  cache: { name: string } | null;
 * }}
 */
function getFetchEventMetadata(url) {
  const domain = url.hostname;
  const pathname = url.pathname;

  const isRequestForProdSameOriginResource = PROD_DOMAIN.test(domain);
  const isRequestForDevSameOriginResource = ENABLE_LOCALHOST_DOMAIN_CHECK && LOCALHOST_DOMAIN.test(domain);

  const isSameOriginResource = isRequestForProdSameOriginResource || isRequestForDevSameOriginResource;

  let cache = null;

  if (isSameOriginResource) {
    const fileType = pathname.slice(pathname.lastIndexOf('.'));
    const mimeType = MIME_TYPES[fileType];
    if (!mimeType) {
      return {
        isSameOriginResource,
        cache
      };
    }

    cache = getCacheFromMimeType(mimeType);

    return {
      isSameOriginResource,
      cache
    };
  }
}

/**
 * @param {string} url
 * @param {Request} request
 * @returns {FetchEvent}
 */
function createMockFetchEvent(url, request) {
  /** @type {FetchEvent} */
  const mockFetchEvent = new Event('fetch');
  mockFetchEvent.url = url;
  mockFetchEvent.request = request;
  mockFetchEvent.respondWith = (response) => {
    console.log('mockFetchEvent#respondWith has been called with response: ', response);
    mockFetchEvent.response = response.clone();
  };
  mockFetchEvent.waitUntil = async (promise) => {
    console.log('mockFetchEvent#waitUntil has been called with promise: ', promise);
    await promise;
  };
}

/**
 * @param {typeof CURRENT_CACHES[keyof typeof CURRENT_CACHES]} name
 */
async function requestCache(name) {
  return caches.open(name);
}

/**
 * @param {string} mimeType
 * @returns {{ name: string } | null}
 */
function getCacheFromMimeType(mimeType) {
  switch (mimeType) {
    case MIME_TYPES['.css']: {
      return { name: CURRENT_CACHES.css };
    }
    case MIME_TYPES['.gif']: {
      return { name: CURRENT_CACHES.media };
    }
    case MIME_TYPES['.htm']: {
      return { name: CURRENT_CACHES.html };
    }
    case MIME_TYPES['.html']: {
      return { name: CURRENT_CACHES.html };
    }
    case MIME_TYPES['.jpeg']: {
      return { name: CURRENT_CACHES.media };
    }
    case MIME_TYPES['.jpg']: {
      return { name: CURRENT_CACHES.media };
    }
    case MIME_TYPES['.json']: {
      return { name: CURRENT_CACHES.data };
    }
    case MIME_TYPES['.map']: {
      return { name: CURRENT_CACHES.data };
    }
    case MIME_TYPES['.md']: {
      return { name: CURRENT_CACHES.markdown };
    }
    case MIME_TYPES['.pdf']: {
      return { name: CURRENT_CACHES.media };
    }
    case MIME_TYPES['.png']: {
      return { name: CURRENT_CACHES.media };
    }
    case MIME_TYPES['.svg']: {
      return { name: CURRENT_CACHES.media };
    }
    case MIME_TYPES['.ttf']: {
      return { name: CURRENT_CACHES.font };
    }
    case MIME_TYPES['.woff']: {
      return { name: CURRENT_CACHES.font };
    }
    case MIME_TYPES['.woff2']: {
      return { name: CURRENT_CACHES.font };
    }
    case MIME_TYPES['.txt']: {
      return { name: CURRENT_CACHES.html };
    }
    case MIME_TYPES['.webp']: {
      return { name: CURRENT_CACHES.media };
    }
    case MIME_TYPES['.xml']: {
      return { name: CURRENT_CACHES.data };
    }
    default: {
      console.warn('Unknown MIME type: ', mimeType);
      return null;
    }
  }
}

/**
 * @param {string} mimeType
 * @returns {RequestInit}
 */
function getDefaultRequestInit(mimeType) {
  return {
    method: 'GET',
    mode: 'same-origin',
    credentials: 'same-origin',
    cache: 'default',
    headers: {
      Accept: mimeType,
      'Accept-Encoding': 'gzip, deflate, br',
      'Accept-Language': 'en-US,en;q=0.9',
      'User-Agent':
        'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/100.0.4896.75 Safari/537.36'
    }
  };
}
