import API from "./api";

export const getCurrentUserProfile = async () => {
  const res = await API.get("/users/me");
  return res.data;
};

export const updateCurrentUserProfile = async (payload) => {
  const res = await API.put("/users/me", payload);
  return res.data;
};



