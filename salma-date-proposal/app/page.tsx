"use client";

import { useState } from "react";
import { AnimatePresence } from "framer-motion";
import FloatingHearts from "@/components/FloatingHearts";
import ProposalScreen from "@/components/ProposalScreen";
import SuccessScreen from "@/components/SuccessScreen";

export default function Home() {
  const [accepted, setAccepted] = useState(false);

  return (
    <main className="relative min-h-[100dvh] w-full overflow-hidden bg-gradient-to-br from-[#2b0a3d] via-[#7a1e5c] to-[#e85c8a]">
      {/* Soft romantic glows */}
      <div className="pointer-events-none absolute -top-1/4 left-1/2 h-[60vh] w-[60vh] -translate-x-1/2 rounded-full bg-[#ff8fa3]/30 blur-[120px]" />
      <div className="pointer-events-none absolute bottom-0 right-0 h-[50vh] w-[50vh] translate-x-1/4 translate-y-1/4 rounded-full bg-[#b5179e]/30 blur-[120px]" />

      {/* Ambient hearts behind everything (persist across both screens) */}
      <FloatingHearts count={18} />

      <div className="relative z-10 flex min-h-[100dvh] items-center justify-center px-4 py-10">
        <AnimatePresence mode="wait">
          {accepted ? (
            <SuccessScreen key="success" onRestart={() => setAccepted(false)} />
          ) : (
            <ProposalScreen key="proposal" onAccept={() => setAccepted(true)} />
          )}
        </AnimatePresence>
      </div>
    </main>
  );
}
