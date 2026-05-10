import mongoose, { Schema, Document } from "mongoose"

export interface IGalleryImage extends Document {
  url: string
  publicId: string
  caption: string
  width?: number
  height?: number
  format?: string
  order: number
  createdAt: Date
}

const GalleryImageSchema = new Schema<IGalleryImage>(
  {
    url: { type: String, required: true },
    publicId: { type: String, required: true, unique: true },
    caption: { type: String, default: "" },
    width: { type: Number },
    height: { type: Number },
    format: { type: String },
    order: { type: Number, default: 0 },
  },
  { timestamps: true }
)

export const GalleryImage =
  mongoose.models.GalleryImage ?? mongoose.model<IGalleryImage>("GalleryImage", GalleryImageSchema)
