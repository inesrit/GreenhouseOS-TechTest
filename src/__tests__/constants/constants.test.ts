/**
 * Unit tests for constants
 * Ensures constant values are correct and complete
 */
import {
  UI_TEXT,
  PROPERTY_STATUS,
  OFFER_STATUS,
  CONTACT_ROLE,
  SORT_OPTIONS,
  OFFER_LIMITS,
  PROPERTY_STATUS_COLORS,
  OFFER_STATUS_COLORS,
  OFFER_STATUS_PRIORITY,
  ICONS,
  API_ROUTES,
} from '@/constants';

describe('UI_TEXT', () => {
  describe('loading states', () => {
    it('has loading text for properties', () => {
      expect(UI_TEXT.LOADING_PROPERTIES).toBe('Loading properties...');
    });

    it('has loading text for property', () => {
      expect(UI_TEXT.LOADING_PROPERTY).toBe('Loading property...');
    });

    it('has loading text for offers', () => {
      expect(UI_TEXT.LOADING_OFFERS).toBe('Loading offers...');
    });
  });

  describe('offer validation messages', () => {
    it('has required validation message', () => {
      expect(UI_TEXT.OFFER_VALIDATION_REQUIRED).toBe('Please enter an offer amount');
    });

    it('has min validation message', () => {
      expect(UI_TEXT.OFFER_VALIDATION_MIN).toBe('Offer must be at least £1,000');
    });

    it('has max validation message', () => {
      expect(UI_TEXT.OFFER_VALIDATION_MAX).toBe('Offer cannot exceed £100,000,000');
    });

    it('has number validation message', () => {
      expect(UI_TEXT.OFFER_VALIDATION_NUMBER).toBe('Please enter a valid number');
    });
  });

  describe('API messages', () => {
    it('has invalid JSON message', () => {
      expect(UI_TEXT.API_INVALID_JSON).toBe('Invalid JSON in request body');
    });

    it('has property not found message', () => {
      expect(UI_TEXT.API_PROPERTY_NOT_FOUND).toBe('Property not found');
    });

    it('has offer submitted message', () => {
      expect(UI_TEXT.API_OFFER_SUBMITTED).toBe('Offer submitted successfully');
    });
  });
});

describe('PROPERTY_STATUS', () => {
  it('has Available status', () => {
    expect(PROPERTY_STATUS.AVAILABLE).toBe('Available');
  });

  it('has Sale Agreed status', () => {
    expect(PROPERTY_STATUS.SALE_AGREED).toBe('Sale Agreed');
  });

  it('has Sold status', () => {
    expect(PROPERTY_STATUS.SOLD).toBe('Sold');
  });

  it('has exactly 3 statuses', () => {
    expect(Object.keys(PROPERTY_STATUS)).toHaveLength(3);
  });
});

describe('OFFER_STATUS', () => {
  it('has Accepted status', () => {
    expect(OFFER_STATUS.ACCEPTED).toBe('Accepted');
  });

  it('has Rejected status', () => {
    expect(OFFER_STATUS.REJECTED).toBe('Rejected');
  });

  it('has Pending status', () => {
    expect(OFFER_STATUS.PENDING).toBe('Pending');
  });

  it('has exactly 3 statuses', () => {
    expect(Object.keys(OFFER_STATUS)).toHaveLength(3);
  });
});

describe('CONTACT_ROLE', () => {
  it('has Vendor role', () => {
    expect(CONTACT_ROLE.VENDOR).toBe('Vendor');
  });

  it('has Buyer role', () => {
    expect(CONTACT_ROLE.BUYER).toBe('Buyer');
  });

  it('has exactly 2 roles', () => {
    expect(Object.keys(CONTACT_ROLE)).toHaveLength(2);
  });
});

describe('SORT_OPTIONS', () => {
  it('has all sort options', () => {
    expect(SORT_OPTIONS.NEWEST).toBe('newest');
    expect(SORT_OPTIONS.OLDEST).toBe('oldest');
    expect(SORT_OPTIONS.PRICE_HIGH).toBe('price-high');
    expect(SORT_OPTIONS.PRICE_LOW).toBe('price-low');
    expect(SORT_OPTIONS.ADDRESS_AZ).toBe('address-az');
    expect(SORT_OPTIONS.ADDRESS_ZA).toBe('address-za');
  });

  it('has exactly 6 sort options', () => {
    expect(Object.keys(SORT_OPTIONS)).toHaveLength(6);
  });
});

