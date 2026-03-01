import { HRClickableDiv } from '@hackerrank/hrds-components';
import { useTranslation } from 'next-i18next';
import { useState } from 'react';

import styles from './ReadMore.module.scss';

type ReadMorePropType = {
  text: string;
  limit?: number;
  expandTriggerText?: string;
  collapseTriggerText?: string;
};

export function ReadMore({
  text,
  limit = 200,
  expandTriggerText = '',
  collapseTriggerText = '',
}: ReadMorePropType) {
  const [showFullText, setShowFullText] = useState(false);
  const { t: translate } = useTranslation('components/readMore');

  const isButtonVisible = text?.length > limit;
  const truncatedText = showFullText ? text : `${text?.slice(0, limit)}...`;
  const buttonText = showFullText
    ? collapseTriggerText || translate('read_less')
    : expandTriggerText || translate('read_more');

  return (
    <div className="hr-m-b-2">
      <p className="hr-utility-02">{isButtonVisible ? truncatedText : text}</p>
      {isButtonVisible && (
        <div className={`hr-body-01 ${styles.buttonTextLink}`}>
          <HRClickableDiv onClick={() => setShowFullText((c) => !c)}>{buttonText}</HRClickableDiv>
        </div>
      )}
    </div>
  );
}
