import mongoose, { Schema, Document } from "mongoose"

export interface ICandle extends Document {
  name: string
  message?: string
  createdAt: Date
}

const CandleSchema = new Schema<ICandle>(
  {
    name: { type: String, required: true },
    message: { type: String },
  },
  { timestamps: true }
)

export const Candle =
  mongoose.models.Candle ?? mongoose.model<ICandle>("Candle", CandleSchema)
