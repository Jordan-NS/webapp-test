'use client';

import Hero from "@/components/Hero";
import { useState, useEffect, useCallback } from 'react';
import { useApi } from '@/services/api';
import { ImageCard } from '@/components/nasa/ImageCard';
import { Calendar, Search, Loader2, Rocket } from 'lucide-react';
import { useSession } from 'next-auth/react';

interface NasaImage {
  id: string;
  title: string;
  date: string;
  url: string;
  explanation: string;
  mediaType: string;
}

interface Favorite {
  id: string;
  userId: string;
  apodId: string;
  title: string;
  date: string;
  url: string;
  explanation: string;
  createdAt: string;
}

export default function Home() {
  const [images, setImages] = useState<NasaImage[]>([]);
  const [favorites, setFavorites] = useState<Favorite[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [isLoadingDaily, setIsLoadingDaily] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [date, setDate] = useState<string>('');
  const [searchTerm, setSearchTerm] = useState('');
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [totalImages, setTotalImages] = useState(0);
  const api = useApi();
  const { status } = useSession();

  const fetchImages = useCallback(async (pageNum: number = 1, append: boolean = false) => {
    try {
      if (pageNum === 1) {
        setIsLoading(true);
      } else {
        setIsLoadingMore(true);
      }
      setError(null);
      
      const response = await api.get('/apod', {
        params: {
          date: date || undefined,
          search: searchTerm || undefined,
          page: pageNum,
          limit: 12
        }
      });
      
      const newImages = response.data;
      setHasMore(newImages.length === 12);
      setTotalImages(prev => append ? prev + newImages.length : newImages.length);
      
      if (append) {
        setImages(prev => [...prev, ...newImages]);
      } else {
        setImages(newImages);
      }
    } catch (err) {
      console.error('Erro ao carregar imagens:', err);
      setError('Erro ao carregar imagens. Tente novamente mais tarde.');
    } finally {
      setIsLoading(false);
      setIsLoadingMore(false);
    }
  }, [api, date, searchTerm]);

  const fetchFavorites = useCallback(async () => {
    if (status !== 'authenticated') return;
    
    try {
      const response = await api.get('/favorites');
      setFavorites(response.data);
    } catch (err) {
      console.error('Erro ao carregar favoritos:', err);
    }
  }, [api, status]);

  const fetchDailyImage = useCallback(async () => {
    try {
      setIsLoadingDaily(true);
      setError(null);
      
      const response = await api.get('/apod/sync');
      
      if (response.data) {
        setImages(prev => [response.data, ...prev]);
        setTotalImages(prev => prev + 1);
      } else {
        setError('Nenhuma imagem encontrada para hoje.');
      }
    } catch (err) {
      console.error('Erro ao buscar imagem do dia:', err);
      setError('Erro ao buscar imagem do dia. Tente novamente mais tarde.');
    } finally {
      setIsLoadingDaily(false);
    }
  }, [api]);

  useEffect(() => {
    setPage(1);
    fetchImages(1, false);
  }, [fetchImages]);

  useEffect(() => {
    if (status === 'authenticated') {
      fetchFavorites();
    }
  }, [status, fetchFavorites]);

  const handleLoadMore = () => {
    const nextPage = page + 1;
    setPage(nextPage);
    fetchImages(nextPage, true);
  };

  const handleFavoriteToggle = useCallback(() => {
    fetchFavorites();
  }, [fetchFavorites]);

  return (
    <div className="flex flex-col items-center">
      <Hero onExploreClick={() => document.getElementById('nasa-images')?.scrollIntoView({ behavior: 'smooth' })} />
      
      {/* NASA Images Section */}
      <div id="nasa-images" className="container mx-auto px-4 py-16">
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-foreground mb-4">
            Imagens do Dia da NASA
          </h2>
          <p className="text-muted-foreground">
            Explore as incríveis imagens do espaço capturadas pela NASA.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 mb-8">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
            <input
              type="text"
              placeholder="Buscar por título ou descrição..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-card border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#c75c5c]"
            />
          </div>
          <div className="relative">
            <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="pl-10 pr-4 py-2 bg-card border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#c75c5c]"
            />
          </div>
          <button
            onClick={fetchDailyImage}
            disabled={isLoadingDaily}
            className="px-6 py-2 bg-[#c75c5c] text-white rounded-lg hover:bg-[#b54b4b] transition-colors duration-300 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoadingDaily ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <Rocket className="w-5 h-5" />
            )}
            Buscar imagem do dia
          </button>
        </div>

        {error && (
          <div className="bg-destructive/10 border border-destructive text-destructive px-4 py-3 rounded-lg mb-8">
            {error}
          </div>
        )}

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="bg-card rounded-lg overflow-hidden">
                  <div className="aspect-video bg-muted" />
                  <div className="p-4 space-y-3">
                    <div className="h-4 bg-muted rounded w-3/4" />
                    <div className="h-4 bg-muted rounded w-1/2" />
                    <div className="h-4 bg-muted rounded w-full" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <>
            <div className="mb-4 text-sm text-muted-foreground">
              Mostrando {totalImages} {totalImages === 1 ? 'imagem' : 'imagens'}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {images.map((image) => (
                <ImageCard
                  key={image.id}
                  {...image}
                  isFavorite={favorites.some(fav => fav.apodId === image.id)}
                  onFavoriteToggle={handleFavoriteToggle}
                />
              ))}
            </div>

            {hasMore && !isLoadingMore && (
              <div className="mt-8 text-center">
                <button
                  onClick={handleLoadMore}
                  className="px-6 py-3 bg-[#c75c5c] text-white rounded-lg hover:bg-[#b54b4b] transition-colors duration-300 flex items-center justify-center gap-2 mx-auto"
                >
                  <Rocket className="w-5 h-5" />
                  Carregar mais imagens
                </button>
              </div>
            )}

            {isLoadingMore && (
              <div className="mt-8 text-center">
                <Loader2 className="w-8 h-8 animate-spin mx-auto text-[#c75c5c]" />
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
