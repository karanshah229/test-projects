import { useTranslation } from 'next-i18next';

export function ErrorMessage() {
  const { t: translate } = useTranslation('common');

  return (
    <div>
      <div>{translate('errors.something_went_wrong')}</div>
      <div>{translate('errors.try_again')}</div>
    </div>
  );
}
