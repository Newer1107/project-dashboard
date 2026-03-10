"use client";

import React from "react";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
  Legend,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface TaskDistributionDonutProps {
  data: {
    todo: number;
    inProgress: number;
    inReview: number;
    done: number;
    blocked: number;
  };
}

const COLORS = {
  "To Do": "#64748b",
  "In Progress": "#6366f1",
  "In Review": "#f59e0b",
  "Done": "#10b981",
  "Blocked": "#f43f5e",
};

export function TaskDistributionDonut({ data }: TaskDistributionDonutProps) {
  const chartData = [
    { name: "To Do", value: data.todo },
    { name: "In Progress", value: data.inProgress },
    { name: "In Review", value: data.inReview },
    { name: "Done", value: data.done },
    { name: "Blocked", value: data.blocked },
  ].filter((d) => d.value > 0);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Task Distribution</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={chartData}
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={100}
              paddingAngle={4}
              dataKey="value"
            >
              {chartData.map((entry) => (
                <Cell
                  key={entry.name}
                  fill={COLORS[entry.name as keyof typeof COLORS]}
                  strokeWidth={0}
                />
              ))}
            </Pie>
            <Tooltip
              contentStyle={{
                backgroundColor: "hsl(var(--card))",
                border: "1px solid hsl(var(--border))",
                borderRadius: "8px",
                color: "hsl(var(--foreground))",
              }}
            />
            <Legend
              verticalAlign="bottom"
              iconType="circle"
              iconSize={8}
              formatter={(value) => (
                <span className="text-xs text-muted-foreground">{value}</span>
              )}
            />
          </PieChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
