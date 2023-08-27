import { PropsWithChildren } from "react"
import { motion } from "framer-motion"
import clsx from "classnames"

export function PopupContainer(
  props: PropsWithChildren<{ wrapperClassName?: string; onClick?: () => void }>
) {
  return (
    <div className="fixed inset-0 flex justify-center items-center z-10">
      <div className="absolute w-full h-full -z-10" onClick={props.onClick}></div>
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 10 }}
        transition={{ duration: 0.05 }}
        className={clsx(
          "menu-popup-shadow max-w-[92%] max-h-[80vh] overflow-y-auto p-4 rounded border border-neutral-200 bg-base-100 space-y-4",
          props.wrapperClassName
        )}
      >
        {props.children}
      </motion.div>
    </div>
  )
}
