"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getProjectTasks, getStudentTasks, updateTask, reorderTasks } from "@/server/actions/tasks";

export function useProjectTasks(projectId: string) {
  return useQuery({
    queryKey: ["tasks", projectId],
    queryFn: () => getProjectTasks(projectId),
    enabled: !!projectId,
  });
}

export function useStudentTasks(studentId: string) {
  return useQuery({
    queryKey: ["tasks", "student", studentId],
    queryFn: () => getStudentTasks(studentId),
    enabled: !!studentId,
  });
}

export function useUpdateTask() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ taskId, data }: { taskId: string; data: Parameters<typeof updateTask>[1] }) =>
      updateTask(taskId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
      queryClient.invalidateQueries({ queryKey: ["dashboard"] });
    },
  });
}

export function useReorderTasks() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      projectId,
      orderedIds,
    }: {
      projectId: string;
      orderedIds: { id: string; orderIndex: number; status: string }[];
    }) => reorderTasks(projectId, orderedIds),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
    },
  });
}
