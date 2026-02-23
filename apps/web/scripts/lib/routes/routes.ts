export const NON_DYNAMIC_ROUTES = {
  HOME: 'https://nickgalante.tech/archives/v1',
  CIPHERS: 'https://nickgalante.tech/ee/ciphers',
  POSTS: 'https://nickgalante.tech/archives/v1/posts',
  ABOUT: 'https://nickgalante.tech/archives/v1/about',
  CONTACT: 'https://nickgalante.tech/archives/v1/contact'
} as const;

export const DYNAMIC_ROUTES = {
  CIPHER: 'https://nickgalante.tech/ee/cipher/:id',
  POST: 'https://nickgalante.tech/archives/v1/post/:id'
} as const;
