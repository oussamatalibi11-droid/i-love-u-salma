// Celebration burst fired when YES is clicked.
// canvas-confetti is imported dynamically so it never touches the server bundle.
export async function fireConfetti(): Promise<void> {
  if (typeof window === "undefined") return;

  const confetti = (await import("canvas-confetti")).default;
  const colors = ["#ff5c8a", "#ffb4c6", "#fff4f7", "#ff8fa3", "#b5179e"];

  // Big center pop.
  confetti({
    particleCount: 140,
    spread: 90,
    startVelocity: 45,
    origin: { y: 0.6 },
    colors,
    scalar: 1.1,
  });

  // A shower of little hearts.
  try {
    const heart = confetti.shapeFromText({ text: "\u2764\uFE0F", scalar: 2 });
    confetti({
      particleCount: 40,
      spread: 100,
      startVelocity: 35,
      origin: { y: 0.6 },
      shapes: [heart],
      scalar: 2,
      colors,
    });
  } catch {
    // shapeFromText is unavailable on very old versions — ignore gracefully.
  }

  // Side cannons that fade out over ~0.9s.
  const end = Date.now() + 900;
  const frame = () => {
    confetti({ particleCount: 4, angle: 60, spread: 60, origin: { x: 0 }, colors });
    confetti({ particleCount: 4, angle: 120, spread: 60, origin: { x: 1 }, colors });
    if (Date.now() < end) requestAnimationFrame(frame);
  };
  frame();
}
