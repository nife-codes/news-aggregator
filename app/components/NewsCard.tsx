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
  return (
    <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
      <h2 className="text-xl font-semibold text-gray-900 mb-2">{article.title}</h2>
      <p className="text-gray-600 mb-4">{article.description}</p>
      <div className="flex justify-between text-sm text-gray-500">
        <span>{article.source}</span>
        <span>{new Date(article.publishedAt).toLocaleDateString()}</span>
      </div>
      <button className="mt-4 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-colors">
        Summarize with AI
      </button>
    </div>
  )
}