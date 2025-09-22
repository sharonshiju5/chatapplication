import express from "express";
import cors from "cors";
import { createServer } from "http";
import connection from "./connection.js";
import env from "dotenv";
import router from "./router.js";
import initializeSocket from "./socketServer.js";

env.config();

const app = express();
const httpServer = createServer(app);

// Initialize Socket.IO with the HTTP server
const io = initializeSocket(httpServer);

app.use(cors());
app.use(express.json({ limit: "100mb" }));
app.use("/api", router);

connection().then(() => {
  const PORT = process.env.PORT || 5000; // fallback for local dev
  app.listen(PORT, () => {
    console.log(`🚀 Server started on http://localhost:${PORT}`);
  });
});