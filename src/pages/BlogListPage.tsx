// src/pages/BlogListPage.tsx
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { useLanguage } from '../contexts/LanguageContext';

// --- Định nghĩa Interfaces (Giữ nguyên như bạn đã cung cấp) ---
interface MediaFormat {
  ext?: string;
  url: string;
  hash?: string;
  mime?: string;
  name?: string;
  path?: string | null;
  size?: number;
  width?: number;
  height?: number;
  sizeInBytes?: number;
}
type FormatKey = 'large' | 'small' | 'medium' | 'thumbnail';
interface DirectMediaAttributes {
  id: number;
  documentId?: string;
  name: string;
  alternativeText?: string | null;
  caption?: string | null;
  width?: number;
  height?: number;
  formats?: {
    large?: MediaFormat;
    small?: MediaFormat;
    medium?: MediaFormat;
    thumbnail?: MediaFormat;
  } | null;
  hash: string;
  ext: string;
  mime: string;
  size: number;
  url: string;
  previewUrl?: string | null;
  provider: string;
  provider_metadata?: any | null;
  createdAt: string;
  updatedAt: string;
  publishedAt?: string;
}
interface NestedPopulatedMediaAttributes extends DirectMediaAttributes {}
interface PopulatedMedia {
  data?: { id: number; attributes: NestedPopulatedMediaAttributes; } | null;
}
interface AuthorAttributes {
  name: string; email?: string; createdAt: string; updatedAt: string; publishedAt: string;
  avatar?: PopulatedMedia;
}
interface PopulatedAuthor {
  data?: { id: number; attributes: AuthorAttributes; } | null;
}
interface CategoryAttributes {
  name: string; slug: string; description?: string | null;
  createdAt: string; updatedAt: string; publishedAt: string;
}
interface PopulatedCategory {
  data?: { id: number; attributes: CategoryAttributes; } | null;
}
interface RichTextBlock { __component: "shared.rich-text"; id: number; body: string; }
interface QuoteBlock { __component: "shared.quote"; id: number; title?: string; body: string; }
interface MediaBlockInDynamicZone { __component: "shared.media"; id: number; /* file?: PopulatedMedia; */ }
interface SliderBlock { __component: "shared.slider"; id: number; /* files?: PopulatedMedia[]; */ }
type BlockComponent = RichTextBlock | QuoteBlock | MediaBlockInDynamicZone | SliderBlock;
interface Article {
  id: number; documentId?: string; title: string; description: string; slug: string;
  createdAt: string; updatedAt: string; publishedAt: string;
  cover?: DirectMediaAttributes | null;
  author?: PopulatedAuthor;
  category?: PopulatedCategory;
  blocks?: BlockComponent[];
}
// --- Kết thúc định nghĩa Interfaces ---

const STRAPI_API_BASE_URL = 'https://productive-birthday-b808dc4c19.strapiapp.com/api';
const ARTICLE_API_ID = 'articles';

