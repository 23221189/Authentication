import axiosClient from "./axiosClient";

export const submitComplaint = (data) => axiosClient.post("/complaints", data);

export const getAllComplaints = () => axiosClient.get("/complaints");

export const respondToComplaint = (complaintId, response) =>
  axiosClient.put(`/complaints/${complaintId}/respond`, { response });

export const updateComplaintStatus = (complaintId, status) =>
  axiosClient.put(`/complaints/${complaintId}/status`, { status });
