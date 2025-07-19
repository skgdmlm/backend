import * as transactionService from "./transaction.service";
import { createResponse } from "../common/helper/response.hepler";
import asyncHandler from "express-async-handler";
import { type Request, type Response } from "express";
import createHttpError from "http-errors";

export const createTransaction = asyncHandler(
  async (req: Request, res: Response) => {
    const result = await transactionService.createTransaction(req.body);
    res.send(createResponse(result, "Transaction created sucssefully"));
  },
);

export const updateTransaction = asyncHandler(
  async (req: Request, res: Response) => {
    const result = await transactionService.updateTransaction(
      req.params.id,
      req.body,
    );
    res.send(createResponse(result, "Transaction updated sucssefully"));
  },
);

export const editTransaction = asyncHandler(
  async (req: Request, res: Response) => {
    const result = await transactionService.editTransaction(
      req.params.id,
      req.body,
    );
    res.send(createResponse(result, "Transaction updated sucssefully"));
  },
);

export const deleteTransaction = asyncHandler(
  async (req: Request, res: Response) => {
    const result = await transactionService.deleteTransaction(req.params.id);
    res.send(createResponse(result, "Transaction deleted sucssefully"));
  },
);

export const getTransactionById = asyncHandler(
  async (req: Request, res: Response) => {
    const result = await transactionService.getTransactionById(req.params.id);
    res.send(createResponse(result));
  },
);

export const getAllTransaction = asyncHandler(
  async (req: Request, res: Response) => {
    if (!req?.user) {
      throw createHttpError(400, {
        message: "Login first",
      });
    }
    const { skip = 0, limit = 10 } = req.query;
    const result = await transactionService.getAllTransaction(
      req.user._id,
      Number(skip),
      Number(limit),
    );
    const total = await transactionService.getAllTransactionCount(req.user._id);
    res.send(createResponse({ list: result, total }));
  },
);
export const getUserBalance = asyncHandler(
  async (req: Request, res: Response) => {
    if (!req?.user) {
      throw createHttpError(400, {
        message: "Login first",
      });
    }
    const { id } = req.query;
    console.log("id: ", id);
    const user = id ? id.toString() : req.user?._id!;
    console.log("user: ", user);
    const result = await transactionService.getLatestTransaction(user);
    console.log("result: ", result);
    const balance = result?.balance ?? 0;
    res.send(createResponse(balance));
  },
);
