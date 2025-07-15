import * as payoutService from "./payout.service";
import * as transactionService from "../transaction/transaction.service"
import { createResponse } from "../common/helper/response.hepler";
import asyncHandler from "express-async-handler";
import { type Request, type Response } from "express";
import createHttpError from "http-errors";
import { Types } from "mongoose";
import { TransactionStatus, TransactionType } from "../transaction/transaction.dto";

export const createPayout = asyncHandler(
  async (req: Request, res: Response) => {
    const { amount, userId } = req.body;
    const result = await payoutService.createPayout({
      amount,
      userId,
    });
    const lastTx = await transactionService.getLatestTransaction(userId);
    if (amount > (lastTx?.balance ?? 0)) {
      throw createHttpError(401, {
        message: `Amount is greater than balance`,
      });
    }
    const currentBalance = (lastTx?.balance ?? 0) - amount;
    await transactionService.createTransaction({
      userId: new Types.ObjectId(userId),
      type: TransactionType.PAYOUT,
      balance: currentBalance,
      lastAmountAdded: -amount,
      description: `Payout of ${amount}`,
      status: TransactionStatus.SUCCESS,
    });
    res.send(createResponse(result, "Payout created sucssefully"));
  },
);
export const processPayout = asyncHandler(
  async (req: Request, res: Response) => {
    const { transactionId } = req.body;
    const txn = transactionService.editTransaction(transactionId, { status: TransactionStatus.SUCCESS });
    //process amount in their account
    res.send(createResponse(txn, "Payout processed sucssefully"));
  },
);
export const rejectPayout = asyncHandler(
  async (req: Request, res: Response) => {
    const { transactionId } = req.body;
    const txn = await transactionService.editTransaction(transactionId, { status: TransactionStatus.REJECTED });
    //revert amount in their account
    const lastTx = await transactionService.getLatestTransaction(req.user!._id);
    const currentBalance = (lastTx?.balance ?? 0) + (txn?.lastAmountAdded ?? 0)
    await transactionService.createTransaction({
      userId: new Types.ObjectId(req.user!._id),
      type: TransactionType.PAYOUT,
      balance: currentBalance,
      lastAmountAdded: txn?.lastAmountAdded ?? 0,
      description: `Payout reverted of amount ${txn?.lastAmountAdded}`,
      status: TransactionStatus.SUCCESS,
    });
    res.send(createResponse(txn, "Payout processed sucssefully"));
  },
);

export const updatePayout = asyncHandler(
  async (req: Request, res: Response) => {
    const result = await payoutService.updatePayout(req.params.id, req.body);
    res.send(createResponse(result, "Payout updated sucssefully"));
  },
);

export const editPayout = asyncHandler(async (req: Request, res: Response) => {
  const result = await payoutService.editPayout(req.params.id, req.body);
  res.send(createResponse(result, "Payout updated sucssefully"));
});

export const deletePayout = asyncHandler(
  async (req: Request, res: Response) => {
    const result = await payoutService.deletePayout(req.params.id);
    res.send(createResponse(result, "Payout deleted sucssefully"));
  },
);

export const getPayoutById = asyncHandler(
  async (req: Request, res: Response) => {
    const result = await payoutService.getPayoutById(req.params.id);
    res.send(createResponse(result));
  },
);

export const getAllPayout = asyncHandler(
  async (req: Request, res: Response) => {
    const result = await payoutService.getAllPayout();
    res.send(createResponse(result));
  },
);
