import API from "./api";

export const createSavingsGoal = async (data) => {
  const response = await API.post("/savings-goals", data);
  return response.data;
};

export const getSavingsGoals = async () => {
  const response = await API.get("/savings-goals");
  return response.data;
};

export const updateSavingsGoal = async (id, data) => {
  const response = await API.put(`/savings-goals/${id}`, data);
  return response.data;
};

export const deleteSavingsGoal = async (id) => {
  const response = await API.delete(`/savings-goals/${id}`);
  return response.data;
};

export const addToSavingsGoal = async (id, amount) => {
  const response = await API.post(`/savings-goals/${id}/add`, { amount });
  return response.data;
};

