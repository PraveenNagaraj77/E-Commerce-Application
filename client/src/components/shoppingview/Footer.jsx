
import React from "react";
import { Link } from "react-router-dom";
import {
  Facebook,
  Instagram,
  Twitter,
  ArrowUpRight,
  ShoppingBag,
  Mail,
  MapPin,
  Phone,
} from "lucide-react";

const Footer = () => {
  return (
    <footer className="mt-auto border-t border-gray-200 bg-white">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">

        {/* Main Footer */}
        <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-4">

          {/* Brand */}
          <div>
            <Link to="/" className="inline-flex items-center gap-2">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gray-900 text-white">
                <ShoppingBag size={20} />
              </div>

              <span className="text-xl font-bold tracking-tight text-gray-950">
                SHOP<span className="text-gray-400">.</span>
              </span>
            </Link>

            <p className="mt-4 max-w-xs text-sm leading-6 text-gray-500">
              Discover quality products, explore the latest collections,
              and enjoy a seamless shopping experience.
            </p>

            <div className="mt-5 flex items-center gap-3">
              <a
                href="https://www.facebook.com/"
                target="_blank"
                rel="noreferrer"
                aria-label="Facebook"
                className="flex h-9 w-9 items-center justify-center rounded-full border border-gray-200 text-gray-500 transition hover:bg-gray-900 hover:text-white"
              >
                <Facebook size={16} />
              </a>

              <a
                href="https://www.instagram.com/"
                target="_blank"
                rel="noreferrer"
                aria-label="Instagram"
                className="flex h-9 w-9 items-center justify-center rounded-full border border-gray-200 text-gray-500 transition hover:bg-gray-900 hover:text-white"
              >
                <Instagram size={16} />
              </a>

              <a
                href="https://www.twitter.com/"
                target="_blank"
                rel="noreferrer"
                aria-label="Twitter"
                className="flex h-9 w-9 items-center justify-center rounded-full border border-gray-200 text-gray-500 transition hover:bg-gray-900 hover:text-white"
              >
                <Twitter size={16} />
              </a>
            </div>
          </div>

          {/* Shop Links */}
          <div>
            <h3 className="text-sm font-semibold text-gray-950">
              Shop
            </h3>

            <ul className="mt-5 space-y-3 text-sm text-gray-500">
              <li>
                <Link to="/" className="transition hover:text-gray-950">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/shop/listing" className="transition hover:text-gray-950">
                  All Products
                </Link>
              </li>
              <li>
                <Link to="/shop/account" className="transition hover:text-gray-950">
                  My Account
                </Link>
              </li>
              <li>
                <Link to="/shop/orders" className="transition hover:text-gray-950">
                  My Orders
                </Link>
              </li>
            </ul>
          </div>

          {/* Customer Service */}
          <div>
            <h3 className="text-sm font-semibold text-gray-950">
              Customer Service
            </h3>

            <ul className="mt-5 space-y-3 text-sm text-gray-500">
              <li>
                <Link to="/shop/account" className="transition hover:text-gray-950">
                  Delivery Addresses
                </Link>
              </li>
              <li>
                <Link to="/shop/orders" className="transition hover:text-gray-950">
                  Order Tracking
                </Link>
              </li>
              <li>
                <Link to="/shop/listing" className="transition hover:text-gray-950">
                  Browse Products
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-sm font-semibold text-gray-950">
              Get in Touch
            </h3>

            <div className="mt-5 space-y-4 text-sm text-gray-500">
              <div className="flex items-start gap-3">
                <Mail size={17} className="mt-0.5 shrink-0 text-gray-400" />
                <span>Contact us through our support team.</span>
              </div>

              <div className="flex items-start gap-3">
                <Phone size={17} className="mt-0.5 shrink-0 text-gray-400" />
                <span>We're here to help with your orders.</span>
              </div>

              <div className="flex items-start gap-3">
                <MapPin size={17} className="mt-0.5 shrink-0 text-gray-400" />
                <span>Thank you for shopping with us.</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Footer */}

{/* Bottom Footer */}
<div className="mt-12 flex flex-col items-center justify-between gap-3 border-t border-gray-100 pt-6 text-center sm:flex-row sm:text-left">
  <p className="text-xs text-gray-400">
    © {new Date().getFullYear()} SHOP. All rights reserved.
  </p>

  <p className="text-xs text-gray-500">
    Designed & Developed by{" "}
    <span className="font-semibold text-gray-900">
      Praveen
    </span>
  </p>
</div>

      </div>
    </footer>
  );
};

export default Footer;
