import mongoose from "mongoose";
import { type ICommissionRate } from "./commissionRate.dto";

const Schema = mongoose.Schema;

const CommissionRateSchema = new Schema<ICommissionRate>(
  {
    level: { type: Number, required: true },
    percentage: { type: Number, required: true },
  },
  { timestamps: true },
);

export default mongoose.model<ICommissionRate>(
  "commissionRate",
  CommissionRateSchema,
);
