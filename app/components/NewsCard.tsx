"use client";

import { useState } from 'react';

interface Article {
  id: number
  title: string
  description: string 
  source: string
  publishedAt: string
}

interface NewsCardProps {
  article: Article
}

export default function NewsCard({ article }: NewsCardProps) {
  const [isSummarizing, setIsSummarizing] = useState(false);
  const [summary, setSummary] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleSummarize = async () => {
    setIsSummarizing(true);
    setError(null);
    
    try {
      console.log('🔄 Sending request to backend...');
      
      const response = await fetch('http://localhost:5000/api/summarize', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ article }),
      });

      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

      const data = await response.json();
      console.log('✅ Summary received:', data);
      setSummary(data.summary);
    } catch (err) {
      console.error('❌ Summary error:', err);
      setError('Failed to generate summary. Please try again.');
    } finally {
      setIsSummarizing(false);
    }
  }

  return (
    <div className="relative backdrop-blur-3xl bg-white/5 rounded-3xl p-6 border border-white/40 shadow-2xl hover:shadow-3xl transition-all duration-500 hover:bg-white/10 group">
      {/* Glass reflection */}
      <div className="absolute inset-0 bg-gradient-to-br from-white/15 via-transparent to-white/5 rounded-3xl"></div>
      
      <h2 className="text-xl font-semibold text-white mb-2 relative z-10 drop-shadow-lg">{article.title}</h2>
      <p className="text-white/90 mb-4 relative z-10 drop-shadow">{article.description}</p>
      <div className="flex justify-between text-sm text-white/70 relative z-10 drop-shadow">
        <span>{article.source}</span>
        <span>{new Date(article.publishedAt).toLocaleDateString()}</span>
      </div>
      
      {/* Summary Display */}
      {summary && (
        <div className="mt-4 p-4 bg-white/10 rounded-xl border border-white/20 relative z-10">
          <h3 className="text-white font-semibold mb-2">AI Summary:</h3>
          <p className="text-white/80 text-sm whitespace-pre-line">{summary}</p>
        </div>
      )}
      
      {/* Error Display */}
      {error && (
        <div className="mt-4 p-3 bg-red-500/20 rounded-xl border border-red-400/30 relative z-10">
          <p className="text-red-200 text-sm">⚠️ {error}</p>
        </div>
      )}
      
      <button 
        onClick={handleSummarize}
        disabled={isSummarizing}
        className="mt-4 relative z-10 backdrop-blur-2xl bg-white/15 text-white px-4 py-2 rounded-xl border border-white/40 hover:bg-white/25 disabled:bg-gray-600/30 disabled:cursor-not-allowed transition-all duration-300 font-medium hover:scale-105 disabled:scale-100 drop-shadow-lg"
      >
        {isSummarizing ? (
          <span className="flex items-center justify-center">
            <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Summarizing...
          </span>
        ) : (
          'Summarize with AI'
        )}
      </button>
    </div>
  )
}