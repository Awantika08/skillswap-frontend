"use client";

import axios from "axios";
import Cookies from "js-cookie";

// Create Axios instance with baseURL from .env
const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
});

api.interceptors.request.use(
  (config) => {
    const token = Cookies.get("token");

    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error),
);

// RESPONSE INTERCEPTOR → Handle expired token + refresh
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // If unauthorized (401) and we have a refresh token
    if (
      error.response?.status === 401 &&
      !originalRequest._retry &&
      Cookies.get("refreshToken")
    ) {
      originalRequest._retry = true;

      try {
        const refreshToken = Cookies.get("refreshToken");

        const res = await axios.post(
          `${process.env.NEXT_PUBLIC_API_URL}/auth/refresh-token`,
          { refreshToken },
          {
            headers: {
              "Content-Type": "application/json",
            },
          },
        );

        const { token, refreshToken: newRefresh } = res.data;

        // Update tokens in cookies
        Cookies.set("token", token, {
          expires: 7,
          secure: true,
          sameSite: "strict",
        });
        Cookies.set("refreshToken", newRefresh, {
          expires: 7,
          secure: true,
          sameSite: "strict",
        });

        // Update header and retry failed request
        originalRequest.headers.Authorization = `Bearer ${token}`;
        return api(originalRequest);
      } catch (refreshError) {
        console.error("Token refresh failed:", refreshError);

        // Clear cookies and redirect to login
        Cookies.remove("token");
        Cookies.remove("refreshToken");
        Cookies.remove("user");

        if (typeof window !== "undefined") {
          window.location.href = "/login";
        }
      }
    }

    return Promise.reject(error);
  },
);

export default api;
