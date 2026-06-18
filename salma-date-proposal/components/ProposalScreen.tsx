"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { motion, useAnimationControls, useReducedMotion } from "framer-motion";
import { QUESTION, FAIL_MESSAGES } from "@/lib/config";
import { fireConfetti } from "@/lib/confetti";

const PROXIMITY = 100; // how close (px) the pointer can get before NO bolts
const COUNT_COOLDOWN = 140; // ms between counted attempts (keeps the tally sane)
const DODGE_THROTTLE = 50; // ms between repositions (smooth, still uncatchable)

export default function ProposalScreen({ onAccept }: { onAccept: () => void }) {
  const reduce = useReducedMotion();

  const noRef = useRef<HTMLButtonElement | null>(null);
  const cardRef = useRef<HTMLDivElement | null>(null);
  const [escaped, setEscaped] = useState(false);
  const [pos, setPos] = useState({ x: 0, y: 0 });
  const [attempts, setAttempts] = useState(0);
  const [mounted, setMounted] = useState(false);

  const lastDodge = useRef(0);
  const lastCount = useRef(0);
  const yesShake = useAnimationControls();

  useEffect(() => setMounted(true), []);

  // Pick a random spot that keeps the whole button on screen AND never
  // overlaps the card. We place it in one of the free "bands" around the card
  // (top / bottom / left / right), weighted by how much room each one has.
  const pickPosition = useCallback(() => {
    const el = noRef.current;
    const w = el?.offsetWidth ?? 120;
    const h = el?.offsetHeight ?? 52;
    const W = window.innerWidth;
    const H = window.innerHeight;
    const pad = 12; // gap from the screen edges
    const gap = 16; // gap between the button and the card

    const card = cardRef.current?.getBoundingClientRect();

    // No card yet (shouldn't happen post-mount): just stay on screen.
    if (!card) {
      return {
        x: pad + Math.random() * Math.max(0, W - w - pad * 2),
        y: pad + Math.random() * Math.max(0, H - h - pad * 2),
      };
    }

    const block = {
      left: card.left - gap,
      top: card.top - gap,
      right: card.right + gap,
      bottom: card.bottom + gap,
    };

    // Each region is the allowed range for the button's top-left corner.
    type Region = { x0: number; x1: number; y0: number; y1: number; area: number };
    const regions: Region[] = [];
    const add = (x0: number, x1: number, y0: number, y1: number) => {
      if (x1 >= x0 && y1 >= y0) {
        regions.push({ x0, x1, y0, y1, area: (x1 - x0 + 1) * (y1 - y0 + 1) });
      }
    };

    add(pad, W - w - pad, pad, block.top - h); // above the card
    add(pad, W - w - pad, block.bottom, H - h - pad); // below the card
    add(pad, block.left - w, pad, H - h - pad); // left of the card
    add(block.right, W - w - pad, pad, H - h - pad); // right of the card

    // Fallback: card nearly fills the screen — drop it in the roomiest side.
    if (regions.length === 0) {
      const clamp = (v: number, lo: number, hi: number) =>
        Math.max(lo, Math.min(hi, v));
      const room = {
        top: block.top - pad,
        bottom: H - pad - block.bottom,
        left: block.left - pad,
        right: W - pad - block.right,
      };
      const max = Math.max(room.top, room.bottom, room.left, room.right);
      let x = clamp(W / 2 - w / 2, pad, W - w - pad);
      let y = clamp(H / 2 - h / 2, pad, H - h - pad);
      if (max === room.bottom) y = H - h - pad;
      else if (max === room.top) y = pad;
      else if (max === room.left) x = pad;
      else x = W - w - pad;
      return { x, y };
    }

    // Weighted pick by area, then a random point inside the chosen band.
    const total = regions.reduce((s, r) => s + r.area, 0);
    let roll = Math.random() * total;
    let chosen = regions[0];
    for (const r of regions) {
      if (roll < r.area) {
        chosen = r;
        break;
      }
      roll -= r.area;
    }
    return {
      x: chosen.x0 + Math.random() * (chosen.x1 - chosen.x0),
      y: chosen.y0 + Math.random() * (chosen.y1 - chosen.y0),
    };
  }, []);

  const dodge = useCallback(() => {
    const now = Date.now();
    if (now - lastDodge.current < DODGE_THROTTLE) return;
    lastDodge.current = now;

    setPos(pickPosition());
    setEscaped(true);

    if (now - lastCount.current > COUNT_COOLDOWN) {
      lastCount.current = now;
      setAttempts((a) => a + 1);
      if (!reduce) {
        void yesShake.start({
          x: [0, -10, 10, -8, 8, -4, 4, 0],
          rotate: [0, -3, 3, -2, 2, 0],
          transition: { duration: 0.5, ease: "easeInOut" },
        });
      }
    }
  }, [pickPosition, reduce, yesShake]);

  // Desktop: flee when the cursor gets near.
  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      const el = noRef.current;
      if (!el) return;
      const r = el.getBoundingClientRect();
      const cx = r.left + r.width / 2;
      const cy = r.top + r.height / 2;
      if (Math.hypot(e.clientX - cx, e.clientY - cy) < PROXIMITY) dodge();
    };
    window.addEventListener("mousemove", onMove);
    return () => window.removeEventListener("mousemove", onMove);
  }, [dodge]);

  // Mobile: flee when a finger taps/drags near it.
  useEffect(() => {
    const onTouch = (e: TouchEvent) => {
      const el = noRef.current;
      const t = e.touches[0];
      if (!el || !t) return;
      const r = el.getBoundingClientRect();
      const cx = r.left + r.width / 2;
      const cy = r.top + r.height / 2;
      if (Math.hypot(t.clientX - cx, t.clientY - cy) < PROXIMITY + 20) dodge();
    };
    window.addEventListener("touchstart", onTouch, { passive: true });
    window.addEventListener("touchmove", onTouch, { passive: true });
    return () => {
      window.removeEventListener("touchstart", onTouch);
      window.removeEventListener("touchmove", onTouch);
    };
  }, [dodge]);

  // Keep it on screen if the window is resized.
  useEffect(() => {
    if (!escaped) return;
    const onResize = () =>
      setPos((p) => {
        const el = noRef.current;
        const w = el?.offsetWidth ?? 120;
        const h = el?.offsetHeight ?? 52;
        const pad = 12;
        const x = Math.max(pad, Math.min(p.x, window.innerWidth - w - pad));
        const y = Math.max(pad, Math.min(p.y, window.innerHeight - h - pad));

        // If the new size pushed it onto the card, find a fresh clear spot.
        const card = cardRef.current?.getBoundingClientRect();
        if (card) {
          const g = 16;
          const overlaps =
            x < card.right + g &&
            x + w > card.left - g &&
            y < card.bottom + g &&
            y + h > card.top - g;
          if (overlaps) return pickPosition();
        }
        return { x, y };
      });
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, [escaped, pickPosition]);

  const handleYes = useCallback(() => {
    void fireConfetti();
    onAccept();
  }, [onAccept]);

  // YES grows a little with each attempt (capped so it never breaks the layout).
  const yesScale = 1 + Math.min(attempts, 12) * 0.07;

  const message =
    attempts === 0
      ? QUESTION
      : FAIL_MESSAGES[(attempts - 1) % FAIL_MESSAGES.length];

  const noClasses =
    "rounded-full border border-white/30 bg-white/10 px-8 py-3 text-lg font-semibold text-white/90 shadow-lg backdrop-blur-md transition hover:bg-white/20 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-white/40";

  // The NO button — same look whether it's resting in the card or loose on screen.
  const renderNo = (fixed: boolean) =>
    fixed ? (
      <motion.button
        ref={noRef}
        type="button"
        aria-label="No (good luck clicking it)"
        onClick={dodge}
        onMouseEnter={dodge}
        onTouchStart={(e) => {
          e.preventDefault();
          dodge();
        }}
        className={`fixed left-0 top-0 z-50 ${noClasses}`}
        style={{ touchAction: "none" }}
        initial={{ scale: 0.6, opacity: 0 }}
        animate={{ x: pos.x, y: pos.y, scale: 1, opacity: 1 }}
        transition={
          reduce
            ? { duration: 0.15 }
            : { type: "spring", stiffness: 600, damping: 28, mass: 0.6 }
        }
      >
        NO {"\uD83D\uDE22"}
      </motion.button>
    ) : (
      <motion.button
        ref={noRef}
        type="button"
        aria-label="No (good luck clicking it)"
        onClick={dodge}
        onMouseEnter={dodge}
        onTouchStart={(e) => {
          e.preventDefault();
          dodge();
        }}
        className={noClasses}
        style={{ touchAction: "none" }}
      >
        NO {"\uD83D\uDE22"}
      </motion.button>
    );

  return (
    <>
      <motion.div
        ref={cardRef}
        className="relative w-full max-w-md rounded-[2rem] border border-white/20 bg-white/10 p-8 text-center shadow-2xl backdrop-blur-xl sm:p-10"
        initial={{ opacity: 0, y: 24, scale: 0.96 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: -12, scale: 0.95 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      >
        <motion.h1
          key={message}
          className="font-display text-3xl font-black leading-tight text-white drop-shadow sm:text-4xl"
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35 }}
        >
          {message}
        </motion.h1>

        {attempts > 0 && (
          <motion.p
            key={attempts}
            className="mt-3 text-sm font-medium text-white/70"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            Escape attempts: {attempts} {"\uD83D\uDE05"}
          </motion.p>
        )}

        <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
          <motion.div
            animate={{ scale: yesScale }}
            transition={{ type: "spring", stiffness: 300, damping: 18 }}
          >
            <motion.button
              type="button"
              onClick={handleYes}
              initial={{ x: 0, rotate: 0 }}
              animate={yesShake}
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.96 }}
              className="rounded-full bg-gradient-to-r from-[#ff5c8a] to-[#ff8fa3] px-8 py-3 text-lg font-bold text-white shadow-lg shadow-rose-900/30 transition hover:brightness-105 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-white/60"
            >
              YES {"\u2764\uFE0F"}
            </motion.button>
          </motion.div>

          {!escaped && renderNo(false)}
        </div>
      </motion.div>

      {escaped && mounted && createPortal(renderNo(true), document.body)}
    </>
  );
}
