import API from "./api";

export const getCategorySummary = async () => {
  const res = await API.get("/transactions/category-summary");
  return res.data;
};
