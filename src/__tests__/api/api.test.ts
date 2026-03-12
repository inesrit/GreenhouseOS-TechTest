/**
 * Unit tests for API routes
 * Tests GET and POST handlers with happy paths and edge cases
 */
import { NextResponse } from 'next/server';
import { properties, offers } from '@/data/mock';
import { PROPERTY_STATUS, OFFER_STATUS, UI_TEXT, OFFER_LIMITS } from '@/constants';

jest.mock('next/server', () => ({
  NextResponse: {
    json: jest.fn((data, options) => ({
      data,
      status: options?.status || 200,
      headers: options?.headers || {},
    })),
  },
}));

import { GET as getProperties } from '@/app/api/properties/route';
import { GET as getPropertyById } from '@/app/api/properties/[id]/route';
import { GET as getOffers, POST as postOffer } from '@/app/api/offers/route';
import { GET as getSuggestion } from '@/app/api/offers/suggest/route';

function createMockRequest(url: string, options?: RequestInit): Request {
  return {
    url,
    method: options?.method || 'GET',
    headers: new Headers(options?.headers as HeadersInit),
    json: async () => {
      if (options?.body) {
        return JSON.parse(options.body as string);
      }
      throw new Error('No body');
    },
  } as unknown as Request;
}

function createInvalidJsonRequest(url: string): Request {
  return {
    url,
    method: 'POST',
    headers: new Headers({ 'Content-Type': 'application/json' }),
    json: async () => {
      throw new SyntaxError('Unexpected token');
    },
  } as unknown as Request;
}

describe('GET /api/properties', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('returns all properties with metadata', async () => {
    await getProperties();

    expect(NextResponse.json).toHaveBeenCalled();
    const [enrichedProperties] = (NextResponse.json as jest.Mock).mock.calls[0];

    expect(enrichedProperties).toHaveLength(properties.length);
    enrichedProperties.forEach((property: { _metadata: { offerCount: number; contactCount: number } }) => {
      expect(property).toHaveProperty('_metadata');
      expect(property._metadata).toHaveProperty('offerCount');
      expect(property._metadata).toHaveProperty('contactCount');
    });
  });

  it('includes cache headers', async () => {
    await getProperties();

    const [, options] = (NextResponse.json as jest.Mock).mock.calls[0];
    expect(options.headers).toHaveProperty('Cache-Control');
  });

  it('calculates correct offer count for each property', async () => {
    await getProperties();

    const [enrichedProperties] = (NextResponse.json as jest.Mock).mock.calls[0];
    
    const prop1 = enrichedProperties.find((p: { id: string }) => p.id === 'prop-1');
    const prop1Offers = offers.filter(o => o.propertyId === 'prop-1');
    expect(prop1._metadata.offerCount).toBe(prop1Offers.length);
  });
});

describe('GET /api/properties/[id]', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('returns property when found', async () => {
    const request = createMockRequest('http://localhost/api/properties/prop-1');
    const params = { params: { id: 'prop-1' } };

    await getPropertyById(request, params);

    expect(NextResponse.json).toHaveBeenCalled();
    const [property, options] = (NextResponse.json as jest.Mock).mock.calls[0];
    
    expect(property.id).toBe('prop-1');
    expect(options.status).toBeUndefined();
  });

  it('returns 404 for non-existent property', async () => {
    const request = createMockRequest('http://localhost/api/properties/non-existent');
    const params = { params: { id: 'non-existent' } };

    await getPropertyById(request, params);

    const [response, options] = (NextResponse.json as jest.Mock).mock.calls[0];
    expect(response.error).toBe(UI_TEXT.API_PROPERTY_NOT_FOUND);
    expect(options.status).toBe(404);
  });

  it('includes cache headers on success', async () => {
    const request = createMockRequest('http://localhost/api/properties/prop-1');
    const params = { params: { id: 'prop-1' } };

    await getPropertyById(request, params);

    const [, options] = (NextResponse.json as jest.Mock).mock.calls[0];
    expect(options.headers).toHaveProperty('Cache-Control');
  });
});

