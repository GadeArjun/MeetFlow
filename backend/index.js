const express = require("express");
const http = require("http");
require("dotenv").config();
const { Server } = require("socket.io");
const { connectDB } = require("./utils/db");

// routers
const userRouter = require("./router/user");
const meetingRouter = require("./router/meeting");
const { meetingSocketHandling } = require("./utils/socket/meeting");
const app = express();

// use of routers and middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api/user", userRouter);
app.use("/api/meeting", meetingRouter);

const server = http.createServer(app);

// connect to databse
connectDB();

const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

meetingSocketHandling(io);

server.listen(process.env.PORT, () => {
  console.info(
    `Server is running on port ${process.env.PORT}\n http://localhost:${process.env.PORT}`
  );
});
