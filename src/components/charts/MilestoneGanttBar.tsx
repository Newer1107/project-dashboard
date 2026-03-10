"use client";

import React from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface MilestoneGanttBarProps {
  data: Array<{
    name: string;
    progress: number;
    isCompleted: boolean;
    isOverdue: boolean;
  }>;
}

export function MilestoneGanttBar({ data }: MilestoneGanttBarProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Milestone Progress</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={Math.max(200, data.length * 50)}>
          <BarChart
            data={data}
            layout="vertical"
            margin={{ top: 5, right: 20, left: 10, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" horizontal={false} />
            <XAxis
              type="number"
              domain={[0, 100]}
              fontSize={12}
              tickLine={false}
              axisLine={false}
              tick={{ fill: "hsl(var(--muted-foreground))" }}
            />
            <YAxis
              type="category"
              dataKey="name"
              fontSize={12}
              tickLine={false}
              axisLine={false}
              width={150}
              tick={{ fill: "hsl(var(--muted-foreground))" }}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: "hsl(var(--card))",
                border: "1px solid hsl(var(--border))",
                borderRadius: "8px",
                color: "hsl(var(--foreground))",
              }}
              formatter={(value: number) => [`${value}%`, "Progress"]}
            />
            <Bar dataKey="progress" radius={[0, 4, 4, 0]} barSize={24}>
              {data.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={
                    entry.isCompleted
                      ? "#10b981"
                      : entry.isOverdue
                        ? "#f43f5e"
                        : "#6366f1"
                  }
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
