export interface Achievement {
  title: string
  description: string
  year: number
}

export interface GalleryItem {
  url: string
  caption: string
  type: "photo" | "video"
}

export interface FuneralDetails {
  date: string
  time: string
  venue: string
  address: string
  livestreamUrl?: string
}

export interface FamilyMember {
  relation: string
  name: string
}

export interface Tribute {
  _id: string
  memorialId: string
  authorName: string
  authorEmail: string
  authorPhoto?: string
  relationship: string
  message: string
  whatTheyMiss: string
  impact: string
  isApproved: boolean
  createdAt: string
}

export interface Memorial {
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
  achievements: Achievement[]
  gallery: GalleryItem[]
  funeralDetails: FuneralDetails | null
  family: FamilyMember[]
  grandchildren: string[]
  legacyQuote: string
  isPublished: boolean
}
