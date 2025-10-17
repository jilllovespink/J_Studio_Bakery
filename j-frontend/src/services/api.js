import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL + "/api",
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export const initGuestToken = async () => {
  if (!localStorage.getItem("token")) {
    const res = await api.get("/auth/guest");
    localStorage.setItem("token", res.data.token);
  }
};

export default api;
