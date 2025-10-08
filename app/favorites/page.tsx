"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../context/AuthContext';
import { useFavorites } from '../hooks/useFavorites';
import NewsCard from '../components/NewsCard';
import UserProfile from '../components/UserProfile';

export default function FavoritesPage() {
  const router = useRouter();
  const { user } = useAuth();
  const { favorites, loading } = useFavorites();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (mounted && !user) {
      router.push('/');
    }
  }, [user, mounted, router]);

  if (!mounted || loading) {
    return (
      <main className="min-h-screen bg-black p-4 sm:p-8 relative overflow-hidden">
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-white text-xl flex items-center">
            <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Loading favorites...
          </div>
        </div>
      </main>
    );
  }

  if (!user) return null;

  return (
    <main className="min-h-screen bg-black p-4 sm:p-8 relative overflow-hidden">
      {/* Background effects */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-20 left-10 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-10 w-80 h-80 bg-blue-500/20 rounded-full blur-3xl animate-pulse"></div>
      </div>

      {/* Header */}
      <div className="relative flex justify-between items-center mb-4 safe-area-top">
        <button
          onClick={() => router.push('/')}
          className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-xl transition-all flex items-center gap-2"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Back
        </button>
        
        <UserProfile />
      </div>

      {/* Title Section */}
      <div className="relative backdrop-blur-2xl bg-white/10 rounded-3xl p-6 sm:p-8 mb-8 border border-white/30 shadow-2xl mx-auto max-w-4xl">
        <div className="flex items-center justify-center gap-3 mb-2">
          <svg className="w-8 h-8 text-red-400" fill="currentColor" viewBox="0 0 24 24">
            <path d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
          </svg>
          <h1 className="text-4xl sm:text-5xl font-bold text-center text-white">Your Favorites</h1>
        </div>
        <p className="text-center text-white/80">
          {favorites.length === 0 
            ? "You haven't saved any articles yet" 
            : `${favorites.length} saved ${favorites.length === 1 ? 'article' : 'articles'}`
          }
        </p>
      </div>

      {/* Favorites Grid */}
      {favorites.length === 0 ? (
        <div className="relative backdrop-blur-2xl bg-white/10 rounded-2xl p-8 sm:p-12 border border-white/30 shadow-xl mx-auto max-w-4xl text-center">
          <svg className="w-20 h-20 mx-auto mb-4 text-white/40" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
          </svg>
          <h3 className="text-xl font-semibold text-white mb-2">No favorites yet</h3>
          <p className="text-white/60 mb-6">
            Start saving articles by clicking the heart icon on any news card
          </p>
          <button
            onClick={() => router.push('/')}
            className="px-6 py-3 bg-purple-500 hover:bg-purple-600 text-white rounded-xl font-medium transition-all"
          >
            Browse News
          </button>
        </div>
      ) : (
        <div className="grid gap-6 max-w-4xl mx-auto relative">
          {favorites.map(article => (
            <NewsCard key={article.favoriteId} article={article} />
          ))}
        </div>
      )}

      {/* Footer */}
      <div className="mt-12 text-center text-white/40 text-sm">
        <p>Powered by NewsAPI • Built with Next.js & Firebase</p>
        <p className="mt-1">© 2024 AI News Aggregator • Portfolio Project</p>
      </div>
    </main>
  );
}