"use client"

import { useEffect, useState } from "react"
import { Sun, Moon } from "lucide-react"

export function ThemeToggle() {
  const [dark, setDark] = useState(true)

  // On mount, read saved preference or default to dark
  useEffect(() => {
    const saved = localStorage.getItem("matiks-theme")
    const isDark = saved ? saved === "dark" : true
    setDark(isDark)
    document.documentElement.classList.toggle("dark", isDark)
  }, [])

  function toggle() {
    const next = !dark
    setDark(next)
    document.documentElement.classList.toggle("dark", next)
    localStorage.setItem("matiks-theme", next ? "dark" : "light")
  }

  return (
    <button
      onClick={toggle}
      aria-label="Toggle theme"
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
