import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { connectDB } from "@/lib/mongoose"
import { Donation } from "@/lib/models/Donation"

export async function GET() {
  const session = await getServerSession(authOptions)
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    await connectDB()
    const donations = await Donation.find().sort({ createdAt: -1 })
    return NextResponse.json(donations)
  } catch {
    return NextResponse.json({ error: "Failed to fetch donations" }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    await connectDB()
    const body = await req.json()
    const donation = await Donation.create({
      donorName: body.donorName,
      donorEmail: body.donorEmail || "",
      amount: body.amount || "",
      currency: body.currency || "NGN",
      message: body.message || "",
      isAnonymous: body.isAnonymous || false,
    })
    return NextResponse.json(donation, { status: 201 })
  } catch {
    return NextResponse.json({ error: "Failed to create donation" }, { status: 500 })
  }
}
