import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const LoadingScreen = () => {
  const [isVisible, setIsVisible] = useState(true);
  const [text, setText] = useState("");
  const fullText = "Initializing Cloud Environment...";

  useEffect(() => {
    // Typewriter effect
    let index = 0;
    const interval = setInterval(() => {
      setText(fullText.substring(0, index + 1));
      index++;
      if (index === fullText.length) clearInterval(interval);
    }, 40);

    // Fade out timer
    const timer = setTimeout(() => {
      setIsVisible(false);
    }, 1200);

    return () => {
      clearInterval(interval);
      clearTimeout(timer);
    };
  }, []);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
          className="fixed inset-0 z-[100] bg-[#020617] flex flex-col items-center justify-center gap-8 pointer-events-auto"
        >
          {/* Animated Cloud Icon */}
          <div className="relative flex flex-col items-center">
            <div className="cloud-icon" />
            <div className="mt-12 text-center">
              <p className="text-accent font-mono text-sm tracking-wider uppercase opacity-80 min-h-[1.5em]">
                {text}
              </p>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="fixed bottom-0 left-0 w-full h-1 bg-white/5 overflow-hidden">
            <div 
              className="h-full bg-accent" 
              style={{ animation: "barFill 1.2s linear forwards" }}
            />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default LoadingScreen;
