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
5. Authentication and Access Control
6. Showcase Module
7. Database Models
8. Routes
9. Server Actions and APIs
10. Notifications
11. UI/UX Highlights
12. Setup (Development)
13. Deployment
14. Environment Variables
15. Seed Data
16. Security Notes

---

## Overview

The app supports role-based dashboards:

- ADMIN: governance, users, allowed emails, showcase review/publish
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
- Added `/register` page and server action registration flow
- Added allowlist checks in login and middleware
- Added admin exception for allowlist checks (admin recovery/ops)
- Added `/admin/allowed-emails` management screen

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

Decoupled:

- Core project domain models and logic
- Showcase domain models and logic

---

## Authentication and Access Control

### Login flow

- Credentials provider validates email/password
- Password verified with bcrypt hash compare
- JWT includes `id` and `role`
- Session maps user role for client and middleware checks

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

---

## Database Models

### Existing core models

- `User`, `Project`, `ProjectMember`, `Task`, `Milestone`, `Review`, `ReviewCriteria`, `ProjectFile`, `Comment`, `Notification`, `Tag`, `ProjectTag`

### New models

- `AllowedEmail`
- `ShowcaseProject`
- `ProjectVersion`
- `ReviewFeedback`
- `ProjectAsset`
- `ShowcaseTeamMember`

### New enums

- `ShowcaseProjectStatus`
- `ShowcaseProjectDomain`
- `ShowcaseAssetKind`
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
- `/admin/users`
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

- `registerUser()`
- `addAllowedEmail()`
- `removeAllowedEmail()`
- `getAllowedEmails()`
- `checkAllowedEmail()`

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
- Register supports STUDENT/TEACHER role selection
- Better inline error states

### Admin additions

- Allowed email management UI
- Showcase command center and structured review view

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
- Prefer `prisma migrate deploy` in production
- Restrict DB exposure to private network
- Use TLS/HTTPS in production
