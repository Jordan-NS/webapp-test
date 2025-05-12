import { LoginForm } from '@/components/auth/login-form';

export default function LoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-black py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-white">
            Entre na sua conta
          </h2>
          <p className="mt-2 text-center text-sm text-gray-400">
            Ou{' '}
            <a href="/register" className="font-medium text-[#c75c5c] hover:text-[#4f5d73] transition-colors duration-300">
              crie uma nova conta
            </a>
          </p>
        </div>
        <LoginForm />
      </div>
    </div>
  );
} 