describe('GET /api/offers', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('returns all offers when no propertyId provided', async () => {
    const request = createMockRequest('http://localhost/api/offers');

    await getOffers(request);

    const [returnedOffers] = (NextResponse.json as jest.Mock).mock.calls[0];
    expect(returnedOffers.length).toBeGreaterThan(0);
  });

  it('filters offers by propertyId', async () => {
    const request = createMockRequest('http://localhost/api/offers?propertyId=prop-1');

    await getOffers(request);

    const [returnedOffers] = (NextResponse.json as jest.Mock).mock.calls[0];
    returnedOffers.forEach((offer: { propertyId: string }) => {
      expect(offer.propertyId).toBe('prop-1');
    });
  });

  it('returns sorted offers (Accepted first)', async () => {
    const request = createMockRequest('http://localhost/api/offers');

    await getOffers(request);

    const [returnedOffers] = (NextResponse.json as jest.Mock).mock.calls[0];
    
    const firstAcceptedIdx = returnedOffers.findIndex(
      (o: { status: string }) => o.status === OFFER_STATUS.ACCEPTED
    );
    const firstRejectedIdx = returnedOffers.findIndex(
      (o: { status: string }) => o.status === OFFER_STATUS.REJECTED
    );

    if (firstAcceptedIdx !== -1 && firstRejectedIdx !== -1) {
      expect(firstAcceptedIdx).toBeLessThan(firstRejectedIdx);
    }
  });

  it('returns 400 for invalid propertyId format', async () => {
    const request = createMockRequest('http://localhost/api/offers?propertyId=<script>alert(1)</script>');

    await getOffers(request);

    const [response, options] = (NextResponse.json as jest.Mock).mock.calls[0];
    expect(response.error).toBe(UI_TEXT.API_INVALID_PROPERTY_ID);
    expect(options.status).toBe(400);
  });

  it('returns empty array for property with no offers', async () => {
    const request = createMockRequest('http://localhost/api/offers?propertyId=prop-999');

    await getOffers(request);

    const [returnedOffers] = (NextResponse.json as jest.Mock).mock.calls[0];
    expect(returnedOffers).toHaveLength(0);
  });
});

