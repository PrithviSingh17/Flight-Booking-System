import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:5000/api",
});

API.interceptors.request.use((config) => {
  const token = sessionStorage.getItem("token");
  console.log("🔹 Token Sent in API Request:", token); // Debug log
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  } else {
    console.error("❌ No token found in sessionStorage!");
  }
  return config;
});

export default API;
