import "dotenv/config";
import express from "express";
import cors from "cors";
import { userRouter } from "./routes/users";
import { postRouter } from "./routes/posts";

const app = express();
const PORT = process.env.SERVER_PORT || 3000;

app.use(cors());
app.use(express.json());

app.use((req, res, next) => {
  const timeString = new Date().toLocaleTimeString();
  console.log(`[${timeString}] ${req.method} ${req.url}`);
  next();
});

// Rutas
app.use("/api/users", userRouter);
app.use("/api/posts", postRouter);

app.get("/", (req, res) => {
  res.json({ message: "Blog API con Prisma 7" });
});

app.get("/health", (req, res) => {
  return res.json({
    status: "ok",
    uptime: process.uptime(),
  });
});

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
