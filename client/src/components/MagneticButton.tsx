import React, { useRef, useState } from "react";

interface MagneticButtonProps {
  children: React.ReactNode;
  className?: string;
  distance?: number;
}

export default function MagneticButton({ children, className = "", distance = 12 }: MagneticButtonProps) {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);
  const buttonRef = useRef<HTMLDivElement>(null);

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!buttonRef.current) return;

    const { clientX, clientY } = e;
    const { left, top, width, height } = buttonRef.current.getBoundingClientRect();

    const center = {
      x: left + width / 2,
      y: top + height / 2,
    };

    const deltaX = clientX - center.x;
    const deltaY = clientY - center.y;

    setPosition({
      x: (deltaX / width) * distance,
      y: (deltaY / height) * distance,
    });
  };

  const handleMouseEnter = () => setIsHovered(true);

  const handleMouseLeave = () => {
    setIsHovered(false);
    setPosition({ x: 0, y: 0 });
  };

  return (
    <div
      ref={buttonRef}
      onMouseEnter={handleMouseEnter}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className={`inline-block transition-transform duration-300 ${className}`}
      style={{
        transform: isHovered ? `translate(${position.x}px, ${position.y}px)` : "translate(0px, 0px)",
        transition: isHovered ? "none" : "transform 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)",
      }}
    >
      {/* Wrapper to ensure interaction propagation */}
      <div className="flex items-center justify-center h-full w-full">
        {children}
      </div>
    </div>
  );
}
