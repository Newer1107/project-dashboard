"use client";

import React, { useState } from "react";
import {
  DndContext,
  DragOverlay,
  closestCorners,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  useDroppable,
  type DragEndEvent,
  type DragStartEvent,
} from "@dnd-kit/core";
import {
  SortableContext,
  verticalListSortingStrategy,
  useSortable,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { motion } from "framer-motion";
import { Calendar, GripVertical, MessageSquare } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { format } from "date-fns";

interface Task {
  id: string;
  title: string;
  status: string;
  priority: string;
  dueDate: Date | null;
  assignedTo: { id: string; name: string; avatarUrl: string | null } | null;
  _count: { subtasks: number; comments: number };
}

interface TaskKanbanProps {
  tasks: Task[];
  onTaskMove?: (taskId: string, newStatus: string) => void;
  onTaskClick?: (taskId: string) => void;
  onTaskUpdate?: (taskId: string, data: any) => void;
}

const columns = [
  { id: "TODO", title: "To Do", color: "border-t-slate-500" },
  { id: "IN_PROGRESS", title: "In Progress", color: "border-t-blue-500" },
  { id: "IN_REVIEW", title: "In Review", color: "border-t-amber-500" },
  { id: "DONE", title: "Done", color: "border-t-emerald-500" },
  { id: "BLOCKED", title: "Blocked", color: "border-t-rose-500" },
];

const priorityColors: Record<string, string> = {
  LOW: "bg-slate-500",
  MEDIUM: "bg-blue-500",
  HIGH: "bg-amber-500",
  CRITICAL: "bg-rose-500",
};

function TaskCard({ task, onClick }: { task: Task; onClick?: () => void }) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: task.id, data: { status: task.status } });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={cn(
        "group rounded-lg border bg-card p-3 shadow-sm transition-shadow hover:shadow-md cursor-pointer",
        isDragging && "opacity-50"
      )}
      onClick={onClick}
    >
      <div className="flex items-start gap-2">
        <button
          {...attributes}
          {...listeners}
          className="mt-0.5 shrink-0 cursor-grab opacity-0 group-hover:opacity-100 transition-opacity"
        >
          <GripVertical className="h-4 w-4 text-muted-foreground" />
        </button>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <div className={cn("h-2 w-2 rounded-full shrink-0", priorityColors[task.priority])} />
            <span className="text-sm font-medium truncate">{task.title}</span>
          </div>
          <div className="flex items-center gap-2 mt-2 flex-wrap">
            {task.dueDate && (
              <div className="flex items-center gap-1 text-xs text-muted-foreground">
                <Calendar className="h-3 w-3" />
                {format(new Date(task.dueDate), "MMM d")}
              </div>
            )}
            {task._count.comments > 0 && (
              <div className="flex items-center gap-1 text-xs text-muted-foreground">
                <MessageSquare className="h-3 w-3" />
                {task._count.comments}
              </div>
            )}
          </div>
        </div>
        {task.assignedTo && (
          <Avatar className="h-6 w-6 shrink-0">
            <AvatarFallback className="text-[10px] bg-gradient-to-br from-indigo-500 to-violet-600 text-white">
              {task.assignedTo.name.split(" ").map((n) => n[0]).join("")}
            </AvatarFallback>
          </Avatar>
        )}
      </div>
    </div>
  );
}

function DroppableColumn({ id, children }: { id: string; children: React.ReactNode }) {
  const { setNodeRef, isOver } = useDroppable({ id });
  return (
    <div
      ref={setNodeRef}
      className={cn(
        "flex-1 space-y-2 p-2 min-h-[100px] rounded-b-lg transition-colors",
        isOver && "bg-accent/40"
      )}
    >
      {children}
    </div>
  );
}

export function TaskKanban({ tasks, onTaskMove, onTaskClick, onTaskUpdate }: TaskKanbanProps) {
  const [activeId, setActiveId] = useState<string | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } }),
    useSensor(KeyboardSensor)
  );

  const handleDragStart = (event: DragStartEvent) => {
    setActiveId(event.active.id as string);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    setActiveId(null);
    const { active, over } = event;
    if (!over) return;

    const taskId = active.id as string;
    const overData = over.data.current;
    const overId = over.id as string;

    // Find which column was dropped to
    const targetColumn = columns.find((c) => c.id === overId);
    if (targetColumn) {
      if (typeof onTaskMove === "function") onTaskMove(taskId, targetColumn.id);
      else if (typeof onTaskUpdate === "function") onTaskUpdate(taskId, { status: targetColumn.id });
      return;
    }

    // Dropped on another task — use that task's column
    const overTask = tasks.find((t) => t.id === overId);
    if (overTask) {
      if (typeof onTaskMove === "function") onTaskMove(taskId, overTask.status);
      else if (typeof onTaskUpdate === "function") onTaskUpdate(taskId, { status: overTask.status });
    }
  };

  const activeTask = activeId ? tasks.find((t) => t.id === activeId) : null;

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCorners}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      <div className="flex gap-4 overflow-x-auto pb-4">
        {columns.map((column) => {
          const columnTasks = tasks.filter((t) => t.status === column.id);
          return (
            <div
              key={column.id}
              className={cn(
                "flex w-72 shrink-0 flex-col rounded-lg border border-t-2 bg-card/50",
                column.color
              )}
            >
              <div className="flex items-center justify-between p-3">
                <h3 className="text-sm font-semibold">{column.title}</h3>
                <Badge variant="secondary" className="text-xs">
                  {columnTasks.length}
                </Badge>
              </div>
              <SortableContext
                id={column.id}
                items={columnTasks.map((t) => t.id)}
                strategy={verticalListSortingStrategy}
              >
                <DroppableColumn id={column.id}>
                  {columnTasks.map((task) => (
                    <TaskCard
                      key={task.id}
                      task={task}
                      onClick={onTaskClick ? () => onTaskClick(task.id) : undefined}
                    />
                  ))}
                </DroppableColumn>
              </SortableContext>
            </div>
          );
        })}
      </div>

      <DragOverlay>
        {activeTask && (
          <div className="rounded-lg border bg-card p-3 shadow-lg opacity-90 w-72">
            <div className="flex items-center gap-2">
              <div className={cn("h-2 w-2 rounded-full", priorityColors[activeTask.priority])} />
              <span className="text-sm font-medium">{activeTask.title}</span>
            </div>
          </div>
        )}
      </DragOverlay>
    </DndContext>
  );
}
