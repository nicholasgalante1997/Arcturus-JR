import { postRecordSchema, type Post, type PostImage } from '@arcjr/content';

import { isMarkdownDocument, type MarkdownDocument } from './MarkdownDocument';

export type { Post, PostImage };

export interface PostWithMarkdown extends Post {
  markdownContent: MarkdownDocument;
}

// postRecordSchema rejects unknown keys (by design, for build-time frontmatter
// validation — see @arcjr/content). Runtime objects here legitimately carry
// extra fields on top of Post (e.g. PostWithMarkdown's markdownContent), so the
// guard validates against a passthrough variant rather than the strict one.
const postShapeSchema = postRecordSchema.passthrough();

export const isPost = (obj: unknown): obj is Post => postShapeSchema.safeParse(obj).success;

export function isPostWithMarkdown(obj: unknown): obj is PostWithMarkdown {
  const hasMarkdown =
    typeof (obj as PostWithMarkdown)?.markdownContent === 'object' &&
    (obj as PostWithMarkdown)?.markdownContent !== null;
  return isPost(obj) && hasMarkdown && isMarkdownDocument((obj as PostWithMarkdown)?.markdownContent);
}
