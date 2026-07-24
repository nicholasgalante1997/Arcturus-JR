import fm from 'front-matter';

export interface ParsedContent<T = unknown> {
  attributes: T;
  body: string;
}

// Pure primitive: no validation, no schema coupling. Callers validate `attributes`
// against the appropriate Zod schema (postFrontmatterSchema / rfcFrontmatterSchema).
export function parseFrontmatter<T = unknown>(text: string): ParsedContent<T> {
  const parsed = fm<T>(text);
  return {
    attributes: parsed.attributes,
    body: parsed.body
  };
}
