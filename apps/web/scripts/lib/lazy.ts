function lazyInitDynamicClassConstructor<T extends { new (...args: unknown[]): InstanceType<T> }>(
  instance: InstanceType<T> | null,
  DynamicConstructor: T,
  ...constructorOptions: unknown[]
) {
  if (instance === null) {
    return (instance = new DynamicConstructor(...constructorOptions));
  }
  return instance;
}

const lazy = {
  initDynConstructor: lazyInitDynamicClassConstructor.bind(null)
};

export default lazy;
