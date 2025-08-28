// src/components/DiameterChart.jsx
import React from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

export function DiameterChart({ data }) {
  if (data.length === 0) return null;

  return (
    <div className="bg-secondary bg-opacity-10 p-3 rounded mb-4 shadow border border-secondary">
      <h5 className="text-center text-info mb-3">
        Diámetros Promedio de Asteroides Visibles (km)
      </h5>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart
          data={data}
          margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
        >
          <XAxis dataKey="name" stroke="#FFC107" hide={true} />
          <YAxis
            stroke="#FFFFFF"
            label={{
              value: "Diámetro (km)",
              angle: -90,
              position: "insideLeft",
              fill: "#FFFFFF",
            }}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: "#1c1e21",
              border: "1px solid #FFC107",
            }}
            formatter={(value, name, props) => [
              `${value.toFixed(3)} km`,
              props.payload.name,
            ]}
          />
          <Bar dataKey="diameter" fill="#17A2B8" name="Diámetro Promedio" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
