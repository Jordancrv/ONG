import { useState, useEffect } from 'react';
import { favoritesService } from '../services/api.service';

interface Favorite {
  id: number;
  courseId: number;
  course?: any;
  createdAt: string;
}

export const useFavorites = () => {
  const [favorites, setFavorites] = useState<Favorite[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadFavorites = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await favoritesService.getFavorites();
      console.log('Favorites loaded:', data);
      setFavorites(data);
    } catch (err: any) {
      console.error('Error loading favorites:', err);
      setError(err.response?.data?.message || 'Failed to load favorites');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadFavorites();
  }, []);

  const addFavorite = async (courseId: number) => {
    try {
      // Check if already exists locally
      if (isFavorite(courseId)) {
        console.log('Course already in favorites');
        return true;
      }
      
      const newFavorite = await favoritesService.addFavorite(courseId);
      setFavorites((prev) => [...prev, newFavorite]);
      return true;
    } catch (err: any) {
      console.error('Error adding favorite:', err);
      
      // If it's a 409 conflict, the favorite already exists, just update local state
      if (err.response?.status === 409) {
        console.log('Favorite already exists on server');
        // Create a mock favorite for local state
        const mockFavorite: Favorite = {
          id: Date.now(), // temporary ID
          courseId,
          createdAt: new Date().toISOString(),
        };
        setFavorites((prev) => {
          // Make sure it doesn't already exist
          if (!prev.some(f => f.courseId === courseId)) {
            return [...prev, mockFavorite];
          }
          return prev;
        });
        return true;
      }
      
      setError(err.response?.data?.message || 'Failed to add favorite');
      return false;
    }
  };

  const removeFavorite = async (courseId: number) => {
    try {
      // Check if exists locally before trying to remove
      if (!isFavorite(courseId)) {
        console.log('Course not in favorites');
        return true;
      }
      
      await favoritesService.removeFavorite(courseId);
      setFavorites((prev) => prev.filter((fav) => {
        // Filter by both courseId and course.id for compatibility
        return fav.courseId !== courseId && fav.course?.id !== courseId;
      }));
      return true;
    } catch (err: any) {
      console.error('Error removing favorite:', err);
      
      // If it's a 404 not found, the favorite doesn't exist, so we consider it a success
      if (err.response?.status === 404) {
        console.log('Favorite not found on server, syncing...');
        setFavorites((prev) => prev.filter((fav) => {
          return fav.courseId !== courseId && fav.course?.id !== courseId;
        }));
        return true;
      }
      
      setError(err.response?.data?.message || 'Failed to remove favorite');
      return false;
    }
  };

  const isFavorite = (courseId: number): boolean => {
    return favorites.some((fav) => {
      // Check both courseId and course.id for compatibility
      return fav.courseId === courseId || fav.course?.id === courseId;
    });
  };

  const toggleFavorite = async (courseId: number) => {
    if (isFavorite(courseId)) {
      return await removeFavorite(courseId);
    } else {
      return await addFavorite(courseId);
    }
  };

  return {
    favorites,
    loading,
    error,
    addFavorite,
    removeFavorite,
    isFavorite,
    toggleFavorite,
    refetch: loadFavorites,
  };
};
