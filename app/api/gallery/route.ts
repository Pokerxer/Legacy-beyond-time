import { NextResponse } from "next/server"
import { connectDB } from "@/lib/mongoose"
import { GalleryImage } from "@/lib/models/GalleryImage"
import { memorial } from "@/data/memorial"

function extractPublicId(url: string): string {
  const match = url.match(/\/v\d+\/(.+?)\.\w+$/)
  return match ? match[1] : url
}

export async function GET() {
  try {
    await connectDB()
    let images = await GalleryImage.find().sort({ order: 1, createdAt: -1 }).lean()

    if (images.length === 0) {
      const ops = memorial.gallery.map((item, i) => ({
        updateOne: {
          filter: { publicId: extractPublicId(item.url) },
          update: { $setOnInsert: { url: item.url, publicId: extractPublicId(item.url), caption: item.caption, order: i } },
          upsert: true,
        },
      }))
      await GalleryImage.bulkWrite(ops, { ordered: false })
      images = await GalleryImage.find().sort({ order: 1 }).lean()
    }

    return NextResponse.json(images)
  } catch (error) {
    console.error("Gallery fetch error:", error)
    return NextResponse.json({ error: "Failed to fetch gallery" }, { status: 500 })
  }
}