describe('OFFER_LIMITS', () => {
  it('has minimum amount of 1000', () => {
    expect(OFFER_LIMITS.MIN_AMOUNT).toBe(1000);
  });

  it('has maximum amount of 100 million', () => {
    expect(OFFER_LIMITS.MAX_AMOUNT).toBe(100000000);
  });

  it('has min less than max', () => {
    expect(OFFER_LIMITS.MIN_AMOUNT).toBeLessThan(OFFER_LIMITS.MAX_AMOUNT);
  });
});

describe('PROPERTY_STATUS_COLORS', () => {
  it('has color for Available status', () => {
    expect(PROPERTY_STATUS_COLORS[PROPERTY_STATUS.AVAILABLE]).toBe('bg-green-100 text-green-800');
  });

  it('has color for Sale Agreed status', () => {
    expect(PROPERTY_STATUS_COLORS[PROPERTY_STATUS.SALE_AGREED]).toBe('bg-yellow-100 text-yellow-800');
  });

  it('has color for Sold status', () => {
    expect(PROPERTY_STATUS_COLORS[PROPERTY_STATUS.SOLD]).toBe('bg-blue-100 text-blue-800');
  });

  it('has default color', () => {
    expect(PROPERTY_STATUS_COLORS.default).toBe('bg-gray-100 text-gray-800');
  });

  it('each color contains bg and text classes', () => {
    Object.values(PROPERTY_STATUS_COLORS).forEach(color => {
      expect(color).toMatch(/^bg-\w+-\d+ text-\w+-\d+$/);
    });
  });
});

describe('OFFER_STATUS_COLORS', () => {
  it('has color for Accepted status', () => {
    expect(OFFER_STATUS_COLORS[OFFER_STATUS.ACCEPTED]).toBe('bg-green-100 text-green-800');
  });

  it('has color for Rejected status', () => {
    expect(OFFER_STATUS_COLORS[OFFER_STATUS.REJECTED]).toBe('bg-red-100 text-red-800');
  });

  it('has color for Pending status', () => {
    expect(OFFER_STATUS_COLORS[OFFER_STATUS.PENDING]).toBe('bg-yellow-100 text-yellow-800');
  });

  it('has default color', () => {
    expect(OFFER_STATUS_COLORS.default).toBe('bg-gray-100 text-gray-800');
  });
});

describe('OFFER_STATUS_PRIORITY', () => {
  it('has Accepted with highest priority (lowest number)', () => {
    expect(OFFER_STATUS_PRIORITY[OFFER_STATUS.ACCEPTED]).toBe(1);
  });

  it('has Pending with medium priority', () => {
    expect(OFFER_STATUS_PRIORITY[OFFER_STATUS.PENDING]).toBe(2);
  });

  it('has Rejected with lowest priority (highest number)', () => {
    expect(OFFER_STATUS_PRIORITY[OFFER_STATUS.REJECTED]).toBe(3);
  });

  it('Accepted has higher priority than Pending', () => {
    expect(OFFER_STATUS_PRIORITY[OFFER_STATUS.ACCEPTED]).toBeLessThan(
      OFFER_STATUS_PRIORITY[OFFER_STATUS.PENDING]
    );
  });

  it('Pending has higher priority than Rejected', () => {
    expect(OFFER_STATUS_PRIORITY[OFFER_STATUS.PENDING]).toBeLessThan(
      OFFER_STATUS_PRIORITY[OFFER_STATUS.REJECTED]
    );
  });
});

describe('ICONS', () => {
  it('has house icon', () => {
    expect(ICONS.HOUSE).toBe('🏠');
  });

  it('has app logo icon', () => {
    expect(ICONS.APP_LOGO).toBe('🏡');
  });
});

describe('API_ROUTES', () => {
  it('has properties route', () => {
    expect(API_ROUTES.PROPERTIES).toBe('/api/properties');
  });

  it('has offers route', () => {
    expect(API_ROUTES.OFFERS).toBe('/api/offers');
  });

  it('routes start with /api/', () => {
    Object.values(API_ROUTES).forEach(route => {
      expect(route).toMatch(/^\/api\//);
    });
  });
});
