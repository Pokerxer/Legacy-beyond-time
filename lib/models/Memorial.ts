import mongoose, { Schema, Document } from "mongoose"

export interface IMemorial extends Document {
  slug: string
  fullName: string
  shortName: string
  dateOfBirth: string
  dateOfDeath: string
  birthPlace: string
  coverPhoto: string
  profilePhoto: string
  biography: string
  tagline: string
  legacyQuote: string
  achievements: { title: string; description: string; year: number }[]
  family: { relation: string; name: string }[]
  grandchildren: string[]
  funeralDetails: {
    date: string
    time: string
    venue: string
    address: string
    livestreamUrl?: string
  } | null
  isPublished: boolean
}

const MemorialSchema = new Schema<IMemorial>(
  {
    slug: { type: String, required: true, unique: true, index: true },
    fullName: { type: String, required: true },
    shortName: { type: String, required: true },
    dateOfBirth: { type: String, required: true },
    dateOfDeath: { type: String, required: true },
    birthPlace: { type: String, default: "" },
    coverPhoto: { type: String, default: "" },
    profilePhoto: { type: String, default: "" },
    biography: { type: String, default: "" },
    tagline: { type: String, default: "" },
    legacyQuote: { type: String, default: "" },
    achievements: [
      {
        _id: false,
        title: String,
        description: String,
        year: Number,
      },
    ],
    family: [
      {
        _id: false,
        relation: String,
        name: String,
      },
    ],
    grandchildren: [String],
    funeralDetails: {
      type: new Schema(
        {
          date: String,
          time: String,
          venue: String,
          address: String,
          livestreamUrl: String,
        },
        { _id: false }
      ),
      default: null,
    },
    isPublished: { type: Boolean, default: true },
  },
  { timestamps: true }
)

export const MemorialModel =
  mongoose.models.Memorial ?? mongoose.model<IMemorial>("Memorial", MemorialSchema)
