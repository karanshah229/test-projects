import { HRButton } from '@hackerrank/hrds-components';
import { useRouter } from 'next/router';
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';

import { APIErrorFallback } from 'src/components/APIErrorFallback/APIErrorFallback';

export default function PageNotFound() {
  const router = useRouter();
  const { t: translate } = useTranslation('403');

  return (
    <div className="hr-flex hr-col hr-align-center" style={{ gap: '10px', paddingTop: '100px' }}>
      <h1 className="hr-heading-02" style={{ marginBottom: '6px' }}>
        {translate('403_title')}
      </h1>
      <div className="hr-body-03">{translate('403_para_1')}</div>

      <APIErrorFallback message="" imageHeight={60} imageWidth={251} className="hr-m-t-2" />

      <HRButton variant="primary" onClick={() => router.back()}>
        {translate('back_button')}
      </HRButton>
    </div>
  );
}

export async function getServerSideProps(props) {
  const { locale } = props;

  return {
    props: { ...(await serverSideTranslations(locale, ['common', '403'])) },
  };
}
