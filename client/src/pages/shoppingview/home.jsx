
import React, { useEffect, useState } from "react";

import banner1 from "../../assets/banner1.jpg";
import banner2 from "../../assets/banner2.jpg";
import banner3 from "../../assets/banner3.jpg";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

import {
  ArrowRight,
  Airplay,
  Baby,
  ChevronLeft,
  ChevronRight,
  Footprints,
  Headphones,
  Shirt,
  ShoppingBag,
  Watch,
  Sparkles,
} from "lucide-react";

import { useDispatch, useSelector } from "react-redux";
import {
  fetchAllFilterProducts,
  fetchProductDetails,
} from "@/store/shop/productSlice";

import ShoppingProductTile from "@/components/shoppingview/ProductTile";
import ProductDetails from "@/components/shoppingview/ProductDetails";
import { useNavigate } from "react-router-dom";

const slides = [
  {
    image: banner1,
    eyebrow: "THE NEW SEASON IS HERE",
    title: "Style that speaks for you.",
    description:
      "Discover everyday essentials and timeless pieces that make every outfit count.",
    button: "Explore Collection",
  },
  {
    image: banner2,
    eyebrow: "FIND YOUR NEXT FAVOURITE",
    title: "A little more you.",
    description:
      "Explore collections designed to bring comfort, confidence and style together.",
    button: "Shop Now",
  },
  {
    image: banner3,
    eyebrow: "DISCOVER SOMETHING NEW",
    title: "Everyday, elevated.",
    description:
      "From the essentials to the unexpected, find something worth adding to your collection.",
    button: "Discover More",
  },
];

const categories = [
  { value: "men", label: "Men", icon: Shirt },
  { value: "women", label: "Women", icon: Sparkles },
  { value: "kids", label: "Kids", icon: Baby },
  { value: "accessories", label: "Accessories", icon: Watch },
  { value: "footwear", label: "Footwear", icon: Footprints },
];

const brands = [
  { value: "nike", label: "NIKE" },
  { value: "adidas", label: "adidas" },
  { value: "puma", label: "PUMA" },
  { value: "samsung", label: "SAMSUNG" },
  { value: "apple", label: "Apple" },
  { value: "sony", label: "SONY" },
];

