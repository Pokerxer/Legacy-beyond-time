import mongoose, { Schema, Document } from "mongoose"

export interface IDonation extends Document {
  donorName: string
  donorEmail: string
  amount: string
  currency: string
  message?: string
  isAnonymous: boolean
  createdAt: Date
}

const DonationSchema = new Schema<IDonation>(
  {
    donorName: { type: String, required: true },
    donorEmail: { type: String, default: "" },
    amount: { type: String, default: "" },
    currency: { type: String, default: "NGN" },
    message: { type: String },
    isAnonymous: { type: Boolean, default: false },
  },
  { timestamps: true }
)

export const Donation =
  mongoose.models.Donation ?? mongoose.model<IDonation>("Donation", DonationSchema)
