import dayjs from 'dayjs';
import durationPlugin, { DurationUnitType } from 'dayjs/plugin/duration';
import relativeTimePlugin from 'dayjs/plugin/relativeTime';

dayjs.extend(durationPlugin);
dayjs.extend(relativeTimePlugin);

export function startOfMonth(endDate: Date | string): Date {
  return dayjs(endDate).startOf('month').toDate();
}

export function dateNow(): Date {
  return dayjs().toDate();
}

export function getDatesInBetweenDuration(
  startDate: Date | string,
  endDate: Date | string,
): Array<string> {
  const dates = [];
  let currentDate: Date = startOfMonth(endDate);
  dates.push(dayjs(endDate).toDate());
  while (currentDate > dayjs(startDate).toDate()) {
    currentDate = dayjs(currentDate).add(-1, 'month').startOf('month').toDate();
    dates.push(currentDate);
  }
  // remove the extra date
  dates.pop();
  return dates.reverse();
}

export function isToday(date: Date | string): boolean {
  return dayjs(date).isSame(dayjs());
}

export function getRelativeTime(date: Date | string): string {
  return dayjs(date).fromNow();
}

export function getAbsoluteTime(date: Date | string): string {
  return isToday(date) ? dayjs(date)?.format('HH:MM A') : dayjs(date)?.format("DD MMM, 'YY");
}

export const getHumanizedTimeDuration = (duration: number, unit: DurationUnitType) =>
  dayjs.duration(Number(duration), unit).humanize();
