# Academic Project Monitoring Dashboard

A full-stack web application for monitoring, managing, and evaluating academic projects. Built with Next.js 15, TypeScript, MySQL, and Prisma. Supports three user roles (Admin, Teacher, Student) with role-based dashboards, Kanban task boards, review scheduling with multi-criteria scoring, S3 file management, real-time notifications, and analytics charts.

---

## Table of Contents

1. [Technology Stack](#technology-stack)
2. [System Architecture](#system-architecture)
3. [Directory Structure](#directory-structure)
4. [Database Schema](#database-schema)
5. [Authentication and Authorization](#authentication-and-authorization)
6. [Application Routes](#application-routes)
7. [Server Actions](#server-actions)
8. [API Endpoints](#api-endpoints)
9. [Client-Side State Management](#client-side-state-management)
10. [UI Components](#ui-components)
11. [File Upload Workflow](#file-upload-workflow)
12. [Review System Workflow](#review-system-workflow)
13. [Notification System](#notification-system)
14. [Task Management and Kanban Board](#task-management-and-kanban-board)
15. [Project Completion Calculation](#project-completion-calculation)
16. [Email Integration](#email-integration)
17. [Seed Data](#seed-data)
18. [Environment Variables](#environment-variables)
19. [Development Setup](#development-setup)
20. [Docker Deployment](#docker-deployment)
21. [Production Checklist](#production-checklist)
22. [Security Measures](#security-measures)

---

## Technology Stack

| Layer | Technology | Version | Purpose |
|-------|-----------|---------|---------|
| Framework | Next.js (App Router) | 15.1.0 | Full-stack React framework with server components |
| Language | TypeScript | 5.7.0 | Type-safe JavaScript |
| Runtime | React | 19.0.0 | UI rendering library |
| Database | MySQL | 8.0 | Relational database |
| ORM | Prisma | 6.1.0 | Type-safe database client and schema management |
| Authentication | NextAuth v5 | 5.0.0-beta.25 | JWT-based session management |
| Styling | Tailwind CSS | 3.4.0 | Utility-first CSS framework |
| Components | shadcn/ui | (Radix-based) | Accessible, composable UI primitives |
| Server State | TanStack Query | 5.62.0 | Data fetching, caching, synchronization |
| Client State | Zustand | 5.0.0 | Lightweight global UI state |
| Drag and Drop | @dnd-kit | core 6.3.1, sortable 10.0.0 | Accessible drag-and-drop for Kanban |
| Charts | Recharts | 2.15.0 | Composable chart components |
| Additional Charts | @tremor/react | 3.18.0 | Dashboard chart primitives |
| Animations | Framer Motion | 11.15.0 | Layout and transition animations |
| Forms | react-hook-form + Zod | 7.54.0 / 3.24.0 | Form state management and validation |
| File Upload | react-dropzone | 14.3.0 | Drag-and-drop file selection |
| File Storage | AWS S3 (via @aws-sdk) | 3.700.0 | Cloud file storage with presigned URLs |
| Email | Nodemailer | 6.9.0 | SMTP email delivery |
| Notifications | sonner | 1.7.0 | Toast notification UI |
| Fonts | Geist | 1.7.0 | Sans and mono font families |
| Icons | Lucide React | 0.468.0 | Icon library |
| Bundler (dev) | Turbopack | Built into Next.js 15 | Fast development builds |
| Containerization | Docker | Multi-stage | Production deployment |

---

## System Architecture

```mermaid
graph TB
    subgraph Client["Client Browser"]
        UI["React 19 + Next.js 15 App Router"]
        TQ["TanStack Query v5 -- Server State Cache"]
        ZS["Zustand Store -- UI State"]
        FM["Framer Motion -- Animations"]
    end

    subgraph NextServer["Next.js Server - Node.js"]
        MW["Middleware -- Auth + Role Guard"]
        SC["Server Components -- SSR Pages"]
        SA["Server Actions -- Business Logic"]
        API["API Routes -- REST Endpoints"]
        NA["NextAuth v5 -- JWT Sessions"]
    end

    subgraph External["External Services"]
        DB["MySQL 8.0 via Prisma ORM"]
        S3["AWS S3 -- File Storage"]
        SMTP["SMTP -- Email Notifications"]
    end

    UI --> TQ
    UI --> ZS
    UI --> FM
    TQ --> SA
    TQ --> API
    UI --> SA
    MW --> SC
    MW --> NA
    SC --> SA
    SA --> DB
    SA --> S3
    SA --> SMTP
    API --> DB
    API --> S3
    API --> NA
```

**Data flow**: The browser loads React Server Components rendered on the Next.js server. Client Components use TanStack Query to call Server Actions (for mutations and queries) and API Routes (for notifications). The middleware intercepts every request to enforce authentication via NextAuth JWT tokens and role-based access control. Server Actions interact with MySQL through Prisma, AWS S3 for file operations, and SMTP for email delivery.

---

## Directory Structure

```
project-dashboard/
|-- .dockerignore
|-- .env                          # Environment variables (not committed)
|-- .env.example                  # Template for environment variables
|-- .gitignore
|-- docker-compose.yml            # Docker Compose for app + MySQL
|-- Dockerfile                    # Multi-stage production build
|-- next.config.ts                # Next.js configuration with security headers
|-- package.json
|-- postcss.config.js
|-- tailwind.config.js            # Tailwind with custom theme and animations
|-- tsconfig.json                 # TypeScript strict mode, @/* path alias
|
|-- prisma/
|   |-- schema.prisma             # 13 database models, 8 enums
|   |-- seed.ts                   # Seed script with sample data
|
|-- public/
|   |-- sw.js                     # Service worker (self-unregistering)
|
|-- src/
    |-- middleware.ts              # Auth guard + role-based routing
    |
    |-- app/
    |   |-- globals.css            # Tailwind base + CSS custom properties
    |   |-- layout.tsx             # Root layout: providers, fonts, theme
    |   |-- page.tsx               # Root redirect by role
    |   |
    |   |-- (auth)/
    |   |   |-- layout.tsx         # Minimal layout for auth pages
    |   |   |-- login/
    |   |       |-- page.tsx       # Login form (email + password)
    |   |
    |   |-- (dashboard)/
    |   |   |-- layout.tsx         # Protected layout: fetches session
    |   |   |-- DashboardShell.tsx # Sidebar + Topbar + NotificationPanel
    |   |   |
    |   |   |-- admin/
    |   |   |   |-- page.tsx       # Admin overview dashboard
    |   |   |   |-- settings/
    |   |   |   |   |-- page.tsx   # Admin settings
    |   |   |   |-- users/
    |   |   |       |-- page.tsx   # User management (CRUD)
    |   |   |
    |   |   |-- teacher/
    |   |   |   |-- page.tsx       # Teacher dashboard with stats
    |   |   |   |-- analytics/
    |   |   |   |   |-- page.tsx   # Charts and analytics
    |   |   |   |-- projects/
    |   |   |       |-- page.tsx   # Project list with status filters
    |   |   |       |-- new/
    |   |   |       |   |-- page.tsx  # Create new project form
    |   |   |       |-- [projectId]/
    |   |   |           |-- page.tsx  # Project detail (tabbed UI)
    |   |   |           |-- _tabs/
    |   |   |               |-- OverviewTab.tsx
    |   |   |               |-- TasksTab.tsx
    |   |   |               |-- MilestonesTab.tsx
    |   |   |               |-- MembersTab.tsx
    |   |   |               |-- ReviewsTab.tsx
    |   |   |               |-- FilesTab.tsx
    |   |   |
    |   |   |-- student/
    |   |       |-- page.tsx       # Student dashboard with stats
    |   |       |-- notifications/
    |   |       |   |-- page.tsx   # Full notification list
    |   |       |-- projects/
    |   |           |-- page.tsx   # Enrolled projects list
    |   |           |-- [projectId]/
    |   |               |-- page.tsx  # Project detail (read-focused)
    |   |
    |   |-- api/
    |       |-- auth/
    |       |   |-- [...nextauth]/
    |       |       |-- route.ts   # NextAuth handler (GET, POST)
    |       |-- files/
    |       |   |-- presign/
    |       |       |-- route.ts   # Presigned S3 upload URL
    |       |-- notifications/
    |       |   |-- route.ts       # GET notifications, PATCH mark read
    |       |   |-- count/
    |       |       |-- route.ts   # GET unread count
    |       |-- upload/
    |           |-- route.ts       # Server-side S3 file upload
    |
    |-- components/
    |   |-- charts/
    |   |   |-- MilestoneGanttBar.tsx
    |   |   |-- ProjectCompletionChart.tsx
    |   |   |-- StudentProgressLine.tsx
    |   |   |-- TaskDistributionDonut.tsx
    |   |
    |   |-- dashboard/
    |   |   |-- ActivityFeed.tsx
    |   |   |-- CompletionBar.tsx
    |   |   |-- FileUploader.tsx
    |   |   |-- MilestoneTimeline.tsx
    |   |   |-- ProjectCard.tsx
    |   |   |-- ReviewForm.tsx
    |   |   |-- StatCard.tsx
    |   |   |-- TaskKanban.tsx
    |   |
    |   |-- layout/
    |   |   |-- NotificationPanel.tsx
    |   |   |-- Sidebar.tsx
    |   |   |-- Topbar.tsx
    |   |
    |   |-- providers/
    |   |   |-- AuthProvider.tsx    # NextAuth SessionProvider
    |   |   |-- QueryProvider.tsx   # TanStack QueryClientProvider
    |   |
    |   |-- ui/                    # shadcn/ui primitives (17 components)
    |       |-- avatar.tsx, badge.tsx, button.tsx, card.tsx,
    |       |-- dialog.tsx, dropdown-menu.tsx, input.tsx, label.tsx,
    |       |-- progress.tsx, scroll-area.tsx, select.tsx,
    |       |-- separator.tsx, skeleton.tsx, slider.tsx, tabs.tsx,
    |       |-- textarea.tsx, tooltip.tsx
    |
    |-- hooks/
    |   |-- useNotifications.ts    # Notification queries and mutations
    |   |-- useProjects.ts         # Project queries and stats
    |   |-- useTasks.ts            # Task queries, updates, reordering
    |
    |-- lib/
    |   |-- auth.ts                # NextAuth config (Credentials + JWT)
    |   |-- completion.ts          # Project completion score computation
    |   |-- email.ts               # Nodemailer SMTP templates
    |   |-- notifications.ts       # Notification CRUD helpers
    |   |-- prisma.ts              # Prisma singleton client
    |   |-- s3.ts                  # AWS S3 operations
    |   |-- utils.ts               # cn() Tailwind class merger
    |
    |-- server/
    |   |-- actions/
    |       |-- files.ts           # File upload, download, delete
    |       |-- milestones.ts      # Milestone CRUD
    |       |-- projects.ts        # Project CRUD, members, stats, tags
    |       |-- reviews.ts         # Review scheduling and conducting
    |       |-- tasks.ts           # Task CRUD, reordering, comments
    |       |-- users.ts           # User management (admin)
    |
    |-- store/
    |   |-- ui.store.ts            # Zustand: sidebar, notifications, modals
    |
    |-- types/
        |-- index.ts               # Shared TypeScript interfaces
```

---

## Database Schema

### Entity Relationship Diagram

```mermaid
erDiagram
    User ||--o{ Project : "teaches (teacherId)"
    User ||--o{ ProjectMember : "memberships"
    User ||--o{ Task : "assigned tasks"
    User ||--o{ Review : "conducts reviews"
    User ||--o{ ProjectFile : "uploads files"
    User ||--o{ Comment : "writes comments"
    User ||--o{ Notification : "receives notifications"

    Project ||--o{ ProjectMember : "has members"
    Project ||--o{ Task : "contains tasks"
    Project ||--o{ Milestone : "has milestones"
    Project ||--o{ Review : "has reviews"
    Project ||--o{ ProjectFile : "has files"
    Project ||--o{ ProjectTag : "tagged with"

    Task ||--o{ Task : "subtasks (parentTaskId)"
    Task ||--o{ Comment : "has comments"
    Task ||--o{ ProjectFile : "has attachments"

    Review ||--o{ ReviewCriteria : "has criteria scores"

    Tag ||--o{ ProjectTag : "used by projects"

    User {
        string id PK
        string name
        string email UK
        string passwordHash
        Role role
        string avatarUrl
        string department
        string rollNumber
        boolean isActive
    }

    Project {
        string id PK
        string title
        string description
        string domain
        ProjectStatus status
        datetime startDate
        datetime endDate
        int maxGroupSize
        float completionPercentage
        string teacherId FK
    }

    ProjectMember {
        string id PK
        string projectId FK
        string studentId FK
        MemberRole role
        datetime joinedAt
    }

    Task {
        string id PK
        string projectId FK
        string title
        string description
        string assignedToId FK
        TaskStatus status
        TaskPriority priority
        datetime dueDate
        datetime completedAt
        int orderIndex
        string parentTaskId FK
    }

    Milestone {
        string id PK
        string projectId FK
        string title
        string description
        datetime dueDate
        boolean isCompleted
        datetime completedAt
        int weight
    }

    Review {
        string id PK
        string projectId FK
        string reviewerId FK
        string reviewType
        datetime scheduledAt
        datetime conductedAt
        ReviewStatus status
        float overallScore
        string feedback
    }

    ReviewCriteria {
        string id PK
        string reviewId FK
        string criteriaName
        float score
        string remarks
    }

    ProjectFile {
        string id PK
        string projectId FK
        string taskId FK
        string uploadedBy FK
        string fileName
        string fileType
        int fileSize
        string s3Key
        string s3Url
        FileCategory category
        datetime uploadedAt
    }

    Comment {
        string id PK
        string taskId FK
        string authorId FK
        string content
        datetime createdAt
    }

    Notification {
        string id PK
        string userId FK
        NotificationType type
        string title
        string message
        string link
        boolean isRead
        datetime createdAt
    }

    Tag {
        string id PK
        string name UK
        string color
    }

    ProjectTag {
        string projectId PK_FK
        string tagId PK_FK
    }
```

### Enums

| Enum | Values |
|------|--------|
| Role | ADMIN, TEACHER, STUDENT |
| ProjectStatus | DRAFT, ACTIVE, UNDER_REVIEW, COMPLETED, ARCHIVED |
| MemberRole | LEAD, MEMBER |
| TaskStatus | TODO, IN_PROGRESS, IN_REVIEW, DONE, BLOCKED |
| TaskPriority | LOW, MEDIUM, HIGH, CRITICAL |
| ReviewStatus | SCHEDULED, COMPLETED, MISSED, RESCHEDULED |
| FileCategory | REPORT, PRESENTATION, CODE, DATASET, OTHER |
| NotificationType | TASK_ASSIGNED, DEADLINE_APPROACHING, REVIEW_SCHEDULED, FEEDBACK_GIVEN, PROJECT_UPDATED, MILESTONE_DUE |

### Key Constraints

- `ProjectMember`: Unique composite index on `[projectId, studentId]` prevents duplicate memberships.
- `ProjectTag`: Composite primary key `[projectId, tagId]`.
- All foreign keys with `onDelete: Cascade` on child entities (tasks, milestones, reviews, files, comments, notifications, project members, project tags, review criteria).
- Database indexes on `teacherId`, `projectId`, `assignedToId`, `status`, `userId`, `isRead`, `taskId`, `reviewId`, `studentId` for query performance.

---

## Authentication and Authorization

### Authentication Flow

```mermaid
sequenceDiagram
    participant B as Browser
    participant M as Middleware
    participant N as NextAuth
    participant D as Database

    B->>M: Request to any route
    M->>M: Check JWT token in cookie

    alt No token and protected route
        M->>B: Redirect to /login
    end

    alt Has token
        M->>M: Decode role from JWT
        M->>M: Check role matches route prefix
        alt Role mismatch
            M->>B: Redirect to /login
        end
        M->>B: Allow request through
    end

    Note over B: Login Page

    B->>N: POST credentials (email, password)
    N->>D: Find user by email
    D-->>N: User record
    N->>N: bcrypt.compare(password, passwordHash)
    N->>N: Check user.isActive
    alt Valid credentials
        N->>N: Generate JWT with {id, role}
        N->>B: Set httpOnly cookie with JWT
        B->>M: Redirect to role-based dashboard
    end
    alt Invalid credentials
        N->>B: Return error
    end
```

### Authentication Configuration

- **Strategy**: JWT (stateless, no database sessions)
- **Provider**: Credentials (email + password)
- **Password Hashing**: bcryptjs with 12 salt rounds
- **Session Callbacks**: JWT token carries `id` and `role`; session object exposes them to client
- **Pages**: Custom login page at `/login`

### Route Protection

The middleware at `src/middleware.ts` enforces the following rules:

| Route Prefix | Required Role | Behavior |
|-------------|---------------|----------|
| `/login` | None (public) | Redirects to dashboard if already logged in |
| `/api/auth` | None (public) | NextAuth internal routes |
| `/admin/*` | ADMIN | Redirects to /login if not ADMIN |
| `/teacher/*` | TEACHER | Redirects to /login if not TEACHER |
| `/student/*` | STUDENT | Redirects to /login if not STUDENT |
| `/` | Any authenticated | Redirects to role-specific dashboard |

The middleware matcher excludes Next.js internals (`_next/static`, `_next/image`, `favicon.ico`) and NextAuth API routes.

---

## Application Routes

### Route Map

```mermaid
graph LR
    subgraph Public
        LOGIN["/login"]
    end

    subgraph Admin["/admin"]
        AD["/admin -- Dashboard"]
        AU["/admin/users -- User Management"]
        AS["/admin/settings -- Settings"]
    end

    subgraph Teacher["/teacher"]
        TD["/teacher -- Dashboard"]
        TA["/teacher/analytics -- Analytics"]
        TP["/teacher/projects -- Project List"]
        TPN["/teacher/projects/new -- Create Project"]
        TPD["/teacher/projects/:id -- Project Detail"]
    end

    subgraph Student["/student"]
        SD["/student -- Dashboard"]
        SN["/student/notifications -- Notifications"]
        SP["/student/projects -- Project List"]
        SPD["/student/projects/:id -- Project Detail"]
    end

    ROOT["/ -- Root Redirect"] --> |ADMIN| AD
    ROOT --> |TEACHER| TD
    ROOT --> |STUDENT| SD
    LOGIN --> ROOT
```

### Page Details

#### Root Page (`/`)
Server component that checks the session and redirects to the appropriate dashboard based on the user's role. Unauthenticated users are sent to `/login`.

#### Login Page (`/login`)
Client-side login form with email and password fields. Uses NextAuth `signIn("credentials", ...)` to authenticate. Displays error messages on failure.

#### Admin Dashboard (`/admin`)
Overview page showing system-wide statistics: total users by role, total projects, platform metrics.

#### Admin Users (`/admin/users`)
Full user management interface. Create users with name, email, password, role, department, and roll number. Toggle user active/inactive status. Filter by role.

#### Admin Settings (`/admin/settings`)
Platform configuration page.

#### Teacher Dashboard (`/teacher`)
Displays StatCards with: Total Projects, Active Projects, Average Completion, Reviews Due. Shows a TaskDistributionDonut chart and recent project list.

#### Teacher Analytics (`/teacher/analytics`)
Detailed analytics page with TaskDistributionDonut, ProjectCompletionChart, and project-level statistics.

#### Teacher Projects (`/teacher/projects`)
Lists all projects belonging to the teacher. Each project displayed as a ProjectCard with status badge, member avatars, domain, and date range.

#### Teacher Create Project (`/teacher/projects/new`)
Multi-field form: title, description, domain, status, start/end dates, max group size, tags. Uses react-hook-form with Zod validation.

#### Teacher Project Detail (`/teacher/projects/[projectId]`)
Tabbed interface with six tabs:

| Tab | Component | Functionality |
|-----|-----------|---------------|
| Overview | OverviewTab | Project info, task distribution donut, milestone list |
| Tasks | TasksTab | Kanban board with drag-and-drop, task creation with assignee and due date |
| Milestones | MilestonesTab | Create milestones with due date and weight, toggle completion |
| Members | MembersTab | Add/remove students, set project lead |
| Reviews | ReviewsTab | Schedule reviews, conduct reviews with multi-criteria scoring |
| Files | FilesTab | Upload files to S3, download, delete, categorize |

#### Student Dashboard (`/student`)
Displays StatCards with: Total Projects, Tasks Due Today, Completed Tasks, Overall Progress. Shows upcoming tasks list.

#### Student Projects (`/student/projects`)
Lists projects the student is a member of. Each shown as a ProjectCard.

#### Student Project Detail (`/student/projects/[projectId]`)
Read-focused view with project details, task list (students can update task status), milestone timeline, files section (upload and download), and reviews with feedback.

#### Student Notifications (`/student/notifications`)
Full list of notifications with mark-as-read functionality.

---

## Server Actions

All server actions are defined as `"use server"` functions in `src/server/actions/`. Each action checks authentication via `auth()` and validates authorization by role.

### projects.ts

| Function | Auth | Description |
|----------|------|-------------|
| `createProject(data)` | TEACHER | Creates a project with Zod-validated fields. Assigns the teacher as owner. |
| `updateProject(projectId, data)` | TEACHER (owner) | Updates project fields. Sends PROJECT_UPDATED notifications to all members. |
| `deleteProject(projectId)` | TEACHER (owner) | Deletes the project and all related data (cascading). |
| `duplicateProject(projectId)` | TEACHER (owner) | Clones a project including tags. Sets status to DRAFT, resets completion to 0. |
| `addProjectMember(projectId, identifier)` | TEACHER | Adds a student by email, ID, or roll number. Validates against maxGroupSize. |
| `removeProjectMember(projectId, memberId)` | TEACHER | Removes a student from the project. |
| `setProjectLead(projectId, memberId)` | TEACHER | Promotes a member to LEAD, demotes all others to MEMBER. |
| `getTeacherProjects(teacherId)` | Any authenticated | Returns all projects for a teacher with members, tags, and counts. |
| `getProjectById(projectId)` | Any authenticated | Returns a single project with full relations. |
| `getStudentProjects(studentId)` | Any authenticated | Returns projects where the student is a member. |
| `getTeacherDashboardStats(teacherId)` | Any authenticated | Computes total projects, active count, average completion, reviews due. |
| `getStudentDashboardStats(studentId)` | Any authenticated | Computes total projects, tasks due today, completed tasks, overall progress. |
| `getAllTags()` | Any authenticated | Returns all tags. |
| `createTag(data)` | ADMIN or TEACHER | Creates a new tag with name and color. |

### tasks.ts

| Function | Auth | Description |
|----------|------|-------------|
| `createTask(data)` | TEACHER | Creates a task with title, description, assignee, priority, due date. Auto-assigns orderIndex. Sends TASK_ASSIGNED notification if assigned. |
| `updateTask(taskId, data)` | TEACHER or assigned STUDENT | Teachers can update all fields. Students can only update status (TODO, IN_PROGRESS, IN_REVIEW, DONE). Auto-sets completedAt on DONE. Recalculates project completion. |
| `deleteTask(taskId)` | TEACHER | Deletes the task. |
| `reorderTasks(tasks)` | TEACHER | Bulk updates orderIndex and status for all provided tasks. Recalculates project completion. |
| `addComment(taskId, content)` | Any authenticated | Adds a comment to a task. Returns the comment with author info. |
| `getTaskComments(taskId)` | Any authenticated | Returns comments ordered newest first. |
| `getProjectTasks(projectId)` | Any authenticated | Returns top-level tasks (no parent) ordered by orderIndex. |
| `getStudentTasks(studentId)` | Any authenticated | Returns all tasks assigned to the student with project info. |

### milestones.ts

| Function | Auth | Description |
|----------|------|-------------|
| `createMilestone(data)` | TEACHER | Creates a milestone with title, description, due date, and weight (1-100). |
| `toggleMilestoneComplete(milestoneId)` | TEACHER | Toggles isCompleted. Sets or clears completedAt. Recalculates project completion. |
| `deleteMilestone(milestoneId)` | TEACHER | Deletes the milestone. |
| `getProjectMilestones(projectId)` | Any authenticated | Returns milestones ordered by due date ascending. |

### reviews.ts

| Function | Auth | Description |
|----------|------|-------------|
| `scheduleReview(data)` | TEACHER | Creates a review with type and scheduled date. Sends REVIEW_SCHEDULED notifications and emails to all project members. |
| `conductReview(data)` | TEACHER | Updates review to COMPLETED. Stores overall score (0-10), feedback text, and per-criteria scores. Sends FEEDBACK_GIVEN notifications and emails. Recalculates project completion. |
| `updateReviewStatus(reviewId, status, newDate?)` | TEACHER | Changes status to SCHEDULED, MISSED, or RESCHEDULED. Optionally updates the scheduled date. |
| `getProjectReviews(projectId)` | Any authenticated | Returns reviews with reviewer info and criteria scores, ordered by date descending. |

### files.ts

| Function | Auth | Description |
|----------|------|-------------|
| `requestUploadUrl(projectId, fileName, fileType, category, taskId?)` | Any authenticated | Generates a presigned S3 upload URL. Builds a standardized S3 key. |
| `confirmUpload(data)` | Any authenticated | Creates a ProjectFile record in the database after successful upload. |
| `getDownloadUrl(fileId)` | Any authenticated | Generates a presigned S3 download URL (15-minute expiry). |
| `deleteFile(fileId)` | TEACHER or file owner | Deletes from S3 and database. Students cannot delete files uploaded by others. |
| `getProjectFiles(projectId)` | Any authenticated | Returns all project files ordered by upload date descending. |

### users.ts

| Function | Auth | Description |
|----------|------|-------------|
| `createUser(data)` | ADMIN | Creates a user with Zod-validated fields. Hashes password with bcryptjs. |
| `toggleUserActive(userId)` | ADMIN | Toggles the isActive flag. |
| `getUsers(role?)` | ADMIN | Returns all users, optionally filtered by role. |
| `getStudents()` | Any authenticated | Returns active students (for dropdowns). |
| `getTeachers()` | Any authenticated | Returns active teachers (for dropdowns). |

---

## API Endpoints

All API routes are in `src/app/api/`. Each route validates authentication via `auth()` and returns JSON responses. All routes have try-catch error handling.

### POST /api/auth/[...nextauth]
NextAuth internal handler. Manages sign-in, sign-out, session, and callback routes.

### POST /api/files/presign
Generates a presigned S3 upload URL.

**Request Body:**
```json
{
  "projectId": "string",
  "fileName": "string",
  "fileType": "string (MIME type)",
  "category": "string (optional, defaults to 'other')"
}
```

**Response:**
```json
{
  "uploadUrl": "string (presigned S3 URL)",
  "s3Key": "string (storage path)"
}
```

### POST /api/upload
Server-side file upload to S3. Accepts multipart form data.

**Request (FormData):**
- `file`: File binary
- `projectId`: string
- `category`: string (optional, defaults to "OTHER")
- `taskId`: string (optional)

**Response:**
```json
{
  "file": { "id": "...", "fileName": "...", "s3Key": "...", "..." : "..." }
}
```

### GET /api/notifications
Returns the 50 most recent notifications for the authenticated user.

**Response:**
```json
[
  {
    "id": "string",
    "type": "NotificationType",
    "title": "string",
    "message": "string",
    "link": "string | null",
    "isRead": "boolean",
    "createdAt": "datetime"
  }
]
```

### PATCH /api/notifications
Marks notifications as read.

**Request Body (single):**
```json
{ "notificationId": "string" }
```

**Request Body (all):**
```json
{ "markAllRead": true }
```

### GET /api/notifications/count
Returns the count of unread notifications.

**Response:**
```json
{ "count": 0 }
```

---

## Client-Side State Management

### TanStack Query (Server State)

Three custom hooks manage all server-side data fetching and caching:

#### useProjects.ts
| Hook | Query Key | Description |
|------|-----------|-------------|
| `useTeacherProjects(teacherId)` | `["teacher-projects", teacherId]` | Fetch teacher's projects |
| `useStudentProjects(studentId)` | `["student-projects", studentId]` | Fetch student's enrolled projects |
| `useProject(projectId)` | `["project", projectId]` | Fetch single project with relations |
| `useTeacherDashboardStats(id)` | `["teacher-stats", id]` | Compute teacher dashboard stats |
| `useStudentDashboardStats(id)` | `["student-stats", id]` | Compute student dashboard stats |
| `useTags()` | `["tags"]` | Fetch all available tags |

#### useTasks.ts
| Hook | Query Key | Description |
|------|-----------|-------------|
| `useProjectTasks(projectId)` | `["tasks", projectId]` | Fetch project tasks in order |
| `useStudentTasks(studentId)` | `["student-tasks", studentId]` | Fetch tasks assigned to student |
| `useUpdateTask()` | Mutation | Updates a task, invalidates `["tasks"]` |
| `useReorderTasks()` | Mutation | Bulk reorders tasks, invalidates `["tasks"]` |

#### useNotifications.ts
| Hook | Query Key | Interval | Description |
|------|-----------|----------|-------------|
| `useNotifications(userId)` | `["notifications", userId]` | 30s | Fetch user notifications |
| `useUnreadCount(userId)` | `["notification-count", userId]` | 30s | Fetch unread count |
| `markRead(id)` | - | - | PATCH single notification |
| `markAllRead()` | - | - | PATCH all, invalidate queries |

### Zustand (UI State)

The `useUIStore` in `src/store/ui.store.ts` manages:

| State | Type | Actions |
|-------|------|---------|
| `sidebarCollapsed` | boolean | `toggleSidebar()`, `setSidebarCollapsed(v)` |
| `notificationPanelOpen` | boolean | `setNotificationPanelOpen(v)` |
| `modalOpen` | string or null | `openModal(id)`, `closeModal()` |

---

## UI Components

### Layout Components

| Component | File | Description |
|-----------|------|-------------|
| Sidebar | `components/layout/Sidebar.tsx` | Left navigation with role-based menu items. Collapsible with animated width transition. |
| Topbar | `components/layout/Topbar.tsx` | Top header with user avatar, notification bell with unread count badge, profile dropdown. |
| NotificationPanel | `components/layout/NotificationPanel.tsx` | Slide-in panel from the right. Shows notifications grouped by read status. Mark individual or all as read. Uses Zustand for open/close state. |
| DashboardShell | `app/(dashboard)/DashboardShell.tsx` | Wraps pages with Sidebar, Topbar, and NotificationPanel. Animates main content margin based on sidebar state. |

### Dashboard Components

| Component | File | Description |
|-----------|------|-------------|
| StatCard | `components/dashboard/StatCard.tsx` | Animated card showing a metric value with icon, label, and optional trend. Uses Framer Motion for entrance animation. |
| ProjectCard | `components/dashboard/ProjectCard.tsx` | Card displaying project title, domain, status badge, date range, member avatars (max 3 shown + overflow count), and task count. |
| TaskKanban | `components/dashboard/TaskKanban.tsx` | Five-column Kanban board (TODO, IN_PROGRESS, IN_REVIEW, DONE, BLOCKED). Uses @dnd-kit for drag-and-drop between columns. Columns highlight on hover during drag. |
| ReviewForm | `components/dashboard/ReviewForm.tsx` | Form for conducting a review. Fields: overall score (slider 0-10), feedback (textarea), and dynamic criteria rows (name + score + remarks). |
| FileUploader | `components/dashboard/FileUploader.tsx` | Drag-and-drop file upload zone using react-dropzone. Category selector. Shows upload progress per file. Posts to `/api/upload`. |
| CompletionBar | `components/dashboard/CompletionBar.tsx` | Horizontal progress bar with percentage label. |
| MilestoneTimeline | `components/dashboard/MilestoneTimeline.tsx` | Vertical timeline of milestones. Shows due date, completion status. Toggle and delete buttons per milestone. |
| ActivityFeed | `components/dashboard/ActivityFeed.tsx` | List of recent activity items. |

### Chart Components

| Component | File | Description |
|-----------|------|-------------|
| TaskDistributionDonut | `components/charts/TaskDistributionDonut.tsx` | Donut chart showing task count by status. Props: `{ todo, inProgress, inReview, done, blocked }`. |
| ProjectCompletionChart | `components/charts/ProjectCompletionChart.tsx` | Chart showing project completion percentage. |
| StudentProgressLine | `components/charts/StudentProgressLine.tsx` | Line chart for tracking student progress over time. |
| MilestoneGanttBar | `components/charts/MilestoneGanttBar.tsx` | Horizontal bar representing milestone timeline. |

### shadcn/ui Primitives (17 components)

All in `components/ui/`. Based on Radix UI primitives with Tailwind styling:

avatar, badge, button, card, dialog, dropdown-menu, input, label, progress, scroll-area, select, separator, skeleton, slider, tabs, textarea, tooltip.

---

## File Upload Workflow

```mermaid
sequenceDiagram
    participant U as User Browser
    participant FU as FileUploader Component
    participant API as POST /api/upload
    participant S3 as AWS S3
    participant DB as MySQL via Prisma

    U->>FU: Drop or select files
    FU->>FU: Validate file size (max 50MB)
    FU->>FU: Select category (REPORT, PRESENTATION, CODE, DATASET, OTHER)
    FU->>API: POST FormData (file, projectId, category, taskId?)
    API->>API: Authenticate session
    API->>API: Build S3 key: uploads/{projectId}/{category}/{timestamp}-{filename}
    API->>S3: PutObjectCommand (file buffer, key, content type)
    S3-->>API: Upload success
    API->>DB: prisma.projectFile.create(record)
    DB-->>API: File record
    API-->>FU: JSON { file: record }
    FU->>FU: Update UI progress to complete
    FU-->>U: Show success toast
```

### S3 Key Format
```
uploads/{projectId}/{category}/{timestamp}-{filename}
```
Example: `uploads/clx123abc/REPORT/1710000000000-final-report.pdf`

### File Download
1. Client calls server action `getDownloadUrl(fileId)`.
2. Server looks up the file record in the database.
3. Server generates a presigned S3 download URL (15-minute expiry).
4. Client creates a temporary anchor element and triggers download.

### File Deletion
1. Only teachers or the original uploader can delete files.
2. Server action `deleteFile(fileId)` deletes from both S3 and the database.

---

## Review System Workflow

```mermaid
sequenceDiagram
    participant T as Teacher
    participant SA as Server Action
    participant DB as Database
    participant E as Email (SMTP)
    participant S as Students

    Note over T: Schedule a Review
    T->>SA: scheduleReview({projectId, reviewType, scheduledAt})
    SA->>DB: Create Review (status: SCHEDULED)
    SA->>DB: Create Notifications for all project members
    SA->>E: Send review scheduled email to each member
    SA-->>T: Return review record

    Note over T: Conduct the Review
    T->>SA: conductReview({reviewId, overallScore, feedback, criteria[]})
    SA->>DB: Update Review (status: COMPLETED, score, feedback)
    SA->>DB: Delete old criteria, create new ReviewCriteria records
    SA->>DB: Recalculate project completion percentage
    SA->>DB: Create FEEDBACK_GIVEN notifications for all members
    SA->>E: Send feedback email with score to each member
    SA-->>T: Return updated review

    S->>DB: View review feedback and criteria scores
```

### Review Criteria Scoring
Each review can have multiple criteria. Each criterion has:
- `criteriaName`: A label (e.g., "Code Quality", "Documentation", "Presentation")
- `score`: Numeric score from 0 to 10
- `remarks`: Optional text feedback per criterion

The `overallScore` (0-10) is stored separately and factors into the project completion calculation.

---

## Notification System

```mermaid
flowchart TD
    A[Action Triggers Notification] --> B{Notification Type}
    B --> C[TASK_ASSIGNED]
    B --> D[REVIEW_SCHEDULED]
    B --> E[FEEDBACK_GIVEN]
    B --> F[PROJECT_UPDATED]
    B --> G[DEADLINE_APPROACHING]
    B --> H[MILESTONE_DUE]

    C --> I[createNotification - single user]
    D --> J[createBulkNotifications - all members]
    E --> J
    F --> J

    I --> K[Database: notifications table]
    J --> K

    K --> L[GET /api/notifications - polling every 30s]
    K --> M[GET /api/notifications/count - polling every 30s]

    L --> N[NotificationPanel UI]
    M --> O[Topbar Bell Badge]

    N --> P[PATCH /api/notifications - mark read]
```

### Notification Triggers

| Event | Type | Recipients | Also Sends Email |
|-------|------|-----------|-----------------|
| Task assigned to student | TASK_ASSIGNED | Assignee | No |
| Review scheduled | REVIEW_SCHEDULED | All project members | Yes |
| Review feedback submitted | FEEDBACK_GIVEN | All project members | Yes |
| Project updated | PROJECT_UPDATED | All project members | No |

### Polling
TanStack Query fetches notifications and unread count every 30 seconds using `refetchInterval: 30000`.

---

## Task Management and Kanban Board

### Task Status Flow

```mermaid
stateDiagram-v2
    [*] --> TODO
    TODO --> IN_PROGRESS
    IN_PROGRESS --> IN_REVIEW
    IN_REVIEW --> DONE
    IN_PROGRESS --> BLOCKED
    BLOCKED --> IN_PROGRESS
    IN_REVIEW --> IN_PROGRESS
    TODO --> BLOCKED
    DONE --> [*]
```

### Kanban Board Architecture

The TaskKanban component renders five columns corresponding to the five TaskStatus values. Each column:
- Uses `@dnd-kit/core` `useDroppable` hook for drop targets
- Highlights with a background color when a task is being dragged over it
- Contains draggable task cards using `@dnd-kit/sortable` `useSortable` hook

When a task is dropped into a different column:
1. The `onDragEnd` handler detects the new column (status).
2. Calls the `reorderTasks` server action with updated status and orderIndex values.
3. TanStack Query invalidates the task cache, causing a refetch.

### Task Permissions

| Action | Teacher | Student |
|--------|---------|---------|
| Create task | Yes | No |
| Update all fields | Yes | No |
| Update status only | No | Yes (if assigned) |
| Delete task | Yes | No |
| Add comment | Yes | Yes |
| Reorder/drag tasks | Yes | No |

---

## Project Completion Calculation

The project completion percentage is calculated by `computeProjectCompletion()` in `src/lib/completion.ts` using a weighted formula:

```
Completion = (Task Score x 0.50) + (Milestone Score x 0.30) + (Review Score x 0.20)
```

| Component | Weight | Calculation |
|-----------|--------|-------------|
| Task Score | 50% | (Number of DONE tasks / Total tasks) x 100 |
| Milestone Score | 30% | (Number of completed milestones / Total milestones) x 100 |
| Review Score | 20% | (Average review overallScore / 10) x 100 |

If a component has no items (e.g., no tasks exist), that component's score is 0.

The completion percentage is recalculated and saved to `project.completionPercentage` whenever:
- A task status changes to DONE
- A milestone is toggled complete/incomplete
- A review is conducted (score submitted)

---

## Email Integration

Email is sent via Nodemailer using SMTP credentials from environment variables. Two email templates exist in `src/lib/email.ts`:

### Review Scheduled Email
Sent to all project members when a teacher schedules a review.

Content includes: Project name, review type, scheduled date and time.

### Feedback Email
Sent to all project members when a teacher submits review feedback.

Content includes: Project name, overall score (out of 10), feedback text.

### SMTP Configuration
The transporter is configured with:
- `host`: SMTP_HOST (e.g., smtp.gmail.com)
- `port`: SMTP_PORT (e.g., 587)
- `secure`: false (uses STARTTLS)
- `auth.user`: SMTP_USER
- `auth.pass`: SMTP_PASS
- `from`: SMTP_FROM

---

## Seed Data

The seed script at `prisma/seed.ts` populates the database with sample data for testing. Run it with:

```bash
npm run db:seed
```

### Seeded Users

| Name | Email | Role | Department |
|------|-------|------|------------|
| Dr. Admin Kumar | admin@university.edu | ADMIN | Computer Science |
| Dr. Priya Sharma | priya.sharma@university.edu | TEACHER | Computer Science |
| Prof. Rajesh Gupta | rajesh.gupta@university.edu | TEACHER | Information Technology |
| Dr. Sneha Patel | sneha.patel@university.edu | TEACHER | Data Science |
| Aarav Mehta | aarav@student.edu | STUDENT | CS (CS2024001) |
| Diya Singh | diya@student.edu | STUDENT | CS (CS2024002) |
| Arjun Verma | arjun@student.edu | STUDENT | IT (IT2024001) |
| Ananya Rao | ananya@student.edu | STUDENT | IT (IT2024002) |
| Vihaan Joshi | vihaan@student.edu | STUDENT | DS (DS2024001) |
| Ishita Nair | ishita@student.edu | STUDENT | DS (DS2024002) |
| Kabir Malhotra | kabir@student.edu | STUDENT | CS (CS2024003) |
| Myra Kapoor | myra@student.edu | STUDENT | IT (IT2024003) |
| Reyansh Agarwal | reyansh@student.edu | STUDENT | DS (DS2024003) |
| Sara Khan | sara@student.edu | STUDENT | CS (CS2024004) |

**Default password for all seed users**: `password123`

### Seeded Projects

| Title | Teacher | Status | Completion |
|-------|---------|--------|------------|
| Smart Campus Navigation System | Dr. Priya Sharma | ACTIVE | 45% |
| Sentiment Analysis Dashboard | Dr. Priya Sharma | ACTIVE | 30% |
| E-Commerce Microservices Platform | Prof. Rajesh Gupta | ACTIVE | 65% |
| Automated Attendance System | Dr. Sneha Patel | COMPLETED | 100% |
| Predictive Maintenance for Lab Equipment | Dr. Sneha Patel | ARCHIVED | 85% |

### Additional Seeded Data
- 4 Tags: AI/ML, Web Development, IoT, Data Science
- 16 Tasks across projects with varying statuses and priorities
- 9 Milestones with varying completion states
- 4 Reviews (2 completed with criteria scores, 2 scheduled)
- 10 Notifications of various types

---

## Environment Variables

Create a `.env` file in the project root. Use `.env.example` as a template.

| Variable | Required | Description |
|----------|----------|-------------|
| DATABASE_URL | Yes | MySQL connection string. Format: `mysql://user:password@host:port/database` |
| NEXTAUTH_SECRET | Yes | Random string for JWT signing. Generate with: `openssl rand -base64 32` |
| NEXTAUTH_URL | Yes | The canonical URL of the application (e.g., `http://localhost:3000`) |
| AWS_REGION | Yes | AWS region for S3 bucket (e.g., `us-east-1`) |
| AWS_ACCESS_KEY_ID | Yes | AWS IAM access key for S3 |
| AWS_SECRET_ACCESS_KEY | Yes | AWS IAM secret key for S3 |
| S3_BUCKET_NAME | Yes | Name of the S3 bucket for file storage |
| SMTP_HOST | No | SMTP server hostname (e.g., `smtp.gmail.com`) |
| SMTP_PORT | No | SMTP server port (default: 587) |
| SMTP_USER | No | SMTP authentication username |
| SMTP_PASS | No | SMTP authentication password or app password |
| SMTP_FROM | No | Sender email address for outgoing emails |

---

## Development Setup

### Prerequisites
- Node.js 20 or later
- MySQL 8.0 server running
- AWS S3 bucket configured (for file upload features)
- SMTP credentials (optional, for email features)

### Steps

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd project-dashboard
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure environment**
   ```bash
   cp .env.example .env
   # Edit .env with your actual values
   ```

4. **Generate Prisma client**
   ```bash
   npx prisma generate
   ```

5. **Push database schema**
   ```bash
   npx prisma db push
   ```

6. **Seed the database (optional)**
   ```bash
   npm run db:seed
   ```

7. **Start development server**
   ```bash
   npm run dev
   ```
   The application starts at `http://localhost:3000` with Turbopack for fast refresh.

### Available Scripts

| Script | Command | Description |
|--------|---------|-------------|
| `npm run dev` | `next dev --turbopack` | Start dev server with Turbopack |
| `npm run build` | `next build` | Production build |
| `npm run start` | `next start` | Start production server |
| `npm run lint` | `next lint` | Run ESLint |
| `npm run db:generate` | `prisma generate` | Regenerate Prisma client |
| `npm run db:push` | `prisma db push` | Push schema changes to database |
| `npm run db:migrate` | `prisma migrate dev` | Create and run migrations |
| `npm run db:seed` | `tsx prisma/seed.ts` | Seed database with sample data |
| `npm run db:studio` | `prisma studio` | Open Prisma Studio GUI |

---

## Docker Deployment

### Architecture

```mermaid
graph LR
    subgraph Docker["Docker Compose"]
        APP["app container -- Node 20 Alpine -- Port 3000"]
        DB["db container -- MySQL 8.0 -- Port 3306"]
        VOL["mysql_data -- Persistent Volume"]
    end

    APP -->|DATABASE_URL| DB
    DB --> VOL
    APP -->|HTTPS| S3["AWS S3"]
    APP -->|SMTP| MAIL["Mail Server"]
    BROWSER["Browser"] -->|Port 3000| APP
```

### Dockerfile (Multi-stage)

**Stage 1 - Builder:**
- Base: `node:20-alpine`
- Runs `npm ci` for deterministic installs
- Generates Prisma client
- Executes `npm run build` (Next.js standalone output)

**Stage 2 - Runner:**
- Base: `node:20-alpine`
- Runs as non-root `nextjs` user (UID 1001)
- Copies only standalone output, static files, and Prisma schema
- Runs `prisma migrate deploy` before starting the server
- Exposes port 3000

### docker-compose.yml

Two services:

**app:**
- Builds from the Dockerfile
- Maps port 3000
- Environment variables passed from host .env or defaults
- Depends on db service with healthcheck condition

**db:**
- MySQL 8.0 official image
- Persistent volume `mysql_data` for data durability
- Healthcheck: `mysqladmin ping` every 10 seconds

### Deploy Commands

```bash
# Build and start in background
docker compose up --build -d

# View application logs
docker compose logs -f app

# Stop services
docker compose down

# Stop and remove persistent data
docker compose down -v
```

---

## Production Checklist

- [ ] Replace all placeholder values in `.env` with real credentials
- [ ] Generate a strong `NEXTAUTH_SECRET` using `openssl rand -base64 32`
- [ ] Set `NEXTAUTH_URL` to the production domain
- [ ] Configure AWS S3 bucket with proper CORS and IAM policies
- [ ] Configure SMTP credentials for email delivery
- [ ] Run `npx prisma db push` or `npx prisma migrate deploy` against the production database
- [ ] Run `npm run build` and verify no TypeScript errors
- [ ] Set strong MySQL passwords in `docker-compose.yml` for production
- [ ] Ensure `.env` is listed in `.gitignore` and never committed
- [ ] Verify security headers are active (X-Frame-Options, HSTS, X-Content-Type-Options)
- [ ] Set up SSL/TLS termination (via reverse proxy, Cloudflare, or load balancer)
- [ ] Configure proper AWS IAM policies (least privilege for S3 access)
- [ ] Set up database backups
- [ ] Monitor application logs for errors

---

## Security Measures

### Implemented

| Measure | Implementation |
|---------|---------------|
| Password hashing | bcryptjs with 12 salt rounds |
| JWT sessions | Stateless, httpOnly cookie via NextAuth |
| Route protection | Middleware intercepts all requests; role-based access control |
| Input validation | Zod schemas on all server action inputs |
| SQL injection prevention | Prisma ORM parameterized queries |
| File upload authorization | Session check on all upload/download endpoints |
| File deletion authorization | Students can only delete their own files |
| Security headers | X-Frame-Options DENY, X-Content-Type-Options nosniff, HSTS, Referrer-Policy strict-origin-when-cross-origin, Permissions-Policy |
| Standalone output | Minimal production build without source code |
| Non-root container | Docker runs as UID 1001 (nextjs user) |
| API error handling | All API routes wrapped in try-catch with generic 500 responses |
| Environment isolation | Secrets in `.env`, excluded from git and Docker image via .gitignore and .dockerignore |
| Server actions | All marked `"use server"`, validated before execution |

### Recommendations for Production

- Rotate AWS access keys regularly and use IAM roles where possible
- Enable S3 bucket versioning and server-side encryption
- Set up rate limiting on authentication endpoints
- Configure CORS on S3 bucket to allow only your application domain
- Use a reverse proxy (Nginx, Caddy) or Cloudflare for SSL termination
- Enable MySQL slow query logging for performance monitoring
- Set up application performance monitoring (APM)
- Implement automated database backups with point-in-time recovery
