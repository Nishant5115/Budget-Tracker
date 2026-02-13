import API from "./api";

/*
  REGISTER USER
*/
export const registerUser = async (userData) => {
  const res = await API.post("/auth/register", userData);
  return res.data;
};

/*
  LOGIN USER
*/
export const loginUser = async (credentials) => {
  const res = await API.post("/auth/login", credentials);
  return res.data;
};

/*
  SEND OTP
*/
export const sendOtp = async (email) => {
  const res = await API.post("/auth/send-otp", { email });
  return res.data;
};

/*
  VERIFY OTP
*/
export const verifyOtp = async ({ email, otp }) => {
  const res = await API.post("/auth/verify-otp", { email, otp });
  return res.data;
};
