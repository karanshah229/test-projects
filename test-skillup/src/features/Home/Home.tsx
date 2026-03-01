import { HRSidemenu, HRSidemenuItem } from '@hackerrank/hrds-components';
import { useTranslation } from 'next-i18next';
import { useState } from 'react';

import { CountLabel } from 'src/components/CountLabel/CountLabel';
import { useIsomorphicLayoutEffect } from 'src/hooks/useIsomorphicLayoutEffect';
import { useGetAsignmentsQuery } from 'src/services/Assignments';

import { AssignmentsTab } from './AssignmentsTab/AssignmentsTab';
import styles from './Home.module.scss';
import { MyCareerTab } from './MyCareerTab/MyCareerTab';
import { ProfileSection } from './ProfileSection/ProfileSection';
import { SIDE_MENU_ITEMS } from './constants';
import { groupAssignments } from './utils';

function TabContent({ selectedTab }: { selectedTab: string }) {
  switch (selectedTab) {
    case SIDE_MENU_ITEMS.my_career.key:
      return <MyCareerTab />;
    case SIDE_MENU_ITEMS.assigned_to_me.key:
      return <AssignmentsTab />;
    default:
      return null;
  }
}

export function Home({ selectedTab }: { selectedTab: string }) {
  const { t: translate } = useTranslation('home');
  const [selectedKey, setSelectedKey] = useState([selectedTab]);
  const selectSidemenuOption = (currentKey: any) => {
    setSelectedKey([currentKey]);
    window.history.pushState({ currentKey }, '', SIDE_MENU_ITEMS?.[currentKey]?.url);
  };

  useIsomorphicLayoutEffect(() => {
    const handlePopState = () => {
      const currentURL = window.location.pathname;
      const currentKey = Object.keys(SIDE_MENU_ITEMS).find(
        (key) => SIDE_MENU_ITEMS?.[key]?.url === currentURL,
      );
      setSelectedKey([currentKey]);
    };
    window.addEventListener('popstate', handlePopState);
    return () => {
      window.removeEventListener('popstate', handlePopState);
    };
  }, []);

  const { data: employeeAssignments } = useGetAsignmentsQuery();

  const { upcoming } = groupAssignments(employeeAssignments?.data || []);

  return (
    <main className={`bg-blue-gradient fixed-viewport-height-layout ${styles.home_container}`}>
      <div className="hr-grow hr-grid-container">
        <div className="hr-grid-row">
          <div className={`hr-grid-col-3 ${styles.home_body}`}>
            <ProfileSection />
            <div className={`hr-grid-col-10 ${styles.home_container__sidemenu}`}>
              <HRSidemenu
                aria-label={translate('side_menu_aria_label')}
                selectedKeys={selectedKey}
                onSelectionChange={selectSidemenuOption}
              >
                {Object.keys(SIDE_MENU_ITEMS).map((key) => {
                  const menuItem = SIDE_MENU_ITEMS[key];
                  const isCountVisible = menuItem.key === 'assigned_to_me';
                  return (
                    <HRSidemenuItem aria-label={translate(menuItem.aria_label)} key={menuItem.key}>
                      <div
                        className={`hr-p-y-0.5 ${isCountVisible ? 'hr-flex hr-align-center' : ''} `}
                      >
                        {translate(menuItem.title)}
                        {isCountVisible ? <CountLabel count={upcoming?.length || 0} /> : null}
                      </div>
                    </HRSidemenuItem>
                  );
                })}
              </HRSidemenu>
            </div>
          </div>
          <div className="hr-grid-col-9">
            <TabContent selectedTab={selectedKey[0]} />
          </div>
        </div>
      </div>
    </main>
  );
}
