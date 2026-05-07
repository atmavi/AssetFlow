import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import mongoose from "mongoose";
import authRouter from "./routes/authRoutes.js";
import assetRouter from "./routes/assetRoutes.js";
import { ensureSeedData } from "./seed/seedDatabase.js";

dotenv.config();

const app = express();
const port = process.env.PORT || 5000;
const mongoUri = process.env.MONGO_URI || "mongodb://db:27017/assetflow";

app.use(cors());
app.use(express.json());
app.use("/api/auth", authRouter);
app.use("/api/assets", assetRouter);

app.get("/health", async (_req, res) => {
  const dbState = mongoose.connection.readyState;
  res.json({
    status: "ok",
    dbConnected: dbState === 1
  });
});

app.get("/", (_req, res) => {
  res.json({ message: "AssetFlow backend is running." });
});

const startServer = async () => {
  try {
    await mongoose.connect(mongoUri);
    console.log("Connected to MongoDB");
    const { testUser } = await ensureSeedData();
    console.log(`Test user ready: ${testUser.email}`);
    app.listen(port, () => {
      console.log(`Backend listening on port ${port}`);
    });
  } catch (error) {
    console.error("Failed to start backend:", error);
    process.exit(1);
  }
};

startServer();
