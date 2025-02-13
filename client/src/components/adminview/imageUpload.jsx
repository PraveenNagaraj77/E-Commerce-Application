import React, { useEffect, useRef } from "react";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { FileIcon, UploadCloudIcon, XIcon } from "lucide-react";
import { Button } from "../ui/button";
import axios from "axios";
import { Skeleton } from "../ui/skeleton";

// ✅ Get the backend URL from the environment
const API_BASE_URL = import.meta.env.VITE_BACKEND_URL; // Fetching from .env

const ProductImageUpload = ({
  imageFile,
  setImageFile,
  uploadedImageUrl,
  setUploadedImageUrl,
  imageLoading,
  setImageLoading,
  isEditMode
}) => {
  const inputRef = useRef(null);

  function handleImageFileChange(event) {
    console.log(event.target.files);
    const selectedFile = event.target.files?.[0];
    if (selectedFile) setImageFile(selectedFile);
  }

  function handleDragOver(event) {
    event.preventDefault();
  }

  function handleDrop(event) {
    event.preventDefault();
    const droppedFile = event.dataTransfer.files?.[0];
    if (droppedFile) setImageFile(droppedFile);
  }

  function handleRemoveImage() {
    setImageFile(null);
    if (inputRef.current) {
      inputRef.current.value = "";
    }
  }

  console.log(imageFile);

  // ✅ Upload image to cloud
  async function uploadImagetoCloudinary() {
    setImageLoading(true);
    const data = new FormData();
    data.append('my_file', imageFile);

    // Use the environment variable for the backend URL
    const response = await axios.post(`${API_BASE_URL}/api/admin/products/upload-image`, data);

    console.log(response.data.result.url);
    if (response?.data?.success) {
      setUploadedImageUrl(response.data.result.url);
      setImageLoading(false);
    }
  }

  useEffect(() => {
    if (imageFile !== null) uploadImagetoCloudinary();
  }, [imageFile]);

  return (
    <div className="w-full max-w-md mx-auto">
      <label className="text-lg font-semibold mb-2 block"> Upload Image</label>
      <div
        onDragOver={handleDragOver}
        onDrop={handleDrop}
        className={`${isEditMode ? "opacity-60" : ""}border-2 border-dashed rounded-lg p-4`}
      >
        <div>
          <Input
            id="imageupload"
            type="file"
            className="hidden"
            ref={inputRef}
            onChange={handleImageFileChange}
            disabled={isEditMode}
          />
          {!imageFile ? (
            <Label
              className={`${isEditMode ? 'cursor-not-allowed' : '' }flex flex-col items-center justify-center h-32 cursor-pointer`}
              htmlFor="imageupload"
            >
              <UploadCloudIcon className="w-10 h-10 text-muted-foreground mb-2" />
              <span>Drag & drop or click to Upload</span>
            </Label>
          ) : (
            imageLoading ? <Skeleton className='h-10 bg-gray-100'/> : 
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <FileIcon className="w-8 h-8 text-primary mr-2" />
              </div>
              <p className="text-sm font-medium">{imageFile.name}</p>
              <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-foreground" onClick={handleRemoveImage}>
                <XIcon className="w-4 h-4"/>
                <span className="sr-only">Remove File</span>
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductImageUpload;
