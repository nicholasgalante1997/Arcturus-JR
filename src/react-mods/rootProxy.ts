import { hydrateRoot } from 'react-dom/client';

export function withRootProxy(root: ReturnType<typeof hydrateRoot>) {
  return new Proxy(root, {
    get(target, property, receiver) {
      return Reflect.get(target, property, receiver);
    }
  });
}
