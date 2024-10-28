import config from "@/config";
import { Server } from "socket.io";
import http from "http";

export let socketIO: Server;

export const createSocketIO = (httpServer: http.Server) => {
  const io = new Server(httpServer, {
    cors: {
      origin: `${config.CLIENT_URL}`,
      methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    },
  });
  socketIO = io;
  return io;
};
