# PRD: Epic 3 - Admin Ministry Dashboard

**Epic ID:** EPIC-03
**Epic Owner:** RECTOR
**Target Timeline:** Day 2-3 (6 hours)
**Dependencies:** EPIC-02 (requires API routes and database)
**Status:** Not Started

---

## Epic Overview

Build the authenticated admin dashboard where ministry officials create projects, add milestones, and publish spending records to the blockchain. This interface bridges Web2 authentication (Google OAuth) with Web3 wallet interactions.

**Success Criteria:**
- NextAuth configured with Google OAuth for ministry login
- Solana wallet adapter integrated (Phantom, Solflare support)
- Admin dashboard shows draft and published projects
- Create project form with validation
- Publish-to-blockchain flow with wallet signature
- Add milestones and release funds workflows
- Responsive UI with loading states and error handling

**Key User Flows:**
1. **Ministry Login:** Google OAuth → Create session → Redirect to dashboard
2. **Create Project:** Fill form → Save as draft (DB only) → Show in "Drafts" section
3. **Publish Project:** Connect wallet → Click "Publish" → Sign transaction → Update status to "Published"
4. **Add Milestone:** Select published project → Add milestone → Save to DB
5. **Release Funds:** Upload proof document → Sign transaction → Mark milestone as released

---

## Story 3.1: Setup Authentication with NextAuth

**Story ID:** STORY-3.1
**Priority:** Critical
**Estimated Effort:** 2 hours

### Description
Configure NextAuth with Google OAuth provider, create users table integration, implement session management, and protect admin routes.

### Acceptance Criteria
- [ ] NextAuth configured with Google provider
- [ ] Google Cloud Console OAuth credentials created
- [ ] Users stored in PostgreSQL after first login
- [ ] Session middleware protects /admin routes
- [ ] Login/logout flows working
- [ ] User email and name displayed in dashboard header

### Tasks

#### Task 3.1.1: Configure Google OAuth credentials
**Steps:**
1. Go to https://console.cloud.google.com
2. Create new project "OpenBudget ID"
3. Enable Google+ API
4. Create OAuth 2.0 credentials
5. Add authorized redirect URI: `http://localhost:3000/api/auth/callback/google`
6. Copy Client ID and Client Secret

**Environment Variables** (`frontend/.env.local`):
```env
GOOGLE_CLIENT_ID=your_client_id_here.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=your_client_secret_here
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=<generate with: openssl rand -base64 32>
```

---

#### Task 3.1.2: Install NextAuth and configure providers
**Commands:**
```bash
cd frontend
npm install next-auth @next-auth/pg-adapter
```

**File:** `frontend/app/api/auth/[...nextauth]/route.ts` (NEW)
```typescript
import NextAuth from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';
import { Pool } from 'pg';

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

export const authOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],
  callbacks: {
    async signIn({ user, account, profile }) {
      // Store user in database
      const result = await pool.query(
        `INSERT INTO users (email, name, role, created_at)
         VALUES ($1, $2, 'ministry', NOW())
         ON CONFLICT (email) DO UPDATE SET name = $2
         RETURNING id`,
        [user.email, user.name]
      );
      user.id = result.rows[0].id;
      return true;
    },
    async session({ session, token }) {
      if (session.user) {
        const result = await pool.query(
          'SELECT id, role FROM users WHERE email = $1',
          [session.user.email]
        );
        session.user.id = result.rows[0].id;
        session.user.role = result.rows[0].role;
      }
      return session;
    },
  },
  pages: {
    signIn: '/auth/signin',
  },
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
```

---

#### Task 3.1.3: Create session provider wrapper
**File:** `frontend/components/providers/SessionProvider.tsx` (NEW)
```typescript
'use client';

import { SessionProvider as NextAuthSessionProvider } from 'next-auth/react';

export default function SessionProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  return <NextAuthSessionProvider>{children}</NextAuthSessionProvider>;
}
```