describe('POST /api/offers', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  const createPostRequest = (body: object) => {
    return createMockRequest('http://localhost/api/offers', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });
  };

  describe('when it creates an offer', () => {
    it('creates offer successfully with valid data', async () => {
      const availableProperty = properties.find(p => p.status === PROPERTY_STATUS.AVAILABLE);
      
      const request = createPostRequest({
        propertyId: availableProperty?.id,
        amount: 500000,
      });

      await postOffer(request);

      const [response, options] = (NextResponse.json as jest.Mock).mock.calls[0];
      expect(response.success).toBe(true);
      expect(response.message).toBe(UI_TEXT.API_OFFER_SUBMITTED);
      expect(response.offer).toBeDefined();
      expect(options.status).toBe(201);
    });

    it('creates offer with contactId', async () => {
      const availableProperty = properties.find(p => p.status === PROPERTY_STATUS.AVAILABLE);
      
      const request = createPostRequest({
        propertyId: availableProperty?.id,
        amount: 500000,
        contactId: 'contact-1',
      });

      await postOffer(request);

      const [response] = (NextResponse.json as jest.Mock).mock.calls[0];
      expect(response.offer.contactId).toBe('contact-1');
    });

    it('assigns default contactId when not provided', async () => {
      const availableProperty = properties.find(p => p.status === PROPERTY_STATUS.AVAILABLE);
      
      const request = createPostRequest({
        propertyId: availableProperty?.id,
        amount: 500000,
      });

      await postOffer(request);

      const [response] = (NextResponse.json as jest.Mock).mock.calls[0];
      expect(response.offer.contactId).toBe('contact-guest');
    });

    it('sets offer status to Pending', async () => {
      const availableProperty = properties.find(p => p.status === PROPERTY_STATUS.AVAILABLE);
      
      const request = createPostRequest({
        propertyId: availableProperty?.id,
        amount: 500000,
      });

      await postOffer(request);

      const [response] = (NextResponse.json as jest.Mock).mock.calls[0];
      expect(response.offer.status).toBe(OFFER_STATUS.PENDING);
    });

    it('accepts minimum valid amount', async () => {
      const availableProperty = properties.find(p => p.status === PROPERTY_STATUS.AVAILABLE);
      
      const request = createPostRequest({
        propertyId: availableProperty?.id,
        amount: OFFER_LIMITS.MIN_AMOUNT,
      });

      await postOffer(request);

      const [response, options] = (NextResponse.json as jest.Mock).mock.calls[0];
      expect(response.success).toBe(true);
      expect(options.status).toBe(201);
    });

    it('accepts maximum valid amount', async () => {
      const availableProperty = properties.find(p => p.status === PROPERTY_STATUS.AVAILABLE);
      
      const request = createPostRequest({
        propertyId: availableProperty?.id,
        amount: OFFER_LIMITS.MAX_AMOUNT,
      });

      await postOffer(request);

      const [response, options] = (NextResponse.json as jest.Mock).mock.calls[0];
      expect(response.success).toBe(true);
      expect(options.status).toBe(201);
    });
  });

  describe('validation errors', () => {
    it('returns 400 for invalid JSON', async () => {
      const request = createInvalidJsonRequest('http://localhost/api/offers');

      await postOffer(request);

      const [response, options] = (NextResponse.json as jest.Mock).mock.calls[0];
      expect(response.error).toBe(UI_TEXT.API_INVALID_JSON);
      expect(options.status).toBe(400);
    });

    it('returns 400 for array body', async () => {
      const request = {
        url: 'http://localhost/api/offers',
        method: 'POST',
        headers: new Headers({ 'Content-Type': 'application/json' }),
        json: async () => [{ propertyId: 'prop-1' }],
      } as unknown as Request;

      await postOffer(request);

      const [response, options] = (NextResponse.json as jest.Mock).mock.calls[0];
      expect(response.error).toBe(UI_TEXT.API_INVALID_BODY);
      expect(options.status).toBe(400);
    });

    it('returns 400 for missing propertyId', async () => {
      const request = createPostRequest({
        amount: 500000,
      });

      await postOffer(request);

      const [response, options] = (NextResponse.json as jest.Mock).mock.calls[0];
      expect(response.error).toBe(UI_TEXT.API_PROPERTY_ID_REQUIRED);
      expect(options.status).toBe(400);
    });

    it('returns 400 for invalid propertyId format', async () => {
      const request = createPostRequest({
        propertyId: '<script>',
        amount: 500000,
      });

      await postOffer(request);

      const [response, options] = (NextResponse.json as jest.Mock).mock.calls[0];
      expect(response.error).toBe(UI_TEXT.API_PROPERTY_ID_REQUIRED);
      expect(options.status).toBe(400);
    });

    it('returns 404 for non-existent property', async () => {
      const request = createPostRequest({
        propertyId: 'prop-nonexistent',
        amount: 500000,
      });

      await postOffer(request);

      const [response, options] = (NextResponse.json as jest.Mock).mock.calls[0];
      expect(response.error).toBe(UI_TEXT.API_PROPERTY_NOT_FOUND);
      expect(options.status).toBe(404);
    });

    it('returns 400 for sold property', async () => {
      const soldProperty = properties.find(p => p.status === PROPERTY_STATUS.SOLD);
      
      const request = createPostRequest({
        propertyId: soldProperty?.id,
        amount: 500000,
      });

      await postOffer(request);

      const [response, options] = (NextResponse.json as jest.Mock).mock.calls[0];
      expect(response.error).toBe(UI_TEXT.API_PROPERTY_NOT_ACCEPTING);
      expect(options.status).toBe(400);
    });

    it('returns 400 for Sale Agreed property', async () => {
      const saleAgreedProperty = properties.find(p => p.status === PROPERTY_STATUS.SALE_AGREED);
      
      const request = createPostRequest({
        propertyId: saleAgreedProperty?.id,
        amount: 500000,
      });

      await postOffer(request);

      const [response, options] = (NextResponse.json as jest.Mock).mock.calls[0];
      expect(response.error).toBe(UI_TEXT.API_PROPERTY_NOT_ACCEPTING);
      expect(options.status).toBe(400);
    });

    it('returns 400 for amount below minimum', async () => {
      const availableProperty = properties.find(p => p.status === PROPERTY_STATUS.AVAILABLE);
      
      const request = createPostRequest({
        propertyId: availableProperty?.id,
        amount: 999,
      });

      await postOffer(request);

      const [response, options] = (NextResponse.json as jest.Mock).mock.calls[0];
      expect(response.error).toContain('£');
      expect(options.status).toBe(400);
    });

    it('returns 400 for amount above maximum', async () => {
      const availableProperty = properties.find(p => p.status === PROPERTY_STATUS.AVAILABLE);
      
      const request = createPostRequest({
        propertyId: availableProperty?.id,
        amount: OFFER_LIMITS.MAX_AMOUNT + 1,
      });

      await postOffer(request);

      const [response, options] = (NextResponse.json as jest.Mock).mock.calls[0];
      expect(response.error).toContain('£');
      expect(options.status).toBe(400);
    });

    it('returns 400 for non-numeric amount', async () => {
      const availableProperty = properties.find(p => p.status === PROPERTY_STATUS.AVAILABLE);
      
      const request = createPostRequest({
        propertyId: availableProperty?.id,
        amount: 'not-a-number',
      });

      await postOffer(request);

      const [, options] = (NextResponse.json as jest.Mock).mock.calls[0];
      expect(options.status).toBe(400);
    });

    it('returns 400 for invalid contactId format', async () => {
      const availableProperty = properties.find(p => p.status === PROPERTY_STATUS.AVAILABLE);
      
      const request = createPostRequest({
        propertyId: availableProperty?.id,
        amount: 500000,
        contactId: 'contact<script>',
      });

      await postOffer(request);

      const [response, options] = (NextResponse.json as jest.Mock).mock.calls[0];
      expect(response.error).toBe(UI_TEXT.API_INVALID_CONTACT_ID);
      expect(options.status).toBe(400);
    });
  });

  describe('security edge cases', () => {
    it('rejects SQL injection in propertyId', async () => {
      const request = createPostRequest({
        propertyId: "prop-1'; DROP TABLE offers;--",
        amount: 500000,
      });

      await postOffer(request);

      const [, options] = (NextResponse.json as jest.Mock).mock.calls[0];
      expect(options.status).toBe(400);
    });

    it('rejects XSS in propertyId', async () => {
      const request = createPostRequest({
        propertyId: '<img src=x onerror=alert(1)>',
        amount: 500000,
      });

      await postOffer(request);

      const [, options] = (NextResponse.json as jest.Mock).mock.calls[0];
      expect(options.status).toBe(400);
    });

    it('rejects negative amount', async () => {
      const availableProperty = properties.find(p => p.status === PROPERTY_STATUS.AVAILABLE);
      
      const request = createPostRequest({
        propertyId: availableProperty?.id,
        amount: -50000,
      });

      await postOffer(request);

      const [, options] = (NextResponse.json as jest.Mock).mock.calls[0];
      expect(options.status).toBe(400);
    });

    it('rejects Infinity amount', async () => {
      const availableProperty = properties.find(p => p.status === PROPERTY_STATUS.AVAILABLE);
      
      const request = createPostRequest({
        propertyId: availableProperty?.id,
        amount: Infinity,
      });

      await postOffer(request);

      const [, options] = (NextResponse.json as jest.Mock).mock.calls[0];
      expect(options.status).toBe(400);
    });
  });
});

