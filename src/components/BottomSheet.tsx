import { motion, useDragControls, useMotionValue, useTransform } from 'framer-motion'
import { useRef, type ReactNode } from 'react'

interface BottomSheetProps {
  children: ReactNode
}

export default function BottomSheet({ children }: BottomSheetProps) {
  const dragControls = useDragControls()
  const y = useMotionValue(0)
  const sheetRef = useRef<HTMLDivElement>(null)

  // Sheet snaps: peek (showing ~40%), half, full
  const peekY = typeof window !== 'undefined' ? window.innerHeight * 0.55 : 400
  const halfY = typeof window !== 'undefined' ? window.innerHeight * 0.3 : 200
  const fullY = 0

  const borderRadius = useTransform(y, [fullY, peekY], [0, 24])

  return (
    <motion.div
      ref={sheetRef}
      className="fixed bottom-0 left-0 right-0 bg-cream z-40 shadow-[0_-4px_30px_rgba(0,0,0,0.1)] overflow-hidden md:hidden"
      style={{
        y,
        borderTopLeftRadius: borderRadius,
        borderTopRightRadius: borderRadius,
        height: '85dvh',
      }}
      initial={{ y: peekY }}
      drag="y"
      dragControls={dragControls}
      dragConstraints={{ top: fullY, bottom: peekY }}
      dragElastic={0.1}
      onDragEnd={(_, info) => {
        const velocity = info.velocity.y
        const currentY = y.get()

        if (velocity > 300) {
          y.set(peekY)
        } else if (velocity < -300) {
          y.set(fullY)
        } else if (currentY < halfY) {
          y.set(fullY)
        } else {
          y.set(peekY)
        }
      }}
    >
      {/* Drag handle */}
      <div
        className="flex justify-center py-3 cursor-grab active:cursor-grabbing"
        onPointerDown={(e) => dragControls.start(e)}
      >
        <div className="w-10 h-1 rounded-full bg-muted-light" />
      </div>

      {/* Content */}
      <div className="overflow-y-auto h-full pb-20 px-5">
        {children}
      </div>
    </motion.div>
  )
}
