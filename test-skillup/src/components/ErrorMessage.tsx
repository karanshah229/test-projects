import { HRButton } from '@hackerrank/hrds-components';
import { useRouter } from 'next/router';
import { useTranslation } from 'next-i18next';

export function ErrorMessage() {
  const { t: translate } = useTranslation('common');
  const router = useRouter();

  return (
    <div className="hr-flex hr-col hr-grow hr-align-center">
      <h2 className="hr-m-t-8">{translate('errors.something_went_wrong')}</h2>
      <div>{translate('errors.error_reported')}</div>

      <HRButton variant="primary" onClick={() => router.reload()} className="hr-m-t-4">
        {translate('errors.reload_btn_text')}
      </HRButton>
    </div>
  );
}
