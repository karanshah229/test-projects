import { HRDrawer, HRDrawerContext, HRToggleGroup } from '@hackerrank/hrds-components';
import { useTranslation } from 'next-i18next';
import { useContext, useReducer, useState } from 'react';

import { DrawerContextType } from 'src/types/common';

import { CertificationsTab } from './CertificationsTab/CertificationsTab';
import { CertifiedInsightsSidebar, SkillsInsightsSidebar } from './InsightsSidebar/InsightsSidebar';
import { SkillsTab } from './SkillsTab/SkillsTab';
import { OVERVIEW_TAB_DATA } from './constants';
import { DrawerStateType, OverviewTabDataType } from './types';

function OverviewTab({ currentTab }: { currentTab: OverviewTabDataType }) {
  const { isOpen } = useContext<DrawerContextType>(HRDrawerContext);
  const initialDrawerState: DrawerStateType = {
    id: '',
    name: '',
    currentTab: OVERVIEW_TAB_DATA[0],
  };
  const [drawerState, setIsDrawerOpen] = useReducer(
    (state, newState) => ({ ...state, ...newState }),
    initialDrawerState,
  );

  switch (currentTab) {
    case OVERVIEW_TAB_DATA[0]:
      return (
        <>
          <HRDrawer.Root title={drawerState.name} isOpen={isOpen} size="lg">
            <HRDrawer.Body>
              {drawerState.id && <CertifiedInsightsSidebar id={drawerState.id} />}
            </HRDrawer.Body>
          </HRDrawer.Root>
          <CertificationsTab setIsDrawerOpen={setIsDrawerOpen} />
        </>
      );
    case OVERVIEW_TAB_DATA[1]:
      return (
        <>
          <HRDrawer.Root title={drawerState.name} isOpen={isOpen} size="lg">
            <HRDrawer.Body>
              {drawerState.id && <SkillsInsightsSidebar id={drawerState.id} />}
            </HRDrawer.Body>
          </HRDrawer.Root>
          <SkillsTab setIsDrawerOpen={setIsDrawerOpen} />
        </>
      );
    default:
      return null;
  }
}

function OrganisationOverview() {
  const { t: translate } = useTranslation('organisationOverview');
  const [currentTab, setCurrentTab] = useState<OverviewTabDataType>(OVERVIEW_TAB_DATA[0]);
  const onTabChange = (value: OverviewTabDataType) => {
    if (value) {
      setCurrentTab(value);
    }
  };

  return (
    <main className="hr-grow hr-grid-container w-100 hr-m-y-0.75">
      <div className="hr-grid-row">
        <div className="hr-grid-col-12">
          <h3 className="hr-heading-03 hr-m-b-0.75">{translate('page_header')}</h3>

          <HRToggleGroup.Root value={currentTab} onValueChange={onTabChange} aria-label="roles">
            {OVERVIEW_TAB_DATA.map((overviewTabLabel) => (
              <HRToggleGroup.Item
                key={overviewTabLabel}
                title={translate(`page_toggle.${overviewTabLabel}`)}
                value={overviewTabLabel}
              />
            ))}
          </HRToggleGroup.Root>

          <div className="hr-m-t-1.5">
            <OverviewTab currentTab={currentTab} />
          </div>
        </div>
      </div>
    </main>
  );
}

export { OrganisationOverview };
