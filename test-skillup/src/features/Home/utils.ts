import dayjs from 'dayjs';

import { AssignmentDatum } from 'src/types/api/assignment';

export function groupAssignments(assignments: AssignmentDatum[]): {
  completed: AssignmentDatum[];
  overdue: AssignmentDatum[];
  upcoming: AssignmentDatum[];
} {
  return assignments.reduce(
    (acc, assignment) => {
      const dueDate = assignment.attributes?.due_date
        ? dayjs(assignment.attributes.due_date)
        : null;
      const completedOn = assignment.attributes?.completed_on
        ? dayjs(assignment.attributes.completed_on)
        : null;

      if (completedOn) {
        acc.completed.push(assignment);
      } else if (dueDate && dueDate < dayjs()) {
        acc.overdue.push(assignment);
      } else {
        acc.upcoming.push(assignment);
      }

      return acc;
    },
    { completed: [], overdue: [], upcoming: [] },
  );
}
