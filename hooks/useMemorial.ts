"use client"

import { useState, useEffect } from "react"
import { memorial as staticData } from "@/data/memorial"
import type { Memorial } from "@/types"

// One fetch per browser session shared across all components
let _cache: Memorial | null = null

export function useMemorial(): Memorial {
  const [data, setData] = useState<Memorial>((_cache ?? staticData) as Memorial)

  useEffect(() => {
    if (_cache) {
      setData(_cache)
      return
    }
    fetch("/api/memorial")
      .then((r) => r.json())
      .then((d: Memorial) => {
        _cache = d
        setData(d)
      })
      .catch(() => {})
  }, [])

  return data
}
