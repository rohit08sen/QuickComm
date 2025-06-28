import express from "express";
import authRoutes from "./routes/auth.route.js";
import messageRoutes from "./routes/message.route.js";
import dotenv from "dotenv";
import { connectDB } from "./lib/db.js";
import cookieParser from "cookie-parser";
import cors from "cors";
import path from "path"
import bodyParser from "body-parser";
import { app, server } from "./lib/socket.js";

dotenv.config();
// Start server
const PORT = process.env.PORT || 5001;
const __dirname = path.resolve();
// ✅ Increase body size limit to avoid PayloadTooLargeError
app.use(bodyParser.json({ limit: "10mb" }));
app.use(bodyParser.urlencoded({ extended: true, limit: "10mb" }));
app.use(express.json());
app.use(cookieParser());
// ✅ Enable CORS for frontend origin
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);
// Routes
app.use("/api/auth", authRoutes);
app.use("/api/messages", messageRoutes);

if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "../frontend/dist")));
  app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "../frontend", "dist", "index.html"));
  });
}


server.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
  connectDB();
});
