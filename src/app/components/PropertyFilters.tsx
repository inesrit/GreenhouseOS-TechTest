/**
 * PropertyFilters Component
 * Provides filter and sort controls for the main properties listing page
 */
"use client";

import type { PropertyFiltersProps } from "@/types";
import StatusFilter from "./StatusFilter";
import SortSelect from "./SortSelect";

/**
 * Filter and sort controls for the property listing
 */
export default function PropertyFilters({
  statusFilter,
  onStatusFilterChange,
  sortBy,
  onSortChange,
  filteredCount,
  totalCount,
}: PropertyFiltersProps) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6 p-4 bg-white rounded-lg shadow-sm border border-gray-100">
      <div className="flex flex-col sm:flex-row gap-4">
        <StatusFilter value={statusFilter} onChange={onStatusFilterChange} />
        <SortSelect value={sortBy} onChange={onSortChange} />
      </div>

      <p className="text-sm text-gray-500">
        Showing {filteredCount} of {totalCount} properties
      </p>
    </div>
  );
}
