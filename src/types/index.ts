/**
 * TypeScript type definitions for the application
 * Contains interfaces for data models, API responses, and component props
 */

// =============================================================================
// Core Data Models
// =============================================================================

import { PROPERTY_STATUS, OFFER_STATUS, CONTACT_ROLE, SORT_OPTIONS } from "@/constants";

export type PropertyStatus = typeof PROPERTY_STATUS[keyof typeof PROPERTY_STATUS];

export type OfferStatus = typeof OFFER_STATUS[keyof typeof OFFER_STATUS];

export type ContactRole = typeof CONTACT_ROLE[keyof typeof CONTACT_ROLE];

export type SortOption = typeof SORT_OPTIONS[keyof typeof SORT_OPTIONS];

// =============================================================================
// Base Interfaces
// =============================================================================

/**
 * Represents a property listing
 * @property id - Unique identifier for the property
 * @property address - Full property address
 * @property price - Listing price in GBP
 * @property status - Current listing status (Available, Sale Agreed, Sold)
 * @property listedDate - ISO date string when property was listed
 * @property imageUrl - URL to property image
 */
export interface Property {
  id: string;
  address: string;
  price: number;
  status: PropertyStatus;
  listedDate: string;
  imageUrl: string;
}

/**
 * Represents a contact (vendor or buyer)
 * @property id - Unique identifier for the contact
 * @property name - Full name of the contact
 * @property role - Contact role (Vendor or Buyer)
 * @property email - Contact email address
 */
export interface Contact {
  id: string;
  name: string;
  role: ContactRole;
  email: string;
}

/**
 * Represents an offer on a property
 * @property id - Unique identifier for the offer
 * @property propertyId - ID of the property this offer is for
 * @property contactId - ID of the contact who made the offer
 * @property amount - Offer amount in GBP
 * @property status - Current offer status (Accepted, Pending, Rejected)
 * @property dateAdded - ISO date string when offer was submitted
 */
export interface Offer {
  id: string;
  propertyId: string;
  contactId: string;
  amount: number;
  status: OfferStatus;
  dateAdded: string;
}

// =============================================================================
// Extended/Enriched Types (for API responses)
// =============================================================================

/**
 * Metadata attached to property API responses
 * @property offerCount - Number of offers on this property
 * @property contactCount - Number of contacts associated with this property
 */
export interface PropertyMetadata {
  offerCount: number;
  contactCount: number;
}

/**
 * Property with additional metadata from API
 * Used by property list to avoid N+1 queries
 */
export interface EnrichedProperty extends Property {
  _metadata: PropertyMetadata;
}

// =============================================================================
// Component Props Interfaces
// =============================================================================

export interface PropertyCardProps {
  property: EnrichedProperty;
}

export interface PropertyInfoProps {
  address: string;
  price: number;
  listedDate: string;
}

export interface PropertyCardContentProps extends PropertyInfoProps {
  status: PropertyStatus;
  offerCount: number;
  isLoadingOffers: boolean;
  propertyId: string;
}

export interface PropertyHeaderProps {
  address: string;
  price: number;
  status: PropertyStatus;
  listedDate: string;
  isHighDemand: boolean;
}

export interface OfferRowProps {
  amount: number;
  status: OfferStatus;
}

export interface PriceDisplayProps {
  price: number;
}

/**
 * Props for the PropertyFilters component
 */
export interface PropertyFiltersProps {
  statusFilter: PropertyStatus | null;
  onStatusFilterChange: (status: PropertyStatus | null) => void;
  sortBy: SortOption;
  onSortChange: (sort: SortOption) => void;
  filteredCount: number;
  totalCount: number;
}

/**
 * Props for the StatusFilter subcomponent
 */
export interface StatusFilterProps {
  value: PropertyStatus | null;
  onChange: (status: PropertyStatus | null) => void;
}

/**
 * Props for the SortSelect subcomponent
 */
export interface SortSelectProps {
  value: SortOption;
  onChange: (sort: SortOption) => void;
}

// =============================================================================
// Page Props Interfaces
// =============================================================================

export interface PropertyDetailPageProps {
  params: {
    id: string;
  };
}

// =============================================================================
// Offer Form Types
// =============================================================================

export interface OfferFormProps {
  propertyId: string;
  askingPrice: number;
  isAvailable: boolean;
  onOfferSubmitted: (offer: Offer) => void;
}

export type OfferFormStatus = "idle" | "submitting" | "success" | "error";

export interface OfferSubmitResponse {
  success: boolean;
  message: string;
  offer: Offer;
}
