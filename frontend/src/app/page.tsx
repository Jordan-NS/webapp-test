'use client';

import Hero from "@/components/Hero";
import { useState, useEffect } from 'react';
import { ImageCard } from '@/components/nasa/ImageCard';
import { Calendar, Search, Loader2, Rocket, Star } from 'lucide-react';
import { useNasaQueries } from '@/hooks/useNasaQueries';
import { useSession } from 'next-auth/react';
import Image from "next/image";

interface NasaImage {
  id: string;
  title: string;
  date: string;
  url: string;
  explanation: string;
  mediaType: string;
}

export default function Home() {
  const { data: session, status } = useSession();
  const [date, setDate] = useState<string>('');
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [showOnlyFavorites, setShowOnlyFavorites] = useState(false);
  const { useImages, useFavorites } = useNasaQueries();


  useEffect(() => {
    const savedPage = localStorage.getItem('nasaCurrentPage');
    const savedSearch = localStorage.getItem('nasaSearchTerm');
    const savedDate = localStorage.getItem('nasaDate');

    if (savedPage) setCurrentPage(Number(savedPage));
    if (savedSearch) setSearchTerm(savedSearch);
    if (savedDate) setDate(savedDate);
  }, []);

  useEffect(() => {
    if (status === 'unauthenticated') {
      localStorage.removeItem('nasaFavorites');
      setShowOnlyFavorites(false);
    }
  }, [status]);

  useEffect(() => {
    localStorage.setItem('nasaCurrentPage', currentPage.toString());
    localStorage.setItem('nasaSearchTerm', searchTerm);
    localStorage.setItem('nasaDate', date);
  }, [currentPage, searchTerm, date]);

  const { data: imagesData, isLoading, error } = useImages({
    page: currentPage,
    date: date || undefined,
    search: searchTerm || undefined,
    limit: 30
  });

  const { data: favorites = [] } = useFavorites();

  const handleLoadMore = () => {
    setCurrentPage(prev => prev + 1);
  };

  const handleFavoriteToggle = () => {
    if (showOnlyFavorites) {
      setCurrentPage(1);
    }
  };

  const handleToggleFavoritesFilter = () => {
    setShowOnlyFavorites(prev => !prev);
    setCurrentPage(1);
  };

  const filteredImages = showOnlyFavorites
    ? imagesData?.images.filter((image: NasaImage) => favorites.some(fav => fav.apodId === image.id))
    : imagesData?.images;

  return (
    <div className="flex flex-col items-center">
      <Hero onExploreClick={() => document.getElementById('nasa-images')?.scrollIntoView({ behavior: 'smooth' })} />
      
      <div id="nasa-images" className="container mx-auto px-4 py-16">
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <h2 className="text-3xl font-bold text-foreground">
              Imagens do Dia da NASA
            </h2>
            {status === 'authenticated' && (
              <div className="flex items-center gap-4">
                <span className="text-muted-foreground">
                  Bem-vindo, {session.user.name || session.user.email}
                </span>
                <button
                  onClick={handleToggleFavoritesFilter}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors duration-300 ${
                    showOnlyFavorites 
                      ? 'bg-[#c75c5c] text-white hover:bg-[#b54b4b]' 
                      : 'bg-card border border-border hover:bg-accent'
                  }`}
                >
                  <Star className={`w-4 h-4 ${showOnlyFavorites ? 'fill-white' : ''}`} />
                  {showOnlyFavorites ? 'Mostrar todas' : 'Apenas favoritos'}
                </button>
              </div>
            )}
          </div>
          <p className="text-muted-foreground mt-4">
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
        </div>

        {error && (
          <div className="bg-destructive/10 border border-destructive text-destructive px-4 py-3 rounded-lg mb-8">
            {error.message}
          </div>
        )}

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={`skeleton-${i}`} className="animate-pulse">
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
              Mostrando {filteredImages?.length || 0} de {imagesData?.total || 0} {imagesData?.total === 1 ? 'imagem' : 'imagens'} (Página {imagesData?.currentPage || 1} de {imagesData?.totalPages || 1})
              {showOnlyFavorites && ' - Apenas favoritos'}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredImages?.map((image: NasaImage, index: number) => (
                <ImageCard
                  key={`nasa-image-${image.id}`}
                  {...image}
                  isFavorite={favorites.some(fav => fav.apodId === image.id)}
                  onFavoriteToggle={handleFavoriteToggle}
                  isFirstImage={index < 3}
                />
              ))}
            </div>

            {imagesData?.hasMore && !isLoading && !showOnlyFavorites && (
              <div className="mt-8 text-center">
                <button
                  onClick={handleLoadMore}
                  className="px-6 py-3 bg-[#c75c5c] text-white rounded-lg hover:bg-[#b54b4b] transition-colors duration-300 flex items-center justify-center gap-2 mx-auto disabled:opacity-50 disabled:cursor-not-allowed"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <Loader2 className="w-5 h-5 animate-spin" />
                  ) : (
                    <Rocket className="w-5 h-5" />
                  )}
                  Carregar mais imagens ({imagesData.total - imagesData.images.length} restantes)
                </button>
              </div>
            )}

            {isLoading && (
              <div className="mt-8 text-center">
                <div className="flex flex-col items-center gap-2">
                  <Loader2 className="w-8 h-8 animate-spin text-[#c75c5c]" />
                  <p className="text-sm text-muted-foreground">Carregando mais imagens...</p>
                </div>
              </div>
            )}

            {!isLoading && filteredImages?.length === 0 && (
              <div className="text-center py-12">
                <p className="text-muted-foreground">
                  {showOnlyFavorites 
                    ? "Você ainda não tem imagens favoritas. Explore a galeria e adicione algumas!"
                    : "Nenhuma imagem encontrada. Tente ajustar os filtros ou buscar a imagem do dia."}
                </p>
              </div>
            )}
          </>
        )}
      </div>
      <footer className="w-full bg-card border-t border-border py-6 mt-12 flex flex-col items-center">
        <div className="flex items-center gap-2 mb-2">
          <Image src="/rocket.svg" alt="Logo" width={32} height={32} className="h-8 w-8" />
          <span className="font-bold text-lg text-foreground">NASA Explorer</span>
        </div>
        <div className="text-muted-foreground text-sm">
          © {new Date().getFullYear()} - Projeto técnico. Imagens: NASA APOD API.
        </div>
      </footer>
    </div>
  );
}