const ShoppingHome = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [openDetailsDialog, setOpenDetailsDialog] = useState(false);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { productList, productDetails, isLoading } = useSelector(
    (state) => state.shopProducts
  );

  const products = Array.isArray(productList) ? productList : [];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((previous) => (previous + 1) % slides.length);
    }, 5000);

    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    dispatch(
      fetchAllFilterProducts({
        filterParams: {},
        sortParams: "price-lowtohigh",
      })
    );
  }, [dispatch]);

  useEffect(() => {
    if (productDetails) {
      setOpenDetailsDialog(true);
    }
  }, [productDetails]);

  const handleNavigateToListing = (item, section) => {
    sessionStorage.removeItem("Filters");

    sessionStorage.setItem(
      "Filters",
      JSON.stringify({ [section]: [item.value] })
    );

    navigate("/shop/listing");
  };

  const handleBrowseAllProducts = () => {
    sessionStorage.removeItem("Filters");
    navigate("/shop/listing");
  };

  const handleGetProductDetails = (productId) => {
    dispatch(fetchProductDetails(productId));
  };

  const previousSlide = () => {
    setCurrentSlide(
      (previous) => (previous - 1 + slides.length) % slides.length
    );
  };

  const nextSlide = () => {
    setCurrentSlide((previous) => (previous + 1) % slides.length);
  };

  return (
    <main className="min-h-screen bg-white text-gray-950">

      {/* HERO */}
      <section className="relative overflow-hidden bg-gray-950">
        <div className="relative h-[460px] sm:h-[540px] lg:h-[620px]">

          {slides.map((slide, index) => (
            <div
              key={index}
              className={`absolute inset-0 transition-opacity duration-1000 ${
                index === currentSlide
                  ? "opacity-100"
                  : "pointer-events-none opacity-0"
              }`}
            >
              <img
                src={slide.image}
                alt={slide.title}
                className="h-full w-full object-cover"
              />
            </div>
          ))}

          <div className="absolute inset-0 bg-gradient-to-r from-black/75 via-black/45 to-black/10" />

          <div className="relative z-10 mx-auto flex h-full max-w-[1440px] items-center px-6 sm:px-10 lg:px-16">
            <div className="max-w-2xl text-white">

              <div className="mb-6 flex items-center gap-3">
                <span className="h-px w-10 bg-white/70" />
                <p className="text-xs font-semibold tracking-[0.25em] text-white/85 sm:text-sm">
                  {slides[currentSlide].eyebrow}
                </p>
              </div>

              <h1 className="max-w-xl text-4xl font-semibold leading-[1.12] tracking-tight sm:text-5xl lg:text-7xl">
                {slides[currentSlide].title}
              </h1>

              <p className="mt-6 max-w-lg text-sm leading-7 text-white/80 sm:text-base">
                {slides[currentSlide].description}
              </p>

              <div className="mt-9">
                <Button
                  onClick={handleBrowseAllProducts}
                  className="h-12 rounded-md bg-white px-8 text-sm font-semibold text-gray-950 transition hover:bg-gray-200"
                >
                  {slides[currentSlide].button}
                  <ArrowRight className="ml-3 h-4 w-4" />
                </Button>
              </div>

            </div>
          </div>

          {/* SLIDE CONTROLS */}
          <button
            type="button"
            onClick={previousSlide}
            aria-label="Previous banner"
            className="absolute left-4 top-1/2 z-20 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-white/40 bg-black/20 text-white backdrop-blur-sm transition hover:bg-white hover:text-black sm:left-8"
          >
            <ChevronLeft size={21} />
          </button>

          <button
            type="button"
            onClick={nextSlide}
            aria-label="Next banner"
            className="absolute right-4 top-1/2 z-20 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-white/40 bg-black/20 text-white backdrop-blur-sm transition hover:bg-white hover:text-black sm:right-8"
          >
            <ChevronRight size={21} />
          </button>

          {/* SLIDE INDICATORS */}
          <div className="absolute bottom-8 left-1/2 z-20 flex -translate-x-1/2 items-center gap-2">
            {slides.map((slide, index) => (
              <button
                key={index}
                type="button"
                aria-label={`Go to slide ${index + 1}`}
                aria-current={currentSlide === index ? "true" : undefined}
                onClick={() => setCurrentSlide(index)}
                className={`h-1.5 rounded-full transition-all duration-300 ${
                  currentSlide === index
                    ? "w-9 bg-white"
                    : "w-4 bg-white/50 hover:bg-white"
                }`}
              />
            ))}
          </div>

        </div>
      </section>

      {/* TRUST STRIP */}
      <section className="border-b border-gray-100 bg-white">
        <div className="mx-auto grid max-w-[1440px] grid-cols-1 divide-y divide-gray-100 px-6 py-5 sm:grid-cols-3 sm:divide-x sm:divide-y-0 lg:px-16">

          <div className="flex items-center justify-center gap-3 py-3 sm:py-1">
            <ShoppingBag className="h-5 w-5 text-gray-700" />
            <span className="text-sm font-medium text-gray-700">
              Explore our collection
            </span>
          </div>

          <div className="flex items-center justify-center gap-3 py-3 sm:py-1">
            <Watch className="h-5 w-5 text-gray-700" />
            <span className="text-sm font-medium text-gray-700">
              Find your everyday style
            </span>
          </div>

          <div className="flex items-center justify-center gap-3 py-3 sm:py-1">
            <Headphones className="h-5 w-5 text-gray-700" />
            <span className="text-sm font-medium text-gray-700">
              Discover more choices
            </span>
          </div>

        </div>
      </section>

      {/* CATEGORIES */}
      <section className="py-16 sm:py-20 lg:py-24">
        <div className="mx-auto max-w-[1440px] px-6 lg:px-16">

          <div className="mb-10 flex flex-col items-center text-center">
            <p className="text-xs font-semibold uppercase tracking-[0.25em] text-gray-500">
              FIND YOUR STYLE
            </p>

            <h2 className="mt-3 text-3xl font-semibold tracking-tight sm:text-4xl">
              Shop by category
            </h2>

            <p className="mt-4 max-w-xl text-sm leading-7 text-gray-500">
              Explore our collections and find the pieces that fit your
              lifestyle.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5 lg:gap-5">
            {categories.map((category) => {
              const Icon = category.icon;

              return (
                <button
                  key={category.value}
                  type="button"
                  onClick={() =>
                    handleNavigateToListing(category, "category")
                  }
                  className="group flex min-h-44 flex-col items-center justify-center rounded-xl border border-gray-200 bg-white px-4 py-8 transition duration-300 hover:-translate-y-1 hover:border-gray-950 hover:shadow-lg sm:min-h-52"
                >
                  <div className="flex h-14 w-14 items-center justify-center rounded-full bg-gray-100 transition duration-300 group-hover:bg-gray-950">
                    <Icon className="h-6 w-6 text-gray-800 transition group-hover:text-white" />
                  </div>

                  <span className="mt-5 text-sm font-semibold text-gray-900">
                    {category.label}
                  </span>

                  <span className="mt-2 flex items-center gap-1 text-xs text-gray-400 transition group-hover:text-gray-900">
                    Explore
                    <ArrowRight size={13} />
                  </span>
                </button>
              );
            })}
          </div>

        </div>
      </section>

      {/* BRANDS */}
      <section className="border-y border-gray-100 bg-gray-50 py-16 sm:py-20">
        <div className="mx-auto max-w-[1440px] px-6 lg:px-16">

          <div className="mb-10 text-center">
            <p className="text-xs font-semibold uppercase tracking-[0.25em] text-gray-500">
              THE BRANDS YOU LOVE
            </p>

            <h2 className="mt-3 text-3xl font-semibold tracking-tight sm:text-4xl">
              Explore brands
            </h2>
          </div>

          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
            {brands.map((brand) => (
              <button
                key={brand.value}
                type="button"
                onClick={() => handleNavigateToListing(brand, "brand")}
                className="flex min-h-24 items-center justify-center rounded-lg border border-gray-200 bg-white px-3 py-6 text-lg font-bold tracking-tight text-gray-700 transition duration-300 hover:border-gray-950 hover:text-black hover:shadow-md sm:min-h-28 sm:text-xl"
              >
                {brand.label}
              </button>
            ))}
          </div>

        </div>
      </section>

      {/* PRODUCTS */}
      <section className="py-16 sm:py-20 lg:py-24">
        <div className="mx-auto max-w-[1440px] px-6 lg:px-16">

          <div className="mb-10 flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.25em] text-gray-500">
                MADE FOR EVERYDAY
              </p>

              <h2 className="mt-3 text-3xl font-semibold tracking-tight sm:text-4xl">
                Discover our collection
              </h2>

              <p className="mt-4 max-w-xl text-sm leading-7 text-gray-500">
                Browse our latest available products and find something
                you'll love.
              </p>
            </div>

            <Button
              onClick={handleBrowseAllProducts}
              variant="outline"
              className="h-11 w-fit rounded-md border-gray-300 px-6 text-sm font-semibold hover:bg-gray-950 hover:text-white"
            >
              View all products
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>

          {/* LOADING */}
          {isLoading && products.length === 0 && (
            <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4 lg:gap-6">
              {Array.from({ length: 8 }).map((_, index) => (
                <div
                  key={index}
                  className="overflow-hidden rounded-xl border border-gray-100"
                >
                  <div className="aspect-[4/5] animate-pulse bg-gray-100" />
                  <div className="space-y-3 p-4">
                    <div className="h-3 w-1/3 animate-pulse rounded bg-gray-100" />
                    <div className="h-4 w-3/4 animate-pulse rounded bg-gray-100" />
                    <div className="h-10 animate-pulse rounded bg-gray-100" />
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* PRODUCT GRID */}
          {!isLoading && products.length > 0 && (
            <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4 lg:gap-6">
              {products.slice(0, 8).map((product, index) => (
                <ShoppingProductTile
                  key={product._id || product.id || index}
                  product={product}
                  handleGetProductDetails={handleGetProductDetails}
                />
              ))}
            </div>
          )}

          {/* EMPTY STATE */}
          {!isLoading && products.length === 0 && (
            <div className="rounded-xl border border-dashed border-gray-300 px-6 py-16 text-center">
              <ShoppingBag className="mx-auto h-10 w-10 text-gray-400" />

              <h3 className="mt-4 text-lg font-semibold">
                No products available
              </h3>

              <p className="mt-2 text-sm text-gray-500">
                Products will appear here once they are available.
              </p>

              <Button
                onClick={handleBrowseAllProducts}
                className="mt-6 bg-gray-950 text-white hover:bg-gray-800"
              >
                Browse products
              </Button>
            </div>
          )}

        </div>
      </section>

      {/* PRODUCT DETAILS */}
      <ProductDetails
        open={openDetailsDialog}
        setOpen={setOpenDetailsDialog}
        productDetails={productDetails}
      />

    </main>
  );
};

export default ShoppingHome;
