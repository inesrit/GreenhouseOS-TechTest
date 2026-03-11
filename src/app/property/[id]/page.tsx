"use client";

import { useState, useEffect } from "react";
import { UI_TEXT, ICONS, API_ROUTES, getPropertyStatusColor, getOfferStatusColor } from "@/constants/constants";
import type {
  Property,
  Offer,
  PropertyDetailPageProps,
  PropertyHeaderProps,
  OfferRowProps,
  PriceDisplayProps,
} from "@/types";

function PriceDisplay({ price }: PriceDisplayProps) {
  return (
    <p className="text-3xl font-bold text-green-700 mt-2">
      {price}
    </p>
  );
}

function PropertyHeader({
  address,
  price,
  status,
  listedDate,
}: PropertyHeaderProps) {
  return (
    <div className="p-6">
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">{address}</h1>
          <PriceDisplay price={price} />
          <p className="text-sm text-gray-400 mt-2">{UI_TEXT.LISTED_PREFIX} {listedDate}</p>
        </div>
        <span
          className={`px-3 py-1 rounded-full text-sm font-semibold ${getPropertyStatusColor(status)}`}
        >
          {status}
        </span>
      </div>
    </div>
  );
}

function OfferRow({ amount, status }: OfferRowProps) {
  return (
    <tr className="border-b border-gray-100 hover:bg-gray-50">
      <td className="py-3 px-4 font-medium text-gray-900">{amount}</td>
      <td className="py-3 px-4">
        <span className={`px-2 py-1 rounded-full text-xs font-semibold ${getOfferStatusColor(status)}`}>
          {status}
        </span>
      </td>
    </tr>
  );
}

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
        />
      </div>

      <div className="mt-8 bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-4">{UI_TEXT.OFFERS_TITLE}</h2>
        {loadingOffers ? (
          <p className="text-gray-400 py-4">{UI_TEXT.LOADING_OFFERS}</p>
        ) : offers.length === 0 ? (
          <p className="text-gray-400 py-4">{UI_TEXT.NO_OFFERS}</p>
        ) : (
          <table className="w-full">
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
        )}
      </div>
    </div>
  );
}
