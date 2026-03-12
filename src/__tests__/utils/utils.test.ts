/**
 * Unit tests for utility functions
 * Tests formatters, validators, sanitizers, and sorting functions
 */
import {
  getPropertyStatusColor,
  getOfferStatusColor,
  sanitizeId,
  sanitizeAmount,
  formatCurrency,
  formatDate,
  parseAmount,
  validateOfferAmount,
  filterAndSortProperties,
  sortOffers,
  extractCity,
} from '@/utils';
import { PROPERTY_STATUS, OFFER_STATUS, SORT_OPTIONS, UI_TEXT } from '@/constants';
import type { EnrichedProperty, Offer } from '@/types';

describe('getPropertyStatusColor', () => {
  it('returns green for Available status', () => {
    expect(getPropertyStatusColor(PROPERTY_STATUS.AVAILABLE)).toBe('bg-green-100 text-green-800');
  });

  it('returns yellow for Sale Agreed status', () => {
    expect(getPropertyStatusColor(PROPERTY_STATUS.SALE_AGREED)).toBe('bg-yellow-100 text-yellow-800');
  });

  it('returns blue for Sold status', () => {
    expect(getPropertyStatusColor(PROPERTY_STATUS.SOLD)).toBe('bg-blue-100 text-blue-800');
  });

  it('returns default gray for unknown status', () => {
    expect(getPropertyStatusColor('Unknown')).toBe('bg-gray-100 text-gray-800');
  });

  it('returns default for empty string', () => {
    expect(getPropertyStatusColor('')).toBe('bg-gray-100 text-gray-800');
  });
});

describe('getOfferStatusColor', () => {
  it('returns green for Accepted status', () => {
    expect(getOfferStatusColor(OFFER_STATUS.ACCEPTED)).toBe('bg-green-100 text-green-800');
  });

  it('returns red for Rejected status', () => {
    expect(getOfferStatusColor(OFFER_STATUS.REJECTED)).toBe('bg-red-100 text-red-800');
  });

  it('returns yellow for Pending status', () => {
    expect(getOfferStatusColor(OFFER_STATUS.PENDING)).toBe('bg-yellow-100 text-yellow-800');
  });

  it('returns default gray for unknown status', () => {
    expect(getOfferStatusColor('InvalidStatus')).toBe('bg-gray-100 text-gray-800');
  });
});

describe('sanitizeId', () => {
  describe('returns sanitized ID for valid inputs', () => {
    it('returns valid alphanumeric id', () => {
      expect(sanitizeId('prop-123')).toBe('prop-123');
    });

    it('returns id with underscores', () => {
      expect(sanitizeId('property_id_456')).toBe('property_id_456');
    });

    it('trims whitespace', () => {
      expect(sanitizeId('  prop-1  ')).toBe('prop-1');
    });

    it('handles simple numeric strings', () => {
      expect(sanitizeId('12345')).toBe('12345');
    });
  });

  describe('edge cases', () => {
    it('returns null for non-string input', () => {
      expect(sanitizeId(123)).toBeNull();
      expect(sanitizeId(null)).toBeNull();
      expect(sanitizeId(undefined)).toBeNull();
      expect(sanitizeId({})).toBeNull();
      expect(sanitizeId([])).toBeNull();
    });

    it('returns null for empty string', () => {
      expect(sanitizeId('')).toBeNull();
    });

    it('returns null for whitespace-only string', () => {
      expect(sanitizeId('   ')).toBeNull();
    });

    it('returns null for string exceeding max length (50 chars)', () => {
      const longId = 'a'.repeat(51);
      expect(sanitizeId(longId)).toBeNull();
    });

    it('accepts string at max length', () => {
      const maxId = 'a'.repeat(50);
      expect(sanitizeId(maxId)).toBe(maxId);
    });

    it('returns null for special characters', () => {
      expect(sanitizeId('prop<script>')).toBeNull();
      expect(sanitizeId('prop;DROP TABLE')).toBeNull();
      expect(sanitizeId('../../../etc')).toBeNull();
      expect(sanitizeId('prop id')).toBeNull(); // spaces not allowed
    });

    it('returns null for unicode characters', () => {
      expect(sanitizeId('prop-✓')).toBeNull();
      expect(sanitizeId('属性-1')).toBeNull();
    });
  });
});

