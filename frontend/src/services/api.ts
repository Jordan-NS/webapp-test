import axios from "axios";
import { useSession } from "next-auth/react";

const api = axios.create({
  baseURL: `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000"}/api`,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  },
  withCredentials: true
});

// Log de requisições
api.interceptors.request.use(
  (config) => {
    console.log('Requisição sendo enviada:', {
      url: `${config.baseURL}${config.url}`,
      method: config.method,
      params: config.params,
      data: config.data,
      headers: config.headers
    });
    return config;
  },
  (error) => {
    console.error('Erro na requisição:', error);
    return Promise.reject(error);
  }
);

// Log de respostas
api.interceptors.response.use(
  (response) => {
    console.log('Resposta recebida:', {
      status: response.status,
      data: response.data,
      headers: response.headers
    });
    return response;
  },
  (error) => {
    if (error.response) {
      console.error('Erro na resposta:', {
        status: error.response.status,
        data: error.response.data,
        headers: error.response.headers,
        url: error.config?.url,
        method: error.config?.method,
        params: error.config?.params,
        requestData: error.config?.data
      });
    } else if (error.request) {
      console.error('Erro na requisição:', error.request);
    } else {
      console.error('Erro:', error.message);
    }
    return Promise.reject(error);
  }
);

export function useApi() {
  const { data: session } = useSession();

  // Configurar o token no interceptor
  api.interceptors.request.use(
    (config) => {
      if (session?.accessToken) {
        config.headers.Authorization = `Bearer ${session.accessToken}`;
      }
      return config;
    },
    (error) => {
      console.error('Erro na requisição:', error);
      return Promise.reject(error);
    }
  );

  return api;
}