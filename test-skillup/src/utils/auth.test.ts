import { getCurrentRouteAllowedRoles } from './auth';

describe('getCurrentRouteAllowedRoles', () => {
  it('returns null for invalid values', () => {
    const url = '/invalid-route/-/?.lop///fsd67898781234';
    const result = getCurrentRouteAllowedRoles(url);
    expect(result).toBeNull();
  });

  it('returns null for incorrect or unavailable route values', () => {
    const url = '/overview/certifications';
    const result = getCurrentRouteAllowedRoles(url);
    expect(result).toBeNull();
  });

  it('returns ["admin"] for routes that require only admin role', () => {
    const url = '/overview';
    const result = getCurrentRouteAllowedRoles(url);
    expect(result).toEqual(['admin']);
  });

  // it('returns ["trainee", "admin"] for routes that are available to both the roles', () => {
  //   const url = '/home';
  //   const result = getCurrentRouteAllowedRoles(url);
  //   expect(result).toEqual(['trainee', 'admin']);
  // });
});
