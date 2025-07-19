import { Router } from "express";
import { catchError } from "../common/middleware/cath-error.middleware";
import * as referralsController from "./referrals.controller";
import * as referralsValidator from "./referrals.validation";

const router = Router();

router
  .get("/", referralsController.getAllReferrals)

export default router;
