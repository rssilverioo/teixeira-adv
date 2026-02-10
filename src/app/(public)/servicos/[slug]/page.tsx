import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import Section from '@/components/Section';
import CTAButton from '@/components/CTAButton';
import Card from '@/components/Card';
import AnimatedSection from '@/components/AnimatedSection';
import DynamicIcon from '@/components/DynamicIcon';
import { getServices, getServiceBySlug } from '@/lib/data';

interface ServicePageProps {
  params: {
    slug: string;
  };
}

export async function generateMetadata({ params }: ServicePageProps): Promise<Metadata> {
  const service = await getServiceBySlug(params.slug);

  if (!service) {
    return {};
  }

  return {
    title: service.title,
    description: service.excerpt,
  };
}

export const dynamic = 'force-dynamic';

export default async function ServicePage({ params }: ServicePageProps) {
  const [service, allServices] = await Promise.all([
    getServiceBySlug(params.slug),
    getServices(),
  ]);

  if (!service) {
    notFound();
  }

  const relatedServices = allServices
    .filter((s) => s.slug !== service.slug)
    .slice(0, 3);

  return (
    <>
      {/* Hero */}
      <section className="relative pt-32 pb-20 md:pt-40 md:pb-28">
        <div className="absolute inset-0">
          {service.imageUrl ? (
            <Image
              src={service.imageUrl}
              alt={service.title}
              fill
              className="object-cover brightness-[0.3]"
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-primary via-primary-light to-primary" />
          )}
        </div>

        <div className="relative max-w-4xl mx-auto px-6">
          <AnimatedSection>
            <div className="mb-6">
              <DynamicIcon name={service.icon} size={64} className="text-accent" />
            </div>
            <h1 className="text-5xl md:text-7xl font-bold mb-6">
              {service.title}
            </h1>
          </AnimatedSection>
          <AnimatedSection delay={0.2}>
            <p className="text-xl md:text-2xl text-neutral-200">
              {service.excerpt}
            </p>
          </AnimatedSection>
        </div>
      </section>

      {/* Content */}
      <Section>
        <div className="max-w-4xl mx-auto">
          <AnimatedSection>
            <div
              className="prose prose-lg prose-invert max-w-none"
              dangerouslySetInnerHTML={{ __html: service.content.replace(/\n/g, '<br/>') }}
            />
          </AnimatedSection>

          <AnimatedSection delay={0.2}>
            <div className="mt-16 pt-12 border-t border-neutral-500/20">
              <h2 className="text-3xl font-bold mb-8">
                Como podemos ajudar?
              </h2>
              <p className="text-lg text-neutral-300 mb-8 leading-relaxed">
                Nossa equipe está pronta para oferecer soluções personalizadas
                para os desafios específicos do seu negócio em {service.title.toLowerCase()}.
              </p>
              <CTAButton href="/contato" size="large">
                Entre em contato
              </CTAButton>
            </div>
          </AnimatedSection>
        </div>
      </Section>

      {/* Related Services */}
      {relatedServices.length > 0 && (
        <Section background="dark">
          <AnimatedSection>
            <h2 className="text-4xl md:text-5xl font-bold mb-12">
              Outros Serviços
            </h2>
          </AnimatedSection>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {relatedServices.map((relatedService, index) => (
              <AnimatedSection key={relatedService.slug} delay={index * 0.1}>
                <Link href={`/servicos/${relatedService.slug}`}>
                  <Card className="h-full">
                    <div className="mb-4">
                      <DynamicIcon name={relatedService.icon} size={40} className="text-accent" />
                    </div>
                    <h3 className="text-xl font-semibold mb-3">
                      {relatedService.title}
                    </h3>
                    <p className="text-neutral-300">
                      {relatedService.excerpt}
                    </p>
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
