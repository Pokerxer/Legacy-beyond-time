import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { connectDB } from "@/lib/mongoose"
import { Candle } from "@/lib/models/Candle"

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getServerSession(authOptions)
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }
  try {
    const { id } = await params
    await connectDB()
    await Candle.findByIdAndDelete(id)
    return NextResponse.json({ message: "Deleted" })
  } catch {
    return NextResponse.json({ error: "Failed to delete" }, { status: 500 })
  }
}
