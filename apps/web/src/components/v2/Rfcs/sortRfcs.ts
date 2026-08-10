import type { Rfc } from '@/types/Rfc';

export function sortRfcs(rfcs: readonly Rfc[]): Rfc[] {
  return [...rfcs].sort((a, b) => {
    const updatedDifference =
      new Date(b.updated).getTime() - new Date(a.updated).getTime();
    if (updatedDifference !== 0) return updatedDifference;
    return a.code.localeCompare(b.code);
  });
}
