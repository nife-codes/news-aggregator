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
    <main className="min-h-screen bg-gray-900 p-8 relative overflow-hidden">
      {/* BUSY BACKGROUND PATTERN - This will show the blur */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-gray-700 via-gray-900 to-black opacity-70"></div>
      
      {/* Grid pattern behind to show blur effect */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.1)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.1)_1px,transparent_1px)] bg-[size:50px_50px] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_50%,black,transparent)]"></div>
      
      {/* Moving lights that will blur */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-blue-500/40 to-transparent animate-pulse"></div>
        <div className="absolute bottom-0 right-0 w-1 h-full bg-gradient-to-b from-transparent via-purple-500/40 to-transparent animate-pulse"></div>
        
        <div className="absolute top-1/4 left-1/4 w-48 h-48 bg-blue-500/20 rounded-full blur-2xl animate-bounce"></div>
        <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-purple-500/20 rounded-full blur-2xl animate-pulse"></div>
        <div className="absolute top-3/4 left-3/4 w-32 h-32 bg-cyan-500/20 rounded-full blur-2xl animate-bounce"></div>
      </div>

      {/* Glass header */}
      <div className="relative backdrop-blur-2xl bg-white/10 rounded-3xl p-8 mb-8 border border-white/30 shadow-2xl mx-auto max-w-4xl">
        <h1 className="text-5xl font-bold text-center text-white mb-2">AI News Aggregator</h1>
        <p className="text-center text-white/80">Powered by AI • Stay informed</p>
      </div>
      
      <div className="grid gap-6 max-w-4xl mx-auto relative">
        {mockArticles.map(article => (
          <NewsCard key={article.id} article={article} />
        ))}
      </div>
    </main>
  )
}