**Update:** `frontend/app/layout.tsx`
```typescript
import SessionProvider from '@/components/providers/SessionProvider';

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <SessionProvider>{children}</SessionProvider>
      </body>
    </html>
  );
}
```

---

#### Task 3.1.4: Create login page
**File:** `frontend/app/auth/signin/page.tsx` (NEW)
```typescript
'use client';

import { signIn } from 'next-auth/react';
import { Button } from '@/components/ui/button';

export default function SignIn() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full space-y-8 p-8 bg-white rounded-lg shadow">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-gray-900">
            OpenBudget.ID Admin
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            Sign in with your ministry Google account
          </p>
        </div>
        <Button
          onClick={() => signIn('google', { callbackUrl: '/admin' })}
          className="w-full"
        >
          Sign in with Google
        </Button>
      </div>
    </div>
  );
}
```

---

#### Task 3.1.5: Protect admin routes with middleware
**File:** `frontend/middleware.ts` (NEW)
```typescript
export { default } from 'next-auth/middleware';

export const config = {
  matcher: ['/admin/:path*'],
};
```

---

## Story 3.2: Integrate Solana Wallet Adapter

**Story ID:** STORY-3.2
**Priority:** Critical
**Estimated Effort:** 1.5 hours

### Description
Integrate Solana wallet adapter to enable ministries to sign blockchain transactions. Support Phantom and Solflare wallets.

### Acceptance Criteria
- [ ] Wallet adapter UI components installed
- [ ] WalletProvider configured with devnet
- [ ] Connect wallet button in admin header
- [ ] Wallet address displayed when connected
- [ ] Transaction signing works with connected wallet
- [ ] Handles wallet not installed errors gracefully

### Tasks

#### Task 3.2.1: Install Solana wallet packages
**Commands:**
```bash
cd frontend
npm install @solana/wallet-adapter-react @solana/wallet-adapter-react-ui @solana/wallet-adapter-wallets @solana/wallet-adapter-base
```

---

#### Task 3.2.2: Create wallet context provider
**File:** `frontend/components/providers/WalletProvider.tsx` (NEW)
```typescript
'use client';

import { useMemo } from 'react';
import {
  ConnectionProvider,
  WalletProvider as SolanaWalletProvider,
} from '@solana/wallet-adapter-react';
import { WalletModalProvider } from '@solana/wallet-adapter-react-ui';
import { PhantomWalletAdapter, SolflareWalletAdapter } from '@solana/wallet-adapter-wallets';
import '@solana/wallet-adapter-react-ui/styles.css';

export default function WalletProvider({ children }: { children: React.ReactNode }) {
  const endpoint = process.env.NEXT_PUBLIC_SOLANA_RPC_URL!;
  const wallets = useMemo(
    () => [new PhantomWalletAdapter(), new SolflareWalletAdapter()],
    []
  );

  return (
    <ConnectionProvider endpoint={endpoint}>
      <SolanaWalletProvider wallets={wallets} autoConnect>
        <WalletModalProvider>{children}</WalletModalProvider>
      </SolanaWalletProvider>
    </ConnectionProvider>
  );
}
```

**Update:** `frontend/app/admin/layout.tsx` (NEW)
```typescript
import WalletProvider from '@/components/providers/WalletProvider';

export default function AdminLayout({ children }) {
  return <WalletProvider>{children}</WalletProvider>;
}
```

---

#### Task 3.2.3: Create wallet connect button component
**File:** `frontend/components/WalletButton.tsx` (NEW)
```typescript
'use client';

import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';

export default function WalletButton() {
  return <WalletMultiButton />;
}
```

---

## Story 3.3: Build Admin Dashboard Layout

**Story ID:** STORY-3.3
**Priority:** High
**Estimated Effort:** 1 hour

### Description
Create the main admin dashboard layout with navigation, user info, wallet status, and project tabs (Drafts, Published).

