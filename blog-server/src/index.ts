import http from "http";
import app from "@/app";
import { initRedis } from "@/redis/connection";
import { Server } from "socket.io";
import { taskListener } from "./socket/task";
import { createSocketIO } from "./socket/init";

const SERVER_PORT = 4000;

const startHttpServer = (httpServer: http.Server) => {
  initRedis();
  try {
    console.log(`App server has started with process id ${process.pid}`);
    httpServer.listen(SERVER_PORT, () => {
      console.log(`App server running on port ${SERVER_PORT}`);
    });
  } catch (error) {
    console.log("startHttpServer() method error:", error);
  }
};

const startServer = () => {
  try {
    const httpServer: http.Server = new http.Server(app);
    const socketIO: Server = createSocketIO(httpServer);
    taskListener(socketIO);
    startHttpServer(httpServer);
  } catch (error) {
    console.log("startServer() error method:", error);
  }
};

startServer();
