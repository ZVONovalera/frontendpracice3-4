import axios from "axios";

const apiClient = axios.create({
  baseURL: "http://localhost:3000/api",
  headers: {
    "Content-Type": "application/json",
    accept: "application/json",
  },
  withCredentials: true,
});

// Получение токена из localStorage
const getAccessToken = () => localStorage.getItem("accessToken");

// Интерсептор для добавления токена
apiClient.interceptors.request.use(
  (config) => {
    const token = getAccessToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Интерсептор для обновления токена при 401
apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const response = await axios.post(
          "http://localhost:3000/api/auth/refresh",
          {},
          { withCredentials: true }
        );

        const { accessToken } = response.data;
        localStorage.setItem("accessToken", accessToken);

        originalRequest.headers.Authorization = `Bearer ${accessToken}`;
        return apiClient(originalRequest);
      } catch (refreshError) {
        localStorage.removeItem("accessToken");
        window.location.href = "/login";
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

// API функции
export const api = {
  // Auth
  register: async (username, password) => {
    const response = await axios.post(
      "http://localhost:3000/api/auth/register",
      { username, password }
    );
    return response.data;
  },

  login: async (username, password) => {
    const response = await axios.post(
      "http://localhost:3000/api/auth/login",
      { username, password },
      { withCredentials: true }
    );
    const { accessToken } = response.data;
    localStorage.setItem("accessToken", accessToken);
    return response.data;
  },

  getMe: async () => {
    const response = await apiClient.get("/auth/me");
    return response.data;
  },

  logout: async () => {
    try {
      await axios.post(
        "http://localhost:3000/api/auth/logout",
        {},
        { withCredentials: true }
      );
    } catch (err) {
      console.error("Logout error:", err);
    }
    localStorage.removeItem("accessToken");
  },

  // Users (только для администратора)
  getUsers: async () => {
    const response = await apiClient.get("/users");
    return response.data;
  },

  getUserById: async (id) => {
    const response = await apiClient.get(`/users/${id}`);
    return response.data;
  },

  updateUser: async (id, userData) => {
    const response = await apiClient.put(`/users/${id}`, userData);
    return response.data;
  },

  blockUser: async (id) => {
    const response = await apiClient.delete(`/users/${id}`);
    return response.data;
  },

  // Товары
  createItem: async (item) => {
    const response = await apiClient.post("/products", item);
    return response.data;
  },

  getGoods: async () => {
    const response = await apiClient.get("/products");
    return response.data;
  },

  getItemById: async (id) => {
    const response = await apiClient.get(`/products/${id}`);
    return response.data;
  },

  updateItem: async (id, item) => {
    const response = await apiClient.put(`/products/${id}`, item);
    return response.data;
  },

  deleteItem: async (id) => {
    const response = await apiClient.delete(`/products/${id}`);
    return response.data;
  },
};