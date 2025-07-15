import { body } from "express-validator";
import * as commissionService from "../commission/commission.service";


export const createPayout = [
  body("amount")
    .notEmpty()
    .withMessage("Amount is required")
    .isNumeric()
    .withMessage("Amount must be valid"),
];
export const processPayout = [
  body("payoutId"),
  body("bankDetails")
];

export const updatePayout = [];

export const editPayout = [];
