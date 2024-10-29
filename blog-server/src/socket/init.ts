import config from "@/config";
import { Server, ServerOptions } from "socket.io";
import http from "http";

const opt: Partial<ServerOptions> = {
  cors: {
    origin: `${config.CLIENT_URL}`,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  },
};

class SocketServer extends Server {
  private static io: SocketServer;

  constructor(httpServer: http.Server) {
    super(httpServer, opt);
  }

  public static createInstance(httpServer: http.Server): SocketServer {
    if (!SocketServer.io) {
      SocketServer.io = new SocketServer(httpServer);
    }
    return SocketServer.io;
  }
}
export default SocketServer;
