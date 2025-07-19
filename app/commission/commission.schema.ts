import mongoose from "mongoose";
import { type ICommission } from "./commission.dto";

const Schema = mongoose.Schema;

const CommissionSchema = new Schema<ICommission>(
  {
    earnerId: {
      type: Schema.Types.ObjectId,
      ref: "user",
      required: true,
    },
    referredUserId: {
      type: Schema.Types.ObjectId,
      ref: "user",
      required: true,
    },
    level: {
      type: Number,
      required: true,
      min: 1,
      max: 10,
    },
    amount: {
      type: Number,
      required: true,
    },
    hcPerent: {
      type: Number,
      required: true,
    },
    finalAmount: {
      type: Number,
      required: true,
    },
    isPaid: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true },
);

CommissionSchema.index({ earnerId: 1, level: 1 });
CommissionSchema.index({ referredUserId: 1 });

export default mongoose.model<ICommission>("commission", CommissionSchema);
