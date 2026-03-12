/**
 * Property Detail Page
 * Displays full property information including address, price, status,
 * high demand badge, and a list of all offers on the property
 */
"use client";

import { useState, useEffect, useCallback } from "react";
import { UI_TEXT, ICONS, API_ROUTES, PROPERTY_STATUS } from "@/constants";
import { formatCurrency, formatDate, getPropertyStatusColor, getOfferStatusColor } from "@/utils";
import OfferForm from "../../components/OfferForm";
import type {
  Property,
  Offer,
  PropertyDetailPageProps,
  PropertyHeaderProps,
  OfferRowProps,
  PriceDisplayProps,
} from "@/types";

/**
 * Displays the property price in large format
 * @param price - The property price in GBP
 */
function PriceDisplay({ price }: PriceDisplayProps) {
  return (
    <p className="text-3xl font-bold text-green-700 mt-2">
      {formatCurrency(price)}
    </p>
  );
}

/**
 * Property header section with address, price, status badge, and high demand indicator
 * @param address - Full property address
 * @param price - Property price in GBP
 * @param status - Current listing status
 * @param listedDate - Date when property was listed
 * @param isHighDemand - Whether to show the high demand badge
 */
function PropertyHeader({
  address,
  price,
  status,
  listedDate,
  isHighDemand,
}: PropertyHeaderProps) {
  return (
    <div className="p-4 sm:p-6">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-3">
        <div className="flex-1 min-w-0">
          <div className="flex flex-wrap items-center gap-2 sm:gap-3">
            <h1 className="text-xl sm:text-3xl font-bold text-gray-900 break-words">{address}</h1>
            {isHighDemand && (
              <span className="px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm font-semibold bg-orange-100 text-orange-800 whitespace-nowrap">
                {UI_TEXT.HIGH_DEMAND}
              </span>
            )}
          </div>
          <PriceDisplay price={price} />
          <p className="text-sm text-gray-400 mt-2">{UI_TEXT.LISTED_PREFIX}: {formatDate(listedDate)}</p>
        </div>
        <span
          className={`px-3 py-1 rounded-full text-sm font-semibold whitespace-nowrap self-start ${getPropertyStatusColor(status)}`}
        >
          {status}
        </span>
      </div>
    </div>
  );
}

/**
 * Table row component for displaying an offer
 * @param amount - Offer amount in GBP
 * @param status - Current offer status
 */
function OfferRow({ amount, status }: OfferRowProps) {
  return (
    <tr className="border-b border-gray-100 hover:bg-gray-50">
      <td className="py-3 px-4 font-medium text-gray-900">{formatCurrency(amount)}</td>
      <td className="py-3 px-4">
        <span className={`px-2 py-1 rounded-full text-xs font-semibold ${getOfferStatusColor(status)}`}>
          {status}
        </span>
      </td>
    </tr>
  );
}

/**
 * Main property detail page component
 * Fetches and displays property data and associated offers
 * @param params - Route parameters containing the property ID
 */
export default function PropertyDetailPage({ params }: PropertyDetailPageProps) {
  const [property, setProperty] = useState<Property | null>(null);
  const [offers, setOffers] = useState<Offer[]>([]);
  const [loadingProperty, setLoadingProperty] = useState(true);
  const [loadingOffers, setLoadingOffers] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      const [propertyRes, offersRes] = await Promise.all([
        fetch(`${API_ROUTES.PROPERTIES}/${params.id}`),
        fetch(`${API_ROUTES.OFFERS}?propertyId=${params.id}`)
      ]);

      const [propertyData, offersData] = await Promise.all([
        propertyRes.json(),
        offersRes.json()
      ]);

      setProperty(propertyData);
      setLoadingProperty(false);
      setOffers(offersData);
      setLoadingOffers(false);
    };

    fetchData();
  }, []);

  const handleOfferSubmitted = useCallback((newOffer: Offer) => {
    setOffers((prevOffers) => [newOffer, ...prevOffers]);
  }, []);

  if (loadingProperty) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-700 mx-auto"></div>
          <p className="mt-4 text-gray-500">{UI_TEXT.LOADING_PROPERTY}</p>
        </div>
      </div>
    );
  }

  return (
    <div>
      <a
        href="/"
        className="text-green-700 hover:underline text-sm mb-4 inline-block"
      >
        {UI_TEXT.BACK_TO_PROPERTIES}
      </a>

      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="bg-gray-200 h-72 flex items-center justify-center">
          <span className="text-gray-400 text-6xl">{ICONS.HOUSE}</span>
        </div>
        <PropertyHeader
          address={property.address}
          price={property.price}
          status={property.status}
          listedDate={property.listedDate}
          isHighDemand={property.status === PROPERTY_STATUS.AVAILABLE && offers.some((offer) => offer.amount > property.price)}
        />
      </div>

      <div className="mt-8">
        <OfferForm
          propertyId={property.id}
          askingPrice={property.price}
          isAvailable={property.status === PROPERTY_STATUS.AVAILABLE}
          onOfferSubmitted={handleOfferSubmitted}
        />
      </div>

      <div className="mt-8 bg-white rounded-lg shadow-md p-4 sm:p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-4">{UI_TEXT.OFFERS_TITLE}</h2>
        {loadingOffers ? (
          <p className="text-gray-400 py-4">{UI_TEXT.LOADING_OFFERS}</p>
        ) : offers.length === 0 ? (
          <p className="text-gray-400 py-4">{UI_TEXT.NO_OFFERS}</p>
        ) : (
          <div className="overflow-x-auto -mx-4 sm:mx-0">
            <table className="w-full min-w-[300px]">
              <thead>
                <tr className="text-left text-sm text-gray-500 border-b border-gray-200">
                  <th className="py-2 px-4">{UI_TEXT.AMOUNT_LABEL}</th>
                  <th className="py-2 px-4">{UI_TEXT.STATUS_LABEL}</th>
                </tr>
              </thead>
              <tbody>
                {offers.map((offer) => (
                  <OfferRow
                    key={offer.id}
                    amount={offer.amount}
                    status={offer.status}
                  />
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
