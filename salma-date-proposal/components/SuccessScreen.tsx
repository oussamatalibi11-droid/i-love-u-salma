"use client";

import { motion } from "framer-motion";
import { SUCCESS_TITLE, SUCCESS_SUBTITLE, SUCCESS_MESSAGE } from "@/lib/config";

export default function SuccessScreen({
  onRestart,
}: {
  onRestart: () => void;
}) {
  return (
    <motion.div
      className="relative w-full max-w-md rounded-[2rem] border border-white/20 bg-white/10 p-8 text-center shadow-2xl backdrop-blur-xl sm:p-10"
      initial={{ opacity: 0, scale: 0.9, y: 20 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95, y: -10 }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
    >
      <motion.div
        className="mx-auto mb-2 text-6xl"
        animate={{ scale: [1, 1.18, 1] }}
        transition={{ duration: 1.2, repeat: Infinity, ease: "easeInOut" }}
      >
        {"\u2764\uFE0F"}
      </motion.div>

      <motion.h1
        className="font-display text-4xl font-black leading-tight text-white sm:text-5xl"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15 }}
      >
        {SUCCESS_TITLE}
      </motion.h1>

      <motion.p
        className="mt-4 text-lg font-semibold text-white/95"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.28 }}
      >
        {SUCCESS_SUBTITLE}
      </motion.p>

      <motion.p
        className="mt-3 text-pretty text-sm leading-relaxed text-white/80"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
      >
        {SUCCESS_MESSAGE}
      </motion.p>

      <motion.button
        type="button"
        onClick={onRestart}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.55 }}
        whileHover={{ scale: 1.04 }}
        whileTap={{ scale: 0.96 }}
        className="mt-8 inline-flex items-center justify-center gap-2 rounded-full bg-white/15 px-6 py-3 text-sm font-semibold text-white ring-1 ring-white/30 transition hover:bg-white/25 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
      >
        Start over {"\uD83D\uDD04"}
      </motion.button>
    </motion.div>
  );
}
