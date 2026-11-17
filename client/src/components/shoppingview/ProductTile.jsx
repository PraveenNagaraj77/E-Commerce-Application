
import React, { memo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { ShoppingCart, Eye, ArrowUpRight } from "lucide-react";

import { addToCart } from "../../store/shop/cartSlice";
import { Card } from "../ui/card";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import { brandOptionsMap, categoryOptionsMap } from "@/config";
import { useToast } from "@/hooks/use-toast";

const formatPrice = (price) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 2,
  }).format(Number(price) || 0);

const ShoppingProductTile = memo(({ product, handleGetProductDetails }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { toast } = useToast();

  const user = useSelector((state) => state.auth.user);
  const [isAdding, setIsAdding] = useState(false);

  if (!product) return null;

  const productId = product._id || product.id;
  const regularPrice = Number(product.price) || 0;
  const salePrice = Number(product.salePrice) || 0;

  const hasDiscount = salePrice > 0 && salePrice < regularPrice;
  const displayPrice = hasDiscount ? salePrice : regularPrice;

  const stock = Number(product.totalStock);
  const stockKnown =
    product.totalStock !== null &&
    product.totalStock !== undefined &&
    Number.isFinite(stock);

  const outOfStock = stockKnown && stock <= 0;

  const handleAddToCart = async () => {
    if (!user?.id) {
      toast({
        title: "Login required",
        description: "Please log in to add products to your cart.",
        variant: "destructive",
      });

      navigate("/auth/login");
      return;
    }

    if (!productId || isAdding || outOfStock) return;

    setIsAdding(true);

    try {
      const result = await dispatch(
        addToCart({
          userId: user.id,
          productId,
          quantity: 1,
        })
      );

      if (addToCart.fulfilled.match(result)) {
        toast({
          title: "Added to cart",
          description: `${product.title} added to your cart.`,
        });
      } else {
        toast({
          title: "Unable to add product",
          description: result.payload || "Please try again.",
          variant: "destructive",
        });
      }
    } catch {
      toast({
        title: "Something went wrong",
        description: "Please try again later.",
        variant: "destructive",
      });
    } finally {
      setIsAdding(false);
    }
  };

  const handleViewDetails = () => {
    if (productId && handleGetProductDetails) {
      handleGetProductDetails(productId);
    }
  };

  const category =
    categoryOptionsMap[product.category] || product.category || "Collection";

  const brand =
    brandOptionsMap[product.brand] || product.brand || "";

  return (
    <Card className="group flex h-full flex-col overflow-hidden rounded-xl border border-gray-200 bg-white shadow-none transition-all duration-300 hover:-translate-y-1 hover:border-gray-300 hover:shadow-xl">

      {/* PRODUCT IMAGE */}
      <div className="relative w-full overflow-hidden bg-[#f7f7f7]">

        <button
          type="button"
          onClick={handleViewDetails}
          disabled={!productId}
          aria-label={`View ${product.title || "product"} details`}
          className="block w-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-950 focus-visible:ring-inset"
        >
          <div className="flex aspect-[4/5] w-full items-center justify-center overflow-hidden p-3 sm:p-4">
            {product.image ? (
              <img
                src={product.image}
                alt={product.title || "Product"}
                loading="lazy"
                decoding="async"
                className="h-full w-full object-contain transition-transform duration-700 ease-out group-hover:scale-105"
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center text-sm text-gray-400">
                Image unavailable
              </div>
            )}
          </div>
        </button>

        {hasDiscount && (
          <Badge className="absolute left-3 top-3 rounded-sm border-0 bg-gray-950 px-3 py-1 text-[10px] font-semibold uppercase tracking-wider text-white hover:bg-gray-950">
            Sale
          </Badge>
        )}

        {outOfStock && (
          <Badge className="absolute right-3 top-3 rounded-sm border-0 bg-white px-3 py-1 text-[10px] font-semibold uppercase tracking-wider text-gray-900 hover:bg-white">
            Sold out
          </Badge>
        )}

        <button
          type="button"
          onClick={handleViewDetails}
          disabled={!productId}
          aria-label={`Quick view ${product.title || "product"}`}
          className="absolute bottom-3 right-3 flex h-10 w-10 items-center justify-center rounded-full bg-white text-gray-900 opacity-100 shadow-md transition-all duration-300 hover:bg-gray-950 hover:text-white sm:translate-y-3 sm:opacity-0 sm:group-hover:translate-y-0 sm:group-hover:opacity-100"
        >
          <Eye size={17} />
        </button>
      </div>

      {/* PRODUCT INFORMATION */}
      <div className="flex flex-1 flex-col p-3 sm:p-4">

        <div className="mb-2 flex min-h-4 items-center justify-between gap-2">
          <span className="truncate text-[10px] font-semibold uppercase tracking-[0.15em] text-gray-500 sm:text-xs">
            {brand}
          </span>

          <span className="truncate text-right text-[10px] uppercase tracking-wider text-gray-400 sm:text-xs">
            {category}
          </span>
        </div>

        <button
          type="button"
          onClick={handleViewDetails}
          disabled={!productId}
          className="line-clamp-2 min-h-11 text-left text-sm font-semibold leading-6 text-gray-900 transition-colors hover:text-gray-500 sm:text-base"
        >
          {product.title || "Untitled product"}
        </button>

        {/* PRICE */}
        <div className="mt-3 flex min-h-7 flex-wrap items-center gap-x-2 gap-y-1">
          <span className="text-base font-bold tracking-tight text-gray-950 sm:text-lg">
            {formatPrice(displayPrice)}
          </span>

          {hasDiscount && (
            <span className="text-xs text-gray-400 line-through sm:text-sm">
              {formatPrice(regularPrice)}
            </span>
          )}
        </div>

        {/* ADD TO CART */}
        <div className="mt-auto pt-4">
          <Button
            type="button"
            onClick={handleAddToCart}
            disabled={isAdding || outOfStock || !productId}
            className="h-10 w-full rounded-md bg-gray-950 text-xs font-semibold text-white transition-all hover:bg-gray-700 disabled:cursor-not-allowed disabled:opacity-50 sm:h-11 sm:text-sm"
          >
            {outOfStock ? (
              "Out of Stock"
            ) : isAdding ? (
              "Adding..."
            ) : (
              <>
                <ShoppingCart className="mr-2 h-4 w-4" />
                Add to Cart
                <ArrowUpRight className="ml-auto h-4 w-4" />
              </>
            )}
          </Button>
        </div>
      </div>
    </Card>
  );
});

ShoppingProductTile.displayName = "ShoppingProductTile";

export default ShoppingProductTile;
