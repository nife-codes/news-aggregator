"use client";

import { useState } from 'react';
import { useFavorites } from '../hooks/useFavorites';
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

interface NewsCardProps {
  article: Article;
}

export default function NewsCard({ article }: NewsCardProps) {
  const [showSummary, setShowSummary] = useState(false);
  const [summary, setSummary] = useState('');
  const [loading, setLoading] = useState(false);
  
  const { user } = useAuth();
  const { isFavorited, toggleFavorite, loading: favoritesLoading } = useFavorites();
  const [savingFavorite, setSavingFavorite] = useState(false);

  const handleFavoriteClick = async () => {
    if (!user) {
      alert('Please sign in to save articles');
      return;
    }

    try {
      setSavingFavorite(true);
      await toggleFavorite(article);
    } catch (error) {
      console.error('Error toggling favorite:', error);
      alert('Failed to save article. Please try again.');
    } finally {
      setSavingFavorite(false);
    }
  };

  // Format markdown-style summary to HTML - COMPACT VERSION
  const formatSummary = (text: string) => {
    const lines = text.split('\n').filter(line => line.trim());
    
    let html = '';
    
    lines.forEach(line => {
      const trimmed = line.trim();
      
      if (!trimmed) return;
      
      if (trimmed.endsWith(':')) {
        html += `<div class="text-purple-300 font-bold mt-3 mb-1">${trimmed}</div>`;
      }
      else if (trimmed.startsWith('•')) {
        const text = trimmed.replace(/^•\s*/, '');
        html += `<div class="mb-1">${text.replace(/\*\*(.*?)\*\*/g, '<strong class="font-semibold">$1</strong>')}</div>`;
      }
      else {
        html += `<div class="mb-2">${trimmed.replace(/\*\*(.*?)\*\*/g, '<strong class="font-semibold">$1</strong>')}</div>`;
      }
    });
    
    return html;
  };

  const handleSummarize = async () => {
    if (showSummary) {
      setShowSummary(false);
      return;
    }

    setLoading(true);
    setShowSummary(true);

    try {
      const response = await fetch('https://news-aggregator-backend-6wdx.onrender.com/api/summarize', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ article })
      });

      const data = await response.json();
      setSummary(data.summary);
    } catch (error) {
      setSummary(`**Quick Summary**\n\n${article.description}\n\n*This is a fallback summary. Full AI analysis temporarily unavailable.*`);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric', 
      year: 'numeric' 
    });
  };

  return (
    <div className="backdrop-blur-2xl bg-white/10 rounded-2xl p-4 sm:p-6 border border-white/30 shadow-xl hover:bg-white/15 transition-all">
      {/* Article Header with Favorite Button */}
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 mb-4">
        <div className="flex-1">
          <div className="flex items-start justify-between gap-2 mb-2">
            <h2 className="text-lg sm:text-xl font-bold text-white leading-tight flex-1">
              {article.title}
            </h2>
            
            {/* Favorite Heart Button */}
            <button
              onClick={handleFavoriteClick}
              disabled={savingFavorite || favoritesLoading}
              className={`flex-shrink-0 p-2 rounded-lg transition-all ${
                isFavorited(article.id)
                  ? 'bg-red-500/20 text-red-400 hover:bg-red-500/30'
                  : 'bg-white/5 text-white/60 hover:bg-white/10 hover:text-white'
              } ${(savingFavorite || favoritesLoading) ? 'opacity-50 cursor-wait' : ''}`}
              title={isFavorited(article.id) ? 'Remove from favorites' : 'Save to favorites'}
            >
              <svg 
                className="w-5 h-5" 
                fill={isFavorited(article.id) ? 'currentColor' : 'none'} 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={2} 
                  d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" 
                />
              </svg>
            </button>
          </div>
        </div>
        
        {article.imageUrl && (
          <img 
            src={article.imageUrl} 
            alt={article.title}
            className="w-full sm:w-24 sm:h-24 h-40 object-cover rounded-lg sm:ml-4 flex-shrink-0"
          />
        )}
      </div>

      {/* Article Description */}
      <p className="text-white/80 mb-4 text-sm sm:text-base leading-relaxed">
        {article.description}
      </p>

      {/* Article Meta */}
      <div className="flex flex-wrap items-center gap-2 sm:gap-4 text-xs sm:text-sm text-white/60 mb-4">
        <span className="font-medium">{article.source}</span>
        <span>•</span>
        <span>{formatDate(article.publishedAt)}</span>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-3">
        <button
          onClick={handleSummarize}
          disabled={loading}
          className={`flex-1 px-4 py-2.5 sm:py-3 rounded-xl font-medium transition-all text-sm sm:text-base ${
            showSummary
              ? 'bg-red-500/20 text-red-300 border border-red-400/30 hover:bg-red-500/30'
              : 'bg-purple-500/20 text-purple-300 border border-purple-400/30 hover:bg-purple-500/30'
          } ${loading ? 'opacity-50 cursor-wait' : ''}`}
        >
          {loading ? (
            <span className="flex items-center justify-center">
              <svg className="animate-spin h-4 w-4 mr-2" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Analyzing...
            </span>
          ) : showSummary ? (
            <span className="flex items-center justify-center">
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
              Close Summary
            </span>
          ) : (
            <span className="flex items-center justify-center">
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              Summarize with AI
            </span>
          )}
        </button>

        {article.url && article.url !== '#' && (
          <a
            href={article.url}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 px-4 py-2.5 sm:py-3 rounded-xl bg-blue-500/20 text-blue-300 border border-blue-400/30 hover:bg-blue-500/30 transition-all font-medium text-center text-sm sm:text-base"
          >
            <span className="flex items-center justify-center">
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
              </svg>
              Read Full Article
            </span>
          </a>
        )}
      </div>

      {/* AI Summary Section */}
      {showSummary && (
        <div className="mt-4 p-3 sm:p-4 rounded-xl bg-gradient-to-br from-purple-500/10 to-blue-500/10 border border-purple-400/20">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-base sm:text-lg font-semibold text-purple-300 flex items-center">
              <svg className="w-4 h-4 sm:w-5 sm:h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
              AI Summary
            </h3>
            <button
              onClick={() => setShowSummary(false)}
              className="text-white/60 hover:text-white transition-colors p-1"
              aria-label="Close summary"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          
          {loading ? (
            <div className="flex items-center justify-center py-6 sm:py-8">
              <div className="text-center">
                <svg className="animate-spin h-8 w-8 sm:h-10 sm:w-10 text-purple-400 mx-auto mb-3" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                <p className="text-white/70 text-sm">Generating summary...</p>
              </div>
            </div>
          ) : (
            <div className="max-h-[60vh] overflow-y-auto">
              <div 
                className="text-white/90 text-sm sm:text-base leading-snug"
                dangerouslySetInnerHTML={{ __html: formatSummary(summary) }}
              ></div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}