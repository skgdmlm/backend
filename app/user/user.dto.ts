import { type BaseSchema } from "../common/dto/base.dto";

export type BadgeType = "green" | "yellow";
export interface IUser extends BaseSchema {
  name?: string;
  email: string;
  active?: boolean;
  role: "USER" | "ADMIN";
  password?: string;
  refreshToken?: string;
  blocked?: boolean;
  blockReason?: string;
  provider: ProviderType;
  facebookId?: string;
  image?: string;
  linkedinId?: string;

  referrerId?: string | null;
  bankDetails?: string | null;
  badgeType: BadgeType;
  totalEarnings?: number;
  directReferralCount?: number;
  isPayoutEligible?: boolean;
  otp?: number
}

export enum ProviderType {
  GOOGLE = "google",
  MANUAL = "manual",
  FACEBOOK = "facebook",
  APPLE = "apple",
  LINKEDIN = "linkedin",
}
