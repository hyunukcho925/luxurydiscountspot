"use client";

import React from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  TooltipProps
} from "recharts";

const data = [
  { date: "1월", price: 3500000 },
  { date: "2월", price: 3400000 },
  { date: "3월", price: 3600000 },
  { date: "4월", price: 3300000 },
  { date: "5월", price: 3288000 },
];

const CustomTooltip: React.FC<TooltipProps<number, string>> = ({ 
  active, 
  payload, 
  label 
}) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white p-2 border border-gray-200 rounded shadow">
        <p className="text-sm font-semibold">{`${label}`}</p>
        <p className="text-sm text-primary">{`${payload[0].value?.toLocaleString()}원`}</p>
      </div>
    );
  }
  return null;
};

const PriceHistoryChart: React.FC = () => {
  return (
    <ResponsiveContainer width="100%" height={250}>
      <LineChart data={data} margin={{ top: 10, right: 20, bottom: 10, left: 0 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
        <XAxis 
          dataKey="date" 
          axisLine={false} 
          tickLine={false}
          tick={{ fill: '#666', fontSize: 12 }}
        />
        <YAxis 
          tickFormatter={(value) => `${(value / 10000).toFixed(0)}만원`} 
          axisLine={false} 
          tickLine={false}
          tick={{ fill: '#666', fontSize: 12 }}
          domain={['dataMin - 100000', 'dataMax + 100000']}
        />
        <Tooltip content={<CustomTooltip />} />
        <Line
          type="monotone"
          dataKey="price"
          stroke="#22c55e"
          strokeWidth={3}
          dot={{ fill: "#22c55e", strokeWidth: 1, r: 4 }}
          activeDot={{ r: 6, fill: "#22c55e", stroke: "#fff", strokeWidth: 2 }}
        />
      </LineChart>
    </ResponsiveContainer>
  );
};

export default PriceHistoryChart;
