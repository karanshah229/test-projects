import { HRAnchor } from '@hackerrank/hrds-components';
import { useTranslation } from 'next-i18next';
import { SyntheticEventData } from 'react-dom/test-utils';

function BadgesCardTitle({
  showViewAllBtn,
  viewAllClicked,
  setViewAllClicked,
}: {
  showViewAllBtn: boolean;
  viewAllClicked: boolean;
  setViewAllClicked: Function;
}) {
  const { t: translate } = useTranslation('employeeSkillProfile');

  return (
    <span className="hr-flex hr-justify-between hr-align-center">
      <span className="hr-body-04">{translate('Badges.badges')}</span>
      {showViewAllBtn && (
        <HRAnchor
          underline="none"
          variant="medium"
          onClick={(e: SyntheticEventData) => {
            e.preventDefault();
            setViewAllClicked(!viewAllClicked);
          }}
          color="var(--hr-neutral-50)"
          style={{
            fontWeight: '400',
          }}
        >
          {viewAllClicked ? translate('Badges.collapse') : translate('Badges.view_all')}
        </HRAnchor>
      )}
    </span>
  );
}

export { BadgesCardTitle };
