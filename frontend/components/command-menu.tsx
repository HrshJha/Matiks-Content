"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import { CommandIcon, LayoutDashboard, FileSearch, Radio, KanbanSquare, Sparkles, LineChart, Network, Settings } from "lucide-react"
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command"

export function CommandMenu() {
  const [open, setOpen] = React.useState(false)
  const router = useRouter()

  React.useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault()
        setOpen((open) => !open)
      }
    }

    document.addEventListener("keydown", down)
    return () => document.removeEventListener("keydown", down)
  }, [])

  const runCommand = React.useCallback((command: () => unknown) => {
    setOpen(false)
    command()
  }, [])

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="hidden sm:flex items-center gap-1.5 px-2 py-1 rounded border border-border bg-card font-mono text-[11px] text-muted-foreground hover:bg-accent/10 hover:text-foreground transition-colors"
      >
        <CommandIcon className="size-3" />
        <span>K</span>
      </button>

      <CommandDialog open={open} onOpenChange={setOpen}>
        <CommandInput placeholder="Type a command or search..." />
        <CommandList>
          <CommandEmpty>No results found.</CommandEmpty>
          <CommandGroup heading="Navigation">
            <CommandItem onSelect={() => runCommand(() => router.push("/"))}>
              <LayoutDashboard className="mr-2 size-4 text-muted-foreground" />
              <span>Overview</span>
            </CommandItem>
            <CommandItem onSelect={() => runCommand(() => router.push("/teardown"))}>
              <FileSearch className="mr-2 size-4 text-muted-foreground" />
              <span>Teardown</span>
            </CommandItem>
            <CommandItem onSelect={() => runCommand(() => router.push("/channels"))}>
              <Radio className="mr-2 size-4 text-muted-foreground" />
              <span>Channels</span>
            </CommandItem>
            <CommandItem onSelect={() => runCommand(() => router.push("/pipeline"))}>
              <KanbanSquare className="mr-2 size-4 text-muted-foreground" />
              <span>Pipeline</span>
            </CommandItem>
            <CommandItem onSelect={() => runCommand(() => router.push("/studio"))}>
              <Sparkles className="mr-2 size-4 text-accent" />
              <span>Studio</span>
            </CommandItem>
            <CommandItem onSelect={() => runCommand(() => router.push("/analytics"))}>
              <LineChart className="mr-2 size-4 text-muted-foreground" />
              <span>Analytics</span>
            </CommandItem>
            <CommandItem onSelect={() => runCommand(() => router.push("/architecture"))}>
              <Network className="mr-2 size-4 text-muted-foreground" />
              <span>Architecture</span>
            </CommandItem>
            <CommandItem onSelect={() => runCommand(() => router.push("/settings"))}>
              <Settings className="mr-2 size-4 text-muted-foreground" />
              <span>Settings</span>
            </CommandItem>
          </CommandGroup>
        </CommandList>
      </CommandDialog>
    </>
  )
}
