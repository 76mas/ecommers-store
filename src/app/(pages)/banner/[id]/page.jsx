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
  const navgation = useRouter();

  useEffect(() => {
    featchBanner();
  }, [id]);

  const featchBanner = async () => {
    try {
      const res = await axios.get(`http://161.97.169.6:4000/banner/${id}`);
      //   console.log("category", res.data);
      setBanner(res.data);
      setProducts(res.data.map);
    } catch (err) {
      console.log(err);
    }
  };

  //   useEffect(() => {
  //     axios
  //       .get(`http://161.97.169.6:4000/banner/${id}`)
  //       .then((res) => setCategory(res.data))
  //       .catch((err) => console.log(err));
  //   }, [id]);

  console.log("products", products);

  return (
    <div className="w-full h-full flex justify-center">
      <Container>
        <div className="flex flex-col items-center">
          <div className="w-full h-[75px] flex justify-center items-center">
            <div className="w-full relative justify-center items-center flex">
              <FaChevronLeft
                onClick={() => navgation.push("/home")}
                className="absolute active:text-[#dddd] text-2xl left-0 cursor-pointer"
              />
              <div className="flex justify-center items-center text-2xl">
                <h1>{banner.name}</h1>
              </div>
            </div>
          </div>

          {/* Masonry Layout */}
          <div className="w-full mt-10 pb-32">
            <ResponsiveMasonry columnsCountBreakPoints={{ 0: 2 }}>
              <Masonry gutter="16px">
                {products.map((product) => (
                  <div
                    key={product.id}
                    onClick={() => navgation.push(`/product/${product.id}`)}
                    className="bg-white active:scale-95 rounded-2xl shadow-md p-2 cursor-pointer"
                  >
                    <div className="w-full overflow-hidden rounded-xl bg-gray-100">
                      <img
                        className="w-full h-auto"
                        // src={`http://161.97.169.6:4000/${product.images[0]?.link}`}
                        src={
                          product.images[0]?.link.includes("https")
                            ? `${product.images[0]?.link}`
                            : `http://161.97.169.6:4000/${product.images[0]?.link}`
                        }
                        alt={product.name || "product"}
                      />
                    </div>

                    <div className="mt-2 pr-3 w-full">
                      <p className="text-gray-500 w-full text-xs">
                        {product.description.substring(0, 50)}
                      </p>
                      <div className="text-[#F83758] font-semibold flex flex-col">
                        {product.endprice}$
                        <div className="flex items-center gap-2">
                          <span className="text-gray-400 line-through">
                            {product.price}$
                          </span>
                          <span className="text-[#F83758] font-[400]">
                            {(
                              ((product.price - product.endprice) /
                                product.price) *
                              100
                            ).toFixed(0)}
                            % off
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </Masonry>
            </ResponsiveMasonry>
          </div>
        </div>
      </Container>
    </div>
  );
}
