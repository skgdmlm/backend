import { Types } from "mongoose";
import { type BaseSchema } from "../common/dto/base.dto";

export interface IBank extends BaseSchema {
  userId: Types.ObjectId;
  accountHolderName: string;
  bankName: string;
  accountNumber: string;
  ifscCode: string;
  branch?: string;
  upiId?: string;
  isDefault?: boolean;
}
