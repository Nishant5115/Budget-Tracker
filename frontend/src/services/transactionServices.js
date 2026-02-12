import API from "./api";

export const getCategorySummary = async (month, year) => {
  const query =
    month && year ? `?month=${month}&year=${year}` : "";
  const res = await API.get(`/transactions/category-summary${query}`);
  return res.data;
};

export const getMonthlySummary = async () => {
  const res = await API.get("/transactions/monthly-summary");
  return res.data;
};

export const getSummary = async (month, year) => {
  const query =
    month && year ? `?month=${month}&year=${year}` : "";
  const res = await API.get(`/transactions/summary${query}`);
  return res.data;
};

