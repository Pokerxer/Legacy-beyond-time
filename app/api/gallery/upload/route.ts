import { NextRequest, NextResponse } from "next/server"
import cloudinary, { CLOUDINARY_FOLDER } from "@/lib/cloudinary"

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const file = formData.get("file") as File | null

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

    return NextResponse.json({
      url: result.secure_url,
      publicId: result.public_id,
      width: result.width,
      height: result.height,
      format: result.format,
    })
  } catch (error) {
    console.error("Cloudinary upload error:", error)
    return NextResponse.json({ error: "Upload failed" }, { status: 500 })
  }
}
