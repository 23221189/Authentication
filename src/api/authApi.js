import axiosClient from "./axiosClient";

export const registerUser = (formData) =>axiosClient.post("/auth/register", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

export const verifyEmail = (token) => axiosClient.get(`/auth/verify-email/${token}`);

export const resendVerification = (email) =>axiosClient.post("/auth/resend-verification", { email });

export const loginUser = ({ email, password, role }) =>axiosClient.post("/auth/login", { email, password, role });

export const loginAdmin = ({ email, password }) =>axiosClient.post("/auth/admin/login", { email, password });

export const forgotPassword = (email, role) =>axiosClient.post("/auth/forgot-password", { email, role });

export const resetPassword = (token, password) =>axiosClient.put(`/auth/reset-password/${token}`, { password });

export const logoutUser = () => axiosClient.post("/auth/logout");

export const applyForAgent = (formData)=> axiosClient.post("/auth/agents/apply",formData,{
  headers:{
    "Content-Type":"multipart/form-data",
  },
});
export const getAllAgents = () => axiosClient.get("/auth/admin/agents");
export const getPendingAgents = () => axiosClient.get("/auth/admin/pending-agents");
export const approveAgent = (agentId, assignedArea) =>axiosClient.put(`/auth/admin/approve-agent/${agentId}`, { assignedArea });
export const rejectAgent = (agentId) => axiosClient.put(`/auth/admin/reject-agent/${agentId}`);
export const getCurrentUser = () => axiosClient.get("/auth/me");

export const switchAccountApi = (role) => axiosClient.post("/auth/switch-account", { role });

export const changePassword = (currentPassword, newPassword) =>axiosClient.put("/auth/change-password", { currentPassword, newPassword });