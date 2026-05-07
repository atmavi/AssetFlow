import { Router } from "express";
import Asset from "../models/Asset.js";

const assetRouter = Router();

assetRouter.get("/summary", async (_req, res) => {
  try {
    const totalAssets = await Asset.countDocuments();
    const assignedAssets = await Asset.countDocuments({ status: "Assigned" });
    const availableAssets = await Asset.countDocuments({ status: "Available" });
    const maintenanceAssets = await Asset.countDocuments({ status: "Maintenance" });

    return res.json({
      totalAssets,
      assignedAssets,
      availableAssets,
      maintenanceAssets
    });
  } catch (error) {
    console.error("Failed to fetch asset summary:", error);
    return res.status(500).json({ message: "Internal server error." });
  }
});

export default assetRouter;
