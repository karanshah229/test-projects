import {
  API_VERSIONS,
  CDN_ASSET_FOLDER_PATH,
  CDN_URL_PREFIX,
  PROFICIENCIES,
} from 'src/constants/common';
import { BadgeDatum } from 'src/types/api/common';

import {
  GetNavActiveStateProps,
  capitalizeFirstLetter,
  compareBadges,
  compareProficiencies,
  debounce,
  fuzzySearch,
  getBackendURL,
  getBadgeImageFileName,
  getBadgeImageFilePath,
  getLevenshteinDistanceFactor,
  getNavActiveState,
  progressTagColor,
  removeEmptyEnteries,
  sortBadges,
  sortProficiencies,
  sortTableData,
} from './common';
import { ProficiencyType } from '../types/common';

import type { SortDescriptor } from '@react-types/shared';

describe('Test common utils', () => {
  describe('getNavActiveState', () => {
    const minParams: GetNavActiveStateProps = {
      routerAsPath: '/test',
      navURL: '/test',
      childRoutes: [],
      currentPathname: '',
    };

    it('Exact same URLs', () => {
      const isNavActive = getNavActiveState({ ...minParams });
      expect(isNavActive).toBeTruthy();
    });

    it('On sub route, but no further childRoutes', () => {
      const modParams: GetNavActiveStateProps = {
        ...minParams,
        routerAsPath: '/test/12',
      };

      const isNavActive = getNavActiveState({ ...modParams });
      expect(isNavActive).toBeFalsy();
    });

    it('On sub route, has childRoutes and showInHeader & showActiveState are true', () => {
      const modParams: GetNavActiveStateProps = {
        ...minParams,
        currentPathname: '/employees/[id]',
        childRoutes: [
          {
            path: '/employees/[id]',
            protected: true,
            appHeaderNavLinkOptions: {
              showInHeader: true,
              showActiveState: true,
              i18nTitleKey: '',
            },
            roles_allowed: ['admin'],
          },
        ],
      };

      const isNavActive = getNavActiveState({ ...modParams });
      expect(isNavActive).toBeTruthy();
    });

    it('On sub route, has childRoutes and enableNavLink false', () => {
      const modParams: GetNavActiveStateProps = {
        ...minParams,
        routerAsPath: '/test/12',
        childRoutes: [
          {
            path: '/employees/[id]',
            protected: true,
            appHeaderNavLinkOptions: {
              showInHeader: false,
              showParentRouteActiveState: false,
            },
            roles_allowed: ['admin'],
          },
        ],
        currentPathname: '/test/[id]',
      };

      const isNavActive = getNavActiveState({ ...modParams });
      expect(isNavActive).toBeFalsy();
    });
  });

  describe('getBackendURL', () => {
    it('returns localhost on client', () => {
      const baseUrl = getBackendURL(API_VERSIONS.v1);
      expect(baseUrl).toBe('http://localhost:3001/skillup/api/v1');
    });
  });

  describe('getBadgeImageFileName', () => {
    const proficiency: ProficiencyType = 'expert';
    const minBadgeAttributes = {
      issued_at: '2023-01-15T00:00:00.000Z',
      title: 'Angular Expert',
      skill_id: 'abcd1235',
      skill_name: 'Angular',
      priority: 3,
      image_urls: {
        icon: 'https://thumbs.dreamstime.com/b/gold-badge-5392868.jpg',
      },
    };
    const badgeAttributes = {
      ...minBadgeAttributes,
      proficiency,
    };

    it('returns image file name with extension', () => {
      const badgeImageFileName = getBadgeImageFileName({ badgeAttributes });
      expect(badgeImageFileName).toBe('angular__expert.svg');
    });
    it('returns image file name without extension', () => {
      const badgeImageFileName = getBadgeImageFileName({ badgeAttributes, withExtension: false });
      expect(badgeImageFileName).toBe('angular__expert');
    });
    it('returns empty string if no proficiency is provided for a badge', () => {
      const modProficiency: ProficiencyType = null;
      const modifiedBadgeattributes = {
        ...minBadgeAttributes,
        proficiency: modProficiency,
      };
      const badgeImageFileName = getBadgeImageFileName({
        badgeAttributes: modifiedBadgeattributes,
      });
      expect(badgeImageFileName).toBe('');
    });
  });

  describe('getBadgeImageFilePath', () => {
    const proficiency: ProficiencyType = 'expert';
    const minBadgeAttributes = {
      issued_at: '2023-01-15T00:00:00.000Z',
      title: 'Angular Expert',
      skill_id: 'abcd1235',
      skill_name: 'Angular',
      priority: 3,
      image_urls: {
        icon: 'https://thumbs.dreamstime.com/b/gold-badge-5392868.jpg',
      },
    };
    const badgeAttributes = {
      ...minBadgeAttributes,
      proficiency,
    };

    it('returns image file path on CDN', () => {
      const badgeFileName = getBadgeImageFileName({ badgeAttributes });
      const badgeFilePath = getBadgeImageFilePath(badgeFileName);
      expect(badgeFilePath).toBe(
        `${CDN_URL_PREFIX}${CDN_ASSET_FOLDER_PATH.badge}/${badgeFileName}`,
      );
    });
    it('returns empty string if badge file path is not provided', () => {
      const badgeFilePath = getBadgeImageFilePath('');
      expect(badgeFilePath).toBe('');
    });
  });

  describe('compareProficiencies', () => {
    it('returns correct higher proficiency - proficiency type', () => {
      const resultMap = {
        0: {
          // prof1 = prebeginner
          0: null,
          1: 'beginner',
          2: 'intermediate',
          3: 'expert',
        },
        1: {
          // prof1 = beginner
          0: 'beginner',
          1: null,
          2: 'intermediate',
          3: 'expert',
        },
        2: {
          // prof1 = intermediate
          0: 'intermediate',
          1: 'intermediate',
          2: null,
          3: 'expert',
        },
        3: {
          // prof1 = expert
          0: 'expert',
          1: 'expert',
          2: 'expert',
          3: null,
        },
      };

      Object.values(PROFICIENCIES).forEach((prof1, idx1) => {
        Object.values(PROFICIENCIES).forEach((prof2, idx2) => {
          const higherProf = compareProficiencies(prof1, prof2);
          expect(higherProf).toBe(resultMap[idx1][idx2]);
        });
      });
    });
  });

  describe('sortProficiencies', () => {
    it('returns correct higher proficiency', () => {
      const resultMap = {
        0: {
          // prof1 = prebeginner
          0: 0,
          1: -1,
          2: -1,
          3: -1,
        },
        1: {
          // prof1 = beginner
          0: 1,
          1: 0,
          2: -1,
          3: -1,
        },
        2: {
          // prof1 = intermediate
          0: 1,
          1: 1,
          2: 0,
          3: -1,
        },
        3: {
          // prof1 = expert
          0: 1,
          1: 1,
          2: 1,
          3: 0,
        },
      };

      Object.values(PROFICIENCIES).forEach((prof1, idx1) => {
        Object.values(PROFICIENCIES).forEach((prof2, idx2) => {
          // [["beginner", "beginner"], ["beginner", "intermediate"], ...["expert", "expert"]]
          const higherProf = sortProficiencies(prof1, prof2);
          expect(higherProf).toBe(resultMap[idx1][idx2]);
        });
      });
    });
  });

  describe('badges', () => {
    let badge1: BadgeDatum = null;
    let badge2: BadgeDatum = null;

    beforeEach(() => {
      badge1 = {
        id: 5,
        attributes: {
          issued_at: '2023-01-15T00:00:00.000Z',
          title: 'Java Expert',
          skill_id: 'abcd1235',
          skill_name: 'Java',
          proficiency: 'beginner',
          priority: 3,
          image_urls: {
            icon: 'https://thumbs.dreamstime.com/b/gold-badge-5392868.jpg',
          },
        },
      };
      badge2 = {
        id: 4,
        attributes: {
          issued_at: '2023-01-12T00:00:00.000Z',
          title: 'Angular Beginner',
          skill_id: 'abcd1235',
          skill_name: 'Angular',
          proficiency: 'beginner',
          priority: 1,
          image_urls: {
            icon: 'https://thumbs.dreamstime.com/b/gold-badge-5392868.jpg',
          },
        },
      };
    });

    describe('compareBadges', () => {
      it('returns correct higher proficiency + recency + alphabatical badge', () => {
        let higherBadge: ReturnType<typeof compareBadges> = null;

        higherBadge = compareBadges(badge1, badge2);
        expect(higherBadge).toEqual(badge1);

        badge2.attributes.proficiency = 'intermediate';
        higherBadge = compareBadges(badge1, badge2);
        expect(higherBadge).toEqual(badge2);

        badge2.attributes.proficiency = 'expert';
        higherBadge = compareBadges(badge1, badge2);
        expect(higherBadge).toEqual(badge2);

        badge1.attributes.proficiency = 'intermediate';
        badge2.attributes.proficiency = 'beginner';
        higherBadge = compareBadges(badge1, badge2);
        expect(higherBadge).toEqual(badge1);

        badge2.attributes.proficiency = 'intermediate';
        higherBadge = compareBadges(badge1, badge2);
        expect(higherBadge).toEqual(badge1);

        badge2.attributes.proficiency = 'expert';
        higherBadge = compareBadges(badge1, badge2);
        expect(higherBadge).toEqual(badge2);

        badge1.attributes.proficiency = 'expert';
        badge2.attributes.proficiency = 'beginner';
        higherBadge = compareBadges(badge1, badge2);
        expect(higherBadge).toEqual(badge1);

        badge2.attributes.proficiency = 'intermediate';
        higherBadge = compareBadges(badge1, badge2);
        expect(higherBadge).toEqual(badge1);

        badge2.attributes.proficiency = 'expert';
        higherBadge = compareBadges(badge1, badge2);
        expect(higherBadge).toEqual(badge1);

        badge2.attributes.issued_at = badge1.attributes.issued_at;
        higherBadge = compareBadges(badge1, badge2);
        expect(higherBadge).toEqual(badge2);
      });
    });

    describe('sortBadges', () => {
      it('returns correct higher proficiency + recency + alphabatical badge', () => {
        let higherBadge: ReturnType<typeof sortBadges> = null;

        higherBadge = sortBadges(badge1, badge2);
        expect(higherBadge).toEqual(1);

        badge2.attributes.proficiency = 'intermediate';
        higherBadge = sortBadges(badge1, badge2);
        expect(higherBadge).toEqual(-1);

        badge2.attributes.proficiency = 'expert';
        higherBadge = sortBadges(badge1, badge2);
        expect(higherBadge).toEqual(-1);

        badge1.attributes.proficiency = 'intermediate';
        badge2.attributes.proficiency = 'beginner';
        higherBadge = sortBadges(badge1, badge2);
        expect(higherBadge).toEqual(1);

        badge2.attributes.proficiency = 'intermediate';
        higherBadge = sortBadges(badge1, badge2);
        expect(higherBadge).toEqual(1);

        badge2.attributes.proficiency = 'expert';
        higherBadge = sortBadges(badge1, badge2);
        expect(higherBadge).toEqual(-1);

        badge1.attributes.proficiency = 'expert';
        badge2.attributes.proficiency = 'beginner';
        higherBadge = sortBadges(badge1, badge2);
        expect(higherBadge).toEqual(1);

        badge2.attributes.proficiency = 'intermediate';
        higherBadge = sortBadges(badge1, badge2);
        expect(higherBadge).toEqual(1);

        badge2.attributes.proficiency = 'expert';
        higherBadge = sortBadges(badge1, badge2);
        expect(higherBadge).toEqual(1);

        badge2.attributes.issued_at = badge1.attributes.issued_at;
        higherBadge = sortBadges(badge1, badge2);
        expect(higherBadge).toEqual(-1);
      });
    });
  });

  describe('removeEmptyEnteries', () => {
    it('returns the filtered object after removing all the attribues with empty/null values', () => {
      const object = {
        search: '',
        page: null,
        total_pages: undefined,
      };
      let filteredObject: ReturnType<typeof removeEmptyEnteries> = null;
      filteredObject = removeEmptyEnteries(object);
      expect(filteredObject).toEqual({});
    });

    it('returns the filtered object after removing all the attribues with empty/null values for nested values', () => {
      const object = {
        id: null,
        data: {
          name: '',
          uuid: null,
          email: undefined,
        },
      };
      let filteredObject: ReturnType<typeof removeEmptyEnteries> = null;
      filteredObject = removeEmptyEnteries(object);
      expect(filteredObject).toEqual({
        data: {},
      });
    });

    it('should not remove non-empty/truthy values', () => {
      const object = {
        id: 123,
        address: '',
        data: {
          name: '',
          uuid: '3fedf-43vv-s4fe-34dd',
          score: 214.77,
        },
      };
      let filteredObject: ReturnType<typeof removeEmptyEnteries> = null;
      filteredObject = removeEmptyEnteries(object);
      expect(filteredObject).toEqual({
        id: 123,
        data: {
          uuid: '3fedf-43vv-s4fe-34dd',
          score: 214.77,
        },
      });
    });
  });

  describe('progressTagColor', () => {
    it('returns primary color when percentChange > 0', () => {
      const color = progressTagColor(45.46);
      expect(color).toBe('primary');
    });

    it('returns warning color when 0 <= percentChange <= -20', () => {
      const color = progressTagColor(-15);
      expect(color).toBe('warning');
    });

    it('returns critical color when percentChange < -20', () => {
      const color = progressTagColor(-20.99);
      expect(color).toBe('critical');
    });

    it('returns warning color when percentChange is null', () => {
      const color = progressTagColor(null);
      expect(color).toBe('warning');
    });
  });

  describe('sortTableData', () => {
    const tableData = [
      { id: 1, name: 'John', age: 30 },
      { id: 2, name: 'Alice', age: 25 },
      { id: 3, name: 'Bob', age: 35 },
    ];

    test('should sort table data based on column and tie breaker key in ascending order', () => {
      const sortDescriptor = { column: 'age', direction: 'ascending' } as SortDescriptor;
      const tieBreakerKey = 'name';
      const expectedTableData = [
        { id: 2, name: 'Alice', age: 25 },
        { id: 1, name: 'John', age: 30 },
        { id: 3, name: 'Bob', age: 35 },
      ];

      const result = sortTableData(sortDescriptor, tableData, tieBreakerKey);

      expect(result.updatedSortDescriptor).toEqual(sortDescriptor);
      expect(result.updatedTableData).toEqual(expectedTableData);
    });

    test('should sort table data based on column and tie breaker key in descending order', () => {
      const sortDescriptor = { column: 'age', direction: 'descending' } as SortDescriptor;
      const tieBreakerKey = 'name';
      const expectedTableData = [
        { id: 3, name: 'Bob', age: 35 },
        { id: 1, name: 'John', age: 30 },
        { id: 2, name: 'Alice', age: 25 },
      ];

      const result = sortTableData(sortDescriptor, tableData, tieBreakerKey);

      expect(result.updatedSortDescriptor).toEqual(sortDescriptor);
      expect(result.updatedTableData).toEqual(expectedTableData);
    });
  });
});

