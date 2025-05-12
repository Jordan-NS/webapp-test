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
  isFirstImage?: boolean;
}

interface FavoriteData {
  apodId: string;
  title: string;
  date: string;
  url: string;
  explanation: string;
  mediaType: string;
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
  isFirstImage = false
}: ImageCardProps) => {
  const [isLoading, setIsLoading] = useState(true);
  const [localIsFavorite, setLocalIsFavorite] = useState(isFavorite);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const api = useApi();
  const { status } = useSession();
  const router = useRouter();

  useEffect(() => {
    const savedFavorites = JSON.parse(localStorage.getItem('nasaFavorites') || '[]') as FavoriteData[];
    const isSaved = savedFavorites.some(fav => fav.apodId === id);
    setLocalIsFavorite(isSaved);
  }, [id]);

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
        const savedFavorites = JSON.parse(localStorage.getItem('nasaFavorites') || '[]') as FavoriteData[];
        localStorage.setItem('nasaFavorites', JSON.stringify(savedFavorites.filter(fav => fav.apodId !== id)));
      } else {
        const favoriteData: FavoriteData = {
          apodId: id,
          title,
          date,
          url,
          explanation,
          mediaType
        };
        await api.post('/favorites', favoriteData);
        const savedFavorites = JSON.parse(localStorage.getItem('nasaFavorites') || '[]') as FavoriteData[];
        localStorage.setItem('nasaFavorites', JSON.stringify([...savedFavorites, favoriteData]));
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
    <>
      <div className="relative group bg-card rounded-lg overflow-hidden shadow-lg transition-all duration-300 hover:shadow-xl">
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
            className={`object-cover transition-opacity duration-300 ${isLoading ? 'opacity-0' : 'opacity-100'}`}
            onLoad={() => setIsLoading(false)}
            priority={isFirstImage}
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
          {isLoading && (
            <div className="absolute inset-0 bg-muted animate-pulse" />
          )}
          <a
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            className="absolute inset-0 w-full h-full bg-black/0 hover:bg-black/20 transition-colors duration-300 flex items-center justify-center opacity-0 group-hover:opacity-100"
            aria-label="Ver imagem em tela cheia"
          >
            <span className="px-4 py-2 bg-[#c75c5c] text-white rounded-lg">
              Ver em tamanho completo
            </span>
          </a>
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

      {isFullscreen && (
        <div className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4">
          <button
            onClick={() => setIsFullscreen(false)}
            className="absolute top-4 right-4 text-white hover:text-[#c75c5c] transition-colors"
          >
            Fechar
          </button>
          <Image
            src={url}
            alt={title}
            width={1200}
            height={800}
            className="max-w-full max-h-[90vh] object-contain"
          />
        </div>
      )}
    </>
  );
};

export { ImageCard };