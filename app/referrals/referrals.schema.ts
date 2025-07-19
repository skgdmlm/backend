import mongoose from "mongoose";
import { type IReferrals } from "./referrals.dto";

const Schema = mongoose.Schema;

const ReferralsSchema = new Schema<IReferrals>({
    pin: { type: String, unique: true, required: true },
    referrerId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    isUsed: { type: Boolean, default: false },
    usedBy: { type: Schema.Types.ObjectId, ref: 'User', default: null },
    expiresAt: { type: Date },
    badgeType: {
        type: String,
        enum: ["green", "yellow"],
        default: "green",
    },

}, { timestamps: true });

export default mongoose.model<IReferrals>("referrals", ReferralsSchema);
