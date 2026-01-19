import axiosClient from "./axiosClient";

export default {
  getInventory: () => axiosClient.get("/books/view"),
  getLowStock: () => axiosClient.get("/inventory/low-stock/"),
};
