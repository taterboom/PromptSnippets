import { PropsWithChildren } from "react"
import { motion } from "framer-motion"

export function PopupContainer(props: PropsWithChildren) {
  return (
    <div className="fixed inset-0 flex justify-center items-center">
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 10 }}
        transition={{ duration: 0.05 }}
        className="menu-popup-shadow p-4 rounded border border-neutral-200 bg-base-100 space-y-4"
      >
        {props.children}
      </motion.div>
    </div>
  )
}
