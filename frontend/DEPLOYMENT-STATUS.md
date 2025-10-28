# OpenBudget Deployment Status

## 🎉 PRODUCTION DEPLOYMENT COMPLETE!

**Live URL:** https://openbudget.rectorspace.com

**Deployment Date:** October 28, 2025

---

## ✅ Production Infrastructure

### 1. VPS Configuration
- **Server:** 176.222.53.185
- **User:** `openbudget` (dedicated, non-root)
- **Access:** SSH key authentication
- **Groups:** docker, sudo
- **Status:** ✅ Active

### 2. PostgreSQL Production Database
- **Version:** PostgreSQL 16
- **Database:** `openbudget`
- **User:** `openbudget`
- **Access:** Docker networks only (172.17.0.0/16, 172.18.0.0/16)
- **Gateway IP:** 172.18.0.1:5432 (kamal network)
- **Schema:** 3 tables, 5 indexes, triggers applied
- **Firewall:** UFW rules configured for Docker networks
- **Status:** ✅ Connected and operational

**Production DATABASE_URL:**
```
postgresql://openbudget:<PASSWORD>@172.18.0.1:5432/openbudget
```

### 3. Docker Deployment
- **Container:** `openbudget-web`
- **Image:** `rz1989/openbudget:latest`
- **Network:** kamal (172.18.0.0/16)
- **Port Mapping:** 3100:3000 (host:container)
- **Restart Policy:** unless-stopped
- **Status:** ✅ Running

**Container Command:**
```bash
docker run -d \
  --name openbudget-web \
  --restart unless-stopped \
  --network kamal \
  -p 3100:3000 \
  -e DATABASE_URL='...' \
  -e NEXT_PUBLIC_SOLANA_PROGRAM_ID='...' \
  -e NEXT_PUBLIC_SOLANA_RPC_URL='...' \
  -e NEXT_PUBLIC_SOLANA_NETWORK='devnet' \
  -e NEXTAUTH_URL='https://openbudget.rectorspace.com' \
  -e NEXTAUTH_SECRET='...' \
  -e GOOGLE_CLIENT_ID='...' \
  -e GOOGLE_CLIENT_SECRET='...' \
  rz1989/openbudget:latest
```

### 4. Nginx Reverse Proxy
- **Config:** `/etc/nginx/sites-enabled/openbudget.conf`
- **Proxy Target:** localhost:3100
- **Headers:** X-Real-IP, X-Forwarded-For, X-Forwarded-Proto
- **Status:** ✅ Active

### 5. SSL Certificate (Let's Encrypt)
- **Certificate:** `/etc/letsencrypt/live/openbudget.rectorspace.com/`
- **Expires:** January 26, 2026 (90 days)
- **Auto-Renewal:** ✅ Enabled (certbot scheduled task)
- **Redirect:** HTTP → HTTPS enabled
- **Status:** ✅ Valid

### 6. DNS Configuration
- **Domain:** openbudget.rectorspace.com
- **Type:** A Record
- **Target:** 176.222.53.185
- **TTL:** 14400
- **Status:** ✅ Propagated

### 7. Firewall Configuration (UFW)
- **Port 22 (SSH):** ✅ Open
- **Port 80 (HTTP):** ✅ Open (redirects to HTTPS)
- **Port 443 (HTTPS):** ✅ Open
- **Port 5432 (PostgreSQL):**
  - ✅ Open for 172.17.0.0/16 (Docker default)
  - ✅ Open for 172.18.0.0/16 (kamal network)
  - ❌ Blocked from internet
- **Port 3100 (App):** Internal only (proxied via nginx)

---

## 🔧 Manual Deployment Method

The current deployment uses **manual Docker commands** instead of Kamal due to port 80/443 conflicts with existing nginx on the VPS.

**Deployment Architecture:**
```
DNS (openbudget.rectorspace.com)
        ↓
Nginx (port 80/443) → SSL (Let's Encrypt)
        ↓
Reverse Proxy → localhost:3100
        ↓
Docker Container (openbudget-web)
        ↓
PostgreSQL (172.18.0.1:5432)
        ↓
Solana Devnet (Helius RPC)
```

**Future Improvements:**
- Implement GitHub Actions CI/CD for auto-deploy
- Configure Kamal to work alongside existing nginx
- Add monitoring and alerting (Sentry, Datadog, etc.)
- Implement container health checks

---

## 📊 Solana Integration

