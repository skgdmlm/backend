import { ProjectionType, QueryOptions, Types } from "mongoose";
import { type IUser } from "./user.dto";
import UserSchema from "./user.schema";

export const createUser = async (
  data: Omit<IUser, "_id" | "createdAt" | "updatedAt">,
) => {
  const result = await UserSchema.create(data);
  const { refreshToken, password, ...user } = result.toJSON();
  return user;
};

export const updateUser = async (id: string, data: IUser) => {
  const result = await UserSchema.findOneAndUpdate({ _id: id }, data, {
    new: true,
    select: "-password -refreshToken -facebookId",
  });
  return result;
};

export const editUser = async (id: string, data: Partial<IUser>) => {
  const result = await UserSchema.findOneAndUpdate({ _id: id }, data, {
    new: true,
    select: "-password -refreshToken -facebookId",
  });
  return result;
};

export const deleteUser = async (id: string) => {
  const result = await UserSchema.deleteOne(
    { _id: id },
    { select: "-password -refreshToken -facebookId" },
  );
  return result;
};

export const getUserById = async (
  id: string,
  projection?: ProjectionType<IUser>,
) => {
  const result = await UserSchema.findById(id, projection).lean();
  return result;
};
export const getUserByIdWithBankDetails = async (
  id: string,
  projection?: ProjectionType<IUser>,
) => {
  const result = await UserSchema.findById(id, projection).populate("bankDetails").lean();
  return result;
};

export const getAllUser = async (
  condition: Record<string, any>,
  projection?: ProjectionType<IUser>,
  options?: QueryOptions<IUser>,
) => {
  
  if('search' in condition)
  {
    condition['name'] =  {$regex: new RegExp(condition['search'], 'i') };
    delete condition['search']
  }
  const result = await UserSchema.find(condition, projection, options).sort({
    createdAt: -1
  }).lean();
  return result;
};
export const getUserByEmail = async (
  email: string,
  projection?: ProjectionType<IUser>,
) => {
  const result = await UserSchema.findOne({ email }, projection).lean();
  return result;
};

export const countItems = () => {
  return UserSchema.count();
};

export async function buildReferralTree(userId: string): Promise<any> {
  const user = await getUserById(userId, "_id name badgeType email phone");

  if (!user) return null;

  // Get all direct referrals of the user
  const referralUsers: IUser[] = await UserSchema.find({
    referrerId: new Types.ObjectId(user._id),
    active: true,
  })
    .select("_id name badgeType email phone")
    .lean();

  const children = await Promise.all(
    referralUsers.map((referral) => buildReferralTree(referral._id.toString()))
  );
  return {
    id: user._id,
    name: user.name,
    attributes: { badge: user.badgeType },
    email: user.email,
    children,
  };
}
