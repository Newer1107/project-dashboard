import { PrismaClient, Role, ProjectStatus, TaskStatus, TaskPriority, MemberRole, ReviewStatus, FileCategory, NotificationType } from "@prisma/client";
import { hash } from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Seeding database...");

  // Clean existing data
  await prisma.projectTag.deleteMany();
  await prisma.reviewCriteria.deleteMany();
  await prisma.notification.deleteMany();
  await prisma.comment.deleteMany();
  await prisma.projectFile.deleteMany();
  await prisma.review.deleteMany();
  await prisma.milestone.deleteMany();
  await prisma.task.deleteMany();
  await prisma.projectMember.deleteMany();
  await prisma.project.deleteMany();
  await prisma.tag.deleteMany();
  await prisma.user.deleteMany();

  const passwordHash = await hash("password123", 12);

  // === Users ===
  const admin = await prisma.user.create({
    data: {
      name: "Dr. Admin Kumar",
      email: "admin@university.edu",
      passwordHash,
      role: Role.ADMIN,
      department: "Computer Science",
    },
  });

  const teachers = await Promise.all([
    prisma.user.create({
      data: {
        name: "Dr. Priya Sharma",
        email: "priya.sharma@university.edu",
        passwordHash,
        role: Role.TEACHER,
        department: "Computer Science",
      },
    }),
    prisma.user.create({
      data: {
        name: "Prof. Rajesh Gupta",
        email: "rajesh.gupta@university.edu",
        passwordHash,
        role: Role.TEACHER,
        department: "Information Technology",
      },
    }),
    prisma.user.create({
      data: {
        name: "Dr. Sneha Patel",
        email: "sneha.patel@university.edu",
        passwordHash,
        role: Role.TEACHER,
        department: "Data Science",
      },
    }),
  ]);

  const students = await Promise.all([
    prisma.user.create({ data: { name: "Aarav Mehta", email: "aarav@student.edu", passwordHash, role: Role.STUDENT, department: "Computer Science", rollNumber: "CS2024001" } }),
    prisma.user.create({ data: { name: "Diya Singh", email: "diya@student.edu", passwordHash, role: Role.STUDENT, department: "Computer Science", rollNumber: "CS2024002" } }),
    prisma.user.create({ data: { name: "Arjun Verma", email: "arjun@student.edu", passwordHash, role: Role.STUDENT, department: "Information Technology", rollNumber: "IT2024001" } }),
    prisma.user.create({ data: { name: "Ananya Rao", email: "ananya@student.edu", passwordHash, role: Role.STUDENT, department: "Information Technology", rollNumber: "IT2024002" } }),
    prisma.user.create({ data: { name: "Vihaan Joshi", email: "vihaan@student.edu", passwordHash, role: Role.STUDENT, department: "Data Science", rollNumber: "DS2024001" } }),
    prisma.user.create({ data: { name: "Ishita Nair", email: "ishita@student.edu", passwordHash, role: Role.STUDENT, department: "Data Science", rollNumber: "DS2024002" } }),
    prisma.user.create({ data: { name: "Kabir Malhotra", email: "kabir@student.edu", passwordHash, role: Role.STUDENT, department: "Computer Science", rollNumber: "CS2024003" } }),
    prisma.user.create({ data: { name: "Myra Kapoor", email: "myra@student.edu", passwordHash, role: Role.STUDENT, department: "Information Technology", rollNumber: "IT2024003" } }),
    prisma.user.create({ data: { name: "Reyansh Agarwal", email: "reyansh@student.edu", passwordHash, role: Role.STUDENT, department: "Data Science", rollNumber: "DS2024003" } }),
    prisma.user.create({ data: { name: "Sara Khan", email: "sara@student.edu", passwordHash, role: Role.STUDENT, department: "Computer Science", rollNumber: "CS2024004" } }),
  ]);

  // === Tags ===
  const tags = await Promise.all([
    prisma.tag.create({ data: { name: "AI/ML", color: "#8b5cf6" } }),
    prisma.tag.create({ data: { name: "Web Dev", color: "#6366f1" } }),
    prisma.tag.create({ data: { name: "IoT", color: "#10b981" } }),
    prisma.tag.create({ data: { name: "Data Science", color: "#f59e0b" } }),
  ]);

  // === Projects ===
  const now = new Date();
  const projects = await Promise.all([
    prisma.project.create({
      data: {
        title: "Smart Campus Navigation System",
        description: "An IoT-based indoor navigation system for the university campus using BLE beacons and a mobile app. The system provides real-time location tracking and route optimization for students and visitors.",
        domain: "IoT",
        department: "Computer Science",
        status: ProjectStatus.ACTIVE,
        startDate: new Date(now.getFullYear(), now.getMonth() - 2, 1),
        endDate: new Date(now.getFullYear(), now.getMonth() + 2, 30),
        completionPercentage: 45,
        teacherId: teachers[0].id,
        tags: { create: [{ tagId: tags[2].id }] },
        members: {
          create: [
            { studentId: students[0].id, role: MemberRole.LEAD },
            { studentId: students[1].id, role: MemberRole.MEMBER },
            { studentId: students[6].id, role: MemberRole.MEMBER },
          ],
        },
      },
    }),
    prisma.project.create({
      data: {
        title: "Sentiment Analysis Dashboard",
        description: "A real-time sentiment analysis platform that monitors social media feeds, news articles, and customer reviews using NLP and transformer models. Features interactive visualizations and alert systems.",
        domain: "Machine Learning",
        department: "Data Science",
        status: ProjectStatus.ACTIVE,
        startDate: new Date(now.getFullYear(), now.getMonth() - 1, 15),
        endDate: new Date(now.getFullYear(), now.getMonth() + 3, 15),
        completionPercentage: 30,
        teacherId: teachers[2].id,
        tags: { create: [{ tagId: tags[0].id }, { tagId: tags[3].id }] },
        members: {
          create: [
            { studentId: students[4].id, role: MemberRole.LEAD },
            { studentId: students[5].id, role: MemberRole.MEMBER },
            { studentId: students[8].id, role: MemberRole.MEMBER },
          ],
        },
      },
    }),
    prisma.project.create({
      data: {
        title: "E-Commerce Microservices Platform",
        description: "A scalable e-commerce platform built with microservices architecture using Next.js, Node.js, and Docker. Includes product catalog, order management, payment integration, and admin dashboard.",
        domain: "Web Development",
        department: "Information Technology",
        status: ProjectStatus.ACTIVE,
        startDate: new Date(now.getFullYear(), now.getMonth() - 3, 1),
        endDate: new Date(now.getFullYear(), now.getMonth() + 1, 30),
        completionPercentage: 65,
        teacherId: teachers[1].id,
        tags: { create: [{ tagId: tags[1].id }] },
        members: {
          create: [
            { studentId: students[2].id, role: MemberRole.LEAD },
            { studentId: students[3].id, role: MemberRole.MEMBER },
            { studentId: students[7].id, role: MemberRole.MEMBER },
          ],
        },
      },
    }),
    prisma.project.create({
      data: {
        title: "Automated Attendance System",
        description: "A face-recognition based attendance system using deep learning models. Integrates with the university ERP for automated attendance marking and reporting.",
        domain: "Computer Vision",
        department: "Computer Science",
        status: ProjectStatus.COMPLETED,
        startDate: new Date(now.getFullYear(), now.getMonth() - 6, 1),
        endDate: new Date(now.getFullYear(), now.getMonth() - 1, 30),
        completionPercentage: 100,
        teacherId: teachers[0].id,
        tags: { create: [{ tagId: tags[0].id }] },
        members: {
          create: [
            { studentId: students[9].id, role: MemberRole.LEAD },
            { studentId: students[1].id, role: MemberRole.MEMBER },
          ],
        },
      },
    }),
    prisma.project.create({
      data: {
        title: "Predictive Maintenance for Lab Equipment",
        description: "A data-driven predictive maintenance system for university laboratory equipment using sensor data and machine learning models to forecast equipment failures.",
        domain: "Data Science",
        department: "Data Science",
        status: ProjectStatus.ARCHIVED,
        startDate: new Date(now.getFullYear() - 1, 6, 1),
        endDate: new Date(now.getFullYear() - 1, 11, 30),
        completionPercentage: 85,
        teacherId: teachers[2].id,
        tags: { create: [{ tagId: tags[3].id }, { tagId: tags[2].id }] },
        members: {
          create: [
            { studentId: students[8].id, role: MemberRole.LEAD },
            { studentId: students[4].id, role: MemberRole.MEMBER },
          ],
        },
      },
    }),
  ]);

  // === Tasks for Project 1 (Smart Campus) ===
  const taskData = [
    { projectId: projects[0].id, title: "Design system architecture", assignedToId: students[0].id, status: TaskStatus.DONE, priority: TaskPriority.HIGH, orderIndex: 0, completedAt: new Date() },
    { projectId: projects[0].id, title: "Set up BLE beacon network", assignedToId: students[6].id, status: TaskStatus.IN_PROGRESS, priority: TaskPriority.HIGH, orderIndex: 1, dueDate: new Date(now.getTime() + 7 * 86400000) },
    { projectId: projects[0].id, title: "Develop mobile app UI", assignedToId: students[1].id, status: TaskStatus.IN_PROGRESS, priority: TaskPriority.MEDIUM, orderIndex: 2, dueDate: new Date(now.getTime() + 14 * 86400000) },
    { projectId: projects[0].id, title: "Implement indoor positioning algorithm", assignedToId: students[0].id, status: TaskStatus.TODO, priority: TaskPriority.CRITICAL, orderIndex: 3, dueDate: new Date(now.getTime() + 21 * 86400000) },
    { projectId: projects[0].id, title: "Database schema design", assignedToId: null, status: TaskStatus.DONE, priority: TaskPriority.MEDIUM, orderIndex: 4, completedAt: new Date() },
    { projectId: projects[0].id, title: "API integration testing", assignedToId: students[1].id, status: TaskStatus.TODO, priority: TaskPriority.LOW, orderIndex: 5, dueDate: new Date(now.getTime() + 30 * 86400000) },
    // Tasks for Project 2 (Sentiment Analysis)
    { projectId: projects[1].id, title: "Data collection pipeline", assignedToId: students[4].id, status: TaskStatus.DONE, priority: TaskPriority.HIGH, orderIndex: 0, completedAt: new Date() },
    { projectId: projects[1].id, title: "Train transformer model", assignedToId: students[5].id, status: TaskStatus.IN_PROGRESS, priority: TaskPriority.CRITICAL, orderIndex: 1, dueDate: new Date(now.getTime() + 10 * 86400000) },
    { projectId: projects[1].id, title: "Build visualization dashboard", assignedToId: students[8].id, status: TaskStatus.TODO, priority: TaskPriority.MEDIUM, orderIndex: 2, dueDate: new Date(now.getTime() + 20 * 86400000) },
    { projectId: projects[1].id, title: "Alert system implementation", assignedToId: students[4].id, status: TaskStatus.TODO, priority: TaskPriority.LOW, orderIndex: 3 },
    // Tasks for Project 3 (E-Commerce)
    { projectId: projects[2].id, title: "Product catalog service", assignedToId: students[2].id, status: TaskStatus.DONE, priority: TaskPriority.HIGH, orderIndex: 0, completedAt: new Date() },
    { projectId: projects[2].id, title: "Order management service", assignedToId: students[3].id, status: TaskStatus.DONE, priority: TaskPriority.HIGH, orderIndex: 1, completedAt: new Date() },
    { projectId: projects[2].id, title: "Payment gateway integration", assignedToId: students[2].id, status: TaskStatus.IN_REVIEW, priority: TaskPriority.CRITICAL, orderIndex: 2, dueDate: new Date(now.getTime() + 5 * 86400000) },
    { projectId: projects[2].id, title: "Admin dashboard frontend", assignedToId: students[7].id, status: TaskStatus.IN_PROGRESS, priority: TaskPriority.MEDIUM, orderIndex: 3, dueDate: new Date(now.getTime() + 12 * 86400000) },
    { projectId: projects[2].id, title: "Docker containerization", assignedToId: null, status: TaskStatus.BLOCKED, priority: TaskPriority.HIGH, orderIndex: 4 },
    { projectId: projects[2].id, title: "Load testing and optimization", assignedToId: students[3].id, status: TaskStatus.TODO, priority: TaskPriority.LOW, orderIndex: 5, dueDate: new Date(now.getTime() + 25 * 86400000) },
  ];

  await prisma.task.createMany({ data: taskData });

  // === Milestones ===
  const milestoneData = [
    { projectId: projects[0].id, title: "Phase 1: Research & Planning", dueDate: new Date(now.getFullYear(), now.getMonth() - 1, 15), isCompleted: true, completedAt: new Date(now.getFullYear(), now.getMonth() - 1, 14), weight: 15 },
    { projectId: projects[0].id, title: "Phase 2: Prototype Development", dueDate: new Date(now.getFullYear(), now.getMonth(), 30), isCompleted: false, weight: 25 },
    { projectId: projects[0].id, title: "Phase 3: Testing & Deployment", dueDate: new Date(now.getFullYear(), now.getMonth() + 2, 15), isCompleted: false, weight: 30 },
    { projectId: projects[1].id, title: "Dataset Preparation", dueDate: new Date(now.getFullYear(), now.getMonth(), 1), isCompleted: true, completedAt: new Date(), weight: 20 },
    { projectId: projects[1].id, title: "Model Training Complete", dueDate: new Date(now.getFullYear(), now.getMonth() + 1, 15), isCompleted: false, weight: 30 },
    { projectId: projects[1].id, title: "Dashboard Launch", dueDate: new Date(now.getFullYear(), now.getMonth() + 3, 1), isCompleted: false, weight: 25 },
    { projectId: projects[2].id, title: "Backend Services Ready", dueDate: new Date(now.getFullYear(), now.getMonth() - 1, 1), isCompleted: true, completedAt: new Date(now.getFullYear(), now.getMonth() - 1, 1), weight: 30 },
    { projectId: projects[2].id, title: "Frontend Integration", dueDate: new Date(now.getFullYear(), now.getMonth(), 15), isCompleted: false, weight: 25 },
    { projectId: projects[2].id, title: "Final Deployment", dueDate: new Date(now.getFullYear(), now.getMonth() + 1, 20), isCompleted: false, weight: 20 },
  ];

  await prisma.milestone.createMany({ data: milestoneData });

  // === Reviews ===
  const review1 = await prisma.review.create({
    data: {
      projectId: projects[0].id,
      reviewerId: teachers[0].id,
      reviewType: "Progress Check",
      scheduledAt: new Date(now.getFullYear(), now.getMonth() - 1, 20),
      conductedAt: new Date(now.getFullYear(), now.getMonth() - 1, 20),
      status: ReviewStatus.COMPLETED,
      overallScore: 7.5,
      feedback: "Good progress on the architecture design. Need to accelerate the beacon network setup. Documentation is well-maintained.",
      criteriaScores: {
        create: [
          { criteriaName: "Code Quality", score: 8, remarks: "Clean architecture choices" },
          { criteriaName: "Documentation", score: 8.5, remarks: "Thorough documentation" },
          { criteriaName: "Presentation", score: 7, remarks: "Could improve visual aids" },
          { criteriaName: "Innovation", score: 7, remarks: "Standard approach but well executed" },
          { criteriaName: "Teamwork", score: 7.5, remarks: "Even distribution of work" },
        ],
      },
    },
  });

  await prisma.review.create({
    data: {
      projectId: projects[0].id,
      reviewerId: teachers[0].id,
      reviewType: "Mid-Term",
      scheduledAt: new Date(now.getFullYear(), now.getMonth() + 1, 1),
      status: ReviewStatus.SCHEDULED,
    },
  });

  await prisma.review.create({
    data: {
      projectId: projects[2].id,
      reviewerId: teachers[1].id,
      reviewType: "Mid-Term",
      scheduledAt: new Date(now.getFullYear(), now.getMonth(), 10),
      conductedAt: new Date(now.getFullYear(), now.getMonth(), 10),
      status: ReviewStatus.COMPLETED,
      overallScore: 8.2,
      feedback: "Excellent progress on the microservices architecture. Payment integration needs more testing. Overall strong team performance.",
      criteriaScores: {
        create: [
          { criteriaName: "Code Quality", score: 8.5, remarks: "Well-structured microservices" },
          { criteriaName: "Documentation", score: 7.5, remarks: "API docs need improvement" },
          { criteriaName: "Presentation", score: 8, remarks: "Clear demo" },
          { criteriaName: "Innovation", score: 8.5, remarks: "Good use of modern patterns" },
          { criteriaName: "Teamwork", score: 8.5, remarks: "Great collaboration" },
        ],
      },
    },
  });

  await prisma.review.create({
    data: {
      projectId: projects[1].id,
      reviewerId: teachers[2].id,
      reviewType: "Spot Check",
      scheduledAt: new Date(now.getFullYear(), now.getMonth() + 1, 10),
      status: ReviewStatus.SCHEDULED,
    },
  });

  // === Notifications ===
  const notificationData = [
    { userId: students[0].id, type: NotificationType.TASK_ASSIGNED, title: "New Task Assigned", message: "You have been assigned 'Implement indoor positioning algorithm' in Smart Campus Navigation System", link: "/student/projects/" + projects[0].id + "/tasks" },
    { userId: students[0].id, type: NotificationType.DEADLINE_APPROACHING, title: "Deadline Approaching", message: "Task 'Set up BLE beacon network' is due in 7 days", link: "/student/projects/" + projects[0].id + "/tasks" },
    { userId: students[1].id, type: NotificationType.REVIEW_SCHEDULED, title: "Review Scheduled", message: "Mid-term review for Smart Campus Navigation System is scheduled for next month", link: "/student/projects/" + projects[0].id },
    { userId: students[2].id, type: NotificationType.FEEDBACK_GIVEN, title: "Review Feedback", message: "Dr. Rajesh Gupta has submitted feedback for the mid-term review of E-Commerce Microservices Platform", link: "/student/projects/" + projects[2].id },
    { userId: students[4].id, type: NotificationType.MILESTONE_DUE, title: "Milestone Due Soon", message: "Milestone 'Model Training Complete' is due in 6 weeks", link: "/student/projects/" + projects[1].id + "/milestones" },
    { userId: students[4].id, type: NotificationType.PROJECT_UPDATED, title: "Project Updated", message: "Sentiment Analysis Dashboard project details have been updated by Dr. Sneha Patel" },
    { userId: students[2].id, type: NotificationType.TASK_ASSIGNED, title: "New Task Assigned", message: "You have been assigned 'Payment gateway integration' in E-Commerce Microservices Platform", link: "/student/projects/" + projects[2].id + "/tasks" },
    { userId: students[5].id, type: NotificationType.TASK_ASSIGNED, title: "New Task Assigned", message: "You have been assigned 'Train transformer model' in Sentiment Analysis Dashboard", link: "/student/projects/" + projects[1].id + "/tasks" },
    { userId: students[9].id, type: NotificationType.PROJECT_UPDATED, title: "Project Completed", message: "Automated Attendance System has been marked as completed. Congratulations!" },
    { userId: students[3].id, type: NotificationType.DEADLINE_APPROACHING, title: "Task Due Tomorrow", message: "Task 'Load testing and optimization' deadline is approaching" },
  ];

  await prisma.notification.createMany({ data: notificationData });

  console.log("✅ Seed completed!");
  console.log(`   Created: 1 admin, 3 teachers, 10 students`);
  console.log(`   Created: 5 projects, 16 tasks, 9 milestones, 4 reviews`);
  console.log(`   Created: 10 notifications, 4 tags`);
  console.log(`\n   Login credentials (all users): password123`);
  console.log(`   Admin: admin@university.edu`);
  console.log(`   Teacher: priya.sharma@university.edu`);
  console.log(`   Student: aarav@student.edu`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
