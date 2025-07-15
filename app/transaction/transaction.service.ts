import { Types } from "mongoose";
import { type ITransaction } from "./transaction.dto";
import TransactionSchema from "./transaction.schema";

export const createTransaction = async (data: Omit<ITransaction, "_id" | "createdAt" | "updatedAt">) => {
  const result = await TransactionSchema.create({ ...data, active: true });
  return result;
};

export const updateTransaction = async (id: string, data: ITransaction) => {
  const result = await TransactionSchema.findOneAndUpdate({ _id: id }, data, {
    new: true,
  });
  return result;
};

export const editTransaction = async (
  id: string,
  data: Partial<ITransaction>,
) => {
  const result = await TransactionSchema.findOneAndUpdate({ _id: id }, data);
  return result;
};

export const deleteTransaction = async (id: string) => {
  const result = await TransactionSchema.deleteOne({ _id: id });
  return result;
};

export const getTransactionById = async (id: string) => {
  const result = await TransactionSchema.findById(id).lean();
  return result;
};

export const getAllTransaction = async (userId: string, skip: number, limit: number) => {
  const result = await TransactionSchema.find({ userId })
    .skip(skip)
    .limit(limit)
    .sort({
      createdAt: -1
    })
    .lean();
  return result;
};
export const getLatestTransaction = async (userId: string) => {
  return TransactionSchema.findOne({ userId, status: { $nin: ["FAILED", "REJECTED"] } })
    .sort({ createdAt: -1 })
    .lean();
};
export const getAllTransactionCount = async (userId: string) => {
  const result = await TransactionSchema.count({ userId })
  return result;
};