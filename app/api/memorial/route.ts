import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { connectDB } from "@/lib/mongoose"
import { MemorialModel } from "@/lib/models/Memorial"
import { memorial as seed } from "@/data/memorial"

async function getOrSeed() {
  const doc = await MemorialModel.findOneAndUpdate(
    { slug: seed.slug },
    {
      $set: {
        slug: seed.slug,
        fullName: seed.fullName,
        shortName: seed.shortName,
        dateOfBirth: seed.dateOfBirth,
        dateOfDeath: seed.dateOfDeath,
        birthPlace: seed.birthPlace,
        coverPhoto: seed.coverPhoto,
        profilePhoto: seed.profilePhoto,
        biography: seed.biography,
        tagline: seed.tagline,
        legacyQuote: seed.legacyQuote,
        achievements: seed.achievements,
        family: seed.family,
        grandchildren: seed.grandchildren,
        funeralDetails: seed.funeralDetails,
        isPublished: seed.isPublished,
      },
    },
    { new: true, upsert: true }
  )
  return doc
}

export async function GET() {
  try {
    await connectDB()
    const doc = await getOrSeed()
    return NextResponse.json(doc)
  } catch (err) {
    console.error("Memorial fetch error:", err)
    return NextResponse.json({ error: "Failed to fetch memorial" }, { status: 500 })
  }
}

export async function PATCH(req: NextRequest) {
  const session = await getServerSession(authOptions)
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }
  try {
    await connectDB()
    const body = await req.json()
    const doc = await MemorialModel.findOneAndUpdate(
      { slug: seed.slug },
      { $set: body },
      { new: true, upsert: true }
    )
    return NextResponse.json(doc)
  } catch (err) {
    console.error("Memorial update error:", err)
    return NextResponse.json({ error: "Failed to update memorial" }, { status: 500 })
  }
}
