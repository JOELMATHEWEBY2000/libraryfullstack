// src/api/reviewsApi.js
import axiosClient from "./axiosClient";

export const getBookReviews = (bookId) =>
  axiosClient.get(`/reviews/view/${bookId}/`);

export const addBookReview = (bookId, data) =>
  axiosClient.post(`/reviews/view/${bookId}/`, data);
