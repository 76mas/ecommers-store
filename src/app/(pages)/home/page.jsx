"use client";
import { useEffect, useState, useRef, useCallback } from "react";

import axios from "axios";
import { useRouter } from "next/navigation";
import Container from "@/app/components/container";
import Header from "@/app/components/header";
import { IoSearch } from "react-icons/io5";
import { MdKeyboardVoice, MdOutlineTimer } from "react-icons/md";
import { GoArrowRight } from "react-icons/go";
import { FaChevronRight, FaChevronLeft, FaStar } from "react-icons/fa";
// import React, {  useState } from "react";
import { Carousel } from "antd";

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

  const [allproducts, setAllProducts] = useState([]);
  const [comeData, setComeData] = useState(false);
  const navgation = useRouter();

  useEffect(() => {
    GetData();
  }, []);

  const GetData = async () => {
    try {
      const products = await axios.get("https://161.97.169.6:4000/product", {
        params: { page: 1, limit: 1000 },
      });
      const response = await axios.get("https://161.97.169.6:4000/banner");

      // ترتيب البنرات حسب priority
      const sortedBanners = response.data.sort(
        (a, b) => a.priority - b.priority
      );
      setAllBanners(sortedBanners.filter((item) => item.active));

      console.log("pro the data", response.data);
      console.log("pro the fff", products.data);
      setAllProducts(products.data.products);

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
          .delete(`https://161.97.169.6:4000/banner/${banner.id}`)
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

      const createdAt = new Date(banner.created_at).getTime();
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
                className="text-[12px] text-[#fff] flex items-center justify-center gap-2 w-[120px] h-[40px] border rounded-[10px]"
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
    // let products = allproducts.filter((item) =>
    //   banner.category_detailes.some(
    //     (cat) => Number(item.category_id) === Number(cat.id)
    //   )
    // );

    let products = banner.map;
    products = products.slice(0, 4);

    console.log("banner njjjjjjjj", banner);
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
                  className="h-full bg-white rounded-2xl shadow-md p-2 flex flex-col"
                >
                  <div className="w-full h-[140px] flex justify-center items-center overflow-hidden rounded-xl bg-gray-100">
                    <img
                      className="w-full"
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
                      <span className="text-gray-400 line-through">
                        {formatWithCommas(item.price)}
                        {/* ${item.price} */}
                      </span>{" "}
                      <span className="text-green-600">
                        {/* {item.price / item.endprice}% */}
                        {((item.price - item.endprice) / item.price).toFixed(
                          2
                        ) * 100}
                        %
                      </span>
                    </p>

                    <div className="flex items-center gap-1 mt-1">
                      <FaStar className="text-yellow-400" />
                      <FaStar className="text-yellow-400" />
                      <FaStar className="text-yellow-400" />
                      <FaStar className="text-yellow-400" />
                      <FaStar className="text-gray-300" />
                      <span className="text-xs text-gray-500 ml-2">56890</span>
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

  const Banner = ({ banner }) => {
    const trackRef = useRef(null);
    const containerRef = useRef(null);
    const animationRef = useRef(null);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [startX, setStartX] = useState(0);
    const [currentTranslate, setCurrentTranslate] = useState(0);
    const [isDragging, setIsDragging] = useState(false);
    const [dragOffset, setDragOffset] = useState(0);

    const slides = banner?.map || [];

    const getContainerWidth = useCallback(() => {
      return containerRef.current?.offsetWidth || 0;
    }, []);

    const updateTransform = useCallback((translate, animate = true) => {
      if (!trackRef.current) return;

      if (animate) {
        trackRef.current.style.transition = "transform 500ms ease-in-out";
      } else {
        trackRef.current.style.transition = "none";
      }
      trackRef.current.style.transform = `translateX(${translate}px)`;
    }, []);

    useEffect(() => {
      const newTranslate = -currentIndex * getContainerWidth();
      setCurrentTranslate(newTranslate);
      updateTransform(newTranslate, true);
    }, [currentIndex, getContainerWidth, updateTransform]);

    const touchStart = useCallback((e) => {
      const clientX = e.touches ? e.touches[0].clientX : e.clientX;
      setStartX(clientX);
      setIsDragging(true);
      setDragOffset(0);

      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    }, []);

    const touchMove = useCallback(
      (e) => {
        if (!isDragging) return;

        e.preventDefault();
        const clientX = e.touches ? e.touches[0].clientX : e.clientX;
        const diff = clientX - startX;
        setDragOffset(diff);

        animationRef.current = requestAnimationFrame(() => {
          updateTransform(currentTranslate + diff, false);
        });
      },
      [isDragging, startX, currentTranslate, updateTransform]
    );

    const touchEnd = useCallback(() => {
      if (!isDragging) return;

      setIsDragging(false);
      const threshold = getContainerWidth() * 0.15;

      let newIndex = currentIndex;

      if (dragOffset < -threshold && currentIndex < slides.length - 1) {
        newIndex = currentIndex + 1;
      } else if (dragOffset > threshold && currentIndex > 0) {
        newIndex = currentIndex - 1;
      }

      setCurrentIndex(newIndex);
    }, [
      isDragging,
      dragOffset,
      currentIndex,
      slides.length,
      getContainerWidth,
    ]);

    useEffect(() => {
      return () => {
        if (animationRef.current) {
          cancelAnimationFrame(animationRef.current);
        }
      };
    }, []);

    if (!slides.length) return null;

    return (
      <Container>
        <div
          ref={containerRef}
          className="relative shadow-xl rounded-2xl w-full h-[250px] mt-10 flex justify-center items-center overflow-hidden select-none touch-pan-y"
          onMouseDown={touchStart}
          onMouseMove={touchMove}
          onMouseUp={touchEnd}
          onMouseLeave={touchEnd}
          onTouchStart={touchStart}
          onTouchMove={touchMove}
          onTouchEnd={touchEnd}
        >
          <div className="flex will-change-transform" ref={trackRef}>
            {slides.map((item, index) => (
              <div
                key={item.id || index}
                className="min-w-full flex flex-col relative h-[250px] rounded-2xl overflow-hidden items-center"
              >
                <img
                  onClick={() => navgation.push(`/banner/${item.id}`)}
                  className="w-full active:scale-[1.1] transition-all cursor-pointer h-full object-cover"
                  src={item.background}
                  alt="slide"
                  draggable="false"
                  loading={index === 0 ? "eager" : "lazy"}
                />
              </div>
            ))}
          </div>
          <div className="absolute bottom-3 flex justify-center items-center gap-2 w-full">
            {slides.map((_, i) => (
              <div
                key={i}
                className={`w-[12px] h-[12px] rounded-full transition-colors duration-300 ${
                  i === currentIndex ? "bg-[#fea1b0]" : "bg-[#DEDBDB]"
                }`}
              />
            ))}
          </div>
        </div>
      </Container>
    );
  };

  const Category = ({ banner }) => {
    let categories = banner.category_detailes;

    categories = categories.filter((item) => item.active);

    return (
      <div className="w-full h-[75px] mt-2 overflow-hidden flex justify-center">
        <Container>
          <div className="flex pl-42 w-full overflow-x-scroll h-full no-scrollbar justify-center gap-[20px] items-center">
            {categories
              .sort((a, b) => a.priority - b.priority)
              .map((item) => (
                <div
                  key={item.id}
                  onClick={() => navgation.push(`/category/${item.id}`)}
                  className="w-[56px] active:scale-95 active:text-[#FA7189] text-[#000] cursor-pointer h-[65px] flex flex-col items-center"
                >
                  <div className="w-[50px] shadow-sm h-[50px] rounded-full flex justify-center items-center">
                    <img
                      className="w-full h-full rounded-full"
                      src={`${item.image}`}
                      alt={item.name}
                    />
                  </div>
                  <p className="text-[12px]">{item.name}</p>
                </div>
              ))}
          </div>
        </Container>
      </div>
    );
  };

  const renderBanner = (banner) => {
    switch (banner.type) {
      case "Category":
        return <Category key={banner.id} banner={banner} />;

      case "slides":
        return <Banner key={banner.id} banner={banner} />;

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

      <div className="w-full mt-32  h-[75px] flex justify-center">
        <Container>
          <div className="flex w-full text-[#BBBBBB] bg-[#fff] shadow-sm h-[55px] rounded-[12px] justify-center">
            <div className="w-full flex items-center h-full p-3">
              <IoSearch className="text-[24px] text-[#BBBBBB]" />
              <input
                type="text"
                placeholder="Search any Product.."
                className="w-full h-full px-4"
              />
              <MdKeyboardVoice className="text-[24px] text-[#BBBBBB]" />
            </div>
          </div>
        </Container>
      </div>

      {/* عرض جميع البنرات حسب الترتيب والنوع */}
      {comeData && allBanners.map((banner) => renderBanner(banner))}
    </div>
  );
};

export default Hero;
