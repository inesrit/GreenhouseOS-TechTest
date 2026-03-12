/**
 * Home Page
 * Displays a grid of all property listings with filter and sort controls
 */
"use client";

import { useState, useEffect, useMemo } from "react";
import PropertyCard from "./components/PropertyCard";
import PropertyFilters from "./components/PropertyFilters";
import { UI_TEXT, API_ROUTES, SORT_OPTIONS } from "@/constants";
import { filterAndSortProperties } from "@/utils";
import type { EnrichedProperty, PropertyStatus, SortOption } from "@/types";

/**
 * Main home page component
 * Fetches all properties and displays them in a responsive grid
 * with real-time filtering and sorting capabilities
 */
export default function HomePage() {
  const [properties, setProperties] = useState<EnrichedProperty[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState<PropertyStatus | null>(null);
  const [sortBy, setSortBy] = useState<SortOption>(SORT_OPTIONS.NEWEST);

  useEffect(() => {
    const fetchProperties = async () => {
      const res = await fetch(API_ROUTES.PROPERTIES);
      const data: EnrichedProperty[] = await res.json();
      setProperties(data);
      setLoading(false);
    };
    fetchProperties();
  }, []);

  const displayedProperties = useMemo(
    () => filterAndSortProperties(properties, statusFilter, sortBy),
    [properties, statusFilter, sortBy]
  );

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
      </div>

      <PropertyFilters
        statusFilter={statusFilter}
        onStatusFilterChange={setStatusFilter}
        sortBy={sortBy}
        onSortChange={setSortBy}
        filteredCount={displayedProperties.length}
        totalCount={properties.length}
      />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {displayedProperties.map((property) => (
          <PropertyCard key={property.id} property={property} />
        ))}
      </div>
    </div>
  );
}
