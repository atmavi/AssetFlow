// controllers/assetController.js
import Asset from "../models/Asset.js";

/**
 * @desc    Get summary counts of assets by status
 * @route   GET /api/assets/summary
 */
export const getAssetSummary = async (_req, res) => {
  try {
    // We run these in parallel for better performance
    const [total, assigned, available, maintenance] = await Promise.all([
      Asset.countDocuments(),
      Asset.countDocuments({ status: "Assigned" }),
      Asset.countDocuments({ status: "Available" }),
      Asset.countDocuments({ status: "Maintenance" }),
    ]);

    return res.json({
      totalAssets: total,
      assignedAssets: assigned,
      availableAssets: available,
      maintenanceAssets: maintenance,
    });
  } catch (error) {
    console.error("Failed to fetch asset summary:", error);
    return res.status(500).json({ message: "Internal server error." });
  }
};