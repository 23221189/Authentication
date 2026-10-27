import axiosClient from "./axiosClient";

export const updateProfile = (formData) => axiosClient.put("/auth/update-profile",formData,{
    headers:{"Content-Type": "multipart/form-data"},
});