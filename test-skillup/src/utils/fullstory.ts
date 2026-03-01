import { UserDetailsType } from 'src/types/api/User';

import { isClient } from './common';

export function identifyFullstoryUser({ user = {} as UserDetailsType }: { user: UserDetailsType }) {
  if (
    isClient &&
    (window as any)?.SKILLUP_FS?.identify &&
    typeof (window as any).SKILLUP_FS.identify === 'function' &&
    user.data?.id
  ) {
    // Do not add PII data to fullstory
    (window as any).SKILLUP_FS.identify(user.data.id);
  }
}
