import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import { PrismaClient } from "@prisma/client";
import { Account, Session } from "next-auth";
import { JWT } from "next-auth/jwt";  

//console.log("NEXTAUTH_SECRET:", process.env.NEXTAUTH_SECRET);

const prisma = new PrismaClient();

const authOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],
  callbacks: {
    async signIn({ user } : { user: any }) {
      try {
        if (typeof user.email !== "string") {
          console.error("Email is not valid");
          return false;
        }

        let existingUser = await prisma.user.findUnique({
          where: { email: user.email },
        });

        console.log(existingUser);

        if (!existingUser) {
          existingUser = await prisma.user.create({
            data: {
              name: user.name ?? "Anonymous",
              email: user.email,
              image: user.image ?? "",
            },
          });
        }
        user.id = existingUser.id;
        return true;
      } catch (err) {
        console.error("Sign-in error:", err);
        return false;
      }
    },
    async jwt({ token, user }: { token: JWT; user?: any }) {
      if (user) {
        token.id = user.id;
      }
      return token;
    },

    async session({ session, token }: { session: Session; token: JWT }) {
      if (session.user) {
        session.user.id = token.id as string;
      }
      return session;
    },
    async redirect({ url, baseUrl } : { url: string, baseUrl: string }) {
      return baseUrl + "/";
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
};

export const GET = NextAuth(authOptions);
export const POST = NextAuth(authOptions);