describe('sanitizeAmount', () => {
  const MIN = 1000;
  const MAX = 100000000;

  describe('returns sanitized amount for valid inputs', () => {
    it('accepts valid number', () => {
      expect(sanitizeAmount(50000, MIN, MAX)).toBe(50000);
    });

    it('accepts minimum value', () => {
      expect(sanitizeAmount(MIN, MIN, MAX)).toBe(MIN);
    });

    it('accepts maximum value', () => {
      expect(sanitizeAmount(MAX, MIN, MAX)).toBe(MAX);
    });

    it('accepts string number', () => {
      expect(sanitizeAmount('75000', MIN, MAX)).toBe(75000);
    });

    it('handles string with commas', () => {
      expect(sanitizeAmount('1,250,000', MIN, MAX)).toBe(1250000);
    });

    it('handles decimal values with up to 2 places', () => {
      expect(sanitizeAmount(50000.50, MIN, MAX)).toBe(50000.50);
      // String parsing also works for whole numbers
      expect(sanitizeAmount('75000', MIN, MAX)).toBe(75000);
    });
  });

  describe('edge cases', () => {
    it('returns null for values below minimum', () => {
      expect(sanitizeAmount(999, MIN, MAX)).toBeNull();
      expect(sanitizeAmount(0, MIN, MAX)).toBeNull();
      expect(sanitizeAmount(-1000, MIN, MAX)).toBeNull();
    });

    it('returns null for values above maximum', () => {
      expect(sanitizeAmount(100000001, MIN, MAX)).toBeNull();
    });

    it('returns null for NaN', () => {
      expect(sanitizeAmount(NaN, MIN, MAX)).toBeNull();
      expect(sanitizeAmount('not-a-number', MIN, MAX)).toBeNull();
      expect(sanitizeAmount('abc', MIN, MAX)).toBeNull();
    });

    it('returns null for Infinity', () => {
      expect(sanitizeAmount(Infinity, MIN, MAX)).toBeNull();
      expect(sanitizeAmount(-Infinity, MIN, MAX)).toBeNull();
    });

    it('returns null for non-number/string types', () => {
      expect(sanitizeAmount(null, MIN, MAX)).toBeNull();
      expect(sanitizeAmount(undefined, MIN, MAX)).toBeNull();
      expect(sanitizeAmount({}, MIN, MAX)).toBeNull();
      expect(sanitizeAmount([], MIN, MAX)).toBeNull();
    });

    it('returns null for more than 2 decimal places', () => {
      expect(sanitizeAmount(50000.123, MIN, MAX)).toBeNull();
      expect(sanitizeAmount('50000.999', MIN, MAX)).toBeNull();
    });

    it('rounds to 2 decimal places', () => {
      expect(sanitizeAmount(50000.105, MIN, MAX)).toBeNull(); // 3 decimal places
    });
  });
});

describe('formatCurrency', () => {
  it('formats number as GBP with pound sign', () => {
    expect(formatCurrency(1000)).toBe('£1,000');
  });

  it('formats large numbers with commas', () => {
    expect(formatCurrency(1250000)).toBe('£1,250,000');
  });

  it('formats zero', () => {
    expect(formatCurrency(0)).toBe('£0');
  });

  it('rounds decimal values (no decimals shown)', () => {
    expect(formatCurrency(1000.50)).toBe('£1,001');
    expect(formatCurrency(1000.49)).toBe('£1,000');
  });

  it('formats millions correctly', () => {
    expect(formatCurrency(100000000)).toBe('£100,000,000');
  });
});

