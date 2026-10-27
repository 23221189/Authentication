import axiosClient from "./axiosClient";

export const getProperties = (params) => axiosClient.get("/properties", { params });

export const getPropertyById = (id) => axiosClient.get(`/properties/${id}`);

export const createPropertyListing = (formData) =>
  axiosClient.post("/properties", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });

export const getMyProperties = ()=>axiosClient.get("/properties/owner/mine");
export const getAgentProperties = () => axiosClient.get("/properties/agent/mine");
export const submitAgentVerification = (propertyId, formData) =>
  axiosClient.put(`/properties/${propertyId}/submit-verification`, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
export const updatePropertyById = (id, updates) => axiosClient.put(`/properties/${id}`, updates);

export const deletePropertyById = (id) => axiosClient.delete(`/properties/${id}`);