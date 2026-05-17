import { NextRequest, NextResponse } from "next/server"
import { connectDB } from "@/lib/mongoose"
import { Tribute } from "@/lib/models/Tribute"
import { sampleTributes } from "@/data/memorial"

const condolenceSeed = [
  {
    memorialId: "christiana-opara",
    authorName: "Rev. Fr. Michael Okafor",
    location: "Mbaise, Imo State",
    relationship: "Parish Priest",
    category: "condolence",
    message:
      "Mama Christiana was a pillar of our parish. Her faith, generosity, and motherly heart touched everyone who knew her. She gave so much of herself to God and to this community without ever asking for anything in return. May her soul rest in perfect peace, and may the Lord grant her family the grace to bear this loss with hope and courage.",
    isApproved: true,
    createdAt: new Date("2026-05-10"),
  },
  {
    memorialId: "christiana-opara",
    authorName: "CWO Mbaise Diocese",
    location: "Mbaise, Imo State",
    relationship: "Catholic Women Organisation",
    category: "condolence",
    message:
      "Our beloved mother and leader. You fought the good fight, you kept the faith. Heaven has gained a worthy angel. The legacy you built within our organisation will endure for generations. We will miss your wisdom, your laughter, and the warmth you brought to every gathering. Rest well, Mama.",
    isApproved: true,
    createdAt: new Date("2026-05-11"),
  },
  {
    memorialId: "christiana-opara",
    authorName: "Dr. & Mrs. Okonkwo",
    location: "Owerri, Imo State",
    relationship: "Family Friends",
    category: "condolence",
    message:
      "Mama's impact on our community is immeasurable. She was a true mother to all. We pray that God grants her eternal rest and grants the family the strength to bear this loss. Her kindness was legendary — she never turned anyone away from her door. We are blessed to have known her.",
    isApproved: true,
    createdAt: new Date("2026-05-12"),
  },
  {
    memorialId: "christiana-opara",
    authorName: "Chief Emeka Nwosu",
    location: "Abuja, FCT",
    relationship: "Community Leader",
    category: "condolence",
    message:
      "The world has lost a great woman and a servant of humanity. Chief Christiana was appointed Justice of the Peace not merely as a title — she lived justice every day. Her fairness, compassion and integrity set a standard we must all aspire to. May her memory be eternal.",
    isApproved: true,
    createdAt: new Date("2026-05-13"),
  },
  {
    memorialId: "christiana-opara",
    authorName: "Adaeze Iro-Obi",
    location: "Lagos, Nigeria",
    relationship: "Former Neighbour",
    category: "condolence",
    message:
      "I remember as a young girl how Mama Christiana would call me in from the street and give me food whenever she noticed I was hungry. She saw children and she saw them fully. I never forgot her kindness. I am heartbroken at this news. Rest in the arms of the Lord, Mama.",
    isApproved: true,
    createdAt: new Date("2026-05-14"),
  },
  {
    memorialId: "christiana-opara",
    authorName: "The Eze Family",
    location: "Port Harcourt, Rivers State",
    relationship: "Extended Family",
    category: "condolence",
    message:
      "We mourn alongside the Opara family and the entire Mbaise community. Mama was a unifying force whose love held many together. Though she is gone, the love she poured into this world continues to multiply. We hold her memory dear and we celebrate her extraordinary life.",
    isApproved: true,
    createdAt: new Date("2026-05-15"),
  },
]

export async function GET(req: NextRequest) {
  try {
    await connectDB()

    const { searchParams } = new URL(req.url)
    const category = searchParams.get("category")

    // Seed tributes if none exist
    const tributeCount = await Tribute.countDocuments({ category: "tribute" })
    if (tributeCount === 0) {
      const seedData = sampleTributes.map((t) => ({
        memorialId: t.memorialId,
        authorName: t.authorName,
        authorEmail: t.authorEmail,
        authorPhoto: t.authorPhoto || "",
        relationship: t.relationship,
        category: "tribute",
        message: t.message,
        whatTheyMiss: t.whatTheyMiss || "",
        impact: t.impact || "",
        isApproved: t.isApproved,
        createdAt: new Date(t.createdAt),
      }))
      await Tribute.insertMany(seedData)
    }

    // Seed condolences if none exist
    const condolenceCount = await Tribute.countDocuments({ category: "condolence" })
    if (condolenceCount === 0) {
      await Tribute.insertMany(condolenceSeed)
    }

    const filter = category ? { category } : {}
    const tributes = await Tribute.find(filter).sort({ createdAt: -1 })
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
      relationship: body.relationship,
      category: body.category || "tribute",
      message: body.message,
      whatTheyMiss: body.whatTheyMiss || "",
      impact: body.impact || "",
      isApproved: true,
    })
    return NextResponse.json(tribute, { status: 201 })
  } catch {
    return NextResponse.json({ error: "Failed to create" }, { status: 500 })
  }
}
