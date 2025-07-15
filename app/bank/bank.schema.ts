import mongoose from "mongoose";
import { type IBank } from "./bank.dto";

const Schema = mongoose.Schema;

const BankSchema = new Schema<IBank>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "user",
      required: true,
      index: true,
    },
    accountHolderName: {
      type: String,
      required: true,
      trim: true,
    },
    bankName: {
      type: String,
      required: true,
      trim: true,
    },
    accountNumber: {
      type: String,
      required: true,
      trim: true
    },
    ifscCode: {
      type: String,
      required: true,
      uppercase: true,
      trim: true,
    },
    branch: {
      type: String,
      trim: true,
    },
    upiId: {
      type: String,
      trim: true,
    },
    isDefault: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true },
);

export default mongoose.model<IBank>("bank", BankSchema);
