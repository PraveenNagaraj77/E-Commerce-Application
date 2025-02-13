import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom"; // ✅ Import useNavigate
import { addToCart } from "../../store/shop/cartSlice";
import { Card, CardContent, CardFooter } from "../ui/card";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import { brandOptionsMap, categoryOptionsMap } from "@/config";
import { useToast } from "@/hooks/use-toast"; // ✅ Import useToast

const ShoppingProductTile = ({ product, handleGetProductDetails }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate(); // ✅ Initialize navigate
  const currentUser = useSelector((state) => state.auth.user); // ✅ Get user
  const { toast } = useToast(); // ✅ Initialize toast
  const userId = currentUser?.id;

  const handleAddToCart = () => {
    // ✅ If user is not authenticated, show toast & redirect to login
    if (!userId) {
      toast({
        title: "Login Required",
        description: "Please log in to add items to your cart.",
        status: "warning",
        duration: 3000,
      });

      navigate("/auth/login");
      return; // 🔴 Stop further execution
    }

    if (!product?._id) {
      console.error("🚨 Missing required fields!", { userId, productId: product?._id });
      return;
    }

    const cartItem = {
      userId,
      productId: product._id,
      title: product.title,
      image: product.image,
      price: product.salePrice > 0 ? product.salePrice : product.price,
      quantity: 1,
    };

    console.log("🛒 Adding to Cart:", cartItem);
    dispatch(addToCart(cartItem));

    // ✅ Show Success Toast
    toast({
      title: "Added to Cart",
      description: `${product.title} has been added successfully! 🛒`,
      status: "success",
      duration: 3000,
    });
  };

  return (
    <Card className="w-full max-w-xs sm:max-w-sm md:max-w-md lg:max-w-lg xl:max-w-xl mx-auto mt-4">
      <div onClick={() => handleGetProductDetails(product?._id)}>
        <div className="relative">
          <img
            src={product?.image}
            alt={product?.title}
            className="w-full h-[300px] object-cover rounded-t-lg"
            loading="lazy"
          />
          {product?.salePrice > 0 && (
            <Badge className="absolute top-2 left-2 bg-red-500 hover:bg-red-600">
              Sale
            </Badge>
          )}
        </div>

        <CardContent className="p-4 space-y-2">
          <h2 className="text-lg font-bold truncate">{product?.title}</h2>
          <div className="flex justify-between text-sm text-muted-foreground">
            <span>{categoryOptionsMap[product?.category] || "Unknown"}</span>
            <span>{brandOptionsMap[product?.brand] || "Unknown"}</span>
          </div>
          <div className="flex justify-between items-center">
            <span
              className={`text-lg font-semibold ${
                product?.salePrice > 0 ? "line-through text-gray-500" : "text-primary"
              }`}
            >
              ${product?.price?.toFixed(2)}
            </span>
            {product?.salePrice > 0 && (
              <span className="text-lg font-semibold text-red-500">
                ${product?.salePrice?.toFixed(2)}
              </span>
            )}
          </div>
        </CardContent>
      </div>

      <CardFooter>
        <Button onClick={handleAddToCart} className="w-full">
          Add to Cart
        </Button>
      </CardFooter>
    </Card>
  );
};

export default ShoppingProductTile;
