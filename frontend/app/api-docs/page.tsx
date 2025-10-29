'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import CodeBlock from '@/components/CodeBlock';

interface Endpoint {
  id: string;
  method: 'GET' | 'POST' | 'PUT' | 'DELETE';
  path: string;
  title: string;
  description: string;
  category: string;
  auth: 'none' | 'session' | 'wallet';
  requestBody?: {
    type: string;
    properties: Record<string, { type: string; description: string; required?: boolean }>;
  };
  responseSchema: {
    type: string;
    properties: Record<string, { type: string; description: string }>;
  };
  exampleRequest?: string;
  exampleResponse: string;
}

const endpoints: Endpoint[] = [
  // Projects Endpoints
  {
    id: 'get-projects',
    method: 'GET',
    path: '/api/projects',
    title: 'List All Projects',
    description: 'Retrieve a list of budget projects with optional filtering',
    category: 'Projects',
    auth: 'none',
    responseSchema: {
      type: 'array',
      properties: {
        id: { type: 'string', description: 'Project UUID' },
        title: { type: 'string', description: 'Project title' },
        recipient_name: { type: 'string', description: 'Ministry or institution name' },
        total_amount: { type: 'string', description: 'Total budget in lamports' },
        total_allocated: { type: 'string', description: 'Allocated budget in lamports' },
        total_released: { type: 'string', description: 'Released budget in lamports' },
        status: { type: 'string', description: 'draft | published' },
        blockchain_id: { type: 'string', description: 'On-chain project ID (max 32 chars)' },
        solana_account: { type: 'string', description: 'Solana PDA address' },
        creation_tx: { type: 'string', description: 'Solana transaction signature' },
        created_at: { type: 'string', description: 'ISO 8601 timestamp' },
      },
    },
    exampleResponse: `[
  {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "title": "Beasiswa Penelitian Teknologi",
    "recipient_name": "Kementerian Pendidikan",
    "total_amount": "50000000000",
    "total_allocated": "30000000000",
    "total_released": "15000000000",
    "status": "published",
    "blockchain_id": "PROJ_2025_001",
    "solana_account": "5Xq7...abc",
    "creation_tx": "3nZ4...xyz",
    "created_at": "2025-10-20T10:30:00Z"
  }
]`,
  },
  {
    id: 'get-project-detail',
    method: 'GET',
    path: '/api/projects/:id',
    title: 'Get Project Details',
    description: 'Retrieve detailed information about a specific project including milestones',
    category: 'Projects',
    auth: 'none',
    responseSchema: {
      type: 'object',
      properties: {
        project: { type: 'object', description: 'Project object with nested milestones array' },
      },
    },
    exampleResponse: `{
  "project": {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "title": "Beasiswa Penelitian Teknologi",
    "description": "Program beasiswa untuk penelitian teknologi blockchain",
    "recipient_name": "Kementerian Pendidikan",
    "total_amount": "50000000000",
    "milestones": [
      {
        "id": "milestone-uuid",
        "index": 0,
        "description": "Fase 1: Rekrutmen peneliti",
        "amount": "15000000000",
        "is_released": true,
        "released_at": "2025-10-25T14:00:00Z",
        "release_tx": "2mK8...def",
        "proof_url": "https://example.com/proof.pdf"
      }
    ]
  }
}`,
  },
  {
    id: 'create-project',
    method: 'POST',
    path: '/api/projects',
    title: 'Create Project (Draft)',
    description: 'Create a new budget project in draft status',
    category: 'Projects',
    auth: 'session',
    requestBody: {
      type: 'object',
      properties: {
        title: { type: 'string', description: 'Project title', required: true },
        description: { type: 'string', description: 'Project description' },
        recipient_name: { type: 'string', description: 'Ministry/institution name', required: true },
        recipient_type: { type: 'string', description: 'Type of recipient' },
        total_amount: { type: 'string', description: 'Total budget in lamports', required: true },
      },
    },
    responseSchema: {
      type: 'object',
      properties: {
        project: { type: 'object', description: 'Created project object' },
      },
    },
    exampleRequest: `{
  "title": "Program Digitalisasi UMKM",
  "description": "Membantu UMKM go digital dengan pelatihan dan subsidi platform",
  "recipient_name": "Kementerian Koperasi dan UKM",
  "recipient_type": "Ministry",
  "total_amount": "75000000000"
}`,
    exampleResponse: `{
  "project": {
    "id": "new-project-uuid",
    "status": "draft",
    "created_at": "2025-10-28T08:00:00Z"
  }
}`,
  },
  {
    id: 'publish-project',
    method: 'POST',
    path: '/api/projects/:id/publish',
    title: 'Publish Project to Blockchain',
    description: 'Publish a draft project to Solana blockchain (requires wallet signature)',
    category: 'Projects',
    auth: 'wallet',
    requestBody: {
      type: 'object',
      properties: {
        transaction: { type: 'string', description: 'Serialized signed transaction', required: true },
      },
    },
    responseSchema: {
      type: 'object',
      properties: {
        project: { type: 'object', description: 'Updated project with blockchain data' },
        signature: { type: 'string', description: 'Transaction signature' },
      },
    },
    exampleRequest: `{
  "transaction": "base64-encoded-transaction-string"
}`,
    exampleResponse: `{
  "project": {
    "status": "published",
    "blockchain_id": "PROJ_2025_002",
    "solana_account": "7Yp9...ghi",
    "creation_tx": "4oL3...jkl"
  },
  "signature": "4oL3...jkl"
}`,
  },
  // Milestones Endpoints
  {
    id: 'create-milestone',
    method: 'POST',
    path: '/api/milestones',
    title: 'Create Milestone',
    description: 'Add a milestone to a published project',
    category: 'Milestones',
    auth: 'session',
    requestBody: {
      type: 'object',
      properties: {
        project_id: { type: 'string', description: 'Project UUID', required: true },
        description: { type: 'string', description: 'Milestone description', required: true },
        amount: { type: 'string', description: 'Milestone amount in lamports', required: true },
      },
    },
    responseSchema: {
      type: 'object',
      properties: {
        milestone: { type: 'object', description: 'Created milestone object' },
      },
    },
    exampleRequest: `{
  "project_id": "550e8400-e29b-41d4-a716-446655440000",
  "description": "Fase 2: Implementasi platform",
  "amount": "20000000000"
}`,
    exampleResponse: `{
  "milestone": {
    "id": "milestone-uuid",
    "index": 1,
    "is_released": false,
    "created_at": "2025-10-28T09:00:00Z"
  }
}`,
  },
  {
    id: 'release-milestone',
    method: 'POST',
    path: '/api/milestones/:id/release',
    title: 'Release Milestone Funds',
    description: 'Release funds for a milestone (requires wallet signature)',
    category: 'Milestones',
    auth: 'wallet',
    requestBody: {
      type: 'object',
      properties: {
        proof_url: { type: 'string', description: 'URL to proof document', required: true },
        transaction_signature: {
          type: 'string',
          description: 'Solana transaction signature from wallet',
          required: true,
        },
      },
    },
    responseSchema: {
      type: 'object',
      properties: {
        milestone: { type: 'object', description: 'Updated milestone with release data' },
      },
    },
    exampleRequest: `{
  "proof_url": "https://storage.example.com/proof.pdf",
  "transaction_signature": "5xK9...mno"
}`,
    exampleResponse: `{
  "milestone": {
    "is_released": true,
    "released_at": "2025-10-28T10:30:00Z",
    "release_tx": "5xK9...mno",
    "proof_url": "https://storage.example.com/proof.pdf"
  }
}`,
  },

  // Epic 6: Citizen Engagement - Comments
  {
    id: 'get-comments',
    method: 'GET',
    path: '/api/comments',
    title: 'Get Comments',
    description: 'Retrieve comments for a project or milestone',
    category: 'Engagement',
    auth: 'none',
    responseSchema: {
      type: 'array',
      properties: {
        id: { type: 'string', description: 'Comment UUID' },
        project_id: { type: 'string', description: 'Project UUID' },
        milestone_id: { type: 'string', description: 'Milestone UUID (optional)' },
        commenter_name: { type: 'string', description: 'Name of commenter' },
        commenter_email: { type: 'string', description: 'Email of commenter' },
        comment_text: { type: 'string', description: 'Comment content (max 1000 chars)' },
        parent_comment_id: { type: 'string', description: 'Parent comment for threading' },
        is_ministry_response: { type: 'boolean', description: 'True if from ministry' },
        created_at: { type: 'string', description: 'ISO 8601 timestamp' },
      },
    },
    exampleResponse: `[
  {
    "id": "comment-uuid",
    "project_id": "550e8400-e29b-41d4-a716-446655440000",
    "milestone_id": null,
    "commenter_name": "Budi Santoso",
    "commenter_email": "budi@example.com",
    "comment_text": "Kapan proyek ini akan dimulai?",
    "parent_comment_id": null,
    "is_ministry_response": false,
    "created_at": "2025-10-28T10:00:00Z"
  }
]`,
  },
  {
    id: 'post-comment',
    method: 'POST',
    path: '/api/comments',
    title: 'Submit Comment',
    description: 'Submit a public comment or question (rate limited: 5 per 24h per email)',
    category: 'Engagement',
    auth: 'none',
    requestBody: {
      type: 'object',
      properties: {
        project_id: { type: 'string', description: 'Project UUID', required: true },
        milestone_id: { type: 'string', description: 'Milestone UUID (optional)', required: false },
        commenter_name: { type: 'string', description: 'Your name', required: true },
        commenter_email: { type: 'string', description: 'Your email', required: true },
        comment_text: { type: 'string', description: 'Comment (max 1000 chars)', required: true },
        parent_comment_id: { type: 'string', description: 'Reply to comment', required: false },
      },
    },
    responseSchema: {
      type: 'object',
      properties: {
        comment: { type: 'object', description: 'Created comment object' },
      },
    },
    exampleRequest: `{
  "project_id": "550e8400-e29b-41d4-a716-446655440000",
  "commenter_name": "Budi Santoso",
  "commenter_email": "budi@example.com",
  "comment_text": "Kapan proyek ini akan dimulai?"
}`,
    exampleResponse: `{
  "comment": {
    "id": "comment-uuid",
    "project_id": "550e8400-e29b-41d4-a716-446655440000",
    "commenter_name": "Budi Santoso",
    "created_at": "2025-10-28T10:00:00Z"
  }
}`,
  },
  {
    id: 'get-comment-replies',
    method: 'GET',
    path: '/api/comments/:id/replies',
    title: 'Get Comment Replies',
    description: 'Get threaded replies to a specific comment',
    category: 'Engagement',
    auth: 'none',
    responseSchema: {
      type: 'array',
      properties: {
        id: { type: 'string', description: 'Reply comment UUID' },
        parent_comment_id: { type: 'string', description: 'Parent comment UUID' },
        comment_text: { type: 'string', description: 'Reply content' },
      },
    },
    exampleResponse: `[
  {
    "id": "reply-uuid",
    "parent_comment_id": "comment-uuid",
    "commenter_name": "Kementerian Pendidikan",
    "comment_text": "Proyek akan dimulai Q2 2026",
    "is_ministry_response": true,
    "created_at": "2025-10-28T11:00:00Z"
  }
]`,
  },

  // Epic 6: Trust Score Ratings
  {
    id: 'get-ratings',
    method: 'GET',
    path: '/api/ratings',
    title: 'Get Project Ratings',
    description: 'Get average rating and breakdown for a project',
    category: 'Engagement',
    auth: 'none',
    responseSchema: {
      type: 'object',
      properties: {
        average_rating: { type: 'number', description: 'Average rating (1-5)' },
        total_ratings: { type: 'number', description: 'Total rating count' },
        breakdown: { type: 'object', description: 'Count per star (1-5)' },
      },
    },
    exampleResponse: `{
  "average_rating": 4.2,
  "total_ratings": 15,
  "breakdown": {
    "5": 8,
    "4": 5,
    "3": 2,
    "2": 0,
    "1": 0
  }
}`,
  },
  {
    id: 'post-rating',
    method: 'POST',
    path: '/api/ratings',
    title: 'Submit Rating',
    description: 'Submit or update trust score rating (1-5 stars, one per email per project)',
    category: 'Engagement',
    auth: 'none',
    requestBody: {
      type: 'object',
      properties: {
        project_id: { type: 'string', description: 'Project UUID', required: true },
        rater_email: { type: 'string', description: 'Your email', required: true },
        rating: { type: 'number', description: 'Rating 1-5', required: true },
        comment: { type: 'string', description: 'Optional comment (max 500 chars)', required: false },
      },
    },
    responseSchema: {
      type: 'object',
      properties: {
        rating: { type: 'object', description: 'Created/updated rating object' },
      },
    },
    exampleRequest: `{
  "project_id": "550e8400-e29b-41d4-a716-446655440000",
  "rater_email": "budi@example.com",
  "rating": 5,
  "comment": "Proyek sangat transparan!"
}`,
    exampleResponse: `{
  "rating": {
    "id": "rating-uuid",
    "project_id": "550e8400-e29b-41d4-a716-446655440000",
    "rating": 5,
    "created_at": "2025-10-28T10:00:00Z"
  }
}`,
  },

  // Epic 6: Watchlist
  {
    id: 'get-watchlist',
    method: 'GET',
    path: '/api/watchlist',
    title: 'Get Watchlist',
    description: 'Get all projects a user is subscribed to',
    category: 'Engagement',
    auth: 'none',
    responseSchema: {
      type: 'array',
      properties: {
        id: { type: 'string', description: 'Subscription UUID' },
        project_id: { type: 'string', description: 'Project UUID' },
        subscriber_email: { type: 'string', description: 'Subscriber email' },
        notification_frequency: { type: 'string', description: 'instant | daily | weekly' },
      },
    },
    exampleResponse: `[
  {
    "id": "sub-uuid",
    "project_id": "550e8400-e29b-41d4-a716-446655440000",
    "subscriber_email": "budi@example.com",
    "notification_frequency": "instant",
    "created_at": "2025-10-20T10:00:00Z"
  }
]`,
  },
  {
    id: 'post-watchlist',
    method: 'POST',
    path: '/api/watchlist',
    title: 'Subscribe to Project',
    description: 'Subscribe to email notifications for project updates',
    category: 'Engagement',
    auth: 'none',
    requestBody: {
      type: 'object',
      properties: {
        project_id: { type: 'string', description: 'Project UUID', required: true },
        subscriber_email: { type: 'string', description: 'Your email', required: true },
        notification_frequency: {
          type: 'string',
          description: 'instant | daily | weekly',
          required: true,
        },
      },
    },
    responseSchema: {
      type: 'object',
      properties: {
        subscription: { type: 'object', description: 'Created subscription' },
      },
    },
    exampleRequest: `{
  "project_id": "550e8400-e29b-41d4-a716-446655440000",
  "subscriber_email": "budi@example.com",
  "notification_frequency": "instant"
}`,
    exampleResponse: `{
  "subscription": {
    "id": "sub-uuid",
    "project_id": "550e8400-e29b-41d4-a716-446655440000",
    "created_at": "2025-10-28T10:00:00Z"
  }
}`,
  },
  {
    id: 'delete-watchlist',
    method: 'DELETE',
    path: '/api/watchlist',
    title: 'Unsubscribe from Project',
    description: 'Remove project from watchlist',
    category: 'Engagement',
    auth: 'none',
    requestBody: {
      type: 'object',
      properties: {
        project_id: { type: 'string', description: 'Project UUID', required: true },
        subscriber_email: { type: 'string', description: 'Your email', required: true },
      },
    },
    responseSchema: {
      type: 'object',
      properties: {
        message: { type: 'string', description: 'Success message' },
      },
    },
    exampleRequest: `{
  "project_id": "550e8400-e29b-41d4-a716-446655440000",
  "subscriber_email": "budi@example.com"
}`,
    exampleResponse: `{
  "message": "Unsubscribed successfully"
}`,
  },

  // Epic 6: Issue Reporting
  {
    id: 'get-issues',
    method: 'GET',
    path: '/api/issues',
    title: 'Get Reported Issues',
    description: 'Get issues reported for projects or milestones',
    category: 'Engagement',
    auth: 'none',
    responseSchema: {
      type: 'array',
      properties: {
        id: { type: 'string', description: 'Issue UUID' },
        project_id: { type: 'string', description: 'Project UUID' },
        issue_type: {
          type: 'string',
          description: 'budget_mismatch | missing_proof | delayed_release | fraudulent_claim | other',
        },
        severity: { type: 'string', description: 'low | medium | high | critical' },
        description: { type: 'string', description: 'Issue description (10-2000 chars)' },
        status: { type: 'string', description: 'open | under_review | resolved | dismissed' },
      },
    },
    exampleResponse: `[
  {
    "id": "issue-uuid",
    "project_id": "550e8400-e29b-41d4-a716-446655440000",
    "issue_type": "missing_proof",
    "severity": "high",
    "description": "Milestone 2 dirilis tanpa dokumen bukti",
    "status": "open",
    "created_at": "2025-10-28T10:00:00Z"
  }
]`,
  },
  {
    id: 'post-issue',
    method: 'POST',
    path: '/api/issues',
    title: 'Report Issue',
    description: 'Report suspicious spending or irregularities',
    category: 'Engagement',
    auth: 'none',
    requestBody: {
      type: 'object',
      properties: {
        project_id: { type: 'string', description: 'Project UUID', required: true },
        milestone_id: { type: 'string', description: 'Milestone UUID (optional)', required: false },
        issue_type: {
          type: 'string',
          description: 'budget_mismatch | missing_proof | delayed_release | fraudulent_claim | other',
          required: true,
        },
        severity: { type: 'string', description: 'low | medium | high | critical', required: true },
        reporter_email: { type: 'string', description: 'Your email', required: true },
        description: { type: 'string', description: 'Description (10-2000 chars)', required: true },
      },
    },
    responseSchema: {
      type: 'object',
      properties: {
        issue: { type: 'object', description: 'Created issue object' },
      },
    },
    exampleRequest: `{
  "project_id": "550e8400-e29b-41d4-a716-446655440000",
  "issue_type": "missing_proof",
  "severity": "high",
  "reporter_email": "citizen@example.com",
  "description": "Milestone 2 dirilis tanpa dokumen bukti yang valid"
}`,
    exampleResponse: `{
  "issue": {
    "id": "issue-uuid",
    "project_id": "550e8400-e29b-41d4-a716-446655440000",
    "status": "open",
    "created_at": "2025-10-28T10:00:00Z"
  }
}`,
  },

  // Epic 7: Analytics - Leaderboard
  {
    id: 'get-leaderboard',
    method: 'GET',
    path: '/api/analytics/leaderboard',
    title: 'Ministry Performance Leaderboard',
    description: 'Get ranked ministry performance with calculated scores',
    category: 'Analytics',
    auth: 'none',
    responseSchema: {
      type: 'object',
      properties: {
        leaderboard: {
          type: 'array',
          description: 'Array of ministry performance metrics sorted by overall_score',
        },
      },
    },
    exampleResponse: `{
  "leaderboard": [
    {
      "ministry": "Kementerian Pendidikan",
      "total_projects": 24,
      "completed_projects": 12,
      "completion_rate": 50.0,
      "total_budget": "500000000000",
      "total_released": "250000000000",
      "budget_accuracy": 85.5,
      "avg_trust_score": 4.2,
      "total_ratings": 75,
      "release_rate": 50.0,
      "overall_score": 68.5
    }
  ]
}`,
  },

  // Epic 7: Analytics - Trends
  {
    id: 'get-trends',
    method: 'GET',
    path: '/api/analytics/trends',
    title: 'Spending Trends',
    description: 'Time-series spending data with date grouping (daily/weekly/monthly/yearly)',
    category: 'Analytics',
    auth: 'none',
    responseSchema: {
      type: 'object',
      properties: {
        trends: { type: 'array', description: 'Time-series data grouped by period' },
      },
    },
    exampleResponse: `{
  "trends": [
    {
      "period": "2025-10",
      "project_count": 15,
      "total_budget": "300000000000",
      "total_released": "150000000000",
      "release_rate": 50.0
    },
    {
      "period": "2025-11",
      "project_count": 20,
      "total_budget": "400000000000",
      "total_released": "200000000000",
      "release_rate": 50.0
    }
  ]
}`,
  },

  // Epic 7: Analytics - Anomalies
  {
    id: 'get-anomalies',
    method: 'GET',
    path: '/api/analytics/anomalies',
    title: 'Anomaly Detection',
    description: 'Detect suspicious patterns (low release rate, missing proof, over-allocated, low trust)',
    category: 'Analytics',
    auth: 'none',
    responseSchema: {
      type: 'object',
      properties: {
        anomalies: { type: 'array', description: 'Array of detected anomalies with descriptions' },
      },
    },
    exampleResponse: `{
  "anomalies": [
    {
      "id": "550e8400-e29b-41d4-a716-446655440000",
      "title": "Proyek Infrastruktur Nasional",
      "ministry": "Kementerian PUPR",
      "anomaly_type": "low_release_rate",
      "anomaly_description": "Large budget project with unusually low fund release",
      "total_budget": "150000000000",
      "release_percentage": 15.5
    },
    {
      "id": "650e8400-e29b-41d4-a716-446655440001",
      "title": "Program Beasiswa",
      "ministry": "Kementerian Pendidikan",
      "anomaly_type": "missing_proof",
      "anomaly_description": "Released milestones without proof documentation",
      "missing_proof_count": 3
    }
  ]
}`,
  },
];

