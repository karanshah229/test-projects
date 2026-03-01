import dayjs, { Dayjs } from 'dayjs';
import get from 'lodash/get';
import set from 'lodash/set';
import unset from 'lodash/unset';

import { isServer } from 'src/utils/common';

type RefreshTokenResponseCookiesCacheEntryType = {
  refreshCallResponseCookies: Array<string>;
  created_at: Dayjs;
};

const serverGlobals: { [key: string]: any | RefreshTokenResponseCookiesCacheEntryType } = {};

export function getServerGlobal(key?: string) {
  if (isServer) {
    if (!key) return serverGlobals;
    return get(serverGlobals, key);
  }
  throw new Error('Error: Cannot access ServerGlobals on Client');
}

export function setServerGlobal(key: string, val: any) {
  if (isServer) {
    set(serverGlobals, key, val);
    return;
  }
  throw new Error('Error: Cannot set ServerGlobals on Client');
}

export function deleteServerGlobal(key: string) {
  if (isServer) {
    if (key in serverGlobals) return unset(serverGlobals, key);
    return false;
  }
  throw new Error('Error: Cannot access ServerGlobals on Client');
}

export function pruneJWTTokens() {
  // Log metrics to New Relic
  if (isServer) {
    if ('refreshTokenResponseCookiesCache' in serverGlobals) {
      Object.entries(serverGlobals.refreshTokenResponseCookiesCache).forEach(
        ([key, val]: [key: string, val: RefreshTokenResponseCookiesCacheEntryType]) => {
          if (val.created_at.isBefore(dayjs().subtract(15, 'seconds'))) {
            delete serverGlobals.refreshTokenResponseCookiesCache[key];
            delete serverGlobals.mutexCache[key];
          }
        },
      );
    }
  }
  throw new Error('Error: Cannot prune ServerGlobals on Client');
}
