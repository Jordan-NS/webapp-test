import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useApi } from "@/services/api";
import { useSession } from "next-auth/react";

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
  apod: {
    id: string;
    title: string;
    date: string;
    url: string;
    explanation: string;
    mediaType: string;
  };
  createdAt: string;
}

interface FetchImagesParams {
  page?: number;
  date?: string;
  search?: string;
  limit?: number;
}

interface ImagesResponse {
  images: NasaImage[];
  total: number;
  hasMore: boolean;
  currentPage: number;
  totalPages: number;
}

export function useNasaQueries() {
  const api = useApi();
  const queryClient = useQueryClient();
  const { status } = useSession();

  const useImages = ({ page = 1, date, search, limit = 30 }: FetchImagesParams = {}) => {
    return useQuery({
      queryKey: ["nasa-images", { page, date, search, limit }],
      queryFn: async () => {
        const response = await api.get("/apod", {
          params: {
            date: date || undefined,
            search: search || undefined,
            page,
            limit,
          },
        });
        return response.data;
      },
    });
  };


  const useFavorites = () => {
    return useQuery({
      queryKey: ["nasa-favorites"],
      queryFn: async () => {
        const response = await api.get("/favorites");
        return response.data as Favorite[];
      },
      enabled: status === "authenticated",
    });
  };


  const useAddFavorite = () => {
    return useMutation({
      mutationFn: async (data: { apodId: string }) => {
        const response = await api.post("/favorites", data);
        return response.data;
      },
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["nasa-favorites"] });
      },
    });
  };

  // Mutation para remover favorito
  const useRemoveFavorite = () => {
    return useMutation({
      mutationFn: async (imageId: string) => {
        await api.delete(`/favorites/${imageId}`);
      },
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["nasa-favorites"] });
      },
    });
  };

  const useFetchDailyImage = () => {
    return useMutation({
      mutationFn: async () => {
        const response = await api.get("/apod/sync");
        return response.data.saved[0];
      },
      onSuccess: (data) => {
        if (!data) return;
        queryClient.setQueryData<ImagesResponse>(["nasa-images", { page: 1 }], () => ({
          images: [data],
          total: 1,
          hasMore: false,
          currentPage: 1,
          totalPages: 1
        }));
      },
    });
  };

  const useSyncAllImages = () => {
    return useMutation({
      mutationFn: async () => {
        await api.get("/apod/sync-all");
      },
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["nasa-images"] });
      },
    });
  };

  return {
    useImages,
    useFavorites,
    useAddFavorite,
    useRemoveFavorite,
    useFetchDailyImage,
    useSyncAllImages,
  };
} 