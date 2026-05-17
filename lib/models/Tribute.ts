import mongoose, { Schema, Document } from "mongoose"

export interface ITribute extends Document {
  memorialId: string
  authorName: string
  authorEmail: string
  authorPhoto?: string
  location?: string
  relationship: string
  category: "tribute" | "condolence"
  message: string
  whatTheyMiss?: string
  impact?: string
  isApproved: boolean
  createdAt: Date
}

const TributeSchema = new Schema<ITribute>(
  {
    memorialId: { type: String, required: true, index: true },
    authorName: { type: String, required: true },
    authorEmail: { type: String, default: "" },
    authorPhoto: { type: String },
    location: { type: String },
    relationship: { type: String, required: true },
    category: { type: String, enum: ["tribute", "condolence"], default: "tribute" },
    message: { type: String, required: true },
    whatTheyMiss: { type: String },
    impact: { type: String },
    isApproved: { type: Boolean, default: false },
  },
  { timestamps: true }
)

export const Tribute =
  mongoose.models.Tribute ?? mongoose.model<ITribute>("Tribute", TributeSchema)
