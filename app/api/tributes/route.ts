import { NextRequest, NextResponse } from "next/server"
import { connectDB } from "@/lib/mongoose"
import { Tribute } from "@/lib/models/Tribute"
import { sampleTributes } from "@/data/memorial"

export async function GET() {
  try {
    await connectDB()
    let tributes = await Tribute.find().sort({ createdAt: -1 })

    if (tributes.length === 0) {
      const seedData = sampleTributes.map((t) => ({
        memorialId: t.memorialId,
        authorName: t.authorName,
        authorEmail: t.authorEmail,
        authorPhoto: t.authorPhoto || "",
        relationship: t.relationship,
        message: t.message,
        whatTheyMiss: t.whatTheyMiss || "",
        impact: t.impact || "",
        isApproved: t.isApproved,
        createdAt: new Date(t.createdAt),
      }))
      await Tribute.insertMany(seedData)
      tributes = await Tribute.find().sort({ createdAt: -1 })
    }

    return NextResponse.json(tributes)
  } catch {
    return NextResponse.json({ error: "Failed to fetch tributes" }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    await connectDB()
    const body = await req.json()
    const tribute = await Tribute.create({
      memorialId: body.memorialId || "christiana-opara",
      authorName: body.authorName,
      authorEmail: body.authorEmail || "",
      location: body.location || "",
      relationship: body.relationship || "Condolence",
      message: body.message,
      whatTheyMiss: body.whatTheyMiss || "",
      impact: body.impact || "",
    })
    return NextResponse.json(tribute, { status: 201 })
  } catch {
    return NextResponse.json({ error: "Failed to create tribute" }, { status: 500 })
  }
}
