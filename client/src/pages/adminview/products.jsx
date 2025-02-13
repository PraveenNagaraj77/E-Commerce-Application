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
import { addNewProduct, deleteProduct, editProduct, fetchAllProducts } from "@/store/admin/products-slice";
import React, { Fragment, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

const initalFormData = {
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
  const [formData, setFormData] = useState(initalFormData);
  const [imageFile, setImageFile] = useState(null);
  const [uploadedImageUrl, setUploadedImageUrl] = useState("");
  const [imageLoading, setImageLoading] = useState(false);

  const [currentEditId,setEditId] = useState(null);

  const {toast} = useToast();


  const { productList } = useSelector(state=>state.adminProducts);

  const dispatch = useDispatch();


  function isFormValid(){
    return Object.keys(formData).map(key=> formData[key] !== '').every(item=>item)
  }

  function handleDelete(getCurrentProductId){
    console.log(getCurrentProductId);
    dispatch(deleteProduct(getCurrentProductId)).then((data)=>{
      console.log(data);
      if(data?.payload?.success){
        dispatch(fetchAllProducts());
        toast({
          title:"Product Deleted"
        })
      }
    })
  }


  useEffect(()=>{
    dispatch(fetchAllProducts())
  },[dispatch])

  function onSubmit(event) {
    event.preventDefault();


    currentEditId !==null ?
    dispatch(editProduct({
      id : currentEditId,
      formData
    })).then((data)=>{
      console.log(data)

      if(data?.payload?.success){
        dispatch(fetchAllProducts());
        setFormData(initalFormData);
        setOpenCreateProductDialog(false);
        setEditId(null);
        toast({
          title:"Product Updated"
        })
      }

    }) :

    dispatch(addNewProduct({
      ...formData,
      image:uploadedImageUrl,
    })).then((data)=>{
      console.log(data);
      if(data?.payload?.success){
        dispatch(fetchAllProducts());
        setOpenCreateProductDialog(false);
        setImageFile(null);
        setFormData(initalFormData)
        toast({
          title:data?.payload?.message
        })
        
      }
    })
  
  }

  // console.log(productList,uploadedImageUrl, "formdata")

  

  return (
    <Fragment>
      <div className="mb-5 w-full flex justify-end">
        <Button
          onClick={() => {
            setOpenCreateProductDialog(true);
          }}
        >
          Add new Product
        </Button>
      </div>
      <div className="grid gap-4 md:grid-cols-3 lg:grid-cols-4">

          {
            productList && productList.length > 0 ? productList.map(productItem=> <ProductTile setEditId={setEditId} setOpenCreateProductDialog={setOpenCreateProductDialog} setFormData={setFormData} product={productItem} handleDelete={handleDelete} /> ) : null
          }

      </div>
      <Sheet
        open={openCreateProductsDialog}
        onOpenChange={() => {
          setOpenCreateProductDialog(false);
          setEditId(null);
          setFormData(initalFormData);
        }}
      >
        <SheetContent className="overflow-auto" side="right">
          <SheetHeader>
            <SheetTitle>
              {
                currentEditId !==null  ? 'Edit Product' : 'Add New Product'
              }
            </SheetTitle>
          </SheetHeader>
          <ProductImageUpload
            imageFile={imageFile}
            setImageFile={setImageFile}
            uploadedImageUrl={uploadedImageUrl}
            setUploadedImageUrl={setUploadedImageUrl}
            setImageLoading = {setImageLoading}
            imageLoading = {imageLoading}
            currentEditId={currentEditId}
            isEditMode={currentEditId !==null}
          />
          <div className="py-6">
            <CommonForm
              onSubmit={onSubmit}
              formData={formData}
              setFormData={setFormData}
              buttonText={
                currentEditId !==null  ? 'Edit' : 'Add'
              }
              formControls={addProductformElements}
              isBtnDisabled ={!isFormValid()}
            />
          </div>
        </SheetContent>
      </Sheet>
    </Fragment>
  );
};

export default AdminProducts;
