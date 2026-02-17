import axios from "axios";
const apiClient = axios.create({ //axios клент для I/O запросов
  baseURL: "http://localhost:3000/api",
  headers: {
    "Content-Type": "application/json",
    accept: "application/json",
  },
});
export const api = { 
  createItem: async (item) => {
    let response = await apiClient.post("/goods", item);
    return response.data;
  },
  getGoods: async () => {
    let response = await apiClient.get("/goods");
    return response.data;
  },
  getItemById: async (id) => {
    let response = await apiClient.get(`/goods/${id}`);
    return response.data;
  },
  updateItem: async (id, item) => {
    let response = await apiClient.patch(`/goods/${id}`, item);
    return response.data;
  },
  deleteItem: async (id) => {
    let response = await apiClient.delete(`/goods/${id}`);
    return response.data;
  },
};
