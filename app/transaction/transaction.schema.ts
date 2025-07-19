import mongoose from "mongoose";
import {
  TransactionStatus,
  TransactionType,
  type ITransaction,
} from "./transaction.dto";

const Schema = mongoose.Schema;

const TransactionSchema = new Schema<ITransaction>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "user",
      required: true,
      index: true,
    },
    type: {
      type: String,
      enum: Object.values(TransactionType),
      required: true,
    },
    balance: {
      type: Number,
      required: true,
      min: 0,
      default: 0,
    },
    lastAmountAdded: {
      type: Number,
      required: true,
      default: 0,
    },
    status: {
      type: String,
      enum: Object.values(TransactionStatus),
      default: TransactionStatus.PENDING,
    },
    description: {
      type: String,
    },
  },
  { timestamps: true },
);

export default mongoose.model<ITransaction>("transaction", TransactionSchema);
