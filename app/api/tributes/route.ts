import { NextRequest, NextResponse } from "next/server"
import { connectDB } from "@/lib/mongoose"
import { Tribute } from "@/lib/models/Tribute"
import { sendTributeNotification, sendCondolenceNotification } from "@/lib/email"

export async function GET(req: NextRequest) {
  try {
    await connectDB()

    const { searchParams } = new URL(req.url)
    const category = searchParams.get("category")

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
    const category = body.category || "tribute"

    const tribute = await Tribute.create({
      memorialId: body.memorialId || "christiana-opara",
      authorName: body.authorName,
      authorEmail: body.authorEmail || "",
      location: body.location || "",
      relationship: body.relationship,
      category,
      message: body.message,
      whatTheyMiss: body.whatTheyMiss || "",
      impact: body.impact || "",
      isApproved: true,
    })

    if (category === "condolence") {
      sendCondolenceNotification({
        authorName: body.authorName,
        relationship: body.relationship,
        location: body.location || "",
        message: body.message,
      }).catch(() => {})
    } else {
      sendTributeNotification({
        authorName: body.authorName,
        relationship: body.relationship,
        message: body.message,
        email: body.authorEmail,
        location: body.location,
      }).catch(() => {})
    }

    return NextResponse.json(tribute, { status: 201 })
  } catch {
    return NextResponse.json({ error: "Failed to create" }, { status: 500 })
  }
}
