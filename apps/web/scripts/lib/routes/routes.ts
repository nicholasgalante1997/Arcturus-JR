export const NON_DYNAMIC_ROUTES = {
  HOME: 'https://nickgalante.tech/',
  CIPHERS: 'https://nickgalante.tech/ee/ciphers',
  POSTS: 'https://nickgalante.tech/posts',
  ABOUT: 'https://nickgalante.tech/about',
  CONTACT: 'https://nickgalante.tech/contact'
} as const;

export const DYNAMIC_ROUTES = {
  CIPHER: 'https://nickgalante.tech/ee/cipher/:id',
  POST: 'https://nickgalante.tech/post/:id'
} as const;
