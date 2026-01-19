import axiosClient from "./axiosClient";

export default {
  getInsights: () => axiosClient.get("/dashboard/insights/"),
  getRevenueChart: () => axiosClient.get("/dashboard/revenue-chart/"),
  getPurchaseStats: () => axiosClient.get("/dashboard/purchase-stats/"),
  getLowStock: () => axiosClient.get("/dashboard/low-stock/"),
  getPendingReturns: () => axiosClient.get("/dashboard/pending-returns/"),
};
