import { HRAnchor, HRButton } from '@hackerrank/hrds-components';
import { useRouter } from 'next/router';
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';

import { ImageWithLoader } from 'src/components/ImageWithLoader/ImageWithLoader';

export default function PageNotFound() {
  const router = useRouter();
  const { t: translate } = useTranslation('404');

  return (
    <div className="hr-flex hr-col hr-align-center" style={{ gap: 'var(--hr-spacing-04)' }}>
      <h1>{translate('404_title')}</h1>
      <h4>{translate('404_body')}</h4>

      <HRButton variant="primary" onClick={() => router.back()}>
        {translate('back_button')}
      </HRButton>

      <div>
        <ImageWithLoader
          src="https://hrcdn.net/hackerrank/assets/fourohfour.png"
          alt={translate('xkcd_image_alt')}
          width="518"
          height="588"
          priority
        />

        <p>
          {translate('credit')}{' '}
          <HRAnchor href="https://xkcd.com/license.html" target="_blank">
            {translate('xkcd')}
          </HRAnchor>
        </p>
      </div>
    </div>
  );
}

export async function getStaticProps(props) {
  const { locale } = props;

  return {
    props: { ...(await serverSideTranslations(locale, ['common', '404'])) },
  };
}
