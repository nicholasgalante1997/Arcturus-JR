import type { CipherEncryptionOptions } from "@/types/Ciphers";

export interface CipherOptions {
    input: string;
    cipher_keyfile: string;
    output: string;
    estimated_completion_times: CipherMetadata['estimated_completion_time'];
    encryption_options?: CipherEncryptionOptions; 
}

export type UnitOfTimeString = 'm' | 'h' | 's' | 'd' | 'mo';
export type Duration = `${number}${UnitOfTimeString}`;

export type CreateCipherMetadataOptions = {
  name: string;
  estimated_completion_time: [Duration, Duration, Duration];
};

export interface CipherMetadata {
  cipher_name: string;
  readable_name: string;
  estimated_completion_time: {
    novice: Duration;
    intermediate: Duration;
    expert: Duration;
  };
}
