import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import cloudinary from "@/lib/cloudinary"
import { connectDB } from "@/lib/mongoose"
import { GalleryImage } from "@/lib/models/GalleryImage"

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getServerSession(authOptions)
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    await connectDB()
    const { id } = await params
    const { caption } = await request.json()

    if (caption === undefined) {
      return NextResponse.json({ error: "Caption is required" }, { status: 400 })
    }

    const image = await GalleryImage.findByIdAndUpdate(
      id,
      { caption },
      { new: true }
    )

    if (!image) {
      return NextResponse.json({ error: "Image not found" }, { status: 404 })
    }

    return NextResponse.json(image)
  } catch (error) {
    console.error("Gallery update error:", error)
    return NextResponse.json({ error: "Update failed" }, { status: 500 })
  }
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getServerSession(authOptions)
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    await connectDB()
    const { id } = await params

    const image = await GalleryImage.findById(id)
    if (!image) {
      return NextResponse.json({ error: "Image not found" }, { status: 404 })
    }

    await cloudinary.uploader.destroy(image.publicId)
    await GalleryImage.findByIdAndDelete(id)

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Gallery delete error:", error)
    return NextResponse.json({ error: "Delete failed" }, { status: 500 })
  }
}
