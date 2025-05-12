import { DefaultSession } from "next-auth";

declare module "next-auth" {
  interface Session {
    accessToken?: string;
    user: {
      id: string;
      email: string;
      accessToken?: string;
    } & DefaultSession["user"]
  }

  interface User {
    id: string;
    email: string;
    accessToken?: string;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    accessToken?: string;
  }
}

export interface RegisterFormData {
  name: string;
  email: string;
  password: string;
}

export interface RegisterError {
  field?: string;
  message: string;
} 