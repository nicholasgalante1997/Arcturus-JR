import CacheWithExpiry from '@/models/CacheWithExpiry';
import { fetchWithTimeout } from '@/utils/fetchWithTimeout';

import type { IRfcService } from '../types';
import type { Rfc, RfcWithContent } from '@/types/Rfc';

interface RfcStaticCache {
  rfcs?: Rfc[];
  rfc: CacheWithExpiry<string, RfcWithContent>;
}

class BrowserRfcService implements IRfcService {
  private static __endpoint = '/content/rfcs.json';
  private static __caches: RfcStaticCache = {
    rfc: new CacheWithExpiry<string, RfcWithContent>()
  };
  private static get __hasCachedRfcs(): boolean {
    return Boolean(BrowserRfcService.__caches?.rfcs && BrowserRfcService.__caches.rfcs.length);
  }

  async fetchRfcs(): Promise<Array<Rfc>> {
    if (BrowserRfcService.__hasCachedRfcs) return BrowserRfcService.__caches.rfcs as Rfc[];

    try {
      const response = await fetchWithTimeout(BrowserRfcService.__endpoint, {
        cache: 'default',
        mode: 'same-origin',
        headers: {
          Accept: 'application/json',
          'Accept-Encoding': 'gzip, br',
          'X-Client-ID': 'minvans-swa'
        },
        method: 'GET',
        priority: 'high'
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const rfcs: Rfc[] = await response.json();

      if (!rfcs || rfcs.length === 0) {
        console.error('No RFCs Found, rfcs: ', rfcs);
        throw new Error('No RFCs found');
      }

      const sorted = rfcs
        .filter((rfc) => rfc.visible)
        .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

      BrowserRfcService.__caches.rfcs = sorted;
      return sorted;
    } catch (error) {
      console.error('RfcService[fetchRfcs]: has thrown an error:', error);
      throw error;
    }
  }

  async fetchRfc(id: string): Promise<RfcWithContent> {
    if (BrowserRfcService.__caches.rfc.has(id)) return BrowserRfcService.__caches.rfc.get(id) as RfcWithContent;

    try {
      const rfcs = await this.fetchRfcs();
      const rfc = rfcs.find((rfc) => rfc.id === id);

      if (!rfc) {
        throw new Error(`RFC not found: ${id}`);
      }

      const response = await fetchWithTimeout(`/content/rfcs/${id}.txt`, {
        cache: 'default',
        mode: 'same-origin',
        headers: {
          Accept: 'text/plain',
          'Accept-Encoding': 'gzip, br',
          'X-Client-ID': 'minvans-swa'
        },
        method: 'GET'
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const content = await response.text();
      if (content === '') throw new Error(`RFC file is empty: ${id}`);

      const rfcWithContent: RfcWithContent = { ...rfc, content };
      BrowserRfcService.__caches.rfc.set(id, rfcWithContent);
      return rfcWithContent;
    } catch (e) {
      console.error('RfcService[fetchRfc]: has thrown an error:', e);
      throw e;
    }
  }
}

export default BrowserRfcService;
