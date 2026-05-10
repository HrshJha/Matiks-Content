"use client"

import { useEffect, useState } from "react"
import { Sun, Moon } from "lucide-react"

export function ThemeToggle() {
  // null = not yet mounted (avoids SSR/hydration mismatch)
  const [dark, setDark] = useState<boolean | null>(null)

  useEffect(() => {
    // Read the actual class state that was set by the inline script in layout.tsx
    const isDark = document.documentElement.classList.contains("dark")
    setDark(isDark)
  }, [])

  function toggle() {
    const next = !dark
    setDark(next)
    document.documentElement.classList.toggle("dark", next)
    localStorage.setItem("matiks-theme", next ? "dark" : "light")
  }

  // Don't render until mounted to avoid hydration mismatch
  if (dark === null) return null

  return (
    <button
      onClick={toggle}
      aria-label={dark ? "Switch to light mode" : "Switch to dark mode"}
      className="flex items-center gap-1.5 px-2 py-1 rounded border border-border bg-card text-muted-foreground hover:text-foreground hover:border-accent transition-colors"
    >
      {dark ? (
        <Sun className="size-3.5" />
      ) : (
        <Moon className="size-3.5" />
      )}
      <span className="font-mono text-[11px] hidden sm:inline">
        {dark ? "light" : "dark"}
      </span>
    </button>
  )
}
