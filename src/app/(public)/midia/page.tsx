import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import Section from '@/components/Section';
import Card from '@/components/Card';
import Tag from '@/components/Tag';
import AnimatedSection from '@/components/AnimatedSection';
import { getMediaPosts } from '@/lib/data';

export const metadata: Metadata = {
  title: 'Na Mídia',
  description: 'Artigos, insights e publicações do time LEX sobre direito, tecnologia e inovação.',
};

export const dynamic = 'force-dynamic';

export default async function MidiaPage() {
  const media = await getMediaPosts();

  return (
    <>
      {/* Hero */}
      <section className="relative pt-32 pb-20 md:pt-40 md:pb-28 bg-gradient-to-br from-primary via-primary-light to-primary">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNDOUEyMjciIGZpbGwtb3BhY2l0eT0iMC4wMyI+PHBhdGggZD0iTTM2IDM0djItaDJWMzRoLTJ6bTAgNHYyaDJ2LTJoLTJ6bS0yIDJ2Mmgydi0yaC0yem0wLTR2Mmgydi0yaC0yem0tMiAydjJoMnYtMmgtMnptMC00djJoMnYtMmgtMnptLTIgMnYyaDJ2LTJoLTJ6Ii8+PC9nPjwvZz48L3N2Zz4=')] opacity-40"></div>

        <div className="relative max-w-4xl mx-auto px-6 text-center">
          <AnimatedSection>
            <h1 className="text-5xl md:text-7xl font-bold mb-6">
              Na <span className="text-accent">Mídia</span>
            </h1>
          </AnimatedSection>
          <AnimatedSection delay={0.2}>
            <p className="text-xl md:text-2xl text-neutral-200">
              Artigos, insights e análises sobre direito, tecnologia e inovação
            </p>
          </AnimatedSection>
        </div>
      </section>

      {/* Posts Grid */}
      <Section>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {media.map((post, index) => (
            <AnimatedSection key={post.slug} delay={index * 0.05}>
              <Link href={`/midia/${post.slug}`}>
                <Card padding="none" className="overflow-hidden h-full flex flex-col">
                  <div className="relative h-56 w-full">
                    {post.imageUrl ? (
                      <Image
                        src={post.imageUrl}
                        alt={post.title}
                        fill
                        className="object-cover"
                      />
                    ) : (
                      <div className="w-full h-full bg-primary-light" />
                    )}
                  </div>
                  <div className="p-6 flex-1 flex flex-col">
                    <div className="flex items-center gap-2 mb-3">
                      <Tag variant="accent">{post.category}</Tag>
                      <span className="text-sm text-neutral-400">{post.readTime}</span>
                    </div>
                    <h3 className="text-xl font-semibold mb-3 line-clamp-2">
                      {post.title}
                    </h3>
                    <p className="text-neutral-300 mb-4 line-clamp-3 flex-1">
                      {post.excerpt}
                    </p>
                    <div className="flex items-center justify-between text-sm text-neutral-400 pt-4 border-t border-neutral-500/20">
                      <span>{post.author}</span>
                      <span>{new Date(post.date).toLocaleDateString('pt-BR')}</span>
                    </div>
                  </div>
                </Card>
              </Link>
            </AnimatedSection>
          ))}
        </div>
      </Section>
    </>
  );
}
