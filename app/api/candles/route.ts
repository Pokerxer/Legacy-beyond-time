import { NextRequest, NextResponse } from "next/server"
import { connectDB } from "@/lib/mongoose"
import { Candle } from "@/lib/models/Candle"

export async function GET() {
  try {
    await connectDB()
    const candles = await Candle.find().sort({ createdAt: -1 })
    return NextResponse.json(candles)
  } catch {
    return NextResponse.json({ error: "Failed to fetch candles" }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    await connectDB()
    const body = await req.json()
    if (!body.name?.trim()) {
      return NextResponse.json({ error: "Name is required" }, { status: 400 })
    }
    const candle = await Candle.create({
      name: body.name.trim(),
      message: body.message?.trim() || "",
    })
    return NextResponse.json(candle, { status: 201 })
  } catch {
    return NextResponse.json({ error: "Failed to light candle" }, { status: 500 })
  }
}
