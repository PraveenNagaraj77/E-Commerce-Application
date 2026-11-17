
import React from "react";
import {
  Edit3,
  Trash2,
  Loader2,
  Package,
} from "lucide-react";
import { Button } from "../ui/button";

const currencyFormatter = new Intl.NumberFormat("en-IN", {
  style: "currency",
  currency: "INR",
  maximumFractionDigits: 0,
});

const ProductTile = ({
  product,
  setOpenCreateProductDialog,
  setEditId,
  setFormData,
  handleDelete,
  isDeleting = false,
}) => {
  const hasSalePrice = Number(product?.salePrice) > 0;
  const stock = Number(product?.totalStock ?? 0);

  const handleEdit = () => {
    setEditId(product?._id);
    setFormData(product);
    setOpenCreateProductDialog(true);
  };

  return (
    <div className="group flex h-full min-w-0 flex-col overflow-hidden rounded-2xl border border-gray-200 bg-white transition-all duration-200 hover:-translate-y-1 hover:border-gray-300 hover:shadow-lg">
      {/* Product Image */}
      <div className="relative m-3 flex h-52 items-center justify-center overflow-hidden rounded-xl bg-gray-50 p-5">
        {product?.image ? (
          <img
            src={product.image}
            alt={product?.title || "Product"}
            loading="lazy"
            className="h-full w-full object-contain transition-transform duration-300 group-hover:scale-105"
          />
        ) : (
          <div className="flex flex-col items-center gap-2 text-gray-400">
            <Package size={32} strokeWidth={1.5} />
            <span className="text-xs">No image available</span>
          </div>
        )}

        <span
          className={`absolute right-3 top-3 rounded-full px-3 py-1 text-[11px] font-semibold ${
            stock > 0
              ? "bg-white text-gray-700 shadow-sm"
              : "bg-red-50 text-red-600"
          }`}
        >
          {stock > 0 ? `${stock} in stock` : "Out of stock"}
        </span>
      </div>

      {/* Product Details */}
      <div className="flex flex-1 flex-col px-4 pb-4">
        <div className="mb-2 flex items-center justify-between gap-2">
          <span className="truncate text-[11px] font-semibold uppercase tracking-wider text-gray-400">
            {product?.category || "Uncategorized"}
          </span>

          {product?.brand && (
            <span className="truncate text-xs text-gray-500">
              {product.brand}
            </span>
          )}
        </div>

        <h3 className="line-clamp-2 min-h-11 text-sm font-semibold leading-5 text-gray-900">
          {product?.title || "Untitled Product"}
        </h3>

        <div className="mt-3 flex min-h-7 flex-wrap items-center gap-2">
          {hasSalePrice && (
            <span className="text-xs text-gray-400 line-through">
              {currencyFormatter.format(Number(product?.price) || 0)}
            </span>
          )}

          <span className="text-lg font-bold tracking-tight text-gray-950">
            {currencyFormatter.format(
              hasSalePrice
                ? Number(product.salePrice)
                : Number(product?.price) || 0
            )}
          </span>
        </div>

        {/* Actions */}
        <div className="mt-5 flex items-center gap-2 border-t border-gray-100 pt-4">
          <Button
            type="button"
            variant="outline"
            onClick={handleEdit}
            disabled={isDeleting}
            className="h-9 flex-1 gap-2 rounded-lg border-gray-200 text-xs font-semibold text-gray-700 hover:bg-gray-50"
          >
            <Edit3 size={14} />
            Edit
          </Button>

          <Button
            type="button"
            variant="outline"
            onClick={() => handleDelete(product?._id)}
            disabled={isDeleting}
            className="h-9 flex-1 gap-2 rounded-lg border-red-100 text-xs font-semibold text-red-600 hover:border-red-200 hover:bg-red-50 hover:text-red-700"
          >
            {isDeleting ? (
              <Loader2 size={14} className="animate-spin" />
            ) : (
              <Trash2 size={14} />
            )}
            {isDeleting ? "Deleting..." : "Delete"}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ProductTile;
