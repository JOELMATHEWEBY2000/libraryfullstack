import axiosClient from "./axiosClient";

export default {
  // ========================
  // BOOKS
  // ========================
  getBooks: () => axiosClient.get("/books/view/"),

  getBook: (id) => axiosClient.get(`/books/view/${id}/`),

  addBook: (data) =>
    axiosClient.post("/books/add/", data, {
      headers: { "Content-Type": "multipart/form-data" },
    }),

  updateBook: (id, data) =>
    axiosClient.patch(`/books/${id}/`, data, {
      headers: { "Content-Type": "multipart/form-data" },
    }),

  deleteBook: (id) => axiosClient.delete(`/books/${id}/`),
  }
