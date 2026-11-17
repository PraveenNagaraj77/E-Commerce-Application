
import ProductFilter from "@/components/shoppingview/filter";
import ProductDetails from "@/components/shoppingview/ProductDetails";
import ShoppingProductTile from "@/components/shoppingview/ProductTile";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { sortOptions } from "@/config";
import { fetchAllFilterProducts, fetchProductDetails } from "@/store/shop/productSlice";

import {
  ArrowUpDown,
  Search,
  X,
} from "lucide-react";

import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useSearchParams } from "react-router-dom";

const ShoppingList = () => {
  const dispatch = useDispatch();

  const { productList, productDetails, isLoading } = useSelector(
    (state) => state.shopProducts
  );

  const [filters, setFilters] = useState({});
  const [sort, setSort] = useState("price-lowtohigh");
  const [searchInput, setSearchInput] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");

  const [searchParams, setSearchParams] = useSearchParams();

  const [openDetailsDialog, setOpenDetailsDialog] = useState(false);

// Restore filters and search when the listing page opens.
useEffect(() => {
  try {
    const storedFilters = JSON.parse(
      sessionStorage.getItem("Filters") || "{}"
    );

    const urlSearch = searchParams.get("search") || "";

    // URL category/brand takes priority over previously stored filters.
    const categoryFromUrl = searchParams.get("category");
    const brandFromUrl = searchParams.get("brand");

    const restoredFilters = { ...storedFilters };

    if (categoryFromUrl) {
      restoredFilters.category = categoryFromUrl
        .split(",")
        .filter(Boolean);
    }

    if (brandFromUrl) {
      restoredFilters.brand = brandFromUrl
        .split(",")
        .filter(Boolean);
    }

    setFilters(restoredFilters);
    setSearchInput(urlSearch);
    setDebouncedSearch(urlSearch);
  } catch (error) {
    console.error("Unable to restore filters:", error);
  }
}, []);

// Detect Navbar category/brand changes while already on the listing page.
useEffect(() => {
  const categoryFromUrl = searchParams.get("category");
  const brandFromUrl = searchParams.get("brand");

  if (!categoryFromUrl && !brandFromUrl) return;

  setFilters((previousFilters) => {
    const updatedFilters = { ...previousFilters };

    if (categoryFromUrl) {
      updatedFilters.category = categoryFromUrl
        .split(",")
        .filter(Boolean);
    }

    if (brandFromUrl) {
      updatedFilters.brand = brandFromUrl
        .split(",")
        .filter(Boolean);
    }

    const unchanged =
      JSON.stringify(previousFilters) === JSON.stringify(updatedFilters);

    return unchanged ? previousFilters : updatedFilters;
  });
}, [searchParams]);

  // Debounce search input
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchInput.trim());
    }, 400);

    return () => clearTimeout(timer);
  }, [searchInput]);

  // Fetch products when search, filters or sorting change
  useEffect(() => {
    const params = new URLSearchParams();

    Object.entries(filters).forEach(([key, value]) => {
      if (Array.isArray(value) && value.length > 0) {
        params.set(key, value.join(","));
      }
    });

    if (debouncedSearch) {
      params.set("search", debouncedSearch);
    }

    if (sort !== "price-lowtohigh") {
      params.set("sortBy", sort);
    }

    dispatch(
      fetchAllFilterProducts({
        filterParams: filters,
        sortParams: sort,
        search: debouncedSearch,
      })
    );

    setSearchParams(params, { replace: true });
  }, [filters, sort, debouncedSearch, dispatch, setSearchParams]);

  // Product details dialog
  useEffect(() => {
    if (productDetails) {
      setOpenDetailsDialog(true);
    }
  }, [productDetails]);

  // Handle filter selection
  const handleFilter = (sectionId, optionId) => {
    const normalizedKey = sectionId.toLowerCase();

    setFilters((previousFilters) => {
      const updatedFilters = { ...previousFilters };

      const currentValues = updatedFilters[normalizedKey] || [];

      const alreadySelected = currentValues.includes(optionId);

      const nextValues = alreadySelected
        ? currentValues.filter((item) => item !== optionId)
        : [...currentValues, optionId];

      if (nextValues.length > 0) {
        updatedFilters[normalizedKey] = nextValues;
      } else {
        delete updatedFilters[normalizedKey];
      }

      sessionStorage.setItem("Filters", JSON.stringify(updatedFilters));

      return updatedFilters;
    });
  };

  // Sorting
  const handleSort = (value) => {
    setSort(value);
  };

  // Product details
  const handleGetProductDetails = (productId) => {
    dispatch(fetchProductDetails(productId));
  };

  // Clear search
  const handleClearSearch = () => {
    setSearchInput("");
    setDebouncedSearch("");
  };

  const hasActiveFilters = Object.values(filters).some(
    (values) => values.length > 0
  );

  const clearAllFilters = () => {
    setFilters({});
    sessionStorage.removeItem("Filters");
  };

  return (
    <div className="grid grid-cols-1 gap-6 p-4 md:grid-cols-[220px_1fr] md:p-6">

      {/* Filters */}
     <ProductFilter
  filters={filters}
  handleFilter={handleFilter}
  handleClearFilters={clearAllFilters}
/>

      <div className="w-full rounded-2xl bg-white shadow-sm">

        {/* Search and listing header */}
        <div className="space-y-4 border-b p-4 md:p-5">

          <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">

            <div>
              <h2 className="text-xl font-bold text-gray-900">
                Discover Products
              </h2>

              <p className="mt-1 text-sm text-gray-500">
                Find products that match your style.
              </p>
            </div>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="gap-2">
                  <ArrowUpDown className="h-4 w-4" />
                  <span>
  {sortOptions.find((option) => option.id === sort)?.label || "Sort By"}
</span>
                </Button>
              </DropdownMenuTrigger>

              <DropdownMenuContent align="end" className="w-52">
                <DropdownMenuRadioGroup
                  value={sort}
                  onValueChange={handleSort}
                >
                  {sortOptions.map((option) => (
                    <DropdownMenuRadioItem
                      key={option.id}
                      value={option.id}
                    >
                      {option.label}
                    </DropdownMenuRadioItem>
                  ))}
                </DropdownMenuRadioGroup>
              </DropdownMenuContent>
            </DropdownMenu>

          </div>

          {/* Search bar */}
          <div className="relative max-w-2xl">

            <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />

            <input
              type="search"
              value={searchInput}
              onChange={(event) => setSearchInput(event.target.value)}
              placeholder="Search products, brands, categories..."
              aria-label="Search products"
              className="h-12 w-full rounded-xl border border-gray-200 bg-gray-50 pl-12 pr-12 text-sm outline-none transition focus:border-gray-900 focus:bg-white focus:ring-2 focus:ring-gray-900/10"
            />

            {searchInput && (
              <button
                type="button"
                onClick={handleClearSearch}
                aria-label="Clear search"
                className="absolute right-3 top-1/2 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-full text-gray-500 hover:bg-gray-200"
              >
                <X className="h-4 w-4" />
              </button>
            )}

          </div>

          {/* Result count and active filters */}
          <div className="flex flex-wrap items-center justify-between gap-3">

            <p className="text-sm text-gray-500">
              {isLoading
                ? "Searching products..."
                : `${productList.length} products found`}
            </p>

            {(hasActiveFilters || debouncedSearch) && (
              <div className="flex flex-wrap items-center gap-3">

                {debouncedSearch && (
                  <span className="text-sm text-gray-600">
                    Search: <strong>{debouncedSearch}</strong>
                  </span>
                )}

                {hasActiveFilters && (
                  <button
                    type="button"
                    onClick={clearAllFilters}
                    className="text-sm font-semibold text-gray-900 underline underline-offset-4"
                  >
                    Clear filters
                  </button>
                )}

              </div>
            )}

          </div>

        </div>

        {/* Product details */}
        <ProductDetails
          open={openDetailsDialog}
          setOpen={setOpenDetailsDialog}
          productDetails={productDetails}
        />

        {/* Product grid */}
        <div className="grid grid-cols-1 gap-4 p-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">

          {isLoading ? (
            Array.from({ length: 8 }).map((_, index) => (
              <div
                key={index}
                className="animate-pulse overflow-hidden rounded-xl border"
              >
                <div className="aspect-[4/5] bg-gray-200" />
                <div className="space-y-3 p-4">
                  <div className="h-3 w-1/3 rounded bg-gray-200" />
                  <div className="h-4 w-3/4 rounded bg-gray-200" />
                  <div className="h-9 rounded bg-gray-200" />
                </div>
              </div>
            ))
          ) : productList.length > 0 ? (
            productList.map((productItem, index) => (
              <ShoppingProductTile
                key={productItem._id || productItem.id || `product-${index}`}
                product={productItem}
                handleGetProductDetails={handleGetProductDetails}
              />
            ))
          ) : (
            <div className="col-span-full flex min-h-64 flex-col items-center justify-center text-center">

              <Search className="mb-4 h-10 w-10 text-gray-300" />

              <h3 className="text-lg font-semibold text-gray-900">
                No products found
              </h3>

              <p className="mt-2 max-w-sm text-sm text-gray-500">
                Try a different search term or adjust your filters.
              </p>

              <Button
                variant="outline"
                className="mt-5"
                onClick={() => {
                  handleClearSearch();
                  clearAllFilters();
                }}
              >
                Clear Search & Filters
              </Button>

            </div>
          )}

        </div>

      </div>
    </div>
  );
};

export default ShoppingList;
