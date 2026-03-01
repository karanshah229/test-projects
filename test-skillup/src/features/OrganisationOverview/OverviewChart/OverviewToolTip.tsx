import { TrendIcon } from 'src/components/ChartIcons';
import { proficiencyAttributes } from 'src/constants/common';
import { templateString } from 'src/utils/common';

import styles from './OverviewChart.module.scss';

type OverviewToolTipProps = {
  totalCount: number;
  overallChangePercentage: number;
  hasSubElements: boolean;
  proficiencyData: object;
  translate: Function;
  headerLabel: string;
};

export function OverviewToolTip({
  totalCount = 0,
  overallChangePercentage = 0,
  hasSubElements = false,
  proficiencyData = {},
  translate = () => {},
  headerLabel = '',
}: OverviewToolTipProps) {
  return (
    <div className={`${styles.overviewToolTip} bg-white`}>
      <div className="hr-flex hr-justify-between hr-align-center hr-utility-01">
        <div>{headerLabel}</div>
        <div className="hr-flex hr-justify-center hr-align-center hr-body-02">
          <div>{totalCount}</div>
          <div className="hr-m-l-0.25">
            <TrendIcon percentChange={overallChangePercentage} />
          </div>
        </div>
      </div>
      {hasSubElements &&
        Object.entries(proficiencyAttributes).map(([key, value]) => {
          const { count = 0, change_percentage: changePercentage = 0 } =
            proficiencyData?.[key] || {};
          return (
            <div
              className="hr-flex hr-justify-between hr-align-center hr-utility-01 hr-m-t-1"
              key={key}
            >
              <div className={styles['proficiency-label']}>
                {templateString(translate('bubble_chart.proficiency_label'), {
                  proficiencyLabel: value?.label,
                })}{' '}
              </div>
              <div className="hr-flex hr-justify-center hr-align-center">
                <span>{count}</span>
                <div className="hr-m-l-0.25">
                  <TrendIcon percentChange={changePercentage} />
                </div>
              </div>
            </div>
          );
        })}
    </div>
  );
}