describe('Test debounce', () => {
  it('should call the original function only once after the specified wait time', (done) => {
    const originalFunction = jest.fn();
    const debouncedFunction = debounce(originalFunction, 100);

    debouncedFunction();
    debouncedFunction();
    debouncedFunction();
    debouncedFunction();
    expect(originalFunction).not.toBeCalled();

    setTimeout(() => {
      expect(originalFunction).toHaveBeenCalledTimes(1);
      done();
    }, 150);
  });

  it('should call the original function with the correct arguments', (done) => {
    const originalFunction = jest.fn();
    const debouncedFunction = debounce(originalFunction, 200);

    debouncedFunction({ name: 'John' });

    setTimeout(() => {
      expect(originalFunction).toHaveBeenCalledWith({ name: 'John' });
      done();
    }, 250);
  });
});

describe('Test capitalizeFirstLetter', () => {
  test('should capitalize the first letter of a lowercase string', () => {
    const result = capitalizeFirstLetter('hello');
    expect(result).toBe('Hello');
  });
  test('should not change the first letter of an uppercase string', () => {
    const result = capitalizeFirstLetter('WORLD');
    expect(result).toBe('WORLD');
  });

  test('should return an empty string for an empty input', () => {
    const result = capitalizeFirstLetter('');
    expect(result).toBe('');
  });

  test('should work with special characters', () => {
    const result = capitalizeFirstLetter('@test');
    expect(result).toBe('@test');
  });

  test('should work with numbers', () => {
    const result = capitalizeFirstLetter('123test');
    expect(result).toBe('123test');
  });
});