describe('formatDate', () => {
  it('formats ISO date to DD/MM/YYYY', () => {
    expect(formatDate('2024-03-15T10:00:00Z')).toBe('15/03/2024');
  });

  it('formats date at start of year', () => {
    expect(formatDate('2024-01-01T00:00:00Z')).toBe('01/01/2024');
  });

  it('formats date at end of year', () => {
    expect(formatDate('2023-12-31T12:00:00Z')).toBe('31/12/2023');
  });

  it('handles different timezone representations', () => {
    const result = formatDate('2024-06-15');
    expect(result).toMatch(/^\d{2}\/\d{2}\/\d{4}$/);
  });
});

describe('parseAmount', () => {
  it('parses plain number string', () => {
    expect(parseAmount('50000')).toBe(50000);
  });

  it('parses string with commas', () => {
    expect(parseAmount('1,250,000')).toBe(1250000);
  });

  it('parses decimal string', () => {
    expect(parseAmount('50000.50')).toBe(50000.50);
  });

  it('parses string with commas and decimals', () => {
    expect(parseAmount('1,250,000.99')).toBe(1250000.99);
  });

  it('returns NaN for invalid string', () => {
    expect(parseAmount('abc')).toBeNaN();
  });

  it('returns NaN for empty string', () => {
    expect(parseAmount('')).toBeNaN();
  });
});

describe('validateOfferAmount', () => {
  describe('returns null when amount is valid', () => {
    it('returns null for valid amount', () => {
      expect(validateOfferAmount('50000')).toBeNull();
    });

    it('returns null for minimum valid amount', () => {
      expect(validateOfferAmount('1000')).toBeNull();
    });

    it('returns null for amount with commas', () => {
      expect(validateOfferAmount('1,250,000')).toBeNull();
    });

    it('returns null for maximum valid amount', () => {
      expect(validateOfferAmount('100000000')).toBeNull();
    });
  });

  describe('validation errors', () => {
    it('returns required error for empty string', () => {
      expect(validateOfferAmount('')).toBe(UI_TEXT.OFFER_VALIDATION_REQUIRED);
    });

    it('returns required error for whitespace only', () => {
      expect(validateOfferAmount('   ')).toBe(UI_TEXT.OFFER_VALIDATION_REQUIRED);
    });

    it('returns number error for non-numeric input', () => {
      expect(validateOfferAmount('abc')).toBe(UI_TEXT.OFFER_VALIDATION_NUMBER);
    });

    it('returns min error for amount below minimum', () => {
      expect(validateOfferAmount('999')).toBe(UI_TEXT.OFFER_VALIDATION_MIN);
      expect(validateOfferAmount('0')).toBe(UI_TEXT.OFFER_VALIDATION_MIN);
    });

    it('returns max error for amount above maximum', () => {
      expect(validateOfferAmount('100000001')).toBe(UI_TEXT.OFFER_VALIDATION_MAX);
      expect(validateOfferAmount('999999999')).toBe(UI_TEXT.OFFER_VALIDATION_MAX);
    });
  });
});

