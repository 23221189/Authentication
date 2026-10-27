import axiosClient from "./axiosClient.js";

export const getNotificationApi = async () => {
  const response = await axiosClient.get("/notifications");
  return response.data;
};

export const getUnreadCountApi = async () => {
  const response = await axiosClient.get("/notifications/unread-count");
  return response.data;
};

export const markAsReadApi = async (id) => {
  const response = await axiosClient.patch(`/notifications/${id}/read`);
  return response.data;
};

export const markAllReadApi = async () => {
  const response = await axiosClient.patch("/notifications/read-all");
  return response.data;
};

export const deleteNotificationApi = async (id) => {
  const response = await axiosClient.delete(`/notifications/${id}`);
  return response.data;
};

export const clearAllNotificationsApi = async () => {
  const response = await axiosClient.delete("/notifications/clear-all");
  return response.data;
};

export const subscribePushApi = async (subcription)=>{
  const response = await axiosClient.post("/notifications/subscribe",subcription);
  return response.data;
};
export const unsubscribePushApi = async (endpoint)=>{
  const response = await axiosClient.post("/notifications/subscribe",{endpoint});
  return response.data;
};
