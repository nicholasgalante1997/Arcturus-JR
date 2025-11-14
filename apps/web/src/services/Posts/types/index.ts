import { type Post, type PostWithMarkdown } from '@/types/Post';

export interface IPostsService {
  fetchPosts(): Promise<Array<Post>>;
  fetchPost(id: string): Promise<PostWithMarkdown>;
}
