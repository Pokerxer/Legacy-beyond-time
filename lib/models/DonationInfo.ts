import mongoose, { Schema, Document } from "mongoose"

export interface IDonationInfo extends Document {
  bankName: string
  accountName: string
  accountNumber: string
  sortCode: string
  bankName2?: string
  accountName2?: string
  accountNumber2?: string
  sortCode2?: string
  usdInstructions?: string
  additionalInfo?: string
}

const DonationInfoSchema = new Schema<IDonationInfo>(
  {
    bankName: { type: String, required: true },
    accountName: { type: String, required: true },
    accountNumber: { type: String, required: true },
    sortCode: { type: String, default: "" },
    bankName2: { type: String },
    accountName2: { type: String },
    accountNumber2: { type: String },
    sortCode2: { type: String },
    usdInstructions: { type: String },
    additionalInfo: { type: String },
  },
  { timestamps: true }
)

export const DonationInfo =
  mongoose.models.DonationInfo ?? mongoose.model<IDonationInfo>("DonationInfo", DonationInfoSchema)
