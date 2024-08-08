import NextAuth from "next-auth";

declare module "next-auth" {
  interface Session {
    accessToken: string;
    partner_id: string;    
    email: string;
    emailConfirmedAt: datetime | null;
  }

  interface User {
    accessToken: string;
    partner_id: string;  
    email: string;
    emailConfirmedAt: datetime | null;
  }
}
