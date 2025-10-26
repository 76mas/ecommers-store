"use client";

import Container from "@/app/components/container";
import { FaChevronLeft } from "react-icons/fa";
import { useRouter } from "next/navigation";
import axios from "axios";
import { useEffect, useState } from "react";
import Done from "@/app/components/ss";
import { Button, Spin } from "antd";
import { useOrder } from "@/app/context/order";

const Order = () => {
  const navgation = useRouter();

  const [order, setOrder] = useState([]);

  const { orderDetails, setOrderDetailse } = useOrder();
  const [sentData, setSentData] = useState(false);
  const [loaing, setLoading] = useState(false);

  const [addressInfo, setAddressInfo] = useState({
    phone: "",
    address: "",
    city: "",
    cuntry: "",
  });

  useEffect(() => {
    setOrder(JSON.parse(localStorage.getItem("cart")));
  }, []);

  function handelSumPrice(orders) {
    let sum = 0;
    for (let i = 0; i < orders?.length; i++) {
      sum += orders[i].price * orders[i].quantity;
    }
    return sum;
  }

  const handelTotalprice = (delevery) => {
    return handelSumPrice(order) + delevery;
  };

  const handelDelevery = async () => {
    if (
      addressInfo.phone === "" ||
      addressInfo.address === "" ||
      addressInfo.city === "" ||
      addressInfo.cuntry === ""
    ) {
      alert("Please fill all the fields");
      return;
    }
    const filteredOrders = order.map((item) => ({
      id: item.id,
      quantity: item.quantity,
      color: item.color,
      size: item.size,
    }));

    console.log(filteredOrders);

    const finalorder = {
      user_id: JSON.parse(localStorage.getItem("user")).id,
      ...orderDetails,
      items: [...filteredOrders],
      phone: addressInfo.phone,
      address: `${addressInfo.address} ${addressInfo.city} ${addressInfo.cuntry}`,
    };
    console.log("finsalorder", finalorder);
    setLoading(true);
    try {
      const respose = await axios.post(
        "http://161.97.169.6:4000/order",
        finalorder,

        {
          headers: {
            "Content-Type": "application/json",
            authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      console.log("reaponse", respose.data);
      setLoading(false);
      setTimeout(() => {
        setSentData(true);
        navgation.push("/home");
      }, 2000);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      <div className="w-full relative h-full flex justify-center">
        <div className="flex pb-32 w-full h-full  items-center flex-col">
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
          {sentData && (
            <div
              onClick={() => setSentData(false)}
              className="fixed inset-0 flex justify-center items-center z-50 bg-black/30"
            >
              <div className="w-[400px] h-[300px] bg-[#F2F2F2] flex flex-col  gap-10 justify-center items-center rounded-lg shadow-lg">
                <Done />

                <p>Payment done successfully.</p>
              </div>
            </div>
          )}

          <Container>
            <div className="w-full h-full flex mt-3 flex-col pb-3 border-b-2 border-[#d0cece] gap-3 items-center">
              <div className="w-full text-[#a8a8a9]  h-full flex  items-center justify-between">
                <h1 className="text-xl">Order</h1>
                <h1 className="text-xl">${handelSumPrice(order)}</h1>
              </div>
              <div className="w-full text-[#a8a8a9]  h-full flex  items-center justify-between">
                <h1 className="text-xl">Shipping</h1>
                <h1 className="text-xl">$30</h1>
              </div>

              <div className="w-full text-[#414141] h-full flex  items-center justify-between">
                <h1 className="text-xl">Total</h1>
                <h1 className="text-xl">${handelTotalprice(30)}</h1>
              </div>
            </div>
          </Container>

          <Container>
            <div className="w-full h-full flex mt-3 flex-col pb-3  gap-3 items-start">
              <h1 className="text-xl font-bold">Address Details</h1>

              <div className="w-full h-full flex flex-col items-center gap-6">
                <div className="w-full h-[100px] items-start gap-3 flex flex-col">
                  <h1>Address</h1>
                  <input
                    onChange={(e) => {
                      setAddressInfo({
                        ...addressInfo,
                        address: e.target.value,
                      });
                    }}
                    className="w-full h-[70px] !border-2 !border-[#cdcdcd] rounded-lg"
                    type="text"
                    placeholder="Address"
                  />
                </div>

                <div className="w-full h-[100px] items-start gap-3 flex flex-col">
                  <h1>phone number</h1>
                  <input
                    onChange={(e) => {
                      setAddressInfo({
                        ...addressInfo,
                        phone: e.target.value,
                      });
                    }}
                    className="w-full h-[70px] !border-2 !border-[#cdcdcd] rounded-lg"
                    type="text"
                    placeholder="phone"
                  />
                </div>

                <div className="w-full h-[100px] items-start gap-3 flex flex-col">
                  <h1>City</h1>
                  <input
                    onChange={(e) => {
                      setAddressInfo({
                        ...addressInfo,
                        city: e.target.value,
                      });
                    }}
                    className="w-full h-[70px] !border-2 !border-[#cdcdcd] rounded-lg"
                    type="text"
                    placeholder="City"
                  />
                </div>

                <div className="w-full h-[100px] items-start gap-3 flex flex-col">
                  <h1>Cuntry</h1>
                  <input
                    onChange={(e) => {
                      setAddressInfo({
                        ...addressInfo,
                        cuntry: e.target.value,
                      });
                    }}
                    className="w-full h-[70px] !border-2 !border-[#cdcdcd] rounded-lg"
                    type="text"
                    placeholder="Cuntry"
                  />
                </div>

                <Button
                  onClick={handelDelevery}
                  className="custom-btn"
                  type="primary"
                  style={{
                    backgroundColor: "#ff5373",
                  }}
                >
                  continue <Spin spinning={loaing} />
                </Button>
              </div>
            </div>
          </Container>
        </div>
      </div>
    </>
  );
};

export default Order;
