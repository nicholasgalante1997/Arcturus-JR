import { getCipher } from '@/hooks/useCipher';
import { getCiphers } from '@/hooks/useCiphers';
import { getMarkdown } from '@/hooks/useMarkdown';
import { getPost } from '@/hooks/usePost';
import { getPosts } from '@/hooks/usePosts';

import { StaticPageObject } from './types/static-page';
import { cipher_slugs } from './ciphers';
import { slugs } from './posts';
import { DYNAMIC_ROUTES, NON_DYNAMIC_ROUTES } from './routes';

const BASE_CSS_STYLES = ['/css/styles.min.css', '/css/themes/sb.min.css'];
const VOID_CSS_STYLES = ['/css/themes/void/void.css'];

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
      ],
      styles: [...BASE_CSS_STYLES]
    },
    {
      path: NON_DYNAMIC_ROUTES.ABOUT,
      queries: [
        {
          queryKey: ['markdown', '/content/about.md'],
          queryFn: () => getMarkdown('/content/about.md')
        }
      ],
      styles: [...BASE_CSS_STYLES]
    },
    {
      path: NON_DYNAMIC_ROUTES.CONTACT,
      queries: [],
      styles: [...BASE_CSS_STYLES, '/css/contact.min.css']
    },
    {
      path: NON_DYNAMIC_ROUTES.POSTS,
      queries: [
        {
          queryKey: ['posts'],
          queryFn: () => getPosts()
        }
      ],
      styles: [...BASE_CSS_STYLES, '/css/post.min.css']
    },
    ...createStaticPostPageObjects(),
    {
      path: NON_DYNAMIC_ROUTES.CIPHERS,
      queries: [
        {
          queryKey: ['ciphers'],
          queryFn: () => getCiphers()
        }
      ],
      styles: [...VOID_CSS_STYLES]
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
    ],
    styles: [...BASE_CSS_STYLES, '/css/post.min.css']
  }));
}

function createStaticCipherPageObjects(): StaticPageObject[] {
  return cipher_slugs.map((cipher_name) => ({
    path: DYNAMIC_ROUTES.CIPHER.replace(':id', encodeURIComponent(cipher_name)),
    queries: [
      {
        queryKey: ['cipher', cipher_name],
        queryFn: () => getCipher(cipher_name)
      }
    ],
    styles: [...VOID_CSS_STYLES]
  }));
}
