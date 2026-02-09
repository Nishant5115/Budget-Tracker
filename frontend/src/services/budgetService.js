import API from "./api";

export const setBudget = async (data) => {
  const res = await API.post("/budget", data);
  return res.data;
};

export const getBudgetSummary = async (month, year) => {
  const res = await API.get(`/budget/summary?month=${month}&year=${year}`);
  return res.data;
};
