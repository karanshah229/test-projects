import { useTranslation } from 'next-i18next';

import { CDN_URL_PREFIX } from 'src/constants/common';

import { ImageWithLoader } from '../ImageWithLoader/ImageWithLoader';

function APIErrorFallback({
  message,
  imageHeight,
  imageWidth,
  className,
}: {
  message?: React.ReactNode;
  imageHeight?: number;
  imageWidth?: number;
  className?: string;
}) {
  const { t: translate } = useTranslation('common');

  const msg = message?.toString() ?? translate('errors.api_error');

  const apiErrorImgHeight = imageHeight || 40;
  const apiErrorImgWidth = imageWidth || 170;
  const apiErrorImgAlt = msg;

  return (
    <div className={`hr-flex hr-col hr-align-center hr-p-2 ${className ?? ''}`}>
      <ImageWithLoader
        src={`${CDN_URL_PREFIX}/api_error.svg`}
        alt={apiErrorImgAlt}
        width={apiErrorImgWidth}
        height={apiErrorImgHeight}
      />
      <div className="hr-m-t-2" style={{ textAlign: 'center' }}>
        {msg}
      </div>
    </div>
  );
}

export { APIErrorFallback };
