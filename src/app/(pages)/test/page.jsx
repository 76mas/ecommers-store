"use client";
import { useEffect, useState, useRef } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import Container from "@/app/components/container";
import Header from "@/app/components/header";
import { IoSearch } from "react-icons/io5";
import { MdKeyboardVoice, MdOutlineTimer } from "react-icons/md";
import { GoArrowRight } from "react-icons/go";
import { FaChevronRight, FaChevronLeft, FaStar } from "react-icons/fa";

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
      const products = await axios.get("http://localhost:4000/product");
      const response = await axios.get("http://localhost:4000/banner");

      // ترتيب البنرات حسب priority
      const sortedBanners = response.data.sort(
        (a, b) => a.priority - b.priority
      );
      setAllBanners(sortedBanners);

      console.log("pro the data", response.data);
      setAllProducts(products.data);


      setComeData(true);
    } catch (error) {
      console.log(error);
    }
  };

  const Timer = ({ banner }) => {
    const [timeLeft, setTimeLeft] = useState("");
    const category_detailes = banner.category_detailes;

    useEffect(() => {
      if (!category_detailes?.[0]) return;

      const createdAt = new Date(category_detailes[0].created_at).getTime();
      const expireAt = createdAt + 24 * 60 * 60 * 1000;

      const updateTimer = () => {
        const now = Date.now();
        const diff = expireAt - now;

        if (diff <= 0) {
          setTimeLeft("00h : 00m : 00s");
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
    }, [category_detailes]);

    return (
      <div className="w-full h-[80px] mt-5 justify-center flex items-center">
        <Container>
          {category_detailes.map((item) => (
            <div
              key={item.id}
              className="flex w-full p-4 items-center bg-sky-600 rounded-2xl h-full gap-2"
            >
              <div className="flex relative w-full h-full justify-between items-center">
                <div className="flex flex-col">
                  <p className="text-[24px] font-semibold text-[#fff]">
                    Deal of the Day
                  </p>
                  <p className="text-[12px] text-[#fff] flex items-center gap-2">
                    <MdOutlineTimer /> {timeLeft} remaining
                  </p>
                </div>

                <button
                  onClick={() => navgation.push(`/category/${item.id}`)}
                  className="text-[12px] text-[#fff] flex items-center justify-center gap-2 w-[120px] h-[40px] border rounded-[10px]"
                >
                  <p className="text-[14px]">View All</p>
                  <GoArrowRight className="text-[24px] text-[#fff]" />
                </button>
              </div>
            </div>
          ))}
        </Container>
      </div>
    );
  };

  const List = ({ banner }) => {
    let products = allproducts.filter((item) =>
      banner.category_detailes.some(
        (cat) => Number(item.category_id) === Number(cat.id)
      )
    );

    products = products.slice(0, 4);

    console.log("banner", banner);
    return (
      <div className="w-full h-auto mt-5 flex justify-center">
        <Container>
          <div className="w-full h-full flex flex-col items-center">
            <div className="flex w-full h-[30px] justify-between items-center">
              <p className="text-[24px] font-semibold">{banner.name}</p>
              <FaChevronRight
                onClick={() => navgation.push(`/category/${banner.id}`)}
                className="font-semibold text-[24px]"
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
                      src={`http://localhost:4000/${item.images[0]?.link}`}
                      alt="product"
                    />
                  </div>

                  <div className="mt-2">
                    <h2 className="font-semibold text-sm">{item.name}</h2>
                    <p className="text-gray-500 text-xs">
                      {item.description?.substring(0, 50)}
                    </p>
                    <p className="text-[#F83758] font-semibold">
                      ${item.price * 0.4}
                      <span className="text-gray-400 line-through">
                        ${item.price}
                      </span>{" "}
                      <span className="text-green-600">40% Off</span>
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
                  src={`http://localhost:4000/${banner.background}`}
                  alt={banner?.name || "banner"}
                />
              )}
            </div>

            <div className="w-full h-[50px] flex items-center justify-between">
              <div className="flex flex-col">
                <h1 className="text-2xl">
                  {banner?.map?.[0]?.header || "No Header"}
                </h1>
                <p className="text-[16px]">
                  {banner?.map?.[0]?.description ||
                    banner?.map?.[0]?.discription ||
                    "No Description"}
                </p>
              </div>

              <button
                onClick={() =>
                  navgation.push(`/category/${banner?.map?.[0].category_id}`)
                }
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
    const [currentIndex, setCurrentIndex] = useState(0);
    const [startX, setStartX] = useState(0);
    const [currentTranslate, setCurrentTranslate] = useState(0);
    const [isDragging, setIsDragging] = useState(false);
    const slides = banner.category_detailes;

    const touchStart = (e) => {
      setStartX(e.touches ? e.touches[0].clientX : e.clientX);
      setIsDragging(true);
    };

    const touchMove = (e) => {
      if (!isDragging) return;
      const x = e.touches ? e.touches[0].clientX : e.clientX;
      const diff = x - startX;
      trackRef.current.style.transform = `translateX(${
        currentTranslate + diff
      }px)`;
    };

    const touchEnd = (e) => {
      if (!isDragging) return;
      const x = e.changedTouches ? e.changedTouches[0].clientX : e.clientX;
      const diff = x - startX;

      if (diff < -50 && currentIndex < slides.length - 1) {
        setCurrentIndex(currentIndex + 1);
      } else if (diff > 50 && currentIndex > 0) {
        setCurrentIndex(currentIndex - 1);
      }

      const newTranslate = -currentIndex * trackRef.current.offsetWidth;
      setCurrentTranslate(newTranslate);
      trackRef.current.style.transform = `translateX(${newTranslate}px)`;
      setIsDragging(false);
    };

    return (
      <Container>
        <div
          className="relative shadow-xl rounded-2xl w-full h-[250px] mt-10 flex justify-center items-center overflow-hidden select-none"
          onMouseDown={touchStart}
          onMouseMove={touchMove}
          onMouseUp={touchEnd}
          onMouseLeave={touchEnd}
          onTouchStart={touchStart}
          onTouchMove={touchMove}
          onTouchEnd={touchEnd}
        >
          <div
            className="flex transition-transform duration-500 ease-in-out"
            ref={trackRef}
            style={{ transform: `translateX(-${currentIndex * 100}%)` }}
          >
            {slides?.map((item) => (
              <div
                key={item.id}
                className="min-w-full flex flex-col relative h-[250px] rounded-2xl overflow-hidden items-center"
              >
                <img
                  onClick={() => navgation.push(`/category/${item.id}`)}
                  className="w-full active:scale-[1.1] transition-all cursor-pointer h-full object-cover"
                  src={`http://localhost:4000/${item.image}`}
                  alt="slide"
                />
              </div>
            ))}
          </div>

          <div className="absolute bottom-3 flex justify-center items-center gap-2 w-full">
            {slides.map((_, i) => (
              <div
                key={i}
                className={`w-[12px] h-[12px] rounded-full ${
                  i === currentIndex ? "bg-[#fea1b0]" : "bg-[#DEDBDB]"
                }`}
              ></div>
            ))}
          </div>
        </div>
      </Container>
    );
  };

  const Category = ({ banner }) => {
    const categories = banner.category_detailes;

    return (
      <div className="w-full h-[75px] mt-2 overflow-hidden flex justify-center">
        <Container>
          <div className="flex w-full overflow-x-scroll h-full no-scrollbar justify-center gap-[20px] items-center">
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
                      src={`http://localhost:4000/${item.image}`}
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
    <div className="flex flex-col pb-[100px] relative items-center">
      <Header />

      <div className="w-full h-[75px] flex justify-center">
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
