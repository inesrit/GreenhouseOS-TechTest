/**
 * StatusFilter Component
 * Dropdown to filter properties by status
 */
"use client";

import { UI_TEXT, PROPERTY_STATUS } from "@/constants";
import type { PropertyStatus, StatusFilterProps } from "@/types";

/**
 * Status filter dropdown options
 */
const STATUS_OPTIONS = [
  { value: "", label: UI_TEXT.FILTER_ALL_STATUSES },
  { value: PROPERTY_STATUS.AVAILABLE, label: PROPERTY_STATUS.AVAILABLE },
  { value: PROPERTY_STATUS.SALE_AGREED, label: PROPERTY_STATUS.SALE_AGREED },
  { value: PROPERTY_STATUS.SOLD, label: PROPERTY_STATUS.SOLD },
] as const;

/**
 * Status filter dropdown component
 */
export default function StatusFilter({ value, onChange }: StatusFilterProps) {
  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newValue = e.target.value;
    onChange(newValue === "" ? null : (newValue as PropertyStatus));
  };

  return (
    <div className="flex items-center gap-2">
      <label
        htmlFor="status-filter"
        className="text-sm font-medium text-gray-700 whitespace-nowrap"
      >
        {UI_TEXT.FILTER_BY_STATUS}:
      </label>
      <select
        id="status-filter"
        value={value || ""}
        onChange={handleChange}
        className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent bg-white"
      >
        {STATUS_OPTIONS.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );
}
