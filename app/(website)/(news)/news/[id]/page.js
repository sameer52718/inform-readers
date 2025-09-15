import { notFound } from "next/navigation";

async function fetchArticle(id) {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/website/article/${id}`);
    if (!res.ok) return null;
    const { article } = await res.json();
    return article || null;
  } catch (error) {
    console.error("Failed to fetch article:", error);
    return null;
  }
}

export async function generateMetadata({ params }) {
  const article = await fetchArticle(params.id);

  if (!article) return { title: "Article Not Found" };

  return {
    title: article.title,
    description: article.content?.slice(0, 150) || "Read the latest news article.",
    openGraph: {
      title: article.title,
      description: article.content?.slice(0, 150),
      url: article.link,
    },
  };
}

export default async function ArticlePage({ params }) {
  const article = await fetchArticle(params.id);

  if (!article) notFound();

  return (
    <main className=" bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4 space-y-6">
        <h1 className="text-3xl font-bold text-gray-900">{article.title}</h1>

        <div className="flex items-center space-x-4 text-sm text-gray-500">
          <span>{article.category?.name}</span>
          <span>•</span>
          <span>{new Date(article.pubDate).toLocaleDateString()}</span>
          <span>•</span>
          <span>{article.source}</span>
        </div>

        <div
          className="prose max-w-none text-gray-700"
          dangerouslySetInnerHTML={{ __html: article.content }}
        />

        {article.link && (
          <div className="pt-6">
            <a
              href={article.link}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center px-6 py-3 bg-red-600 hover:bg-red-700 text-white text-base font-medium rounded-xl shadow transition-colors duration-300"
            >
              Read Full Article
            </a>
          </div>
        )}
      </div>
    </main>
  );
}
