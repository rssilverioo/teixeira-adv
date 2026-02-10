import type { Metadata } from 'next';
import Image from 'next/image';
import Section from '@/components/Section';
import Card from '@/components/Card';
import Tag from '@/components/Tag';
import CTAButton from '@/components/CTAButton';
import AnimatedSection from '@/components/AnimatedSection';
import { getPodcasts } from '@/lib/data';

export const metadata: Metadata = {
  title: 'Podcast',
  description: 'Conversas sobre direito, tecnologia e inovação com especialistas do mercado.',
};

export const dynamic = 'force-dynamic';

export default async function PodcastPage() {
  const podcasts = await getPodcasts();

  return (
    <>
      {/* Hero */}
      <section className="relative pt-32 pb-20 md:pt-40 md:pb-28 bg-gradient-to-br from-primary via-primary-light to-primary">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNDOUEyMjciIGZpbGwtb3BhY2l0eT0iMC4wMyI+PHBhdGggZD0iTTM2IDM0djItaDJWMzRoLTJ6bTAgNHYyaDJ2LTJoLTJ6bS0yIDJ2Mmgydi0yaC0yem0wLTR2Mmgydi0yaC0yem0tMiAydjJoMnYtMmgtMnptMC00djJoMnYtMmgtMnptLTIgMnYyaDJ2LTJoLTJ6Ii8+PC9nPjwvZz48L3N2Zz4=')] opacity-40"></div>

        <div className="relative max-w-4xl mx-auto px-6 text-center">
          <AnimatedSection>
            <h1 className="text-5xl md:text-7xl font-bold mb-6">
              <span className="text-accent">Podcast</span> LEX
            </h1>
          </AnimatedSection>
          <AnimatedSection delay={0.2}>
            <p className="text-xl md:text-2xl text-neutral-200">
              Conversas sobre direito, tecnologia e inovação
            </p>
          </AnimatedSection>
        </div>
      </section>

      {/* Podcasts Grid */}
      <Section>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {podcasts.map((podcast, index) => (
            <AnimatedSection key={podcast.id} delay={index * 0.05}>
              <Card padding="none" className="overflow-hidden h-full flex flex-col">
                <div className="relative h-56 w-full">
                  {podcast.thumbnailUrl ? (
                    <Image
                      src={podcast.thumbnailUrl}
                      alt={podcast.title}
                      fill
                      className="object-cover"
                    />
                  ) : (
                    <div className="w-full h-full bg-primary-light" />
                  )}
                  <div className="absolute top-4 left-4">
                    <Tag variant="accent">Episódio {podcast.episode}</Tag>
                  </div>
                </div>
                <div className="p-6 flex-1 flex flex-col">
                  <h3 className="text-2xl font-semibold mb-3 line-clamp-2">
                    {podcast.title}
                  </h3>
                  <p className="text-neutral-300 mb-4 line-clamp-3 flex-1">
                    {podcast.description}
                  </p>
                  <div className="space-y-3 mb-4">
                    {podcast.guests.length > 0 && (
                      <div className="text-sm text-neutral-400">
                        <strong>Convidados:</strong> {podcast.guests.join(', ')}
                      </div>
                    )}
                    <div className="flex flex-wrap gap-2">
                      {podcast.tags.slice(0, 3).map((tag) => (
                        <Tag key={tag} variant="outline">
                          {tag}
                        </Tag>
                      ))}
                    </div>
                  </div>
                  <div className="flex items-center justify-between pt-4 border-t border-neutral-500/20">
                    <span className="text-sm text-neutral-400">
                      {podcast.duration}
                    </span>
                    <CTAButton
                      href={podcast.youtubeUrl}
                      external
                      size="small"
                      variant="primary"
                    >
                      Assistir
                    </CTAButton>
                  </div>
                </div>
              </Card>
            </AnimatedSection>
          ))}
        </div>
      </Section>
    </>
  );
}
