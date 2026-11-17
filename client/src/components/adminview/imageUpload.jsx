
import React, { useEffect, useRef, useState } from "react";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import {
  FileIcon,
  UploadCloudIcon,
  XIcon,
  ImageIcon,
} from "lucide-react";
import { Button } from "../ui/button";
import axios from "axios";
import { Skeleton } from "../ui/skeleton";

const API_BASE_URL = import.meta.env.VITE_BACKEND_URL;

const ProductImageUpload = ({
  imageFile,
  setImageFile,
  uploadedImageUrl,
  setUploadedImageUrl,
  imageLoading,
  setImageLoading,
  isEditMode,
}) => {
  const inputRef = useRef(null);
  const [uploadError, setUploadError] = useState("");

  const validateFile = (file) => {
    if (!file) return false;

const allowedTypes = ["image/jpeg", "image/png", "image/gif"];

if (!allowedTypes.includes(file.type)) {
  setUploadError("Only JPG, PNG, and GIF images are allowed.");
  return false;
}
    if (file.size > 5 * 1024 * 1024) {
      setUploadError("Image size must be less than 5 MB.");
      return false;
    }

    return true;
  };

  const handleImageFileChange = (event) => {
    const selectedFile = event.target.files?.[0];

    if (!selectedFile) return;

    setUploadError("");

    if (!validateFile(selectedFile)) {
      event.target.value = "";
      return;
    }

    setUploadedImageUrl("");
    setImageFile(selectedFile);
  };

  const handleDragOver = (event) => {
    event.preventDefault();
  };

  const handleDrop = (event) => {
    event.preventDefault();

    if (isEditMode) return;

    const droppedFile = event.dataTransfer.files?.[0];

    if (!droppedFile) return;

    setUploadError("");

    if (!validateFile(droppedFile)) return;

    setUploadedImageUrl("");
    setImageFile(droppedFile);

    if (inputRef.current) {
      inputRef.current.value = "";
    }
  };

  const handleRemoveImage = () => {
    setImageFile(null);
    setUploadedImageUrl("");
    setUploadError("");
    setImageLoading(false);

    if (inputRef.current) {
      inputRef.current.value = "";
    }
  };

  useEffect(() => {
    if (!imageFile) return;

    const controller = new AbortController();

    const uploadImage = async () => {
      setImageLoading(true);
      setUploadError("");

      try {
        const data = new FormData();
        data.append("my_file", imageFile);

        const response = await axios.post(
          `${API_BASE_URL}/api/admin/products/upload-image`,
          data,
          { signal: controller.signal }
        );

        if (!response.data?.success || !response.data?.result?.url) {
          throw new Error(
            response.data?.message || "Image upload failed."
          );
        }

        setUploadedImageUrl(response.data.result.url);
      } catch (error) {
        if (error.code !== "ERR_CANCELED") {
          setUploadError(
            error.response?.data?.message ||
              error.message ||
              "Unable to upload image. Please try again."
          );
        }
      } finally {
        if (!controller.signal.aborted) {
          setImageLoading(false);
        }
      }
    };

    uploadImage();

    return () => {
      controller.abort();
    };
  }, [imageFile, setImageLoading, setUploadedImageUrl]);

  return (
    <div className="mx-auto w-full max-w-md">
      <Label className="mb-2 block text-base font-semibold">
        Product Image
      </Label>

      <div
        onDragOver={handleDragOver}
        onDrop={handleDrop}
        className={`rounded-xl border-2 border-dashed p-4 transition ${
          isEditMode
            ? "border-gray-200 bg-gray-50 opacity-70"
            : "border-gray-300 hover:border-gray-500"
        }`}
      >
        {isEditMode ? (
          <div className="flex min-h-28 flex-col items-center justify-center gap-2 text-center">
            <ImageIcon className="h-8 w-8 text-gray-400" />
            <p className="text-sm font-medium text-gray-600">
              Existing product image will be retained.
            </p>
            <p className="text-xs text-gray-400">
              Image replacement is disabled while editing.
            </p>
          </div>
        ) : !imageFile ? (
          <Label
            className="flex h-32 cursor-pointer flex-col items-center justify-center"
            htmlFor="imageupload"
          >
            <UploadCloudIcon className="mb-2 h-10 w-10 text-gray-400" />
            <span className="text-sm font-medium text-gray-700">
              Drag & drop or click to upload
            </span>
            <span className="mt-1 text-xs text-gray-400">
              Images only · Maximum 5 MB
            </span>

            <Input
              id="imageupload"
              type="file"
              accept="image/jpeg,image/png,image/gif"
              className="hidden"
              ref={inputRef}
              onChange={handleImageFileChange}
            />
          </Label>
        ) : (
          <div className="space-y-3">
            {imageLoading ? (
              <div className="space-y-2">
                <Skeleton className="h-24 w-full rounded-lg bg-gray-100" />
                <Skeleton className="h-4 w-2/3 bg-gray-100" />
              </div>
            ) : uploadedImageUrl ? (
              <div className="flex flex-col items-center gap-3">
                <img
                  src={uploadedImageUrl}
                  alt="Uploaded product"
                  className="h-32 w-full rounded-lg bg-white object-contain"
                />

                <div className="flex w-full min-w-0 items-center justify-between gap-2">
                  <div className="flex min-w-0 items-center gap-2">
                    <FileIcon className="h-5 w-5 shrink-0 text-gray-500" />
                    <p className="truncate text-sm font-medium text-gray-700">
                      {imageFile.name}
                    </p>
                  </div>

                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={handleRemoveImage}
                    className="shrink-0 text-gray-500 hover:text-red-600"
                    aria-label="Remove selected image"
                  >
                    <XIcon className="h-4 w-4" />
                  </Button>
                </div>

                <p className="text-xs font-medium text-emerald-600">
                  Image uploaded successfully
                </p>
              </div>
            ) : (
              <div className="flex items-center justify-between gap-2">
                <div className="flex min-w-0 items-center gap-2">
                  <FileIcon className="h-7 w-7 shrink-0 text-gray-500" />
                  <p className="truncate text-sm font-medium text-gray-700">
                    {imageFile.name}
                  </p>
                </div>

                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  onClick={handleRemoveImage}
                  className="shrink-0 text-gray-500 hover:text-red-600"
                  aria-label="Remove selected image"
                >
                  <XIcon className="h-4 w-4" />
                </Button>
              </div>
            )}
          </div>
        )}
      </div>

      {uploadError && (
        <p className="mt-2 text-sm text-red-600">
          {uploadError}
        </p>
      )}
    </div>
  );
};

export default ProductImageUpload;
