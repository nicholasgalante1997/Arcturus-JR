import path from 'path';

import type { IRfcService } from '../types';
import type { Rfc, RfcWithContent } from '@/types/Rfc';

class ServerRfcService implements IRfcService {
  private rfcs: Array<Rfc> | null = null;

  async fetchRfcs(): Promise<Array<Rfc>> {
    if (this.rfcs) return this.rfcs;
    try {
      const _path = path.resolve(process.cwd(), 'public', 'content', 'rfcs.json');
      const rfcs = await Bun.file(_path).json();
      if (Array.isArray(rfcs) && rfcs.length > 0) {
        this.rfcs = rfcs
          .filter((rfc) => rfc?.visible)
          .sort((a, b) => {
            const updatedDifference =
              new Date(b.updated).getTime() - new Date(a.updated).getTime();
            return updatedDifference || a.code.localeCompare(b.code);
          });
        return this.rfcs;
      }

      throw new Error('Unable to load rfcs');
    } catch (e) {
      console.error('Error fetching rfcs:', e);
      throw e;
    }
  }

  async fetchRfc(id: string): Promise<RfcWithContent> {
    const rfcs = this.rfcs || (await this.fetchRfcs());
    const rfc = rfcs.find((rfc) => rfc.id === id);
    if (!rfc) {
      throw new Error(`RFC not found: ${id}`);
    }

    try {
      const contentPath = path.resolve(process.cwd(), 'public', 'content', 'rfcs', `${id}.txt`);
      const file = Bun.file(contentPath, { type: 'text/plain' });
      const content = await file.text();
      if (content === '') throw new Error(`RFC file is empty: ${id}`);
      return { ...rfc, content };
    } catch (error) {
      console.error('Error fetching RFC content:', error);
      throw error;
    }
  }
}

export default ServerRfcService;
