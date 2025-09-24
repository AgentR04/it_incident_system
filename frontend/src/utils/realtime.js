import { Client } from "@stomp/stompjs";
// Import the browser build explicitly to avoid 'global is not defined' in Vite
import SockJS from "sockjs-client/dist/sockjs.js";

let client;
let isConnected = false;
const subscribers = new Set();

export function connectRealtime() {
  if (isConnected) return;

  client = new Client({
    webSocketFactory: () => new SockJS("http://localhost:8080/ws"),
    reconnectDelay: 3000,
    onConnect: () => {
      isConnected = true;
      client.subscribe("/topic/incidents", () => {
        // Notify all listeners that an incident update occurred
        subscribers.forEach((cb) => {
          try { cb(); } catch (e) { /* noop */ }
        });
      });
    },
    onStompError: () => {},
    onWebSocketClose: () => { isConnected = false; }
  });

  client.activate();
}

export function subscribeToIncidentUpdates(callback) {
  subscribers.add(callback);
  connectRealtime();
  return () => subscribers.delete(callback);
}
