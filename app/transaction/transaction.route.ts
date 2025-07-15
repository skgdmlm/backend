import { Router } from "express";
import { catchError } from "../common/middleware/cath-error.middleware";
import * as transactionController from "./transaction.controller";
import * as transactionValidator from "./transaction.validation";

const router = Router();

router
  .get("/", transactionController.getAllTransaction)
  .get("/balance", transactionController.getUserBalance)
  .get("/:id", transactionController.getTransactionById)
  .delete("/:id", transactionController.deleteTransaction)
  .post(
    "/",
    transactionValidator.createTransaction,
    catchError,
    transactionController.createTransaction,
  )
  .put(
    "/:id",
    transactionValidator.updateTransaction,
    catchError,
    transactionController.updateTransaction,
  )
  .patch(
    "/:id",
    transactionValidator.editTransaction,
    catchError,
    transactionController.editTransaction,
  );

export default router;
