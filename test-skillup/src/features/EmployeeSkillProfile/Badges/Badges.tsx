import { HRCard, HRCardHeader } from '@hackerrank/hrds-components';
import { useRouter } from 'next/router';
import { useState } from 'react';

import { APIErrorFallback } from 'src/components/APIErrorFallback/APIErrorFallback';
import { useGetEmployeeBadgesQuery } from 'src/services/Employees';
import { BadgeDatum, BadgesType } from 'src/types/api/common';
import { sortBadges } from 'src/utils/common';

import { AllSkillBadges } from './AllSkillBadges';
import { BadgesCardTitle } from './BadgesCardTitle';
import { BadgesFallback } from './BadgesFallback';
import { TopBadges } from './TopBadges';

function sortEmployeeSkillBadges(employeeSkillsBadges: BadgeDatum[]) {
  // Sort data by skill proficiency, recency DESC
  const sortedEmployeeSkillBadgeDatums = employeeSkillsBadges?.slice().sort(sortBadges).reverse();
  return {
    data: sortedEmployeeSkillBadgeDatums,
  };
}

function transformSkillBadges(badges: BadgesType) {
  const skillWiseBadgesMap: { string?: number } = {};
  const skillWiseBadgeDatums: BadgeDatum[][] = [];

  let index = 0;
  badges.data.forEach((badge) => {
    if (!Object.prototype.hasOwnProperty.call(skillWiseBadgesMap, badge.attributes.skill_id)) {
      skillWiseBadgesMap[badge.attributes.skill_id] = index;
      index += 1;
    }

    if (skillWiseBadgeDatums[skillWiseBadgesMap[badge.attributes.skill_id]]) {
      skillWiseBadgeDatums[skillWiseBadgesMap[badge.attributes.skill_id]].push(badge);
    } else {
      skillWiseBadgeDatums[skillWiseBadgesMap[badge.attributes.skill_id]] = [badge];
    }
  });

  return skillWiseBadgeDatums;
}

function shouldShowViewAllBtn(skillWiseBadges: BadgeDatum[][]) {
  // 'View All' btn should be shown if any 1 of the skills has a replaced badge
  return skillWiseBadges.some((skillWiseBadgesArr) => skillWiseBadgesArr.length > 1);
}

function Badges() {
  const router = useRouter();
  const [viewAllClicked, setViewAllClicked] = useState(false);
  const { data: employeeSkillsBadgesData, isError: employeeSkillsBadgesHasError } =
    useGetEmployeeBadgesQuery({
      employeeID: parseInt(router.query.id.toString(), 10),
    });
  if (employeeSkillsBadgesHasError) return <APIErrorFallback className="bg-white" />;

  const employeeSkillsBadges = employeeSkillsBadgesData?.data || [];

  const showBadgesFallbackUI = employeeSkillsBadges.length === 0;
  const sortedEmployeeSkillBadges = sortEmployeeSkillBadges(employeeSkillsBadges);
  const skillWiseBadges = transformSkillBadges(sortedEmployeeSkillBadges);
  const showViewAllBtn = shouldShowViewAllBtn(skillWiseBadges);

  return (
    <HRCard renderAs="section" spacing={24}>
      <HRCardHeader
        // @ts-ignore
        title={
          <BadgesCardTitle
            showViewAllBtn={showViewAllBtn}
            viewAllClicked={viewAllClicked}
            setViewAllClicked={setViewAllClicked}
          />
        }
      />
      {showBadgesFallbackUI ? (
        <BadgesFallback />
      ) : (
        <>
          <TopBadges sortedEmployeeSkillBadges={sortedEmployeeSkillBadges} />
          {showViewAllBtn && viewAllClicked && <AllSkillBadges skillWiseBadges={skillWiseBadges} />}
        </>
      )}
    </HRCard>
  );
}

export { Badges };
