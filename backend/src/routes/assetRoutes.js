import { Router } from "express";
import { getAssetSummary } from "../controllers/assetController.js";

const assetRouter = Router();

assetRouter.get("/summary", getAssetSummary);

// General/Dynamic routes second
assetRouter.get("/", getAllAssets);
assetRouter.get("/:id", getAssetById);

export default assetRouter;