import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { connectDB } from "@/lib/mongoose"
import { RSVP } from "@/lib/models/RSVP"

export async function GET() {
  const session = await getServerSession(authOptions)
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }
  try {
    await connectDB()
    const rsvps = await RSVP.find().sort({ createdAt: -1 })
    return NextResponse.json(rsvps)
  } catch {
    return NextResponse.json({ error: "Failed to fetch RSVPs" }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    await connectDB()
    const body = await req.json()
    const rsvp = await RSVP.create({
      name: body.name,
      email: body.email,
      phone: body.phone || "",
      attendees: Number(body.attendees) || 1,
      attending: body.attending !== false,
      message: body.message || "",
    })
    return NextResponse.json(rsvp, { status: 201 })
  } catch {
    return NextResponse.json({ error: "Failed to save RSVP" }, { status: 500 })
  }
}
