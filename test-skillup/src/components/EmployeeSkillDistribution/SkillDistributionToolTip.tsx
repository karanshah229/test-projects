import { HRDivider } from '@hackerrank/hrds-components';

import { capitalizeFirstLetter } from 'src/utils/common';

import styles from './EmployeeSkillDistribution.module.scss';
import { SkillSeriesProficiencyDataMap } from './constant';
import { PointDataType, SeriesDataType } from './types';
import { ProficiencyBulletIcon } from '../ChartIcons';
import { SkillCircularProgressIndicator } from '../SkillCircularProgressIndicator/SkillCircularProgressIndicator';

type PointToolTipType = {
  points: PointDataType[];
  skillName: string;
  skillNameAndProgressMap: { [key: string]: number };
  seriesData: Pick<SeriesDataType, 'color' | 'data' | 'name'>[];
  skillNames: string[];
};

const getCustomPointsList = (
  point: PointDataType,
  seriesData: Pick<SeriesDataType, 'color' | 'data' | 'name'>[],
  skillNames: string[],
) => {
  const pointIndex = skillNames.indexOf(point?.x.toString());
  const customPointsList = Object.values(seriesData).reduce((acc, ser) => {
    const pointValue = ser.data[pointIndex];
    if (pointValue === point.y) {
      acc.push({
        ...point,
        color: ser.color,
        series: {
          name: ser.name,
        },
      });
    }
    return acc;
  }, []);

  return customPointsList;
};

export function SkillDistributionToolTip({
  points = [],
  skillName = '',
  skillNameAndProgressMap = {},
  seriesData = [],
  skillNames = [],
}: PointToolTipType) {
  const hasSharedSeriesToolTip = points.length > 1;
  const hasSinglSeriesToolTip = points.length === 1;
  const customPointsList: PointDataType[] = hasSinglSeriesToolTip
    ? getCustomPointsList(points[0], seriesData, skillNames)
    : points;
  return (
    <div className={`${styles.toolTipContainer} bg-white hr-flex hr-col hr-utility-01`}>
      <div className="hr-flex hr-align-center hr-body-02">
        <div style={{ maxWidth: '25px', maxHeight: '20px' }}>
          <SkillCircularProgressIndicator
            skillProgress={skillNameAndProgressMap[skillName]}
            skillName={skillName}
          />
        </div>
        <div className="hr-p-l-0.5 first-letter-uppercase"> {skillName} </div>
      </div>
      <HRDivider sx={{ margin: 'var(--hr-spacing-03) 0 0' }} />
      {(hasSharedSeriesToolTip || hasSinglSeriesToolTip) &&
        customPointsList?.map((point) => {
          const {
            color = '',
            y: skillSeriesVal = 0,
            series: { name: proficiencyType },
          } = point;

          const label = `${proficiencyType}: ${capitalizeFirstLetter(
            SkillSeriesProficiencyDataMap[skillSeriesVal].toString(),
          )}`;
          return (
            <div
              className="hr-flex hr-align-center hr-justify-start hr-m-t-0.5"
              key={proficiencyType}
            >
              <div style={{ width: '20px' }}>
                <ProficiencyBulletIcon color={color} />
              </div>
              <div> {label} </div>
            </div>
          );
        })}
    </div>
  );
}
