"use client";

import { useEffect, useState } from "react";
import { Switch, message } from "antd";
import { HeartFilled, HeartOutlined } from "@ant-design/icons";

const WishlistSwitch = ({ product }) => {
  const [isFavorite, setIsFavorite] = useState(false);

  useEffect(() => {
    const storedWishlist = JSON.parse(localStorage.getItem("wishlist") || "[]");
    const exists = storedWishlist.some((p) => p.id === product.id);
    setIsFavorite(exists);
  }, [product.id]);

  const toggleFavorite = (checked) => {
    const storedWishlist = JSON.parse(localStorage.getItem("wishlist") || "[]");

    if (checked) {
      // إضافة للمفضلة
      localStorage.setItem(
        "wishlist",
        JSON.stringify([...storedWishlist, product])
      );
      setIsFavorite(true);
      message.success("تمت إضافة المنتج إلى المفضلة ❤️");
    } else {
      // إزالة من المفضلة
      const updated = storedWishlist.filter((p) => p.id !== product.id);
      localStorage.setItem("wishlist", JSON.stringify(updated));
      setIsFavorite(false);
      message.info("تمت إزالة المنتج من المفضلة 💔");
    }
  };

  return (
    <div className="flex w-full justify-end items-center gap-2 mt-3">
      <span className="font-semibold text-gray-700">
        {isFavorite ? "في المفضلة" : "أضف إلى المفضلة"}
      </span>{" "}
      <Switch
        checked={isFavorite}
        onChange={toggleFavorite}
        checkedChildren={<HeartFilled style={{ color: "red" }} />}
        unCheckedChildren={<HeartOutlined />}
      />
    </div>
  );
};

export default WishlistSwitch;
