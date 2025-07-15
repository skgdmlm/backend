// dtos/transaction.dto.ts

import { type BaseSchema } from "../common/dto/base.dto";
import { Types } from "mongoose";
export enum TransactionType {
    COMMISSION = "COMMISSION",
    PAYOUT = "PAYOUT"
}

export enum TransactionStatus {
    SUCCESS = "SUCCESS",
    FAILED = "FAILED",
    PENDING = "PENDING",
    REJECTED = "REJECTED"
}

export interface ITransaction extends BaseSchema {
    userId: Types.ObjectId;
    type: TransactionType;
    balance: number;
    lastAmountAdded: number;
    referenceId?: Types.ObjectId;
    status?: TransactionStatus;
    description?: string
}
