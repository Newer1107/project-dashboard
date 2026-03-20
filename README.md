# Academic Project Dashboard

A full-stack dashboard for academic project management and showcase publishing.

This repository now contains two systems that share authentication:

- Core Project Monitoring System (existing): project/task/milestone/review/file workflows
- Showcase System (new): versioned submission -> admin review -> publish pipeline

---

## Table of Contents

1. Overview
2. What Is New
3. Tech Stack
4. Architecture
5. End-to-End Workflows
6. Authentication and Access Control
7. Core Project Monitoring Workflows
8. CSV Assignment and Email Outbox Workflows
9. Admin Project Control Workflows
10. Showcase Module
11. Database Models
12. Routes
13. Server Actions and APIs
14. Notifications
15. UI/UX Highlights
16. Setup (Development)
17. Deployment
18. Environment Variables
19. Operational Playbooks
20. QA and Testing Matrix
21. Seed Data
22. Security Notes
23. Troubleshooting

---

## Overview

The app supports role-based dashboards:

- ADMIN: governance, users, allowed emails, full project control (mentor/member management), showcase review/publish
- TEACHER: project management + showcase authoring
- STUDENT: project participation + showcase authoring

### Core principles

- Backend-first authorization
- Strict role-based route guards
- Decoupled domain modules
- Type-safe backend with Prisma + Zod

---

## What Is New

### Authentication and Access

- Added allowed-email governance with `AllowedEmail` table
- Added reusable backend validator `isEmailAllowed(email)`
- Added OTP-based registration flow on `/register`
  - request OTP
  - verify OTP
  - complete registration
- Added allowlist checks in login and middleware
- Added admin exception for allowlist checks (admin recovery/ops)
- Added `/admin/allowed-emails` management screen
- Added teacher registration approval workflow
  - teacher self-registrations are created inactive
  - admin approves/rejects in `/admin/teacher-approvals`

### Reliability and Error UX

- Added App Router error boundaries to replace generic production Server Components crash message
  - route-level `error.tsx`
  - app-level `global-error.tsx`

### Bulk Email Outbox (CSV Assignments)

- Added Database Outbox Pattern for high-volume assignment notifications
- Admin CSV assignment processing now writes notification jobs into `EmailQueue` instead of sending synchronously
- Added `PendingProjectAssignment` for invite flows where user does not yet exist
- Added secure background processor endpoint:
  - `POST /api/cron/process-emails`
  - token-protected via `EMAIL_QUEUE_CRON_SECRET`
- Added admin monitoring page at `/admin/email-logs` with retry for failed emails
- Added manual queue trigger from admin UI (`Run Queue Now`) for immediate processing
- Added registration-time pending assignment sync:
  - if a user registers after invite, pending rows for that email are auto-converted to `ProjectMember`
  - pending rows are marked `ASSIGNED`

### Admin Project Control Module

- Added `/admin/projects` to manage all projects centrally
- Admin can:
  - edit project metadata (title, description, domain, status, dates, max group size)
  - change project mentor (teacher)
  - add members to project
  - change member roles (`MEMBER` / `LEAD`)
  - remove members
- Server-side admin-only actions enforce access and validation for all project control operations

### Showcase Module

- Added complete decoupled showcase domain:
  - `ShowcaseProject`
  - `ProjectVersion`
  - `ReviewFeedback`
  - `ProjectAsset`
  - `ShowcaseTeamMember`
- Added strict status transition rules
- Added immutable version snapshots on submit/resubmit/edit events
- Added admin review and publish workflows
- Added user-facing multi-step structured submission workspace
- Added public showcase list + project detail pages (`/showcase`, `/showcase/[projectId]`)

### Notifications and Events

New notification types:

- `PROJECT_SUBMITTED`
- `FEEDBACK_ADDED`
- `CHANGES_REQUESTED`
- `PROJECT_APPROVED`
- `PROJECT_PUBLISHED`

### UX Improvements

- Global command palette in topbar (quick navigation/actions)
- Keyboard shortcuts:
  - `Ctrl/Cmd + K` open command menu
  - `Ctrl/Cmd + B` open notifications
- Sidebar links for showcase and allowed email management
- Enhanced dashboard visual surface/background polish

---

## Tech Stack

- Next.js 15 (App Router, standalone output)
- React 19 + TypeScript
- Prisma + MySQL
- NextAuth v5 (Credentials + JWT)
- TanStack Query + Zustand
- Tailwind CSS + shadcn/ui + Radix
- Framer Motion
- AWS S3 (uploads)
- Nodemailer (SMTP/Gmail)

