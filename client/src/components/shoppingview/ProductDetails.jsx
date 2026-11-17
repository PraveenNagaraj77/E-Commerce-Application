
import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

import { addToCart } from "@/store/shop/cartSlice";
import { setProductDetails } from "@/store/shop/productSlice";
import { useToast } from "@/hooks/use-toast";

import {
  Dialog,
  DialogContent,
  DialogTitle,
} from "@/components/ui/dialog";

import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

import {
  ArrowRight,
  Check,
  Package,
  ShieldCheck,
  ShoppingBag,
  Truck,
  X,
} from "lucide-react";

const formatPrice = (price) => {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(Number(price) || 0);
};

const ProductDetails = ({ open, setOpen, productDetails }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const currentUser = useSelector((state) => state.auth.user);
  const { toast } = useToast();

  const userId = currentUser?.id;

  const product = productDetails;

  const hasSale =
    Number(product?.salePrice) > 0 &&
    Number(product?.salePrice) < Number(product?.price);

  const displayPrice = hasSale
    ? Number(product.salePrice)
    : Number(product?.price || 0);

  const originalPrice = Number(product?.price || 0);

  const isOutOfStock = Number(product?.totalStock || 0) <= 0;

  const discountPercentage =
    hasSale && originalPrice > 0
      ? Math.round(
          ((originalPrice - displayPrice) / originalPrice) * 100
        )
      : 0;

  const handleDialogChange = (nextOpen) => {
    setOpen(nextOpen);

    if (!nextOpen) {
      dispatch(setProductDetails());
    }
  };

  const handleAddToCart = () => {
    if (!currentUser) {
      toast({
        title: "Login Required",
        description: "Please log in to add items to your cart.",
        status: "warning",
        duration: 3000,
      });

      setOpen(false);
      navigate("/auth/login");
      return;
    }

    if (!userId || !product?._id) {
      toast({
        title: "Unable to add product",
        description: "Please try again.",
        status: "error",
        duration: 3000,
      });

      return;
    }

    if (isOutOfStock) {
      toast({
        title: "Out of Stock",
        description: "This product is currently unavailable.",
        status: "warning",
        duration: 3000,
      });

      return;
    }

    const cartItem = {
      userId,
      productId: product._id,
      title: product.title,
      image: product.image,
      price: displayPrice,
      quantity: 1,
    };

    dispatch(addToCart(cartItem));

    toast({
      title: "Added to Cart",
      description: `${product.title} has been added to your cart.`,
      status: "success",
      duration: 3000,
    });
  };

  if (!product) {
    return null;
  }

  return (
    <Dialog open={open} onOpenChange={handleDialogChange}>
      <DialogContent className="max-h-[92vh] max-w-[95vw] overflow-y-auto rounded-2xl border-0 bg-white p-0 shadow-2xl sm:max-w-[850px] lg:max-w-[1050px]">

        <div className="grid grid-cols-1 md:grid-cols-2">

          {/* Product image */}
          <div className="relative flex min-h-[300px] items-center justify-center overflow-hidden bg-gray-50 p-6 sm:min-h-[450px] sm:p-10">
            {hasSale && (
              <span className="absolute left-5 top-5 z-10 rounded-full bg-gray-950 px-3 py-1.5 text-xs font-bold text-white">
                {discountPercentage}% OFF
              </span>
            )}

            {product.image ? (
              <img
                src={product.image}
                alt={product.title || "Product image"}
                className="h-full max-h-[420px] w-full object-contain transition-transform duration-500 hover:scale-105"
              />
            ) : (
              <div className="flex h-64 w-full items-center justify-center text-gray-300">
                <ShoppingBag className="h-20 w-20" />
              </div>
            )}

            <span className="absolute bottom-5 left-5 rounded-full border border-gray-200 bg-white/90 px-3 py-1.5 text-[11px] font-semibold uppercase tracking-wider text-gray-600">
              Product Preview
            </span>
          </div>

          {/* Product information */}
          <div className="flex flex-col p-6 sm:p-8 lg:p-10">

            {/* Category and brand */}
            <div className="mb-4 flex flex-wrap items-center gap-2">
              {product.category && (
                <span className="rounded-full bg-gray-100 px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-gray-600">
                  {product.category}
                </span>
              )}

              {product.brand && (
                <span className="text-xs font-semibold uppercase tracking-wider text-gray-400">
                  {product.brand}
                </span>
              )}
            </div>

            {/* Title */}
            <DialogTitle className="text-2xl font-bold leading-tight tracking-tight text-gray-950 sm:text-3xl">
              {product.title}
            </DialogTitle>

            {/* Description */}
            <p
              id="product-description"
              className="mt-4 text-sm leading-7 text-gray-500 sm:text-base"
            >
              {product.description || "Explore this product and add it to your collection."}
            </p>

            <Separator className="my-6 bg-gray-100" />

            {/* Pricing */}
            <div>
              <p className="mb-2 text-xs font-bold uppercase tracking-[0.15em] text-gray-400">
                Price
              </p>

              <div className="flex flex-wrap items-center gap-3">
                <span className="text-3xl font-bold tracking-tight text-gray-950">
                  {formatPrice(displayPrice)}
                </span>

                {hasSale && (
                  <>
                    <span className="text-lg text-gray-400 line-through">
                      {formatPrice(originalPrice)}
                    </span>

                    <span className="rounded-md bg-green-50 px-2 py-1 text-xs font-bold text-green-700">
                      Save {discountPercentage}%
                    </span>
                  </>
                )}
              </div>

              <p className="mt-2 text-xs text-gray-400">
                Inclusive of applicable taxes
              </p>
            </div>

            {/* Stock status */}
            <div className="mt-6">
              {isOutOfStock ? (
                <div className="flex items-center gap-2 text-sm font-semibold text-red-600">
                  <X className="h-4 w-4" />
                  Currently out of stock
                </div>
              ) : (
                <div className="flex items-center gap-2 text-sm font-semibold text-green-700">
                  <Check className="h-4 w-4" />
                  In stock
                  <span className="font-normal text-gray-400">
                    ({product.totalStock} available)
                  </span>
                </div>
              )}
            </div>

            {/* Add to cart */}
            <div className="mt-7">
              <Button
                onClick={handleAddToCart}
                disabled={isOutOfStock}
                className="h-12 w-full rounded-xl bg-gray-950 text-sm font-semibold text-white shadow-sm transition-all hover:bg-gray-800 disabled:cursor-not-allowed disabled:opacity-50"
              >
                <ShoppingBag className="mr-2 h-4 w-4" />
                {isOutOfStock ? "Out of Stock" : "Add to Cart"}
                {!isOutOfStock && (
                  <ArrowRight className="ml-2 h-4 w-4" />
                )}
              </Button>
            </div>

            <Separator className="my-7 bg-gray-100" />

            {/* Shopping benefits */}
            <div className="space-y-5">
              <div className="flex items-start gap-3">
                <Truck className="mt-0.5 h-5 w-5 text-gray-500" />
                <div>
                  <p className="text-sm font-semibold text-gray-800">
                    Delivery Information
                  </p>
                  <p className="mt-1 text-xs leading-5 text-gray-500">
                    Delivery options and availability depend on your location.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <ShieldCheck className="mt-0.5 h-5 w-5 text-gray-500" />
                <div>
                  <p className="text-sm font-semibold text-gray-800">
                    Secure Shopping
                  </p>
                  <p className="mt-1 text-xs leading-5 text-gray-500">
                    Shop with confidence through our secure checkout.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Package className="mt-0.5 h-5 w-5 text-gray-500" />
                <div>
                  <p className="text-sm font-semibold text-gray-800">
                    Product Availability
                  </p>
                  <p className="mt-1 text-xs leading-5 text-gray-500">
                    Stock availability is subject to change.
                  </p>
                </div>
              </div>
            </div>

          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ProductDetails;
