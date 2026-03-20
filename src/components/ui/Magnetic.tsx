// components/ui/Magnetic.tsx
"use client";

import { useRef, ReactNode, MouseEvent } from "react";

interface MagneticProps {
  children: ReactNode;
}

export default function Magnetic({ children }: MagneticProps) {
  const ref = useRef<HTMLDivElement>(null);

  function handleMove(e: MouseEvent<HTMLDivElement>) {
    const el = ref.current;
    if (!el) return;

    const rect = el.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;

    el.style.transform = `translate(${x * 0.25}px, ${y * 0.25}px)`;
  }

  function handleLeave() {
    if (ref.current) {
      ref.current.style.transform = "translate(0px, 0px)";
    }
  }

  return (
    <div
      ref={ref}
      onMouseMove={handleMove}
      onMouseLeave={handleLeave}
      // Added w-fit so the magnetic area wraps tightly around its children
      className="transition-transform duration-300 w-fit"
    >
      {children}
    </div>
  );
}
