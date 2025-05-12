import { useSession, signIn } from "next-auth/react";

export function useAuth() {
  const { data: session, status } = useSession();
  
  const setToken = async (token: string) => {
    localStorage.setItem('token', token);

    await signIn('credentials', {
      token,
      redirect: false
    });
  };
  
  return {
    session,
    status,
    isAuthenticated: status === "authenticated",
    token: session?.accessToken,
    setToken
  };
}
