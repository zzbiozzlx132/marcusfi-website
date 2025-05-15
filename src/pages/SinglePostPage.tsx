// src/pages/SinglePostPage.tsx
import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import { useLanguage } from '../contexts/LanguageContext';
import ReactMarkdown from 'react-markdown'; // Đảm bảo đã cài đặt

// --- Interfaces (Giữ nguyên như phiên bản trước, chúng ta sẽ điều chỉnh dựa trên log mới nếu cần) ---
// ... (Toàn bộ phần định nghĩa interface từ MediaFormat đến Article giữ nguyên như code bạn gửi gần nhất)
interface MediaFormat { ext?: string; url: string; hash?: string; mime?: string; name?: string; path?: string | null; size?: number; width?: number; height?: number; sizeInBytes?: number; }
type FormatKey = 'large' | 'small' | 'medium' | 'thumbnail';
interface MediaAttributes { id?: number; name: string; alternativeText?: string | null; caption?: string | null; width?: number; height?: number; formats?: { [key in FormatKey]?: MediaFormat } | null; hash?: string; ext?: string; mime?: string; size?: number; url: string; previewUrl?: string | null; provider?: string; provider_metadata?: any | null; createdAt?: string; updatedAt?: string; publishedAt?: string; documentId?: string;}
interface PopulatedMedia { data?: { id: number; attributes: MediaAttributes; } | null; }
interface PopulatedMultipleMedia { data?: { id: number; attributes: MediaAttributes; }[] | null;}
interface AuthorAttributes { name: string; email?: string; createdAt: string; updatedAt: string; publishedAt: string; avatar?: PopulatedMedia; }
interface PopulatedAuthor { data?: { id: number; attributes: AuthorAttributes; } | null; }
interface CategoryAttributes { name: string; slug: string; description?: string | null; createdAt: string; updatedAt: string; publishedAt: string; }
interface PopulatedCategory { data?: { id: number; attributes: CategoryAttributes; } | null; }
interface RichTextBlock { __component: "shared.rich-text"; id: number; body: string; }
interface QuoteBlock { __component: "shared.quote"; id: number; title?: string; body: string; }
interface MediaBlockInDynamicZone { __component: "shared.media"; id: number; file?: PopulatedMedia; }
interface SliderBlock { __component: "shared.slider"; id: number; files?: PopulatedMultipleMedia; }
type BlockComponent = RichTextBlock | QuoteBlock | MediaBlockInDynamicZone | SliderBlock;
interface Article {
  id: number; documentId?: string; title: string; description: string; slug: string;
  createdAt: string; updatedAt: string; publishedAt: string;
  cover?: MediaAttributes | null;
  author?: PopulatedAuthor;
  category?: PopulatedCategory;
  blocks?: BlockComponent[];
}
// --- Kết thúc định nghĩa Interfaces ---


const STRAPI_API_BASE_URL = 'https://productive-birthday-b808dc4c19.strapiapp.com/api';
const ARTICLE_API_ID = 'articles';
type FormatKeyExtended = FormatKey | 'original';


const SinglePostPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const [article, setArticle] = useState<Article | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { language } = useLanguage();

  const pageText = {
    en: { backToBlog: "Back to Blog", publishedOn: "Published on", by: "By", articleNotFound: "Article not found." },
    vi: { backToBlog: "Quay lại Blog", publishedOn: "Đăng ngày", by: "Bởi", articleNotFound: "Không tìm thấy bài viết." }
  };
  const translatedText = pageText[language as keyof typeof pageText] || pageText.en;

  useEffect(() => {
    const fetchArticle = async () => {
      if (!slug) { setError("Article slug is missing."); setLoading(false); return; }
      setLoading(true); setError(null);
      console.log(`SinglePostPage: Fetching article with slug: ${slug}, lang: ${language}`);

      try {
        // ***** SỬ DỤNG populate=* ĐỂ DEBUG *****
        const populateParams = 'populate=*';

        const apiUrl = `${STRAPI_API_BASE_URL}/${ARTICLE_API_ID}?filters[slug][$eq]=${slug}&locale=${language}&${populateParams}`;
        console.log("SinglePostPage: Đang gọi API (với populate=*):", apiUrl);

        const response = await axios.get<{ data: Article[] }>(apiUrl);

        // Log TOÀN BỘ response.data dưới dạng chuỗi JSON để có thể copy và xem kỹ cấu trúc
        console.log("SinglePostPage: TOÀN BỘ response.data TỪ API (với populate=*):\n", JSON.stringify(response.data, null, 2));

        if (response.data?.data?.length > 0) {
          const fetchedArticle = response.data.data[0];
          console.log("SinglePostPage: Dữ liệu bài viết thô (fetchedArticle):", fetchedArticle);

          // Log chi tiết CẤU TRÚC THỰC TẾ của từng block và các trường media bên trong nó
          console.log("SinglePostPage:   --- BẮT ĐẦU LOG CHI TIẾT BLOCKS ---");
          fetchedArticle.blocks?.forEach((block, index) => {
            console.log(`SinglePostPage:     Block ${index + 1} (ID: ${block.id}, Component: ${block.__component}):`, JSON.stringify(block, null, 2));
            // Log cụ thể hơn cho media và slider để xem có 'data.attributes.url' không
            if (block.__component === "shared.media") {
                const mediaBlock = block as MediaBlockInDynamicZone;
                console.log(`SinglePostPage:       -> Chi tiết mediaBlock.file:`, JSON.stringify(mediaBlock.file, null, 2));
            }
            if (block.__component === "shared.slider") {
                const sliderBlock = block as SliderBlock;
                console.log(`SinglePostPage:       -> Chi tiết sliderBlock.files:`, JSON.stringify(sliderBlock.files, null, 2));
            }
          });
          console.log("SinglePostPage:   --- KẾT THÚC LOG CHI TIẾT BLOCKS ---");

          setArticle(fetchedArticle);
        } else {
          setError(translatedText.articleNotFound); setArticle(null);
        }
      } catch (err) {
        setError('Failed to fetch article. Check API URL and permissions. See console for details.');
        console.error("SinglePostPage: LỖI TRONG fetchArticle:", err);
        if (axios.isAxiosError(err) && err.response) {
            console.error("SinglePostPage: API Error Response Data:", err.response.data);
            console.error("SinglePostPage: API Error Response Status:", err.response.status);
        } else {
            console.error("SinglePostPage: Non-Axios error in fetchArticle", err);
        }
      } finally {
        setLoading(false);
      }
    };
    fetchArticle();
  }, [slug, language, translatedText.articleNotFound]);

  // Hàm getStrapiMediaURL giữ nguyên như phiên bản trước (đã sửa lỗi TypeScript)
  const getStrapiMediaURL = (
    mediaField: PopulatedMedia | MediaAttributes | undefined | null,
    formatKey?: FormatKeyExtended
  ): string | undefined => {
    if (!mediaField) return undefined;
    let attributes: MediaAttributes | undefined | null = null;
    if (typeof mediaField === 'object' && mediaField !== null && 'data' in mediaField && mediaField.data && typeof mediaField.data === 'object' && 'attributes' in mediaField.data) {
      attributes = mediaField.data.attributes;
    } else if (typeof mediaField === 'object' && mediaField !== null && 'url' in mediaField && typeof mediaField.url === 'string') {
      attributes = mediaField as MediaAttributes;
    }
    if (!attributes) return undefined;
    if (formatKey && formatKey !== 'original' && attributes.formats && attributes.formats[formatKey as FormatKey]?.url) {
        const key = formatKey as keyof NonNullable<typeof attributes.formats>;
        if (attributes.formats && attributes.formats[key]) { // Thêm kiểm tra attributes.formats[key] tồn tại
            return attributes.formats[key]?.url;
        }
    }
    return attributes.url;
  };

  // Hàm renderBlocks giữ nguyên như phiên bản trước
  const renderBlocks = (blocks: BlockComponent[] | undefined) => {
    if (!blocks) return <p className="text-gray-500">Content is not available.</p>;
    return blocks.map((block) => {
      // console.log("SinglePostPage: Rendering block:", block.__component, block); // Bớt log ở đây nếu đã nhiều
      switch (block.__component) {
        case "shared.rich-text":
          return ( <div key={`block-rt-${block.id}`} className="prose prose-slate lg:prose-lg max-w-none my-6 cms-content"> <ReactMarkdown>{(block as RichTextBlock).body}</ReactMarkdown> </div> );
        case "shared.quote":
          const quoteBlock = block as QuoteBlock;
          return ( <blockquote key={`block-qt-${quoteBlock.id}`} className="my-8 p-4 italic border-l-4 bg-gray-100 text-gray-700 border-[#6e00ff] rounded-r-lg"> <p className="mb-2 text-lg">"{quoteBlock.body}"</p> {quoteBlock.title && <footer className="text-sm text-gray-600">- {quoteBlock.title}</footer>} </blockquote> );
        case "shared.media": {
          const mediaBlock = block as MediaBlockInDynamicZone;
          // 'file' trong mediaBlock được kỳ vọng là PopulatedMedia (có data.attributes)
          const imageUrl = getStrapiMediaURL(mediaBlock.file, 'large');
          const imageAlt = mediaBlock.file?.data?.attributes?.alternativeText || 'Blog media content';
          console.log(`SinglePostPage: renderBlocks - shared.media (block ID ${mediaBlock.id}): imageUrl = ${imageUrl}`, "from mediaBlock.file:", mediaBlock.file);
          if (!imageUrl) return <div key={`block-md-${mediaBlock.id}`} className="my-6 text-sm text-gray-400 italic">(Media: Image not found for block ID {mediaBlock.id}. Check console log for 'mediaBlock.file' structure.)</div>;
          return ( <figure key={`block-md-${mediaBlock.id}`} className="my-8"> <img src={imageUrl} alt={imageAlt} className="w-full h-auto rounded-lg shadow-md object-contain max-h-[70vh]" loading="lazy"/> {mediaBlock.file?.data?.attributes?.caption && ( <figcaption className="text-center text-sm text-gray-500 mt-2 italic"> {mediaBlock.file.data.attributes.caption} </figcaption> )} </figure> );
        }
        case "shared.slider": {
          const sliderBlock = block as SliderBlock;
           if (!sliderBlock.files?.data || sliderBlock.files.data.length === 0) return <div key={`block-sl-${sliderBlock.id}`} className="my-6 text-sm text-gray-400 italic">(Slider: No images for block ID {sliderBlock.id}. Check console log for 'sliderBlock.files' structure.)</div>;
          return (
            <div key={`block-sl-${sliderBlock.id}`} className="my-8">
              <p className="text-center font-semibold mb-2">Image Slider:</p>
              <div className="flex overflow-x-auto space-x-4 p-2 bg-gray-100 rounded-lg snap-x snap-mandatory">
                {sliderBlock.files.data.map((filePopulated, idx) => { // filePopulated là {id, attributes}
                  const tempPopulatedMedia: PopulatedMedia = { data: filePopulated };
                  const sliderImageUrl = getStrapiMediaURL(tempPopulatedMedia, 'medium');
                  console.log(`SinglePostPage: renderBlocks - shared.slider image ${idx} (block ID ${sliderBlock.id}): sliderImageUrl = ${sliderImageUrl}`, "from filePopulated:", filePopulated);
                  if (!sliderImageUrl) return <div key={idx} className="text-xs text-gray-400 italic w-64 h-40 flex items-center justify-center bg-gray-200 rounded-md">(Image {idx+1} data issue)</div>;
                  return ( <div key={idx} className="snap-center flex-shrink-0 w-64 h-40"> <img src={sliderImageUrl} alt={filePopulated.attributes?.alternativeText || `Slider image ${idx + 1}`} className="w-full h-full rounded-md object-cover" loading="lazy" /> </div> );
                })}
              </div>
            </div>
          );
        }
        default:
          return <div key={`block-unknown-${Date.now()}-${block.id}`} className="my-4 p-2 bg-red-100 text-red-700 rounded">Unknown content block: {block.__component}</div>;
      }
    });
  };

  // ... (Phần return JSX chính của trang giữ nguyên) ...
  if (loading) return <div className="text-center py-20 text-2xl font-semibold text-gray-700">Loading article...</div>;
  if (error) return <div className="text-center py-20 text-red-600 font-medium">{error} <button onClick={() => window.location.reload()} className="ml-2 px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600">Thử lại</button></div>;
  if (!article) return <div className="text-center py-20 text-xl text-gray-500">{translatedText.articleNotFound}</div>;

  const coverImageUrl = getStrapiMediaURL(article.cover, 'large');
  const coverImageAlt = article.cover?.alternativeText || article.title || 'Cover image';

  return (
    <div className="bg-gray-50 py-8 sm:py-12">
      <div className="container mx-auto max-w-3xl px-4">
        <article className="bg-white p-6 sm:p-8 md:p-10 rounded-xl shadow-2xl">
          {/* ... (Header của bài viết giữ nguyên) ... */}
          <div className="mb-6 sm:mb-8"> <Link to="/blog" className="text-[#6e00ff] hover:text-[#8f00ff] text-sm font-medium inline-flex items-center group"> <svg className="w-4 h-4 mr-2 transform transition-transform duration-200 group-hover:-translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path></svg> {translatedText.backToBlog} </Link> </div>
          <header className="mb-8"> {article.category?.data?.attributes?.name && ( <Link to={`/category/${article.category.data.attributes.slug}`} className="text-sm font-semibold text-[#6e00ff] uppercase hover:underline"> {article.category.data.attributes.name} </Link> )} <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-gray-900 mt-2 mb-3 leading-tight">{article.title}</h1> <div className="flex flex-wrap items-center text-sm text-gray-500 space-x-1"> <span>{translatedText.publishedOn} {new Date(article.publishedAt).toLocaleDateString(language === 'vi' ? 'vi-VN' : 'en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</span> {article.author?.data?.attributes?.name && ( <> <span className="mx-1">&bull;</span> <span>{translatedText.by} <span className="font-semibold text-gray-700">{article.author.data.attributes.name}</span></span> </> )} </div> </header>
          {/* Ảnh bìa chính */}
          {coverImageUrl && ( <figure className="mb-8 rounded-lg overflow-hidden shadow-lg"> <img src={coverImageUrl} alt={coverImageAlt} className="w-full h-auto max-h-[70vh] object-contain" loading="lazy" /> {article.cover?.caption && ( <figcaption className="text-center text-xs text-gray-500 mt-2 italic"> {article.cover.caption} </figcaption> )} </figure> )}
          {/* Nội dung Blocks */}
          <div className="article-content-blocks">
            {article && renderBlocks(article.blocks)}
          </div>
        </article>
      </div>
    </div>
  );
};

export default SinglePostPage;