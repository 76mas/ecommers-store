"use client";

import Container from "@/app/components/container";
import { FaChevronLeft } from "react-icons/fa";
import { useRouter } from "next/navigation";
import axios from "axios";
import { IoLocationOutline } from "react-icons/io5";
import { FaRegEdit } from "react-icons/fa";
import { Button, Input, Space, Spin } from "antd";
import { useEffect, useState } from "react";
import { useOrder } from "@/app/context/order";
import Order from "../order/page";
const Checkout = () => {
  // let orders = localStorage?.getItem("cart") || "[]";
  const { orderDetails, setOrderDetailse } = useOrder();
  const [orders, setOrders] = useState([]);

  const [order, setOrder] = useState([]);
  const [loaing, setLoading] = useState(false);
  const [voucher, setVoucher] = useState(null);
  const [go, setGo] = useState(true);
  const [discount, setDiscount] = useState(0);
  const [persnateValue, setPersnateValue] = useState(0);
  const [applay, setApplay] = useState(false);
  const [totallPrice, setTotalPrice] = useState(0);
  const [coupon, setCoupon] = useState("");

  useEffect(() => {
    // setOrders(localStorage.getItem("cart"));
    //  const order = JSON.parse(orders);
    setOrder(JSON.parse(localStorage.getItem("cart")));
  }, []);

  console.log("order", order);

  function handelSumPrice(orders) {
    let sum = 0;

    for (let i = 0; i < orders?.length; i++) {
      if (orders[i].endpricedate >= new Date().toISOString().split("T")[0]) {
        sum += orders[i].endprice * orders[i].quantity;
      } else {
        sum += orders[i].price * orders[i].quantity;
      }
    }
    return sum;
  }

  const navgation = useRouter();

  const handelTotalprice = () => {
    return handelSumPrice(order) + 0;
  };

  const handelApplayCoupon = async () => {
    setLoading(true);

    try {
      const res = await axios.post(`http://161.97.169.6:4000/voucher/check`, {
        code: coupon,
        user: JSON.parse(localStorage.getItem("user")).id,
      });
      console.log("donw data", res.data);
      // setApplay(res.data);

      if (handelSumPrice(order) < res.data.min_value) {
        alert("The minimum value to use this voucher is " + res.data.min_value);
      } else {
        setVoucher(res.data);
        if (res.data.type === "per") {
          setPersnateValue(res.data.value);
        }
        setDiscount(res.data.value);
        setOrderDetailse({
          ...orderDetails,
          voucher_info: res.data,
          voucher_id: res.data.id,
        });
      }

      setLoading(false);
    } catch (err) {
      if (err.status === 404) {
        alert(err.response.data.message.error);
      }
      setLoading(false);
    }
  };

  const handelAfterVoucher = () => {
    if (persnateValue > 0) {
      return (
        handelTotalprice() -
        Math.min(voucher.max_value, handelTotalprice() * (persnateValue / 100))
      );
    } else {
      return handelTotalprice() - discount;
    }
  };

  return (
    <div className="w-full h-full pb-[80px] flex flex-col items-center">
      {go ? (
        <>
          <div className="w-full h-[75px] border-b-1 border-[#d0cece] flex justify-center items-center">
            <Container>
              <div className="w-full h-full relative justify-center items-center flex">
                <FaChevronLeft
                  onClick={() => {
                    navgation.push("/home");
                  }}
                  className=" absolute text-2xl left-0 "
                />
                <div className="flex justify-center items-center text-2xl">
                  <h1>Checkout</h1>
                </div>
              </div>
            </Container>
          </div>

          <Container>
            <div className="w-full h-full flex flex-col items-center">
              <div className="w-full h-full flex flex-col items-center">
                <div className="w-full h-full  mt-3 text-xl font-[600] flex gap-3 justify-start items-center">
                  <IoLocationOutline />

                  <h1>Delivery Address</h1>
                </div>

                <div className="w-full gap-2 h-[100px] flex items-start p-3 flex-col relative border-1 border-[#d0cece] mt-3 rounded-2xl ">
                  <h1 className="font-[600]">Address:</h1>
                  <p>
                    216 St Paul's Rd, London N1 2LL, UK Contact : +44-784232
                  </p>

                  <FaRegEdit className=" absolute right-3 top-3 text-[#666] text-2xl" />
                </div>
              </div>

              <div className="flex flex-col border-b-1 pb-[25px] border-[#d0cece] w-full h-full  items-center gap-2">
                {order?.map((items, index) => (
                  <div
                    onClick={() => {
                      navgation.push(`/product/${items.id}`);
                    }}
                    className="cursor-pointer "
                    key={index}
                  >
                    <div className="w-full h-[150px] flex p-3 shadow-md relative border-1 border-[#d0cece] mt-3 rounded-2xl gap-3">
                      <div className="w-[40%] h-full rounded-2xl flex justify-center items-center overflow-hidden">
                        <img src={`${items.images?.[0]?.link}`} alt="product" />
                      </div>

                      <div className="w-[60%] h-full flex flex-col gap-1 items-start overflow-hidden">
                        <h1 className="font-[600]">{items.name}</h1>
                        <p>
                          {items.description?.length > 40
                            ? items.description.slice(0, 30)
                            : items.description}
                        </p>
                        <div className="flex gap-3">
                          {items.size?.length > 0 && (
                            <div className="flex p-1 rounded-md items-center px-3 bg-[#ddd]">
                              size : {items.size}
                            </div>
                          )}

                          {items.color?.length > 0 && (
                            <div className="flex p-1 rounded-md items-center  gap-1 px-3 bg-[#ddd]">
                              color :{" "}
                              <span
                                className="shadow"
                                style={{
                                  backgroundColor: `${items.color}`,
                                  width: "20px",
                                  height: "20px",
                                  borderRadius: "50%",
                                }}
                              ></span>
                            </div>
                          )}

                          <div className="flex p-2 rounded-md items-center px-3 bg-[#ddd]">
                            Qty : {items.quantity}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="w-full border-b-1 pb-[25px] border-[#d0cece] mt-[38px] h-full flex flex-col items-center">
                <div className="w-full h-full flex flex-col items-center">
                  <h1 className="w-full h-full font-[600] text-xl">
                    Order Payment Details
                  </h1>

                  <div className="flex flex-col mt-5 gap-3 items-center w-full h-full">
                    <div className="w-full h-full items-center flex justify-between">
                      <h1 className="font-[600] ">Order Amounts</h1>
                      <h1 className="font-[600] ">${handelTotalprice()}</h1>
                    </div>

                    <div className="w-full h-full items-center flex justify-between">
                      <h1 className="font-[600] ">Convenience</h1>
                      <h1
                        onClick={() => setApplay(!applay)}
                        className="text-[#FA7189] hover:underline cursor-pointer font-[600]"
                      >
                        Apply Coupon
                      </h1>
                    </div>
                    <div
                      style={{
                        height: applay ? "50px" : "0px",
                        opacity: applay ? 1 : 0,
                        overflow: "hidden",
                        transition: "all 0.2s ease",
                      }}
                      className="w-full tracking-normal flex items-center"
                    >
                      <Space.Compact
                        style={{ zIndex: 1, width: "100%", height: "100%" }}
                      >
                        <Input
                          onChange={(e) => setCoupon(e.target.value)}
                          style={{ height: "100%" }}
                          placeholder="Enter Coupon Code"
                        />
                        <Button
                          onClick={handelApplayCoupon}
                          style={{ height: "100%", backgroundColor: "#FA7189" }}
                          type="primary"
                        >
                          Apply <Spin spinning={loaing} />
                        </Button>
                      </Space.Compact>
                    </div>

                    <div className="w-full h-full items-center flex justify-between">
                      <h1 className="font-[600] ">Delivery Free</h1>
                      <h1 className="text-[#FA7189] font-[600]">Free</h1>
                    </div>
                  </div>
                </div>
              </div>

              <div className="w-full  pb-[25px]  mt-[18px] h-full flex flex-col items-center">
                <div className="w-full h-full flex flex-col items-center">
                  <div className="flex flex-col mt-5 gap-3 items-center w-full h-full">
                    <div className="w-full h-full items-center flex justify-between">
                      <h1 className="font-[600] ">Order Total</h1>
                      <h1 className="font-[600] line-through text-[#939393]">
                        ${handelTotalprice()}
                      </h1>
                    </div>

                    <div className="w-full h-full items-center flex justify-between">
                      <h1 className="font-[600] ">Order Discount</h1>
                      <h1 className="font-[600] ">${handelAfterVoucher()}</h1>
                    </div>

                    <div className="w-full h-full items-center flex justify-between">
                      <h1 className="font-[600] ">
                        EMI Available{" "}
                        <span className="text-[#FA7189] font-[600]">
                          Details
                        </span>
                      </h1>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </Container>
          <div className="w-full  bottom-0 h-[100px] border-1 border-[#d0cece] bg-[#F8F8F8] rounded-t-2xl flex  justify-center items-center">
            <Container>
              <div className="w-full h-full flex items-center justify-between">
                <div className="w-[40%] h-full flex flex-col justify-center items-start">
                  <h1 className="font-[600]">${handelTotalprice()}</h1>
                  <h1 className="text-[#FA7189] font-[600]">View Ditails</h1>
                </div>

                <button
                  onClick={() => {
                    // navgation.push("/order");
                    setGo(false);
                  }}
                  className="w-[60%] h-[60px] rounded-md  flex bg-[#F83758] flex-col justify-center items-center"
                >
                  <h1 className="text-white font-[600]">Proceed to Payment</h1>
                </button>
              </div>
            </Container>
          </div>
        </>
      ) : (
        <Order />
      )}
    </div>
  );
};

export default Checkout;
