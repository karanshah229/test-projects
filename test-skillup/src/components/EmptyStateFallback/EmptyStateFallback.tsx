import { HRButton } from '@hackerrank/hrds-components';
import Image from 'next/image';
import { useRouter } from 'next/router';
import { useTranslation } from 'next-i18next';
import { useContext } from 'react';

import { CDN_URL_PREFIX } from 'src/constants/common';
import { PageTransitionLoaderContext } from 'src/contexts/PageTransitionLoaderContext';

type EmptyStateFallbackProps = {
  isFallbackVisible?: boolean;
  height?: string;
  width?: string;
  bgColor?: string;
  imageSrc?: string;
  imageHeight?: number;
  imageWidth?: number;
  title?: string;
  msg?: string;
  textColor?: string;
  ctaBtnUrl?: string;
  ctaBtnText?: string;
};

export function EmptyStateFallback({
  isFallbackVisible = true,
  height = '100%',
  width = '100%',
  bgColor = 'var(--hr-neutral-0)',
  imageSrc = `${CDN_URL_PREFIX}/empty_state.svg`,
  imageHeight = 166,
  imageWidth = 208,
  title = '',
  msg = '',
  textColor = null,
  ctaBtnUrl = '',
  ctaBtnText = '',
}: EmptyStateFallbackProps) {
  const router = useRouter();
  const { setPageLoading } = useContext(PageTransitionLoaderContext);
  const { t: translate } = useTranslation('components/emptyStateFallback');
  if (!isFallbackVisible) return null;

  return (
    <div
      className="hr-flex hr-col hr-align-center hr-justify-center"
      style={{
        background: bgColor,
        height,
        width,
      }}
    >
      <Image alt={translate('image_alt')} src={imageSrc} width={imageHeight} height={imageWidth} />
      <div style={{ width: '40%', textAlign: 'center' }}>
        {title ? <div className="hr-body-04 hr-m-t-2 hr-m-b-0.5">{title}</div> : null}
        {msg ? (
          <div style={{ color: textColor }} className="hr-body-01">
            {msg}
          </div>
        ) : null}
        {ctaBtnUrl ? (
          <HRButton
            className="hr-m-t-1"
            aria-label={translate('cta_button_aria_label')}
            size="medium"
            onClick={() => {
              setPageLoading(true);
              router.push(ctaBtnUrl);
            }}
            variant="primary"
          >
            {ctaBtnText}
          </HRButton>
        ) : null}
      </div>
    </div>
  );
}
