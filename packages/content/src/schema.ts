import { z } from 'zod';

export const postImageSchema = z.strictObject({
  src: z.string(),
  alt: z.string(),
  aspectRatio: z.string()
});

export type PostImage = z.infer<typeof postImageSchema>;

// As authored in frontmatter — optionals are the fields the identity rules derive
// (see load.ts's deriveRecord). Rejects unknown keys so a stray `id:` or a typo'd
// key fails the build instead of being silently stripped (G3).
export const postFrontmatterSchema = z.strictObject({
  title: z.string().min(1),
  date: z.iso.date(),
  excerpt: z.string().min(1),
  tags: z.array(z.string()).default([]),
  image: postImageSchema,
  category: z.string(),
  subcategory: z.string(),
  slug: z.string().optional(),
  searchTerms: z.array(z.string()).optional(),
  readingTime: z.string().optional(),
  visible: z.boolean().default(false)
});

export type PostFrontmatter = z.infer<typeof postFrontmatterSchema>;

// Resolved manifest record — every field required. This is validated AFTER
// deriveRecord applies the identity/derived-field rules, not what's hand-authored.
export const postRecordSchema = postFrontmatterSchema.extend({
  id: z.string().min(1),
  slug: z.string().min(1),
  searchTerms: z.array(z.string()),
  readingTime: z.string()
});

export type Post = z.infer<typeof postRecordSchema>;

// RFC is NOT post-shaped — no image/category/subcategory/readingTime/searchTerms/slug,
// none of those exist in the current Rfc type. Same unknown-key rejection as posts.
export const rfcFrontmatterSchema = z.strictObject({
  title: z.string().min(1),
  version: z.string().min(1),
  status: z.string().min(1),
  date: z.iso.date(),
  author: z.string().min(1),
  excerpt: z.string().min(1),
  tags: z.array(z.string()).default([]),
  visible: z.boolean().default(false)
});

export type RfcFrontmatter = z.infer<typeof rfcFrontmatterSchema>;

export const rfcRecordSchema = rfcFrontmatterSchema.extend({
  id: z.string().min(1)
});

export type Rfc = z.infer<typeof rfcRecordSchema>;

export const POST_FRONTMATTER_KEY_ORDER = [
  'title',
  'date',
  'excerpt',
  'tags',
  'image',
  'category',
  'subcategory',
  'slug',
  'searchTerms',
  'readingTime',
  'visible'
] as const satisfies ReadonlyArray<keyof PostFrontmatter>;

// Same relative order as POST_FRONTMATTER_KEY_ORDER, with `id` prepended —
// one fixed schema-derived order shared by both frontmatter and manifest output (decision #7).
export const POST_RECORD_KEY_ORDER = [
  'id',
  'title',
  'date',
  'excerpt',
  'tags',
  'image',
  'category',
  'subcategory',
  'slug',
  'searchTerms',
  'readingTime',
  'visible'
] as const satisfies ReadonlyArray<keyof Post>;

export const RFC_FRONTMATTER_KEY_ORDER = [
  'title',
  'version',
  'status',
  'date',
  'author',
  'excerpt',
  'tags',
  'visible'
] as const satisfies ReadonlyArray<keyof RfcFrontmatter>;

export const RFC_RECORD_KEY_ORDER = [
  'id',
  'title',
  'version',
  'status',
  'date',
  'author',
  'excerpt',
  'tags',
  'visible'
] as const satisfies ReadonlyArray<keyof Rfc>;
