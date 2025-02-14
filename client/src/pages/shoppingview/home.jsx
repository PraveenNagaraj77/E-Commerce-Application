import React, { useEffect, useState } from "react";
import banner1 from "../../assets/banner1.jpg";
import banner2 from "../../assets/banner2.jpg";
import banner3 from "../../assets/banner3.jpg";
import { Button } from "@/components/ui/button";
import {
  Airplay,
  BabyIcon,
  ChevronLeft,
  ChevronRight,
  CloudLightning,
  Images,
  RemoveFormatting,
  Shirt,
  ShirtIcon,
  ShoppingBasket,
  UmbrellaIcon,
  WashingMachine,
  WatchIcon,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { useDispatch, useSelector } from "react-redux";
import { fetchAllFilterProducts, fetchProductDetails } from "@/store/shop/productSlice";
import ShoppingProductTile from "@/components/shoppingview/ProductTile";
import { useNavigate } from "react-router-dom";
import { addToCart, fetchCart } from "@/store/shop/cartSlice";
import { useToast } from "@/hooks/use-toast";
import ProductDetails from "@/components/shoppingview/ProductDetails";

const categoriesWithIcon = [
  { value: "men", label: "Men", icon: ShirtIcon },
  { value: "women", label: "Women", icon: CloudLightning },
  { value: "kids", label: "Kids", icon: BabyIcon },
  { value: "accessories", label: "Accessories", icon: WatchIcon },
  { value: "footwear", label: "Footwear", icon: UmbrellaIcon },
];

const brandOptions = [
  { value: "nike", label: "Nike", icon: Shirt },
  { value: "adidas", label: "Adidas", icon: WashingMachine },
  { value: "puma", label: "Puma", icon: RemoveFormatting },
  { value: "samsung", label: "Samsung", icon: ShoppingBasket },
  { value: "apple", label: "Apple", icon: Airplay },
  { value: "sony", label: "Sony", icon: Images },
];

const ShoppingHome = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [openDetailsDialog, setOpenDetailsDialog] = useState(false);
  const { toast } = useToast();

  const { productList, productDetails } = useSelector((state) => state.shopProducts);
  const { user } = useSelector((state) => state.auth);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prevSlide) => (prevSlide + 1) % slides.length);
    }, 2000);

    return () => clearInterval(timer);
  }, []);

  const slides = [banner1, banner2, banner3];

  useEffect(() => {
    dispatch(
      fetchAllFilterProducts({
        filterParams: {},
        sortParams: "price-lowtohigh",
      })
    );
  }, [dispatch]);

  function handleNavigateToListing(getCurrentItem, section) {
    sessionStorage.removeItem("Filters");
    const currentFilter = {
      [section]: [getCurrentItem.value],
    };
    sessionStorage.setItem("Filters", JSON.stringify(currentFilter));
    navigate("/shop/listing");
  }

  function handleGetProductDetails(getCurrentProductId) {
    dispatch(fetchProductDetails(getCurrentProductId));
  }

  function handleAddtoCart(getCurrentProductId) {
    console.log("🛒 Adding to Cart:", getCurrentProductId);
    dispatch(addToCart({ userId: user?.id, productId: getCurrentProductId, quantity: 1 })).then((data) => {
      if (data?.payload?.success) {
        dispatch(fetchCart(user?.id));
      }
    });
  }

  useEffect(() => {
    if (productDetails !== null) setOpenDetailsDialog(true);
  }, [productDetails]);

  return (
    <div className="flex flex-col min-h-screen">
      <div className="relative w-full h-[600px] overflow-hidden">
        {slides.map((slide, index) => (
          <img
            src={slide}
            key={index}
            className={` ${
              index === currentSlide ? "opacity-100" : "opacity-0"
            } absolute top-0 left-0 w-full h-full object-cover transition-opacity duration-1000`}
            alt={`Banner ${index + 1}`}
          />
        ))}
        <Button
          onClick={() =>
            setCurrentSlide(
              (prevSlide) => (prevSlide - 1 + slides.length) % slides.length
            )
          }
          variant="outline"
          size="icon"
          className="absolute top-1/2 left-4 transform -translate-y-1/2 bg-white/80"
        >
          <ChevronLeft className="w-4 h-4" />
        </Button>
        <Button
          onClick={() =>
            setCurrentSlide((prevSlide) => (prevSlide + 1) % slides.length)
          }
          variant="outline"
          size="icon"
          className="absolute top-1/2 right-4 transform -translate-y-1/2 bg-white/80"
        >
          <ChevronRight className="w-4 h-4" />
        </Button>
      </div>

      <section className="py-12 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl md:text-3xl font-bold text-center mb-8">Shop by Category</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
            {categoriesWithIcon.map((categoryItem) => (
              <Card
                key={categoryItem.value}
                onClick={() =>
                  handleNavigateToListing(categoryItem, "category")
                }
                className="cursor-pointer hover:shadow-lg transition-shadow"
              >
                <CardContent className="flex flex-col items-center justify-center p-6">
                  <categoryItem.icon className="w-12 h-12 mb-4 text-primary" />
                  <span className="font-bold text-sm sm:text-base">{categoryItem.label}</span>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section className="py-12 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl md:text-3xl font-bold text-center mb-8">Shop by Brand</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6">
            {brandOptions.map((brandItem) => (
              <Card
                key={brandItem.value}
                onClick={() => handleNavigateToListing(brandItem, "brand")}
                className="cursor-pointer hover:shadow-lg transition-shadow"
              >
                <CardContent className="flex flex-col items-center justify-center p-6">
                  <brandItem.icon className="w-12 h-12 mb-4 text-primary" />
                  <span className="font-bold text-sm sm:text-base">{brandItem.label}</span>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section className="py-12">
  <div className="container mx-auto px-4">
    <h2 className="text-2xl md:text-3xl font-bold text-center mb-8">Featured Products</h2>
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
    {productList.map((productItem, index) => (
  <ShoppingProductTile
    key={productItem.id || index}
    product={productItem}
    handleGetProductDetails={handleGetProductDetails}
    handleAddtoCart={handleAddtoCart}
  />
))}
    </div>
  </div>
</section>

      <ProductDetails open={openDetailsDialog} setOpen={setOpenDetailsDialog} productDetails={productDetails} />
    </div>
  );
};

export default ShoppingHome;
