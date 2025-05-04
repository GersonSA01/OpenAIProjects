import { useState, useEffect } from "react";

export default function DynamicBackground() {
  const [position, setPosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e) => {
      setPosition({ x: e.clientX, y: e.clientY });
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  return (
    <div
      className="fixed inset-0 pointer-events-none z-[-1]"
      style={{
        background: `rgb(3 7 18 / var(--tw-bg-opacity, 1))`,
        backgroundImage: `radial-gradient(600px at ${position.x}px ${position.y}px, rgba(20, 90, 20, 0.3), transparent 40%)`,
      }}
    />
  );
}