import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";

function MonthlyLineChart({ data }) {
  const chartData = Object.keys(data || {}).map((key) => ({
    month: key,
    amount: data[key],
  }));

  if (chartData.length === 0) {
    return (
      <div style={{ padding: "40px", textAlign: "center", color: "#6b7280" }}>
        No expense data available. Add some transactions to see the chart!
      </div>
    );
  }

  return (
    <LineChart width={500} height={300} data={chartData}>
      <CartesianGrid strokeDasharray="3 3" />
      <XAxis dataKey="month" />
      <YAxis />
      <Tooltip />
      <Line type="monotone" dataKey="amount" stroke="#8884d8" />
    </LineChart>
  );
}

export default MonthlyLineChart;
