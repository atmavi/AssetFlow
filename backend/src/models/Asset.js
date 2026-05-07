import mongoose from "mongoose";

const assignmentSchema = new mongoose.Schema(
  {
    assigneeName: { type: String, required: true },
    assignedAt: { type: Date, required: true },
    returnedAt: { type: Date, default: null }
  },
  { _id: false }
);

const assetSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    serialNumber: { type: String, required: true, unique: true, trim: true },
    category: { type: String, required: true, trim: true },
    status: {
      type: String,
      enum: ["Available", "Assigned", "Maintenance"],
      default: "Available"
    },
    specifications: { type: String, default: "" },
    assignmentHistory: { type: [assignmentSchema], default: [] }
  },
  { timestamps: true }
);

const Asset = mongoose.model("Asset", assetSchema);

export default Asset;
