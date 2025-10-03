"use client";

import { useState } from 'react';

interface Article {
  id: number
  title: string
  description: string 
  source: string
  publishedAt: string
  summary?: string // optional summary
}

interface NewsCardProps {
  article: Article
}

export default function NewsCard({ article }: NewsCardProps) {
  const [isSummarizing, setIsSummarizing] = useState(false);
  const [summary, setSummary] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [showSummary, setShowSummary] = useState(false);

  const handleSummarize = async () => {
    // If summary is already shown, just toggle it closed
    if (showSummary) {
      setShowSummary(false);
      setSummary(null);
      return;
    }

    // If we already have a summary, just show it
    if (summary) {
      setShowSummary(true);
      return;
    }

    // Otherwise, fetch new summary
    setIsSummarizing(true);
    setError(null);
    
    try {
      const response = await fetch('https://news-aggregator-backend-6wdx.onrender.com/api/summarize', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ article }),
      });

      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

      const data = await response.json();
      setSummary(data.summary);
      setShowSummary(true);
    } catch (err) {
      setError('Failed to generate summary. Please try again.');
      console.error('Summary error:', err);
    } finally {
      setIsSummarizing(false);
    }
  }

  return (
    <div className="relative backdrop-blur-3xl bg-white/5 rounded-3xl p-6 border border-white/40 shadow-2xl hover:shadow-3xl transition-all duration-500 hover:bg-white/10 group">
      {/* Glass reflection */}
      <div className="absolute inset-0 bg-gradient-to-br from-white/15 via-transparent to-white/5 rounded-3xl"></div>
      
      {/* Content */}
      <h2 className="text-xl font-semibold text-white mb-2 relative z-10">
        {article.title}
      </h2>
      <p className="text-white/90 mb-4 relative z-10">
        {article.description}
      </p>
      <div className="flex justify-between text-sm text-white/70 relative z-10">
        <span>{article.source}</span>
        <span>{new Date(article.publishedAt).toLocaleDateString()}</span>
      </div>
      
      {/* AI SUMMARY LOADING STATE */}
      {isSummarizing && (
        <div className="mt-4 p-4 bg-white/10 rounded-xl border border-white/20 relative z-10 backdrop-blur-sm">
          <h3 className="text-white font-semibold mb-3 text-lg">
            AI Summary
          </h3>
          <div className="space-y-2 animate-pulse">
            <div className="h-3 bg-white/20 rounded w-full"></div>
            <div className="h-3 bg-white/20 rounded w-5/6"></div>
            <div className="h-3 bg-white/20 rounded w-4/6"></div>
            <div className="h-3 bg-white/20 rounded w-3/4"></div>
            <div className="h-3 bg-white/20 rounded w-5/6"></div>
          </div>
          <div className="mt-3 pt-3 border-t border-white/20 text-xs text-white/60">
            Generating AI analysis...
          </div>
        </div>
      )}

      {/* ✅ New Summary Display */}
      {showSummary && !isSummarizing && (
        <div className="mt-4 p-4 bg-gray-800/50 rounded-lg border border-gray-700 relative z-10 backdrop-blur-sm">
          <h4 className="font-semibold text-white mb-2">🤖 AI Summary</h4>
          <p className="text-gray-100 text-sm leading-relaxed">
            {summary || article.summary || "Summary not available"}
          </p>
        </div>
      )}
      
      {/* Error Display */}
      {error && (
        <div className="mt-4 p-3 bg-red-500/20 rounded-xl border border-red-400/30 relative z-10">
          <p className="text-red-200 text-sm">Error: {error}</p>
        </div>
      )}
      
      {/* Fixed Gradient Button (toggle works now) */}
      <button
        onClick={handleSummarize}
        disabled={isSummarizing}
        className="min-h-[44px] mt-4 px-4 py-2 bg-gradient-to-r from-blue-500/80 to-purple-500/80 hover:from-blue-600/80 hover:to-purple-600/80 text-white font-medium rounded-lg transition-all duration-200 transform hover:scale-105 border border-blue-400/30 flex items-center justify-center gap-2 backdrop-blur-sm"
      >
        {isSummarizing ? (
          <>
            <svg className="animate-spin h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Summarizing...
          </>
        ) : showSummary ? (
          'Close Summary'
        ) : (
          'Summarize'
        )}
      </button>
    </div>
  )
}