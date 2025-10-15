import { getMarkdown } from '@/hooks/useMarkdown';
import { getPost } from '@/hooks/usePost';
import { getPosts } from '@/hooks/usePosts';

import { StaticPageObject } from './types/static-page';
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
    ...createStaticPostPageObjects()
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
