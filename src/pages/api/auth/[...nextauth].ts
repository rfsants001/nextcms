/* eslint-disable @typescript-eslint/no-non-null-assertion */
import NextAuth from "next-auth/next";
import GithubProvider from "next-auth/providers/github";
import { query as q } from "faunadb";

import { fauna } from "@/services/fauna";

export const authOptions = {
  providers: [
    GithubProvider({
      clientId: process.env.GITHUB_ID!,
      clientSecret: process.env.GITHUB_SECRET!,
      authorization: {
        params: {
          scope: "read:user",
        },
      },
    }),
  ],
  callbacks: {
    async signIn({ user, account, profile, email, credentials }) {
      const userEmail = profile.email;
      try {
        await fauna.query(
          q.If(
            q.Not(
              q.Exists(q.Match(q.Index("user_by_email"), q.Casefold(userEmail)))
            ),
            q.Create(q.Collection("users"), { data: { userEmail } }),
            q.Get(q.Match(q.Index("user_by_email"), q.Casefold(userEmail)))
          )
        );
        return true;
      } catch (error) {
        return false;
      }
    },
  },
};

export default NextAuth(authOptions);