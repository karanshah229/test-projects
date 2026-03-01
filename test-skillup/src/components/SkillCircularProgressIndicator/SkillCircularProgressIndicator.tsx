import { getSkillLogoImageFileName, getSkillLogoImageFilePath } from 'src/utils/common';

import styles from './SkillCircularProgressIndicator.module.scss';

export type SkillCircularProgressIndicatorProps = {
  skillProgress?: number;
  skillName?: string;
  isHovered?: boolean;
};

export function SkillCircularProgressIndicator({
  skillProgress = 0,
  isHovered = false,
  skillName = 'fallback',
}: SkillCircularProgressIndicatorProps) {
  const radius = 9;
  const circumference = radius * 2 * Math.PI;

  // Don't need animation as of now. To make it work, make strokeDashoffset a state that's modified using useEffect and enable the transition in scss file
  const strokeDashoffset = circumference - (skillProgress / 100) * circumference;
  const skillProgressText = `${Math.floor(skillProgress)}%`;
  const showProgressOnHover = isHovered && skillProgress > 0;
  const skillProgressCompleted = skillProgress === 100;

  return (
    <svg width="100%" viewBox="2 2 20 20">
      <defs>
        <linearGradient
          id="gradient"
          x1="-14.5"
          y1="0"
          x2="20"
          y2="20"
          gradientUnits="userSpaceOnUse"
          gradientTransform="rotate(90)"
        >
          <stop offset="0.15" stopColor="#F5FBFF" />
          <stop offset="0.4" stopColor="#74B1F0" />
          <stop offset="0.55" stopColor="#D1A0EC" />
          <stop offset="0.8" stopColor="#B577BC" />
        </linearGradient>
      </defs>
      <circle
        r={`${radius}`}
        cx="12"
        cy="12"
        className={styles.track}
        fill={isHovered ? '#EBF3F9' : '#F3F9FD'}
        stroke={isHovered ? '#C8D8E4' : '#D6E3EC'}
        strokeWidth="1.5"
      />
      <circle
        r={`${radius}`}
        cx="8"
        cy="12"
        className={styles.progress}
        fill="none"
        stroke="url(#gradient)"
        strokeLinecap="round"
        strokeWidth="1.5"
        strokeDashoffset={`${strokeDashoffset}`}
      />
      {showProgressOnHover ? (
        <text
          x="60%"
          y="62%"
          alignmentBaseline="middle"
          textAnchor="middle"
          className={styles.progressText}
          stroke="#000"
          strokeWidth={0.25}
          fill="#000"
        >
          {skillProgressText}
        </text>
      ) : (
        <image
          href={
            skillProgressCompleted
              ? getSkillLogoImageFilePath('skill_achieved.svg')
              : getSkillLogoImageFilePath(
                  getSkillLogoImageFileName({
                    skillAttributes: { name: skillName },
                  }),
                )
          }
          height={skillProgressCompleted ? '7' : '10'}
          width={skillProgressCompleted ? '7' : '10'}
          x={skillProgressCompleted ? '44%' : '34%'}
          y={skillProgressCompleted ? '44%' : '34%'}
        />
      )}
    </svg>
  );
}
