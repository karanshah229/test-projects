import {
  deleteServerGlobal,
  getServerGlobal,
  pruneJWTTokens,
  setServerGlobal,
} from './serverGlobal';

describe('ServerGlobal Service', () => {
  describe('On client side', () => {
    it('should not allow access on client side', () => {
      expect(getServerGlobal).toThrow('Error: Cannot access ServerGlobals on Client');
    });

    it('should not allow to set server global on client side', () => {
      expect(setServerGlobal).toThrow('Error: Cannot set ServerGlobals on Client');
    });

    it('should not allow to delete server global on client side', () => {
      expect(deleteServerGlobal).toThrow('Error: Cannot access ServerGlobals on Client');
    });

    it('should not allow to prune server global JWT tokens on client side', () => {
      expect(pruneJWTTokens).toThrow('Error: Cannot prune ServerGlobals on Client');
    });
  });
});
