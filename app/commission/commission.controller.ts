import * as commissionService from "./commission.service";
import { createResponse } from "../common/helper/response.hepler";
import asyncHandler from "express-async-handler";
import { type Request, type Response } from "express";

export const createCommission = asyncHandler(
  async (req: Request, res: Response) => {
    const result = await commissionService.createCommission(req.body);
    res.send(createResponse(result, "Commission created sucssefully"));
  },
);

export const updateCommission = asyncHandler(
  async (req: Request, res: Response) => {
    const result = await commissionService.updateCommission(
      req.params.id,
      req.body,
    );
    res.send(createResponse(result, "Commission updated sucssefully"));
  },
);

export const editCommission = asyncHandler(
  async (req: Request, res: Response) => {
    const result = await commissionService.editCommission(
      req.params.id,
      req.body,
    );
    res.send(createResponse(result, "Commission updated sucssefully"));
  },
);

export const deleteCommission = asyncHandler(
  async (req: Request, res: Response) => {
    const result = await commissionService.deleteCommission(req.params.id);
    res.send(createResponse(result, "Commission deleted sucssefully"));
  },
);

export const getCommissionById = asyncHandler(
  async (req: Request, res: Response) => {
    const result = await commissionService.getCommissionById(req.params.id);
    res.send(createResponse(result));
  },
);

export const getAllCommission = asyncHandler(
  async (req: Request, res: Response) => {
    const {skip=0, limit=10} = req.query;
    const user = req.user?._id!;
    
    const result = await commissionService.getAllCommission(user, Number(skip), Number(limit));
    const total = await commissionService.getAllCommissionCount(user);
    res.send(createResponse({list: result, total}));
  },
);
export const getUserCommission = asyncHandler(
  async (req: Request, res: Response) => {
    const {id} = req.query;
    const user = id ? id.toString() : req.user?._id!;
    
    const result = await commissionService.getTotalCommission(user);
    res.send(createResponse(result));
  },
);
