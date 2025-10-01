import { createRoot } from 'react-dom/client';

export function withRootProxy(root: ReturnType<typeof createRoot>) {
  return new Proxy(root, {
    get(target, property, receiver) {
      return Reflect.get(target, property, receiver);
    }
  });
}
