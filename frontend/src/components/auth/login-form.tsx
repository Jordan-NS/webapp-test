'use client';

import { useState } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';

export function LoginForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      const result = await signIn('credentials', {
        email,
        password,
        redirect: false,
      });

      if (result?.error) {
        setError('Credenciais inválidas');
        return;
      }

      router.push('/');
    } catch (err) {
      console.error('Login error:', err);
      setError('Erro ao fazer login');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleLogin} className="space-y-4">
      {error && (
        <div className="text-[#c75c5c] text-sm text-center">
          {error}
        </div>
      )}
      
      <div>
        <label htmlFor="email" className="sr-only">Email</label>
        <input
          id="email"
          type="email"
          required
          className="appearance-none relative block w-full px-3 py-2 bg-black border border-[#4f5d73] placeholder-gray-500 text-white rounded-lg focus:outline-none focus:ring-[#c75c5c] focus:border-[#c75c5c] focus:z-10 sm:text-sm transition-colors duration-300"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          disabled={isLoading}
        />
      </div>

      <div>
        <label htmlFor="password" className="sr-only">Senha</label>
        <input
          id="password"
          type="password"
          required
          className="appearance-none relative block w-full px-3 py-2 bg-black border border-[#4f5d73] placeholder-gray-500 text-white rounded-lg focus:outline-none focus:ring-[#c75c5c] focus:border-[#c75c5c] focus:z-10 sm:text-sm transition-colors duration-300"
          placeholder="Senha"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          disabled={isLoading}
        />
      </div>

      <button
        type="submit"
        className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-lg text-white bg-[#c75c5c] hover:bg-[#4f5d73] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#c75c5c] disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300"
        disabled={isLoading}
      >
        {isLoading ? 'Entrando...' : 'Entrar'}
      </button>
    </form>
  );
} 