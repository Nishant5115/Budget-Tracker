import API from "./api";

export const createBillReminder = async (data) => {
  const response = await API.post("/bill-reminders", data);
  return response.data;
};

export const getBillReminders = async () => {
  const response = await API.get("/bill-reminders");
  return response.data;
};

export const updateBillReminder = async (id, data) => {
  const response = await API.put(`/bill-reminders/${id}`, data);
  return response.data;
};

export const deleteBillReminder = async (id) => {
  const response = await API.delete(`/bill-reminders/${id}`);
  return response.data;
};

export const markBillAsPaid = async (id) => {
  const response = await API.post(`/bill-reminders/${id}/mark-paid`);
  return response.data;
};

