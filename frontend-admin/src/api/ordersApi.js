import axiosClient from "./axiosClient";

export default {
  getPurchaseOrders: () => axiosClient.get("/cart/admin/purchase/"),
  getRentalOrders: () => axiosClient.get("/cart/admin/rental/"),

  cancelPurchase: (id) => axiosClient.post(`/cart/purchase/remove/${id}/`),
  cancelRental: (id) => axiosClient.post(`/cart/rental/remove/${id}/`),
  refundPurchase: (id) => axiosClient.post(`/orders/purchases/${id}/refund/`),

  markReturned: (id) => axiosClient.post(`/orders/rentals/${id}/return/`),
};
