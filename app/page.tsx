import NewsCard from './components/NewsCard'

export default function Home() {
  const mockArticles = [
    {
      id: 1,
      title: "Breaking: New AI Model Released",
      description: "Scientists announce breakthrough in artificial intelligence research",
      source: "Tech News",
      publishedAt: "2024-01-15"
    },
    {
      id: 2, 
      title: "Global Climate Summit Concludes",
      description: "World leaders agree on new environmental targets",
      source: "World News",
      publishedAt: "2024-01-14"
    },
    {
      id: 3,
      title: "Stock Markets Reach Record High",
      description: "Major indices surge amid economic optimism", 
      source: "Business Daily",
      publishedAt: "2024-01-15"
    }
  ]

  return (
    <main className="min-h-screen bg-black p-8 relative overflow-hidden">
      {/* KEEP JUST the colorful balls (no bubbles) */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-20 left-10 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-10 w-80 h-80 bg-blue-500/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute top-1/2 left-1/3 w-72 h-72 bg-cyan-500/15 rounded-full blur-3xl animate-pulse"></div>
      </div>

      {/* GLASS HEADER */}
      <div className="relative backdrop-blur-2xl bg-white/10 rounded-3xl p-8 mb-8 border border-white/30 shadow-2xl mx-auto max-w-4xl">
        <h1 className="text-5xl font-bold text-center text-white mb-2">AI News Aggregator</h1>
        <p className="text-center text-white/80">Powered by AI • Stay informed</p>
      </div>
      
      {/* NEWS CARDS */}
      <div className="grid gap-6 max-w-4xl mx-auto relative">
        {mockArticles.map(article => (
          <NewsCard key={article.id} article={article} />
        ))}
      </div>
    </main>
  )
}