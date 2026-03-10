"use client";

import React from "react";
import { motion } from "framer-motion";

interface CompletionBarProps {
  value: number;
  label?: string;
  className?: string;
}

export function CompletionBar({ value, label, className }: CompletionBarProps) {
  return (
    <div className={className}>
      {label && (
        <div className="flex items-center justify-between mb-1">
          <span className="text-sm text-muted-foreground">{label}</span>
          <span className="text-sm font-medium">{Math.round(value)}%</span>
        </div>
      )}
      <div className="h-2 w-full overflow-hidden rounded-full bg-secondary">
        <motion.div
          className="h-full rounded-full bg-gradient-to-r from-indigo-500 to-violet-600"
          initial={{ width: 0 }}
          animate={{ width: `${value}%` }}
          transition={{ duration: 1, ease: "easeOut" }}
        />
      </div>
    </div>
  );
}
