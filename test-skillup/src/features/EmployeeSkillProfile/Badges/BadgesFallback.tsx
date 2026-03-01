import { useTranslation } from 'next-i18next';

import { ImageWithLoader } from 'src/components/ImageWithLoader/ImageWithLoader';
import { CDN_ASSET_FOLDER_PATH, CDN_URL_PREFIX } from 'src/constants/common';

function BadgesFallback() {
  const { t: translate } = useTranslation('components/badge');
  return (
    <div className="hr-flex hr-col hr-align-center">
      <ImageWithLoader
        alt={translate('Badges.no_badges_image_alt')}
        width="260"
        height="166"
        src={`${CDN_URL_PREFIX}${CDN_ASSET_FOLDER_PATH.badge}/no_badges_earned.svg`}
      />
      <span className="hr-m-t-0.75 hr-p-x-2 hr-body-01">{translate('no_badges_text')}</span>
    </div>
  );
}

export { BadgesFallback };
