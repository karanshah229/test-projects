import { HRHeaderActionsBar } from '@hackerrank/hrds-components';

import { HeaderActionsSearch } from './HeaderActionsSearch';
import { UserSubMenu } from './UserSubMenu/UserSubMenu';

function HeaderActions() {
  return (
    <HRHeaderActionsBar>
      <HeaderActionsSearch />
      <UserSubMenu />
    </HRHeaderActionsBar>
  );
}

export { HeaderActions };
