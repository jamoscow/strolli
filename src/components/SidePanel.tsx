import type { ReactNode } from 'react'

interface SidePanelProps {
  children: ReactNode
}

export default function SidePanel({ children }: SidePanelProps) {
  return (
    <aside className="hidden md:flex md:flex-col w-[380px] lg:w-[420px] h-full bg-panel-bg border-r border-muted-light/60 overflow-y-auto shadow-sm">
      <div className="p-6">
        {children}
      </div>
    </aside>
  )
}
