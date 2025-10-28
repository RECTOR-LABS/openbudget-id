import { exec } from 'child_process';
import { promisify } from 'util';
import { NextResponse } from 'next/server';

const execAsync = promisify(exec);

export async function GET() {
  try {
    // Try to get commit hash from git
    const { stdout: hash } = await execAsync('git rev-parse --short HEAD');
    const { stdout: branch } = await execAsync('git rev-parse --abbrev-ref HEAD');

    return NextResponse.json({
      commit: hash.trim(),
      branch: branch.trim(),
      timestamp: new Date().toISOString(),
    });
  } catch {
    // Fallback if git is not available or we're not in a git repo
    return NextResponse.json({
      commit: process.env.GIT_COMMIT_HASH || 'unknown',
      branch: process.env.GIT_BRANCH || 'unknown',
      timestamp: new Date().toISOString(),
    });
  }
}
