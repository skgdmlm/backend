import * as commissionRateService from "../app/commissionRate/commissionRate.service";
import { Types } from "mongoose";
import { admin } from "../data/admin";
import { ProviderType } from "../app/user/user.dto";
import { rates } from "../data/comissionRates";
import { ICommissionRate } from "../app/commissionRate/commissionRate.dto";

export const commissionRateSeeder = async (): Promise<void> => {
  try {
    const count = await commissionRateService.getAllCommissionRateCount();
    const comissionRates = Object.keys(rates).map((level) => ({
      level: Number(level),
      percentage: rates[Number(level)],
    }));
    if (count == 0) {
      await commissionRateService.createBulkCommissionRate(comissionRates);
      console.log("Commission rates seeder success.");
    } else {
      console.log("Commission rates already exists.");
    }
  } catch (error) {
    console.log("Error seeding commission rates:", error);
  }
};
