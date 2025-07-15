import { Router } from "express";
import { catchError } from "../common/middleware/cath-error.middleware";
import * as payoutController from "./payout.controller";
import * as payoutValidator from "./payout.validation";
import { roleAuth } from "../common/middleware/role-auth.middleware";

const router = Router();

router
  .get("/", payoutController.getAllPayout)
  .get("/:id", payoutController.getPayoutById)
  .delete("/:id", payoutController.deletePayout)
  .post(
    "/",
    payoutValidator.createPayout,
    catchError,
    payoutController.createPayout,
  )
  .post(
    "/process",
    roleAuth(["ADMIN"]),
    payoutValidator.processPayout,
    catchError,
    payoutController.processPayout,
  )
  .put(
    "/:id",
    payoutValidator.updatePayout,
    catchError,
    payoutController.updatePayout,
  )
  .patch(
    "/:id",
    payoutValidator.editPayout,
    catchError,
    payoutController.editPayout,
  );

export default router;
