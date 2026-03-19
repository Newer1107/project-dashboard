# Deployment Guide (Project Dashboard)

This guide covers full deployment for this Next.js + Prisma + MySQL app.

## 1. Deployment Modes

Choose one mode:

- Mode A (recommended): Docker Compose on a VPS
- Mode B: Node.js + PM2 + external MySQL

---

## 2. Prerequisites

## Required software

- Node.js 20+
- npm 10+
- MySQL 8+
- Git

If using Docker mode:

- Docker Engine 24+
- Docker Compose v2

## Required accounts/services

- Domain name (for production)
- Gmail account with App Password (for SMTP)
- AWS S3 bucket (optional but required for file uploads)

---

## 3. Clone and Prepare

```bash
git clone <your-repo-url>
cd project-dashboard
npm ci
```

Copy env template:

```bash
cp .env.example .env
```

On Windows PowerShell:

```powershell
Copy-Item .env.example .env
```

---

## 4. Environment Variables

Update `.env` with production values.

## Core

```env
DATABASE_URL="mysql://username:password@host:3306/project_dashboard"
NEXTAUTH_SECRET="generate-strong-random-secret"
NEXTAUTH_URL="https://your-domain.com"
```

Generate a secure NextAuth secret:

```bash
openssl rand -base64 32
```

## AWS S3 (if file uploads are enabled)

```env
AWS_REGION="ap-south-1"
AWS_ACCESS_KEY_ID="..."
AWS_SECRET_ACCESS_KEY="..."
S3_BUCKET_NAME="your-bucket-name"
```

Important: this codebase uses `S3_BUCKET_NAME` (not `AWS_S3_BUCKET`).

## Gmail SMTP (App Password)

```env
SMTP_PROVIDER="gmail"
SMTP_HOST="smtp.gmail.com"
SMTP_PORT="465"
SMTP_SECURE="true"
SMTP_USER="your-email@gmail.com"
SMTP_PASS="your-gmail-app-password"
SMTP_FROM="your-email@gmail.com"
```

How to get Gmail App Password:

1. Enable 2-Step Verification on your Google account.
2. Go to Google Account -> Security -> App passwords.
3. Create a password for "Mail" and use it as `SMTP_PASS`.

---

## 5. Prisma Migration Strategy (Important)

This repo currently has no `prisma/migrations` folder. Create and commit the first migration before production rollout.

## One-time baseline migration (run once on development database)

```bash
npx prisma migrate dev --name init
```

Then commit:

- `prisma/migrations/...`
- updated Prisma artifacts if any

If you only want to sync schema quickly (without migration history), use:

```bash
npm run db:push
```

But for production, migration history is strongly recommended.

## Production migration command

```bash
npx prisma migrate deploy
```

---

## 6. Mode A: Docker Compose Deployment (Recommended)

## 6.1 Prepare server

On Ubuntu VPS:

```bash
sudo apt update
sudo apt install -y ca-certificates curl gnupg git
curl -fsSL https://get.docker.com | sh
sudo usermod -aG docker $USER
newgrp docker
```

Install Docker Compose plugin (if not already installed):

```bash
docker compose version
```

## 6.2 Copy project and env

```bash
git clone <your-repo-url>
cd project-dashboard
cp .env.example .env
# edit .env with production values
```

## 6.3 Check docker-compose env key mapping

In `docker-compose.yml`, ensure app env includes:

```yaml
- S3_BUCKET_NAME=${S3_BUCKET_NAME:-}
```

If it currently says `AWS_S3_BUCKET`, replace it with `S3_BUCKET_NAME`.

## 6.4 Build and run

```bash
docker compose up -d --build
```

## 6.5 Verify services

```bash
docker compose ps
docker compose logs -f app
docker compose logs -f db
```

App should be available on:

- `http://SERVER_IP:3000`

---

## 7. Mode B: Node.js + PM2 Deployment

## 7.1 Install dependencies and build

```bash
npm ci
npm run build
```

## 7.2 Run migrations

```bash
npx prisma migrate deploy
```

## 7.3 Start with PM2

```bash
npm install -g pm2
pm2 start npm --name project-dashboard -- start
pm2 save
pm2 startup
```

## 7.4 Verify

```bash
pm2 status
pm2 logs project-dashboard
```

---

## 8. Reverse Proxy and SSL (Nginx + Let's Encrypt)

Install nginx and certbot:

```bash
sudo apt install -y nginx certbot python3-certbot-nginx
```

Create nginx config (`/etc/nginx/sites-available/project-dashboard`):

```nginx
server {
    server_name your-domain.com;

    location / {
        proxy_pass http://127.0.0.1:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

Enable and reload:

```bash
sudo ln -s /etc/nginx/sites-available/project-dashboard /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx
```

Issue SSL cert:

```bash
sudo certbot --nginx -d your-domain.com
```

---

## 9. Post-Deploy Checklist

- App opens at `https://your-domain.com`
- Login works
- Registration works for allowed domain / allowed list
- `/admin/allowed-emails` works
- `/admin/showcase` and `/showcase/my-projects` load correctly
- Public showcase page `/showcase` loads
- File uploads to S3 work
- SMTP email is delivered
- Notifications are created for showcase actions

---

## 10. Common Failures and Fixes

## `npm run db:migrate` failed

`db:migrate` runs `prisma migrate dev`, which is for local development and requires interactive/dev conditions.

Use in production:

```bash
npx prisma migrate deploy
```

If no migrations exist yet, first create baseline migration once using `prisma migrate dev --name init` and commit it.

## App cannot connect to DB

- Verify `DATABASE_URL`
- Ensure MySQL user/password/db are correct
- Ensure DB host is reachable from app container/server

## Email not sending

- Use Gmail App Password, not account password
- Check `SMTP_HOST`, `SMTP_PORT`, `SMTP_SECURE`
- Verify `SMTP_FROM` is valid

## S3 upload failing

- Confirm `S3_BUCKET_NAME` is set
- Confirm IAM permissions: `s3:PutObject`, `s3:GetObject`, `s3:DeleteObject`
- Confirm region matches bucket region

---

## 11. Upgrade / Release Process

```bash
git pull
npm ci
npm run build
npx prisma migrate deploy
pm2 restart project-dashboard
```

Docker variant:

```bash
git pull
docker compose up -d --build
```

---

## 12. Backup Basics

## MySQL backup

```bash
mysqldump -u <user> -p project_dashboard > backup.sql
```

## Restore

```bash
mysql -u <user> -p project_dashboard < backup.sql
```

---

## 13. Security Minimums

- Use strong `NEXTAUTH_SECRET`
- Do not commit `.env`
- Restrict DB access to private network
- Enable firewall (`ufw`) and allow only required ports
- Keep Docker images and server packages updated
- Rotate SMTP and AWS keys periodically
