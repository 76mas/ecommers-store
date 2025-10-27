"use client";

import Container from "@/app/components/container";
import { FaChevronLeft } from "react-icons/fa";
import { useRouter, useParams } from "next/navigation";
import axios from "axios";
import { useEffect, useState } from "react";
import Masonry, { ResponsiveMasonry } from "react-responsive-masonry";

export default function ProductsBanner() {
  const { id } = useParams();
  const [products, setProducts] = useState([]);
  const [banner, setBanner] = useState({});
  const [loading, setLoading] = useState(true);
  const navgation = useRouter();

  useEffect(() => {
    fetchBanner();
  }, [id]);

  const fetchBanner = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`http://161.97.169.6:4000/banner/${id}`);
      setBanner(res.data);
      setProducts(res.data.map);
      if (res.data.type === "Timer") {
        setProducts(res.data.map[0].products);
      }
    } catch (err) {
      console.log("Error fetching banner:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full h-full flex justify-center">
      <Container>
        <div className="flex flex-col items-center">
          {/* ====== العنوان ====== */}
          <div className="w-full h-[75px] flex justify-center items-center">
            <div className="w-full relative justify-center items-center flex">
              <FaChevronLeft
                onClick={() => navgation.push("/home")}
                className="absolute active:text-[#ddd] text-2xl left-0 cursor-pointer"
              />
              <div className="flex justify-center items-center text-2xl font-semibold">
                <h1>{banner.name || "العروض"}</h1>
              </div>
            </div>
          </div>

          {/* ====== المحتوى ====== */}
          <div className="w-full mt-8 pb-32">
            {/* ====== اللودنغ ====== */}
            {loading ? (
              <div className="grid grid-cols-2  gap-4">
                {[...Array(8)].map((_, i) => (
                  <div
                    key={i}
                    className="space-y-5 p-4 rounded-2xl shadow-md bg-white"
                  >
                    <div className="h-36 w-full rounded-xl bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 bg-[length:200%_100%] animate-shimmer"></div>
                    <div className="space-y-3">
                      <div className="h-3 w-3/5 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 rounded-lg bg-[length:200%_100%] animate-shimmer"></div>
                      <div className="h-3 w-4/5 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 rounded-lg bg-[length:200%_100%] animate-shimmer"></div>
                      <div className="h-3 w-2/5 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 rounded-lg bg-[length:200%_100%] animate-shimmer"></div>
                    </div>
                  </div>
                ))}
              </div>
            ) : products.length === 0 ? (
              <div className="flex flex-col items-center justify-center text-center mt-20 text-gray-500">
                <p className="text-2xl font-semibold text-[#F83758]">
                  لا توجد منتجات في هذا البانر
                </p>
              </div>
            ) : (
              <ResponsiveMasonry columnsCountBreakPoints={{ 0: 2 }}>
                <Masonry gutter="16px">
                  {products.map((product) => (
                    <div
                      key={product.id}
                      onClick={() => navgation.push(`/product/${product.id}`)}
                      className="bg-white active:scale-95 transition-transform duration-150 rounded-2xl shadow-md p-2 cursor-pointer hover:shadow-lg"
                    >
                      <div className="w-full overflow-hidden rounded-xl bg-gray-100">
                        <img
                          className="w-full h-auto object-cover"
                          src={
                            product.images[0]?.link?.includes("https")
                              ? product.images[0]?.link
                              : `http://161.97.169.6:4000/${product.images[0]?.link}`
                          }
                          alt={product.name || "product"}
                        />
                      </div>

                      <div className="mt-3 px-2">
                        <p className="text-gray-500 text-sm mb-1 line-clamp-2">
                          {product.description?.substring(0, 60)}
                        </p>

                        <div className="text-[#F83758] font-semibold text-base">
                          {product.endprice}$
                        </div>

                        <div className="flex items-center gap-2">
                          <span className="text-gray-400 text-sm line-through">
                            {product.price}$
                          </span>
                          <span className="text-[#F83758] text-sm font-medium">
                            {(
                              ((product.price - product.endprice) /
                                product.price) *
                              100
                            ).toFixed(0)}
                            % خصم
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </Masonry>
              </ResponsiveMasonry>
            )}
          </div>
        </div>
      </Container>
    </div>
  );
}
