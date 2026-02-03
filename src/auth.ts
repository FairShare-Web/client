
import NextAuth from "next-auth"
import Google from "next-auth/providers/google"
import { PrismaAdapter } from "@auth/prisma-adapter"
import prisma from "@/lib/prisma"

export const { handlers, signIn, signOut, auth } = NextAuth({
  adapter: PrismaAdapter(prisma),
  providers: [
    Google
  ],
  callbacks: {
    async session({ session, user }) {
        if (session.user) {
            session.user.id = user.id
            session.user.username = (user as any).username
        }
        return session
    }
  }
})
