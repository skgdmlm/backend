import { type BaseSchema } from "../common/dto/base.dto";
import { Types } from 'mongoose';
import { BadgeType } from "../user/user.dto";

export interface IReferrals extends BaseSchema {
  pin: string;
  referrerId: Types.ObjectId;
  badgeType?:BadgeType
  isUsed: boolean;
  usedBy?: Types.ObjectId | null;
  expiresAt?: Date;
}
