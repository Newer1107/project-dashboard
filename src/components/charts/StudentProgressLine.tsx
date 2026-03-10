"use client";

import React from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface StudentProgressLineProps {
  data: Array<{ date: string; completed: number }>;
}

export function StudentProgressLine({ data }: StudentProgressLineProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Task Completion Trend (30 Days)</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={data} margin={{ top: 5, right: 5, left: -20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
            <XAxis
              dataKey="date"
              fontSize={12}
              tickLine={false}
              axisLine={false}
              tick={{ fill: "hsl(var(--muted-foreground))" }}
            />
            <YAxis
              fontSize={12}
              tickLine={false}
              axisLine={false}
              tick={{ fill: "hsl(var(--muted-foreground))" }}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: "hsl(var(--card))",
                border: "1px solid hsl(var(--border))",
                borderRadius: "8px",
                color: "hsl(var(--foreground))",
              }}
            />
            <Line
              type="monotone"
              dataKey="completed"
              stroke="#6366f1"
              strokeWidth={2}
              dot={{ fill: "#6366f1", strokeWidth: 0, r: 4 }}
              activeDot={{ r: 6, strokeWidth: 0, fill: "#8b5cf6" }}
            />
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
