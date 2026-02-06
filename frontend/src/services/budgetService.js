import API from "./api";

export const getBudgetSummary = async (month, year) => {
  const res = await API.get(`/budget/summary?month=${month}&year=${year}`);
  return res.data;
};
