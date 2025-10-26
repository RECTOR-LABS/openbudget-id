-- OpenBudget.ID Database Schema
-- PostgreSQL

-- Ministry accounts (Google OAuth users)
CREATE TABLE IF NOT EXISTS ministry_accounts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    google_id VARCHAR(255) UNIQUE NOT NULL,
    email VARCHAR(255) NOT NULL,
    ministry_name VARCHAR(255) NOT NULL,
    wallet_address VARCHAR(88),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Projects (off-chain metadata + on-chain references)
CREATE TABLE IF NOT EXISTS projects (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    ministry_id UUID REFERENCES ministry_accounts(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    recipient_name VARCHAR(255) NOT NULL,
    recipient_type VARCHAR(50),
    total_amount BIGINT NOT NULL,
    status VARCHAR(20) DEFAULT 'draft',
    solana_account VARCHAR(88),  -- On-chain PDA address
    creation_tx VARCHAR(88),      -- Transaction signature
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Milestones
CREATE TABLE IF NOT EXISTS milestones (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
    index INT NOT NULL,
    description TEXT,
    amount BIGINT NOT NULL,
    is_released BOOLEAN DEFAULT FALSE,
    release_tx VARCHAR(88),       -- Transaction signature when released
    proof_url TEXT,               -- IPFS or direct URL
    released_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(project_id, index)
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_projects_ministry ON projects(ministry_id);
CREATE INDEX IF NOT EXISTS idx_projects_status ON projects(status);
CREATE INDEX IF NOT EXISTS idx_projects_created ON projects(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_milestones_project ON milestones(project_id);
CREATE INDEX IF NOT EXISTS idx_milestones_released ON milestones(is_released);

-- Updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Apply triggers
CREATE TRIGGER update_ministry_accounts_updated_at BEFORE UPDATE ON ministry_accounts
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_projects_updated_at BEFORE UPDATE ON projects
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_milestones_updated_at BEFORE UPDATE ON milestones
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Sample data for development (optional)
-- INSERT INTO ministry_accounts (google_id, email, ministry_name, wallet_address)
-- VALUES ('demo-google-id', 'demo@ekraf.go.id', 'Kementerian Ekraf', NULL);
