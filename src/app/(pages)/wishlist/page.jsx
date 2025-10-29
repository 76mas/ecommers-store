"use client";

import { useEffect, useState } from "react";
import { Button, Card, Empty, Tag, Tooltip, message } from "antd";
import { HeartFilled, ShoppingCartOutlined } from "@ant-design/icons";
import Container from "@/app/components/container";
import { useRouter } from "next/navigation";
import { useOrder } from "@/app/context/order";

const Wishlist = () => {
  const [wishlist, setWishlist] = useState([]);
  const router = useRouter();
  const { setChartLegnth } = useOrder();
  useEffect(() => {
    const storedWishlist = localStorage.getItem("wishlist");
    if (storedWishlist) {
      setWishlist(JSON.parse(storedWishlist));
    }
  }, []);

  const removeFromWishlist = (id) => {
    const updated = wishlist.filter((p) => p.id !== id);
    setWishlist(updated);
    localStorage.setItem("wishlist", JSON.stringify(updated));
    message.info("تمت إزالة المنتج من المفضلة 💔");
  };

  // ✅ الفنكشن المكملة
  const handleAddToCart = (product) => {
    try {
      const storedCart = localStorage.getItem("cart");
      const cart = storedCart ? JSON.parse(storedCart) : [];

      const existingIndex = cart.findIndex((item) => item.id === product.id);

      if (existingIndex !== -1) {
        cart[existingIndex].quantity += 1;
      } else {
        const newProduct = {
          ...product,
          quantity: 1,
          selectedColor: product.options?.[0]?.color?.[0] || null, // أول لون إن وجد
          selectedSize: product.options?.[0]?.size?.[0] || null, // أول قياس إن وجد
        };
        cart.push(newProduct);
      }
      setChartLegnth(cart.length);
      // حفظ التحديث
      localStorage.setItem("cart", JSON.stringify(cart));
      message.success("تمت إضافة المنتج إلى السلة 🛒");
    } catch (err) {
      console.error("Error adding to cart:", err);
      message.error("حدث خطأ أثناء إضافة المنتج إلى السلة");
    }
  };

  return (
    <div className="py-10">
      <Container>
        <h1 className="text-2xl font-bold mb-6 text-center">
          المنتجات المفضلة ❤️
        </h1>

        {wishlist.length > 0 ? (
          <div className="grid grid-cols-2 gap-2">
            {wishlist.map((product) => (
              <Card
                key={product.id}
                hoverable
                className="relative shadow-md"
                cover={
                  <div className="relative">
                    <img
                      alt={product.name}
                      src={product.images?.[0]?.link}
                      className="h-64 w-full object-cover rounded-t-lg"
                    />
                    {/* خصم السعر */}
                    {product.endprice && product.endprice < product.price && (
                      <Tag
                        color="red"
                        className="absolute top-2 -right-2 font-semibold text-sm"
                      >
                        خصم{" "}
                        {(
                          100 -
                          (product.endprice / product.price) * 100
                        ).toFixed(0)}
                        %
                      </Tag>
                    )}
                    {/* زر إزالة من المفضلة */}
                    <Tooltip title="إزالة من المفضلة">
                      <HeartFilled
                        onClick={() => removeFromWishlist(product.id)}
                        style={{ color: "red" }}
                        className="absolute top-2 left-2 text-red-500 text-2xl cursor-pointer hover:scale-110 transition-transform"
                      />
                    </Tooltip>
                  </div>
                }
              >
                <div className="flex flex-col gap-2">
                  <h2 className="font-bold text-lg line-clamp-1">
                    {product.name}
                  </h2>
                  <p className="text-gray-600 text-sm line-clamp-2">
                    {product.description}
                  </p>

                  {/* السعر */}
                  <div className="flex items-center gap-2">
                    {product.endprice && product.endprice < product.price ? (
                      <>
                        <span className="text-lg font-bold text-[#FA7189]">
                          {product.endprice.toLocaleString()} د.ع
                        </span>
                        <span className="line-through text-gray-500 text-sm">
                          {product.price.toLocaleString()} د.ع
                        </span>
                      </>
                    ) : (
                      <span className="text-lg font-bold text-[#FA7189]">
                        {product.price.toLocaleString()} د.ع
                      </span>
                    )}
                  </div>

                  {/* الألوان */}
                  {product.options?.[0]?.color?.length > 0 && (
                    <div className="flex items-center gap-1 mt-1">
                      {product.options[0].color.map((clr, i) => (
                        <div
                          key={i}
                          className="w-5 h-5 rounded-full border"
                          style={{ backgroundColor: clr }}
                        ></div>
                      ))}
                    </div>
                  )}

                  {/* الأزرار */}
                  <div className="flex w-full items-center justify-between mt-3">
                    <Button
                      type="primary"
                      icon={<ShoppingCartOutlined />}
                      style={{
                        backgroundColor: "#FA7189",
                        color: "#fff",
                        border: "none",
                        fontSize: "10px",
                        padding: "5px 10px",
                        borderRadius: "5px",
                        fontWeight: "bold",
                        marginRight: "5px",
                      }}
                      onClick={() => handleAddToCart(product)} // ✅ هنا ربطناها صح
                    >
                      أضف للسلة
                    </Button>
                    <Button
                      style={{
                        backgroundColor: "transparent",
                        color: "#FA7189",
                        borderColor: "#FA7189",
                        border: "1px solid #FA7189",
                        fontSize: "10px",
                        fontWeight: "bold",
                      }}
                      onClick={() => router.push(`/product/${product.id}`)}
                      className="border-[#FA7189] text-sm text-[#FA7189]"
                    >
                      عرض التفاصيل
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-20">
            <Empty description="ما عندك منتجات مفضلة حالياً" />
            <Button
              type="primary"
              className="mt-5"
              onClick={() => router.push("/home")}
            >
              العودة إلى الصفحة الرئيسية
            </Button>
          </div>
        )}
      </Container>
    </div>
  );
};

export default Wishlist;
