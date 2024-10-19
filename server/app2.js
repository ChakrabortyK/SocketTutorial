import express from "express";
import { Server } from "socket.io";
import { createServer } from "http";
import cors from "cors";
import jwt from "jsonwebtoken";
import cookieParser from "cookie-parser";

const secretKeyJWT = "asdasdsadasdasdasdsa";
const port = 3000;

const app = express();
const server = createServer(app);
const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173",
    methods: ["GET", "POST"],
    credentials: true,
  },
});

app.use(
  cors({
    origin: "http://localhost:5173",
    methods: ["GET", "POST"],
    credentials: true,
  })
);

app.get("/", (req, res) => {
  res.send("Hello World!");
});

io.on("connection", (socket) => {
  console.log("User SocketId: ", socket.id); // logs connection
  socket.emit("welcome", `socket.emit: welcome to the server`); // sends welcome emit
  socket.broadcast.emit(
    "welcome",
    `socket.broadcast.emit for ${socket.id} : joined`
  ); // sends welcome emit to all other users from socket.id user

  socket.on("message", (data) => {
    console.log("message: ", data);
    io.to(data.roomName).emit("recieve-message", data.message);
  });

  socket.on("join-room", (data) => {
    socket.join(data);
    console.log("join-room: ", data);
  });

  socket.on("disconnect", () => {
    console.log("User Disconnected", socket.id);
  });
});

server.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