### Acceptance Criteria
- [ ] Dashboard header with user name, email, wallet button
- [ ] Sidebar navigation (Dashboard, Create Project, Logout)
- [ ] Main content area with tabs: "Draft Projects", "Published Projects"
- [ ] Responsive layout (mobile-friendly)
- [ ] Loading skeleton while fetching data

### Tasks

#### Task 3.3.1: Create admin dashboard page
**File:** `frontend/app/admin/page.tsx` (NEW)
```typescript
'use client';

import { useSession, signOut } from 'next-auth/react';
import { useWallet } from '@solana/wallet-adapter-react';
import WalletButton from '@/components/WalletButton';
import { useState, useEffect } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

export default function AdminDashboard() {
  const { data: session } = useSession();
  const { publicKey } = useWallet();
  const [projects, setProjects] = useState({ drafts: [], published: [] });

  useEffect(() => {
    // Fetch projects
    fetch('/api/projects')
      .then((res) => res.json())
      .then((data) => {
        setProjects({
          drafts: data.filter((p) => p.status === 'draft'),
          published: data.filter((p) => p.status === 'published'),
        });
      });
  }, []);

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
            <p className="text-sm text-gray-600">
              {session?.user?.name} ({session?.user?.email})
            </p>
          </div>
          <div className="flex items-center space-x-4">
            <WalletButton />
            <button
              onClick={() => signOut()}
              className="text-sm text-red-600 hover:underline"
            >
              Logout
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-8">
        <Tabs defaultValue="drafts">
          <TabsList>
            <TabsTrigger value="drafts">
              Draft Projects ({projects.drafts.length})
            </TabsTrigger>
            <TabsTrigger value="published">
              Published Projects ({projects.published.length})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="drafts">
            {/* Draft projects list */}
          </TabsContent>

          <TabsContent value="published">
            {/* Published projects list */}
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}
```

---

## Story 3.4: Implement Create Project Workflow

**Story ID:** STORY-3.4
**Priority:** Critical
**Estimated Effort:** 1.5 hours

### Description
Build the create project form with validation, draft saving, and publish-to-blockchain functionality.

### Acceptance Criteria
- [ ] Create project form with fields (title, ministry, budget)
- [ ] Client-side validation (required fields, budget > 0)
- [ ] Save as draft (calls POST /api/projects)
- [ ] Show draft in "Draft Projects" tab
- [ ] "Publish to Blockchain" button (wallet must be connected)
- [ ] Transaction signing with wallet
- [ ] Success toast with Solana Explorer link
- [ ] Error handling for wallet rejection

### Tasks

#### Task 3.4.1: Create project form component
**File:** `frontend/components/CreateProjectForm.tsx` (NEW)
```typescript
'use client';

import { useState } from 'react';
import { useSession } from 'next-auth/react';
import { useWallet } from '@solana/wallet-adapter-react';
import { useConnection } from '@solana/wallet-adapter-react';
import { Program, AnchorProvider } from '@coral-xyz/anchor';
import { getProgram, getProjectPda, getPlatformPda } from '@/lib/solana';

export default function CreateProjectForm({ onSuccess }: { onSuccess: () => void }) {
  const { data: session } = useSession();
  const { publicKey, signTransaction } = useWallet();
  const { connection } = useConnection();

  const [formData, setFormData] = useState({
    title: '',
    ministry: '',
    total_budget: '',
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Create draft project
      const res = await fetch('/api/projects', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          total_budget: parseInt(formData.total_budget),
          ministry_id: session?.user?.id,
        }),
      });

      const project = await res.json();
      alert(`Draft project created: ${project.id}`);
      onSuccess();
    } catch (error) {
      console.error('Create project error:', error);
      alert('Failed to create project');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 bg-white p-6 rounded-lg shadow">
      <div>
        <label className="block text-sm font-medium text-gray-700">Project Title</label>
        <input
          type="text"
          required
          value={formData.title}
          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Ministry</label>
        <input
          type="text"
          required
          value={formData.ministry}
          onChange={(e) => setFormData({ ...formData, ministry: e.target.value })}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">
          Total Budget (IDR)
        </label>
        <input
          type="number"
          required
          min="1"
          value={formData.total_budget}
          onChange={(e) => setFormData({ ...formData, total_budget: e.target.value })}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
        />
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 disabled:opacity-50"
      >
        {loading ? 'Creating...' : 'Create Draft Project'}
      </button>
    </form>
  );
}
```

