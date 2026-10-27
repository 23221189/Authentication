import axiosClient from "./axiosClient";

export const getMyBookings = () => axiosClient.get("/bookings");

export const updateBookingStatus = (bookingId, status) =>
  axiosClient.put(`/bookings/${bookingId}/status`, { status });

export const createBooking = (bookingData) =>
  axiosClient.post("/bookings", bookingData);

export const getBookingById = (bookingId) =>
  axiosClient.get(`/bookings/${bookingId}`);

export const modifyBooking = (bookingId, { moveInDate, moveOutDate }) =>
  axiosClient.put(`/bookings/${bookingId}`, { moveInDate, moveOutDate });

export const cancelBooking = (bookingId) =>
  axiosClient.put(`/bookings/${bookingId}/cancel`);