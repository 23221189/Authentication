import axiosClient from "./axiosClient";

export const getDashboardSummary = () => axiosClient.get("/dashboard/summary");

export const getOwnerProperties = () => axiosClient.get("/properties/owner/mine");

export const getOwnerBookings = () => axiosClient.get("/bookings");

export const updateBookingStatusApi = (bookingId, status) =>
  axiosClient.put(`/bookings/${bookingId}/status`, { status });

export const getOwnerReview = ()=>axiosClient.get("/reviews/owner/mine");
export const getOwnerPayment = ()=>axiosClient.get("/payment/owner/mine");