describe('filterAndSortProperties', () => {
  const mockProperties: EnrichedProperty[] = [
    {
      id: 'prop-1',
      address: 'Alpha Street',
      price: 500000,
      status: PROPERTY_STATUS.AVAILABLE,
      listedDate: '2024-01-15T10:00:00Z',
      imageUrl: '/img1.jpg',
      _metadata: { offerCount: 2, contactCount: 2 },
    },
    {
      id: 'prop-2',
      address: 'Beta Road',
      price: 300000,
      status: PROPERTY_STATUS.SOLD,
      listedDate: '2024-02-20T10:00:00Z',
      imageUrl: '/img2.jpg',
      _metadata: { offerCount: 1, contactCount: 1 },
    },
    {
      id: 'prop-3',
      address: 'Gamma Lane',
      price: 700000,
      status: PROPERTY_STATUS.AVAILABLE,
      listedDate: '2024-01-10T10:00:00Z',
      imageUrl: '/img3.jpg',
      _metadata: { offerCount: 3, contactCount: 2 },
    },
  ];

  describe('filtering', () => {
    it('returns all properties when status is null', () => {
      const result = filterAndSortProperties(mockProperties, null, SORT_OPTIONS.NEWEST);
      expect(result).toHaveLength(3);
    });

    it('filters by Available status', () => {
      const result = filterAndSortProperties(mockProperties, PROPERTY_STATUS.AVAILABLE, SORT_OPTIONS.NEWEST);
      expect(result).toHaveLength(2);
      expect(result.every(p => p.status === PROPERTY_STATUS.AVAILABLE)).toBe(true);
    });

    it('filters by Sold status', () => {
      const result = filterAndSortProperties(mockProperties, PROPERTY_STATUS.SOLD, SORT_OPTIONS.NEWEST);
      expect(result).toHaveLength(1);
      expect(result[0].status).toBe(PROPERTY_STATUS.SOLD);
    });

    it('returns empty array when no properties match filter', () => {
      const result = filterAndSortProperties(mockProperties, PROPERTY_STATUS.SALE_AGREED, SORT_OPTIONS.NEWEST);
      expect(result).toHaveLength(0);
    });
  });

  describe('sorting', () => {
    it('sorts by newest first', () => {
      const result = filterAndSortProperties(mockProperties, null, SORT_OPTIONS.NEWEST);
      expect(result[0].id).toBe('prop-2'); // Feb 20
      expect(result[1].id).toBe('prop-1'); // Jan 15
      expect(result[2].id).toBe('prop-3'); // Jan 10
    });

    it('sorts by oldest first', () => {
      const result = filterAndSortProperties(mockProperties, null, SORT_OPTIONS.OLDEST);
      expect(result[0].id).toBe('prop-3'); // Jan 10
      expect(result[2].id).toBe('prop-2'); // Feb 20
    });

    it('sorts by price high to low', () => {
      const result = filterAndSortProperties(mockProperties, null, SORT_OPTIONS.PRICE_HIGH);
      expect(result[0].price).toBe(700000);
      expect(result[1].price).toBe(500000);
      expect(result[2].price).toBe(300000);
    });

    it('sorts by price low to high', () => {
      const result = filterAndSortProperties(mockProperties, null, SORT_OPTIONS.PRICE_LOW);
      expect(result[0].price).toBe(300000);
      expect(result[2].price).toBe(700000);
    });

    it('sorts by address A-Z', () => {
      const result = filterAndSortProperties(mockProperties, null, SORT_OPTIONS.ADDRESS_AZ);
      expect(result[0].address).toBe('Alpha Street');
      expect(result[1].address).toBe('Beta Road');
      expect(result[2].address).toBe('Gamma Lane');
    });

    it('sorts by address Z-A', () => {
      const result = filterAndSortProperties(mockProperties, null, SORT_OPTIONS.ADDRESS_ZA);
      expect(result[0].address).toBe('Gamma Lane');
      expect(result[2].address).toBe('Alpha Street');
    });
  });

  describe('combined filter and sort', () => {
    it('filters then sorts correctly', () => {
      const result = filterAndSortProperties(mockProperties, PROPERTY_STATUS.AVAILABLE, SORT_OPTIONS.PRICE_HIGH);
      expect(result).toHaveLength(2);
      expect(result[0].price).toBe(700000); // Gamma Lane
      expect(result[1].price).toBe(500000); // Alpha Street
    });
  });

  describe('edge cases', () => {
    it('handles empty array', () => {
      const result = filterAndSortProperties([], null, SORT_OPTIONS.NEWEST);
      expect(result).toHaveLength(0);
    });

    it('does not mutate original array', () => {
      const original = [...mockProperties];
      filterAndSortProperties(mockProperties, null, SORT_OPTIONS.PRICE_HIGH);
      expect(mockProperties).toEqual(original);
    });
  });
});

