import React, { JSX, Profiler, type ProfilerOnRenderCallback } from 'react';

function getDefaultOnRenderCallback(name: string) {
  return ((id, phase, adur, bdur, tstart, tcommit, ...rest) => {
    console.log(`[Profiler][${id === name ? name : id + '_' + name}] ${phase} - Actual duration: ${adur}ms`, {
      id,
      phase,
      metadata: {
        durations: {
          actual: adur,
          base: bdur,
          startTime: tstart,
          commitTime: tcommit,
          ...rest
        }
      }
    });
  }) as ProfilerOnRenderCallback;
}

export function withProfiler(name: string, customOnRenderCallback?: ProfilerOnRenderCallback) {
  return function <T extends JSX.IntrinsicAttributes>(
    Component: React.ComponentType<T>
  ): React.ComponentType<T> | React.MemoExoticComponent<React.ComponentType<T>> {
    if (process.env.NODE_ENV !== 'development') {
      /**
       * In production, we return the original component to avoid the overhead of the Profiler.
       */
      return Component;
    }

    const onRenderCallback: ProfilerOnRenderCallback =
      customOnRenderCallback || getDefaultOnRenderCallback(name);

    return function ProfilerWrappedComponent(props: T) {
      return (
        <Profiler id={name} onRender={onRenderCallback}>
          <Component {...props} />
        </Profiler>
      );
    };
  };
}
