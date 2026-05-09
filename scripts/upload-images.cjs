const cloudinary = require("cloudinary").v2
const fs = require("fs")
const path = require("path")

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
})

const IMAGES_DIR = path.resolve("data/images")
const FOLDER = "forever-memorials"

async function main() {
  const files = fs.readdirSync(IMAGES_DIR).filter((f) => /\.(jpg|jpeg|png|webp|gif)$/i.test(f))
  console.log(`Found ${files.length} images to upload\n`)

  const results = []

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
      console.log(`OK`)
    } catch (err) {
      console.log(`FAILED: ${err.message}`)
    }
  }

  console.log(`\n--- COMPLETE: ${results.length}/${files.length} uploaded ---\n`)

  const gallery = results.map((r) => `  { url: "${r.url}", caption: "${r.caption}", type: "photo" },`).join("\n")
  console.log("gallery: [\n" + gallery + "\n],")
}

main().catch(console.error)
