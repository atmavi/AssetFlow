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
      Asset.countDocuments({ status: "assigned" }),
      Asset.countDocuments({ status: "available" }),
      Asset.countDocuments({ status: "maintenance" }),
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
    // 1. Extract the status from the query string (e.g., /api/assets?status=IN_USE)
    const { status = 'all' } = req.query;

    // 2. Build a dynamic filter object
    // If status exists and isn't 'all', add it to the query
    const filter = {};
    if (status && status !== 'all') {
      filter.status = status;
    }

    // 3. Apply the filter and sort by newest first
    const assets = await Asset.find(filter).sort({ createdAt: -1 });

    return res.json(assets);
  } catch (error) {
    console.error("Error fetching assets:", error);
    return res.status(500).json({ 
      success: false, 
      message: "Failed to fetch assets." 
    });
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

export const requestAsset = async (req, res) => {
  try {
    const { id } = req.params;
    const { reason, userName, userId } = req.body;

    const asset = await Asset.findById(id);
    if (!asset) return res.status(404).json({ message: "Asset not found" });

    // Business Logic: Prevent requesting if already assigned
    if (asset.status !== "Available") {
      return res.status(400).json({ message: "Asset is not available for request" });
    }

    asset.requests.push({ userId, userName, reason });
    await asset.save();

    res.status(200).json({ message: "Request submitted successfully", asset });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

export const createAsset = async (req, res) => {
  try {
    const { name, serialNumber, category, status, specifications, assigneeName } = req.body;

    // Check if serial number already exists (Data Integrity check)
    const existingAsset = await Asset.findOne({ serialNumber });
    if (existingAsset) {
      return res.status(400).json({ message: "Serial number already exists." });
    }

    // Build the new asset object
    const newAssetData = {
      name,
      serialNumber,
      category,
      status,
      specifications,
      assignmentHistory: []
    };

    // If status is 'assigned', we must initialize the history
    if (status === 'assigned' && assigneeName) {
      newAssetData.assignmentHistory.push({
        assigneeName,
        assignedAt: new Date(),
        returnedAt: null
      });
    }

    const asset = new Asset(newAssetData);
    await asset.save();
    
    return res.status(201).json(asset);
  } catch (error) {
    console.error("Error creating asset:", error);
    return res.status(500).json({ message: "Failed to create asset." });
  }
};
