"use client";
import { useEffect, useState, useRef, useCallback } from "react";

// import { Carousel } from "antd";
import axios from "axios";
import { useRouter } from "next/navigation";
import Container from "@/app/components/container";
import Header from "@/app/components/header";
import { IoSearch } from "react-icons/io5";
import { MdKeyboardVoice, MdOutlineTimer } from "react-icons/md";
import { GoArrowRight } from "react-icons/go";
import { FaChevronRight, FaChevronLeft, FaStar } from "react-icons/fa";
// import React, {  useState } from "react";
import { Carousel, Rate } from "antd";
import ProductSearch from "@/app/components/productSearch";
import { Spinner } from "@heroui/react";
import { useOrder } from "@/app/context/order";

function formatWithCommas(value) {
  if (value === null || value === undefined) return "";
  const s = String(value).trim();

  const [intPart, decPart] = s.split(".");

  const sign = intPart.startsWith("-") ? "-" : "";
  const absInt = intPart.replace("-", "");

  const formattedInt = absInt.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  return sign + formattedInt + (decPart ? "." + decPart : "");
}

const Hero = () => {
  const [allBanners, setAllBanners] = useState([]);
  const [loading, setLoading] = useState(true);
  const [allproducts, setAllProducts] = useState([]);
  const { setChartLegnth } = useOrder();
  const [comeData, setComeData] = useState(false);
  const navgation = useRouter();
  const [showSerarch, setShowSerarch] = useState(false);

  useEffect(() => {
    const chart = localStorage.getItem("cart");
    const cart = chart ? JSON.parse(chart) : [];
    setChartLegnth(cart.length);
    GetData();
  }, []);

  const GetProdcutsBySearch = async (trem = "") => {
    try {
      const products = await axios.get("http://161.97.169.6:4000/product", {
        params: { page: 1, limit: 10, search: trem },
      });

      setAllProducts(products.data.products);

      console.log("pro the data", products.data);
    } catch (error) {
      console.log(error);
    }
  };

  const GetData = async () => {
    try {
      const response = await axios.get("http://161.97.169.6:4000/banner");

      const sortedBanners = response.data.sort(
        (a, b) => a.priority - b.priority
      );
      setAllBanners(sortedBanners.filter((item) => item.active));
      setLoading(false);
      setComeData(true);
    } catch (error) {
      console.log(error);
    }
  };

  const Timer = ({ banner }) => {
    const [timeLeft, setTimeLeft] = useState("");

    const deletBanner = async () => {
      try {
        axios
          .delete(`http://161.97.169.6:4000/banner/${banner.id}`)
          .then((res) => {
            console.log("res", res.data);
          })
          .catch((err) => {
            console.log("err", err);
          });
      } catch (error) {
        console.log("error", error);
      }
    };

    useEffect(() => {
      // if (!banner?.created_at) return;

      const createdAt = new Date(banner.map[0].end_date).getTime();
      const expireAt = createdAt + 24 * 60 * 60 * 1000;

      const updateTimer = () => {
        const now = Date.now();
        const diff = expireAt - now;

        if (diff <= 0) {
          setTimeLeft("00h : 00m : 00s");
          deletBanner();
          return;
        }

        const hours = Math.floor(diff / (1000 * 60 * 60));
        const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((diff % (1000 * 60)) / 1000);

        setTimeLeft(
          `${hours.toString().padStart(2, "0")}h : ${minutes
            .toString()
            .padStart(2, "0")}m : ${seconds.toString().padStart(2, "0")}s`
        );
      };

      updateTimer();
      const interval = setInterval(updateTimer, 1000);

      return () => clearInterval(interval);
    }, []);

    return (
      <div className="w-full h-[80px] mt-5 justify-center flex items-center">
        <Container>
          {/* {category_detailes.map((item) => ( */}
          <div
            // key={item.id}
            className="flex w-full p-4 items-center bg-sky-600 rounded-2xl h-full gap-2"
          >
            <div className="flex relative w-full h-full justify-between items-center">
              <div className="flex flex-col">
                <p className="text-[24px] font-semibold text-[#fff]">
                  {banner.name}
                </p>
                <p className="text-[12px] text-[#fff] flex items-center gap-2">
                  <MdOutlineTimer /> {timeLeft} remaining
                </p>
              </div>

              <button
                onClick={() => navgation.push(`/banner/${banner.id}`)}
                className="text-[12px] cursor-pointer text-[#fff] flex items-center justify-center gap-2 w-[120px] h-[40px] border rounded-[10px]"
              >
                <p className="text-[14px]">View All</p>
                <GoArrowRight className="text-[24px] text-[#fff]" />
              </button>
            </div>
          </div>
          {/* ))} */}
        </Container>
      </div>
    );
  };

  const List = ({ banner }) => {
    let products = banner.map;
    products = products.slice(0, 4);

    console.log("List", banner);
    // console.log("banner njjjjjjjj", banner);
    return (
      <div className="w-full h-auto mt-5 flex justify-center">
        <Container>
          <div className="w-full   h-full flex flex-col items-center">
            <div className="flex w-full h-[30px] justify-between items-center">
              <p className="text-[24px] font-semibold">{banner.name}</p>
              <FaChevronRight
                onClick={() => navgation.push(`/banner/${banner.id}`)}
                className="font-semibold cursor-pointer active:text-[#FA7189] text-[24px]"
              />
            </div>

            <div className="w-full pb-4 no-scrollbar h-[330px] overflow-scroll flex gap-4">
              {products.map((item) => (
                <div
                  onClick={() => navgation.push(`/product/${item.id}`)}
                  key={item.id}
                  className="h-full active:scale-95 min-w-[150px] w-[300px] cursor-pointer bg-white rounded-2xl shadow-md p-2 flex flex-col"
                >
                  <div className="w-full h-[140px] flex justify-center items-center overflow-hidden rounded-xl bg-gray-100">
                    <img
                      className="w-full h-full object-cover"
                      src={`${item.images[0]?.link}`}
                      alt="product"
                    />
                  </div>

                  <div className="mt-2">
                    <h2 className="font-semibold text-sm">{item.name}</h2>
                    <p className="text-gray-500 text-xs">
                      {item.description?.substring(0, 50)}
                    </p>
                    <p className="text-[#F83758] font-semibold">
                      {formatWithCommas(item.endprice)}
                      {/* ${item.price * 0.4} */}
                      <br />
                      <span className="text-gray-400 line-through">
                        {formatWithCommas(item.price)}
                        {/* ${item.price} */}
                      </span>{" "}
                      {/* <span className="text-green-600">
                        {((item.price - item.endprice) / item.price).toFixed(
                          2
                        ) * 100}
                        %
                      </span> */}
                      <span className="text-green-600">
                        {(
                          ((item.price - item.endprice) / item.price) *
                          100
                        ).toFixed(1)}
                        %
                      </span>
                    </p>

                    <div className="flex w-full items-center gap-1 mt-1">
                      {/* <FaStar className="text-yellow-400" />
                      <FaStar className="text-yellow-400" />
                      <FaStar className="text-yellow-400" />
                      <FaStar className="text-yellow-400" />
                      <FaStar className="text-gray-300" /> */}
                      <Rate
                        disabled
                        allowHalf
                        defaultValue={item.average_rating}
                        style={{ fontSize: 12 }}
                      />
                      {/* <span className="text-xs text-gray-500 ml-2">56890</span> */}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </Container>
      </div>
    );
  };

  const Single = ({ banner }) => {
    return (
      <div className="w-full h-[350px] mt-10 justify-center flex items-center">
        <Container>
          <div className="flex w-full h-full gap-2 flex-col items-center">
            <div className="flex flex-col relative w-full h-full rounded-2xl overflow-hidden items-center">
              {banner && (
                <img
                  className="w-full h-full"
                  src={`${banner.background}`}
                  alt={banner?.name || "banner"}
                />
              )}
            </div>

            <div className="w-full h-[50px] flex items-center justify-between">
              <div className="flex flex-col">
                <h1 className="text-2xl">{banner?.name || "No Header"}</h1>
                {/* <p className="text-[16px]">
                  {banner?.map?.[0]?.description ||
                    banner?.map?.[0]?.discription ||
                    "No Description"}
                </p> */}
              </div>

              <button
                onClick={() => navgation.push(`/banner/${banner?.id}`)}
                className="text-[12px] active:bg-[#fa718adc] cursor-pointer text-[#fff] flex items-center justify-center gap-2 w-[140px] h-[50px] bg-[#F83758] rounded-[10px]"
              >
                <p className="text-[14px]">View All</p>
                <GoArrowRight className="text-[24px] text-[#fff]" />
              </button>
            </div>
          </div>
        </Container>
      </div>
    );
  };

  const Slides = ({ banner }) => {
    const slides = banner?.map || [];
    return (
      <Container>
        {" "}
        <Carousel
          className="rounded-2xl"
          style={{
            marginTop: "10px",
            borderRadius: "20px",
            overflow: "hidden",
          }}
          // afterChange={onChange}
          autoplay
        >
          {slides.map((item, index) => (
            <div>
              <img
                src={item.background}
                onClick={() => navgation.push(`/banner/${item.id}`)}
                alt="Slide 1"
                style={{
                  width: "100%",
                  height: "200px",
                  objectFit: "cover",
                }}
                loading={index === 0 ? "eager" : "lazy"}
                className=" active:scale-[1.3] transition-all"
              />
            </div>
          ))}
        </Carousel>
      </Container>
    );
  };

  const Category = ({ banner }) => {
    let categories = banner.category_detailes;

    categories = categories.filter((item) => item.active);

    return (
      <div className="w-full   overflow-hidden  items-center flex justify-center">
        <Container>
          <div className="flex w-full overflow-x-scroll no-scrollbar gap-4 items-center px-2 snap-x snap-mandatory">
            {categories
              .sort((a, b) => a.priority - b.priority)
              .map((item) => (
                <div
                  key={item.id}
                  onClick={() => navgation.push(`/category/${item.id}`)}
                  className="flex-shrink-0 pt-3 snap-center cursor-pointer group"
                >
                  <div className="flex flex-col items-center gap-2 transition-transform duration-200 active:scale-95">
                    <div className="relative w-16 h-16">
                      <div className="absolute inset-0 bg-gradient-to-br from-pink-400 via-purple-400 to-pink-500 rounded-full opacity-0 group-active:opacity-100 transition-opacity duration-200 blur-sm"></div>
                      <div className="relative w-full h-full rounded-full border-2 border-transparent group-active:border-pink-400 transition-all duration-200 p-0.5 bg-gradient-to-br from-gray-100 to-white shadow-md">
                        <img
                          className="w-full h-full rounded-full object-cover"
                          src={`${item.image}`}
                          alt={item.name}
                        />
                      </div>
                    </div>
                    <p className="text-xs font-medium text-gray-800 group-active:text-pink-500 transition-colors duration-200 max-w-[70px] text-center truncate">
                      {item.name}
                    </p>
                  </div>
                </div>
              ))}
          </div>
        </Container>
      </div>
    );
  };
  // const Category = ({ banner }) => {
  //   let categories = banner.category_detailes;

  //   categories = categories.filter((item) => item.active);

  //   return (
  //     <div className="w-full h-[75px] mt-2 overflow-hidden flex justify-center">
  //       <Container>
  //         <div className="flex pl-42 w-full overflow-x-scroll h-full no-scrollbar justify-center gap-[20px] items-center">
  //           {categories
  //             .sort((a, b) => a.priority - b.priority)
  //             .map((item) => (
  //               <div
  //                 key={item.id}
  //                 onClick={() => navgation.push(`/category/${item.id}`)}
  //                 className="w-[56px] active:scale-95 active:text-[#FA7189] text-[#000] cursor-pointer h-[65px] flex flex-col items-center"
  //               >
  //                 <div className="w-[50px] shadow-sm h-[50px] rounded-full flex justify-center items-center">
  //                   <img
  //                     className="w-full h-full rounded-full"
  //                     src={`${item.image}`}
  //                     alt={item.name}
  //                   />
  //                 </div>
  //                 <p className="text-[12px]">{item.name}</p>
  //               </div>
  //             ))}
  //         </div>
  //       </Container>
  //     </div>
  //   );
  // };

  const renderBanner = (banner) => {
    switch (banner.type) {
      case "Category":
        return <Category key={banner.id} banner={banner} />;

      case "slides":
        return <Slides key={banner.id} banner={banner} />;

      case "Timer":
        return <Timer key={banner.id} banner={banner} />;

      case "List":
        return <List key={banner.id} banner={banner} />;

      case "single":
        return <Single key={banner.id} banner={banner} />;

      default:
        console.warn(`Unknown banner type: ${banner.type}`);
        return null;
    }
  };

  return (
    <div className="flex  flex-col pb-[100px] relative items-center">
      <Header />

      <div className="w-full   h-[75px] flex justify-center">
        <Container>
          <div className="flex w-full text-[#BBBBBB] bg-[#fff] shadow-sm h-[55px] rounded-[12px] justify-center">
            <div className="w-full flex items-center h-full p-3">
              <IoSearch className="text-[24px] text-[#BBBBBB]" />
              <input
                type="text"
                placeholder="Search any Product.."
                onFocus={() => {
                  navgation.push("search");
                }}
                onChange={(e) => {
                  GetProdcutsBySearch(e.target.value);
                  if (e.target.value !== "") {
                    setShowSerarch(true);
                  }
                  if (e.target.value === "") {
                    setShowSerarch(false);
                  }
                }}
                className="w-full h-full px-4"
              />
              <MdKeyboardVoice className="text-[24px] text-[#BBBBBB]" />
            </div>
          </div>
        </Container>
      </div>

      {showSerarch ? (
        <Container>
          <ProductSearch products={allproducts} />
        </Container>
      ) : loading ? (
        <Container>
          <div className="w-full h-[500px] overflow-hidden flex flex-col justify-center items-center gap-6 animate-pulse">
            {/* شريط الدوائر */}
            <div className="flex gap-3">
              {[...Array(20)].map((_, i) => (
                <div
                  key={i}
                  className="w-[50px] h-[50px] rounded-full bg-gray-300 animate-bounce"
                  style={{ animationDelay: `${i * 0.2}s` }}
                ></div>
              ))}
            </div>
            <div className="w-[100%] h-40 bg-gray-200 rounded-xl"></div>

            {/* المربع المتوسط */}
            <div className="w-[100%] h-10 bg-gray-300 rounded-lg"></div>

            <div className="w-[100%] h-40 bg-gray-200 rounded-xl"></div>
            <div className="w-[100%] h-10 bg-gray-300 rounded-lg"></div>
          </div>
        </Container>
      ) : (
        <>{allBanners.map((banner) => renderBanner(banner))}</>
      )}
    </div>
  );
};

export default Hero;
