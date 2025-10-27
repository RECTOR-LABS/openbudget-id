import { NextAuthOptions } from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';
import { query } from './db';

export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID || '',
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || '',
    }),
  ],
  callbacks: {
    async signIn({ user }) {
      if (!user.email) {
        return false;
      }

      try {
        // Check if user exists in ministry_accounts
        const existingUser = await query(
          'SELECT * FROM ministry_accounts WHERE email = $1',
          [user.email]
        );

        if (existingUser.rows.length === 0) {
          // Create new ministry account
          await query(
            `INSERT INTO ministry_accounts (email, name, ministry_name, created_at)
             VALUES ($1, $2, $3, CURRENT_TIMESTAMP)`,
            [user.email, user.name || '', 'Unassigned']
          );
        } else {
          // Update last login
          await query(
            'UPDATE ministry_accounts SET updated_at = CURRENT_TIMESTAMP WHERE email = $1',
            [user.email]
          );
        }

        return true;
      } catch (error) {
        console.error('Error during sign in:', error);
        return false;
      }
    },
    async session({ session, token }) {
      if (session.user && token.sub) {
        // Fetch user details from database
        try {
          const result = await query(
            'SELECT id, email, name, ministry_name, wallet_address FROM ministry_accounts WHERE email = $1',
            [session.user.email]
          );

          if (result.rows.length > 0) {
            const dbUser = result.rows[0];
            session.user.id = dbUser.id;
            session.user.ministryName = dbUser.ministry_name;
            session.user.walletAddress = dbUser.wallet_address;
          }
        } catch (error) {
          console.error('Error fetching user session data:', error);
        }
      }
      return session;
    },
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
      }
      return token;
    },
  },
  pages: {
    signIn: '/auth/signin',
    error: '/auth/error',
  },
  session: {
    strategy: 'jwt',
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  secret: process.env.NEXTAUTH_SECRET,
};
