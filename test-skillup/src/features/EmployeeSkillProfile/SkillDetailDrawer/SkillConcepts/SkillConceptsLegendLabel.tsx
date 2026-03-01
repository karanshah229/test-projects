import Image from 'next/image';
import { useTranslation } from 'next-i18next';

type PropType = {
  ratingType: string;
  imageSrc: string;
  legendLabel: string;
};

export function SkillConceptsLegendLabel({ ratingType, imageSrc, legendLabel }: PropType) {
  const { t: translate } = useTranslation('employeeSkillProfile');
  return (
    <div
      className={`hr-flex hr-align-center hr-justify-start ${
        ratingType === 'Maximum Rating' ? 'strong_concepts_label' : 'weak_concepts_label'
      }`}
    >
      <div>
        <Image
          alt={translate('SkillConceptBreakdown.legend_image_alt')}
          src={imageSrc}
          width={16}
          height={16}
        />
      </div>
      <div>{legendLabel}</div>
    </div>
  );
}
