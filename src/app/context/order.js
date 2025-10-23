"use client";
import { createContext, use, useContext } from "react";
import { useState } from "react";
export const OrderContext = createContext();

export const OrderProvider = ({ children }) => {
  const [chartLegnth, setChartLegnth] = useState(0);
  const [orderDetails, setOrderDetailse] = useState([]);
  const [voucherId, setVoucherId] = useState(null);

  return (
    <OrderContext.Provider
      value={{ orderDetails, setOrderDetailse, chartLegnth, setChartLegnth }}
    >
      {children}
    </OrderContext.Provider>
  );
};

export const useOrder = () => useContext(OrderContext);
