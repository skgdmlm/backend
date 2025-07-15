import { Router } from "express";
import { catchError } from "../common/middleware/cath-error.middleware";
import * as bankController from "./bank.controller";
import * as bankValidator from "./bank.validation";

const router = Router();

router
  .get("/", bankController.getAllBank)
  .get("/:id", bankController.getBankById)
  .delete("/:id", bankController.deleteBank)
  .post("/", bankValidator.createBank, catchError, bankController.createBank)
  .put("/:id", bankValidator.updateBank, catchError, bankController.updateBank)
  .patch("/:id", bankValidator.editBank, catchError, bankController.editBank);

export default router;
