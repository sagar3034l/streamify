import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";
import path, { dirname } from "path";
import { fileURLToPath } from "url";

import authRoute from "./routes/authroute.js";
import chatRoute from "./routes/chatRoute.js";
import userRoute from "./routes/userRoute.js";
import connectDB from "./connect.js";

const app = express();
dotenv.config();

const port = process.env.PORT || 3000;

// Proper __dirname replacement for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

app.use(express.json());
app.use(cookieParser());

app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);

connectDB();

app.use("/api/auth", authRoute);
app.use("/api/users", userRoute);
app.use("/api/chat", chatRoute);

if (process.env.NODE_ENV === "production") { app.use(express.static(path.resolve(__dirname, "../../frontend/chat-app/dist"))); app.get(/.*/, (req, res) => { res.sendFile(path.resolve(__dirname, "../../frontend/chat-app/dist/index.html")); }); }
app.listen(port, () => {
  console.log("Server is listening on", port);
});
