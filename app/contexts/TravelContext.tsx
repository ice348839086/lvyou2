'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import type { Attraction } from '@/lib/types';

interface TravelContextType {
  // 行程管理
  itinerary: Attraction[];
  addToItinerary: (attraction: Attraction) => void;
  removeFromItinerary: (attractionId: string) => void;
  clearItinerary: () => void;
  isInItinerary: (attractionId: string) => boolean;
  
  // 收藏管理
  favorites: Attraction[];
  addToFavorites: (attraction: Attraction) => void;
  removeFromFavorites: (attractionId: string) => void;
  isFavorite: (attractionId: string) => boolean;
}

const TravelContext = createContext<TravelContextType | undefined>(undefined);

export function TravelProvider({ children }: { children: ReactNode }) {
  const [itinerary, setItinerary] = useState<Attraction[]>([]);
  const [favorites, setFavorites] = useState<Attraction[]>([]);

  // 从localStorage加载数据
  useEffect(() => {
    const savedItinerary = localStorage.getItem('travel-itinerary');
    const savedFavorites = localStorage.getItem('travel-favorites');
    
    if (savedItinerary) {
      try {
        setItinerary(JSON.parse(savedItinerary));
      } catch (e) {
        console.error('Failed to load itinerary:', e);
      }
    }
    
    if (savedFavorites) {
      try {
        setFavorites(JSON.parse(savedFavorites));
      } catch (e) {
        console.error('Failed to load favorites:', e);
      }
    }
  }, []);

  // 保存行程到localStorage
  useEffect(() => {
    localStorage.setItem('travel-itinerary', JSON.stringify(itinerary));
  }, [itinerary]);

  // 保存收藏到localStorage
  useEffect(() => {
    localStorage.setItem('travel-favorites', JSON.stringify(favorites));
  }, [favorites]);

  const addToItinerary = (attraction: Attraction) => {
    setItinerary((prev) => {
      // 避免重复添加
      if (prev.some((item) => item.id === attraction.id)) {
        return prev;
      }
      return [...prev, attraction];
    });
  };

  const removeFromItinerary = (attractionId: string) => {
    setItinerary((prev) => prev.filter((item) => item.id !== attractionId));
  };

  const clearItinerary = () => {
    setItinerary([]);
  };

  const addToFavorites = (attraction: Attraction) => {
    setFavorites((prev) => {
      // 避免重复添加
      if (prev.some((item) => item.id === attraction.id)) {
        return prev;
      }
      return [...prev, attraction];
    });
  };

  const removeFromFavorites = (attractionId: string) => {
    setFavorites((prev) => prev.filter((item) => item.id !== attractionId));
  };

  const isFavorite = (attractionId: string) => {
    return favorites.some((item) => item.id === attractionId);
  };

  const isInItinerary = (attractionId: string) => {
    return itinerary.some((item) => item.id === attractionId);
  };

  return (
    <TravelContext.Provider
      value={{
        itinerary,
        addToItinerary,
        removeFromItinerary,
        clearItinerary,
        isInItinerary,
        favorites,
        addToFavorites,
        removeFromFavorites,
        isFavorite,
      }}
    >
      {children}
    </TravelContext.Provider>
  );
}

export function useTravelContext() {
  const context = useContext(TravelContext);
  if (context === undefined) {
    throw new Error('useTravelContext must be used within a TravelProvider');
  }
  return context;
}
