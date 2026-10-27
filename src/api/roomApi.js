import axiosClient from "./axiosClient";
export const createRooms = async (propertyId, rooms) => {
  const { data } = await axiosClient.post("/rooms", {
    propertyId,
    rooms,
  });
  return data;
};

export const getRoomsByProperty = async (propertyId) => {
  const { data } = await axiosClient.get(`/rooms/property/${propertyId}`);
  return data;
};

export const getAvailableRooms = async (propertyId, filters = {}) => {
  const params = new URLSearchParams();

  if (filters.category) params.append("category", filters.category);
  if (filters.acType) params.append("acType", filters.acType);

  const query = params.toString() ? `?${params.toString()}` : "";
  const { data } = await axiosClient.get(
    `/rooms/property/${propertyId}/available${query}`
  );
  return data;
};
export const getRoomById = async (roomId) => {
  const { data } = await axiosClient.get(`/rooms/${roomId}`);
  return data;
};

export const updateRoom = async (roomId, updates) => {
  const { data } = await axiosClient.put(`/rooms/${roomId}`, updates);
  return data;
};

export const deleteRoom = async (roomId) => {
  const { data } = await axiosClient.delete(`/rooms/${roomId}`);
  return data;
};

export const bookRoom = async (roomId, bookingData) => {
  const { data } = await axiosClient.post(`/rooms/${roomId}/book`, bookingData);
  return data;
};

export const unbookRoom = async (roomId) => {
  const { data } = await axiosClient.post(`/rooms/${roomId}/unbook`);
  return data;
};