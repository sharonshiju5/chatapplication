import { Server } from "socket.io";
import messageSchema from "./models/messegemodel.js";

/**
 * Initialize and configure Socket.IO with the HTTP server
 * @param {Object} httpServer - The HTTP server instance
 * @returns {Object} Configured Socket.IO server instance
 */
const initializeSocket = (httpServer) => {
  const io = new Server(httpServer, {
    cors: {
      origin: "*", // In production, restrict to your frontend URL
      methods: ["GET", "POST"]
    }
  });

  // Store online users
  const onlineUsers = new Map();

  io.on("connection", (socket) => {
    console.log(`User connected: ${socket.id}`);
    
    // User joins with their userId
    socket.on("user_connected", (userId) => {
      console.log(`User ${userId} is online with socket id: ${socket.id}`);
      onlineUsers.set(userId, socket.id);
      
      // Broadcast user online status to all connected clients
      io.emit("user_status_update", Array.from(onlineUsers.keys()));
    });
    
    // Handle private messages
    socket.on("send_message", async (messageData) => {
      try {
        const { from, to, message, images = [] } = messageData;
        
        // Save message to database
        const newMessage = await messageSchema.create({
          from,
          to,
          message,
          images,
          timestamp: new Date()
        });
        
        // Get recipient's socket id
        const recipientSocketId = onlineUsers.get(to);
        
        // Send to recipient if online
        if (recipientSocketId) {
          io.to(recipientSocketId).emit("receive_message", {
            _id: newMessage._id,
            from,
            to,
            message,
            images,
            timestamp: newMessage.timestamp
          });
        }
        
        // Send confirmation back to sender
        socket.emit("message_sent", {
          _id: newMessage._id,
          status: "sent",
          timestamp: newMessage.timestamp
        });
      } catch (error) {
        console.error("Error sending message:", error);
        socket.emit("error", { message: "Failed to send message" });
      }
    });
    
    // Handle typing status
    socket.on("typing", ({ from, to }) => {
      const recipientSocketId = onlineUsers.get(to);
      if (recipientSocketId) {
        io.to(recipientSocketId).emit("user_typing", { userId: from });
      }
    });
    
    // Handle stop typing status
    socket.on("stop_typing", ({ from, to }) => {
      const recipientSocketId = onlineUsers.get(to);
      if (recipientSocketId) {
        io.to(recipientSocketId).emit("user_stop_typing", { userId: from });
      }
    });
    
    // User disconnects
    socket.on("disconnect", () => {
      console.log(`User disconnected: ${socket.id}`);
      // Find and remove the user from onlineUsers
      for (const [userId, socketId] of onlineUsers.entries()) {
        if (socketId === socket.id) {
          onlineUsers.delete(userId);
          // Broadcast updated online users list
          io.emit("user_status_update", Array.from(onlineUsers.keys()));
          break;
        }
      }
    });
  });

  return io;
};

export default initializeSocket;