"use client";

import { useState, useEffect } from 'react';
import { 
  collection, 
  addDoc, 
  deleteDoc, 
  query, 
  where, 
  getDocs,
  doc,
  onSnapshot 
} from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { useAuth } from '../context/AuthContext';

interface Article {
  id: string;
  title: string;
  description: string;
  source: string;
  publishedAt: string;
  url?: string;
  imageUrl?: string;
  category?: string;
}

interface FavoriteArticle extends Article {
  favoriteId: string;
}

export function useFavorites() {
  const { user } = useAuth();
  const [favorites, setFavorites] = useState<FavoriteArticle[]>([]);
  const [loading, setLoading] = useState(true);

  // Load favorites when user logs in
  useEffect(() => {
    if (!user) {
      setFavorites([]);
      setLoading(false);
      return;
    }

    setLoading(true);

    // Real-time listener for favorites
    const favoritesRef = collection(db, 'favorites');
    const q = query(favoritesRef, where('userId', '==', user.uid));

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const favs: FavoriteArticle[] = [];
      snapshot.forEach((doc) => {
        favs.push({
          favoriteId: doc.id,
          ...doc.data()
        } as FavoriteArticle);
      });
      setFavorites(favs);
      setLoading(false);
    }, (error) => {
      console.error('Error loading favorites:', error);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [user]);

  // Check if an article is favorited
  const isFavorited = (articleId: string): boolean => {
    return favorites.some(fav => fav.id === articleId);
  };

  // Get favorite ID for an article
  const getFavoriteId = (articleId: string): string | null => {
    const fav = favorites.find(f => f.id === articleId);
    return fav?.favoriteId || null;
  };

  // Add article to favorites
  const addFavorite = async (article: Article) => {
    if (!user) {
      throw new Error('Must be logged in to save favorites');
    }

    try {
      const favoritesRef = collection(db, 'favorites');
      await addDoc(favoritesRef, {
        userId: user.uid,
        ...article,
        savedAt: new Date().toISOString()
      });
    } catch (error) {
      console.error('Error adding favorite:', error);
      throw error;
    }
  };

  // Remove article from favorites
  const removeFavorite = async (articleId: string) => {
    if (!user) {
      throw new Error('Must be logged in to remove favorites');
    }

    try {
      const favoriteId = getFavoriteId(articleId);
      if (!favoriteId) return;

      const favoriteRef = doc(db, 'favorites', favoriteId);
      await deleteDoc(favoriteRef);
    } catch (error) {
      console.error('Error removing favorite:', error);
      throw error;
    }
  };

  // Toggle favorite status
  const toggleFavorite = async (article: Article) => {
    if (!user) {
      throw new Error('Must be logged in to save favorites');
    }

    if (isFavorited(article.id)) {
      await removeFavorite(article.id);
    } else {
      await addFavorite(article);
    }
  };

  return {
    favorites,
    loading,
    isFavorited,
    addFavorite,
    removeFavorite,
    toggleFavorite
  };
}