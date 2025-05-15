import React from 'react';
import { Newspaper } from 'lucide-react';

const BlogPreview = () => {
  const blogPosts = [
    {
      title: "Latest Industry Insights",
      description: "Stay up to date with the latest trends and developments in our industry.",
      date: "March 15, 2024"
    },
    {
      title: "Best Practices Guide",
      description: "Learn about the proven strategies that drive success in modern business.",
      date: "March 10, 2024"
    },
    {
      title: "Innovation Spotlight",
      description: "Discover how new technologies are reshaping the business landscape.",
      date: "March 5, 2024"
    }
  ];

  return (
    <section className="py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <Newspaper className="w-12 h-12 text-blue-600 mx-auto mb-4" />
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Latest from Our Blog</h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Stay informed with our latest articles, insights, and industry updates
          </p>
        </div>
        
        <div className="grid md:grid-cols-3 gap-8">
          {blogPosts.map((post, index) => (
            <article 
              key={index}
              className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300"
            >
              <div className="p-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  {post.title}
                </h3>
                <p className="text-gray-600 mb-4">
                  {post.description}
                </p>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-500">{post.date}</span>
                  <button className="text-blue-600 hover:text-blue-700 font-medium">
                    Read More →
                  </button>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
};

export default BlogPreview;