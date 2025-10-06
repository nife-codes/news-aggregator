"use client";

import { useEffect, useState } from 'react';
import NewsCard from './components/NewsCard';
import AuthModal from './components/AuthModal';
import UserProfile from './components/UserProfile';
import { useAuth } from './context/AuthContext';

interface Article {
  id: number;
  title: string;
  description: string;
  source: string;
  publishedAt: string;
  url?: string;
  imageUrl?: string;
}

const CATEGORIES = [
  "All", "Technology", "Business", "Science", "Entertainment", "Sports"
];

// ENHANCED Category detection with more comprehensive logic
const getArticleCategory = (article: Article): string => {
  const title = article.title.toLowerCase();
  const description = article.description.toLowerCase();
  const source = article.source.toLowerCase();

  // Technology
  if (title.includes('tech') || title.includes('ai') || title.includes('software') || 
      title.includes('computer') || title.includes('digital') || title.includes('app') ||
      title.includes('cyber') || title.includes('startup') || title.includes('innovation') ||
      description.includes('technology') || description.includes('digital') || 
      description.includes('software') || description.includes('computer') ||
      source.includes('tech') || source.includes('gizmodo') || source.includes('wired') ||
      source.includes('techcrunch') || source.includes('verge')) {
    return 'Technology';
  }
  
  // Business
  if (title.includes('business') || title.includes('market') || title.includes('economy') ||
      title.includes('stock') || title.includes('investment') || title.includes('company') ||
      title.includes('financial') || title.includes('trade') || title.includes('bank') ||
      description.includes('business') || description.includes('economic') || 
      description.includes('financial') || description.includes('market') ||
      source.includes('business') || source.includes('forbes') || 
      source.includes('bloomberg') || source.includes('wsj')) {
    return 'Business';
  }
  
  // Science
  if (title.includes('science') || title.includes('research') || title.includes('study') ||
      title.includes('nasa') || title.includes('discover') || title.includes('planet') ||
      title.includes('space') || title.includes('climate') || title.includes('medical') ||
      description.includes('scientist') || description.includes('research') || 
      description.includes('study') || description.includes('discovery') ||
      source.includes('science') || source.includes('nature') || 
      source.includes('scientific')) {
    return 'Science';
  }
  
  // Entertainment
  if (title.includes('movie') || title.includes('film') || title.includes('entertainment') ||
      title.includes('music') || title.includes('celebrity') || title.includes('show') ||
      title.includes('actor') || title.includes('television') || title.includes('gaming') ||
      description.includes('entertainment') || description.includes('film') || 
      description.includes('music') || description.includes('celebrity') ||
      source.includes('entertainment') || source.includes('variety') || 
      source.includes('hollywood')) {
    return 'Entertainment';
  }
  
  // Sports
  if (title.includes('sport') || title.includes('game') || title.includes('team') ||
      title.includes('player') || title.includes('championship') || title.includes('win') ||
      title.includes('match') || title.includes('tournament') || title.includes('league') ||
      description.includes('sports') || description.includes('game') || 
      description.includes('tournament') || description.includes('athlete') ||
      source.includes('espn') || source.includes('sport') || source.includes('athletic')) {
    return 'Sports';
  }
  
  // If no category detected, assign randomly for demo purposes
  const categories = ['Technology', 'Business', 'Science', 'Entertainment', 'Sports'];
  return categories[Math.floor(Math.random() * categories.length)];
};

