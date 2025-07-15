import { type BaseSchema } from "../common/dto/base.dto";

export interface ICommissionRate extends BaseSchema {
  level: number;
  percentage: number;
}
