import { HRBasicSelect, HRCalendar } from '@hackerrank/hrds-components';
import dayjs from 'dayjs';
import { useTranslation } from 'next-i18next';
import { useCallback, useRef, useState } from 'react';

import { HandleInteractionOutside } from 'src/components/HandleInteractionOutside';

import styles from './AssessmentHistory.module.scss';

type SelectPropType = {
  label: string;
  value: number | string;
};

const durationOptions = [
  { label: 'Last 3 months', value: 90 },
  { label: 'Last 6 months', value: 180 },
  { label: 'Current year', value: 365 },
  { label: 'Custom range', value: 'CUSTOM_RANGE' },
  { label: 'All time', value: 'ALL_TIME' },
];

export function DurationFilter({ updateQueryArgs }: { updateQueryArgs: Function }) {
  const { t: translate } = useTranslation('employeeSkillProfile');
  const filterRef = useRef<HTMLDivElement>(null);
  const [calendarState, setCalendarState] = useState<Array<Date>>([new Date(), new Date()]);
  const [selectedDuration, setSelectedDuration] = useState<SelectPropType>(durationOptions[4]);
  const [isCalendarVisible, setIsCalendarVisible] = useState(false);
  const [isSelectOpen, setIsSelectOpen] = useState(false);

  const closeDurationFilter = useCallback(() => {
    setIsCalendarVisible(false);
    setIsSelectOpen(false);
  }, []);

  const resetSelectedRange = useCallback(() => {
    setCalendarState([new Date(), new Date()]);
    updateQueryArgs({
      from_date: '',
      to_date: '',
    });
  }, [updateQueryArgs]);

  const handleSelectChange = (updatedDuration: SelectPropType) => {
    setSelectedDuration(updatedDuration);
    const { value } = updatedDuration;
    if (value === 'ALL_TIME') {
      resetSelectedRange();
      closeDurationFilter();
    } else if (value === 'CUSTOM_RANGE') {
      if (isCalendarVisible) {
        resetSelectedRange();
      } else {
        setIsCalendarVisible(true);
      }
    } else {
      updateQueryArgs({
        from_date: dayjs()
          .subtract(value as number, 'day')
          .format('YYYY-MM-DD'),
        to_date: dayjs().format('YYYY-MM-DD'),
      });
      setCalendarState([new Date(), new Date()]);
      closeDurationFilter();
    }
  };

  const handleSelectOpen = () => {
    setIsSelectOpen(true);
    if (selectedDuration?.value === 'CUSTOM_RANGE') {
      setIsCalendarVisible(true);
    }
  };

  const handleCalenderChange = (value: Array<Date>) => {
    setCalendarState(value);
    if (value?.length === 2) {
      setSelectedDuration({
        label: `${dayjs(value[0]).format('DD/MM/YY')} - ${dayjs(value[1]).format('DD/MM/YY')}`,
        value: 'CUSTOM_RANGE',
      });
      updateQueryArgs({
        from_date: dayjs(value[0]).format('YYYY-MM-DD'),
        to_date: dayjs(value[1]).format('YYYY-MM-DD'),
      });
      setTimeout(() => {
        closeDurationFilter();
      }, 350);
    }
  };

  return (
    <div ref={filterRef} className={styles.filter}>
      <HandleInteractionOutside
        onClickOutside={closeDurationFilter}
        onKeyUpOutside={closeDurationFilter}
        onKeyUpKeys={['Escape']}
      >
        <HRBasicSelect
          name={translate('assessment_history.duration_filter_name')}
          options={durationOptions}
          value={selectedDuration}
          onChange={handleSelectChange}
          // @ts-ignore
          isSearchable={false}
          closeMenuOnSelect={false}
          menuIsOpen={isSelectOpen}
          onMenuOpen={handleSelectOpen}
          aria-label={translate('assessment_history.duration_filter_aria_label')}
          isFullWidth
        />
        <div className={styles.calendar}>
          {isCalendarVisible && (
            <HRCalendar
              locale="en-US"
              calendarType="ISO 8601"
              selectRange
              onChange={handleCalenderChange}
              value={calendarState}
              maxDate={new Date()}
            />
          )}
        </div>
      </HandleInteractionOutside>
    </div>
  );
}
