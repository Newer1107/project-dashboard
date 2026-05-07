import { Role, ProjectStatus, TaskStatus, TaskPriority, MemberRole, ReviewStatus, FileCategory, NotificationType, PublicationType, PublicationStatus, IndexingType } from "@prisma/client";

export type { Role, ProjectStatus, TaskStatus, TaskPriority, MemberRole, ReviewStatus, FileCategory, NotificationType, PublicationType, PublicationStatus, IndexingType };

export interface SessionUser {
  id: string;
  name: string;
  email: string;
  role: Role;
  image?: string | null;
}

export interface ProjectWithRelations {
  id: string;
  title: string;
  description: string;
  domain: string;
  status: ProjectStatus;
  startDate: Date;
  endDate: Date;
  maxGroupSize: number;
  completionPercentage: number;
  teacherId: string;
  createdAt: Date;
  updatedAt: Date;
  teacher: { id: string; name: string; email: string; department: string | null };
  members: Array<{
    id: string;
    role: MemberRole;
    student: { id: string; name: string; email: string; rollNumber: string | null; avatarUrl: string | null };
  }>;
  tags: Array<{ tag: { id: string; name: string; color: string } }>;
  _count: { tasks: number; milestones: number; reviews: number; files: number };
}

export interface TaskWithRelations {
  id: string;
  projectId: string;
  title: string;
  description: string | null;
  assignedToId: string | null;
  status: TaskStatus;
  priority: TaskPriority;
  dueDate: Date | null;
  completedAt: Date | null;
  orderIndex: number;
  parentTaskId: string | null;
  createdAt: Date;
  updatedAt: Date;
  assignedTo: { id: string; name: string; avatarUrl: string | null } | null;
  _count: { subtasks: number; comments: number };
}

export interface MilestoneData {
  id: string;
  projectId: string;
  title: string;
  description: string | null;
  dueDate: Date;
  isCompleted: boolean;
  completedAt: Date | null;
  weight: number;
}

export interface ReviewWithRelations {
  id: string;
  projectId: string;
  reviewerId: string;
  reviewType: string;
  scheduledAt: Date;
  conductedAt: Date | null;
  status: ReviewStatus;
  overallScore: number | null;
  feedback: string | null;
  reviewer: { id: string; name: string };
  criteriaScores: Array<{
    id: string;
    criteriaName: string;
    score: number;
    remarks: string | null;
  }>;
}

export interface DashboardStats {
  totalProjects: number;
  activeProjects: number;
  averageCompletion: number;
  reviewsDue: number;
}

export interface StudentDashboardStats {
  totalProjects: number;
  tasksDueToday: number;
  completedTasks: number;
  overallProgress: number;
}

export interface PublicationWithRelations {
  id: string;
  projectId: string;
  title: string;
  authors: string[];
  publicationType: PublicationType;
  subType?: string;
  journalName?: string;
  conferenceName?: string;
  bookTitle?: string;
  publisher?: string;
  doi?: string;
  indexingType?: IndexingType;
  volume?: string;
  issue?: string;
  pages?: string;
  publicationDate: Date;
  status: PublicationStatus;
  score: number;
  proofUrl?: string;
  remarks?: string;
  submittedById: string;
  approvedById?: string;
  createdAt: Date;
  updatedAt: Date;
  project: { id: string; title: string };
  submittedBy: { id: string; name: string };
  approvedBy?: { id: string; name: string };
}

export interface PublicationScoreConfig {
  publicationType: PublicationType;
  subType: string;
  score: number;
}

export interface PublicationSummary {
  totalPublications: number;
  approvedPublications: number;
  totalScore: number;
  publicationsByType: Record<string, number>;
}
