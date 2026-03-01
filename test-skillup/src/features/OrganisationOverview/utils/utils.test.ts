import { getProgress } from './utils';

describe('Test Organistion Insights utils', () => {
  describe('getChangePercentageCondition', () => {
    describe('when changeCondition is positive', () => {
      it('returns true when changePercentage > 0', () => {
        const color = getProgress('positive', 10);
        expect(color).toBe(true);
      });

      it('returns false when changePercentage < 0', () => {
        const color = getProgress('positive', -10);
        expect(color).toBe(false);
      });

      it('returns false when changePercentage is 0', () => {
        const color = getProgress('positive', 0);
        expect(color).toBe(false);
      });
    });

    describe('when changeCondition is negative', () => {
      it('returns true when changePercentage < 0', () => {
        const color = getProgress('negative', -10);
        expect(color).toBe(true);
      });

      it('returns false when changePercentage > 0', () => {
        const color = getProgress('negative', 10);
        expect(color).toBe(false);
      });

      it('returns false when changePercentage is 0', () => {
        const color = getProgress('negative', 0);
        expect(color).toBe(false);
      });
    });

    describe('when changeCondition is constant', () => {
      it('returns true when changePercentage is 0', () => {
        const color = getProgress('constant', 0);
        expect(color).toBe(true);
      });

      it('returns false when changePercentage < 0', () => {
        const color = getProgress('constant', -10);
        expect(color).toBe(false);
      });

      it('returns false when changePercentage is 0', () => {
        const color = getProgress('constant', 10);
        expect(color).toBe(false);
      });
    });
  });
});
