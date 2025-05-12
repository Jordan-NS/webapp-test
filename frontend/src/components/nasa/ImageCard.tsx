'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { useApi } from '@/services/api';
import { Heart } from 'lucide-react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { AxiosError } from 'axios';

interface ImageCardProps {
  id: string;
  title: string;
  date: string;
  url: string;
  explanation: string;
  mediaType: string;
  isFavorite: boolean;
  onFavoriteToggle: () => void;
}

const ImageCard = ({
  id,
  title,
  date,
  url,
  explanation,
  mediaType,
  isFavorite,
  onFavoriteToggle,
}: ImageCardProps) => {
  const [isHovered, setIsHovered] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [localIsFavorite, setLocalIsFavorite] = useState(isFavorite);
  const api = useApi();
  const { status } = useSession();
  const router = useRouter();

  useEffect(() => {
    setLocalIsFavorite(isFavorite);
  }, [isFavorite]);

  const handleFavorite = async () => {
    if (status !== 'authenticated') {
      router.push('/login');
      return;
    }

    try {
      setIsLoading(true);
      const newFavoriteState = !localIsFavorite;
      
      if (localIsFavorite) {
        await api.delete(`/favorites/${id}`);
      } else {
        const favoriteData = {
          apodId: id,
          title,
          date,
          url,
          explanation,
          mediaType
        };
        await api.post('/favorites', favoriteData);
      }
      
      setLocalIsFavorite(newFavoriteState);
      onFavoriteToggle();
    } catch (error) {
      if (error instanceof AxiosError) {
        console.error('Erro ao atualizar favorito:', error);
      } else {
        console.error('Erro desconhecido:', error);
      }
      setLocalIsFavorite(localIsFavorite);
    } finally {
      setIsLoading(false);
    }
  };

  if (mediaType !== 'image') {
    return null;
  }

  return (
    <div 
      className="relative group bg-card rounded-lg overflow-hidden shadow-lg transition-all duration-300 hover:shadow-xl"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <button
        onClick={handleFavorite}
        disabled={isLoading}
        className={`absolute top-2 right-2 z-20 p-2 rounded-full transition-all duration-300 ${
          localIsFavorite 
            ? 'bg-[#c75c5c]/20 hover:bg-[#c75c5c]/30' 
            : 'bg-background/80 backdrop-blur-sm hover:bg-background'
        }`}
        title={status !== 'authenticated' ? "Faça login para favoritar" : localIsFavorite ? "Remover dos favoritos" : "Adicionar aos favoritos"}
      >
        <Heart
          className={`w-5 h-5 transition-all duration-300 ${
            localIsFavorite 
              ? 'fill-[#c75c5c] text-[#c75c5c] scale-110' 
              : 'text-muted-foreground'
          } ${isLoading ? 'animate-pulse' : ''}`}
        />
      </button>

      <div className="relative aspect-video">
        <Image
          src={url}
          alt={title}
          fill
          className="object-cover transition-transform duration-300 group-hover:scale-105"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
        
        <div className={`absolute inset-0 bg-black/50 flex items-center justify-center transition-opacity duration-300 ${
          isHovered ? 'opacity-100' : 'opacity-0'
        }`}>
          <a
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            className="px-4 py-2 bg-[#c75c5c] text-white rounded-lg hover:bg-[#b54b4b] transition-colors duration-300"
          >
            Ver em tamanho completo
          </a>
        </div>
      </div>

      <div className="p-4">
        <h3 className="text-lg font-semibold text-foreground mb-2 line-clamp-2">
          {title}
        </h3>
        <p className="text-sm text-muted-foreground mb-2">
          {new Date(date).toLocaleDateString('pt-BR')}
        </p>
        <p className="text-sm text-muted-foreground line-clamp-3">
          {explanation}
        </p>
      </div>
    </div>
  );
};

export { ImageCard };