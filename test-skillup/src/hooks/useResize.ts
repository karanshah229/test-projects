import { useCallback, useEffect, useState } from 'react';

import { debounce } from 'src/utils/common';

import { useIsomorphicLayoutEffect } from './useIsomorphicLayoutEffect';

export const useResize = (componentRef) => {
  const [dimension, setDimension] = useState({
    width: 0,
    height: 0,
  });

  const handleResize = useCallback(() => {
    if (componentRef.current) {
      setDimension({
        width: componentRef.current.offsetWidth,
        height: componentRef.current.offsetHeight,
      });
    }
  }, [componentRef]);

  useIsomorphicLayoutEffect(() => {
    handleResize();
  }, []);

  useEffect(() => {
    const handleResizeDebounced = debounce(handleResize, 300);

    window.addEventListener('DOMContentLoaded', handleResizeDebounced);
    window.addEventListener('resize', handleResizeDebounced);

    return () => {
      window.removeEventListener('DOMContentLoaded', handleResizeDebounced);
      window.removeEventListener('resize', handleResizeDebounced);
    };
  }, [componentRef, handleResize]);

  return dimension;
};
