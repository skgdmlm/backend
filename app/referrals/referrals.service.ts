import { IUser } from "../user/user.dto";
import { type IReferrals } from "./referrals.dto";
import ReferralsSchema from "./referrals.schema";
import "../user/user.schema"
import userSchema from "../user/user.schema";

export const createReferrals = async (data: Omit<IReferrals, "_id" | "createdAt" | "updatedAt">) => {
  const result = await ReferralsSchema.create(data);
  return result;
};

export const updateReferrals = async (id: string, data: IReferrals) => {
  const result = await ReferralsSchema.findOneAndUpdate({ _id: id }, data, {
    new: true,
  });
  return result;
};

export const editReferrals = async (id: string, data: Partial<IReferrals>) => {
  const result = await ReferralsSchema.findOneAndUpdate({ _id: id }, data);
  return result;
};

export const deleteReferrals = async (id: string) => {
  const result = await ReferralsSchema.deleteOne({ _id: id });
  return result;
};

export const getReferralsById = async (id: string) => {
  const result = await ReferralsSchema.findById(id).lean();
  return result;
};
export const getReferralsByPin = async (pin: string) => {
  const result = await ReferralsSchema.findOne({ pin }).lean();
  return result;
};

export const getAllReferrals = async (
  referrerId: string,
  skip: number,
  limit: number,
) => {
  const result = await ReferralsSchema.find({ referrerId })
    .skip(skip)
    .limit(limit)
    .sort({
      createdAt: -1,
    })
    .populate("usedBy", "name", userSchema)
    .lean();
  return result;
}
export const getAllReferralsCount = async (userId: string) => {
  const result = await ReferralsSchema.count({referrerId: userId});
  return result;
};


export const generateReferralPin = () => {
  return Math.random().toString(36).substring(2, 8).toUpperCase();
}

export const verifyReferralPin = async (pin: string) => {
  const populatedData = await ReferralsSchema.findOne<IReferrals>({ pin }).populate<{ referrerId: IUser }>('referrerId', null, userSchema).lean();

  if (!populatedData) {
    throw new Error("Invalid referral pin");
  }
  if (populatedData.isUsed) {
    throw new Error("Referral pin is already used");
  }
  if (populatedData.expiresAt && new Date(populatedData.expiresAt) < new Date()) {
    throw new Error("Referral pin has expired");
  }
  return populatedData;
}