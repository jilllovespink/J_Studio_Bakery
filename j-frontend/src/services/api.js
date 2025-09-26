import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:3000/api", // 後端 API 入口
  withCredentials: true, // 允許攜帶 cookie
});

export default api;
