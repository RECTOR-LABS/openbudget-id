#!/bin/bash
set -e

echo "🚀 OpenBudget Deployment Script"
echo "================================"

# Configuration
VPS_USER="openbudget"
VPS_HOST="176.222.53.185"
VPS_PATH="/home/openbudget/openbudget-garuda-spark"
DOCKER_IMAGE="openbudget"
CONTAINER_NAME="openbudget-web"

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo ""
echo -e "${BLUE}Step 1: Checking local changes...${NC}"
if [[ -n $(git status -s) ]]; then
    echo -e "${YELLOW}Warning: You have uncommitted changes.${NC}"
    read -p "Do you want to commit them? (y/n) " -n 1 -r
    echo
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        git add -A
        read -p "Enter commit message: " commit_msg
        git commit -m "$commit_msg"
    fi
fi

echo ""
echo -e "${BLUE}Step 2: Pushing to GitHub...${NC}"
CURRENT_BRANCH=$(git branch --show-current)
git push origin $CURRENT_BRANCH

echo ""
echo -e "${BLUE}Step 3: Deploying to VPS...${NC}"
ssh ${VPS_USER}@${VPS_HOST} << 'ENDSSH'
set -e

echo "📦 Pulling latest code..."
cd /home/openbudget/openbudget-garuda-spark
git pull origin $(git branch --show-current)

echo "🔨 Building Docker image with git info..."
cd frontend

# Capture git info
GIT_COMMIT=$(git rev-parse --short HEAD)
GIT_BRANCH=$(git branch --show-current)
BUILD_TIME=$(date -u +"%Y-%m-%dT%H:%M:%SZ")

echo "  📌 Commit: $GIT_COMMIT"
echo "  🌿 Branch: $GIT_BRANCH"
echo "  ⏰ Build Time: $BUILD_TIME"

docker build \
  --build-arg GIT_COMMIT_HASH="$GIT_COMMIT" \
  --build-arg GIT_BRANCH="$GIT_BRANCH" \
  --build-arg BUILD_TIME="$BUILD_TIME" \
  -t openbudget:latest .

echo "🛑 Stopping old container..."
docker stop openbudget-web 2>/dev/null || true
docker rm openbudget-web 2>/dev/null || true

echo "🚀 Starting new container..."
# Load secrets from .kamal/secrets file
source .kamal/secrets

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

echo "⏳ Waiting for container to start..."
sleep 5

echo "✅ Checking container status..."
docker ps | grep openbudget-web

echo "📋 Recent logs:"
docker logs --tail 20 openbudget-web

ENDSSH

echo ""
echo -e "${GREEN}✅ Deployment complete!${NC}"
echo -e "${GREEN}🌐 Visit: https://openbudget.rectorspace.com${NC}"
echo ""
echo "📊 View logs: ssh ${VPS_USER}@${VPS_HOST} 'docker logs -f openbudget-web'"
echo "🔍 Container status: ssh ${VPS_USER}@${VPS_HOST} 'docker ps | grep openbudget'"