---

#### Task 3.4.2: Implement publish-to-blockchain function
**File:** `frontend/components/PublishProjectButton.tsx` (NEW)
```typescript
'use client';

import { useWallet, useConnection } from '@solana/wallet-adapter-react';
import { AnchorProvider, Program, BN } from '@coral-xyz/anchor';
import { getProgram, getProjectPda, getPlatformPda } from '@/lib/solana';

export default function PublishProjectButton({
  project,
  onSuccess,
}: {
  project: any;
  onSuccess: () => void;
}) {
  const { publicKey, signTransaction } = useWallet();
  const { connection } = useConnection();

  const handlePublish = async () => {
    if (!publicKey || !signTransaction) {
      alert('Please connect your wallet first');
      return;
    }

    try {
      // Setup Anchor provider
      const provider = new AnchorProvider(
        connection,
        { publicKey, signTransaction, signAllTransactions: async (txs) => txs },
        { commitment: 'confirmed' }
      );
      const program = getProgram(provider);

      // Derive PDAs
      const [projectPda] = getProjectPda(project.id);
      const [platformPda] = getPlatformPda();

      // Call initialize_project instruction
      const tx = await program.methods
        .initializeProject(
          project.id,
          project.title,
          project.ministry,
          new BN(project.total_budget)
        )
        .accounts({
          project: projectPda,
          platformState: platformPda,
          authority: publicKey,
          systemProgram: anchor.web3.SystemProgram.programId,
        })
        .rpc();

      console.log('Transaction signature:', tx);

      // Update backend
      await fetch(`/api/projects/${project.id}/publish`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          walletPublicKey: publicKey.toString(),
          transactionSignature: tx,
          solanaAccount: projectPda.toString(),
        }),
      });

      alert(`Published! View on Explorer: https://explorer.solana.com/tx/${tx}?cluster=devnet`);
      onSuccess();
    } catch (error) {
      console.error('Publish error:', error);
      alert('Failed to publish to blockchain');
    }
  };

  return (
    <button
      onClick={handlePublish}
      disabled={!publicKey}
      className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 disabled:opacity-50"
    >
      {publicKey ? 'Publish to Blockchain' : 'Connect Wallet First'}
    </button>
  );
}
```

---

## Story 3.5: Implement Milestone Management

**Story ID:** STORY-3.5
**Priority:** High
**Estimated Effort:** 1 hour (combined with Story 3.4 for efficiency)

### Description
Add UI for creating milestones and releasing funds with blockchain transactions.

### Acceptance Criteria
- [ ] Add milestone form (description, amount)
- [ ] Validates amount doesn't exceed remaining budget
- [ ] Release funds button with proof URL input
- [ ] Transaction signed with wallet
- [ ] Milestone marked as released in UI

### Tasks

#### Task 3.5.1: Create milestone management components
(Implementation similar to project publish - combine with Story 3.4 workflow)

---

## Technical Dependencies

**Required:**
- EPIC-02 completed (API routes functional)
- Node.js packages: next-auth, @solana/wallet-adapter-*, @coral-xyz/anchor
- Google Cloud Console access for OAuth setup
- Solana devnet wallet (Phantom/Solflare)

---

## Definition of Done

- [ ] Ministry can login with Google OAuth
- [ ] Wallet connection works (Phantom/Solflare)
- [ ] Create draft projects via form
- [ ] Publish projects to blockchain with wallet signature
- [ ] Add milestones and release funds with blockchain transactions
- [ ] All flows tested end-to-end in browser
- [ ] Error handling and loading states functional
- [ ] Ready for Epic 4 (Public Dashboard)
