import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";

function MonthlyLineChart({ data }) {
  const chartData = Object.keys(data).map((key) => ({
    month: key,
    amount: data[key],
  }));

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
