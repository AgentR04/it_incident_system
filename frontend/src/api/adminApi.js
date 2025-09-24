import http from "./http";

export const getKafkaStatus = () => http.get("/api/admin/kafka/status");
export const enableIngestion = () => http.post("/api/admin/kafka/ingestion/enable");
export const disableIngestion = () => http.post("/api/admin/kafka/ingestion/disable");
export const getHealth = () => http.get("/actuator/health");

const adminApi = { getKafkaStatus, enableIngestion, disableIngestion, getHealth };
export default adminApi;
