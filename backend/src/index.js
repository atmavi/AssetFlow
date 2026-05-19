import cors from "cors";
import morgan from "morgan";
import dotenv from "dotenv";
import express from "express";
import mongoose from "mongoose";

const logger = require('./utils/logger');
import authRouter from "./routes/authRoutes.js";
import assetRouter from "./routes/assetRoutes.js";
import { ensureSeedData } from "./seed/seedDatabase.js";

dotenv.config();

const morgan = require('morgan');
const logger = require('./utils/logger')

const app = express();
const port = process.env.PORT || 5000;
const mongoUri = process.env.MONGO_URI || "mongodb://db:27017/assetflow";

app.use(cors());
app.use(express.json());

app.use(
  morgan(':method :url :status :res[content-length] - :response-time ms', {
    stream: { write: (message) => logger.http(message.trim()) },
  })
);

app.use("/api/auth", authRouter);
app.use("/api/assets", assetRouter);

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
