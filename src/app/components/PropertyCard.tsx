/**
 * PropertyCard Component
 * Displays a property listing card with image, address, price, status, and offer count
 */
"use client";

import { UI_TEXT, ICONS } from "@/constants";
import { formatCurrency, getPropertyStatusColor } from "@/utils";
import type {
  PropertyCardProps,
  PropertyInfoProps,
  PropertyCardContentProps,
  PriceDisplayProps,
} from "@/types";

/**
 * Displays the property price in GBP format
 * @param price - The property price in GBP
 */
function PriceTag({ price }: PriceDisplayProps) {
  return (
    <p className="text-2xl font-bold text-green-700 mt-1">
      {formatCurrency(price)}
    </p>
  );
}

/**
 * Displays property address, price, and days listed
 * @param address - Full property address
 * @param price - Property price in GBP
 * @param listedDate - ISO date string when property was listed
 */
function PropertyInfo({
  address,
  price,
  listedDate,
}: PropertyInfoProps) {
  const daysListed = Math.floor((new Date().getTime() - new Date(listedDate).getTime()) / (1000 * 60 * 60 * 24));
  const dayLabel = daysListed === 1 ? UI_TEXT.DAY : UI_TEXT.DAYS;
  return (
    <div>
      <h3 className="font-semibold text-lg text-gray-900 truncate">{address}</h3>
      <PriceTag price={price} />
      <p className="text-xs text-gray-400 mt-1">
        {UI_TEXT.LISTED_PREFIX} {UI_TEXT.LISTED_FOR} {daysListed} {dayLabel}
      </p>
    </div>
  );
}

function PropertyCardContent({
  address,
  price,
  status,
  listedDate,
  offerCount,
  isLoadingOffers,
  propertyId,
}: PropertyCardContentProps) {
  return (
    <a href={`/property/${propertyId}`} className="block">
      <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow cursor-pointer border border-gray-100">
        <div className="bg-gray-200 h-48 flex items-center justify-center">
          <span className="text-gray-400 text-4xl">{ICONS.HOUSE}</span>
        </div>
        <div className="p-4">
          <PropertyInfo address={address} price={price} listedDate={listedDate} />
          <div className="flex justify-between items-center mt-3">
            <span className={`px-2 py-1 rounded-full text-xs font-semibold ${getPropertyStatusColor(status)}`}>
              {status}
            </span>
            {isLoadingOffers ? (
              <span className="text-gray-400 text-sm">{UI_TEXT.LOADING_OFFERS}</span>
            ) : (
              <span className="text-sm text-gray-600">
                {offerCount} offer{offerCount !== 1 ? "s" : ""}
              </span>
            )}
          </div>
        </div>
      </div>
    </a>
  );
}

/**
 * Main PropertyCard component
 * Renders a clickable property card for the home page grid
 * @param property - Enriched property data including metadata
 */
export default function PropertyCard({ property }: PropertyCardProps) {
  const offerCount = property._metadata?.offerCount ?? 0;
  const isLoadingOffers = false;

  return (
    <PropertyCardContent
      address={property.address}
      price={property.price}
      status={property.status}
      listedDate={property.listedDate}
      offerCount={offerCount}
      isLoadingOffers={isLoadingOffers}
      propertyId={property.id}
    />
  );
}
