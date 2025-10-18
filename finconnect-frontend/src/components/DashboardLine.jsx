"use client";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import { useEffect, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { useContext } from "react";
import { UserContext } from "../context/Context";

const monthMapping = {
  January: "01",
  February: "02",
  March: "03",
  April: "04",
  May: "05",
  June: "06",
  July: "07",
  August: "08",
  September: "09",
  October: "10",
  November: "11",
  December: "12",
};

const RevenueTrendChart = () => {
  const [selectedMonth, setSelectedMonth] = useState("01"); // Store month as numeric
  const [monthName, setMonthName] = useState("January"); // Display month name
  const [rawData, setRawData] = useState([]);
  const { user, isAdmin } = useContext(UserContext);
  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchData = async () => {
      if (isAdmin) {
        try{
          const response = await axios.get(
            `${import.meta.env.VITE_BASE_URL}/api/admin/getTransactions?month=2025-${selectedMonth}`,
            { withCredentials: true , headers: { "Authorization": `Bearer ${token}` } }
          );
          if (response.status === 200) {
            console.log(response.data);
            return setRawData(response.data);
          }
        }catch(err){
          console.log(err);
          return toast.error(err?.response?.data?.message || "Something went wrong!");
        }
      }else{

      }

      try {
        const response = await axios.get(
          `${
            import.meta.env.VITE_BASE_URL
          }/api/dashboard/getTransactionByDay?userId=${
            user?.accountNumber
          }&month=2025-${selectedMonth}`,
          { withCredentials: true },
          { headers: { "Authorization": `Bearer ${token}` } }
        );
        if (response.status === 200) {
          console.log(response.data);
          setRawData(response.data);
        }
      } catch (err) {
        console.log(err)
      }
    };
    console.log(selectedMonth);
    fetchData();
  }, [selectedMonth]);

  const allDays = Array.from({ length: 31 }, (_, i) => `${i + 1}`);

  const creditMap = Object.fromEntries(
    (rawData?.credit || []).map((entry) => [entry.day, entry.revenue])
  );

  const debitMap = Object.fromEntries(
    (rawData?.debit || []).map((entry) => [entry.day, entry.revenue])
  );

  const mergedData = allDays.map((day) => ({
    day,
    credit: creditMap[day] ?? null,
    debit: debitMap[day] ?? null,
  }));

  const handleMonthChange = (e) => {
    const month = e.target.value;
    setMonthName(month);
    setSelectedMonth(monthMapping[month]);
  };

  return (
    <div className="bg-transparent pb-12 pt-4 border border-accent px-4 rounded-xl w-full md:h-[29rem] relative">
      <div className="absolute top-4 left-4 md:w-48 sm:w-30 w-20">
        <select
          value={monthName}
          onChange={handleMonthChange} // Handle the month selection change
          className="w-full bg-[#1a1c1ff8] border border-accent text-textPrimary px-4 py-2 rounded-lg shadow-sm focus:outline-none focus:ring-1 focus:ring-accent"
        >
          {Object.keys(monthMapping).map((month) => (
            <option key={month} value={month}>
              {month}
            </option>
          ))}
        </select>
      </div>

      <h2 className="text-accent lg:text-3xl text-xl font-bold mb-4 text-center">
        Transaction Trend
      </h2>

      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={mergedData}>
          <CartesianGrid strokeDasharray="3 3" stroke="#444" />
          <XAxis dataKey="day" stroke="#ccc" />
          <YAxis stroke="#ccc" />
          <Tooltip
            contentStyle={{
              backgroundColor: "#1f2937",
              border: "none",
              color: "#fff",
            }}
            labelStyle={{ color: "#ccc" }}
            itemStyle={{ color: "#fff" }}
          />
          <Legend
            verticalAlign="top"
            align="right"
            wrapperStyle={{ paddingBottom: 20 }}
          />
          <Line
            type="monotone"
            dataKey="debit"
            name="Debit"
            stroke="#00CED1"
            strokeWidth={2}
            dot={{ r: 4, fill: "#00CED1" }}
            activeDot={{ r: 6, stroke: "#fff", strokeWidth: 2 }}
            connectNulls={true}
          />
          <Line
            type="monotone"
            dataKey="credit"
            name="Credit"
            stroke="#fff" // Purple-ish
            strokeWidth={2}
            dot={{ r: 4, fill: "#fff" }}
            activeDot={{ r: 6, stroke: "#00CED1", strokeWidth: 2 }}
            connectNulls={true}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default RevenueTrendChart;