describe('sortOffers', () => {
  const mockOffers: Offer[] = [
    { id: 'o1', propertyId: 'p1', contactId: 'c1', amount: 100000, status: OFFER_STATUS.REJECTED, dateAdded: '2024-01-10T10:00:00Z' },
    { id: 'o2', propertyId: 'p1', contactId: 'c2', amount: 110000, status: OFFER_STATUS.PENDING, dateAdded: '2024-01-15T10:00:00Z' },
    { id: 'o3', propertyId: 'p1', contactId: 'c3', amount: 120000, status: OFFER_STATUS.ACCEPTED, dateAdded: '2024-01-12T10:00:00Z' },
    { id: 'o4', propertyId: 'p1', contactId: 'c4', amount: 115000, status: OFFER_STATUS.PENDING, dateAdded: '2024-01-20T10:00:00Z' },
  ];

  it('sorts by status priority (Accepted first, then Pending, then Rejected)', () => {
    const result = sortOffers(mockOffers);
    expect(result[0].status).toBe(OFFER_STATUS.ACCEPTED);
    expect(result[1].status).toBe(OFFER_STATUS.PENDING);
    expect(result[2].status).toBe(OFFER_STATUS.PENDING);
    expect(result[3].status).toBe(OFFER_STATUS.REJECTED);
  });

  it('sorts by date within same status (newest first)', () => {
    const result = sortOffers(mockOffers);
    // Both pending offers should be sorted by date (newest first)
    const pendingOffers = result.filter(o => o.status === OFFER_STATUS.PENDING);
    expect(pendingOffers[0].id).toBe('o4'); // Jan 20
    expect(pendingOffers[1].id).toBe('o2'); // Jan 15
  });

  it('handles empty array', () => {
    const result = sortOffers([]);
    expect(result).toHaveLength(0);
  });

  it('handles single offer', () => {
    const result = sortOffers([mockOffers[0]]);
    expect(result).toHaveLength(1);
  });

  it('does not mutate original array', () => {
    const original = [...mockOffers];
    sortOffers(mockOffers);
    expect(mockOffers).toEqual(original);
  });

  it('handles unknown status gracefully', () => {
    const offerWithUnknownStatus = {
      ...mockOffers[0],
      status: 'Unknown' as typeof OFFER_STATUS.PENDING,
    };
    const result = sortOffers([offerWithUnknownStatus, mockOffers[2]]);
    // Accepted should still come first
    expect(result[0].status).toBe(OFFER_STATUS.ACCEPTED);
  });
});

describe('extractCity', () => {
  describe('standard UK address formats', () => {
    it('extracts city from standard address with postcode', () => {
      expect(extractCity('12 Kensington Gardens, London W8 4PE')).toBe('London');
    });

    it('extracts city with multi-word postcode prefix', () => {
      expect(extractCity('45 Victoria Road, Manchester M20 3FH')).toBe('Manchester');
    });

    it('extracts city from Scottish address', () => {
      expect(extractCity('8 Castle Street, Edinburgh EH2 3AH')).toBe('Edinburgh');
    });

    it('extracts city from Welsh address', () => {
      expect(extractCity('15 High Street, Cardiff CF10 1AA')).toBe('Cardiff');
    });

    it('handles city with multiple words', () => {
      expect(extractCity('1 Main Road, Milton Keynes MK1 1AA')).toBe('Milton Keynes');
    });
  });

  describe('edge cases', () => {
    it('returns full address when no comma present', () => {
      expect(extractCity('London W8 4PE')).toBe('London W8 4PE');
    });

    it('handles address with multiple commas', () => {
      expect(extractCity('Flat 1, 12 High Street, London W1 1AA')).toBe('London');
    });

    it('handles trailing spaces', () => {
      expect(extractCity('12 High Street, London W1 1AA  ')).toBe('London');
    });

    it('handles address with no postcode', () => {
      expect(extractCity('12 High Street, London')).toBe('London');
    });

    it('handles empty string', () => {
      expect(extractCity('')).toBe('');
    });

    it('handles address with only street', () => {
      expect(extractCity('12 High Street')).toBe('12 High Street');
    });
  });
});