---

## Architecture

```text
Shared Auth + Access Control
        |
        |---- Core Project Monitoring System
        |
        |---- Showcase System (Submission/Review/Publish)
                    |
                    -> Admin Control Surface (/admin/showcase)
```

### Integration boundaries

Shared:

- User identity/auth/session
- Role checks and middleware
- Notifications
- Email outbox queue + background processor

Decoupled:

- Core project domain models and logic
- Showcase domain models and logic

---

## End-to-End Workflows

This section captures full system behavior from onboarding to delivery and publishing.

### Role-level journeys

- ADMIN:
  - controls access policy and approvals
  - governs users and all projects
  - imports assignments and manages email outbox
  - reviews and publishes showcase submissions
- TEACHER:
  - creates and manages projects
  - manages members, tasks, milestones, files, and reviews
  - authors showcase submissions
- STUDENT:
  - joins assigned projects
  - executes tasks and milestone work
  - receives notifications
  - contributes to showcase submissions

### Lifecycle summary

- Auth lifecycle:
  - request OTP -> verify OTP -> complete registration -> role activation checks
- Assignment lifecycle:
  - CSV row -> project and user resolution -> member or pending invite -> queued email
- Outbox lifecycle:
  - PENDING -> PROCESSING -> SENT or FAILED
- Core project lifecycle:
  - creation -> active execution -> review and progress tracking -> completion
- Showcase lifecycle:
  - DRAFT -> SUBMITTED -> UNDER_REVIEW -> CHANGES_REQUESTED or APPROVED/REJECTED -> PUBLISHED

---

## Authentication and Access Control

### Login flow

- Credentials provider validates email/password
- Password verified with bcrypt hash compare
- JWT includes `id` and `role`
- Session maps user role for client and middleware checks
- Inactive users cannot log in (used for pending teacher approvals)

### Registration flow (OTP)

- Step 1: user submits name/email/password/role
- Step 2: backend validates allowed email + duplicate email and issues OTP
- OTP details:
  - 6-digit cryptographically generated code
  - stored as hash (never plain text)
  - expires in 5 minutes
  - max 5 verification attempts
  - resend cooldown 60 seconds
- OTP email delivery is required (SMTP misconfiguration surfaces explicit error)
- Account is created only after successful OTP verification
- Teacher registrations are created with `isActive = false` until admin approval

### Allowed email checks

Backend enforcement exists in both places:

- `authorize()` in auth config
- `middleware.ts` for route-level protection

### Allowed rules

- Any email ending with `@tcetmumbai.in` is allowed
- Any email present in `AllowedEmail` and not expired is allowed
- Admin users are exempt from allowlist checks for operational continuity

### Public vs protected

Public:

- `/login`
- `/register`
- `/showcase`
- `/api/auth/*`

Protected:

- `/admin/*` (ADMIN)
- `/teacher/*` (TEACHER)
- `/student/*` (STUDENT)
- `/showcase/my-projects` (TEACHER/STUDENT)

### Authorization model

- Middleware enforces route-level access.
- Server actions enforce operation-level access.
- Every privileged operation validates role server-side.
- UI visibility is not treated as a security boundary.

### Teacher activation workflow

- Teacher completes OTP registration.
- Account is created with inactive status.
- Admin approves account from teacher approvals panel.
- Teacher access is granted only after approval.

---

## Core Project Monitoring Workflows

### 1) Project creation and setup

- Teacher creates a project with timeline, domain, and group size constraints.
- Optional tags are attached for discoverability.
- Project appears in teacher project list and dashboard counters.

### 2) Member operations

- Members are added by student ID, email, or roll number.
- Max group size is enforced before insertion.
- Roles are maintained as MEMBER or LEAD.
- Member removal deletes project-member linkage.

### 3) Task and milestone execution

- Tasks are created and assigned to users.
- Milestones define target checkpoints.
- Completion percentages are recalculated and reflected in analytics components.

### 4) Reviews and artifacts

- Reviews are scheduled and tracked per project.
- Files and comments provide project evidence and collaboration context.
- Notification events keep members synchronized.

---

## CSV Assignment and Email Outbox Workflows

### CSV format and parsing

- Required headers:
  - email
  - projectName
- Parser behavior:
  - handles quoted CSV values
  - normalizes email casing and whitespace
  - skips invalid rows
  - deduplicates repeated email + projectName pairs

