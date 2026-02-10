import Image from 'next/image';
import Link from 'next/link';
import Section from '@/components/Section';
import CTAButton from '@/components/CTAButton';
import Card from '@/components/Card';
import Tag from '@/components/Tag';
import AnimatedSection from '@/components/AnimatedSection';
import DynamicIcon from '@/components/DynamicIcon';
import HeroSlideshow from '@/components/HeroSlideshow';
import { getHeroSection, getStats, getServices, getTeamMembers, getMediaPosts, getCTASection } from '@/lib/data';

export default async function Home() {
  const [hero, stats, services, team, mediaPosts, cta] = await Promise.all([
    getHeroSection(),
    getStats(),
    getServices(),
    getTeamMembers(),
    getMediaPosts(),
    getCTASection(),
  ]);

  const slideshowImages = hero?.slideshowImages ?? [];

  return (
    <>
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        {/* Background: Video > Image > Slideshow > Gradient */}
        {hero?.backgroundVideoUrl ? (
          <div className="absolute inset-0">
            <video
              autoPlay
              muted
              loop
              playsInline
              className="absolute inset-0 w-full h-full object-cover"
            >
              <source src={hero.backgroundVideoUrl} type="video/mp4" />
            </video>
            <div className="absolute inset-0 bg-primary/70" />
          </div>
        ) : hero?.backgroundImageUrl ? (
          <div className="absolute inset-0">
            <Image
              src={hero.backgroundImageUrl}
              alt="Background"
              fill
              className="object-cover"
              priority
            />
            <div className="absolute inset-0 bg-primary/70" />
          </div>
        ) : slideshowImages.length > 0 ? (
          <HeroSlideshow images={slideshowImages} />
        ) : (
          <div className="absolute inset-0 bg-gradient-to-br from-primary via-primary-light to-primary">
            <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNDOUEyMjciIGZpbGwtb3BhY2l0eT0iMC4wMyI+PHBhdGggZD0iTTM2IDM0djItaDJWMzRoLTJ6bTAgNHYyaDJ2LTJoLTJ6bS0yIDJ2Mmgydi0yaC0yem0wLTR2Mmgydi0yaC0yem0tMiAydjJoMnYtMmgtMnptMC00djJoMnYtMmgtMnptLTIgMnYyaDJ2LTJoLTJ6Ii8+PC9nPjwvZz48L3N2Zz4=')] opacity-40"></div>
          </div>
        )}

        {/* Content */}
        <div className="relative z-10 text-center px-6 max-w-5xl mx-auto pt-20">
          <AnimatedSection>
            <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold mb-6 text-balance leading-tight">
              {hero?.title ?? 'Direito para a'}{' '}
              <span className="text-accent">{hero?.highlight ?? 'Nova Economia'}</span>
            </h1>
          </AnimatedSection>

          <AnimatedSection delay={0.2}>
            <p className="text-xl md:text-2xl text-neutral-200 mb-12 max-w-3xl mx-auto text-balance">
              {hero?.subtitle ?? 'Soluções jurídicas estratégicas para empresas de tecnologia, startups e negócios inovadores'}
            </p>
          </AnimatedSection>

          <AnimatedSection delay={0.4}>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <CTAButton href={hero?.ctaPrimaryLink ?? '/contato'} size="large">
                {hero?.ctaPrimaryText ?? 'Fale conosco'}
              </CTAButton>
              <CTAButton href={hero?.ctaSecondaryLink ?? '/servicos'} variant="outline" size="large">
                {hero?.ctaSecondaryText ?? 'Conheça os serviços'}
              </CTAButton>
            </div>
          </AnimatedSection>

          {/* Scroll Indicator */}
          <AnimatedSection delay={0.6}>
            <div className="mt-20 animate-bounce">
              <svg
                className="w-6 h-6 mx-auto text-accent"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 14l-7 7m0 0l-7-7m7 7V3"
                />
              </svg>
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* Em Números */}
      <Section background="dark">
        <AnimatedSection>
          <h2 className="text-4xl md:text-5xl font-bold text-center mb-16">
            Em Números
          </h2>
        </AnimatedSection>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {stats.map((stat, index) => (
            <AnimatedSection key={stat.id} delay={index * 0.1}>
              <Card className="text-center">
                <div className="text-4xl md:text-5xl font-bold text-accent mb-3">
                  {stat.number}
                </div>
                <div className="text-neutral-300">{stat.label}</div>
              </Card>
            </AnimatedSection>
          ))}
        </div>
      </Section>

      {/* Nossos Serviços */}
      <Section>
        <AnimatedSection>
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              Nossos Serviços
            </h2>
            <p className="text-xl text-neutral-300 max-w-3xl mx-auto">
              Expertise em áreas estratégicas para empresas de tecnologia e inovação
            </p>
          </div>
        </AnimatedSection>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.slice(0, 9).map((service, index) => (
            <AnimatedSection key={service.slug} delay={index * 0.05}>
              <Link href={`/servicos/${service.slug}`}>
                <Card className="h-full">
                  <div className="mb-4">
                    <DynamicIcon name={service.icon} size={32} className="text-accent" />
                  </div>
                  <h3 className="text-xl font-semibold mb-3 text-neutral-50">
                    {service.title}
                  </h3>
                  <p className="text-neutral-300 leading-relaxed">
                    {service.excerpt}
                  </p>
                </Card>
              </Link>
            </AnimatedSection>
          ))}
        </div>

        <AnimatedSection delay={0.5}>
          <div className="text-center mt-12">
            <CTAButton href="/servicos" variant="outline">
              Ver todos os serviços
            </CTAButton>
          </div>
        </AnimatedSection>
      </Section>

      {/* Time */}
      <Section background="dark">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <AnimatedSection>
            <div>
              <h2 className="text-4xl md:text-5xl font-bold mb-6">
                Nosso Time
              </h2>
              <p className="text-xl text-neutral-300 mb-8 leading-relaxed">
                Profissionais experientes e apaixonados por inovação,
                prontos para oferecer as melhores soluções jurídicas
                para o seu negócio.
              </p>
              <CTAButton href="/time">Conheça nosso time</CTAButton>
            </div>
          </AnimatedSection>

          <div className="grid grid-cols-2 gap-6">
            {team.slice(0, 4).map((member, index) => (
              <AnimatedSection key={member.slug} delay={index * 0.1}>
                <Link href={`/time/${member.slug}`}>
                  <Card className="text-center">
                    <div className="relative w-24 h-24 mx-auto mb-4 rounded-full overflow-hidden">
                      <Image
                        src={member.imageUrl || '/placeholder-avatar.jpg'}
                        alt={member.name}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <h3 className="font-semibold mb-1">{member.name}</h3>
                    <p className="text-sm text-neutral-300 mb-3">
                      {member.role}
                    </p>
                    {member.linkedinUrl && (
                      <span className="inline-flex items-center text-accent">
                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
                        </svg>
                      </span>
                    )}
                  </Card>
                </Link>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </Section>

      {/* Na Mídia */}
      <Section>
        <AnimatedSection>
          <div className="flex justify-between items-end mb-12">
            <div>
              <h2 className="text-4xl md:text-5xl font-bold mb-4">Na Mídia</h2>
              <p className="text-xl text-neutral-300">
                Artigos e insights do nosso time
              </p>
            </div>
            <CTAButton href="/midia" variant="outline" className="hidden md:inline-flex">
              Ver todos
            </CTAButton>
          </div>
        </AnimatedSection>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {mediaPosts.slice(0, 3).map((post, index) => (
            <AnimatedSection key={post.slug} delay={index * 0.1}>
              <Link href={`/midia/${post.slug}`}>
                <Card padding="none" className="overflow-hidden h-full flex flex-col">
                  <div className="relative h-48 w-full">
                    <Image
                      src={post.imageUrl || '/placeholder-post.jpg'}
                      alt={post.title}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="p-6 flex-1 flex flex-col">
                    <div className="mb-3">
                      <Tag variant="accent">{post.category}</Tag>
                    </div>
                    <h3 className="text-xl font-semibold mb-3 line-clamp-2">
                      {post.title}
                    </h3>
                    <p className="text-neutral-300 mb-4 line-clamp-3 flex-1">
                      {post.excerpt}
                    </p>
                    <div className="flex items-center justify-between text-sm text-neutral-400">
                      <span>{post.author}</span>
                      <span>{post.readTime}</span>
                    </div>
                  </div>
                </Card>
              </Link>
            </AnimatedSection>
          ))}
        </div>

        <AnimatedSection delay={0.4}>
          <div className="text-center mt-8 md:hidden">
            <CTAButton href="/midia" variant="outline">
              Ver todos os artigos
            </CTAButton>
          </div>
        </AnimatedSection>
      </Section>

      {/* CTA Final */}
      <Section background="darker" padding="large">
        <AnimatedSection>
          <div className="text-center max-w-3xl mx-auto">
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              {cta?.title ?? 'Pronto para começar?'}
            </h2>
            <p className="text-xl text-neutral-300 mb-10">
              {cta?.description ?? 'Entre em contato e descubra como podemos ajudar seu negócio a crescer com segurança jurídica.'}
            </p>
            <CTAButton href={cta?.buttonLink ?? '/contato'} size="large">
              {cta?.buttonText ?? 'Fale com nosso time'}
            </CTAButton>
          </div>
        </AnimatedSection>
      </Section>
    </>
  );
}
