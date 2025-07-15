import * as bankService from "./bank.service";
import { createResponse } from "../common/helper/response.hepler";
import asyncHandler from "express-async-handler";
import { type Request, type Response } from "express";

export const createBank = asyncHandler(async (req: Request, res: Response) => {
  const result = await bankService.createBank(req.body);
  res.send(createResponse(result, "Bank created sucssefully"));
});

export const updateBank = asyncHandler(async (req: Request, res: Response) => {
  const result = await bankService.updateBank(req.params.id, req.body);
  res.send(createResponse(result, "Bank updated sucssefully"));
});

export const editBank = asyncHandler(async (req: Request, res: Response) => {
  const result = await bankService.editBank(req.params.id, req.body);
  res.send(createResponse(result, "Bank updated sucssefully"));
});

export const deleteBank = asyncHandler(async (req: Request, res: Response) => {
  const result = await bankService.deleteBank(req.params.id);
  res.send(createResponse(result, "Bank deleted sucssefully"));
});

export const getBankById = asyncHandler(async (req: Request, res: Response) => {
  const result = await bankService.getBankById(req.params.id);
  res.send(createResponse(result));
});

export const getAllBank = asyncHandler(async (req: Request, res: Response) => {
  const result = await bankService.getAllBank();
  res.send(createResponse(result));
});
