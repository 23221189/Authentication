import axiosClient from "./axiosClient";
export const initiatePayment  = (bookingId)=>axiosClient.post("/payment/initiate",{bookingId});
export const selectCashOnArrival = (bookingId)=>axiosClient.post("/payment/cash-on-arrival",{bookingId});
export const getMyPayment = ()=> axiosClient.get("/payment/mine");
export const recordCashPayment = (bookingId)=>axiosClient.post("/payment/cash",{bookingId});
export const getOwnerPayment = ()=>axiosClient.get("/payment/owner/mine");
export const getPaymentById = (paymentId)=>axiosClient.get(`/payment/${paymentId}`);
export const refundPayment = (paymentId, refundAmount)=>axiosClient.put(`/payment/${paymentId}/refund`,{refundAmount});

export const getAllPayments = () => axiosClient.get("/payment/admin/all");

export const getMyAgentCommissions = () => axiosClient.get("/payment/agent/mine");
export const getAllAgentCommissions = () => axiosClient.get("/payment/agent/admin/all");
export const markCommissionPaid = (id, file, notes) => {
  const formData = new FormData();
  formData.append("transferProof", file);
  if (notes) formData.append("notes", notes);
  return axiosClient.put(`/payment/agent/${id}/pay`, formData);
};
export const transfer = (id, file)=>{
const formData = new FormData();
formData.append("transferProof",file);
return axiosClient.put(`/payment/${id}/transfer`,formData);
}