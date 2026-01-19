import axiosClient from "./axiosClient";

// get all books
export const getBooks = () => axiosClient.get("/books/view/");

// get book details
export const getBookDetails = (id) => axiosClient.get(`/books/${id}/`);


