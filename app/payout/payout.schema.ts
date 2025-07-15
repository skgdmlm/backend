import mongoose from "mongoose";
import { type IPayout } from "./payout.dto";

const Schema = mongoose.Schema;

const PayoutSchema = new Schema<IPayout>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "user",
      required: true,
    },
    amount: {
      type: Number,
      required: true,
      min: 1,
    }
  },
  { timestamps: true },
);

export default mongoose.model<IPayout>("payout", PayoutSchema);
