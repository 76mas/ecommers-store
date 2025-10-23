"use client";

import Container from "./container";
import { IoHomeOutline } from "react-icons/io5";
import { FaRegHeart } from "react-icons/fa6";
import { LuShoppingCart } from "react-icons/lu";
import { MdOutlineSettings } from "react-icons/md";
import { IoSearch } from "react-icons/io5";
import { usePathname, useRouter } from "next/navigation";
import { use, useEffect, useState } from "react";
import { useOrder } from "../context/order";

export default function FooterNav() {
  const router = useRouter();
  const pathname = usePathname();
  const { chartLegnth, setChartLegnth } = useOrder();
  const [cart, setCart] = useState([]);

  useEffect(() => {
    setCart(chartLegnth);
  }, [chartLegnth]);

  const pathnameArray = pathname.split("/");
  const isActive = (route) => pathnameArray[1] === route;

  const HaveProductsNumber = ({ count }) => {
    return (
      <>
        <div className="absolute top-0 right-0 bg-[#FA7189] text-white w-[20px] h-[20px] rounded-full flex justify-center items-center">
          {count}
        </div>
      </>
    );
  };

  return (
    <div
      style={{ zIndex: 9900 }}
      className="w-full fixed bottom-0 h-[85px] bg-[#ffffff] border-t border-[#d0cece] flex items-center justify-center"
    >
      <Container>
        <div className="flex w-full h-full items-center justify-between gap-9">
          {/* Home */}
          <div
            onClick={() => router.push("/home")}
            className={`w-[42px] ${
              isActive("home") ? "text-[#FA7189]" : "text-[#000]"
            } rounded-full active:text-[#ddd] trsation-all   flex-col flex justify-center items-center cursor-pointer`}
          >
            <IoHomeOutline className="text-2xl" />
            <p>Home</p>
          </div>

          {/* Wishlist */}
          <div
            onClick={() => router.push("/wishlist")}
            className={`w-[42px] ${
              isActive("wishlist") ? "text-[#FA7189]" : "text-[#000]"
            } rounded-full flex-col active:text-[#ddd] trsation-all  flex justify-center items-center cursor-pointer`}
          >
            <FaRegHeart className="text-2xl" />
            <p>Wishlist</p>
          </div>

          {/* Cart */}
          <div
            onClick={() => router.push("/checkout")}
            className={`${
              isActive("checkout")
                ? "bg-[#FA7189] text-white"
                : "text-[#000] bg-[#fff]"
            } p-5 active:w-[61px] active:h-[61px] trsation-all  relative   -mt-9 shadow-sm rounded-full flex-col flex justify-center items-center cursor-pointer`}
          >
            <LuShoppingCart className="text-2xl" />

            {chartLegnth > 0 && <HaveProductsNumber count={chartLegnth} />}
          </div>

          {/* Search */}
          <div
            onClick={() => router.push("/search")}
            className={`w-[42px] ${
              isActive("search") ? "text-[#FA7189]" : "text-[#000]"
            } rounded-full flex-col active:text-[#ddd] trsation-all  flex justify-center items-center cursor-pointer`}
          >
            <IoSearch className="text-2xl" />
            <p>Search</p>
          </div>

          {/* Settings */}
          <div
            onClick={() => router.push("/settings")}
            className={`w-[42px] ${
              isActive("settings") ? "text-[#FA7189]" : "text-[#000]"
            } rounded-full flex-col active:text-[#ddd] trsation-all  flex justify-center items-center cursor-pointer`}
          >
            <MdOutlineSettings className="text-2xl" />
            <p>Settings</p>
          </div>
        </div>
      </Container>
    </div>
  );
}
