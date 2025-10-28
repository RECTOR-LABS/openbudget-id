# OpenBudget Deployment Guide

## Local to VPS Deployment (Without Docker Hub)

This guide explains how to deploy OpenBudget from your local machine directly to the VPS without using Docker Hub.

### Prerequisites

✅ Local git repository with latest changes
✅ SSH access to VPS (`openbudget@176.222.53.185`)
✅ VPS has git repository cloned at `/home/openbudget/openbudget-garuda-spark`
✅ VPS has Docker installed and running

### Deployment Workflow

```
Local Machine → Git Push → GitHub → VPS Git Pull → Build on VPS → Deploy
```

**Benefits of this approach:**
- ✅ No Docker Hub account needed
- ✅ No large image transfers
- ✅ Build happens on production server (same architecture)
- ✅ Simple one-command deployment
- ✅ Automatic error handling

### Quick Deployment

```bash
# From project root
./scripts/deploy.sh
```

**What happens:**
1. ✅ Checks for uncommitted changes (prompts to commit if needed)
2. ✅ Pushes to GitHub
3. ✅ SSHs to VPS and pulls latest code
4. ✅ Builds Docker image on VPS
5. ✅ Stops old container
6. ✅ Starts new container with updated code
7. ✅ Shows deployment status

### Manual Deployment (Step by Step)

If you prefer manual control:

#### 1. Commit and push changes
```bash
git add .
git commit -m "Your commit message"
git push origin dev
```

#### 2. SSH to VPS
```bash
ssh openbudget@176.222.53.185
```

#### 3. Pull latest code
```bash
cd /home/openbudget/openbudget-garuda-spark
git pull origin dev
```

#### 4. Build Docker image
```bash
cd frontend
docker build -t openbudget:latest .
```

**Build time:** ~3-5 minutes (includes npm install and Next.js build)

#### 5. Stop old container
```bash
docker stop openbudget-web
docker rm openbudget-web
```

#### 6. Run new container
```bash
# Load environment variables from secrets file
source frontend/.kamal/secrets

docker run -d \
  --name openbudget-web \
  --restart unless-stopped \
  --network kamal \
  -p 3100:3000 \
  -e DATABASE_URL="$DATABASE_URL" \
  -e NEXT_PUBLIC_SOLANA_PROGRAM_ID="$NEXT_PUBLIC_SOLANA_PROGRAM_ID" \
  -e NEXT_PUBLIC_SOLANA_RPC_URL="$NEXT_PUBLIC_SOLANA_RPC_URL" \
  -e NEXT_PUBLIC_SOLANA_NETWORK="$NEXT_PUBLIC_SOLANA_NETWORK" \
  -e NEXTAUTH_URL="$NEXTAUTH_URL" \
  -e NEXTAUTH_SECRET="$NEXTAUTH_SECRET" \
  -e GOOGLE_CLIENT_ID="$GOOGLE_CLIENT_ID" \
  -e GOOGLE_CLIENT_SECRET="$GOOGLE_CLIENT_SECRET" \
  openbudget:latest
```

**Note:** The `frontend/.kamal/secrets` file contains all environment variables. This file is gitignored for security.

#### 7. Verify deployment
```bash
docker ps | grep openbudget-web
docker logs --tail 50 openbudget-web
```

Visit: https://openbudget.rectorspace.com

### Post-Deployment Checks

✅ Container is running: `docker ps | grep openbudget`
✅ No errors in logs: `docker logs openbudget-web`
✅ Website loads: https://openbudget.rectorspace.com
✅ API works: https://openbudget.rectorspace.com/api/projects
✅ Admin login works: https://openbudget.rectorspace.com/admin

### Useful Commands

#### View logs
```bash
ssh openbudget@176.222.53.185 'docker logs -f openbudget-web'
```

#### Check container status
```bash
ssh openbudget@176.222.53.185 'docker ps | grep openbudget'
```

#### Restart container (without rebuild)
```bash
ssh openbudget@176.222.53.185 'docker restart openbudget-web'
```

#### View container resource usage
```bash
ssh openbudget@176.222.53.185 'docker stats openbudget-web --no-stream'
```

#### Check website health
```bash
curl -I https://openbudget.rectorspace.com
```

### Troubleshooting

