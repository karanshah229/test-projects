import { bubbleChartConfig } from '../constants';

/**
 * Returns boolean to categorise employees based on change in the rating
 */
export const getProgress = (condition: string, value: number) => {
  switch (condition) {
    case 'positive':
      return value > 0;
    case 'negative':
      return value < 0;
    case 'constant':
      return value === 0;
    default:
      return false;
  }
};

/**
 * Returns an object which determines the size and padding of the overview bubble chart
 */

export const getChartConfig = (itemsCount: number) => {
  if (itemsCount < 4) return bubbleChartConfig.xxl;
  if (itemsCount < 7) return bubbleChartConfig.xl;
  if (itemsCount < 10) return bubbleChartConfig.lg;
  if (itemsCount < 20) return bubbleChartConfig.md;
  if (itemsCount < 30) return bubbleChartConfig.sm;
  return bubbleChartConfig.xs;
};
