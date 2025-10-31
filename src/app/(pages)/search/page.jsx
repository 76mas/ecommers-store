"use client";

import Masonry, { ResponsiveMasonry } from "react-responsive-masonry";
import { useRouter } from "next/navigation";
import { IoFileTrayFullOutline, IoSearch } from "react-icons/io5";
import { useEffect, useState } from "react";
import Container from "@/app/components/container";
import { MdKeyboardVoice } from "react-icons/md";
// import { Header } from "antd/es/layout/layout";
import axios from "axios";
import Header from "@/app/components/header";

const SearchPage = () => {
  const router = useRouter();

  const [products, setAllProducts] = useState([]);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [foucus, setFocus] = useState(false);


  useEffect(() => {
    setFocus(true);  
  },[])
  const GetProdcutsBySearch = async (term = "", pageNum = 1) => {
    try {
      setLoading(true);

      const response = await axios.get("http://161.97.169.6:4000/product", {
        params: { page: pageNum, limit: 10, search: term },
      });

      const fetched = response.data.products || [];

      console.log("pro the data", response.data);
      if (pageNum === 1) {
        setAllProducts(fetched);
      } else {
        setAllProducts((prev) => [...prev, ...fetched]);
      }

      setHasMore(fetched.length > 0);
      setLoading(false);
    } catch (error) {
      console.log("Error fetching products:", error);
      setLoading(false);
    }
  };

 
  useEffect(() => {
    GetProdcutsBySearch(search, 1);
  }, []);


  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      setPage(1);
      GetProdcutsBySearch(search, 1);
    }, 500);

    return () => clearTimeout(delayDebounce);
  }, [search]);


  useEffect(() => {
    const handleScroll = () => {
      if (
        window.innerHeight + window.scrollY >=
          document.body.offsetHeight - 100 &&
        !loading &&
        hasMore
      ) {
        setPage((prev) => prev + 1);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [loading, hasMore]);


  useEffect(() => {
    if (page > 1) {
      GetProdcutsBySearch(search, page);
    }
  }, [page]);

  return (
    <div className="w-full h-full  pb-32">
      <Header />

      <div className="w-full h-[75px] flex justify-center">
        <Container>
          <div className="flex w-full text-[#BBBBBB] bg-[#fff] shadow-sm h-[55px] rounded-[12px] justify-center">
            <div className="w-full flex items-center h-full p-3">
              <IoSearch className="text-[24px] text-[#BBBBBB]" />
              <input
                onFocus={() => setFocus(true)}
                onBlur={() => setFocus(false)}
              onLoad={()=>{
                setFocus(true)
              }}
                type="text"
                placeholder="Search any Product.."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full h-full px-4 outline-none"
              />
              <MdKeyboardVoice className="text-[24px] text-[#BBBBBB]" />
            </div>
          </div>
        </Container>
      </div>

      {products.length === 0 && !loading ? (
        <div className="flex w-full h-full flex-col justify-center items-center text-center rounded-2xl p-10">
          <IoFileTrayFullOutline className="text-[80px] text-[#F83758] mb-4 animate-bounce" />
          <p className="text-[28px] font-semibold text-[#F83758]">
            No Product Found
          </p>
          <p className="text-gray-500 mt-2 text-[16px]">
            Try adjusting your search or filters.
          </p>
        </div>
      ) : (
        <Container>
          <ResponsiveMasonry columnsCountBreakPoints={{ 0: 2 }}>
            <Masonry gutter="16px">
              {products.map((product) => (
                <div
                  key={product.id}
                  onClick={() => router.push(`/product/${product.id}`)}
                  className="bg-white active:scale-95 rounded-2xl shadow-md p-2 cursor-pointer"
                >
                  <div className="w-full overflow-hidden rounded-xl bg-gray-100">
                    <img
                      className="w-full h-auto"
                      src={product.images?.[0]?.link}
                      alt={product.name || "product"}
                    />
                  </div>

                  <div className="mt-2 pr-3 w-full">
                    <p className="text-gray-500 w-full text-xs">
                      {product.description?.substring(0, 50) || ""}
                    </p>
                    <div className="text-[#F83758] font-semibold flex flex-col">
                      {product.endprice}$
                      <div className="flex items-center gap-2">
                        <span className="text-gray-400 line-through">
                          {product.price}$
                        </span>
                        {product.price > 0 && (
                          <span className="text-[#F83758] font-[400]">
                            {(
                              ((product.price - product.endprice) /
                                product.price) *
                              100
                            ).toFixed(0)}
                            % off
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </Masonry>
          </ResponsiveMasonry>
        </Container>
      )}

      {loading && (
        <p className="text-center text-gray-500 mt-4">Loading more...</p>
      )}
    </div>
  );
};

export default SearchPage;
