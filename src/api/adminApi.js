import axiosClient from "./axiosClient";

export const getAdminSummary = () => {
  return axiosClient.get("/dashboard/summary");
};

export const getAdminProperties = (status = "") => {
  return axiosClient.get(
    `/properties/admin/all${status ? `?status=${status}` : ""}`
  );
};

export const gePropertiesDetials = (propertyId) => {
  return axiosClient.get(`/properties/${propertyId}`);
};

export const approveProperty = (propertyId, adminRemarks = "") => {
  return axiosClient.put(
    `/properties/${propertyId}/approve`,
    { adminRemarks }
  );
};

export const rejectProperty = (propertyId, adminRemarks = "") => {
  return axiosClient.put(
    `/properties/${propertyId}/reject`,
    { adminRemarks }
  );
};

export const getPendingAgents = () => {
  return axiosClient.get("/auth/admin/pending-agents");
};

export const approveAgent = (agentId, assignedArea) => {
  return axiosClient.put(
    `/auth/admin/approve-agent/${agentId}`,
    { assignedArea }
  );
};

export const rejectAgent = (agentId) => {
  return axiosClient.put(`/auth/admin/reject-agent/${agentId}`);
};

export const getAllPropertyOwners = () => {
  return axiosClient.get("/auth/admin/property-owners");
};

export const getAllTenants = () => {
  return axiosClient.get("/auth/admin/tenants");
};

export const updateUserAccountStatus = (userId, status) => {
  return axiosClient.put(
    `/auth/admin/users/${userId}/status`,
    { status }
  );
};