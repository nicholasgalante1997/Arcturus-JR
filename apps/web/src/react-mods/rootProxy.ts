import { hydrateRoot } from 'react-dom/client';

/**
 * We can use metaprogramming (Proxy, Reflect)
 * to get a better level of observability into our React App.
 *
 * Don't bog down the prerendering MR with this yet,
 * just set up a shell you can use later
 *
 * NOTE we likely only want to introduce overhead in a dev env
 */
export function withRootProxy(root: ReturnType<typeof hydrateRoot>) {
  return new Proxy(root, {
    get(target, property, receiver) {
      return Reflect.get(target, property, receiver);
    }
  });
}
