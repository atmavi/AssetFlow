import { Router } from "express";
import { getAssetSummary } from "../controllers/assetController.js";

const assetRouter = Router();

assetRouter.get("/summary", getAssetSummary);

export default assetRouter;