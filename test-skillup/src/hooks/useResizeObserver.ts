import { useRef } from 'react';

import { useIsomorphicLayoutEffect } from './useIsomorphicLayoutEffect';

export function useResizeObserver<T extends HTMLElement>(
  callback: (target: T, entry: ResizeObserverEntry) => void,
) {
  const ref = useRef<T>(null);

  useIsomorphicLayoutEffect(() => {
    const element = ref?.current;

    if (!element) {
      return null;
    }

    const observer = new ResizeObserver((entries) => {
      callback(element, entries[0]);
    });

    observer.observe(element);
    return () => observer.disconnect();
  }, [callback, ref]);

  return ref;
}
