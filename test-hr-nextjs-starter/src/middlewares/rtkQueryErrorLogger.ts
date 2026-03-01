import { isRejectedWithValue } from '@reduxjs/toolkit';

import { logger } from 'src/utils/logger';

import type { Middleware, MiddlewareAPI } from '@reduxjs/toolkit';

export const rtkQueryErrorLogger: Middleware = (_api: MiddlewareAPI) => (next) => (action) => {
  if (isRejectedWithValue(action)) {
    logger.error({
      message: `Error in API call ${action?.meta?.baseQueryMeta?.request?.url}`,
      error: action,
    });
  }

  return next(action);
};