#### Build fails on VPS
**Error:** `npm install` fails or Docker build times out

**Solution:**
```bash
# SSH to VPS
ssh openbudget@176.222.53.185

# Check disk space
df -h

# Check memory
free -h

# If low on resources, clean up
docker system prune -f
```

#### Container won't start
**Error:** Container exits immediately

**Solution:**
```bash
# Check logs for errors
docker logs openbudget-web

# Common issues:
# - DATABASE_URL incorrect
# - Port 3100 already in use
# - Environment variables missing
```

#### Website returns 502 Bad Gateway
**Error:** Nginx shows 502 error

**Solution:**
```bash
# Check if container is running
docker ps | grep openbudget

# Check nginx configuration
sudo nginx -t
sudo systemctl reload nginx

# Verify container is on port 3100
docker port openbudget-web
```

#### Database connection fails
**Error:** Application can't connect to PostgreSQL

**Solution:**
```bash
# Verify container is on kamal network
docker inspect openbudget-web | grep NetworkMode

# Should show: "NetworkMode": "kamal"

# Test connection from container
docker exec openbudget-web ping -c 2 172.18.0.1

# Check PostgreSQL is accepting connections
sudo systemctl status postgresql
```

### Architecture

```
┌──────────────────┐
│  Local Machine   │
│  (Development)   │
└────────┬─────────┘
         │ git push
         ▼
┌──────────────────┐
│     GitHub       │
│   (Code Repo)    │
└────────┬─────────┘
         │ git pull
         ▼
┌──────────────────────────────────────┐
│           VPS (176.222.53.185)       │
│                                      │
│  ┌────────────────────────────────┐ │
│  │  Git Repo (dev branch)         │ │
│  │  /home/openbudget/             │ │
│  │  openbudget-garuda-spark       │ │
│  └──────────┬─────────────────────┘ │
│             │ docker build          │
│             ▼                       │
│  ┌────────────────────────────────┐ │
│  │  Docker Image (openbudget)     │ │
│  └──────────┬─────────────────────┘ │
│             │ docker run            │
│             ▼                       │
│  ┌────────────────────────────────┐ │
│  │  Container (openbudget-web)    │ │
│  │  Port: 3100:3000               │ │
│  │  Network: kamal (172.18.0.x)   │ │
│  └──────────┬─────────────────────┘ │
│             │                       │
│  ┌──────────▼─────────────────────┐ │
│  │  Nginx Reverse Proxy           │ │
│  │  Port: 80/443 → localhost:3100 │ │
│  └──────────┬─────────────────────┘ │
└─────────────┼───────────────────────┘
              │
              ▼
         ┌─────────┐
         │ Internet│
         │  Users  │
         └─────────┘
```

### Security Notes

🔒 **Secrets Management:**
- Environment variables stored in `frontend/.kamal/secrets` (gitignored)
- Deploy script sources this file for VPS deployment
- Never commit `.kamal/secrets` to version control
- VPS has its own copy of secrets file at `/home/openbudget/openbudget-garuda-spark/frontend/.kamal/secrets`

🔒 **SSH Access:**
- Deployment requires SSH key authentication
- Key configured in `~/.ssh/config` (openbudget host)

### Comparison: GitHub Actions vs Local Deployment

| Aspect | GitHub Actions + Kamal | Local Deployment |
|--------|------------------------|------------------|
| **Trigger** | Automatic on git push | Manual: `./scripts/deploy.sh` |
| **Docker Hub** | Required ✅ | Not needed ❌ |
| **Build Location** | GitHub runners | VPS |
| **Secrets** | GitHub Secrets | In deploy.sh |
| **Complexity** | High (port conflicts) | Low (simple script) |
| **Cost** | Free tier limits | Free |
| **Speed** | 5-8 minutes | 5-7 minutes |
| **Control** | Less (automated) | More (manual trigger) |

**Current Choice:** Local deployment (simpler, no Docker Hub dependency)

### Next Steps

1. ✅ Run `./scripts/deploy.sh` for first deployment
2. ✅ Verify https://openbudget.rectorspace.com works
3. ⏳ Create demo video
4. ⏳ Submit to Garuda Spark hackathon

---

**Last Updated:** October 28, 2025
**Deployment Method:** Local Docker build + SSH transfer
**Status:** ✅ Production ready
