import axiosClient from "./axiosClient";

// GET — fetch all wishlist items
export const getWishlist = () => {
  return axiosClient.get("/wishlist/");
};

// POST — toggle add/remove (works with WishlistToggleView)
export const toggleWishlist = (bookId) => {
  return axiosClient.post("/wishlist/toggle/", { book_id: bookId });
};

// POST — add using /wishlist/add/
export const addWishlistItem = (bookId) => {
  return axiosClient.post("/wishlist/add/", { book: bookId });
};

// PUT — update note + priority
export const updateWishlistItem = (id, data) => {
  return axiosClient.put(`/wishlist/update/${id}/`, data);
};

// DELETE — remove item
export const deleteWishlistItem = (id) => {
  return axiosClient.delete(`/wishlist/delete/${id}/`);
};
