
import ProductImageUpload from "@/components/adminview/imageUpload";
import ProductTile from "@/components/adminview/ProductTile";
import CommonForm from "@/components/common/CommonForm";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { addProductformElements } from "@/config";
import { useToast } from "@/hooks/use-toast";
import {
  addNewProduct,
  deleteProduct,
  editProduct,
  fetchAllProducts,
} from "@/store/admin/products-slice";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Loader2, Plus, Package } from "lucide-react";

const initialFormData = {
  image: null,
  title: "",
  description: "",
  category: "",
  brand: "",
  price: "",
  salePrice: "",
  totalStock: "",
};

const AdminProducts = () => {
  const [openCreateProductsDialog, setOpenCreateProductDialog] =
    useState(false);

  const [formData, setFormData] = useState(initialFormData);
  const [imageFile, setImageFile] = useState(null);
  const [uploadedImageUrl, setUploadedImageUrl] = useState("");
  const [imageLoading, setImageLoading] = useState(false);

  const [currentEditId, setEditId] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [deletingProductId, setDeletingProductId] = useState(null);

  const { toast } = useToast();
  const dispatch = useDispatch();

  const { productList = [] } = useSelector(
    (state) => state.adminProducts
  );

  useEffect(() => {
    dispatch(fetchAllProducts());
  }, [dispatch]);

  const resetForm = () => {
    setFormData(initialFormData);
    setImageFile(null);
    setUploadedImageUrl("");
    setImageLoading(false);
    setEditId(null);
    setIsSubmitting(false);
  };

  const handleOpenCreate = () => {
    resetForm();
    setOpenCreateProductDialog(true);
  };

  const handleCloseSheet = (open) => {
    setOpenCreateProductDialog(open);

    if (!open) {
      resetForm();
    }
  };

  const isFormValid = () => {
    const requiredFields = [
      "title",
      "description",
      "category",
      "brand",
      "price",
      "totalStock",
    ];

    const fieldsValid = requiredFields.every(
      (key) =>
        formData[key] !== null &&
        formData[key] !== undefined &&
        String(formData[key]).trim() !== ""
    );

    const priceValid =
      Number(formData.price) > 0 &&
      Number.isFinite(Number(formData.price));

    const stockValid =
      Number(formData.totalStock) >= 0 &&
      Number.isInteger(Number(formData.totalStock));

    const salePriceValid =
      formData.salePrice === "" ||
      (Number(formData.salePrice) >= 0 &&
        Number.isFinite(Number(formData.salePrice)));

    const imageValid =
      currentEditId !== null || Boolean(uploadedImageUrl);

    return (
      fieldsValid &&
      priceValid &&
      stockValid &&
      salePriceValid &&
      imageValid &&
      !imageLoading
    );
  };

  const handleDelete = async (productId) => {
    const confirmed = window.confirm(
      "Are you sure you want to permanently delete this product?"
    );

    if (!confirmed) return;

    setDeletingProductId(productId);

    try {
      const result = await dispatch(deleteProduct(productId)).unwrap();

      if (!result?.success) {
        throw new Error(result?.message || "Unable to delete product.");
      }

      toast({
        title: "Product Deleted",
        description: "The product was deleted successfully.",
      });

      await dispatch(fetchAllProducts()).unwrap();
    } catch (error) {
      toast({
        title: "Delete Failed",
        description:
          typeof error === "string"
            ? error
            : error?.message || "Unable to delete product.",
        variant: "destructive",
      });
    } finally {
      setDeletingProductId(null);
    }
  };

  const onSubmit = async (event) => {
    event.preventDefault();

    if (isSubmitting) return;

    if (!isFormValid()) {
      toast({
        title: "Invalid Product Details",
        description:
          "Please complete all required fields and upload a valid product image.",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);

    const productData = {
      ...formData,
      price: Number(formData.price),
      salePrice:
        formData.salePrice === "" ? 0 : Number(formData.salePrice),
      totalStock: Number(formData.totalStock),
    };

    try {
      let result;

      if (currentEditId !== null) {
        result = await dispatch(
          editProduct({
            id: currentEditId,
            formData: productData,
          })
        ).unwrap();
      } else {
        result = await dispatch(
          addNewProduct({
            ...productData,
            image: uploadedImageUrl,
          })
        ).unwrap();
      }

      if (!result?.success) {
        throw new Error(
          result?.message ||
            `Unable to ${
              currentEditId !== null ? "update" : "add"
            } product.`
        );
      }

      toast({
        title:
          currentEditId !== null
            ? "Product Updated"
            : "Product Added",
        description: result?.message || "Product saved successfully.",
      });

      setOpenCreateProductDialog(false);
      resetForm();

      await dispatch(fetchAllProducts()).unwrap();
    } catch (error) {
      toast({
        title: "Operation Failed",
        description:
          typeof error === "string"
            ? error
            : error?.message || "Something went wrong. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="w-full min-w-0 space-y-6">
      {/* Page heading */}
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-gray-400">
            Store Management
          </p>

          <h1 className="mt-2 text-2xl font-bold tracking-tight text-gray-950 sm:text-3xl">
            Products
          </h1>

          <p className="mt-2 text-sm text-gray-500">
            Manage your store inventory and product listings.
          </p>
        </div>

        <Button
          type="button"
          onClick={handleOpenCreate}
          className="inline-flex items-center gap-2 self-start"
        >
          <Plus className="h-4 w-4" />
          Add New Product
        </Button>
      </div>

      {/* Product count */}
      <div className="flex items-center gap-2 text-sm text-gray-500">
        <Package className="h-4 w-4" />
        {productList.length} products in your store
      </div>

      {/* Product grid */}
      {productList.length > 0 ? (
        <div className="grid min-w-0 grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
          {productList.map((productItem) => (
            <ProductTile
              key={productItem._id}
              product={productItem}
              setEditId={setEditId}
              setOpenCreateProductDialog={setOpenCreateProductDialog}
              setFormData={setFormData}
              handleDelete={handleDelete}
              isDeleting={deletingProductId === productItem._id}
            />
          ))}
        </div>
      ) : (
        <div className="flex min-h-64 flex-col items-center justify-center rounded-2xl border border-dashed border-gray-200 bg-white px-5 text-center">
          <Package className="h-10 w-10 text-gray-300" />

          <h2 className="mt-4 text-lg font-semibold text-gray-900">
            No products yet
          </h2>

          <p className="mt-1 text-sm text-gray-500">
            Start building your store by adding your first product.
          </p>

          <Button
            type="button"
            onClick={handleOpenCreate}
            className="mt-4"
          >
            <Plus className="mr-2 h-4 w-4" />
            Add Product
          </Button>
        </div>
      )}

      {/* Add / Edit Sheet */}
      <Sheet
        open={openCreateProductsDialog}
        onOpenChange={handleCloseSheet}
      >
        <SheetContent
          side="right"
          className="w-full overflow-y-auto sm:max-w-lg"
        >
          <SheetHeader>
            <SheetTitle>
              {currentEditId !== null
                ? "Edit Product"
                : "Add New Product"}
            </SheetTitle>
          </SheetHeader>

          <div className="mt-6">
            <ProductImageUpload
              imageFile={imageFile}
              setImageFile={setImageFile}
              uploadedImageUrl={uploadedImageUrl}
              setUploadedImageUrl={setUploadedImageUrl}
              setImageLoading={setImageLoading}
              imageLoading={imageLoading}
              currentEditId={currentEditId}
              isEditMode={currentEditId !== null}
            />
          </div>

          <div className="py-6">
            <CommonForm
              onSubmit={onSubmit}
              formData={formData}
              setFormData={setFormData}
              buttonText={
                isSubmitting
                  ? "Saving..."
                  : currentEditId !== null
                    ? "Update Product"
                    : "Add Product"
              }
              formControls={addProductformElements}
              isBtnDisabled={
                !isFormValid() ||
                isSubmitting ||
                imageLoading ||
                deletingProductId !== null
              }
            />

            {isSubmitting && (
              <div className="mt-3 flex items-center justify-center gap-2 text-sm text-gray-500">
                <Loader2 className="h-4 w-4 animate-spin" />
                Saving product...
              </div>
            )}
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
};

export default AdminProducts;
