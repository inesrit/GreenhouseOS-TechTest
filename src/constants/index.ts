/**
 * Application constants and configuration values
 * Contains UI text, status values, colors, and helper functions
 */

// =============================================================================
// UI Text Constants
// =============================================================================

/**
 * Static UI text strings used throughout the application
 * Centralised for easy maintenance and potential i18n support
 */
export const UI_TEXT = {
  // Loading states
  LOADING_PROPERTIES: "Loading properties...",
  LOADING_PROPERTY: "Loading property...",
  LOADING_OFFERS: "Loading offers...",

  // Page titles & headings
  PROPERTIES_TITLE: "Properties",
  OFFERS_TITLE: "Offers",

  // Navigation
  NAV_PROPERTIES: "Properties",
  NAV_DASHBOARD: "Dashboard",
  NAV_SETTINGS: "Settings",
  BACK_TO_PROPERTIES: "← Back to Properties",

  // Empty states
  NO_OFFERS: "No offers yet.",

  // Labels
  LISTED_PREFIX: "Listed",
  LISTED_FOR: "for",
  DAY: "day",
  DAYS: "days",
  AMOUNT_LABEL: "Amount",
  STATUS_LABEL: "Status",

  // Badges
  HIGH_DEMAND: "🔥 High Demand",

  // Filter & Sort
  FILTER_ALL_STATUSES: "All Statuses",
  FILTER_BY_STATUS: "Filter by status",
  SORT_BY: "Sort by",
  SORT_NEWEST: "Newest First",
  SORT_OLDEST: "Oldest First",
  SORT_PRICE_HIGH: "Price: High to Low",
  SORT_PRICE_LOW: "Price: Low to High",
  SORT_ADDRESS_AZ: "Address: A-Z",
  SORT_ADDRESS_ZA: "Address: Z-A",

  // Offer Form
  MAKE_AN_OFFER: "Make an Offer",
  OFFER_AMOUNT: "Offer Amount (£)",
  OFFER_AMOUNT_PLACEHOLDER: "Enter amount",
  SUBMIT_OFFER: "Submit Offer",
  SUBMITTING_OFFER: "Submitting...",
  OFFER_SUCCESS: "Your offer has been submitted successfully!",
  OFFER_ERROR: "Failed to submit offer. Please try again.",
  OFFER_VALIDATION_REQUIRED: "Please enter an offer amount",
  OFFER_VALIDATION_MIN: "Offer must be at least £1,000",
  OFFER_VALIDATION_MAX: "Offer cannot exceed £100,000,000",
  OFFER_VALIDATION_NUMBER: "Please enter a valid number",
  PROPERTY_NOT_AVAILABLE: "This property is no longer accepting offers",

  // Smart Suggest
  SMART_SUGGEST: "Smart Suggest",
  SMART_SUGGEST_LOADING: "Analyzing...",
  SMART_SUGGEST_TOOLTIP: "Get an AI-powered offer suggestion based on market data",
  SMART_SUGGEST_ERROR: "Unable to get suggestion",
  SMART_SUGGEST_APPLIED: "Suggestion applied",

  // API Messages
  API_INVALID_JSON: "Invalid JSON in request body",
  API_INVALID_BODY: "Request body must be a JSON object",
  API_INVALID_PROPERTY_ID: "Invalid property ID format",
  API_PROPERTY_ID_REQUIRED: "Valid property ID is required",
  API_PROPERTY_NOT_FOUND: "Property not found",
  API_PROPERTY_NOT_ACCEPTING: "This property is not accepting offers",
  API_INVALID_CONTACT_ID: "Invalid contact ID format",
  API_OFFER_SUBMITTED: "Offer submitted successfully",
  API_OFFER_FAILED: "Failed to process offer. Please try again.",
} as const;

// =============================================================================
// Status & Role Constants
// =============================================================================

/**
 * Property listing status values
 * @property AVAILABLE - Property is on the market
 * @property SALE_AGREED - Offer accepted, sale in progress
 * @property SOLD - Property sale completed
 */
export const PROPERTY_STATUS = {
  AVAILABLE: "Available",
  SALE_AGREED: "Sale Agreed",
  SOLD: "Sold",
} as const;

/**
 * Offer status values
 * @property ACCEPTED - Offer has been accepted by vendor
 * @property REJECTED - Offer has been declined
 * @property PENDING - Offer awaiting response
 */
export const OFFER_STATUS = {
  ACCEPTED: "Accepted",
  REJECTED: "Rejected",
  PENDING: "Pending",
} as const;

/**
 * Contact role values
 * @property VENDOR - Property seller
 * @property BUYER - Potential property buyer
 */
export const CONTACT_ROLE = {
  VENDOR: "Vendor",
  BUYER: "Buyer",
} as const;

/**
 * Sort options for property listings
 */
export const SORT_OPTIONS = {
  NEWEST: "newest",
  OLDEST: "oldest",
  PRICE_HIGH: "price-high",
  PRICE_LOW: "price-low",
  ADDRESS_AZ: "address-az",
  ADDRESS_ZA: "address-za",
} as const;

/**
 * Offer amount limits in GBP
 */
export const OFFER_LIMITS = {
  MIN_AMOUNT: 1000,
  MAX_AMOUNT: 100000000,
} as const;

// =============================================================================
// Color Mappings
// =============================================================================

/**
 * Tailwind CSS classes for property status badge styling
 */
export const PROPERTY_STATUS_COLORS: Record<string, string> = {
  [PROPERTY_STATUS.AVAILABLE]: "bg-green-100 text-green-800",
  [PROPERTY_STATUS.SALE_AGREED]: "bg-yellow-100 text-yellow-800",
  [PROPERTY_STATUS.SOLD]: "bg-blue-100 text-blue-800",
  default: "bg-gray-100 text-gray-800",
};

/**
 * Tailwind CSS classes for offer status badge styling
 */
export const OFFER_STATUS_COLORS: Record<string, string> = {
  [OFFER_STATUS.ACCEPTED]: "bg-green-100 text-green-800",
  [OFFER_STATUS.REJECTED]: "bg-red-100 text-red-800",
  [OFFER_STATUS.PENDING]: "bg-yellow-100 text-yellow-800",
  default: "bg-gray-100 text-gray-800",
};

/**
 * Priority values for sorting offers (lower number = higher priority)
 * Used to display Accepted offers first, then Pending, then Rejected
 */
export const OFFER_STATUS_PRIORITY: Record<string, number> = {
  [OFFER_STATUS.ACCEPTED]: 1,
  [OFFER_STATUS.PENDING]: 2,
  [OFFER_STATUS.REJECTED]: 3,
};

// =============================================================================
// UI Assets
// =============================================================================

/**
 * Emoji icons used throughout the application
 */
export const ICONS = {
  HOUSE: "🏠",
  APP_LOGO: "🏡",
} as const;

// =============================================================================
// API Configuration
// =============================================================================

/**
 * API route paths for data fetching
 */
export const API_ROUTES = {
  PROPERTIES: "/api/properties",
  OFFERS: "/api/offers",
  OFFERS_SUGGEST: "/api/offers/suggest",
} as const;
