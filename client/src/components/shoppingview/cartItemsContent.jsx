
import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { Minus, Plus, Trash2, Loader2 } from "lucide-react";

import {
  updateCartItemQuantity,
  deleteCartItem,
} from "@/store/shop/cartSlice";

import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

const formatPrice = (amount) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 2,
  }).format(Number(amount) || 0);

const getUnitPrice = (item) => {
  const price = Number(item?.price) || 0;
  const salePrice = Number(item?.salePrice) || 0;

  return salePrice > 0 && salePrice < price ? salePrice : price;
};

const UsercartItemsContent = ({ cartItem, userId }) => {
  const dispatch = useDispatch();
  const { toast } = useToast();

  const [isUpdating, setIsUpdating] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const quantity = Number(cartItem?.quantity) || 1;
  const unitPrice = getUnitPrice(cartItem);
  const productId = cartItem?.productId?._id || cartItem?.productId;

  const stock = Number(cartItem?.totalStock);
  const hasStockLimit =
    cartItem?.totalStock !== undefined &&
    cartItem?.totalStock !== null &&
    Number.isFinite(stock) &&
    stock >= 0;

  const handleQuantityChange = async (newQuantity) => {
    if (
      !userId ||
      !productId ||
      !Number.isInteger(newQuantity) ||
      newQuantity < 1 ||
      (hasStockLimit && newQuantity > stock) ||
      isUpdating ||
      isDeleting
    ) {
      return;
    }

    setIsUpdating(true);

    try {
      const result = await dispatch(
        updateCartItemQuantity({
          userId,
          productId,
          quantity: newQuantity,
        })
      );

      if (!updateCartItemQuantity.fulfilled.match(result)) {
        toast({
          title: "Unable to update cart",
          description: result.payload || "Please try again.",
          variant: "destructive",
        });
      }
    } finally {
      setIsUpdating(false);
    }
  };

  const handleDelete = async () => {
    if (!userId || !productId || isDeleting || isUpdating) return;

    setIsDeleting(true);

    try {
      const result = await dispatch(
        deleteCartItem({ userId, productId })
      );

      if (!deleteCartItem.fulfilled.match(result)) {
        toast({
          title: "Unable to remove product",
          description: result.payload || "Please try again.",
          variant: "destructive",
        });
      }
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <article className="flex gap-4 py-5">
      {/* Product image */}
      <div className="h-28 w-24 shrink-0 overflow-hidden rounded-xl bg-gray-100 sm:h-32 sm:w-28">
        {cartItem?.image ? (
          <img
            src={cartItem.image}
            alt={cartItem.title || "Product"}
            loading="lazy"
            className="h-full w-full object-cover transition-transform duration-300 hover:scale-105"
          />
        ) : (
          <div className="flex h-full items-center justify-center px-2 text-center text-xs text-gray-400">
            Image unavailable
          </div>
        )}
      </div>

      {/* Product information */}
      <div className="flex min-w-0 flex-1 flex-col justify-between gap-3">
        <div>
          <h3 className="line-clamp-2 text-sm font-semibold leading-5 text-gray-950 sm:text-base">
            {cartItem?.title || "Product"}
          </h3>

          <p className="mt-1.5 text-sm text-gray-500">
            {formatPrice(unitPrice)} each
          </p>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-3">
          {/* Quantity controls */}
          <div className="inline-flex h-9 items-center rounded-lg border border-gray-200 bg-white">
            <button
              type="button"
              onClick={() => handleQuantityChange(quantity - 1)}
              disabled={quantity <= 1 || isUpdating || isDeleting}
              aria-label="Decrease quantity"
              className="flex h-9 w-9 items-center justify-center rounded-l-lg text-gray-600 transition hover:bg-gray-100 hover:text-gray-950 disabled:cursor-not-allowed disabled:opacity-40"
            >
              <Minus className="h-3.5 w-3.5" />
            </button>

            <span className="min-w-8 text-center text-sm font-semibold tabular-nums text-gray-900">
              {isUpdating ? (
                <Loader2 className="mx-auto h-3.5 w-3.5 animate-spin" />
              ) : (
                quantity
              )}
            </span>

            <button
              type="button"
              onClick={() => handleQuantityChange(quantity + 1)}
              disabled={
                isUpdating ||
                isDeleting ||
                (hasStockLimit && quantity >= stock)
              }
              aria-label="Increase quantity"
              className="flex h-9 w-9 items-center justify-center rounded-r-lg text-gray-600 transition hover:bg-gray-100 hover:text-gray-950 disabled:cursor-not-allowed disabled:opacity-40"
            >
              <Plus className="h-3.5 w-3.5" />
            </button>
          </div>

          {/* Item total and remove */}
          <div className="flex items-center gap-1">
            <span className="whitespace-nowrap text-sm font-bold text-gray-950">
              {formatPrice(unitPrice * quantity)}
            </span>

            <Button
              type="button"
              variant="ghost"
              size="icon"
              onClick={handleDelete}
              disabled={isDeleting || isUpdating}
              aria-label={`Remove ${cartItem?.title || "product"}`}
              className="h-9 w-9 rounded-lg text-gray-400 transition hover:bg-red-50 hover:text-red-600"
            >
              {isDeleting ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Trash2 className="h-4 w-4" />
              )}
            </Button>
          </div>
        </div>
      </div>
    </article>
  );
};

export default UsercartItemsContent;
