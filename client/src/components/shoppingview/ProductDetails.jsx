import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { addToCart } from "../../store/shop/cartSlice";
import { Dialog, DialogContent } from "../ui/dialog";
import { Button } from "../ui/button";
import { Separator } from "../ui/separator";
import { Avatar, AvatarFallback } from "../ui/avatar";
import { StarIcon } from "lucide-react";
import { Input } from "../ui/input";
import { useToast } from "@/hooks/use-toast"; // ✅ Import useToast
import { setProductDetails } from "@/store/shop/productSlice";
import { useNavigate } from "react-router-dom";

const ProductDetails = ({ open, setOpen, productDetails }) => {
  const dispatch = useDispatch();
  const currentUser = useSelector((state) => state.auth.user); // ✅ Get logged-in user
  const { toast } = useToast(); // ✅ Initialize toast
  const userId = currentUser?.id;

  const navigate = useNavigate(); // ✅ Move useNavigate outside function

  const handleAddToCart = () => {
    if (!currentUser) {
      toast({
        title: "Login Required",
        description: "Please log in to add items to your cart.",
        status: "warning",
        duration: 3000, // 3 seconds
      });
  
      navigate("/auth/login"); // 🔄 Redirect to Login Page
      return; // ✅ Stop further execution
    }
  
    if (!userId || !productDetails?._id) {
      console.error("🚨 Missing required fields!", { userId, productId: productDetails?._id });
      return;
    }
  
    const cartItem = {
      userId,
      productId: productDetails._id,
      title: productDetails.title,
      image: productDetails.image,
      price: productDetails.salePrice > 0 ? productDetails.salePrice : productDetails.price,
      quantity: 1,
    };
  
    console.log("🛒 Adding to Cart:", cartItem);
    dispatch(addToCart(cartItem));
  
    toast({
      title: "Added to Cart",
      description: `${productDetails.title} has been added successfully! 🛒`,
      status: "success",
      duration: 3000,
    });
  };

  function handleDialogClose() {
    setOpen(false);
    dispatch(setProductDetails());
  }

  return (
    <Dialog open={open} onOpenChange={handleDialogClose}>
      <DialogContent className="grid grid-cols-1 sm:grid-cols-2 gap-8 sm:p-8 max-w-[90vw] sm:max-w-[80vw] lg:max-w-[70vw]">
        <div className="relative overflow-hidden rounded-lg">
        <img
  src={productDetails?.image}
  alt={productDetails?.title}
  className="w-full sm:w-[200px] sm:h-[200px] md:w-[300px] md:h-[300px] lg:w-[450px] lg:h-[450px] aspect-square object-cover"
/>
        </div>
        <div>
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold">{productDetails?.title}</h1>
            <p className="text-muted-foreground text-lg sm:text-2xl mb-5 mt-4">
              {productDetails?.description}
            </p>
          </div>
          <div className="flex items-center justify-between">
            <p
              className={`text-xl sm:text-2xl font-bold ${
                productDetails?.salePrice > 0 ? "line-through" : ""
              } `}>
              ${productDetails?.price}
            </p>
            {productDetails?.salePrice > 0 ? (
              <p className="text-lg sm:text-2xl font-bold text-muted-foreground">
                ${productDetails?.salePrice}
              </p>
            ) : null}
          </div>
          <div className="flex items-center gap-2 mt-2">
            <div className="flex items-center gap-0.5">
              {[...Array(5)].map((_, index) => (
                <StarIcon key={index} className="w-5 h-5 fill-primary" />
              ))}
            </div>
            <span className="text-muted-foreground">(4.5)</span>
          </div>
          <div className="mt-5 mb-5">
            <Button className="w-full" onClick={handleAddToCart}>
              Add to Cart
            </Button>
          </div>
          <Separator />
          <div className="max-h-[300px] overflow-auto">
            <h2 className="text-xl sm:text-2xl font-bold mb-4">Reviews</h2>
            <div className="grid gap-6">
              {[...Array(3)].map((_, index) => (
                <div key={index} className="flex gap-4">
                  <Avatar className="w-10 h-10 border">
                    <AvatarFallback>SM</AvatarFallback>
                  </Avatar>
                  <div className="grid gap-1">
                    <div className="flex items-center gap-2">
                      <h3 className="font-bold">Praveen</h3>
                    </div>
                    <div className="flex items-center gap-0.5">
                      {[...Array(5)].map((_, i) => (
                        <StarIcon key={i} className="w-5 h-5 fill-primary" />
                      ))}
                    </div>
                    <p className="text-muted-foreground">This is an awesome Product</p>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-6 flex gap-2">
              <Input placeholder="Write a review.." />
              <Button>Submit</Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ProductDetails;
