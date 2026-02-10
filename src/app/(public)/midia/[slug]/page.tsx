import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import Section from '@/components/Section';
import Card from '@/components/Card';
import Tag from '@/components/Tag';
import AnimatedSection from '@/components/AnimatedSection';
import { getMediaPostBySlug, getMediaPosts } from '@/lib/data';
import { formatDate } from '@/lib/utils';

interface MediaPostPageProps {
  params: {
    slug: string;
  };
}

export async function generateMetadata({ params }: MediaPostPageProps): Promise<Metadata> {
  const post = await getMediaPostBySlug(params.slug);

  if (!post) {
    return {};
  }

  return {
    title: post.title,
    description: post.excerpt,
  };
}

export default async function MediaPostPage({ params }: MediaPostPageProps) {
  const post = await getMediaPostBySlug(params.slug);

  if (!post) {
    notFound();
  }

  const allPosts = await getMediaPosts();
  const relatedPosts = allPosts
    .filter((p) => p.slug !== post.slug && p.tags.some(tag => post.tags.includes(tag)))
    .slice(0, 3);

  return (
    <>
      {/* Hero */}
      <section className="relative pt-32 pb-20 md:pt-40 md:pb-28">
        <div className="absolute inset-0">
          {post.imageUrl ? (
            <Image
              src={post.imageUrl}
              alt={post.title}
              fill
              className="object-cover brightness-[0.3]"
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-primary via-primary-light to-primary" />
          )}
        </div>

        <div className="relative max-w-4xl mx-auto px-6">
          <AnimatedSection>
            <div className="flex items-center gap-3 mb-6">
              <Tag variant="accent">{post.category}</Tag>
              <span className="text-neutral-200">{post.readTime}</span>
            </div>
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              {post.title}
            </h1>
            <div className="flex items-center gap-4 text-neutral-200">
              <span>{post.author}</span>
              <span>•</span>
              <span>{formatDate(post.date)}</span>
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* Content */}
      <Section>
        <div className="max-w-4xl mx-auto">
          <AnimatedSection>
            <div
              className="prose prose-lg prose-invert max-w-none"
              dangerouslySetInnerHTML={{ __html: post.content }}
            />
          </AnimatedSection>

          <AnimatedSection delay={0.2}>
            <div className="mt-12 pt-8 border-t border-neutral-500/20">
              <div className="flex flex-wrap gap-2">
                {post.tags.map((tag) => (
                  <Tag key={tag}>{tag}</Tag>
                ))}
              </div>
            </div>
          </AnimatedSection>
        </div>
      </Section>

      {/* Related Posts */}
      {relatedPosts.length > 0 && (
        <Section background="dark">
          <AnimatedSection>
            <h2 className="text-4xl md:text-5xl font-bold mb-12">
              Leia também
            </h2>
          </AnimatedSection>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {relatedPosts.map((relatedPost, index) => (
              <AnimatedSection key={relatedPost.slug} delay={index * 0.1}>
                <Link href={`/midia/${relatedPost.slug}`}>
                  <Card padding="none" className="overflow-hidden h-full">
                    <div className="relative h-48 w-full">
                      {relatedPost.imageUrl ? (
                        <Image
                          src={relatedPost.imageUrl}
                          alt={relatedPost.title}
                          fill
                          className="object-cover"
                        />
                      ) : (
                        <div className="w-full h-full bg-primary-light" />
                      )}
                    </div>
                    <div className="p-6">
                      <Tag variant="accent" className="mb-3">
                        {relatedPost.category}
                      </Tag>
                      <h3 className="text-xl font-semibold mb-2 line-clamp-2">
                        {relatedPost.title}
                      </h3>
                      <p className="text-sm text-neutral-400">
                        {relatedPost.readTime}
                      </p>
                    </div>
                  </Card>
                </Link>
              </AnimatedSection>
            ))}
          </div>
        </Section>
      )}
    </>
  );
}
