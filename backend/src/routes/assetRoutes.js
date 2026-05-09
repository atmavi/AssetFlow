import { Router } from "express";
import { getAssetSummary, getAllAssets, getAssetById, requestAsset } from "../controllers/assetController.js";

const assetRouter = Router();

assetRouter.get("/summary", getAssetSummary);

// General/Dynamic routes second
assetRouter.get("/", getAllAssets);
assetRouter.get("/:id", getAssetById);
assetRouter.post("/:id", requestAsset);

export default assetRouter;