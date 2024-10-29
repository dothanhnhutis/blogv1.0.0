import { Server, Socket } from "socket.io";
import SocketServer from "./init";

export const taskListener = (io: Server) => {
  const factoryNamespace = io.of("/task");
  factoryNamespace.on("connection", (socket) => {
    console.log("A client connected:", socket.id);

    socket.on("joinTask", (taskId) => {
      console.log(`${socket.id} is joining room: ${taskId}`);
      socket.join(taskId);
      socket.to(taskId).emit("message", `${socket.id} has joined the room.`);
    });

    socket.on("disconnect", () => {
      console.log(`Client disconnected: ${socket.id}`);
    });
  });
};

export const taskSend = (data: any) => {
  const factoryNamespace = SocketServer.io.of("/task");
  SocketServer.io;
  factoryNamespace.emit("message", data);
};
