import { Types } from "mongoose";
import { type BaseSchema } from "../common/dto/base.dto";

export interface ICommission extends BaseSchema {
  earnerId: Types.ObjectId;
  referredUserId: Types.ObjectId;
  level: number;
  amount: number;
  hcPerent: number;
  finalAmount: number;
  isPaid?: boolean;
}
