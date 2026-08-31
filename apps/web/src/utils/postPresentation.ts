import { format, parseISO } from 'date-fns';

export function formatPostCategory(category: string): string {
  return category
    .toLocaleLowerCase()
    .replace(/\b\p{L}/gu, (letter) => letter.toLocaleUpperCase());
}

export function formatPostDate(date: string): string {
  return format(parseISO(date), 'MMMM d, yyyy');
}
