export function isCipherJSON(value: unknown): value is CipherJSON {
  if (typeof value !== 'object' || value === null) {
    return false;
  }

  if (!('cipher_name' in value)) return false;
  if (!('readable_name' in value)) return false;
  if (!('estimated_completion_time' in value)) return false;

  return true;
}

export function isCipherDTO(value: unknown): value is CipherDTO {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return isCipherJSON(value) && !!(value as any)?.cipher_text;
}

export type CipherJSON = {
  cipher_name: string;
  readable_name: string;
  estimated_completion_time: { novice: string; intermediate: string; expert: string };
};

export interface ICipherFetchService {
  fetchCipherText(cipher_name: string): Promise<CipherDTO>;
  fetchCipherTextsIndex(): Promise<Array<CipherJSON>>;
}

export type CipherMetadata = CipherJSON;
export interface CipherDTO extends CipherMetadata {
  cipher_text: string;
}

export interface BrowserCipherFetchServiceInternalCache {
  ciphers_index: Array<CipherJSON> | null;
  cipher_texts: Map<string, string>;
}
