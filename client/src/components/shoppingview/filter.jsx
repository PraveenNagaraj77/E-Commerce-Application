
import React, { Fragment } from "react";
import { filterOptions } from "@/config";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Separator } from "@/components/ui/separator";
import { SlidersHorizontal, X } from "lucide-react";

const ProductFilter = ({
  filters = {},
  handleFilter,
  handleClearFilters,
}) => {
  const selectedCount = Object.values(filters).reduce(
    (total, values) =>
      total + (Array.isArray(values) ? values.length : 0),
    0
  );

  const getOptionLabel = (section, value) => {
    const matchingSection = Object.keys(filterOptions).find(
      (key) => key.toLowerCase() === section.toLowerCase()
    );

    return filterOptions[matchingSection]?.find(
      (option) => option.id === value
    )?.label || value;
  };

  return (
    <aside className="h-fit overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm md:sticky md:top-24">
      {/* Filter header */}
      <div className="flex items-center justify-between border-b border-gray-100 px-5 py-5">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gray-100">
            <SlidersHorizontal className="h-4 w-4 text-gray-800" />
          </div>

          <div>
            <h2 className="text-base font-bold tracking-tight text-gray-950">
              Filters
            </h2>
            <p className="text-xs text-gray-500">
              Refine your selection
            </p>
          </div>

          {selectedCount > 0 && (
            <span className="flex h-6 min-w-6 items-center justify-center rounded-full bg-gray-950 px-2 text-xs font-semibold text-white">
              {selectedCount}
            </span>
          )}
        </div>

        {selectedCount > 0 && (
          <button
            type="button"
            onClick={handleClearFilters}
            className="text-xs font-semibold text-gray-500 transition-colors hover:text-gray-950"
          >
            Clear all
          </button>
        )}
      </div>

      {/* Filter sections */}
      <div className="space-y-5 px-5 py-5">
        {Object.entries(filterOptions).map(
          ([section, options], index) => {
            const filterKey = section.toLowerCase();

            return (
              <Fragment key={section}>
                <section>
                  <div className="mb-4 flex items-center justify-between">
                    <h3 className="text-xs font-bold uppercase tracking-[0.12em] text-gray-900">
                      {section}
                    </h3>

                    {(filters[filterKey]?.length || 0) > 0 && (
                      <span className="text-xs font-medium text-gray-400">
                        {filters[filterKey].length} selected
                      </span>
                    )}
                  </div>

                  <div className="space-y-3">
                    {options.map((option) => {
                      const isSelected =
                        filters[filterKey]?.includes(option.id) || false;

                      return (
                        <Label
                          key={option.id}
                          className="group flex cursor-pointer items-center justify-between gap-3 rounded-lg py-0.5 text-sm font-medium text-gray-600 transition-colors hover:text-gray-950"
                        >
                          <span
                            className={
                              isSelected
                                ? "text-gray-950"
                                : "group-hover:text-gray-950"
                            }
                          >
                            {option.label}
                          </span>

                          <Checkbox
                            checked={isSelected}
                            onCheckedChange={() =>
                              handleFilter(section, option.id)
                            }
                            aria-label={`Filter by ${option.label}`}
                            className="h-[17px] w-[17px] rounded-[5px] border-gray-300 data-[state=checked]:border-gray-950 data-[state=checked]:bg-gray-950"
                          />
                        </Label>
                      );
                    })}
                  </div>
                </section>

                {index < Object.keys(filterOptions).length - 1 && (
                  <Separator className="bg-gray-100" />
                )}
              </Fragment>
            );
          }
        )}
      </div>

      {/* Active filters */}
      {selectedCount > 0 && (
        <div className="border-t border-gray-100 bg-gray-50/70 px-5 py-4">
          <div className="mb-3 flex items-center justify-between">
            <p className="text-[11px] font-bold uppercase tracking-[0.12em] text-gray-500">
              Active filters
            </p>

            <button
              type="button"
              onClick={handleClearFilters}
              aria-label="Remove all filters"
              className="rounded-md p-1 text-gray-400 transition-colors hover:bg-gray-200 hover:text-gray-900"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          <div className="flex flex-wrap gap-2">
            {Object.entries(filters).flatMap(([section, values]) =>
              (Array.isArray(values) ? values : []).map((value) => (
                <button
                  key={`${section}-${value}`}
                  type="button"
                  onClick={() => {
                    const matchingSection = Object.keys(filterOptions).find(
                      (key) => key.toLowerCase() === section.toLowerCase()
                    );

                    if (matchingSection) {
                      handleFilter(matchingSection, value);
                    }
                  }}
                  className="inline-flex items-center gap-1.5 rounded-full border border-gray-200 bg-white px-3 py-1.5 text-xs font-medium text-gray-700 transition-all hover:border-gray-400 hover:text-gray-950"
                  aria-label={`Remove ${getOptionLabel(section, value)} filter`}
                >
                  {getOptionLabel(section, value)}
                  <X className="h-3 w-3 text-gray-400" />
                </button>
              ))
            )}
          </div>
        </div>
      )}
    </aside>
  );
};

export default ProductFilter;