const BlogListPage: React.FC = () => {
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { language } = useLanguage();

  const pageContent = {
    en: { title: "Our Blog", subtitle: "Latest news and insightful articles", readMore: "Read More", noArticles: "No articles found." },
    vi: { title: "Bài Viết", subtitle: "Tin tức và các bài viết chuyên sâu mới nhất", readMore: "Đọc thêm", noArticles: "Không tìm thấy bài viết." }
  }
  const t = pageContent[language as keyof typeof pageContent] || pageContent.en;

  useEffect(() => {
    const fetchArticles = async () => {
      setLoading(true); setError(null);
      try {
        const populateParams = 'populate=*';
        const apiUrl = `${STRAPI_API_BASE_URL}/${ARTICLE_API_ID}?sort=publishedAt:desc&locale=${language}&${populateParams}`;
        const response = await axios.get<{ data: Article[] }>(apiUrl);

        if (response.data && Array.isArray(response.data.data)) {
          setArticles(response.data.data);
        } else {
          setArticles([]); setError("Invalid data structure.");
        }
      } catch (err) {
        setError('Failed to fetch articles.'); console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchArticles();
  }, [language]);

  if (loading) return <div className="text-center py-20">Loading posts...</div>;
  if (error) return <div className="text-center py-20 text-red-600">{error}</div>;
  
  const getStrapiMediaURL = (
    mediaAttributes: DirectMediaAttributes | undefined | null,
    formatKey?: FormatKey
  ): string | undefined => {
    if (!mediaAttributes) {
      return undefined;
    }
    if (formatKey && mediaAttributes.formats && mediaAttributes.formats[formatKey]?.url) {
      return mediaAttributes.formats[formatKey]?.url;
    }
    return mediaAttributes.url;
  };

  if (articles.length === 0 && !loading) {
    return (
      <>
        {/* << THAY ĐỔI: Xóa class bg-gray-50 >> */}
        <section className="py-12 sm:py-16 lg:py-20">
          <div className="px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
            <div className="text-center mb-12 sm:mb-16">
              <h2 className="text-3xl font-bold leading-tight text-gray-900 sm:text-4xl xl:text-5xl">{t.title}</h2>
              <p className="mt-4 text-base leading-7 text-gray-600 sm:mt-8 max-w-2xl mx-auto">{t.subtitle}</p>
            </div>
            <p className="text-center text-gray-500 mt-12 text-lg">{t.noArticles}</p>
          </div>
        </section>
      </>
    );
  }

  return (
    <>
      {/* << THAY ĐỔI: Xóa class bg-gray-50 >> */}
      <section className="py-12 sm:py-16 lg:py-20">
        <div className="px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
          <div className="text-center mb-12 sm:mb-16">
            <h2 className="text-3xl font-bold leading-tight text-gray-900 sm:text-4xl xl:text-5xl">{t.title}</h2>
            <p className="mt-4 text-base leading-7 text-gray-600 sm:mt-8 max-w-2xl mx-auto">{t.subtitle}</p>
          </div>

          <div className="grid grid-cols-1 gap-8 sm:gap-10 md:grid-cols-2 lg:grid-cols-3">
            {articles.map((article) => {
              const imageUrl = getStrapiMediaURL(article.cover, 'medium');
              const imageAlt = article.cover?.alternativeText || article.title || 'Blog post image';

              return (
                <div key={article.id} className="flex flex-col overflow-hidden bg-white rounded-xl shadow-lg transition-all duration-300 ease-in-out hover:shadow-2xl hover:-translate-y-1.5">
                  <Link to={`/blog/${article.slug}`} className="block group">
                    <div className="h-56 w-full overflow-hidden bg-gray-100">
                      {imageUrl ? (
                        <img
                          className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-300"
                          src={imageUrl}
                          alt={imageAlt}
                          loading="lazy"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-gray-400 text-sm">
                          No Image
                        </div>
                      )}
                    </div>
                  </Link>
                  <div className="flex flex-col justify-between flex-1 p-5 sm:p-6">
                    <div className="flex-1">
                      {article.category?.data?.attributes?.name && (
                        <p className="text-xs font-semibold tracking-wider text-[#6e00ff] uppercase mb-2">
                          <Link
                            to={`/category/${article.category.data.attributes.slug}`}
                            className="hover:underline"
                          >
                            {article.category.data.attributes.name}
                          </Link>
                        </p>
                      )}
                      <h3 className="mt-1 text-lg sm:text-xl font-semibold leading-tight text-gray-900">
                        <Link to={`/blog/${article.slug}`} className="hover:text-[#8f00ff] transition-colors">
                          {article.title}
                        </Link>
                      </h3>
                      {article.description && (
                        <p className="mt-3 text-sm text-gray-600 line-clamp-3">{article.description}</p>
                      )}
                    </div>
                    <div className="mt-6 flex items-center justify-between">
                      <Link
                        to={`/blog/${article.slug}`}
                        className="inline-flex items-center text-sm font-medium text-[#6e00ff] hover:text-[#8f00ff] transition-colors"
                      >
                        {t.readMore}
                        <svg className="w-4 h-4 ml-1.5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                        </svg>
                      </Link>
                    </div>
                     <p className="text-gray-400 text-xs mt-3 pt-3 border-t border-gray-100">
                        {new Date(article.publishedAt).toLocaleDateString(language === 'vi' ? 'vi-VN' : 'en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
                      </p>
                      {article.author?.data?.attributes?.name && (
                        <p className="text-xs text-gray-500 mt-2">
                          By: {article.author.data.attributes.name}
                        </p>
                      )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>
    </>
  );
};

export default BlogListPage;