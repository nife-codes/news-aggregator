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
  const [mounted, setMounted] = useState(false);
  const [visibleCount, setVisibleCount] = useState(6); // Show only 6 initially

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;

    const fetchNews = async () => {
      try {
        setLoading(true);
        const response = await fetch('https://news-aggregator-backend-6wdx.onrender.com/api/news');
        
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        
        const data = await response.json();
        
        if (data && data.length > 0) {
          setArticles(data);
        } else {
          throw new Error('No articles received');
        }
      } catch (err) {
        setError('Failed to load live news. Using demo articles.');
        setArticles([
          {
            id: 1,
            title: "AI Breakthrough: New Model Outperforms Humans",
            description: "Researchers develop AI system that surpasses human performance in complex reasoning tasks",
            source: "Tech Insider",
            publishedAt: new Date().toISOString(),
          },
          {
            id: 2,
            title: "Global Tech Summit Announces Climate Initiatives", 
            description: "Major tech companies commit to carbon neutrality by 2030",
            source: "Business Tech",
            publishedAt: new Date().toISOString(),
          },
          {
            id: 3,
            title: "Quantum Computing Milestone Reached",
            description: "Scientists achieve quantum supremacy with new processor design",
            source: "Science Daily", 
            publishedAt: new Date().toISOString(),
          }
        ]);
      } finally {
        setLoading(false);
      }
    };

    fetchNews();
  }, [mounted]);

  const loadMore = () => {
    setVisibleCount(prev => prev + 6);
  };

  if (!mounted) {
    return (
      <main className="min-h-screen bg-black p-8">
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-white">Loading...</div>
        </div>
      </main>
    );
  }

  if (loading) {
    return (
      <main className="min-h-screen bg-black p-8 relative overflow-hidden">
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-white text-xl flex items-center">
            <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Loading news...
          </div>
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
        <p className="text-center text-white/80">Stay informed with AI-powered insights</p>
        {error && <p className="text-center text-yellow-400 mt-2">{error}</p>}
        <div className="text-center text-white/60 text-sm mt-2">
          Showing {Math.min(visibleCount, articles.length)} of {articles.length} articles
        </div>
      </div>
      
      {/* News grid - LIMITED to visibleCount */}
      <div className="grid gap-6 max-w-4xl mx-auto relative">
        {articles.slice(0, visibleCount).map(article => (
          <NewsCard key={article.id} article={article} />
        ))}
      </div>

      {/* Load More button */}
      {visibleCount < articles.length && (
        <div className="text-center mt-8">
          <button 
            onClick={loadMore}
            className="backdrop-blur-xl bg-white/10 text-white px-6 py-3 rounded-xl border border-white/30 hover:bg-white/20 transition-all font-medium"
          >
            Load More Articles
          </button>
        </div>
      )}

      {/* Footer */}
      <div className="mt-12 text-center text-white/40 text-sm">
        <p>Powered by NewsAPI • Built with Next.js & AI</p>
        <p className="mt-1">© 2024 AI News Aggregator • Portfolio Project</p>
      </div>
    </main>
  );
}