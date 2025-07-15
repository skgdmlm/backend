import { Types } from "mongoose";
import { type ICommission } from "./commission.dto";
import CommissionSchema from "./commission.schema";
import * as userService from "../user/user.service";
import * as commissionRateService from "../commissionRate/commissionRate.service";
import * as commissionService from "../commission/commission.service";
import * as transactionService from "../transaction/transaction.service"
import { TransactionStatus, TransactionType } from "../transaction/transaction.dto";

export const createCommission = async (
  data: Omit<ICommission, "_id" | "createdAt" | "updatedAt">,
) => {
  const result = await CommissionSchema.create(data);
  return result;
};

export const updateCommission = async (id: string, data: ICommission) => {
  const result = await CommissionSchema.findOneAndUpdate({ _id: id }, data, {
    new: true,
  });
  return result;
};

export const editCommission = async (
  id: string,
  data: Partial<ICommission>,
) => {
  const result = await CommissionSchema.findOneAndUpdate({ _id: id }, data);
  return result;
};

export const deleteCommission = async (id: string) => {
  const result = await CommissionSchema.deleteOne({ _id: id });
  return result;
};

export const getCommissionById = async (id: string) => {
  const result = await CommissionSchema.findById(id).lean();
  return result;
};

export const getAllCommission = async (userId: string, skip: number, limit: number) => {
  const result = await CommissionSchema.find({earnerId: userId}).populate({
      path: "referredUserId",
      select: "name"
    }).skip(skip).limit(limit).sort({
      createdAt: -1
    }).lean();
  return result;
};
export const getAllCommissionCount = async (userId: string) => {
  const result = await CommissionSchema.count({earnerId: userId});
  return result;
};

export const generateCommissions = async (
  newUserId: string,
  amount: number
): Promise<void> => {
  let currentUser = await userService.getUserById(newUserId, "referrerId");
  
  const commissionRates = await commissionRateService.getAllCommissionRate();
  const rates = commissionRates.reduce(
    (acc, rate) => {
      acc[rate.level] = rate.percentage;
      return acc;
    },
    {} as Record<number, number>,
  );
  
  if (!currentUser?.referrerId) return;

  let referrerId: string | undefined | null = currentUser.referrerId;
  let level = 1;

  while (referrerId && level <= 10) {
    const rate = rates[level];
    console.log('rate: ', rate);
    if (!rate) break;

    const referrer = await userService.getUserById(referrerId);
    if (!referrer) break;

    const commissionAmount = (amount * rate)/100;
    const finalAmount = (commissionAmount * 0.9);
    
    await commissionService.createCommission({
      earnerId: new Types.ObjectId(referrer._id),
      referredUserId: new Types.ObjectId(newUserId),
      level,
      amount: commissionAmount,
      hcPerent: 10,
      finalAmount
    });
    const lastTx = await transactionService.getLatestTransaction(referrer._id);
    const lastAmountAdded = finalAmount;
    const currentBalance = (lastTx?.balance ?? 0) + finalAmount;
     await transactionService.createTransaction({
      userId: new Types.ObjectId(referrer._id),
      type: TransactionType.COMMISSION,
      balance: currentBalance,
      lastAmountAdded,
      referenceId: new Types.ObjectId(newUserId),
      description: `Commission from referral at level ${level}`,
      status: TransactionStatus.SUCCESS,
    });
     if (referrer.badgeType === "yellow") break;
    referrerId = referrer.referrerId;
    level++;
  }
};

export async function getTotalCommission(earnerId: string): Promise<number> {
  const result = await CommissionSchema.aggregate([
    { $match: { earnerId: new Types.ObjectId(earnerId) } },
    {
      $group: {
        _id: null,
        total: { $sum: "$amount" },
      },
    }
  ]);

  return result.length > 0 ? result[0].total : 0;
}
export async function checkUserCommisionPayoutEligibilty(
  earnerId: string,
): Promise<boolean> {
  const count = await CommissionSchema.count({ earnerId });
  return count >= 4;
}
