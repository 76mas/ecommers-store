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
          selectedColor: product.options?.[0]?.color?.[0] || null,
          selectedSize: product.options?.[0]?.size?.[0] || null,
        };
        cart.push(newProduct);
      }
      setChartLegnth(cart.length);
      localStorage.setItem("cart", JSON.stringify(cart));
      message.success("تمت إضافة المنتج إلى السلة 🛒");
    } catch (err) {
      console.error("Error adding to cart:", err);
      message.error("حدث خطأ أثناء إضافة المنتج إلى السلة");
    }
  };

  return (
    <div className="py-12 bg-gradient-to-b from-pink-50 pb-52 to-white min-h-screen">
      <Container>
        {/* Header Section */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-[#FA7189] to-[#ff8fa3] rounded-full mb-4 shadow-lg">
            <HeartFilled
              style={{
                color: "white",
              }}
              className="text-white text-3xl"
            />
          </div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-[#FA7189] to-[#ff8fa3] bg-clip-text text-transparent mb-2">
            المنتجات المفضلة
          </h1>
          <p className="text-gray-600 text-lg">
            {wishlist.length > 0
              ? `لديك ${wishlist.length} منتج في قائمة المفضلة`
              : "قائمة المفضلة فارغة"}
          </p>
        </div>

        {wishlist.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 ">
            {wishlist.map((product) => (
              <Card
                key={product.id}
                hoverable
                className="relative shadow-lg rounded-2xl overflow-hidden border-0 transition-all  duration-300 hover:shadow-2xl"
                cover={
                  <div className="relative overflow-hidden group">
                    <img
                      alt={product.name}
                      src={product.images?.[0]?.link}
                      className="h-72 w-full object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                    {/* Discount Badge */}
                    {product.endprice && product.endprice < product.price && (
                      <div className="absolute top-4 right-4">
                        <Tag
                          color="red"
                          className="font-bold text-base px-3 py-1 rounded-full shadow-lg border-0"
                        >
                          خصم{" "}
                          {(
                            100 -
                            (product.endprice / product.price) * 100
                          ).toFixed(0)}
                          %
                        </Tag>
                      </div>
                    )}

                    {/* Remove from Wishlist */}
                    <Tooltip title="إزالة من المفضلة">
                      <div
                        onClick={() => removeFromWishlist(product.id)}
                        className="absolute top-4 left-4 w-10 h-10 bg-white rounded-full flex items-center justify-center cursor-pointer shadow-lg hover:scale-110 transition-transform duration-300 group/heart"
                      >
                        <HeartFilled
                          style={{
                            color: "red",
                          }}
                          className="text-red-500 text-xl group-hover/heart:animate-pulse"
                        />
                      </div>
                    </Tooltip>
                  </div>
                }
              >
                <div className="flex flex-col gap-3 p-2">
                  {/* Product Name */}
                  <h2 className="font-bold text-xl line-clamp-1 text-gray-800">
                    {product.name}
                  </h2>

                  {/* Description */}
                  <p className="text-gray-500 text-sm line-clamp-2 leading-relaxed">
                    {product.description}
                  </p>

                  {/* Price Section */}
                  <div className="flex items-center gap-2 my-2">
                    {product.endprice && product.endprice < product.price ? (
                      <>
                        <span className="text-2xl font-bold text-[#FA7189]">
                          {product.endprice.toLocaleString()}
                        </span>
                        <span className="text-sm text-gray-400">د.ع</span>
                        <span className="line-through text-gray-400 text-base mr-2">
                          {product.price.toLocaleString()} د.ع
                        </span>
                      </>
                    ) : (
                      <>
                        <span className="text-2xl font-bold text-[#FA7189]">
                          {product.price.toLocaleString()}
                        </span>
                        <span className="text-sm text-gray-400">د.ع</span>
                      </>
                    )}
                  </div>

                  {/* Colors */}
                  {product.options?.[0]?.color?.length > 0 && (
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-xs text-gray-500 font-medium">
                        الألوان:
                      </span>
                      <div className="flex gap-2">
                        {product.options[0].color.map((clr, i) => (
                          <div
                            key={i}
                            className="w-6 h-6 rounded-full border-2 border-gray-200 shadow-sm hover:scale-110 transition-transform cursor-pointer"
                            style={{ backgroundColor: clr }}
                          />
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Action Buttons */}
                  <div className="flex flex-col gap-2 mt-4">
                    <Button
                      type="primary"
                      icon={<ShoppingCartOutlined />}
                      size="large"
                      className="w-full font-bold rounded-xl shadow-md hover:shadow-lg transition-all duration-300"
                      style={{
                        backgroundColor: "#FA7189",
                        borderColor: "#FA7189",
                        height: "45px",
                      }}
                      onClick={() => handleAddToCart(product)}
                    >
                      أضف للسلة
                    </Button>

                    <Button
                      size="large"
                      className="w-full font-bold rounded-xl border-2 hover:bg-[#FA7189] hover:text-white transition-all duration-300"
                      style={{
                        borderColor: "#FA7189",
                        color: "#FA7189",
                        height: "45px",
                      }}
                      onClick={() => router.push(`/product/${product.id}`)}
                    >
                      عرض التفاصيل
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-20 px-4">
            <div className="bg-white rounded-3xl shadow-xl p-12 max-w-md w-full text-center">
              <div className="w-24 h-24 bg-gradient-to-br from-gray-100 to-gray-200 rounded-full flex items-center justify-center mx-auto mb-6">
                <HeartFilled
                  style={{
                    color: "red",
                  }}
                  className="text-gray-400 text-5xl"
                />
              </div>
              <Empty
                description={
                  <div className="mt-4">
                    <h3 className="text-2xl font-bold text-gray-800 mb-2">
                      قائمة المفضلة فارغة
                    </h3>
                    <p className="text-gray-500">
                      لم تقم بإضافة أي منتجات إلى المفضلة بعد
                    </p>
                  </div>
                }
              />
              <Button
                type="primary"
                size="large"
                className="mt-8 font-bold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
                style={{
                  backgroundColor: "#FA7189",
                  borderColor: "#FA7189",
                  height: "50px",
                  paddingLeft: "40px",
                  paddingRight: "40px",
                }}
                onClick={() => router.push("/home")}
              >
                تصفح المنتجات
              </Button>
            </div>
          </div>
        )}
      </Container>
    </div>
  );
};

export default Wishlist;
