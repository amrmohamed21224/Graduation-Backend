const expiryCheckerService = require('../src/modules/scheduler/services/expiry-checker.service');

describe('ExpiryCheckerService', () => {
  describe('getExpiryDateRange', () => {
    afterEach(() => {
      jest.useRealTimers();
    });

    it('should calculate the precise start and end boundaries for exactly 30 days away', () => {
      // Mock exactly midnight on Jan 1 2024 to predict exact ranges
      const mockToday = new Date('2024-01-01T00:00:00.000Z');
      jest.useFakeTimers().setSystemTime(mockToday);

      const range = expiryCheckerService.getExpiryDateRange(30);

      const expectedStart = new Date('2024-01-31T00:00:00.000Z');
      const expectedEnd = new Date('2024-01-31T23:59:59.999Z');

      expect(range.start.getTime()).toBe(expectedStart.getTime());
      expect(range.end.getTime()).toBe(expectedEnd.getTime());
    });

    it('should correctly boundary cross-month boundaries securely for 7 days ahead', () => {
      const mockToday = new Date('2024-01-26T14:30:00.000Z'); // Random time in day
      jest.useFakeTimers().setSystemTime(mockToday);

      const range = expiryCheckerService.getExpiryDateRange(7);

      // 7 days from Jan 26 is Feb 2. It must drop time to exactly midnight.
      const expectedStart = new Date('2024-02-02T00:00:00.000Z');
      const expectedEnd = new Date('2024-02-02T23:59:59.999Z');

      expect(range.start.getTime()).toBe(expectedStart.getTime());
      expect(range.end.getTime()).toBe(expectedEnd.getTime());
    });
  });
});
