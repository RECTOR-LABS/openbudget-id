-- Migration: Add Onboarding Tracking to Ministry Accounts
-- Date: 2025-10-29
-- Purpose: Track onboarding wizard completion and progress for ministry officials

-- Add onboarding fields to ministry_accounts table
ALTER TABLE ministry_accounts
ADD COLUMN IF NOT EXISTS onboarding_completed BOOLEAN DEFAULT FALSE,
ADD COLUMN IF NOT EXISTS onboarding_progress JSONB DEFAULT '{}',
ADD COLUMN IF NOT EXISTS last_onboarding_step INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS onboarding_completed_at TIMESTAMP;

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS idx_ministry_accounts_onboarding
ON ministry_accounts(onboarding_completed);

-- Add comment for documentation
COMMENT ON COLUMN ministry_accounts.onboarding_completed IS 'Whether the user has completed the onboarding wizard';
COMMENT ON COLUMN ministry_accounts.onboarding_progress IS 'JSON object tracking which onboarding steps have been completed';
COMMENT ON COLUMN ministry_accounts.last_onboarding_step IS 'Last step number viewed in the onboarding wizard (0-5)';
COMMENT ON COLUMN ministry_accounts.onboarding_completed_at IS 'Timestamp when onboarding was completed';

-- Sample onboarding_progress JSON structure:
-- {
--   "welcome": true,
--   "wallet_connected": true,
--   "dashboard_tour": true,
--   "project_guide": false,
--   "transparency_info": false,
--   "completion": false
-- }
