/* eslint-disable @typescript-eslint/no-explicit-any */
import axios, { AxiosInstance, AxiosResponse, AxiosError } from "axios";
import { authUtils, tokenStorage } from "./cookies";

// API Configuration
const API_BASE_URL = "https://interior-be.onrender.com/api/v1";

// Create axios instance
const apiClient: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000, // 30 seconds
  headers: {
    "Content-Type": "application/json",
  },
});

// Auth context integration
let authContextLogout: (() => void) | null = null;
let authContextRefreshToken: ((tokens: any) => void) | null = null;

// Function to set auth context methods (called from AuthProvider)
export const setAuthContextMethods = (
  logout: () => void,
  refreshToken: (tokens: any) => void
) => {
  authContextLogout = logout;
  authContextRefreshToken = refreshToken;
};

// Function to refresh token
const refreshAuthToken = async (): Promise<string | null> => {
  const refreshToken = tokenStorage.getRefreshToken();
  if (!refreshToken) {
    return null;
  }

  try {
    const response = await axios.post(`${API_BASE_URL}/auth/refresh`, {
      refreshToken: refreshToken,
    });

    if (response.data.success) {
      const newTokens = response.data.data;

      // Update cookies
      tokenStorage.setTokens(newTokens);

      // Update context if available
      if (authContextRefreshToken) {
        authContextRefreshToken(newTokens);
      }

      return newTokens.token;
    }
  } catch (error) {
    console.error("Failed to refresh token:", error);
    // If refresh fails, logout
    if (authContextLogout) {
      authContextLogout();
    } else {
      // Fallback cleanup
      tokenStorage.clearTokens();
      window.location.href = "/auth/signin";
    }
  }

  return null;
};

// Request interceptor to add auth token
apiClient.interceptors.request.use(
  async (config) => {
    let token = tokenStorage.getAccessToken();

    // Check if token exists and is expired
    if (token && authUtils.isTokenExpired(token)) {
      console.log("Token expired, attempting to refresh...");
      token = await refreshAuthToken();
    }

    // Attach token to request
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
apiClient.interceptors.response.use(
  (response: AxiosResponse) => {
    return response;
  },
  async (error: AxiosError) => {
    const originalRequest = error.config as any;

    // Handle 401 errors (unauthorized)
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      // Try to refresh token
      const newToken = await refreshAuthToken();

      if (newToken && originalRequest) {
        // Retry the original request with new token
        originalRequest.headers.Authorization = `Bearer ${newToken}`;
        return apiClient(originalRequest);
      } else {
        // Refresh failed, logout user
        if (authContextLogout) {
          authContextLogout();
        } else {
          // Fallback cleanup
          tokenStorage.clearTokens();
          window.location.href = "/auth/signin";
        }
      }
    }

    // Handle 429 errors (rate limiting)
    if (error.response?.status === 429) {
      console.warn("Rate limit exceeded. Please try again later.");
    }

    // Handle 403 errors (forbidden)
    if (error.response?.status === 403) {
      console.warn(
        "Access forbidden. You may not have permission for this action."
      );
    }

    return Promise.reject(error);
  }
);

// Function to manually set token
export const setAuthToken = (token?: string) => {
  const actualToken = token || tokenStorage.getAccessToken();
  if (actualToken) {
    apiClient.defaults.headers.common[
      "Authorization"
    ] = `Bearer ${actualToken}`;
  }
};

// Export a function to clear auth token
export const clearAuthToken = () => {
  delete apiClient.defaults.headers.common["Authorization"];
  tokenStorage.clearTokens();
};

export default apiClient;