**Network:** Devnet
**Program ID:** `RECtBgp43nvj5inPVW7qo1YN95RwXaYDxLX4dvuJXFY`
**RPC Endpoint:** Helius Devnet
**Explorer:** https://explorer.solana.com/address/RECtBgp43nvj5inPVW7qo1YN95RwXaYDxLX4dvuJXFY?cluster=devnet

**Program Instructions:**
1. `initialize_platform` - Setup global state
2. `initialize_project` - Create budget project
3. `add_milestone` - Add spending milestone
4. `release_funds` - Release milestone funds

---

## 🔒 Security Checklist

- ✅ Non-root deployment user
- ✅ SSH key authentication (no passwords)
- ✅ PostgreSQL isolated to Docker networks
- ✅ UFW firewall configured
- ✅ SSL/TLS encryption enabled
- ✅ Environment secrets not in code
- ✅ Database password URL-encoded
- ✅ HTTPS redirect enforced
- ✅ Let's Encrypt auto-renewal
- ✅ Container restart policy configured

---

## 🛠️ Maintenance Commands

### Container Management
```bash
# SSH to VPS
ssh openbudget@176.222.53.185

# View container logs
docker logs --tail 100 -f openbudget-web

# Restart container
docker restart openbudget-web

# Stop container
docker stop openbudget-web

# Remove container
docker rm -f openbudget-web

# View container stats
docker stats openbudget-web
```

### Nginx
```bash
# Test nginx config
sudo nginx -t

# Reload nginx
sudo systemctl reload nginx

# View nginx logs
sudo tail -f /var/log/nginx/access.log
sudo tail -f /var/log/nginx/error.log
```

### PostgreSQL
```bash
# Connect to database
psql -U openbudget -d openbudget

# View connections
sudo -u postgres psql -c "SELECT * FROM pg_stat_activity WHERE datname='openbudget';"

# Restart PostgreSQL
sudo systemctl restart postgresql
```

### SSL Certificate
```bash
# Check certificate expiry
sudo certbot certificates

# Renew certificate manually
sudo certbot renew

# Test renewal
sudo certbot renew --dry-run
```

### Deployment Updates
```bash
# Pull latest image
docker pull rz1989/openbudget:latest

# Stop old container
docker stop openbudget-web && docker rm openbudget-web

# Run new container (use script from section 3)
[Run docker run command with all env vars]
```

---

## 🐛 Troubleshooting

### Database Connection Issues
```bash
# Test connection from container
docker exec openbudget-web sh -c 'ping -c 2 172.18.0.1'

# Check PostgreSQL logs
sudo tail -f /var/log/postgresql/postgresql-16-main.log

# Verify UFW rules
sudo ufw status numbered | grep 5432

# Check pg_hba.conf
sudo cat /etc/postgresql/16/main/pg_hba.conf | grep openbudget
```

### SSL Issues
```bash
# Test SSL
curl -I https://openbudget.rectorspace.com

# Check certificate
openssl s_client -connect openbudget.rectorspace.com:443 -servername openbudget.rectorspace.com

# View certbot logs
sudo cat /var/log/letsencrypt/letsencrypt.log
```

### Container Issues
```bash
# Check if container is running
docker ps | grep openbudget

# View recent logs
docker logs --tail 50 openbudget-web

# Inspect container
docker inspect openbudget-web

# Check environment variables
docker exec openbudget-web env | grep DATABASE
```

---

## 📈 Next Steps

1. ✅ **Production Deployment** - COMPLETE
2. ⏳ **Create Demo Data** - Add sample projects with blockchain transactions
3. ⏳ **Record Demo Video** - 3-minute walkthrough for hackathon
4. ⏳ **Setup Monitoring** - Implement error tracking and uptime monitoring
5. ⏳ **Performance Testing** - Load test API and database queries
6. ⏳ **GitHub Actions CI/CD** - Automate deployment pipeline
7. ⏳ **Mainnet Migration** - Deploy Solana program to mainnet (post-hackathon)

---

## 🎯 Deployment Summary

**Deployment Type:** Manual Docker + Nginx + Let's Encrypt
**Duration:** ~2 hours (first-time setup)
**Blockers Resolved:**
- Port 80/443 conflict (existing nginx)
- Docker network configuration (kamal vs bridge)
- UFW firewall blocking PostgreSQL
- DATABASE_URL gateway IP mismatch

**Final Status:** ✅ **LIVE AND OPERATIONAL**

**Test URLs:**
- Homepage: https://openbudget.rectorspace.com
- API Health: https://openbudget.rectorspace.com/api/projects
- Admin Login: https://openbudget.rectorspace.com/admin

---

**Last Updated:** October 28, 2025
**Deployed By:** RECTOR (with Claude Code assistance)
