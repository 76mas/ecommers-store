"use client";

import Masonry, { ResponsiveMasonry } from "react-responsive-masonry";
import { useRouter } from "next/navigation";
import { IoFileTrayFullOutline } from "react-icons/io5";

const ProductSearch = ({ products }) => {
  const router = useRouter();

  console.log("products", products);
  return (
    <div className="w-full h-full mt-10 pb-32">
      {products?.length === 0 ? (
        <>
          <div className="flex w-full h-full flex-col justify-center items-center text-center  rounded-2xl  p-10">
            <IoFileTrayFullOutline className="text-[80px] text-[#F83758] mb-4 animate-bounce" />
            <p className="text-[28px] font-semibold text-[#F83758]">
              No Product Found
            </p>
            <p className="text-gray-500 mt-2 text-[16px]">
              Try adjusting your search or filters.
            </p>
          </div>
        </>
      ) : (
        <ResponsiveMasonry columnsCountBreakPoints={{ 0: 2 }}>
          <Masonry gutter="16px">
            {products?.map((product) => (
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
      )}
    </div>
  );
};

export default ProductSearch;
