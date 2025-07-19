import express from "express";
import userRoutes from "./user/user.route";
import commissionRoutes from "./commission/commission.route";
import payoutRoutes from "./payout/payout.route";
import transactionRoutes from "./transaction/transaction.route";
import referralRoutes from "./referrals/referrals.route";
import { roleAuth } from "./common/middleware/role-auth.middleware";

// routes
const router = express.Router();

router.use("/users", userRoutes);
router.use("/commission", roleAuth(["USER", "ADMIN"]), commissionRoutes);
router.use("/payout", roleAuth(["ADMIN"]), payoutRoutes);
router.use("/transaction", roleAuth(["ADMIN", "USER"]), transactionRoutes);
router.use("/referrals", roleAuth(["ADMIN", "USER"]), referralRoutes);
export default router;
