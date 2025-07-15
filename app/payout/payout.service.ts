import createHttpError from "http-errors";
import { checkUserCommisionPayoutEligibilty } from "../commission/commission.service";
import { type IPayout } from "./payout.dto";
import PayoutSchema from "./payout.schema";

export const createPayout = async (
  data: Omit<IPayout, "_id" | "createdAt" | "updatedAt">,
) => {
  const isValid = await checkUserCommisionPayoutEligibilty(
    data.userId.toString(),
  );
  if (!isValid) {
    throw createHttpError(400, { message: "Not eligible for payout" });
  }

  //check the validity of user having variable ispayouteleigble
  const result = await PayoutSchema.create({ ...data });
  return result;
};

export const updatePayout = async (id: string, data: IPayout) => {
  const result = await PayoutSchema.findOneAndUpdate({ _id: id }, data, {
    new: true,
  });
  return result;
};

export const editPayout = async (id: string, data: Partial<IPayout>) => {
  const result = await PayoutSchema.findOneAndUpdate({ _id: id }, data);
  return result;
};

export const deletePayout = async (id: string) => {
  const result = await PayoutSchema.deleteOne({ _id: id });
  return result;
};

export const getPayoutById = async (id: string) => {
  const result = await PayoutSchema.findById(id).lean();
  return result;
};

export const getAllPayout = async () => {
  const result = await PayoutSchema.find({}).lean();
  return result;
};
