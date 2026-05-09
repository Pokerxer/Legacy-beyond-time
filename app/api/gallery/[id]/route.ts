import { NextRequest, NextResponse } from "next/server"
import cloudinary from "@/lib/cloudinary"

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params

    if (!id) {
      return NextResponse.json({ error: "No public ID provided" }, { status: 400 })
    }

    await cloudinary.uploader.destroy(id)

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Cloudinary delete error:", error)
    return NextResponse.json({ error: "Delete failed" }, { status: 500 })
  }
}
