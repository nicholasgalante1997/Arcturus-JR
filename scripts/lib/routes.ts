export const NON_DYNAMIC_ROUTES = {
  HOME: 'https://nickgalante.tech/',
  POSTS: 'https://nickgalante.tech/posts',
  ABOUT: 'https://nickgalante.tech/about',
  CONTACT: 'https://nickgalante.tech/contact'
} as const;
export const DYNAMIC_ROUTES = { POST: 'https://nickgalante.tech/post/:id' } as const;
