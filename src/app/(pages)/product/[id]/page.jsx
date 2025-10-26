"use client";

import { useParams } from "next/navigation";
import { FaPlus, FaMinus } from "react-icons/fa";
import { colornames } from "color-name-list";
import { useEffect, useState } from "react";
import Container from "@/app/components/container";
import { LuShoppingCart } from "react-icons/lu";
import { FaChevronLeft } from "react-icons/fa";
import { FaStar } from "react-icons/fa";
import { useRouter } from "next/navigation";
import axios from "axios";
import { color } from "framer-motion";
import { useOrder } from "@/app/context/order";
import { Flex, Rate } from "antd";

function formatWithCommas(value) {
  if (value === null || value === undefined) return "";
  const s = String(value).trim();

  const [intPart, decPart] = s.split(".");

  const sign = intPart.startsWith("-") ? "-" : "";
  const absInt = intPart.replace("-", "");

  const formattedInt = absInt.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  return sign + formattedInt + (decPart ? "." + decPart : "");
}

export default function Products() {
  const { setChartLegnth } = useOrder();
  const [product, setProduct] = useState();
  const [options, setOptions] = useState({
    quantity: 0,
    price: "",
    color: "",
    size: "",
  });
  const [value, setValue] = useState(0);
  const [value2, setValue2] = useState(0);
  const [ratingsCount, setRatingsCount] = useState(0);
  const desc = ["terrible", "bad", "normal", "good", "wonderful"];

  const router = useRouter();
  const [showRate, setShowRate] = useState(false); // للتحكم بظهور واجهة التقييم
  // const averageRating = 3.8;
  const [reletadeProduct, setReletadeProduct] = useState([]);

  const { id } = useParams();

  useEffect(() => {
    axios
      .get(`http://161.97.169.6:4000/product/${id}`)
      .then((res) => {
        setProduct(res.data);

        const chart = localStorage.getItem("cart");

        const cart = chart ? JSON.parse(chart) : [];

        setChartLegnth(cart.length);
        const stored = cart.find((item) => Number(item.id) === Number(id));

        if (stored) {
          setOptions({
            quantity: stored.quantity,
            price: stored.price,
            color: stored.color,
            size: stored.size,
          });
        } else {
          setOptions({
            quantity: 0,
            price: res.data.price,
            color: res.data.options[0]?.color?.[0] || "",
            size: res.data.options[0]?.size?.[0] || "",
          });
        }
      })
      .catch((err) => {
        console.log(err);
      });
  }, [id]);

  useEffect(() => {
    GetRatings();
  }, []);

  const GetRatings = async () => {
    try {
      const res = await axios.get(
        `http://161.97.169.6:4000/rating/product/${id}`
      );
      console.log("rating", res.data);
      setValue(Number(res.data.average));
      setRatingsCount(res.data.count);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    console.log("product", product);
    console.log("options", options);
    axios.get(`http://161.97.169.6:4000/product`).then((res) => {
      console.log(" res.data", res.data);
      setReletadeProduct(
        res.data.products

          .filter(
            (item) =>
              Number(item?.related) === Number(product?.related) &&
              item.id !== Number(id)
          )
          .slice(0, 6)
      );
    });
  }, [product]);

  const handleAddToCart = (currentOptions) => {
    if (!currentOptions.quantity || currentOptions.quantity <= 0) {
      return;
    }

    const orderInfo = { ...product, ...currentOptions };

    const chart = localStorage.getItem("cart");
    const cart = chart ? JSON.parse(chart) : [];

    const existingIndex = cart.findIndex((item) => item.id === product.id);

    if (existingIndex !== -1) {
      cart[existingIndex].quantity = currentOptions.quantity;
    } else {
      cart.push(orderInfo);
    }

    localStorage.setItem("cart", JSON.stringify(cart));
    setChartLegnth(cart.length);
  };

  function getColorName(color) {
    if (!color) return "unknown";

    let formatted = color.startsWith("#")
      ? color.toLowerCase()
      : `#${color.toLowerCase()}`;
    let someColor = colornames.find((c) => c.hex.toLowerCase() === formatted);
    return someColor ? someColor.name : "unkown";
  }

  // const

  const AddRatting = async () => {
    console.log("value", value);
    try {
      const res = await axios.post(
        `http://161.97.169.6:4000/rating`,
        {
          user_id: JSON.parse(localStorage.getItem("user")).id,
          product_id: id,
          value: value2,
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      console.log("res", res.data);
    } catch (err) {
      console.log(err);
    }
  };

  const ProductInfo = ({ product }) => {
    return (
      <>
        <div className="w-full h-full flex flex-col items-center ">
          <div className="w-full rounded-3xl h-[250px] overflow-hidden flex justify-center items-center">
            <img
              className="w-full"
              src={
                product.images[0]?.link.includes("https")
                  ? `${product.images[0]?.link}`
                  : `http://161.97.169.6:4000/${product.images[0]?.link}`
              }
              alt="product1"
            />
          </div>

          <div className="w-full mt-5 h-full flex flex-col">
            <div className="w-full gap-3 h-full flex flex-col items-start justify-center">
              {product.options[0] && product.options[0]?.color?.length > 0 && (
                <h1 className="font-[800] text-[#FA7189] text-xl">
                  color:{" "}
                  <span className=" text-[#000]">
                    {getColorName(options.color)}
                  </span>
                </h1>
              )}

              {product.options[0] && product.options[0]?.size?.length > 0 && (
                <h1 className="font-[800] text-xl">size: {options.size}</h1>
              )}

              <div className="flex flex-col gap-1.5">
                <div className="flex gap-1">
                  {product.options[0].color?.map((option) => (
                    <div
                      className={`p-2 border ${
                        option === options.color
                          ? "border-[#FA7189] text-white"
                          : "border-[#000000] text-[#000000]"
                      } rounded-[8px]`}
                      key={option}
                      onClick={() => {
                        setOptions({
                          ...options,
                          color: option,
                        });

                        const chart = localStorage.getItem("cart");
                        const cart = chart ? JSON.parse(chart) : [];
                        const stored = cart.find(
                          (item) => Number(item.id) === Number(id)
                        );
                        if (stored) {
                          stored.color = option;
                          localStorage.setItem("cart", JSON.stringify(cart));
                          setChartLegnth(cart.length);
                        } else {
                          handleAddToCart({
                            ...options,
                            color: option,
                          });

                          setChartLegnth(cart.length);
                        }
                      }}
                    >
                      <span
                        className="w-8 block shadow h-8 rounded-full"
                        style={{ backgroundColor: option }}
                      ></span>
                    </div>
                  ))}
                </div>

                <div className="flex gap-1">
                  {product.options[0].size?.map((option) => (
                    <div
                      className={`p-2 border ${
                        option === options.size
                          ? "border-[#FA7189] text-[#FA7189]"
                          : "border-[#000000] text-[#000000]"
                      } rounded-[8px]`}
                      key={option}
                      onClick={() => {
                        handleAddToCart({
                          ...options,
                          size: option,
                        });

                        setOptions({
                          ...options,
                          size: option,
                        });

                        const chart = localStorage?.getItem("cart");
                        const cart = chart ? JSON.parse(chart) : [];
                        const stored = cart.find(
                          (item) => Number(item.id) === Number(id)
                        );
                        if (stored) {
                          stored.size = option;
                          localStorage.setItem("cart", JSON.stringify(cart));
                          setChartLegnth(cart.length);
                        } else {
                          handleAddToCart({
                            ...options,
                            size: option,
                          });

                          setChartLegnth(cart.length);
                        }
                      }}
                    >
                      {option}
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex flex-col items-start w-full h-full">
                <h1 className="font-[800] text-2xl">{product.name}</h1>

                <div className="flex flex-col  gap-2 mt-2">
                  <div className="flex flex-col ">
                    <p className="text-gray-700 font-medium">
                      تقييم المستخدمين:
                    </p>
                    <Rate disabled allowHalf defaultValue={value} />
                    <span className="text-sm text-gray-500">
                      {value?.toFixed(1)}
                      <span className="text-sm text-gray-600">
                        / number of ratings {ratingsCount}
                      </span>
                    </span>
                  </div>

                  {!showRate && (
                    <button
                      onClick={() => setShowRate(true)}
                      className="mt-3 px-4 py-1  cursor-pointer bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                    >
                      قيّم المنتج
                    </button>
                  )}

                  {showRate && (
                    <Flex gap="middle" vertical align="center" className="mt-3">
                      <Rate
                        tooltips={desc}
                        onChange={setValue2}
                        value={value2}
                      />
                      {value2 ? (
                        <span className="text-sm text-gray-600">
                          {desc[value2 - 1]}
                        </span>
                      ) : (
                        <span className="text-sm text-gray-500">
                          اختر عدد النجوم
                        </span>
                      )}

                      <button
                        onClick={() => {
                          AddRatting();
                          setShowRate(false);
                        }}
                        className="px-4 py-1 cursor-pointer bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
                      >
                        إرسال التقييم
                      </button>
                    </Flex>
                  )}
                </div>

                <p className="text-[#F83758] font-semibold">
                  {formatWithCommas(product.endprice)}
                  <span className="text-gray-400 line-through">
                    {" "}
                    {formatWithCommas(product.price)}
                  </span>{" "}
                  <span className="text-green-600">
                    {(
                      (product.price - product.endprice) /
                      product.price
                    ).toFixed(2) * 100}
                    %
                  </span>
                </p>

                <div>
                  <h1 className="font-[800] text-xl">
                    Stock:{" "}
                    <span className="text-[#F83758]">{product.stock}</span>
                  </h1>
                </div>

                <div className="flex flex-col mt-4 items-start justify-center  gap-2 ">
                  <h1 className="font-[800] text-xl">Product Details</h1>
                  <ProductDescription text={product.description} />
                </div>

                <div className="mt-5 font-black flex flex-col items-start  ">
                  <h1>Select Quantity</h1>
                </div>
                <div className="flex w-full justify-between items-center">
                  <div className="flex items-center flex-col gap-2">
                    <div className="flex items-center gap-2  rounded-lg h-[40px]  p-1 bg-[#eee]  ">
                      <div
                        onClick={() => {
                          if (options.quantity > 0) {
                            setOptions({
                              ...options,
                              quantity: options.quantity - 1,
                            });

                            const chart = JSON.parse(
                              localStorage.getItem("cart")
                            );

                            if (options.quantity === 1) {
                              const updatedCart = chart.filter(
                                (item) => item.id !== product.id
                              );
                              localStorage.setItem(
                                "cart",
                                JSON.stringify(updatedCart)
                              );

                              setChartLegnth(
                                JSON.parse(localStorage.getItem("cart")).length
                              );
                              // console.log("updatedCart", );
                            } else {
                              const updatedCart = chart.map((item) => {
                                if (item.id === product.id) {
                                  return {
                                    ...item,
                                    quantity: item.quantity - 1,
                                  };
                                }
                                return item;
                              });
                              localStorage.setItem(
                                "cart",
                                JSON.stringify(updatedCart)
                              );
                            }
                          }
                        }}
                        className="w-[50px] active:text-[#FA7189]  text-xl flex font-[100] justify-center items-center"
                      >
                        <FaMinus className="active:text-[#FA7189]" />
                      </div>
                      <div className="w-[50px]  bg-white rounded-lg  flex justify-center items-center">
                        {options.quantity}
                      </div>
                      <div
                        onClick={() => {
                          if (options.quantity >= product.stock) {
                            alert(
                              "لا يمكن إضافة كمية أكثر من المتاح في المخزن"
                            );
                            return;
                          }
                          setOptions({
                            ...options,
                            quantity: options.quantity + 1,
                          });

                          const chart = JSON.parse(
                            localStorage.getItem("cart")
                          );
                          if (options.quantity === 0) {
                            handleAddToCart({
                              ...options,
                              quantity: 1,
                            });
                          } else {
                            const updatedCart = chart.map((item) => {
                              if (item.id === product.id) {
                                return {
                                  ...item,
                                  quantity: item.quantity + 1,
                                };
                              }
                              return item;
                            });
                            localStorage.setItem(
                              "cart",
                              JSON.stringify(updatedCart)
                            );
                          }
                        }}
                        className="w-[50px] active:text-[#FA7189] text-xl font-[100] flex justify-center items-center"
                      >
                        <FaPlus className="active:text-[#FA7189]" />
                      </div>
                    </div>
                  </div>

                  <div
                    onClick={() => {
                      const updatedOptions =
                        options.quantity === 0
                          ? { ...options, quantity: 1 }
                          : options;

                      setOptions(updatedOptions);
                      handleAddToCart(updatedOptions);
                    }}
                    className="w-[200px] text-white bg-[#F83758] h-[50px] rounded-2xl flex justify-center items-center"
                  >
                    <h1>Checkout</h1>
                  </div>
                </div>

                <div className="mt-5 w-full h-full">
                  <h1 className="font-[800] text-2xl">Similar To:</h1>
                </div>
                <div className="grid gap-4 grid-cols-[1fr_1fr]">
                  {reletadeProduct.map((item) => (
                    <div
                      onClick={() => router.push(`/product/${item.id}`)}
                      key={item.id}
                      className="w-full h-full bg-white rounded-2xl shadow-md p-2 flex flex-col"
                    >
                      <div className="w-full h-[140px] flex justify-center items-center overflow-hidden rounded-xl bg-gray-100">
                        <img
                          className="w-full "
                          src={`${item.images[0]?.link}`}
                          alt="product1"
                        />
                      </div>

                      <div className="mt-2 pr-3 w-full ">
                        <p className="text-gray-500 w-full text-xs">
                          {item.description.substring(0, 50)}
                        </p>
                        <div className="text-[#F83758] font-semibold flex flex-col">
                          {formatWithCommas(item.endprice)}
                          <div className="flex items-center gap-2">
                            <span className="text-gray-400 line-through">
                              {formatWithCommas(item.price)}
                            </span>{" "}
                            <span className="text-[#F83758] font-[400]">
                              {(
                                (item.price - item.endprice) /
                                item.price
                              ).toFixed(2) * 100}
                              %
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </>
    );
  };

  return (
    <>
      <div className="pb-32 w-full h-full justify-center flex ">
        <Container>
          <div className="flex  w-full h-[75px] justify-between items-center">
            <div
              onClick={() => router.push("/home")}
              className=" w-[50px] cursor-pointer h-[50px] rounded-full flex justify-center items-center"
            >
              <FaChevronLeft className="text-2xl active:text-[#FA7189] " />
            </div>
            <div
              onClick={() => router.push("/checkout")}
              className="bg-[#eee] w-[50px] active:text-[#FA7189] cursor-pointer h-[50px] rounded-full flex justify-center items-center"
            >
              <LuShoppingCart className="text-2xl " />
            </div>
          </div>

          {product && <ProductInfo product={product} />}
        </Container>
      </div>
    </>
  );
}

const ProductDescription = ({ text }) => {
  const [expanded, setExpanded] = useState(false);

  const toggleExpanded = () => {
    setExpanded((prev) => !prev);
  };

  return (
    <p className="text-gray-700 leading-relaxed">
      {expanded
        ? text
        : text.substring(0, 120) + (text.length > 120 ? "..." : "")}
      {text.length > 120 && (
        <button
          onClick={toggleExpanded}
          className="ml-2 text-blue-600 font-semibold hover:underline"
        >
          {expanded ? "Less" : "More"}
        </button>
      )}
    </p>
  );
};
