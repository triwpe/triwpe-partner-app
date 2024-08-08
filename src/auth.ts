import NextAuth, { CredentialsSignin } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

import { PartnerLoginRequest } from "@/types/partner";
import * as partnerAccountApi from "@/services/api/partnerAccountApi";
 
class InvalidLoginError extends CredentialsSignin {
  code = "INVALID_CREDENTIALS";
}

class EmailNotVerifiedError extends CredentialsSignin {
  code = "EMAIL_NOT_VERIFIED";
}

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        username: { label: "Username", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials, req): Promise<any | null> {
        const partnerCredentials: PartnerLoginRequest = {
          email: credentials?.username as string,
          password: credentials?.password as string,
        };

        const signInResponse = await partnerAccountApi.signInPartnerAccount(partnerCredentials);

        if (signInResponse.ok) {
          const signInData = await signInResponse.json();

          const partnerResponse = await partnerAccountApi.getPartner(signInData.access_token);
          const partnerData = await partnerResponse.json();

          return {
            accessToken: signInData.access_token,
            partner_id: partnerData.partner_id,        
            email: partnerData.email,
            emailConfirmedAt: partnerData.email_confirmed_at,
          };
        } else {
          if (signInResponse.status === 403) {
            throw new EmailNotVerifiedError();
          }
          throw new InvalidLoginError();
        }
      },
    }),
  ],
  pages: {
    signIn: "/sign-in",
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.user = user;
      }
      return token;
    },
    async session({ session, token }) {
      const data = token.user as any;
      session.accessToken = data.accessToken as string;
      session.partner_id = data.partner_id as string;
      session.email = data.email as string;
      session.emailConfirmedAt = data.emailConfirmedAt as string;

      return session;
    },
  },
})