### Assignment processing pipeline

- Resolve project by projectName.
- Auto-create project when title is not found.
- Resolve users by email.
- Existing user rows create ProjectMember entries.
- Missing users create PendingProjectAssignment entries.
- All valid rows create EmailQueue jobs with PENDING status.

### Invite-to-membership conversion

- Invited users can register later via OTP.
- Registration transaction checks pending assignments by email.
- Matching entries are converted into ProjectMember rows.
- Pending entries are marked ASSIGNED.
- Projects become visible immediately in student project list.

### Outbox processing and controls

- Queue processing flow:
  - claim oldest PENDING rows as PROCESSING
  - send with controlled stagger delay
  - mark SENT on success
  - requeue or mark FAILED based on retry count
- Admin controls:
  - Retry Failed
  - Run Queue Now
  - secured cron endpoint at /api/cron/process-emails

---

## Admin Project Control Workflows

Route: /admin/projects

### 1) Project governance view

- Admin can view all projects across mentors.
- Search supports title, domain, and mentor matching.

### 2) Metadata editing workflow

- Admin can edit title, description, domain, status, dates, and max group size.
- Validation runs in admin server actions.
- Relevant pages are revalidated after update.

### 3) Mentor reassignment workflow

- Admin selects active teacher as mentor.
- Backend validates teacher role and active state.
- Project mentor updates propagate to downstream teacher views.

### 4) Member administration workflow

- Add member with MEMBER or LEAD role.
- Update existing member role.
- Remove member from project.
- Capacity and consistency checks are applied server-side.

---

## Showcase Module

### Status lifecycle

`DRAFT -> SUBMITTED -> UNDER_REVIEW -> (CHANGES_REQUESTED | APPROVED | REJECTED)`

`CHANGES_REQUESTED -> SUBMITTED -> UNDER_REVIEW`

`APPROVED -> PUBLISHED`

### Structured submission sections

- Basic information: title, short description, full description
- Project details: problem statement, objectives, methodology, key features
- Technical details: tech stack, architecture, database, API integrations
- Resources: GitHub, live demo, documentation link/files, screenshots
- Team information: members + mentor
- Additional: categories/tags, project domain, visibility

### Core rules

- Never overwrite past submission state
- Every submit/resubmit creates a new `ProjectVersion`
- Admin actions enforce valid status transitions
- Public page shows only `status = PUBLISHED && isPublic = true`

### Submission validation rules (backend-enforced)

- `title` is required
- `shortDescription` is required
- At least 2 major content sections must be filled before submission
- GitHub URL OR documentation (link or file reference) is required before submission

### Admin workflow

- View submissions at `/admin/showcase`
- Filter by status
- Start review
- Add/resolve feedback
- Request changes / approve / publish / reject

### Creator workflow

- Create/edit project at `/showcase/my-projects`
- Submit when in `DRAFT`
- Resubmit when in `CHANGES_REQUESTED`
- View latest feedback and version context

### Full submission-review-publish workflow

- Draft authoring:
  - creator builds structured content, assets, and links
- Submit event:
  - backend validates required fields and minimum section coverage
  - immutable ProjectVersion snapshot is created
  - status transitions to SUBMITTED
- Review event:
  - admin starts review and adds feedback entries
  - admin can request changes, approve, reject, or publish
- Resubmission event:
  - creator updates content and resubmits
  - new snapshot is created; previous snapshots remain immutable
- Publication event:
  - project appears publicly only when status is PUBLISHED and visibility is enabled

### Versioning and audit guarantees

- Each submission cycle produces an immutable version record.
- Feedback remains tied to review context, preserving traceability.
- Current editable state never overwrites historical submission evidence.

---

## Database Models

### Existing core models

- `User`, `Project`, `ProjectMember`, `Task`, `Milestone`, `Review`, `ReviewCriteria`, `ProjectFile`, `Comment`, `Notification`, `Tag`, `ProjectTag`

### New models

- `AllowedEmail`
- `EmailVerificationOTP`
- `EmailQueue`
- `PendingProjectAssignment`
- `ShowcaseProject`
- `ProjectVersion`
- `ReviewFeedback`
- `ProjectAsset`
- `ShowcaseTeamMember`

### New enums

- `ShowcaseProjectStatus`
- `ShowcaseProjectDomain`
- `ShowcaseAssetKind`
- `EmailQueueStatus`
- Added notification enum values for showcase events

