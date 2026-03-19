import nodemailer from "nodemailer";

const isGmail =
  process.env.SMTP_PROVIDER?.toLowerCase() === "gmail" ||
  process.env.SMTP_HOST === "smtp.gmail.com";

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: parseInt(process.env.SMTP_PORT || (isGmail ? "465" : "587")),
  secure: (process.env.SMTP_SECURE === "true") || (isGmail && process.env.SMTP_PORT !== "587"),
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

export async function sendEmail(options: {
  to: string;
  subject: string;
  html: string;
}) {
  if (!process.env.SMTP_HOST) {
    console.log("[Email] SMTP not configured, skipping:", options.subject);
    return;
  }

  return transporter.sendMail({
    from: process.env.SMTP_FROM || "noreply@dashboard.local",
    to: options.to,
    subject: options.subject,
    html: options.html,
  });
}

export async function sendRegistrationEmail(userEmail: string, userName: string) {
  return sendEmail({
    to: userEmail,
    subject: "Welcome to Academic Project Dashboard",
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 560px; margin: 0 auto; color: #111827;">
        <h2 style="color: #4f46e5; margin-bottom: 12px;">Registration successful</h2>
        <p style="margin: 0 0 12px;">Hi ${userName},</p>
        <p style="margin: 0 0 12px;">Your account has been created successfully. You can now sign in and start using the dashboard.</p>
        <p style="margin: 0; color: #6b7280; font-size: 13px;">If you did not register for this account, please contact your administrator.</p>
      </div>
    `,
  });
}

export async function sendReviewScheduledEmail(
  studentEmail: string,
  projectTitle: string,
  reviewDate: Date,
  reviewType: string
) {
  return sendEmail({
    to: studentEmail,
    subject: `Review Scheduled: ${projectTitle}`,
    html: `
      <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #6366f1;">Review Scheduled</h2>
        <p>A <strong>${reviewType.replace("_", " ")}</strong> review has been scheduled for your project:</p>
        <div style="background: #f1f5f9; border-radius: 8px; padding: 16px; margin: 16px 0;">
          <p style="margin: 0;"><strong>Project:</strong> ${projectTitle}</p>
          <p style="margin: 8px 0 0;"><strong>Date:</strong> ${reviewDate.toLocaleDateString("en-US", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}</p>
        </div>
        <p>Please ensure your work is up to date before the review.</p>
      </div>
    `,
  });
}

export async function sendFeedbackEmail(
  studentEmail: string,
  projectTitle: string,
  score: number,
  feedback: string
) {
  return sendEmail({
    to: studentEmail,
    subject: `Review Feedback: ${projectTitle}`,
    html: `
      <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #6366f1;">Review Feedback Received</h2>
        <p>Your project has received a review:</p>
        <div style="background: #f1f5f9; border-radius: 8px; padding: 16px; margin: 16px 0;">
          <p style="margin: 0;"><strong>Project:</strong> ${projectTitle}</p>
          <p style="margin: 8px 0 0;"><strong>Score:</strong> ${score}/10</p>
          <p style="margin: 8px 0 0;"><strong>Feedback:</strong> ${feedback}</p>
        </div>
        <p>Log in to your dashboard to view the complete review details.</p>
      </div>
    `,
  });
}
