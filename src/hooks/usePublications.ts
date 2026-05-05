import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  createPublication,
  updatePublication,
  submitPublication,
  approvePublication,
  rejectPublication,
  getProjectPublications,
  getAllPublications,
  getUserPublications,
  getProjectPublicationSummary,
} from "@/server/actions/publications";
import { toast } from "sonner";

export function useProjectPublications(projectId: string) {
  return useQuery({
    queryKey: ["publications", projectId],
    queryFn: () => getProjectPublications(projectId),
    enabled: !!projectId,
  });
}

export function useAllPublications(status?: "APPROVED" | "ALL") {
  return useQuery({
    queryKey: ["publications", "all", status],
    queryFn: () => getAllPublications(status),
  });
}

export function useUserPublications(userId: string) {
  return useQuery({
    queryKey: ["publications", "user", userId],
    queryFn: () => getUserPublications(userId),
    enabled: !!userId,
  });
}

export function useProjectPublicationSummary(projectId: string) {
  return useQuery({
    queryKey: ["publications", "summary", projectId],
    queryFn: () => getProjectPublicationSummary(projectId),
    enabled: !!projectId,
  });
}

export function useCreatePublication() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createPublication,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["publications", data.projectId] });
      toast.success("Publication created successfully");
    },
    onError: (error: any) => {
      toast.error(error.message || "Failed to create publication");
    },
  });
}

export function useUpdatePublication() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updatePublication,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["publications", data.projectId] });
      toast.success("Publication updated successfully");
    },
    onError: (error: any) => {
      toast.error(error.message || "Failed to update publication");
    },
  });
}

export function useSubmitPublication() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: submitPublication,
    onSuccess: () => {
      toast.success("Publication submitted for approval");
    },
    onError: (error: any) => {
      toast.error(error.message || "Failed to submit publication");
    },
  });
}

export function useApprovePublication() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: approvePublication,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["publications", data.projectId] });
      queryClient.invalidateQueries({ queryKey: ["publications", "all"] });
      queryClient.invalidateQueries({ queryKey: ["publications", "summary", data.projectId] });
      toast.success("Publication approved");
    },
    onError: (error: any) => {
      toast.error(error.message || "Failed to approve publication");
    },
  });
}

export function useRejectPublication() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: rejectPublication,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["publications", data.projectId] });
      toast.success("Publication rejected");
    },
    onError: (error: any) => {
      toast.error(error.message || "Failed to reject publication");
    },
  });
}