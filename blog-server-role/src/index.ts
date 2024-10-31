import http from "http";
import app from "@/app";
import { initRedis } from "@/redis/connection";

const SERVER_PORT = 4000;

const startHttpServer = async (httpServer: http.Server) => {
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

const startServer = async () => {
  try {
    const httpServer: http.Server = new http.Server(app);

    await startHttpServer(httpServer);
  } catch (error) {
    console.log("startServer() error method:", error);
  }
};

startServer();
