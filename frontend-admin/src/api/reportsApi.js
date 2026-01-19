import axiosClient from "./axiosClient";

export default {
  sales: () => axiosClient.get("/reports/sales/"),
  rentals: () => axiosClient.get("/reports/rentals/"),
  revenue: () => axiosClient.get("/reports/revenue/"),
  popularity: () => axiosClient.get("/reports/popularity/"),
};
