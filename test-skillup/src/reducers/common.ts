import { removeEmptyEnteries } from 'src/utils/common';

export function commonReducer<T extends object>(state: Partial<T>, action: any) {
  return removeEmptyEnteries<T>({
    ...state,
    ...(typeof action === 'function' ? action(state as T) : action),
  });
}
