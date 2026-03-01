import { HRHeader } from '@hackerrank/hrds-components';

import { BrandWithLogoAndTitle } from './BrandWithLogoAndTitle';
import { HeaderActions } from './HeaderActions/HeaderActions';
import { HeaderNavLinks } from './HeaderNavLinks/HeaderNavLinks';

function AppHeader() {
  return (
    <HRHeader
      brand={<BrandWithLogoAndTitle />}
      navigation={<HeaderNavLinks />}
      actions={<HeaderActions />}
    />
  );
}

export { AppHeader };
