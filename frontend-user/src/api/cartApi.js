import axiosClient from "./axiosClient";

const cartApi = {
  // =========================
  // PURCHASE CART
  // =========================

  // Get purchase cart items
  getPurchaseCart: async () => {
    const res = await axiosClient.get("/cart/purchase/");
    return res.data;
  },

  // Add to purchase cart (increase quantity)
  addToPurchaseCart: async (bookId, quantity = 1) => {
    return axiosClient.post("/cart/purchase/add/", {
      book: bookId,
      quantity: quantity,
    });
  },

  // Remove purchase item
  removePurchaseItem: async (id) => {
    return axiosClient.delete(`/cart/purchase/remove/${id}/`);
  },

  // View all purchase cart items
  getAllPurchaseCarts: async () => {
    const res = await axiosClient.get("/cart/admin/purchase/");
    return res.data;
},

  // =========================
  // RENTAL CART
  // =========================

  // Get rental cart items
  getRentalCart: async () => {
    const res = await axiosClient.get("/cart/rental/");
    return res.data;
  },

  // Add to rental cart (increase days)
  addToRentalCart: async (bookId, days = 1) => {
    return axiosClient.post("/cart/rental/add/", {
      book: bookId,
      quantity: days,
    });
  },

  // Remove rental item
  removeRentalItem: async (id) => {
    return axiosClient.delete(`/cart/rental/remove/${id}/`);
  },

  // View all rental cart items
  getAllRentalCarts:async () => {
    const res = await axiosClient.get("/cart/admin/rental/");
    return res.data;
},

    // =========================
  // CART SUMMARY (NEW)
  // =========================

  getCartSummary: async () => {
    const res = await axiosClient.get("/cart/summary/");
    return res.data;
  },
};

export default cartApi;
