"use client"

import { useEffect } from "react"
import { analytics } from "@/lib/firebase"
import { logEvent } from "firebase/analytics"

export function AnalyticsProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    if (analytics) {
      logEvent(analytics, "page_view")
    }
  }, [])

  return <>{children}</>
}