describe('Test getLevenshteinDistanceFactor', () => {
  test('should return 1 for entirely different strings', () => {
    const distanceFactor = getLevenshteinDistanceFactor('abc', 'xyz');
    expect(distanceFactor).toBe(1);
  });

  test('should work with empty strings', () => {
    const distanceFactor = getLevenshteinDistanceFactor('', '');
    expect(distanceFactor).toBe(1);
  });

  test('should return 0 for similar strings', () => {
    const distanceFactor = getLevenshteinDistanceFactor('java', 'java');
    expect(distanceFactor).toBe(0);
  });
});

describe('Test fuzzySearch', () => {
  test('should return true for an exact match', () => {
    const query = 'apple';
    const target = 'apple';
    const matchFactor = 0.5;

    expect(fuzzySearch(query, target, matchFactor)).toBe(true);
  });

  test('should return true for a partial match', () => {
    const query = 'app';
    const target = 'apple';
    const matchFactor = 0.5;

    expect(fuzzySearch(query, target, matchFactor)).toBe(true);
  });

  test('should return false for a non-matching query', () => {
    const query = 'banana';
    const target = 'apple';
    const matchFactor = 0.5;

    expect(fuzzySearch(query, target, matchFactor)).toBe(false);
  });

  test('should return true for an empty query', () => {
    const query = '';
    const target = 'apple';
    const matchFactor = 0.5;

    expect(fuzzySearch(query, target, matchFactor)).toBe(false);
  });
});
