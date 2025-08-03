import React, { useMemo } from "react";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
} from "recharts";

// Helper: format timestamp to YYYY-MM-DD
const formatDate = (timestamp) => {
  const date = new Date(timestamp);
  return date.toISOString().split("T")[0];
};

const LogsChart = ({ logs }) => {
  // Aggregate counts by date
  const chartData = useMemo(() => {
    const countByDate = {};

    logs.forEach((log) => {
      const date = formatDate(log.timestamp);
      countByDate[date] = (countByDate[date] || 0) + 1;
    });

    return Object.entries(countByDate)
      .map(([date, count]) => ({ date, count }))
      .sort((a, b) => new Date(a.date) - new Date(b.date));
  }, [logs]);

  return (
    <div style={{ width: "100%", height: 400 }}>
      <ResponsiveContainer>
        <LineChart data={chartData}>
          <Line type="monotone" dataKey="count" stroke="#8884d8" strokeWidth={2} />
          <CartesianGrid stroke="#ccc" />
          <XAxis dataKey="date" />
          <YAxis allowDecimals={false} />
          <Tooltip />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default LogsChart;
