import http from "./http";
const API_BASE_URL = "/api/incidents";

// 🔹 Get all incidents
export const getAllIncidents = () => http.get(API_BASE_URL);

// 🔹 Get incident by ID
export const getIncidentById = (id) => http.get(`${API_BASE_URL}/${id}`);

// 🔹 Create new incident
export const createIncident = (incident) => http.post(API_BASE_URL, incident);

// 🔹 Update incident
export const updateIncident = (id, incident) =>
  http.put(`${API_BASE_URL}/${id}`, incident);

// 🔹 Delete incident
export const deleteIncident = (id) => http.delete(`${API_BASE_URL}/${id}`);

// 🔹 Search incidents
export const searchIncidents = (params) =>
  http.get(`${API_BASE_URL}/search`, { params });

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
