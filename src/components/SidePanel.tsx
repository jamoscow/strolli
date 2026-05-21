import type { ReactNode } from 'react'

interface SidePanelProps {
  children: ReactNode
}

export default function SidePanel({ children }: SidePanelProps) {
  return (
    <aside className="hidden md:flex md:flex-col w-[380px] lg:w-[420px] h-full bg-cream border-r border-muted-light overflow-y-auto">
      <div className="p-6">
        {children}
      </div>
    </aside>
  )
}
