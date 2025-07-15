import { Router } from "express";
import { catchError } from "../common/middleware/cath-error.middleware";
import * as commissionController from "./commission.controller";
import * as commissionValidator from "./commission.validation";

const router = Router();

router
  .get("/", commissionController.getAllCommission)
  .get("/total", commissionController.getUserCommission)
  .get("/:id", commissionController.getCommissionById)
  .delete("/:id", commissionController.deleteCommission)
  .post(
    "/",
    commissionValidator.createCommission,
    catchError,
    commissionController.createCommission,
  )
  .put(
    "/:id",
    commissionValidator.updateCommission,
    catchError,
    commissionController.updateCommission,
  )
  .patch(
    "/:id",
    commissionValidator.editCommission,
    catchError,
    commissionController.editCommission,
  );

export default router;
