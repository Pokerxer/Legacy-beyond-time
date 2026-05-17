import mongoose, { Schema, Document } from "mongoose"

export interface IRSVP extends Document {
  name: string
  email: string
  phone?: string
  attendees: number
  attending: boolean
  message?: string
  createdAt: Date
}

const RSVPSchema = new Schema<IRSVP>(
  {
    name: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String },
    attendees: { type: Number, default: 1 },
    attending: { type: Boolean, default: true },
    message: { type: String },
  },
  { timestamps: true }
)

export const RSVP =
  mongoose.models.RSVP ?? mongoose.model<IRSVP>("RSVP", RSVPSchema)
