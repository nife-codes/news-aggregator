"use client";

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
  const handleSummarize = async () => {
    const mockSummary = `This is a mock AI summary for "${article.title}". The real AI will analyze this article and provide key points shortly!`;
    alert(`🔍 AI Summary:\n\n${mockSummary}`);
  }

  return (
    <div className="relative backdrop-blur-2xl bg-white/10 rounded-3xl p-6 border border-white/30 shadow-2xl">
      {/* Glass reflection effect */}
      <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent rounded-3xl opacity-50"></div>
      
      <h2 className="text-xl font-semibold text-white mb-2 relative z-10 drop-shadow">{article.title}</h2>
      <p className="text-white/90 mb-4 relative z-10 drop-shadow">{article.description}</p>
    
      <div className="flex justify-between text-sm text-white/70 relative z-10 drop-shadow">
        <span>{article.source}</span>
        <span>{new Date(article.publishedAt).toLocaleDateString()}</span>
      </div>
      
      <button 
        onClick={handleSummarize}
        className="mt-4 relative z-10 backdrop-blur-2xl bg-white/10 text-white px-4 py-2 rounded-xl border border-white/40 hover:bg-white/20 transition-all duration-300 font-medium hover:scale-105 drop-shadow"
      >
        ✨ Summarize with AI
      </button>
    </div>
  )
}