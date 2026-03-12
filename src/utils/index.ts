/**
 * Utility functions for the application
 */
import type { EnrichedProperty, PropertyStatus, SortOption, Offer } from "@/types";
import { SORT_OPTIONS, UI_TEXT, OFFER_LIMITS, OFFER_STATUS_PRIORITY, PROPERTY_STATUS_COLORS, OFFER_STATUS_COLORS } from "@/constants";

const MAX_ID_LENGTH = 50;

/** Regex pattern for valid property/contact IDs */
const VALID_ID_PATTERN = /^[a-zA-Z0-9-_]+$/;

export function getPropertyStatusColor(status: string): string {
  return PROPERTY_STATUS_COLORS[status] || PROPERTY_STATUS_COLORS.default;
}

export function getOfferStatusColor(status: string): string {
  return OFFER_STATUS_COLORS[status] || OFFER_STATUS_COLORS.default;
}

export function sanitizeId(id: unknown): string | null {
  if (typeof id !== 'string') {
    return null;
  }
  
  const trimmed = id.trim();
  
  if (trimmed.length === 0 || trimmed.length > MAX_ID_LENGTH) {
    return null;
  }
  
  if (!VALID_ID_PATTERN.test(trimmed)) {
    return null;
  }
  
  return trimmed;
}

export function sanitizeAmount(
  value: unknown,
  min: number,
  max: number
): number | null {
  let amount: number;
  
  if (typeof value === 'number') {
    amount = value;
  } else if (typeof value === 'string') {
    const cleaned = value.replace(/,/g, '').trim();
    amount = parseFloat(cleaned);
  } else {
    return null;
  }
  
  if (
    isNaN(amount) ||
    !isFinite(amount) ||
    amount < min ||
    amount > max ||
    !Number.isInteger(amount * 100)
  ) {
    return null;
  }
  
  return Math.round(amount * 100) / 100;
}

/** Formats a number as GBP currency (e.g., "£1,250,000") */
export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-GB', {
    style: 'currency',
    currency: 'GBP',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

export function formatDate(dateString: string): string {
  return new Intl.DateTimeFormat('en-GB', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  }).format(new Date(dateString));
}

export function parseAmount(value: string): number {
  return parseFloat(value.replace(/,/g, ""));
}

export function validateOfferAmount(value: string): string | null {
  if (!value.trim()) {
    return UI_TEXT.OFFER_VALIDATION_REQUIRED;
  }

  const amount = parseAmount(value);

  if (isNaN(amount)) {
    return UI_TEXT.OFFER_VALIDATION_NUMBER;
  }

  if (amount < OFFER_LIMITS.MIN_AMOUNT) {
    return UI_TEXT.OFFER_VALIDATION_MIN;
  }

  if (amount > OFFER_LIMITS.MAX_AMOUNT) {
    return UI_TEXT.OFFER_VALIDATION_MAX;
  }

  return null;
}

export function filterAndSortProperties(
  properties: EnrichedProperty[],
  status: PropertyStatus | null,
  sortBy: SortOption
): EnrichedProperty[] {
  const filtered = status 
    ? properties.filter((p) => p.status === status) 
    : properties;
  
  const sorted = [...filtered];
  
  switch (sortBy) {
    case SORT_OPTIONS.NEWEST:
      return sorted.sort((a, b) => new Date(b.listedDate).getTime() - new Date(a.listedDate).getTime());
    case SORT_OPTIONS.OLDEST:
      return sorted.sort((a, b) => new Date(a.listedDate).getTime() - new Date(b.listedDate).getTime());
    case SORT_OPTIONS.PRICE_HIGH:
      return sorted.sort((a, b) => b.price - a.price);
    case SORT_OPTIONS.PRICE_LOW:
      return sorted.sort((a, b) => a.price - b.price);
    case SORT_OPTIONS.ADDRESS_AZ:
      return sorted.sort((a, b) => a.address.localeCompare(b.address));
    case SORT_OPTIONS.ADDRESS_ZA:
      return sorted.sort((a, b) => b.address.localeCompare(a.address));
    default:
      return sorted;
  }
}

/** Sorts offers by status priority (Accepted > Pending > Rejected), then by date */
export function sortOffers(offersList: Offer[]): Offer[] {
  return [...offersList].sort((a, b) => {
    const priorityA = OFFER_STATUS_PRIORITY[a.status] ?? 999;
    const priorityB = OFFER_STATUS_PRIORITY[b.status] ?? 999;
    if (priorityA !== priorityB) {
      return priorityA - priorityB;
    }
    return new Date(b.dateAdded).getTime() - new Date(a.dateAdded).getTime();
  });
}
