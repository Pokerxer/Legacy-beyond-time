import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import cloudinary, { CLOUDINARY_FOLDER } from "@/lib/cloudinary"
import { connectDB } from "@/lib/mongoose"
import { GalleryImage } from "@/lib/models/GalleryImage"

export async function POST(request: NextRequest) {
  const session = await getServerSession(authOptions)
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    await connectDB()
    const formData = await request.formData()
    const file = formData.get("file") as File | null
    const caption = (formData.get("caption") as string) || ""

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 })
    }

    const arrayBuffer = await file.arrayBuffer()
    const buffer = Buffer.from(arrayBuffer)
    const base64 = buffer.toString("base64")
    const dataUri = `data:${file.type};base64,${base64}`

    const result = await cloudinary.uploader.upload(dataUri, {
      folder: CLOUDINARY_FOLDER,
      resource_type: "auto",
    })

    const count = await GalleryImage.countDocuments()
    const image = await GalleryImage.create({
      url: result.secure_url,
      publicId: result.public_id,
      caption,
      width: result.width,
      height: result.height,
      format: result.format,
      order: count,
    })

    return NextResponse.json({
      _id: image._id,
      url: image.url,
      publicId: image.publicId,
      caption: image.caption,
      order: image.order,
    })
  } catch (error) {
    console.error("Cloudinary upload error:", error)
    return NextResponse.json({ error: "Upload failed" }, { status: 500 })
  }
}
