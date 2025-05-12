'use client';

import { useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useApi } from '@/services/api';
import { AxiosError } from 'axios';
import { signIn } from 'next-auth/react';
import { RegisterFormData, RegisterError } from '@/types/auth';

// Componentes
const FormInput = ({ 
  field, 
  type, 
  placeholder, 
  value, 
  onChange, 
  error, 
  disabled 
}: { 
  field: keyof RegisterFormData;
  type: string;
  placeholder: string;
  value: string;
  onChange: (field: keyof RegisterFormData) => (e: React.ChangeEvent<HTMLInputElement>) => void;
  error: RegisterError | null;
  disabled: boolean;
}) => (
  <div>
    <label htmlFor={field} className="sr-only">{placeholder}</label>
    <input
      id={field}
      name={field}
      type={type}
      required
      className={`appearance-none relative block w-full px-3 py-2 bg-black border ${
        error?.field === field ? 'border-[#c75c5c]' : 'border-[#4f5d73]'
      } placeholder-gray-500 text-white rounded-lg focus:outline-none focus:ring-[#c75c5c] focus:border-[#c75c5c] focus:z-10 sm:text-sm transition-colors duration-300`}
      placeholder={placeholder}
      value={value}
      onChange={onChange(field)}
      disabled={disabled}
    />
  </div>
);

const ErrorMessage = ({ error }: { error: RegisterError }) => (
  <div className="text-[#c75c5c] text-sm text-center">
    {error.message}
    {error.field === 'email' && error.message.includes('já está cadastrado') && (
      <div className="mt-2">
        <a 
          href="/login" 
          className="text-[#4f5d73] hover:text-[#c75c5c] font-medium transition-colors duration-300"
        >
          Ir para o login
        </a>
      </div>
    )}
  </div>
);

// Hooks
const useRegisterForm = () => {
  const [formData, setFormData] = useState<RegisterFormData>({
    name: '',
    email: '',
    password: ''
  });
  const [error, setError] = useState<RegisterError | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const api = useApi();

  const handleInputChange = useCallback((field: keyof RegisterFormData) => (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    setFormData(prev => ({ ...prev, [field]: e.target.value }));
    if (error?.field === field) {
      setError(null);
    }
  }, [error]);

  return {
    formData,
    error,
    isLoading,
    setError,
    setIsLoading,
    handleInputChange,
    router,
    api
  };
};

// Validações
const validateName = (name: string): RegisterError | null => {
  if (!name.trim()) {
    return { field: 'name', message: 'Nome é obrigatório' };
  }
  return null;
};

const validateEmail = (email: string): RegisterError | null => {
  if (!email.trim()) {
    return { field: 'email', message: 'Email é obrigatório' };
  }
  if (!email.includes('@')) {
    return { field: 'email', message: 'Email inválido' };
  }
  return null;
};

const validatePassword = (password: string): RegisterError | null => {
  if (!password) {
    return { field: 'password', message: 'Senha é obrigatória' };
  }
  if (password.length < 8) {
    return { field: 'password', message: 'A senha deve ter pelo menos 8 caracteres' };
  }
  return null;
};

// Página Principal
export default function Register() {
  const {
    formData,
    error,
    isLoading,
    setError,
    setIsLoading,
    handleInputChange,
    router,
    api
  } = useRegisterForm();

  const validateForm = useCallback(() => {
    const { name, email, password } = formData;

    const nameError = validateName(name);
    if (nameError) {
      setError(nameError);
      return false;
    }

    const emailError = validateEmail(email);
    if (emailError) {
      setError(emailError);
      return false;
    }

    const passwordError = validatePassword(password);
    if (passwordError) {
      setError(passwordError);
      return false;
    }

    return true;
  }, [formData, setError]);

  const handleRegister = async () => {
    try {
      setError(null);
      
      if (!validateForm()) {
        return;
      }

      setIsLoading(true);
      
      const trimmedData = {
        name: formData.name.trim(),
        email: formData.email.trim(),
        password: formData.password.trim()
      };

      const response = await api.post('/auth/register', trimmedData);
      
      if (response.data?.access_token) {
        localStorage.setItem('token', response.data.access_token);
        const result = await signIn('credentials', {
          token: response.data.access_token,
          redirect: false
        });

        if (result?.ok) {
          router.push('/');
          router.refresh();
        } else {
          setError({ message: 'Erro ao autenticar após o registro' });
        }
      } else {
        setError({ message: 'Resposta inesperada do servidor' });
      }
    } catch (err) {
      if (err instanceof AxiosError) {
        const responseData = err.response?.data;
        
        if (err.response?.status === 400) {
          if (responseData?.message) {
            const errorMessage = Array.isArray(responseData.message) 
              ? responseData.message[0] 
              : responseData.message;

            if (errorMessage.toLowerCase().includes('email') && 
                (errorMessage.toLowerCase().includes('already exists') || 
                 errorMessage.toLowerCase().includes('already registered'))) {
              setError({ 
                field: 'email',
                message: 'Este email já está cadastrado. Por favor, use outro email ou faça login.'
              });
            } else {
              setError({ message: errorMessage });
            }
          } else if (responseData?.errors) {
            const firstError = responseData.errors[0];
            setError({
              field: firstError.field,
              message: firstError.message
            });
          } else {
            setError({ message: 'Dados inválidos. Verifique os campos e tente novamente.' });
          }
        } else if (err.response?.status === 404) {
          setError({ message: 'Endpoint não encontrado. Verifique se o backend está rodando corretamente.' });
        } else {
          setError({ message: 'Erro ao registrar usuário. Tente novamente mais tarde.' });
        }
      } else {
        setError({ message: 'Erro ao registrar usuário. Tente novamente mais tarde.' });
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-black">
      <div className="max-w-md w-full space-y-8 p-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-white">
            Criar uma conta
          </h2>
        </div>
        <form className="mt-8 space-y-6" onSubmit={(e) => { e.preventDefault(); handleRegister(); }}>
          {error && <ErrorMessage error={error} />}
          <div className="space-y-4">
            <FormInput
              field="name"
              type="text"
              placeholder="Nome"
              value={formData.name}
              onChange={handleInputChange}
              error={error}
              disabled={isLoading}
            />
            <FormInput
              field="email"
              type="email"
              placeholder="Email"
              value={formData.email}
              onChange={handleInputChange}
              error={error}
              disabled={isLoading}
            />
            <FormInput
              field="password"
              type="password"
              placeholder="Senha"
              value={formData.password}
              onChange={handleInputChange}
              error={error}
              disabled={isLoading}
            />
          </div>

          <div>
            <button
              type="submit"
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-lg text-white bg-[#c75c5c] hover:bg-[#4f5d73] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#c75c5c] disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300"
              disabled={isLoading}
            >
              {isLoading ? 'Registrando...' : 'Registrar'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
