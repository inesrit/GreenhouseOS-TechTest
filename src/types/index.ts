// =============================================================================
// Core Data Models
// =============================================================================

import { PROPERTY_STATUS, OFFER_STATUS } from "@/constants/constants";

// Property Status Type (union of allowed values)
export type PropertyStatus = typeof PROPERTY_STATUS[keyof typeof PROPERTY_STATUS];

// Offer Status Type (union of allowed values)
export type OfferStatus = typeof OFFER_STATUS[keyof typeof OFFER_STATUS];

// Contact Role Type
export type ContactRole = "Vendor" | "Buyer";

// =============================================================================
// Base Interfaces
// =============================================================================

export interface Property {
  id: string;
  address: string;
  price: number;
  status: PropertyStatus;
  listedDate: string;
  imageUrl: string;
}

export interface Contact {
  id: string;
  name: string;
  role: ContactRole;
  email: string;
}

export interface Offer {
  id: string;
  propertyId: string;
  contactId: string;
  amount: number;
  status: OfferStatus;
}

// =============================================================================
// Extended/Enriched Types (for API responses)
// =============================================================================

export interface PropertyMetadata {
  offerCount: number;
  contactCount: number;
}

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
}

export interface OfferRowProps {
  amount: number;
  status: OfferStatus;
}

export interface PriceDisplayProps {
  price: number;
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
// API Response Types
// =============================================================================

export interface ApiErrorResponse {
  error: string;
}
