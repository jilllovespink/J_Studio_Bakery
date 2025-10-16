import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL + "/api",
  withCredentials: true, // 允許攜帶 cookie
  headers: {
    "Content-Type": "application/json",
  },
});

export default api;
