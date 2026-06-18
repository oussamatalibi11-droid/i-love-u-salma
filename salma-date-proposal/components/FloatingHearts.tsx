"use client";

import { useEffect, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";

type Heart = {
  id: number;
  left: number;
  size: number;
  duration: number;
  delay: number;
  emoji: string;
};

const EMOJIS = ["\u2764\uFE0F", "\uD83D\uDC95", "\uD83D\uDC96", "\uD83D\uDC97", "\uD83D\uDC9E", "\uD83E\uDE77"];

export default function FloatingHearts({ count = 18 }: { count?: number }) {
  const reduce = useReducedMotion();
  // Generated on the client only, so server/client markup always matches.
  const [hearts, setHearts] = useState<Heart[]>([]);

  useEffect(() => {
    const next = Array.from({ length: count }).map((_, i) => ({
      id: i,
      left: Math.random() * 100,
      size: 14 + Math.random() * 28,
      duration: 6 + Math.random() * 8,
      delay: Math.random() * 8,
      emoji: EMOJIS[Math.floor(Math.random() * EMOJIS.length)],
    }));
    setHearts(next);
  }, [count]);

  if (reduce) {
    // Gentle, static sprinkle for reduced-motion users.
    return (
      <div className="pointer-events-none fixed inset-0 overflow-hidden" aria-hidden>
        {hearts.map((h) => (
          <span
            key={h.id}
            className="absolute"
            style={{
              left: `${h.left}%`,
              top: `${(h.id * 9) % 100}%`,
              fontSize: h.size,
              opacity: 0.15,
            }}
          >
            {h.emoji}
          </span>
        ))}
      </div>
    );
  }

  return (
    <div className="pointer-events-none fixed inset-0 overflow-hidden" aria-hidden>
      {hearts.map((h) => (
        <motion.span
          key={h.id}
          className="absolute will-change-transform"
          style={{ left: `${h.left}%`, fontSize: h.size }}
          initial={{ y: "110vh", opacity: 0 }}
          animate={{ y: "-15vh", opacity: [0, 0.85, 0.85, 0] }}
          transition={{
            duration: h.duration,
            delay: h.delay,
            repeat: Infinity,
            ease: "linear",
          }}
        >
          {h.emoji}
        </motion.span>
      ))}
    </div>
  );
}
