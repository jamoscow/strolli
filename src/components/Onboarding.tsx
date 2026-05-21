import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

interface OnboardingProps {
  onComplete: (duration: number) => void
}

const napOptions = [15, 20, 30, 45, 60, 90]

export default function Onboarding({ onComplete }: OnboardingProps) {
  const [visible, setVisible] = useState(true)

  const handleSelect = (minutes: number) => {
    setVisible(false)
    setTimeout(() => {
      localStorage.setItem('strolli-onboarded', 'true')
      onComplete(minutes)
    }, 300)
  }

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="fixed inset-0 z-[9999] flex items-center justify-center bg-gradient-to-b from-sage/95 to-sage-dark/95"
        >
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15, duration: 0.4 }}
            className="text-center px-6 max-w-md"
          >
            <h1 className="text-3xl font-bold text-white mb-2">Strolli</h1>
            <p className="text-white/70 text-sm mb-8">Brooklyn stroller walks for napping kids</p>

            <h2 className="text-lg font-semibold text-white mb-6">
              How long does your baby need to nap?
            </h2>

            <div className="grid grid-cols-3 gap-3">
              {napOptions.map(min => (
                <button
                  key={min}
                  onClick={() => handleSelect(min)}
                  className="py-4 px-3 rounded-2xl bg-white/15 hover:bg-white/25 active:bg-white/30 border border-white/20 text-white font-semibold text-lg transition-all"
                >
                  {min}<span className="text-sm font-normal ml-1">min</span>
                </button>
              ))}
            </div>

            <p className="text-white/50 text-xs mt-6">You can change this later</p>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
