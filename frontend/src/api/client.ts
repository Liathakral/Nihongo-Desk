import axios from "axios";
import { authStore } from "../stores/authStore";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
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

    if (
      error.response?.status === 401 &&
      !originalRequest._retry &&
      !originalRequest.url?.includes("/auth/refresh")
    ) {
      originalRequest._retry = true;

      try {
        const refreshRes = await api.post("/auth/refresh");

        authStore.getState().setAuth(
          authStore.getState().user,
          refreshRes.data.access_token
        );

        originalRequest.headers.Authorization =
          `Bearer ${refreshRes.data.access_token}`;

        return api(originalRequest);
      } catch {
        authStore.getState().setUnauthenticated();
        return Promise.reject(error);
      }
    }

    return Promise.reject(error);
  }
);

export default api;
