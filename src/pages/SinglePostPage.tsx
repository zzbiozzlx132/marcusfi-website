// src/pages/SinglePostPage.tsx
import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import { useLanguage } from '../contexts/LanguageContext';
import qs from 'qs';
import ReactMarkdown from 'react-markdown';
import { CalendarDays, User } from 'lucide-react';

// --- Interfaces (Giữ nguyên như phiên bản đã hoạt động trước đó) ---
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

interface MediaAttributes {
  id: number;
  documentId?: string;
  name: string;
  alternativeText?: string | null;
  caption?: string | null;
  width?: number;
  height?: number;
  formats?: { [key in FormatKey]?: MediaFormat } | null;
  hash?: string;
  ext?: string;
  mime?: string;
  size?: number;
  url: string;
  previewUrl?: string | null;
  provider?: string;
  provider_metadata?: any | null;
  createdAt?: string;
  updatedAt?: string;
  publishedAt?: string;
}

interface AuthorAttributes {
  id: number;
  documentId?: string;
  name: string;
  email?: string;
  createdAt: string;
  updatedAt: string;
  publishedAt: string;
  avatar?: MediaAttributes | null;
}

interface CategoryAttributes {
  id: number;
  documentId?: string;
  name: string;
  slug: string;
  description?: string | null;
  createdAt: string;
  updatedAt: string;
  publishedAt: string;
}

interface RichTextBlock {
  __component: "shared.rich-text";
  id: number;
  body: string;
}
interface QuoteBlock {
  __component: "shared.quote";
  id: number;
  title?: string;
  body: string;
}
interface MediaBlockInDynamicZone {
  __component: "shared.media";
  id: number;
  file?: MediaAttributes | null;
}
interface SliderBlock {
  __component: "shared.slider";
  id: number;
  files?: (MediaAttributes & { id: number })[];
}
type BlockComponent = RichTextBlock | QuoteBlock | MediaBlockInDynamicZone | SliderBlock;

interface Article {
  id: number;
  documentId?: string;
  title: string;
  description: string;
  slug: string;
  createdAt: string;
  updatedAt: string;
  publishedAt: string;
  cover?: MediaAttributes | null;
  author?: AuthorAttributes | null;
  category?: CategoryAttributes | null;
  blocks?: BlockComponent[];
}

const STRAPI_API_BASE_URL = 'https://productive-birthday-b808dc4c19.strapiapp.com/api';
const STRAPI_DOMAIN = 'https://productive-birthday-b808dc4c19.strapiapp.com';
const ARTICLE_API_ID = 'articles';

// Tailwind CSS classes cho các thành phần Markdown (KHÔNG DÙNG PROSE)
const markdownComponentsConfig = {
  h1: ({node, ...props}: any) => <h1 className="text-3xl sm:text-4xl font-bold mt-8 mb-5 text-gray-900 leading-tight" {...props} />,
  h2: ({node, ...props}: any) => <h2 className="text-2xl sm:text-3xl font-semibold mt-7 mb-4 text-gray-800" {...props} />,
  h3: ({node, ...props}: any) => <h3 className="text-xl sm:text-2xl font-semibold mt-6 mb-3 text-gray-800" {...props} />,
  h4: ({node, ...props}: any) => <h4 className="text-lg sm:text-xl font-semibold mt-5 mb-2 text-gray-700" {...props} />,
  p: ({node, ...props}: any) => <p className="mb-6 leading-relaxed text-gray-700 text-base sm:text-lg" {...props} />,
  a: ({node, ...props}: any) => <a className="text-[#6e00ff] hover:text-[#ff007a] underline hover:no-underline transition-colors duration-200 font-medium" {...props} />,
  ul: ({node, ...props}: any) => <ul className="list-disc list-outside mb-6 pl-6 space-y-2 text-gray-700" {...props} />,
  ol: ({node, ...props}: any) => <ol className="list-decimal list-outside mb-6 pl-6 space-y-2 text-gray-700" {...props} />,
  li: ({node, ...props}: any) => <li className="mb-1 leading-relaxed" {...props} />,
  blockquote: ({node, ...props}: any) => <blockquote className="border-l-4 border-[#6e00ff] pl-5 py-3 my-8 bg-gray-100/70 italic text-gray-600 text-lg rounded-r-md" {...props} />,
  code: ({node, inline, className, children, ...props}: any) => {
    const match = /language-(\w+)/.exec(className || '')
    return !inline && match ? (
      <pre className={`block bg-gray-800 text-white p-4 rounded-lg my-6 overflow-x-auto text-sm shadow-md ${className || ''}`} {...props}>
        <code>{children}</code>
      </pre>
    ) : (
      <code className={`px-1.5 py-0.5 bg-gray-200 text-[#6e00ff] rounded text-sm font-mono ${className || ''}`} {...props}>
        {children}
      </code>
    )
  },
  img: ({node, ...props}: any) => <img className="max-w-full h-auto my-6 rounded-lg shadow-lg mx-auto" {...props} />,
  hr: ({node, ...props}: any) => <hr className="my-8 border-gray-200" {...props} />,
  table: ({node, ...props}: any) => <div className="overflow-x-auto my-6"><table className="min-w-full border-collapse border border-gray-300 text-sm" {...props} /></div>,
  thead: ({node, ...props}: any) => <thead className="bg-gray-100" {...props} />,
  th: ({node, ...props}: any) => <th className="border border-gray-300 px-3 py-2 text-left font-semibold text-gray-700" {...props} />,
  td: ({node, ...props}: any) => <td className="border border-gray-300 px-3 py-2 text-gray-700" {...props} />,
};

const SinglePostPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const [article, setArticle] = useState<Article | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { language } = useLanguage();

  const pageText = {
    en: { backToBlog: "Back to Blog", publishedOn: "Published on", by: "By", articleNotFound: "Article not found.", category: "Category", relatedArticles: "Related Articles" },
    vi: { backToBlog: "Quay lại Blog", publishedOn: "Đăng ngày", by: "Bởi", articleNotFound: "Không tìm thấy bài viết.", category: "Danh mục", relatedArticles: "Bài viết liên quan" }
  };
  const translatedText = pageText[language as keyof typeof pageText] || pageText.en;

  const getStrapiMediaURL = (mediaObject?: MediaAttributes | null, format?: FormatKey): string | null => {
    if (!mediaObject?.url) return null;
    let url = mediaObject.url;
    if (format && mediaObject.formats?.[format]?.url) {
      url = mediaObject.formats[format]!.url;
    }
    if (url.startsWith('/')) return `${STRAPI_DOMAIN}${url}`;
    return url;
  };

  useEffect(() => {
    const fetchArticle = async () => {
      if (!slug) {
        setError("Article slug is missing.");
        setLoading(false);
        return;
      }
      setLoading(true); setError(null);
      try {
        const populateQuery = qs.stringify({
          populate: {
            cover: { populate: '*' },
            author: { populate: { avatar: { populate: '*' } } },
            category: true,
            blocks: {
              on: {
                'shared.media': { populate: ['file'] },
                'shared.slider': { populate: ['files'] },
                'shared.quote': true,
                'shared.rich-text': true
              }
            }
          },
          filters: { slug: { $eq: slug } },
          locale: language
        }, { encodeValuesOnly: true });

        const apiUrl = `${STRAPI_API_BASE_URL}/${ARTICLE_API_ID}?${populateQuery}`;
        const response = await axios.get<{ data: Article[] }>(apiUrl);

        if (response.data?.data?.length > 0) {
          setArticle(response.data.data[0]);
        } else {
          setError(translatedText.articleNotFound);
          setArticle(null);
        }
      } catch (err) {
        setError('Failed to fetch article.');
        console.error("SinglePostPage: ERROR in fetchArticle:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchArticle();
  }, [slug, language, translatedText.articleNotFound]);

  const renderBlock = (block: BlockComponent) => {
    switch (block.__component) {
      case 'shared.rich-text':
        return (
          <div key={`block-${block.id}-${block.__component}`} className="richtext-content-manual">
            <ReactMarkdown components={markdownComponentsConfig}>{block.body}</ReactMarkdown>
          </div>
        );
      case 'shared.quote':
        return (
          <div key={`block-${block.id}-${block.__component}`} className="my-8">
            <ReactMarkdown components={markdownComponentsConfig}>{`> ${block.title ? `**${block.title}**\n> ` : ''}${block.body}`}</ReactMarkdown>
          </div>
        );
      case 'shared.media':
        const mediaFileAttributes = block.file;
        const imageUrl = getStrapiMediaURL(mediaFileAttributes, 'large');
        if (imageUrl && mediaFileAttributes) {
          return (
            <figure key={`block-${block.id}-${block.__component}`} className="my-8 text-center">
              <img
                src={imageUrl}
                alt={mediaFileAttributes.alternativeText || mediaFileAttributes.name || 'Article media'}
                className="max-w-full h-auto mx-auto rounded-lg shadow-xl transition-transform duration-300 hover:scale-105"
              />
              {mediaFileAttributes.caption && (
                <figcaption className="mt-3 text-sm text-gray-600 italic">{mediaFileAttributes.caption}</figcaption>
              )}
            </figure>
          );
        }
        return null;
      case 'shared.slider':
        if (block.files && block.files.length > 0) {
          return (
            <div key={`block-${block.id}-${block.__component}`} className="my-8">
              <div className="flex overflow-x-auto space-x-4 p-4 bg-gray-100/70 rounded-lg shadow-inner">
                {block.files.map(fileAttribute => {
                  const slideImageUrl = getStrapiMediaURL(fileAttribute, 'medium');
                  if (slideImageUrl) {
                    return (
                      <figure key={`slide-${fileAttribute.id}`} className="flex-shrink-0 w-full sm:w-[48%] md:w-[31%] lg:w-[23%] snap-center">
                        <img
                          src={slideImageUrl}
                          alt={fileAttribute.alternativeText || fileAttribute.name || 'Slider image'}
                          className="w-full h-48 object-cover rounded-md shadow-lg"
                        />
                        {fileAttribute.caption && (
                          <figcaption className="mt-2 text-xs text-center text-gray-600">{fileAttribute.caption}</figcaption>
                        )}
                      </figure>
                    );
                  }
                  return null;
                })}
              </div>
            </div>
          );
        }
        return null;
      default:
        const exhaustiveCheck: never = block;
        console.warn("Unhandled block component:", exhaustiveCheck);
        return <p key={`block-unknown-${(block as any).id}`}>Unknown block type</p>;
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen font-sans"> {/* Nền sẽ là mặc định (trắng) */}
        <div className="text-xl font-medium text-[#6e00ff] animate-pulse">Loading article...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col justify-center items-center min-h-screen p-4 text-center font-sans"> {/* Nền sẽ là mặc định (trắng), có thể thêm bg-red-50 nếu muốn nền đỏ nhạt */}
        <h2 className="text-3xl font-semibold text-red-700 mb-3">Oops! Something went wrong.</h2>
        <p className="text-red-600 mb-8 text-lg">{error}</p>
        <Link
          to="/blog"
          className="px-8 py-3 bg-gradient-to-r from-[#6e00ff] to-[#ff007a] text-white font-semibold rounded-lg shadow-md hover:shadow-xl transition-all duration-300 transform hover:scale-105 text-base"
        >
          {translatedText.backToBlog}
        </Link>
      </div>
    );
  }

  if (!article) {
    return (
      <div className="flex flex-col justify-center items-center min-h-screen p-4 text-center font-sans"> {/* Nền sẽ là mặc định (trắng) */}
        <h2 className="text-3xl font-semibold text-gray-700 mb-3">{translatedText.articleNotFound}</h2>
        <p className="text-gray-500 mb-8 text-lg">The article you are looking for does not exist or may have been moved.</p>
        <Link
          to="/blog"
          className="px-8 py-3 bg-gradient-to-r from-[#6e00ff] to-[#ff007a] text-white font-semibold rounded-lg shadow-md hover:shadow-xl transition-all duration-300 transform hover:scale-105 text-base"
        >
          {translatedText.backToBlog}
        </Link>
      </div>
    );
  }

  const coverImageUrl = getStrapiMediaURL(article.cover, 'large');
  const authorName = article.author?.name;
  const authorAvatarUrl = getStrapiMediaURL(article.author?.avatar, 'thumbnail');
  const categoryName = article.category?.name;
  const categorySlug = article.category?.slug;

  return (
    // XÓA bg-gray-50 ở đây để nền là mặc định (thường là trắng)
    <div className="pt-28 sm:pt-32 pb-16 min-h-screen font-sans antialiased">
      <div className="max-w-3xl lg:max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <Link
            to="/blog"
            className="inline-flex items-center text-sm font-medium text-gray-600 hover:text-[#6e00ff] transition-colors group"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="mr-2 transform group-hover:-translate-x-1 transition-transform duration-200"><path d="m12 19-7-7 7-7"/><path d="M19 12H5"/></svg>
            {translatedText.backToBlog}
          </Link>
        </div>

        {/* Khối article vẫn giữ nền trắng để nổi bật */}
        <article className="bg-white p-6 sm:p-8 lg:p-12 rounded-xl shadow-2xl ring-1 ring-gray-900/5">
          <header className="mb-8 lg:mb-10">
            {categoryName && categorySlug && (
              <Link
                to={`/category/${categorySlug}`}
                className="inline-block mb-4 text-xs sm:text-sm font-bold uppercase tracking-wider bg-gradient-to-r from-[#6e00ff]/10 to-[#ff007a]/10 text-transparent bg-clip-text px-3.5 py-1.5 rounded-full hover:shadow-lg hover:from-[#6e00ff]/20 hover:to-[#ff007a]/20 transition-all duration-300"
              >
                 <span className='bg-gradient-to-r from-[#6e00ff] to-[#ff007a] text-transparent bg-clip-text'>{categoryName}</span>
              </Link>
            )}

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-gray-900 mb-5 leading-tight">
              {article.title}
            </h1>

            {article.description && (
              <p className="text-lg sm:text-xl text-gray-600 mb-8 leading-relaxed">
                {article.description}
              </p>
            )}

            <div className="flex flex-wrap items-center text-sm text-gray-500 gap-y-3 gap-x-5 border-t border-b border-gray-200 py-4">
              {article.author && (
                <div className="flex items-center">
                  {authorAvatarUrl ? (
                    <img src={authorAvatarUrl} alt={authorName || 'Author'} className="w-10 h-10 rounded-full mr-3 object-cover shadow-sm" />
                  ) : (
                    <User className="w-6 h-6 mr-2 text-gray-400" />
                  )}
                  <div className='flex flex-col'>
                    <span className="font-semibold text-gray-800">{authorName || 'Unknown Author'}</span>
                    <span className="text-xs text-gray-500">{/* {translatedText.by.toLowerCase()} an author - Có thể bỏ nếu không cần */}</span>
                  </div>
                </div>
              )}
              {article.publishedAt && (
                <div className="flex items-center">
                  <CalendarDays className="w-5 h-5 mr-2 text-gray-400" />
                  <span className='font-medium text-gray-700'>
                    {new Date(article.publishedAt).toLocaleDateString(language === 'vi' ? 'vi-VN' : 'en-US', {
                      year: 'numeric', month: 'long', day: 'numeric'
                    })}
                  </span>
                </div>
              )}
            </div>
          </header>

          {coverImageUrl && article.cover && (
            <figure className="mb-8 lg:mb-12 rounded-xl overflow-hidden shadow-2xl">
              <img
                src={coverImageUrl}
                alt={article.cover.alternativeText || article.title || 'Article cover'}
                className="w-full h-auto object-cover"
              />
              {article.cover.caption && (
                <figcaption className="p-4 text-sm text-center text-gray-600 bg-gray-50 border-t border-gray-200 italic">
                  {article.cover.caption}
                </figcaption>
              )}
            </figure>
          )}

          <div className="article-body-content text-gray-800">
            {article.blocks && article.blocks.length > 0 ? (
              article.blocks.map(block => renderBlock(block))
            ) : (
              <p className="text-gray-600 py-10 text-center text-lg">This article has no content blocks currently.</p>
            )}
          </div>
        </article>
      </div>
    </div>
  );
};

export default SinglePostPage;