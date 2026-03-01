import { HRTag } from '@hackerrank/hrds-components';

export function AccordianItemHeader({
  title,
  selectedCount = 0,
}: {
  title: string;
  selectedCount?: number;
}) {
  return (
    <div className="hr-flex hr-justify-between hr-grow hr-p-r-1">
      <div>{title}</div>
      <div>
        {selectedCount !== 0 ? <HRTag color="default" label={selectedCount.toString()} /> : null}
      </div>
    </div>
  );
}
