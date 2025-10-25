import axios from "axios";

const API_BASE_URL = "http://127.0.0.1:8000/api";

export const getCampaigns = () => axios.get(`${API_BASE_URL}/campaigns/`);
export const createCampaign = (data) => axios.post(`${API_BASE_URL}/campaigns/`, data);

export const getRecipients = () => axios.get(`${API_BASE_URL}/recipients/`);
export const uploadRecipients = (formData) =>
  axios.post(`${API_BASE_URL}/recipients/upload/`, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });

export const getCampaignLogs = (id) =>
  axios.get(`${API_BASE_URL}/campaigns/${id}/logs/`);

export const startCampaign = (id) => axios.post(`${API_BASE_URL}/campaigns/${id}/start/`);

export const pauseCampaign = (id) => axios.post(`${API_BASE_URL}/campaigns/${id}/pause/`);
export const resumeCampaign = (id) => axios.post(`${API_BASE_URL}/campaigns/${id}/resume/`);
export const cancelCampaign = (id) => axios.post(`${API_BASE_URL}/campaigns/${id}/cancel/`);
