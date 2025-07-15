import * as commissionRateService from "./commissionRate.service";
import { createResponse } from "../common/helper/response.hepler";
import asyncHandler from "express-async-handler";
import { type Request, type Response } from "express";

export const createCommissionRate = asyncHandler(
  async (req: Request, res: Response) => {
    const result = await commissionRateService.createCommissionRate(req.body);
    res.send(createResponse(result, "CommissionRate created sucssefully"));
  },
);

export const updateCommissionRate = asyncHandler(
  async (req: Request, res: Response) => {
    const result = await commissionRateService.updateCommissionRate(
      req.params.id,
      req.body,
    );
    res.send(createResponse(result, "CommissionRate updated sucssefully"));
  },
);

export const editCommissionRate = asyncHandler(
  async (req: Request, res: Response) => {
    const result = await commissionRateService.editCommissionRate(
      req.params.id,
      req.body,
    );
    res.send(createResponse(result, "CommissionRate updated sucssefully"));
  },
);

export const deleteCommissionRate = asyncHandler(
  async (req: Request, res: Response) => {
    const result = await commissionRateService.deleteCommissionRate(
      req.params.id,
    );
    res.send(createResponse(result, "CommissionRate deleted sucssefully"));
  },
);

export const getCommissionRateById = asyncHandler(
  async (req: Request, res: Response) => {
    const result = await commissionRateService.getCommissionRateById(
      req.params.id,
    );
    res.send(createResponse(result));
  },
);

export const getAllCommissionRate = asyncHandler(
  async (req: Request, res: Response) => {
    const result = await commissionRateService.getAllCommissionRate();
    res.send(createResponse(result));
  },
);
