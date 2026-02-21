const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const cors = require('cors');

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: process.env.CLIENT_URL || "http://localhost:3000",
    methods: ["GET", "POST"]
  }
});

app.use(cors());
app.use(express.json());

// Store chat history and online users
let chatHistory = [];
let onlineUsers = new Map(); // socketId -> username

io.on('connection', (socket) => {
  console.log('New client connected:', socket.id);

  // Handle user joining
  socket.on('join', (username) => {
    console.log(`${username} joined the chat`);
    
    // Store username
    onlineUsers.set(socket.id, username);
    
    // Send chat history to new user
    socket.emit('chatHistory', chatHistory);
    
    // Notify all users about new user
    const joinMessage = {
      id: Date.now(),
      message: `${username} joined the chat`,
      timestamp: new Date().toISOString(),
      isSystemMessage: true
    };
    io.emit('userJoined', joinMessage);
    chatHistory.push(joinMessage);
    
    // Send updated user list
    const userList = Array.from(onlineUsers.values());
    io.emit('onlineUsers', userList);
  });

  // Handle sending messages
  socket.on('sendMessage', (data) => {
    const username = onlineUsers.get(socket.id);
    if (username) {
      const messageData = {
        id: Date.now() + Math.random(),
        username: username,
        message: data.message,
        timestamp: new Date().toISOString()
      };
      
      chatHistory.push(messageData);
      io.emit('receiveMessage', messageData);
      console.log(`Message from ${username}: ${data.message}`);
    }
  });

  // Handle typing indicator
  socket.on('typing', (data) => {
    const username = onlineUsers.get(socket.id);
    if (username) {
      socket.broadcast.emit('userTyping', {
        username: username,
        isTyping: data.isTyping
      });
    }
  });

  // Handle disconnection
  socket.on('disconnect', () => {
    const username = onlineUsers.get(socket.id);
    if (username) {
      console.log(`${username} disconnected`);
      
      // Remove user
      onlineUsers.delete(socket.id);
      
      // Notify all users
      const leaveMessage = {
        id: Date.now(),
        message: `${username} left the chat`,
        timestamp: new Date().toISOString(),
        isSystemMessage: true
      };
      io.emit('userLeft', leaveMessage);
      chatHistory.push(leaveMessage);
      
      // Send updated user list
      const userList = Array.from(onlineUsers.values());
      io.emit('onlineUsers', userList);
    }
  });
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`\n🚀 Server is running on http://localhost:${PORT}`);
  console.log('💬 Chat server is ready!\n');
});
