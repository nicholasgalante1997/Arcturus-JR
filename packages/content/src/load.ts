import type { z } from 'zod';

import { parseFrontmatter } from './parse';
import {
  type PostFrontmatter,
  postFrontmatterSchema,
  type Post,
  postRecordSchema,
  type RfcFrontmatter,
  rfcFrontmatterSchema,
  type Rfc,
  rfcRecordSchema
} from './schema';

interface SortableRecord {
  id: string;
  date: string;
}

export interface CollectionEntry<Record> {
  id: string;
  record: Record;
  body: string;
}

export interface LoadCollectionOptions<Frontmatter, Record> {
  extension: string;
  frontmatterSchema: z.ZodType<Frontmatter>;
  recordSchema: z.ZodType<Record>;
  deriveRecord: (id: string, frontmatter: Frontmatter, body: string) => unknown;
}

// Glob a collection dir -> validated, sorted records.
// `id` is always the filename stem, never read from frontmatter — enforced
// structurally by the frontmatter schemas rejecting unknown keys (a stray `id:`
// fails validation like any other typo'd key would, same code path).
export async function loadCollection<Frontmatter, Record extends SortableRecord>(
  dir: string,
  options: LoadCollectionOptions<Frontmatter, Record>
): Promise<CollectionEntry<Record>[]> {
  const glob = new Bun.Glob(`*${options.extension}`);
  const files: string[] = [];
  for await (const file of glob.scan({ cwd: dir, onlyFiles: true, absolute: false })) {
    files.push(file);
  }
  files.sort();

  const entries: CollectionEntry<Record>[] = [];
  for (const file of files) {
    const id = file.slice(0, file.length - options.extension.length);
    const filePath = `${dir}/${file}`;
    const text = await Bun.file(filePath).text();
    const { attributes, body } = parseFrontmatter(text);

    const frontmatterResult = options.frontmatterSchema.safeParse(attributes);
    if (!frontmatterResult.success) {
      throw new Error(
        `Invalid frontmatter in ${filePath}:\n${frontmatterResult.error.message}`
      );
    }

    const candidate = options.deriveRecord(id, frontmatterResult.data, body);
    const recordResult = options.recordSchema.safeParse(candidate);
    if (!recordResult.success) {
      throw new Error(
        `Invalid derived record for ${filePath}:\n${recordResult.error.message}`
      );
    }

    entries.push({ id, record: recordResult.data, body });
  }

  entries.sort((a, b) => {
    const dateDiff = new Date(b.record.date).getTime() - new Date(a.record.date).getTime();
    if (dateDiff !== 0) return dateDiff;
    return a.record.id.localeCompare(b.record.id);
  });

  return entries;
}

// ~200 words/minute, rounded up. Only used when frontmatter omits `readingTime` —
// existing hand-written strings are preserved verbatim on backfill (decision #6).
export function computeReadingTime(body: string): string {
  const wordCount = body.trim().split(/\s+/).filter(Boolean).length;
  const minutes = Math.max(1, Math.round(wordCount / 200));
  return minutes === 1 ? 'Under 1 minute' : `About ${minutes} minutes`;
}

export function derivePostRecord(id: string, frontmatter: PostFrontmatter, body: string): unknown {
  return {
    ...frontmatter,
    id,
    slug: frontmatter.slug ?? id,
    searchTerms: frontmatter.searchTerms ?? frontmatter.tags,
    readingTime: frontmatter.readingTime ?? computeReadingTime(body)
  };
}

export function deriveRfcRecord(id: string, frontmatter: RfcFrontmatter, _body: string): unknown {
  return {
    ...frontmatter,
    id,
    updated: frontmatter.updated ?? frontmatter.date
  };
}

export async function loadPosts(dir: string): Promise<CollectionEntry<Post>[]> {
  const entries = await loadCollection(dir, {
    extension: '.md',
    frontmatterSchema: postFrontmatterSchema,
    recordSchema: postRecordSchema,
    deriveRecord: derivePostRecord
  });

  const featuredPosts = entries.filter(({ record }) => record.visible && record.featured);
  if (featuredPosts.length > 1) {
    throw new Error(
      `Only one visible post may be featured; found: ${featuredPosts.map(({ id }) => id).join(', ')}`
    );
  }

  return entries;
}

export function loadRfcs(dir: string): Promise<CollectionEntry<Rfc>[]> {
  return loadCollection(dir, {
    extension: '.txt',
    frontmatterSchema: rfcFrontmatterSchema,
    recordSchema: rfcRecordSchema,
    deriveRecord: deriveRfcRecord
  });
}
