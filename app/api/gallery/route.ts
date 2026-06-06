import { NextResponse } from "next/server"
import { connectDB } from "@/lib/mongoose"
import { GalleryImage } from "@/lib/models/GalleryImage"

export async function GET() {
  try {
    await connectDB()
    const images = await GalleryImage.find().sort({ order: 1, createdAt: -1 }).lean()
    return NextResponse.json(images)
  } catch (error) {
    console.error("Gallery fetch error:", error)
    return NextResponse.json({ error: "Failed to fetch gallery" }, { status: 500 })
  }
}
