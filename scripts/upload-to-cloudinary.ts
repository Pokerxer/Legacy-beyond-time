import fs from "fs"
import path from "path"
import { v2 as cloudinary } from "cloudinary"

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
})

const IMAGES_DIR = path.resolve("data/images")
const FOLDER = "forever-memorials"

async function main() {
  if (!process.env.CLOUDINARY_CLOUD_NAME) {
    console.error("Missing CLOUDINARY_CLOUD_NAME in .env")
    process.exit(1)
  }

  const files = fs.readdirSync(IMAGES_DIR).filter((f) => /\.(jpg|jpeg|png|webp|gif)$/i.test(f))
  console.log(`Found ${files.length} images to upload\n`)

  const results: { url: string; caption: string }[] = []

  for (let i = 0; i < files.length; i++) {
    const file = files[i]
    const filePath = path.join(IMAGES_DIR, file)
    const caption = `Gallery image ${i + 1}`

    process.stdout.write(`[${i + 1}/${files.length}] Uploading ${file}... `)

    try {
      const result = await cloudinary.uploader.upload(filePath, {
        folder: FOLDER,
        resource_type: "image",
      })

      results.push({ url: result.secure_url, caption })
      console.log(`✓ (${result.secure_url})`)
    } catch (err) {
      console.log(`✗ FAILED: ${err instanceof Error ? err.message : err}`)
    }
  }

  console.log(`\n--- UPLOAD COMPLETE ---`)
  console.log(`Successfully uploaded: ${results.length}/${files.length}`)

  // Generate gallery array for data/memorial.ts
  console.log(`\nCopy this into data/memorial.ts:\n`)
  console.log("gallery: [")
  results.forEach((r) => {
    console.log(`  { url: "${r.url}", caption: "${r.caption}", type: "photo" },`)
  })
  console.log("],")
}

main().catch(console.error)
