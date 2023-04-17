/* eslint-disable @typescript-eslint/no-non-null-assertion */
import NextAuth, { AuthOptions, User, Account, Profile } from "next-auth";
import GithubProvider from "next-auth/providers/github";
import { query as q } from "faunadb";
import { fauna } from "@/services/fauna";
import { AdapterUser } from "next-auth/adapters";

export const authOptions: AuthOptions = {
  secret: process.env.AUTH_SECRET,
  providers: [
    GithubProvider({
      clientId: process.env.GITHUB_ID || "fallback_client_id",
      clientSecret: process.env.GITHUB_SECRET || "fallback_client_secret",
      authorization: {
        params: {
          scope: "read:user",
        },
      },
    }),
  ],
  jwt: {
    secret: process.env.JWT_SECRET,
  },
  callbacks: {
    async signIn(params: {
      user: User | AdapterUser;
      account: Account | null;
      profile?: Profile;
      email?: { verificationRequest?: boolean };
      credentials?: Record<string, unknown>;
    }): Promise<boolean> {
      const { profile } = params;
      if (profile && profile.email) {
        const userEmail = profile.email;
        try {
          await fauna.query(
            q.If(
              q.Not(
                q.Exists(
                  q.Match(q.Index("user_by_email"), q.Casefold(userEmail))
                )
              ),
              q.Create(q.Collection("users"), { data: { userEmail } }),
              q.Get(q.Match(q.Index("user_by_email"), q.Casefold(userEmail)))
            )
          );
          return true;
        } catch (error) {
          return false;
        }
      } else {
        return false;
      }
    },
  },
};

export default NextAuth(authOptions);