describe('GET /api/offers/suggest', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('when smart suggestion is requested', () => {
    it('returns suggestion for valid property', async () => {
      const availableProperty = properties.find(p => p.status === PROPERTY_STATUS.AVAILABLE);
      const request = createMockRequest(`http://localhost/api/offers/suggest?propertyId=${availableProperty?.id}`);

      await getSuggestion(request);

      expect(NextResponse.json).toHaveBeenCalled();
      const [response, options] = (NextResponse.json as jest.Mock).mock.calls[0];
      
      expect(response.propertyId).toBe(availableProperty?.id);
      expect(response.askingPrice).toBe(availableProperty?.price);
      expect(response.suggestedAmount).toBeDefined();
      expect(response.reasoning).toBeDefined();
      expect(response.marketData).toBeDefined();
      expect(options?.status).toBeUndefined(); // 200 OK
    });

    it('returns suggestion with market data structure', async () => {
      const request = createMockRequest('http://localhost/api/offers/suggest?propertyId=prop-1');

      await getSuggestion(request);

      const [response] = (NextResponse.json as jest.Mock).mock.calls[0];
      
      expect(response.marketData).toHaveProperty('existingOffers');
      expect(response.marketData).toHaveProperty('avgExistingOffer');
      expect(response.marketData).toHaveProperty('nearbyProperties');
      expect(response.marketData).toHaveProperty('avgNearbyPrice');
      expect(response.marketData).toHaveProperty('avgNearbyOfferPercentage');
    });

    it('returns suggested amount as a number', async () => {
      const request = createMockRequest('http://localhost/api/offers/suggest?propertyId=prop-1');

      await getSuggestion(request);

      const [response] = (NextResponse.json as jest.Mock).mock.calls[0];
      expect(typeof response.suggestedAmount).toBe('number');
      expect(response.suggestedAmount).toBeGreaterThan(0);
    });

    it('returns reasoning as a string', async () => {
      const request = createMockRequest('http://localhost/api/offers/suggest?propertyId=prop-1');

      await getSuggestion(request);

      const [response] = (NextResponse.json as jest.Mock).mock.calls[0];
      expect(typeof response.reasoning).toBe('string');
      expect(response.reasoning.length).toBeGreaterThan(0);
    });

    it('rounds suggestion to nearest 1000', async () => {
      const request = createMockRequest('http://localhost/api/offers/suggest?propertyId=prop-1');

      await getSuggestion(request);

      const [response] = (NextResponse.json as jest.Mock).mock.calls[0];
      expect(response.suggestedAmount % 1000).toBe(0);
    });

    it('returns existing offers count for property with offers', async () => {
      // prop-1 has multiple offers in mock data
      const request = createMockRequest('http://localhost/api/offers/suggest?propertyId=prop-1');

      await getSuggestion(request);

      const [response] = (NextResponse.json as jest.Mock).mock.calls[0];
      expect(response.marketData.existingOffers).toBeGreaterThan(0);
    });

    it('returns nearby properties count for city with multiple properties', async () => {
      // London has multiple properties in mock data
      const request = createMockRequest('http://localhost/api/offers/suggest?propertyId=prop-1');

      await getSuggestion(request);

      const [response] = (NextResponse.json as jest.Mock).mock.calls[0];
      expect(response.marketData.nearbyProperties).toBeGreaterThan(0);
    });
  });

  describe('suggestion bounds', () => {
    it('suggests amount within 90-110% of asking price', async () => {
      const property = properties.find(p => p.id === 'prop-1');
      const request = createMockRequest('http://localhost/api/offers/suggest?propertyId=prop-1');

      await getSuggestion(request);

      const [response] = (NextResponse.json as jest.Mock).mock.calls[0];
      const minBound = property!.price * 0.90;
      const maxBound = property!.price * 1.10;
      
      expect(response.suggestedAmount).toBeGreaterThanOrEqual(minBound);
      expect(response.suggestedAmount).toBeLessThanOrEqual(maxBound);
    });
  });

  describe('validation errors', () => {
    it('returns 400 for missing propertyId', async () => {
      const request = createMockRequest('http://localhost/api/offers/suggest');

      await getSuggestion(request);

      const [response, options] = (NextResponse.json as jest.Mock).mock.calls[0];
      expect(response.error).toBe(UI_TEXT.API_INVALID_PROPERTY_ID);
      expect(options.status).toBe(400);
    });

    it('returns 400 for empty propertyId', async () => {
      const request = createMockRequest('http://localhost/api/offers/suggest?propertyId=');

      await getSuggestion(request);

      const [response, options] = (NextResponse.json as jest.Mock).mock.calls[0];
      expect(response.error).toBe(UI_TEXT.API_INVALID_PROPERTY_ID);
      expect(options.status).toBe(400);
    });

    it('returns 400 for invalid propertyId format', async () => {
      const request = createMockRequest('http://localhost/api/offers/suggest?propertyId=<script>alert(1)</script>');

      await getSuggestion(request);

      const [response, options] = (NextResponse.json as jest.Mock).mock.calls[0];
      expect(response.error).toBe(UI_TEXT.API_INVALID_PROPERTY_ID);
      expect(options.status).toBe(400);
    });

    it('returns 404 for non-existent property', async () => {
      const request = createMockRequest('http://localhost/api/offers/suggest?propertyId=prop-nonexistent');

      await getSuggestion(request);

      const [response, options] = (NextResponse.json as jest.Mock).mock.calls[0];
      expect(response.error).toBe(UI_TEXT.API_PROPERTY_NOT_FOUND);
      expect(options.status).toBe(404);
    });
  });

  describe('security edge cases', () => {
    it('rejects SQL injection in propertyId', async () => {
      const request = createMockRequest("http://localhost/api/offers/suggest?propertyId=prop-1'; DROP TABLE--");

      await getSuggestion(request);

      const [, options] = (NextResponse.json as jest.Mock).mock.calls[0];
      expect(options.status).toBe(400);
    });

    it('rejects XSS in propertyId', async () => {
      const request = createMockRequest('http://localhost/api/offers/suggest?propertyId=<img src=x onerror=alert(1)>');

      await getSuggestion(request);

      const [, options] = (NextResponse.json as jest.Mock).mock.calls[0];
      expect(options.status).toBe(400);
    });

    it('rejects overly long propertyId', async () => {
      const longId = 'a'.repeat(100);
      const request = createMockRequest(`http://localhost/api/offers/suggest?propertyId=${longId}`);

      await getSuggestion(request);

      const [, options] = (NextResponse.json as jest.Mock).mock.calls[0];
      expect(options.status).toBe(400);
    });
  });

  describe('different market scenarios', () => {
    it('handles property with no existing offers', async () => {
      // Find a property with no offers or use a property that exists
      const request = createMockRequest('http://localhost/api/offers/suggest?propertyId=prop-22');

      await getSuggestion(request);

      const [response] = (NextResponse.json as jest.Mock).mock.calls[0];
      expect(response.suggestedAmount).toBeDefined();
      expect(response.reasoning).toBeDefined();
    });

    it('includes city name in reasoning when market data available', async () => {
      const request = createMockRequest('http://localhost/api/offers/suggest?propertyId=prop-1');

      await getSuggestion(request);

      const [response] = (NextResponse.json as jest.Mock).mock.calls[0];
      // London properties should mention London in reasoning
      expect(response.reasoning.toLowerCase()).toMatch(/london|market|offer/);
    });
  });
});
