import { useIsomorphicLayoutEffect } from './useIsomorphicLayoutEffect';

export function useResizeObserver<T extends HTMLElement>(
  ref: React.RefObject<T>,
  callback: (target: T, entry: ResizeObserverEntry) => void,
) {
  useIsomorphicLayoutEffect(() => {
    const element = ref?.current;

    if (!element) {
      return undefined;
    }

    const observer = new ResizeObserver((entries) => {
      callback(element, entries[0]);
    });

    observer.observe(element);
    return () => observer.disconnect();
  }, [callback, ref]);
}
