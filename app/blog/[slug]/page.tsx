import { notFound } from 'next/navigation';
import Link from 'next/link';
import Header from '@/components/common/Header';
import Footer from '@/components/common/Footer';

interface BlogPost {
  id: string;
  title: string;
  content: string;
  date: string;
  readTime: string;
  imageUrl: string;
  author: string;
  tags: string[];
}

interface RelatedPost {
  id: string;
  title: string;
  date: string;
  slug: string;
}

async function getBlogPost(slug: string): Promise<BlogPost | null> {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_SITE_URL || ''}/api/blog/slug/${slug}`, {
      cache: 'no-cache',
    });
    
    if (!res.ok) {
      return null;
    }
    
    const { data } = await res.json();
    return data;
  } catch (error) {
    console.error('Error fetching blog post:', error);
    return null;
  }
}

async function getRelatedPosts(currentSlug: string): Promise<RelatedPost[]> {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_SITE_URL || ''}/api/blog?limit=3`, {
      cache: 'no-cache',
    });
    
    if (!res.ok) {
      return [];
    }
    
    const { data } = await res.json();
    
    // Filter out the current post and return up to 3 related posts
    return data
      .filter((post: any) => post.slug !== currentSlug)
      .slice(0, 3)
      .map((post: any) => ({
        id: post.id,
        title: post.title,
        date: post.created_at || post.date,
        slug: post.slug,
      }));
  } catch (error) {
    console.error('Error fetching related posts:', error);
    return [];
  }
}

export default async function BlogPostPage({ params }: { params: { slug: string } }) {
  const post = await getBlogPost(params.slug);
  
  if (!post) {
    notFound();
  }
  
  const relatedPosts = await getRelatedPosts(params.slug);

  return (
    <div className="min-h-screen bg-white">
      <Header />
      
      <main className="container mx-auto px-4 py-8 max-w-4xl">
        <article>
          <header className="mb-8">
            <div className="flex items-center text-sm text-gray-500 mb-4">
              <time>{post.date}</time>
              <span className="mx-2">•</span>
              <span>{post.readTime}</span>
              <span className="mx-2">•</span>
              <span>By {post.author}</span>
            </div>
            <h1 className="text-4xl font-bold text-gray-900 mb-4">{post.title}</h1>
            
            <div className="flex flex-wrap gap-2 mt-4">
              {post.tags.map((tag) => (
                <span 
                  key={tag} 
                  className="px-3 py-1 bg-blue-100 text-blue-800 text-sm rounded-full"
                >
                  {tag}
                </span>
              ))}
            </div>
          </header>
          
          <div className="rounded-lg mb-8 overflow-hidden">
            <img
              src={post.imageUrl || '/images/default-blog.jpg'}
              alt={post.title}
              className="w-full h-96 object-cover"
            />
          </div>
          
          <div 
            className="prose prose-lg max-w-none"
            dangerouslySetInnerHTML={{ __html: post.content }}
          />
        </article>
        
        <section className="mt-16">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Related Posts</h2>
          <div className="space-y-4">
            {relatedPosts.map((relatedPost) => (
              <div 
                key={relatedPost.id} 
                className="border-b border-gray-200 pb-4 last:border-0 last:pb-0"
              >
                <h3 className="text-lg font-semibold">
                  <Link href={`/blog/${relatedPost.slug}`} className="text-blue-600 hover:underline">
                    {relatedPost.title}
                  </Link>
                </h3>
                <p className="text-sm text-gray-500">{relatedPost.date}</p>
              </div>
            ))}
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}