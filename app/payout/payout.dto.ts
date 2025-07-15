import { Types } from "mongoose";
import { type BaseSchema } from "../common/dto/base.dto";

export interface IPayout extends BaseSchema {
  userId: Types.ObjectId;
  amount: number;
}
