import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { connectDB } from "@/lib/mongoose"
import { DonationInfo } from "@/lib/models/DonationInfo"

const defaultInfo = {
  bankName: "First Bank of Nigeria PLC",
  accountName: "Chief Christiana O. Opara Memorial",
  accountNumber: "1234567890",
  sortCode: "011",
}

export async function GET() {
  try {
    await connectDB()
    let info = await DonationInfo.findOne()
    if (!info) {
      info = await DonationInfo.create(defaultInfo)
    }
    return NextResponse.json(info)
  } catch {
    return NextResponse.json({ error: "Failed to fetch donation info" }, { status: 500 })
  }
}

export async function PATCH(request: NextRequest) {
  const session = await getServerSession(authOptions)
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    await connectDB()
    const body = await request.json()
    let info = await DonationInfo.findOne()
    if (!info) {
      info = await DonationInfo.create({ ...defaultInfo, ...body })
    } else {
      Object.assign(info, body)
      await info.save()
    }
    return NextResponse.json(info)
  } catch (error) {
    console.error("Donation info update error:", error)
    return NextResponse.json({ error: "Update failed" }, { status: 500 })
  }
}
