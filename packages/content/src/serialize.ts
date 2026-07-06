import yaml from 'js-yaml';

// Writes frontmatter with keys in `keyOrder`, never alphabetical, never
// insertion-order-of-object — the caller derives `keyOrder` from the schema's
// declared shape (see schema.ts's *_KEY_ORDER constants).
export function serializeFrontmatter(
  attributes: Record<string, unknown>,
  body: string,
  keyOrder: readonly string[]
): string {
  const ordered: Record<string, unknown> = {};
  for (const key of keyOrder) {
    if (key in attributes && attributes[key] !== undefined) {
      ordered[key] = attributes[key];
    }
  }

  const frontmatterYaml = yaml.dump(ordered, {
    indent: 2,
    lineWidth: -1,
    noRefs: true,
    sortKeys: false
  });

  return `---\n${frontmatterYaml}---\n\n${body}`;
}
