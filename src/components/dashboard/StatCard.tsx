"use client";

import React, { useEffect, useState } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";
import { cn } from "@/lib/utils";

interface StatCardProps {
  title: string;
  value: number;
  suffix?: string;
  icon: React.ComponentType<{ className?: string }>;
  color?: string;
  trend?: { value: number; positive: boolean };
  className?: string;
}

const colorMap: Record<string, string> = {
  indigo: "from-indigo-500/10 to-indigo-500/20 text-indigo-400",
  violet: "from-violet-500/10 to-violet-500/20 text-violet-400",
  emerald: "from-emerald-500/10 to-emerald-500/20 text-emerald-400",
  amber: "from-amber-500/10 to-amber-500/20 text-amber-400",
};

export function StatCard({ title, value, suffix = "", icon: Icon, color, trend, className }: StatCardProps) {
  const motionValue = useMotionValue(0);
  const springValue = useSpring(motionValue, { stiffness: 100, damping: 30 });
  const [displayValue, setDisplayValue] = useState(0);

  useEffect(() => {
    motionValue.set(value);
  }, [value, motionValue]);

  useEffect(() => {
    const unsubscribe = springValue.on("change", (latest) => {
      setDisplayValue(Math.round(latest));
    });
    return unsubscribe;
  }, [springValue]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      whileHover={{ scale: 1.02, boxShadow: "0 0 20px rgba(99, 102, 241, 0.1)" }}
      className={cn(
        "relative overflow-hidden rounded-xl border bg-card p-6 shadow-sm transition-shadow",
        className
      )}
    >
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-muted-foreground">{title}</p>
          <p className="mt-2 text-3xl font-bold">
            {displayValue}{suffix}
          </p>
          {trend && (
            <p className={cn("mt-1 text-xs", trend.positive ? "text-emerald-500" : "text-rose-500")}>
              {trend.positive ? "↑" : "↓"} {trend.value}% from last month
            </p>
          )}
        </div>
        <div className={cn("flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br", color && colorMap[color] ? colorMap[color] : "from-indigo-500/10 to-violet-500/10 text-indigo-400")}>
          <Icon className="h-6 w-6" />
        </div>
      </div>
      <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-indigo-500 to-violet-600 opacity-50" />
    </motion.div>
  );
}
