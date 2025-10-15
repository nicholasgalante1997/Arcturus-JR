import _posts from '@public/content/posts.json';

export const posts = _posts.filter(({ visible }) => visible);

export const slugs = posts.map((post) => post.id);
