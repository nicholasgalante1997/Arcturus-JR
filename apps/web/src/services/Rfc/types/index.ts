import type { Rfc, RfcWithContent } from '@/types/Rfc';

export interface IRfcService {
  fetchRfcs(): Promise<Array<Rfc>>;
  fetchRfc(id: string): Promise<RfcWithContent>;
}
