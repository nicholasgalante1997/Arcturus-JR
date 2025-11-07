import { getCipher } from '@/hooks/useCipher';
import { getCiphers } from '@/hooks/useCiphers';
import { getMarkdown } from '@/hooks/useMarkdown';
import { getPost } from '@/hooks/usePost';
import { getPosts } from '@/hooks/usePosts';

import { StaticPageObject } from './types/static-page';
import { cipher_slugs } from './ciphers';
import { slugs } from './posts';
import { DYNAMIC_ROUTES, NON_DYNAMIC_ROUTES } from './routes';

export function createStaticPageObjects(): StaticPageObject[] {
  return [
    {
      path: NON_DYNAMIC_ROUTES.HOME,
      queries: [
        {
          queryKey: ['markdown', '/content/home.md'],
          queryFn: () => getMarkdown('/content/home.md')
        },
        {
          queryKey: ['posts'],
          queryFn: () => getPosts()
        }
      ]
    },
    {
      path: NON_DYNAMIC_ROUTES.ABOUT,
      queries: [
        {
          queryKey: ['markdown', '/content/about.md'],
          queryFn: () => getMarkdown('/content/about.md')
        }
      ]
    },
    {
      path: NON_DYNAMIC_ROUTES.CONTACT,
      queries: []
    },
    {
      path: NON_DYNAMIC_ROUTES.POSTS,
      queries: [
        {
          queryKey: ['posts'],
          queryFn: () => getPosts()
        }
      ]
    },
    ...createStaticPostPageObjects(),
    {
      path: NON_DYNAMIC_ROUTES.CIPHERS,
      queries: [
        {
          queryKey: ['ciphers'],
          queryFn: () => getCiphers()
        }
      ]
    },
    ...createStaticCipherPageObjects()
  ];
}

function createStaticPostPageObjects(): StaticPageObject[] {
  return slugs.map((postId) => ({
    path: DYNAMIC_ROUTES.POST.replace(':id', encodeURIComponent(postId)),
    queries: [
      {
        queryKey: ['post', postId],
        queryFn: () => getPost(postId)
      }
    ]
  }));
}

function createStaticCipherPageObjects(): StaticPageObject[] {
  return cipher_slugs.map((cipher_name) => ({
    path: DYNAMIC_ROUTES.POST.replace(':id', encodeURIComponent(cipher_name)),
    queries: [
      {
        queryKey: ['cipher', cipher_name],
        queryFn: () => getCipher(cipher_name)
      }
    ]
  }));
}
