import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { connectDB } from "@/lib/mongoose"
import { Tribute } from "@/lib/models/Tribute"
import { authOptions } from "@/lib/auth"

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getServerSession(authOptions)
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    const { id } = await params
    await connectDB()
    const body = await req.json()
    const tribute = await Tribute.findByIdAndUpdate(id, body, { new: true })
    if (!tribute) {
      return NextResponse.json({ error: "Tribute not found" }, { status: 404 })
    }
    return NextResponse.json(tribute)
  } catch {
    return NextResponse.json({ error: "Failed to update tribute" }, { status: 500 })
  }
}

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
    const tribute = await Tribute.findByIdAndDelete(id)
    if (!tribute) {
      return NextResponse.json({ error: "Tribute not found" }, { status: 404 })
    }
    return NextResponse.json({ message: "Deleted" })
  } catch {
    return NextResponse.json({ error: "Failed to delete tribute" }, { status: 500 })
  }
}
