import { filterOptions } from "@/config";
import React, { Fragment } from "react";
import { Label } from "../ui/label";
import { Checkbox } from "../ui/checkbox";
import { Separator } from "../ui/separator";

const ProductFilter = ({ filters, handleFilter }) => {
  console.log("Filters State in ProductFilter:", filters);
  return (
    <div className="bg-background rounded-lg shadow-sm">
      {/* Header */}
      <div className="p-4 border-b">
        <h2 className="text-lg font-extrabold">Filters</h2>
      </div>

      {/* Filters Section */}
      <div className="p-4 space-y-4">
        {Object.keys(filterOptions).map((keyItem) => (
          <Fragment key={keyItem}>
            <div>
              <h3 className="text-base font-bold">{keyItem}</h3>
              <div className="grid gap-2 mt-2">
                {filterOptions[keyItem].map((option) => (
                  <Label
                    key={option.id}
                    className="flex items-center gap-2 font-medium"
                  >
                    <Checkbox
  checked={!!filters?.[keyItem?.toLowerCase()]?.includes(option.id)}
  onCheckedChange={(checked) => {
    console.log(`Checkbox Clicked: ${option.id}, Checked: ${checked}`);
    handleFilter(keyItem, option.id, checked);
  }}
/>

                    {option.label}
                  </Label>
                ))}
              </div>
            </div>

            <Separator />
          </Fragment>
        ))}
      </div>
    </div>
  );
};

export default ProductFilter;
