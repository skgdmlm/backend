import * as referralsService from "./referrals.service";
import { createResponse } from "../common/helper/response.hepler";
import asyncHandler from "express-async-handler";
import { type Request, type Response } from "express";
import createHttpError from "http-errors";



export const getAllReferrals = asyncHandler(
  async (req: Request, res: Response) => {
       if (!req?.user) {
         throw createHttpError(400, {
           message: "Login first",
          });
        }
        
        const { skip = 0, limit = 10 } = req.query;
        const result = await referralsService.getAllReferrals(
          req.user._id,
          Number(skip),
          Number(limit),
        );
        const total = await referralsService.getAllReferralsCount(req.user._id);
        res.send(createResponse({ list: result, total }));
    
  },
);
