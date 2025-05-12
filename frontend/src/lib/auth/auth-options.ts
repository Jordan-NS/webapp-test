import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import axios from "axios";

const API_URL = `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000"}/api`;

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
        token: { label: "Token", type: "text" }
      },
      async authorize(credentials) {
        try {
          if (credentials?.token) {
            try {
              const res = await axios.get(`${API_URL}/auth/me`, {
                headers: {
                  Authorization: `Bearer ${credentials.token}`
                }
              });
              
              if (res.data) {
                return {
                  id: res.data.id,
                  email: res.data.email,
                  accessToken: credentials.token,
                };
              }
            } catch (error) {
              console.error("Erro ao verificar token:", error);
              return null;
            }
          }
          
          const res = await axios.post(`${API_URL}/auth/login`, {
            email: credentials?.email,
            password: credentials?.password
          });
          
          if (res.data?.access_token) {
            return {
              id: res.data.user.id,
              email: res.data.user.email,
              accessToken: res.data.access_token,
            };
          }
          return null;
        } catch (error) {
          console.error("Erro na autenticação:", error);
          return null;
        }
      }
    })
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.accessToken = user.accessToken;
        
        if (user.accessToken) {
          try {
            const res = await axios.get(`${API_URL}/auth/me`, {
              headers: {
                Authorization: `Bearer ${user.accessToken}`
              }
            });
            
            if (res.data) {
              token.id = res.data.id;
              token.email = res.data.email;
            }
          } catch (error) {
            console.error("Erro ao verificar token:", error);
          }
        }
      }
      return token;
    },
    async session({ session, token }) {
      if (token.accessToken) {
        session.accessToken = token.accessToken;
        session.user.accessToken = token.accessToken;
        session.user.id = token.id as string;
        session.user.email = token.email as string;
      }
      return session;
    }
  },
  pages: {
    signIn: '/login',
    error: '/login',
  },
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 dias
  },
  secret: process.env.NEXTAUTH_SECRET,
  debug: process.env.NODE_ENV === 'development',
}; 