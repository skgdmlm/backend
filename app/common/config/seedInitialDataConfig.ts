import { adminSeeder } from "../../../seeder/admin.seeder";
import { commissionRateSeeder } from "../../../seeder/commisionRate.seeder";
export const seedInitialData = async () => {
  try {
    await adminSeeder();
    await commissionRateSeeder();
  } catch (error) {
    console.log("error: ", error);
  }
};
