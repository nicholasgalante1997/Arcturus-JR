import { useEffect, useState } from 'react';

import { runTypewriterAnimation } from '@/animation/typing';

export interface UseTypewriterAnimationOptions {
  enabled?: boolean;
  element?: HTMLElement | null;
}

export const useTypewriterAnimation = ({ element, enabled }: UseTypewriterAnimationOptions) => {
  const [animationTimeoutRef, setAnimationTimeoutRef] = useState<NodeJS.Timeout | null>(null);
  useEffect(() => {
    if (enabled) {
      if (element && !animationTimeoutRef) {
        const timeout = setTimeout(() => {
          console.log('Running typewriter animation')
          runTypewriterAnimation(element);
        }, 400);
        setAnimationTimeoutRef(timeout);
      }
    }
  }, [enabled, animationTimeoutRef]);
};