export default function Home() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [mounted, setMounted] = useState(false);
  const [visibleCount, setVisibleCount] = useState(6);

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [sortBy, setSortBy] = useState('newest');
  
  // Auth state
  const { user } = useAuth();
  const [showAuthModal, setShowAuthModal] = useState(false);

  // Filter and sort articles
  const filteredArticles = articles
    .filter(article => {
      const matchesSearch = article.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           article.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           article.source.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchesCategory = selectedCategory === 'All' || 
                             getArticleCategory(article) === selectedCategory;
      
      return matchesSearch && matchesCategory;
    })
    .sort((a, b) => {
      if (sortBy === 'newest') {
        return new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime();
      } else {
        return new Date(a.publishedAt).getTime() - new Date(b.publishedAt).getTime();
      }
    });

  useEffect(() => {
    setMounted(true);
  }, []);

  // UPDATED: Fetch ALL categories from backend, filter on frontend
  const fetchNews = async () => {
    try {
      setLoading(true);
      
      // Fetch from all categories
      const categories = ['technology', 'business', 'science', 'entertainment', 'sports'];
      const fetchPromises = categories.map(cat => 
        fetch(`https://news-aggregator-backend-6wdx.onrender.com/api/news?category=${cat}`)
          .then(res => res.ok ? res.json() : [])
          .catch(() => [])
      );
      
      const results = await Promise.all(fetchPromises);
      const allArticles = results.flat();
      
      // Fix duplicate IDs by making them unique
      const articlesWithUniqueIds = allArticles.map((article, index) => ({
        ...article,
        id: index + 1
      }));
      
      if (articlesWithUniqueIds.length > 0) {
        setArticles(articlesWithUniqueIds);
      } else {
        throw new Error('No articles received');
      }
    } catch (err) {
      setError('Failed to load live news. Using demo articles.');
      // Enhanced fallback data with better category coverage
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
          title: "Stock Markets Reach All-Time High", 
          description: "Major indices surge amid economic optimism and strong corporate earnings",
          source: "Business Daily",
          publishedAt: new Date().toISOString(),
        },
        {
          id: 3,
          title: "NASA Discovers New Earth-Like Planet",
          description: "Scientists find potentially habitable exoplanet in nearby star system",
          source: "Science Journal", 
          publishedAt: new Date().toISOString(),
        },
        {
          id: 4,
          title: "New Blockbuster Movie Breaks Records",
          description: "Latest film franchise installment dominates box office worldwide",
          source: "Entertainment Weekly",
          publishedAt: new Date().toISOString(),
        },
        {
          id: 5,
          title: "Championship Game Ends in Historic Victory",
          description: "Underdog team wins against all odds in thrilling finale",
          source: "Sports Network",
          publishedAt: new Date().toISOString(),
        },
        {
          id: 6,
          title: "Quantum Computing Milestone Reached",
          description: "Scientists achieve quantum supremacy with revolutionary new processor design",
          source: "Science Daily",
          publishedAt: new Date(Date.now() - 86400000).toISOString(),
        },
        {
          id: 7,
          title: "Global Tech Summit Announces Climate Initiatives",
          description: "Major tech companies commit to carbon neutrality by 2030",
          source: "Business Tech",
          publishedAt: new Date(Date.now() - 172800000).toISOString(),
        },
        {
          id: 8,
          title: "Music Festival Lineup Announced",
          description: "Biggest names in music confirmed for summer's hottest event",
          source: "Entertainment Tonight",
          publishedAt: new Date(Date.now() - 259200000).toISOString(),
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  // Fetch news on mount only
  useEffect(() => {
    if (!mounted) return;
    fetchNews();
  }, [mounted]); // Only fetch once on mount

  // Category change handler
  const handleCategoryChange = (category: string) => {
    setSelectedCategory(category);
    setVisibleCount(6);
  };

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
    <main className="min-h-screen bg-black p-4 sm:p-8 relative overflow-hidden">
      {/* Background effects */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-20 left-10 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-10 w-80 h-80 bg-blue-500/20 rounded-full blur-3xl animate-pulse"></div>
      </div>

      {/* Auth Button - Separate, outside header */}
      <div className="relative flex justify-end mb-4 safe-area-top">
        {user ? (
          <UserProfile />
        ) : (
          <button
            onClick={() => setShowAuthModal(true)}
            className="px-4 sm:px-6 py-2 sm:py-3 bg-purple-500 hover:bg-purple-600 text-white rounded-xl font-medium transition-all flex items-center gap-2 text-sm sm:text-base"
          >
            <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
            Sign In
          </button>
        )}
      </div>

      {/* Glass header - Now cleaner without auth button */}
      <div className="relative backdrop-blur-2xl bg-white/10 rounded-3xl p-6 sm:p-8 mb-8 border border-white/30 shadow-2xl mx-auto max-w-4xl">
        <h1 className="text-4xl sm:text-5xl font-bold text-center text-white mb-2">AI News Aggregator</h1>
        <p className="text-center text-white/80">Stay informed with AI-powered insights</p>
        {error && <p className="text-center text-yellow-400 mt-2">{error}</p>}
      </div>

      {/* Search and Filters Section */}
      <div className="relative backdrop-blur-2xl bg-white/10 rounded-2xl p-6 mb-8 border border-white/30 shadow-xl mx-auto max-w-4xl">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          
          {/* Search Input */}
          <div className="md:col-span-2">
            <label htmlFor="search" className="block text-white text-sm font-medium mb-2">
              Search Articles
            </label>
            <input
              id="search"
              type="text"
              placeholder="Search by title, description, or source..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/20 text-white placeholder-white/60 focus:outline-none focus:border-white/40 transition-colors"
            />
          </div>

          {/* Category Filter - UPDATED with new handler */}
          <div>
            <label htmlFor="category" className="block text-white text-sm font-medium mb-2">
              Category
            </label>
            <select
              id="category"
              value={selectedCategory}
              onChange={(e) => handleCategoryChange(e.target.value)}
              className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/20 text-white focus:outline-none focus:border-white/40 transition-colors"
            >
              {CATEGORIES.map(category => (
                <option key={category} value={category} className="bg-gray-800">
                  {category}
                </option>
              ))}
            </select>
          </div>

          {/* Sort Filter */}
          <div>
            <label htmlFor="sort" className="block text-white text-sm font-medium mb-2">
              Sort By
            </label>
            <select
              id="sort"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/20 text-white focus:outline-none focus:border-white/40 transition-colors"
            >
              <option value="newest" className="bg-gray-800">Newest First</option>
              <option value="oldest" className="bg-gray-800">Oldest First</option>
            </select>
          </div>

        </div>

        {/* Results Count */}
        <div className="mt-4 flex justify-between items-center text-white/80 text-sm">
          <span>
            Showing {filteredArticles.slice(0, visibleCount).length} of {filteredArticles.length} articles
            {searchQuery && ` for "${searchQuery}"`}
          </span>
          {(searchQuery || selectedCategory !== 'All') && (
            <button
              onClick={() => {
                setSearchQuery('');
                setSelectedCategory('All');
                setSortBy('newest');
              }}
              className="px-3 py-1 bg-white/10 hover:bg-white/20 rounded-lg transition-colors"
            >
              Clear Filters
            </button>
          )}
        </div>
      </div>
      
      {/* News grid */}
      <div className="grid gap-6 max-w-4xl mx-auto relative">
        {filteredArticles.slice(0, visibleCount).map(article => (
          <NewsCard key={article.id} article={article} />
        ))}
      </div>

      {/* Load More button */}
      {visibleCount < filteredArticles.length && (
        <div className="text-center mt-8">
          <button 
            onClick={loadMore}
            className="backdrop-blur-xl bg-white/10 text-white px-6 py-3 rounded-xl border border-white/30 hover:bg-white/20 transition-all font-medium"
          >
            Load More Articles
          </button>
        </div>
      )}

      {/* No results message */}
      {filteredArticles.length === 0 && !loading && (
        <div className="text-center text-white/60 py-12">
          <h3 className="text-xl font-semibold mb-2">No articles found</h3>
          <p>Try adjusting your search or filters</p>
        </div>
      )}

      {/* Footer */}
      <div className="mt-12 text-center text-white/40 text-sm">
        <p>Powered by NewsAPI • Built with Next.js & AI</p>
        <p className="mt-1">© 2024 AI News Aggregator • Portfolio Project</p>
      </div>

      {/* Auth Modal */}
      <AuthModal isOpen={showAuthModal} onClose={() => setShowAuthModal(false)} />
    </main>
  );
}