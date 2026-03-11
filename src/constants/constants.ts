// UI Text Constants
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
  LISTED_PREFIX: "Listed:",
  AMOUNT_LABEL: "Amount",
  STATUS_LABEL: "Status",
} as const;

// Property Status Values
export const PROPERTY_STATUS = {
  AVAILABLE: "Available",
  SALE_AGREED: "Sale Agreed",
  SOLD: "Sold",
} as const;

// Offer Status Values
export const OFFER_STATUS = {
  ACCEPTED: "Accepted",
  REJECTED: "Rejected",
  PENDING: "Pending",
} as const;

// Status color mappings
export const PROPERTY_STATUS_COLORS: Record<string, string> = {
  [PROPERTY_STATUS.AVAILABLE]: "bg-green-100 text-green-800",
  [PROPERTY_STATUS.SALE_AGREED]: "bg-yellow-100 text-yellow-800",
  [PROPERTY_STATUS.SOLD]: "bg-blue-100 text-blue-800",
  default: "bg-gray-100 text-gray-800",
};

export const OFFER_STATUS_COLORS: Record<string, string> = {
  [OFFER_STATUS.ACCEPTED]: "bg-green-100 text-green-800",
  [OFFER_STATUS.REJECTED]: "bg-red-100 text-red-800",
  [OFFER_STATUS.PENDING]: "bg-yellow-100 text-yellow-800",
  default: "bg-gray-100 text-gray-800",
};

// Helper functions
export const getPropertyStatusColor = (status: string): string => {
  return PROPERTY_STATUS_COLORS[status] || PROPERTY_STATUS_COLORS.default;
};

export const getOfferStatusColor = (status: string): string => {
  return OFFER_STATUS_COLORS[status] || OFFER_STATUS_COLORS.default;
};

// Icons/Emojis
export const ICONS = {
  HOUSE: "🏠",
  APP_LOGO: "🏡",
} as const;

// API Routes
export const API_ROUTES = {
  PROPERTIES: "/api/properties",
  OFFERS: "/api/offers",
} as const;