const categories = Array.from(new Set(endpoints.map((e) => e.category)));

export default function ApiDocsPage() {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [expandedEndpoint, setExpandedEndpoint] = useState<string | null>(null);
  const [selectedLanguage, setSelectedLanguage] = useState<'curl' | 'javascript' | 'typescript'>(
    'curl'
  );

  const filteredEndpoints =
    selectedCategory === 'all'
      ? endpoints
      : endpoints.filter((e) => e.category === selectedCategory);

  const getMethodColor = (method: string) => {
    switch (method) {
      case 'GET':
        return 'bg-blue-100 text-blue-700 border-blue-300';
      case 'POST':
        return 'bg-green-100 text-green-700 border-green-300';
      case 'PUT':
        return 'bg-yellow-100 text-yellow-700 border-yellow-300';
      case 'DELETE':
        return 'bg-red-100 text-red-700 border-red-300';
      default:
        return 'bg-gray-100 text-gray-700 border-gray-300';
    }
  };

  const getAuthBadge = (auth: string) => {
    switch (auth) {
      case 'none':
        return <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded">Public</span>;
      case 'session':
        return (
          <span className="px-2 py-1 bg-orange-100 text-orange-700 text-xs rounded">
            🔐 Session Required
          </span>
        );
      case 'wallet':
        return (
          <span className="px-2 py-1 bg-purple-100 text-purple-700 text-xs rounded">
            👛 Wallet Signature
          </span>
        );
    }
  };

  const generateCodeExample = (endpoint: Endpoint, language: string) => {
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
    const path = endpoint.path.replace(':id', '{id}');

    if (language === 'curl') {
      if (endpoint.method === 'GET') {
        return `curl -X GET "${baseUrl}${path}?status=published&limit=20"`;
      } else {
        return `curl -X ${endpoint.method} "${baseUrl}${path}" \\
  -H "Content-Type: application/json" \\
  -d '${endpoint.exampleRequest?.replace(/\n/g, ' ') || '{}'}'`;
      }
    }

    if (language === 'javascript') {
      if (endpoint.method === 'GET') {
        return `const response = await fetch('${baseUrl}${path}?status=published');
const data = await response.json();
console.log(data);`;
      } else {
        return `const response = await fetch('${baseUrl}${path}', {
  method: '${endpoint.method}',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify(${endpoint.exampleRequest || '{}'})
});
const data = await response.json();`;
      }
    }

    if (language === 'typescript') {
      if (endpoint.method === 'GET') {
        return `const response = await fetch('${baseUrl}${path}?status=published');
const data: Project[] = await response.json();
console.log(data);`;
      } else {
        return `interface RequestBody {
  ${Object.entries(endpoint.requestBody?.properties || {})
    .map(([key, value]) => `${key}${value.required ? '' : '?'}: ${value.type};`)
    .join('\n  ')}
}

const body: RequestBody = ${endpoint.exampleRequest || '{}'};

const response = await fetch('${baseUrl}${path}', {
  method: '${endpoint.method}',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify(body)
});
const data = await response.json();`;
      }
    }

    return '';
  };

  return (
    <>
      <Header />
      <div className="min-h-screen bg-gray-50 pt-20">
        {/* Hero Section */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-16 relative overflow-hidden">
          <div
            className="absolute inset-0 opacity-10"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg width='40' height='40' xmlns='http://www.w3.org/2000/svg'%3E%3Ccircle cx='10' cy='10' r='4' fill='%23FFF'/%3E%3Ccircle cx='30' cy='10' r='4' fill='%23FFF'/%3E%3Ccircle cx='10' cy='30' r='4' fill='%23FFF'/%3E%3Ccircle cx='30' cy='30' r='4' fill='%23FFF'/%3E%3C/svg%3E")`,
              backgroundSize: '40px 40px',
            }}
          />
          <div className="relative z-10 max-w-7xl mx-auto px-6 text-center">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              <h1 className="text-5xl font-bold mb-4">📚 API Documentation</h1>
              <p className="text-xl text-blue-100 mb-6">
                Dokumentasi lengkap OpenBudget.ID REST API
              </p>
              <div className="flex flex-wrap justify-center gap-4 text-sm">
                <div className="bg-white/10 backdrop-blur-md px-4 py-2 rounded-lg">
                  <span className="text-yellow-300 font-semibold">Base URL:</span>{' '}
                  {process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}
                </div>
                <div className="bg-white/10 backdrop-blur-md px-4 py-2 rounded-lg">
                  <span className="text-yellow-300 font-semibold">Version:</span> v1
                </div>
                <div className="bg-white/10 backdrop-blur-md px-4 py-2 rounded-lg">
                  <span className="text-yellow-300 font-semibold">Format:</span> JSON
                </div>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Authentication Guide */}
        <div className="max-w-7xl mx-auto px-6 py-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.6 }}
            className="bg-white rounded-xl shadow-lg p-8 mb-8"
          >
            <h2 className="text-3xl font-bold text-gray-900 mb-6 flex items-center">
              <svg
                className="w-8 h-8 mr-3 text-blue-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                />
              </svg>
              Authentication
            </h2>

            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-orange-50 border-2 border-orange-200 rounded-lg p-6">
                <h3 className="text-xl font-semibold text-orange-900 mb-3">
                  🔐 Session-Based (Admin)
                </h3>
                <p className="text-gray-700 mb-4">
                  Ministry officials login with Google OAuth. Session cookies are automatically
                  included in requests.
                </p>
                <div className="bg-white rounded p-3 border border-orange-300">
                  <code className="text-sm text-gray-800">Cookie: next-auth.session-token</code>
                </div>
              </div>

              <div className="bg-purple-50 border-2 border-purple-200 rounded-lg p-6">
                <h3 className="text-xl font-semibold text-purple-900 mb-3">
                  👛 Wallet Signature (Blockchain)
                </h3>
                <p className="text-gray-700 mb-4">
                  For blockchain operations, transactions must be signed with connected Solana
                  wallet (Phantom/Solflare).
                </p>
                <div className="bg-white rounded p-3 border border-purple-300">
                  <code className="text-sm text-gray-800">
                    Body: &#123; transaction: &quot;base64...&quot; &#125;
                  </code>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Category Filter */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.6 }}
            className="mb-8"
          >
            <div className="flex flex-wrap gap-3">
              <button
                onClick={() => setSelectedCategory('all')}
                className={`px-6 py-3 rounded-lg font-semibold transition-all cursor-pointer ${
                  selectedCategory === 'all'
                    ? 'bg-blue-600 text-white shadow-lg'
                    : 'bg-white text-gray-700 hover:bg-gray-100'
                }`}
              >
                All Endpoints ({endpoints.length})
              </button>
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={`px-6 py-3 rounded-lg font-semibold transition-all cursor-pointer ${
                    selectedCategory === category
                      ? 'bg-blue-600 text-white shadow-lg'
                      : 'bg-white text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  {category} ({endpoints.filter((e) => e.category === category).length})
                </button>
              ))}
            </div>
          </motion.div>

          {/* Endpoints List */}
          <div className="space-y-4">
            {filteredEndpoints.map((endpoint, index) => (
              <motion.div
                key={endpoint.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 + index * 0.05, duration: 0.6 }}
                className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-200"
              >
                {/* Endpoint Header */}
                <button
                  onClick={() =>
                    setExpandedEndpoint(expandedEndpoint === endpoint.id ? null : endpoint.id)
                  }
                  className="w-full px-6 py-4 flex items-center justify-between hover:bg-gray-50 transition-colors cursor-pointer"
                >
                  <div className="flex items-center gap-4 flex-1">
                    <span
                      className={`px-3 py-1 rounded font-mono text-sm font-bold border ${getMethodColor(
                        endpoint.method
                      )}`}
                    >
                      {endpoint.method}
                    </span>
                    <code className="text-gray-700 font-mono text-sm">{endpoint.path}</code>
                    <span className="text-gray-900 font-medium">{endpoint.title}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    {getAuthBadge(endpoint.auth)}
                    <svg
                      className={`w-5 h-5 text-gray-400 transition-transform ${
                        expandedEndpoint === endpoint.id ? 'rotate-180' : ''
                      }`}
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 9l-7 7-7-7"
                      />
                    </svg>
                  </div>
                </button>

                {/* Endpoint Details */}
                {expandedEndpoint === endpoint.id && (
                  <div className="px-6 py-6 bg-gray-50 border-t border-gray-200">
                    <p className="text-gray-700 mb-6">{endpoint.description}</p>

                    {/* Request Body */}
                    {endpoint.requestBody && (
                      <div className="mb-6">
                        <h4 className="font-semibold text-gray-900 mb-3 flex items-center">
                          <svg
                            className="w-5 h-5 mr-2 text-blue-600"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                            />
                          </svg>
                          Request Body
                        </h4>
                        <div className="bg-white rounded-lg p-4 border border-gray-300">
                          <table className="w-full text-sm">
                            <thead>
                              <tr className="border-b">
                                <th className="text-left py-2 px-3 text-gray-700">Field</th>
                                <th className="text-left py-2 px-3 text-gray-700">Type</th>
                                <th className="text-left py-2 px-3 text-gray-700">Required</th>
                                <th className="text-left py-2 px-3 text-gray-700">Description</th>
                              </tr>
                            </thead>
                            <tbody>
                              {Object.entries(endpoint.requestBody.properties).map(
                                ([key, value]) => (
                                  <tr key={key} className="border-b last:border-0">
                                    <td className="py-2 px-3">
                                      <code className="text-blue-600 font-mono">{key}</code>
                                    </td>
                                    <td className="py-2 px-3">
                                      <code className="text-purple-600">{value.type}</code>
                                    </td>
                                    <td className="py-2 px-3">
                                      {value.required ? (
                                        <span className="text-red-600 font-semibold">Yes</span>
                                      ) : (
                                        <span className="text-gray-400">No</span>
                                      )}
                                    </td>
                                    <td className="py-2 px-3 text-gray-600">
                                      {value.description}
                                    </td>
                                  </tr>
                                )
                              )}
                            </tbody>
                          </table>
                        </div>
                      </div>
                    )}

                    {/* Code Examples */}
                    <div className="mb-6">
                      <div className="flex items-center justify-between mb-3">
                        <h4 className="font-semibold text-gray-900 flex items-center">
                          <svg
                            className="w-5 h-5 mr-2 text-green-600"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4"
                            />
                          </svg>
                          Example Request
                        </h4>
                        <div className="flex gap-2">
                          {(['curl', 'javascript', 'typescript'] as const).map((lang) => (
                            <button
                              key={lang}
                              onClick={() => setSelectedLanguage(lang)}
                              className={`px-3 py-1 rounded text-sm font-medium transition-colors cursor-pointer ${
                                selectedLanguage === lang
                                  ? 'bg-blue-600 text-white'
                                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                              }`}
                            >
                              {lang === 'curl' ? 'cURL' : lang === 'javascript' ? 'JS' : 'TS'}
                            </button>
                          ))}
                        </div>
                      </div>
                      <CodeBlock
                        code={generateCodeExample(endpoint, selectedLanguage)}
                        language={
                          selectedLanguage === 'curl'
                            ? 'bash'
                            : selectedLanguage === 'javascript'
                            ? 'javascript'
                            : 'typescript'
                        }
                      />
                    </div>

                    {/* Response Example */}
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-3 flex items-center">
                        <svg
                          className="w-5 h-5 mr-2 text-yellow-600"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                          />
                        </svg>
                        Example Response (200 OK)
                      </h4>
                      <CodeBlock code={endpoint.exampleResponse} language="json" />
                    </div>
                  </div>
                )}
              </motion.div>
            ))}
          </div>

          {/* Error Handling Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8, duration: 0.6 }}
            className="mt-12 bg-white rounded-xl shadow-lg p-8"
          >
            <h2 className="text-3xl font-bold text-gray-900 mb-6 flex items-center">
              <svg
                className="w-8 h-8 mr-3 text-red-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                />
              </svg>
              Error Handling
            </h2>

            <div className="space-y-4">
              {[
                { code: 400, message: 'Bad Request', description: 'Invalid request parameters' },
                { code: 401, message: 'Unauthorized', description: 'Authentication required' },
                { code: 403, message: 'Forbidden', description: 'Insufficient permissions' },
                { code: 404, message: 'Not Found', description: 'Resource not found' },
                {
                  code: 500,
                  message: 'Internal Server Error',
                  description: 'Server-side error occurred',
                },
              ].map((error) => (
                <div
                  key={error.code}
                  className="flex items-start gap-4 p-4 bg-gray-50 rounded-lg border border-gray-200"
                >
                  <span className="px-3 py-1 bg-red-100 text-red-700 font-mono text-sm font-bold rounded border border-red-300">
                    {error.code}
                  </span>
                  <div className="flex-1">
                    <h4 className="font-semibold text-gray-900">{error.message}</h4>
                    <p className="text-sm text-gray-600">{error.description}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-6 bg-yellow-50 border-2 border-yellow-300 rounded-lg p-6">
              <h4 className="font-semibold text-yellow-900 mb-2">Error Response Format:</h4>
              <CodeBlock
                code={`{
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Invalid project data",
    "details": "Total amount must be a positive number"
  }
}`}
                language="json"
              />
            </div>
          </motion.div>

          {/* Rate Limiting Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.9, duration: 0.6 }}
            className="mt-8 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-xl shadow-lg p-8"
          >
            <h2 className="text-3xl font-bold mb-4 flex items-center">
              <svg
                className="w-8 h-8 mr-3"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              Rate Limiting & Best Practices
            </h2>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-white/10 backdrop-blur-md rounded-lg p-6">
                <h3 className="text-xl font-semibold mb-3">⚡ Rate Limits</h3>
                <ul className="space-y-2 text-blue-100">
                  <li>• Public endpoints: 100 requests/minute</li>
                  <li>• Authenticated: 300 requests/minute</li>
                  <li>• Blockchain ops: 10 transactions/minute</li>
                </ul>
              </div>
              <div className="bg-white/10 backdrop-blur-md rounded-lg p-6">
                <h3 className="text-xl font-semibold mb-3">✅ Best Practices</h3>
                <ul className="space-y-2 text-blue-100">
                  <li>• Cache responses when possible</li>
                  <li>• Use pagination for large datasets</li>
                  <li>• Handle errors gracefully with retries</li>
                </ul>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
      <Footer />
    </>
  );
}
