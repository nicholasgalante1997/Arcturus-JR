import { getJavascriptEnvironment } from '@/utils/env';

import BrowserPostsService from './browser/PostsService';
import { type IPostsService } from './types';

import type { Post, PostWithMarkdown } from '@/types/Post';

interface PostsServiceState {
  initialized: boolean;
  runtime: 'browser' | 'server';
}

class PostsService implements IPostsService {
  private _state: PostsServiceState;
  private _client: IPostsService | null = null;

  constructor() {
    this._state = {
      initialized: false,
      runtime: getJavascriptEnvironment()
    };
  }

  async initialize() {
    if (this._state.initialized) return;

    if (this._state.runtime === 'browser') {
      this._client = new BrowserPostsService();
    } else {
      const { default: ServerPostsService } = await import(
        /* webpackExclude: /\.(js|jsx|ts|tsx)$/ */
        './server/PostsService'
      );
      this._client = new ServerPostsService();
    }

    this._state.initialized = true;
  }

  async fetchPosts(): Promise<Array<Post>> {
    if (!this._state.initialized) {
      try {
        await this.initialize();
      } catch (e) {
        console.error('An error occurred while trying to initialize PostsService');
        throw e;
      }
    }

    try {
      if (this._client) {
        return this._client.fetchPosts();
      }

      throw new Error('PostsService _client is not initialized!');
    } catch (error) {
      console.error('Posts[fetchPosts]: has thrown an error:', error);
      console.error('Error fetching posts:', error);
      throw error;
    }
  }

  async fetchPost(id: string): Promise<PostWithMarkdown> {
    if (!this._state.initialized) {
      try {
        await this.initialize();
      } catch (e) {
        console.error('An error occurred while trying to initialize PostsService');
        throw e;
      }
    }

    try {
      if (this._client) {
        return this._client.fetchPost(id);
      }

      throw new Error('PostsService _client is not initialized!');
    } catch (e) {
      console.error('An error occurred in an instance of "Posts" during execution of fn "fetchPosts"');
      console.error('Error fetching post:', e);
      throw e;
    }
  }
}

export default PostsService;
