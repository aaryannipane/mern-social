require('dotenv').config()

const io = require("socket.io")(8900, {
  cors: {
    origin: "http://localhost:3000",
  },
});

let users = [];

const addUser = (userId, socketId) => {
  // don't add user if user exist already in users array
  !users.some((user) => user.userId === userId) &&
    users.push({ userId, socketId });
};

const removeUser = (socketId) => {
  users = users.filter((user) => user.socketId !== socketId);
};

const getUser = (userId) => users.find((user) => user.userId === userId);

io.on("connection", (socket) => {
  console.log("a new user connected");

  //   when connect
  // for every connection take userId and socketId from client
  socket.on("ADD_USER", (userId) => {
    addUser(userId, socket.id);
    // send online users to client
    io.emit("GET_USERS", users);
  });

  //   send and get message
  socket.on("SEND_MESSAGE", ({ senderId, recieverId, text }) => {
    const user = getUser(recieverId);
    console.log(user);
    io.to(user?.socketId).emit("GET_MESSAGE", {
      senderId,
      text,
    });
  });

  //   when disconnect
  socket.on("disconnect", () => {
    console.log("user disconnected");
    removeUser(socket.id);
    io.emit("GET_USERS", users);
  });
});
