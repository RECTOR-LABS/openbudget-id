import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { NextResponse } from 'next/server';
import type { Session } from 'next-auth';

type AuthResult =
  | { authorized: false; response: NextResponse }
  | { authorized: true; session: Session; userId: string };

export async function requireAuth(): Promise<AuthResult> {
  const session = await getServerSession(authOptions);

  if (!session || !session.user) {
    return {
      authorized: false,
      response: NextResponse.json(
        { error: 'Unauthorized - Authentication required' },
        { status: 401 }
      )
    };
  }

  return {
    authorized: true,
    session,
    userId: session.user.id
  };
}

export function requireMinistry(session: Session, ministryId: string) {
  if (session.user.id !== ministryId) {
    return {
      authorized: false,
      response: NextResponse.json(
        { error: 'Forbidden - You can only manage your own ministry projects' },
        { status: 403 }
      )
    };
  }

  return { authorized: true };
}
