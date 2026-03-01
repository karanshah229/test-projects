import dayjs from 'dayjs';

import { ProficiencyBulletIcon } from 'src/components/ChartIcons';

import styles from '../InsightsSidebar.module.scss';

type ProgessPointType = {
  color: string;
  x: number;
  y: number;
  series: {
    name: string;
  };
};

type ProgressGraphToolTipType = {
  points: ProgessPointType[];
  headerLabel: string;
};

export function ProgressGraphToolTip({ points = [], headerLabel = '' }: ProgressGraphToolTipType) {
  const total = points?.reduce((accumulator, point) => accumulator + (point?.y || 0), 0) || 0;
  const hasSubElements = points.length > 1;
  const date = dayjs(points?.[0]?.x).format('MMM YYYY') || '';

  return (
    <div className={`${styles.labelContainer} bg-white hr-flex hr-col hr-utility-01`}>
      <p>{date}</p>
      <div
        className={`${styles.headerCount} hr-flex hr-justify-between hr-align-center hr-p-t-1 hr-p-b-0.75`}
      >
        <div>{headerLabel}</div>
        <div className="hr-body-02">{total}</div>
      </div>
      {hasSubElements &&
        points?.map((point) => {
          const {
            color = '',
            y: employeeCount = 0,
            series: { name: proficiency },
          } = point;
          return (
            <div
              className="hr-flex hr-justify-between hr-align-center hr-p-b-0.75"
              key={proficiency}
            >
              <div className="hr-flex hr-justify-between hr-align-center">
                <div className="hr-m-r-0.5" style={{ color }}>
                  <ProficiencyBulletIcon />
                </div>
                <div>{proficiency}</div>
              </div>
              <div>{employeeCount}</div>
            </div>
          );
        })}
    </div>
  );
}