---

## Routes

### Auth/Public

- `/login`
- `/register`
- `/showcase`
- `/showcase/[projectId]`

### Admin

- `/admin`
- `/admin/projects`
- `/admin/users`
- `/admin/teacher-approvals`
- `/admin/project-assignments`
- `/admin/email-logs`
- `/admin/allowed-emails`
- `/admin/showcase`
- `/admin/showcase/[projectId]`
- `/admin/settings`

### Teacher

- `/teacher`
- `/teacher/projects`
- `/teacher/projects/new`
- `/teacher/projects/[projectId]`
- `/teacher/analytics`

### Student

- `/student`
- `/student/projects`
- `/student/projects/[projectId]`
- `/student/notifications`

### Showcase authoring

- `/showcase/my-projects`

---

## Server Actions and APIs

### New auth/access actions

- `requestOTP()`
- `verifyOTP()`
- `completeRegistration()`
- `addAllowedEmail()`
- `removeAllowedEmail()`
- `getAllowedEmails()`
- `checkAllowedEmail()`

### New admin user moderation actions

- `getPendingTeacherRegistrations()`
- `approveTeacherRegistration()`
- `rejectTeacherRegistration()`

### New bulk assignment/email outbox actions

- `adminUploadProjectAssignments()`
- `getAdminAssignableProjects()`
- `getEmailQueueLogs()`
- `retryFailedEmails()`
- `runEmailQueueNow()`

### New admin project control actions

- `getAdminProjectsManagementData()`
- `adminUpdateProject()`
- `adminUpdateProjectMentor()`
- `adminAddProjectMember()`
- `adminUpdateProjectMemberRole()`
- `adminRemoveProjectMember()`

### New background utility

- `processEmailQueue(batchSize = 50)`
  - claims `PENDING` rows as `PROCESSING`
  - sends via pooled Nodemailer transporter
  - marks `SENT` or requeues/fails with `attempts` and `errorLog`

### New showcase actions

User-side:

- `createProject()`
- `updateProject()`
- `submitProject()`
- `resubmitProject()`
- `getMyProjects()`
- `getProjectVersions()`

Admin-side:

- `getAllSubmissions()`
- `getSubmissionById()`
- `startReview()`
- `addFeedback()`
- `resolveFeedback()`
- `requestChanges()`
- `approveProject()`
- `publishProject()`
- `rejectProject()`

Public:

- `getPublicShowcaseProjects()`
- `getPublicShowcaseProjectById()`

### New API route

- `GET /api/auth/allowed-email?email=...`
- `POST /api/cron/process-emails`

---

## Notifications

Existing project notifications remain unchanged.

Showcase events now emit notifications for:

- submission
- feedback added
- changes requested
- approved
- published

---

## UI/UX Highlights

### Layout

- Role-aware sidebar nav links
- Topbar command menu with quick actions
- Improved shell visuals with subtle gradients and texture

### Auth screens

- Login now links to register
- Register supports STUDENT/TEACHER role selection with OTP verification
- Better inline error states
- Teacher pending approval message on login after successful registration

### Admin additions

- Allowed email management UI
- Teacher approvals panel for teacher self-registration moderation
- Email logs panel for outbox status + retry failed
- Projects management panel for editing project details, mentor, and members
- Showcase command center and structured review view

### Project Assignment Import

- Admin CSV assignment import requires only `email` and `projectName`
- Projects are auto-resolved by project title from each CSV row (no manual project picker)
- CSV assignment import supports both existing users and new invitees
- Existing users are assigned directly to `ProjectMember`
- Non-existing users are stored as `PendingProjectAssignment`
- When invited users register later, pending assignments are automatically linked and moved into `ProjectMember`
- All assignment notifications are queued and processed asynchronously

### Showcase UI highlights

- Multi-step project submission form (stepper)
- Structured section cards for review readability
- Basic version comparison in admin review
- Public project detail pages with sectioned narrative + screenshot gallery

---

## Setup (Development)

### 1. Install

```bash
npm ci
```

### 2. Configure env

```bash
cp .env.example .env
```

### 3. Database

```bash
npm run db:generate
npm run db:push
```

Optional seed:

```bash
npm run db:seed
```

### 4. Run app

```bash
npm run dev
```

---

## Deployment

For complete production steps, see:

- [DEPLOYMENT.md](DEPLOYMENT.md)

Includes:

