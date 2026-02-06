import API from "./api";

export const getCategorySummary = async () => {
  const res = await API.get("/transactions/category-summary");
  return res.data;
};

export const getMonthlySummary = async () => {
  const res = await API.get("/transactions/monthly-summary");
  return res.data;
};
export const getSummary = async () => {
  const res = await API.get("/transactions/summary");
  return res.data;
};

