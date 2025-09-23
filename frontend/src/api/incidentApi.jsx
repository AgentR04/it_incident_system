import axios from "axios";

const API_BASE_URL = "http://localhost:8080/api/incidents";

// Encode "admin:admin123" to Base64 → Basic YWRtaW46YWRtaW4xMjM=
const AUTH_HEADER = "Basic " + btoa("admin:admin123");

const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    Authorization: AUTH_HEADER,
    "Content-Type": "application/json",
  },
});

// 🔹 Get all incidents
export const getAllIncidents = () => axiosInstance.get("/");

// 🔹 Get incident by ID
export const getIncidentById = (id) => axiosInstance.get(`/${id}`);

// 🔹 Create new incident
export const createIncident = (incident) => axiosInstance.post("/", incident);

// 🔹 Update incident
export const updateIncident = (id, incident) =>
  axiosInstance.put(`/${id}`, incident);

// 🔹 Delete incident
export const deleteIncident = (id) => axiosInstance.delete(`/${id}`);

// 🔹 Search incidents
export const searchIncidents = (params) =>
  axiosInstance.get("/search", { params });

// 🔹 Default export for easy import
const incidentApi = {
  getAllIncidents,
  getIncidentById,
  createIncident,
  updateIncident,
  deleteIncident,
  searchIncidents,
};

export default incidentApi;
