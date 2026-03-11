"use client";

import { useState, useEffect } from "react";
import PropertyCard from "./components/PropertyCard";
import { UI_TEXT, API_ROUTES } from "@/constants/constants";
import type { EnrichedProperty } from "@/types";

export default function HomePage() {
  const [properties, setProperties] = useState<EnrichedProperty[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProperties = async () => {
      const res = await fetch(API_ROUTES.PROPERTIES);
      const data: EnrichedProperty[] = await res.json();
      setProperties(data);
      setLoading(false);
    };
    fetchProperties();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-700 mx-auto"></div>
          <p className="mt-4 text-gray-500">{UI_TEXT.LOADING_PROPERTIES}</p>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">{UI_TEXT.PROPERTIES_TITLE}</h1>
        <p className="text-gray-500 mt-1">
          Showing {properties.length} properties
        </p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {properties.map((property) => (
          <PropertyCard key={property.id} property={property} />
        ))}
      </div>
    </div>
  );
}
