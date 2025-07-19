import * as userService from "../app/user/user.service";
import { Types } from "mongoose";
import { admin } from "../data/admin";
import { ProviderType } from "../app/user/user.dto";

export const adminSeeder = async (): Promise<void> => {
  try {
    const { email, password, name } = admin;
    if (email && password) {
      const existingUser = await userService.getUserByEmail(email);
      if (!existingUser) {
        await userService.createUser({
          email,
          password,
          role: "ADMIN",
          name,
          provider: ProviderType.MANUAL,
          badgeType: "green",
          active: true,
          blocked: false,
        });
        console.log("Admin seeder success.");
      } else {
        console.log("Admin already exists.");
      }
    }
  } catch (error) {
    console.log("Error seeding admin:", error);
  }
};
