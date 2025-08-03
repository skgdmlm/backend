import bcrypt from "bcryptjs";
import mongoose from "mongoose";
import { ProviderType, type IUser } from "./user.dto";

const Schema = mongoose.Schema;

export const hashPassword = async (password: string) => {
  const hash = await bcrypt.hash(password, 12);
  return hash;
};

const UserSchema = new Schema<IUser>(
  {
    name: { type: String },
    phone: { type: String },
    email: { type: String, unique: true },
    active: { type: Boolean, required: false, default: true },
    role: {
      type: String,
      required: true,
      enum: ["USER", "ADMIN"],
      default: "USER",
    },
    password: { type: String, select: false },
    refreshToken: { type: String, required: false, default: "", select: false },
    blocked: { type: Boolean, default: false },
    blockReason: { type: String, default: "" },
    provider: {
      type: String,
      enum: Object.values(ProviderType),
      default: ProviderType.MANUAL,
    },
    facebookId: { type: String, select: false },
    image: { type: String },
    linkedinId: { type: String, select: false },

    referrerId: { type: Schema.Types.ObjectId, ref: "user", default: null },
    bankDetails: { type: Schema.Types.ObjectId, ref: "bank", default: null },
    badgeType: {
      type: String,
      enum: ["green", "yellow"],
      default: "green",
    },
    totalEarnings: { type: Number, default: 0 },
    directReferralCount: { type: Number, default: 0 },
    isPayoutEligible: { type: Boolean, default: false },
    otp: { type: Number },
  },
  { timestamps: true },
);

UserSchema.pre("save", async function (next) {
  if (this.password) {
    this.password = await hashPassword(this.password);
  }
  next();
});

export default mongoose.model<IUser>("user", UserSchema);
