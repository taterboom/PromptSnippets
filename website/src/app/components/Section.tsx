"use client"

import { motion } from "framer-motion"
import React from "react"

export default function Section(
  props: React.DetailedHTMLProps<React.HTMLAttributes<HTMLDivElement>, HTMLDivElement> & {
    delay?: number
  }
) {
  return (
    // @ts-ignore
    <motion.div
      {...props}
      initial={{
        y: 64,
        opacity: 0,
      }}
      whileInView={{ y: 0, opacity: 1 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.6, delay: props.delay }}
    >
      {props.children}
    </motion.div>
  )
}
