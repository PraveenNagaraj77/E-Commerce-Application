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
import { addToCart, fetchCart } from "@/store/shop/cartSlice";
import { fetchAllFilterProducts, fetchProductDetails } from "@/store/shop/productSlice";
import { ArrowUpDownIcon } from "lucide-react";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useNavigate, useSearchParams } from "react-router-dom";

const ShoppingList = () => {
  const dispatch = useDispatch();
  const { productList, productDetails } = useSelector((state) => state.shopProducts);
  const [filters, setFilters] = useState({});
  const [sort, setSort] = useState("price-lowtohigh");
  const [searchParams, setSearchParams] = useSearchParams();
  const [openDetailsDialog, setOpenDetailsDialog] = useState(false);
  const { user } = useSelector((state) => state.auth);
  const location = useLocation();

  // ✅ Restore filters from sessionStorage on page load
  useEffect(() => {
    const storedFilters = JSON.parse(sessionStorage.getItem("Filters")) || {};
    console.log("🔄 Restoring Filters:", storedFilters);
    setFilters(storedFilters);
  }, []);

  // ✅ Fetch products when filters or sorting change
// ✅ Fetch products when filters or sorting change
useEffect(() => {
  const normalizedFilters = filters && Object.keys(filters).length > 0 ? normalizeFilters(filters) : {};

  console.log("🚀 Fetching filtered products with:", normalizedFilters, "Sort:", sort);
  
  dispatch(fetchAllFilterProducts({ filterParams: normalizedFilters, sortParams: sort }));

  const queryString = createSearchParamsHelper(normalizedFilters);
  setSearchParams(queryString);
}, [filters, sort, dispatch]); // ✅ Added sort as a dependency


  // ✅ Ensure filters persist when navigating back
  useEffect(() => {
    const storedFilters = JSON.parse(sessionStorage.getItem("Filters")) || {};
    setFilters(storedFilters);
  }, [location.search]);

  useEffect(() => {
    if (productDetails !== null) setOpenDetailsDialog(true);
  }, [productDetails]);

  // ✅ Normalize filters (ensure lowercase keys)
  function normalizeFilters(filterObj) {
    return Object.fromEntries(
      Object.entries(filterObj).map(([key, value]) => [key.toLowerCase(), value])
    );
  }

  // ✅ Helper function to generate query string
  function createSearchParamsHelper(filterParams) {
    return Object.entries(filterParams)
      .map(([key, value]) => `${encodeURIComponent(key)}=${encodeURIComponent(value.join(","))}`)
      .join("&");
  }

  // ✅ Handle Sorting
  function handleSort(value) {
    setSort(value);
  }

  // ✅ Handle Filter Selection
  function handleFilter(getSectionId, getCurrentOption) {
    const normalizedKey = getSectionId.toLowerCase();

    setFilters((prevFilters) => {
      let updatedFilters = { ...prevFilters };

      if (!updatedFilters[normalizedKey]) {
        updatedFilters[normalizedKey] = [getCurrentOption];
      } else {
        const index = updatedFilters[normalizedKey].indexOf(getCurrentOption);
        if (index === -1) {
          updatedFilters[normalizedKey].push(getCurrentOption);
        } else {
          updatedFilters[normalizedKey].splice(index, 1);
        }
      }

      if (updatedFilters[normalizedKey]?.length === 0) {
        delete updatedFilters[normalizedKey];
      }

      // ✅ If no filters are applied, reset to fetch all products
      if (Object.keys(updatedFilters).length === 0) {
        sessionStorage.removeItem("Filters"); // Remove stored filters
        dispatch(fetchAllFilterProducts({ filterParams: {}, sortParams: sort })); // Fetch all products
      } else {
        sessionStorage.setItem("Filters", JSON.stringify(updatedFilters));
      }

      console.log("✅ Updated Filters:", updatedFilters);
      return updatedFilters;
    });
}


  // ✅ Fetch Product Details
  function handleGetProductDetails(getCurrentProductId) {
    console.log("📦 Fetching Product Details for:", getCurrentProductId);
    dispatch(fetchProductDetails(getCurrentProductId));
  }

  // ✅ Add Product to Cart
  function handleAddtoCart(getCurrentProductId) {
    console.log("🛒 Adding to Cart:", getCurrentProductId);
    dispatch(addToCart({ userId: user?.id, productId: getCurrentProductId, quantity: 1 })).then((data) => {
      if (data?.payload?.success) {
        dispatch(fetchCart(user?.id));
      }
    });
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-[200px_1fr] gap-6 p-4 md:p-6">
      {/* ✅ Pass filters to ProductFilter */}
      <ProductFilter filters={filters} handleFilter={handleFilter} />

      <div className="bg-background w-full rounded-lg shadow-sm">
        <div className="p-4 border-b flex items-center justify-between">
          <h2 className="text-lg font-extrabold">All Products</h2>
          <div className="flex items-center gap-3">
            <span className="text-muted-foreground">{productList?.length}</span>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm" className="flex items-center gap-1">
                  <ArrowUpDownIcon className="h-4 w-4" />
                  <span>Sort By</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-[200px]">
                <DropdownMenuRadioGroup value={sort} onValueChange={handleSort}>
                  {sortOptions.map((sortItem) => (
                    <DropdownMenuRadioItem value={sortItem.id} key={sortItem.id}>
                      {sortItem.label}
                    </DropdownMenuRadioItem>
                  ))}
                </DropdownMenuRadioGroup>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        <ProductDetails open={openDetailsDialog} setOpen={setOpenDetailsDialog} productDetails={productDetails} />

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {productList && productList.length > 0
            ? productList.map((productItem, index) => (
                <ShoppingProductTile
                  handleGetProductDetails={handleGetProductDetails}
                  handleAddtoCart={handleAddtoCart}
                  key={productItem.id || `product-${index}`}
                  product={productItem}
                />
              ))
            : <p className="text-center text-muted-foreground">No products found.</p>}
        </div>
      </div>
    </div>
  );
};

export default ShoppingList;
