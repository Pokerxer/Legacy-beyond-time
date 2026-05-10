import { NextRequest, NextResponse } from "next/server"
import { connectDB } from "@/lib/mongoose"
import { Tribute } from "@/lib/models/Tribute"
import { sampleTributes } from "@/data/memorial"

const condolenceSeed = [
  {
    memorialId: "christiana-opara",
    authorName: "Rev. Fr. Michael Okafor",
    location: "Mbaise, Imo State",
    relationship: "Condolence",
    message:
      "Mama Christiana was a pillar of our parish. Her faith, generosity, and motherly heart touched everyone who knew her. May her soul rest in perfect peace.",
    isApproved: true,
    createdAt: new Date("2026-05-10"),
  },
  {
    memorialId: "christiana-opara",
    authorName: "CWO Mbaise Diocese",
    location: "Mbaise, Imo State",
    relationship: "Condolence",
    message:
      "Our beloved mother and leader. You fought the good fight, you kept the faith. Heaven has gained a worthy angel. We will miss you dearly.",
    isApproved: true,
    createdAt: new Date("2026-05-11"),
  },
  {
    memorialId: "christiana-opara",
    authorName: "Dr. & Mrs. Okonkwo",
    location: "Owerri, Imo State",
    relationship: "Condolence",
    message:
      "Mama's impact on our community is immeasurable. She was a true mother to all. We pray that God grants her eternal rest and grants the family the strength to bear this loss.",
    isApproved: true,
    createdAt: new Date("2026-05-12"),
  },
]

export async function GET() {
  try {
    await connectDB()

    // Seed sample tributes if DB is completely empty
    const count = await Tribute.countDocuments()
    if (count === 0) {
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
    }

    // Seed condolence letters if none exist
    const condolenceCount = await Tribute.countDocuments({ relationship: "Condolence" })
    if (condolenceCount === 0) {
      await Tribute.insertMany(condolenceSeed)
    }

    const tributes = await Tribute.find().sort({ createdAt: -1 })
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
