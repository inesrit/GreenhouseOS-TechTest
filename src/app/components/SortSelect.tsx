/**
 * SortSelect Component
 * Dropdown to sort properties by various criteria
 */
"use client";

import { UI_TEXT, SORT_OPTIONS } from "@/constants";
import type { SortOption, SortSelectProps } from "@/types";

/**
 * Sort dropdown options
 */
const SORT_DROPDOWN_OPTIONS = [
  { value: SORT_OPTIONS.NEWEST, label: UI_TEXT.SORT_NEWEST },
  { value: SORT_OPTIONS.OLDEST, label: UI_TEXT.SORT_OLDEST },
  { value: SORT_OPTIONS.PRICE_HIGH, label: UI_TEXT.SORT_PRICE_HIGH },
  { value: SORT_OPTIONS.PRICE_LOW, label: UI_TEXT.SORT_PRICE_LOW },
  { value: SORT_OPTIONS.ADDRESS_AZ, label: UI_TEXT.SORT_ADDRESS_AZ },
  { value: SORT_OPTIONS.ADDRESS_ZA, label: UI_TEXT.SORT_ADDRESS_ZA },
] as const;

/**
 * Sort dropdown component
 */
export default function SortSelect({ value, onChange }: SortSelectProps) {
  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    onChange(e.target.value as SortOption);
  };

  return (
    <div className="flex items-center gap-2">
      <label
        htmlFor="sort-by"
        className="text-sm font-medium text-gray-700 whitespace-nowrap"
      >
        {UI_TEXT.SORT_BY}:
      </label>
      <select
        id="sort-by"
        value={value}
        onChange={handleChange}
        className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent bg-white"
      >
        {SORT_DROPDOWN_OPTIONS.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );
}
