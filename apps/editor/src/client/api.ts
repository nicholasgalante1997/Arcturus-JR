import type { Post, PostFrontmatter, Rfc, RfcFrontmatter } from '@arcjr/content';

export type CollectionName = 'posts' | 'rfcs';

export interface SaveDocument<Frontmatter> {
  id: string;
  frontmatter: Frontmatter;
  body: string;
}

interface RebuildResult {
  ok: boolean;
  output: string;
}

interface MutationResponse {
  id: string;
  created?: boolean;
  updated?: boolean;
  deleted?: boolean;
  manifestRebuild: RebuildResult;
}

async function request<T>(input: string, init?: RequestInit): Promise<T> {
  const response = await fetch(input, {
    ...init,
    headers: { 'Content-Type': 'application/json', ...init?.headers }
  });
  const data = await response.json();
  if (!response.ok) {
    const message = typeof data?.error === 'string' ? data.error : `Request failed (${response.status})`;
    throw new Error(message);
  }
  return data as T;
}

export const api = {
  listPosts: () => request<Post[]>('/api/posts'),
  getPost: (id: string) => request<{ id: string; frontmatter: PostFrontmatter; body: string }>(`/api/posts/${id}`),
  createPost: (doc: SaveDocument<PostFrontmatter>) =>
    request<MutationResponse>('/api/posts', { method: 'POST', body: JSON.stringify(doc) }),
  updatePost: (doc: SaveDocument<PostFrontmatter>) =>
    request<MutationResponse>(`/api/posts/${doc.id}`, {
      method: 'PUT',
      body: JSON.stringify({ frontmatter: doc.frontmatter, body: doc.body })
    }),
  deletePost: (id: string) => request<MutationResponse>(`/api/posts/${id}`, { method: 'DELETE' }),

  listRfcs: () => request<Rfc[]>('/api/rfcs'),
  getRfc: (id: string) => request<{ id: string; frontmatter: RfcFrontmatter; body: string }>(`/api/rfcs/${id}`),
  createRfc: (doc: SaveDocument<RfcFrontmatter>) =>
    request<MutationResponse>('/api/rfcs', { method: 'POST', body: JSON.stringify(doc) }),
  updateRfc: (doc: SaveDocument<RfcFrontmatter>) =>
    request<MutationResponse>(`/api/rfcs/${doc.id}`, {
      method: 'PUT',
      body: JSON.stringify({ frontmatter: doc.frontmatter, body: doc.body })
    }),
  deleteRfc: (id: string) => request<MutationResponse>(`/api/rfcs/${id}`, { method: 'DELETE' }),

  listAssets: () => request<string[]>('/api/assets')
};
