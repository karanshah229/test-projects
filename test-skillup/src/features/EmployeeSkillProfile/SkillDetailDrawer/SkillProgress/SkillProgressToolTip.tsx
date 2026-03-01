import { TrendIcon } from 'src/components/ChartIcons';

type Props = {
  assessmentDate: string;
  assessmentName: string;
  ratingChangePercent: number;
  tooltipMaxRating: string;
  tooltipAssessmentLabel: string;
  obtainedScore: number;
};

export function SkillProgressToolTip({
  assessmentDate,
  assessmentName,
  ratingChangePercent,
  tooltipAssessmentLabel,
  tooltipMaxRating,
  obtainedScore,
}: Props) {
  return (
    <table>
      <tr>
        <td className="hr-p-x-0.75 hr-p-t-0.75">
          <div className="hr-utility-01" style={{ color: 'var(--hr-neutral-60)' }}>
            {assessmentDate}
          </div>
        </td>
      </tr>

      <tr>
        <td
          style={{
            borderBottom: '1px solid var(--hr-neutral-10)',
            padding: 'var(--hr-spacing-03) var(--hr-spacing-06) 10px var(--hr-spacing-03)',
          }}
        >
          <div className="hr-flex hr-justify-start hr-align-center">
            <div className="hr-body-04">{obtainedScore}</div>
            <div className="hr-body-01 hr-m-r-0.5">{tooltipMaxRating}</div>
            <TrendIcon percentChange={ratingChangePercent} />
          </div>
        </td>
      </tr>

      <tr>
        <td style={{ padding: '10px var(--hr-spacing-03) 5px var(--hr-spacing-03)' }}>
          <div className="hr-utility-01" style={{ color: 'var(--hr-neutral-60)' }}>
            {tooltipAssessmentLabel}
          </div>
          <div
            className="hr-m-t-1 hr-body-01"
            style={{ color: 'var(--hr-neutral-90)', wordBreak: 'break-word' }}
          >
            {assessmentName}
          </div>
        </td>
      </tr>
    </table>
  );
}
