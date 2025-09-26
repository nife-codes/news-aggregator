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
    <main className="min-h-screen bg-gray-100 p-8">
      <h1 className="text-4xl font-bold text-center mb-8">AI News Aggregator</h1>
      <div className="grid gap-6 max-w-4xl mx-auto">
        {mockArticles.map(article => (
          <NewsCard key={article.id} article={article} />
        ))}
      </div>
    </main>
  )
}