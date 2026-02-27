import axios from "axios";
import { authStore } from "../stores/authStore";

const api = axios.create({
  baseURL: "http://localhost:8000",
  withCredentials: true,
});

api.interceptors.request.use((config) => {
  const token = authStore.getState().accessToken;
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (res) => res,
  async (error) => {
    const originalRequest = error.config;

    // prevent infinite loop
    if (originalRequest._retry) {
      return Promise.reject(error);
    }

    if (error.response?.status === 401) {
      originalRequest._retry = true;

      try {
        const refreshRes = await api.post("/auth/refresh");

        // 🔴 THIS WAS MISSING
        authStore.getState().setAuth(
          authStore.getState().user,
          refreshRes.data.access_token
        );

       
        originalRequest.headers.Authorization =
          `Bearer ${refreshRes.data.access_token}`;

        return api(originalRequest);
      } catch {
        authStore.getState().setUnauthenticated();
        window.location.href = "/login";
      }
    }

    return Promise.reject(error);
  }
);

export default api;
