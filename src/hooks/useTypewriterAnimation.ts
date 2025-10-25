import { useEffect, useState } from 'react';

import { runTypewriterAnimation } from '@/animation/typing';
import { jlog } from '@/utils/log';

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
          jlog.label('react-hooks', 'use-typewriter-animation');
          jlog('Running typewriter animation!');
          jlog.unlabel();

          runTypewriterAnimation(element);
        }, 400);
        setAnimationTimeoutRef(timeout);
      }
    }
  }, [enabled, animationTimeoutRef]);
};
