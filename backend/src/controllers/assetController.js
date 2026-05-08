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

/**
 * @desc    Get all assets
 * @route   GET /api/assets
 */
export const getAllAssets = async (req, res) => {
    try {
      const assets = await Asset.find().sort({ createdAt: -1 });
      return res.json(assets);
    } catch (error) {
      console.error("Error fetching assets:", error);
      return res.status(500).json({ message: "Failed to fetch assets." });
    }
  };
  
  /**
   * @desc    Get single asset by ID
   * @route   GET /api/assets/:id
   */
  export const getAssetById = async (req, res) => {
    try {
      const { id } = req.params;
      const asset = await Asset.findById(id);
  
      if (!asset) {
        return res.status(404).json({ message: "Asset not found." });
      }
  
      return res.json(asset);
    } catch (error) {
      // This catches invalid Mongoose ObjectIDs
      if (error.kind === "ObjectId") {
        return res.status(400).json({ message: "Invalid Asset ID format." });
      }
      console.error("Error fetching asset:", error);
      return res.status(500).json({ message: "Internal server error." });
    }
  };

  