"use client";
import { PieChart, Pie, Cell, Tooltip, Legend } from "recharts";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import axios from "axios";

const COLORS = [
  "#00CED1", // Dark Turquoise (Accent)
  "#6A5ACD", // Slate Blue
  "#3CB371", // Medium Sea Green
  "#FFD700", // Gold
  "#FF69B4", // Hot Pink
  "#FF8C00", // Dark Orange
];

const DonutChart = () => {
  const [data, setData] = useState();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_BASE_URL}/api/admin/users/subscriptions`,
          {
            withCredentials: true,
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        if (response.status === 200) {
          console.log(response.data);
          setData(response.data);
        }
      } catch (error) {
        console.log(error);
        toast.error(error?.response?.data?.message || "Something went wrong!");
      }
    };
    fetchData();
  }, []);

  const chartData = data
    ? Object.entries(data).map(([name, value]) => ({
        name,
        value,
      }))
    : [];

  const renderCustomLabel = ({
    cx,
    cy,
    midAngle,
    innerRadius,
    outerRadius,
    percent,
  }) => {
    const RADIAN = Math.PI / 180;
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);

    return (
      <text
        x={x}
        y={y}
        fill="#fff"
        textAnchor="middle"
        dominantBaseline="central"
        fontSize={14}
        fontWeight="bold"
      >
        {(percent * 100).toFixed(0)}%
      </text>
    );
  };

  return (
    <div>
      <h2 className="relative text-accent font-bold lg:text-3xl text-xl font-semibold mb-4 text-center">
        Total User Per Subscription
      </h2>

      <div className="w-full flex justify-center">
        <PieChart width={400} height={320}>
          <Pie
            data={chartData}
            cx="50%"
            cy="50%"
            innerRadius={90}
            outerRadius={130}
            fill="#8884d8"
            paddingAngle={3}
            label={renderCustomLabel}
            labelLine={false}
            dataKey="value"
          >
            {chartData.map((entry, index) => (
              <Cell
                key={`cell-${index}`}
                fill={COLORS[index % COLORS.length]}
                stroke=""
                strokeWidth={2}
              />
            ))}
          </Pie>
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
            layout="horizontal"
            verticalAlign="bottom"
            align="left"
            wrapperStyle={{
              paddingLeft: 20,
              lineHeight: "24px",
              fontSize: "16px",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              flexDirection: "row",
              flexWrap: "wrap",
              width: "100%",
            }}
          />
        </PieChart>
      </div>
    </div>
  );
};

export default DonutChart;
