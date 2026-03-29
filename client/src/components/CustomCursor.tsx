import { useEffect, useState } from "react";
import { motion, useSpring, useMotionValue } from "framer-motion";
import { useIsMobile } from "../hooks/useMobile";

export default function CustomCursor() {
  const isMobile = useIsMobile();
  const [isHovered, setIsHovered] = useState(false);
  const cursorX = useMotionValue(-100);
  const cursorY = useMotionValue(-100);

  // Don't render on mobile devices
  if (isMobile) {
    return null;
  }

  // Outer ring spring effect for lag (0.1s feeling)
  const springConfig = { damping: 25, stiffness: 200, mass: 0.5 };
  const springX = useSpring(cursorX, springConfig);
  const springY = useSpring(cursorY, springConfig);

  useEffect(() => {
    const moveCursor = (e: MouseEvent) => {
      cursorX.set(e.clientX);
      cursorY.set(e.clientY);
    };

    const handleHoverStart = () => setIsHovered(true);
    const handleHoverEnd = () => setIsHovered(false);

    window.addEventListener("mousemove", moveCursor);

    // Attach listeners to all interactive elements
    const interactiveElements = document.querySelectorAll("a, button, [role='button']");
    interactiveElements.forEach((el) => {
      el.addEventListener("mouseenter", handleHoverStart);
      el.addEventListener("mouseleave", handleHoverEnd);
    });

    return () => {
      window.removeEventListener("mousemove", moveCursor);
      interactiveElements.forEach((el) => {
        el.removeEventListener("mouseenter", handleHoverStart);
        el.removeEventListener("mouseleave", handleHoverEnd);
      });
    };
  }, [cursorX, cursorY]);

  return (
    <>
      {/* Inner Dot */}
      <motion.div
        className="pointer-events-none fixed top-0 left-0 z-[100] h-2 w-2 rounded-full bg-white mix-blend-difference"
        style={{
          x: cursorX,
          y: cursorY,
          translateX: "-50%",
          translateY: "-50%",
        }}
      />
      {/* Outer Ring */}
      <motion.div
        className="pointer-events-none fixed top-0 left-0 z-[100] rounded-full border border-indigo-500/30 bg-indigo-500/10 transition-colors duration-300"
        style={{
          x: springX,
          y: springY,
          translateX: "-50%",
          translateY: "-50%",
        }}
        animate={{
          width: isHovered ? 60 : 36,
          height: isHovered ? 60 : 36,
          backgroundColor: isHovered ? "rgba(99, 102, 241, 0.2)" : "rgba(99, 102, 241, 0.1)",
        }}
      />
    </>
  );
}