- Docker deployment
- PM2 deployment
- SSL/nginx setup
- migration strategy
- troubleshooting and backups

---

## Environment Variables

### Required

```env
DATABASE_URL="mysql://user:password@host:3306/project_dashboard"
NEXTAUTH_SECRET="<strong-random-secret>"
NEXTAUTH_URL="https://your-domain.com"
OTP_HASH_SECRET="<strong-random-secret>"
EMAIL_QUEUE_CRON_SECRET="<strong-random-secret>"
```

### AWS S3

```env
AWS_REGION="..."
AWS_ACCESS_KEY_ID="..."
AWS_SECRET_ACCESS_KEY="..."
S3_BUCKET_NAME="..."
```

### SMTP/Gmail

```env
SMTP_PROVIDER="gmail"
SMTP_HOST="smtp.gmail.com"
SMTP_PORT="465"
SMTP_SECURE="true"
SMTP_USER="your-email@gmail.com"
SMTP_PASS="your-app-password"
SMTP_FROM="your-email@gmail.com"
```

Note: SMTP is required for OTP registration email delivery.
Note: bulk email processing route requires `EMAIL_QUEUE_CRON_SECRET`.

---

## Operational Playbooks

### Playbook A: Semester onboarding

- Add allowed emails or confirm institutional domain access policy.
- Approve pending teacher registrations.
- Import assignment CSV with email and projectName.
- Review import summary:
  - matched rows
  - created projects
  - direct assignments
  - pending invites
- Run Queue Now for immediate notification delivery.
- Confirm invited users convert to memberships after OTP registration.

### Playbook B: Mentor reassignment

- Open /admin/projects.
- Update project mentor to active teacher.
- Validate teacher access on teacher project screens.

### Playbook C: Recover failed emails

- Inspect FAILED rows in /admin/email-logs.
- Fix SMTP or provider credentials/connectivity.
- Click Retry Failed.
- Click Run Queue Now.
- Verify rows move to SENT or requeue with updated error logs.

### Playbook D: Showcase publishing batch

- Open /admin/showcase.
- Filter by submission state.
- Start review and process feedback.
- Request changes or approve.
- Publish approved items.
- Verify public visibility in /showcase.

---

## QA and Testing Matrix

### Auth and access tests

- OTP request cooldown and expiry behavior.
- Invalid OTP attempt caps and error responses.
- Teacher inactive login rejection until approval.
- Route guard checks across all role scopes.

### Assignment and outbox tests

- CSV parsing with quoted values and malformed lines.
- Existing user direct assignment path.
- New user pending assignment path.
- Registration-time pending assignment conversion.
- Queue retry and failure threshold logic.

### Admin project control tests

- Metadata edits with valid and invalid payloads.
- Mentor reassignment to inactive or wrong-role users should fail.
- Member add operations enforcing max group size.
- Member role transitions including LEAD updates.
- Member removal consistency across project views.

### Showcase tests

- Submission validation constraints.
- Status transition integrity.
- Snapshot creation on submit and resubmit.
- Public listing restricted to published and visible submissions.

---

## Seed Data

Seed creates:

- default admin (`admin@university.edu`)
- teacher and student users
- sample projects, tasks, milestones, reviews, notifications

Default password for seeded users:

- `password123`

---

## Security Notes

- Keep `.env` out of git
- Rotate AWS and SMTP credentials regularly
- Use strong `NEXTAUTH_SECRET`
- Use strong `OTP_HASH_SECRET` (separate from session secret recommended)
- Prefer `prisma migrate deploy` in production
- Restrict DB exposure to private network
- Use TLS/HTTPS in production
- Teacher accounts are intentionally blocked from login until admin approval
- Protect `/api/cron/process-emails` with a strong secret and never expose it client-side

---

## Troubleshooting

### Projects not visible for invited users after registration

- Verify registration completed via OTP flow.
- Verify pending assignment email matches registered email (normalized lowercase).
- Verify PendingProjectAssignment status changes to ASSIGNED.
- Verify ProjectMember entries were created for the new user.

### Emails remain in PENDING

- Verify SMTP environment variables.
- Use Run Queue Now in /admin/email-logs.
- Verify cron token and scheduler invocation for /api/cron/process-emails.

### Mentor update failures

- Confirm selected mentor is active TEACHER.
- Confirm action is performed by ADMIN session.

### Standalone runtime warning

- In standalone output mode, run with node .next/standalone/server.js in production instead of next start.
