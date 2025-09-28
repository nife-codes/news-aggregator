"use client";

import { useEffect, useState } from 'react';
import NewsCard from './components/NewsCard';

interface Article {
  id: number;
  title: string;
  description: string;
  source: string;
  publishedAt: string;
  url?: string;
  imageUrl?: string;
}

export default function Home() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchNews = async () => {
      try {
        setLoading(true);
        const response = await fetch('http://localhost:5000/api/news');
        
        if (!response.ok) throw new Error('Failed to fetch news');
        
        const data = await response.json();
        setArticles(data);
      } catch (err) {
        setError('Failed to load news. Using demo data.');
        // Fallback to mock data
        setArticles([
          {
            id: 1,
            title: "Breaking: New AI Model Released",
            description: "Scientists announce breakthrough in artificial intelligence research",
            source: "Tech News",
            publishedAt: new Date().toISOString(),
          }
        ]);
      } finally {
        setLoading(false);
      }
    };

    fetchNews();
  }, []);

  if (loading) {
    return (
      <main className="min-h-screen bg-black p-8 relative overflow-hidden">
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-white text-xl">📰 Loading real news...</div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-black p-8 relative overflow-hidden">
      {/* Background effects */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-20 left-10 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-10 w-80 h-80 bg-blue-500/20 rounded-full blur-3xl animate-pulse"></div>
      </div>

      {/* Glass header */}
      <div className="relative backdrop-blur-2xl bg-white/10 rounded-3xl p-8 mb-8 border border-white/30 shadow-2xl mx-auto max-w-4xl">
        <h1 className="text-5xl font-bold text-center text-white mb-2">AI News Aggregator</h1>
        <p className="text-center text-white/80">Powered by Real AI • Live News Updates</p>
        {error && <p className="text-center text-yellow-400 mt-2">⚠️ {error}</p>}
      </div>
      
      {/* News grid */}
      <div className="grid gap-6 max-w-4xl mx-auto relative">
        {articles.map(article => (
          <NewsCard key={article.id} article={article} />
        ))}
      </div>
    </main>
  );
}