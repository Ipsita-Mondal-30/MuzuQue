import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import * as argon2 from "argon2";
import User from "@/lib/models/user";
import connectDB from '@/lib/mongodb';

declare module "next-auth" {
  interface Session {
    user?: {
      name?: string | null;
      email?: string | null;
      image?: string | null;
      role?: string;
    };
  }
}

export const dynamic = 'force-dynamic';
export const revalidate = 0;

const handler = NextAuth({
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        try {
          if (!credentials?.email || !credentials?.password) {
            return null;
          }

          await connectDB();
          
          const user = await User.findOne({ email: credentials.email });
          
          if (!user) {
            console.log('No user found with email:', credentials.email);
            return null;
          }
          
          const isPasswordValid = await argon2.verify(user.password, credentials.password);
          
          if (!isPasswordValid) {
            console.log('Invalid password for user:', credentials.email);
            return null;
          }
          
          return {
            id: user._id.toString(),
            email: user.email,
            name: user.name,
            role: user.role,
          };
        } catch (error) {
          console.error('Auth error:', error);
          return null;
        }
      }
    })
  ],
  session: {
    strategy: "jwt",
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.role = user.role;
      }
      return token;
    },
    async session({ session, token }) {
      if (token && session.user) {
        session.user.role = token.role as string;
      }
      return session;
    },
  },
  pages: {
    signIn: '/login',
    error: '/login',
  },
  debug: process.env.NODE_ENV === 'development',
});

export { handler as GET, handler as POST };