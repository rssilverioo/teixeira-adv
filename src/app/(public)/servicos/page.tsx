import type { Metadata } from 'next';
import Link from 'next/link';
import Section from '@/components/Section';
import Card from '@/components/Card';
import AnimatedSection from '@/components/AnimatedSection';
import DynamicIcon from '@/components/DynamicIcon';
import { getServices } from '@/lib/data';

export const metadata: Metadata = {
  title: 'Nossos Serviços',
  description: 'Conheça as áreas de atuação do LEX e como podemos ajudar seu negócio.',
};

export default async function ServicosPage() {
  const services = await getServices();

  return (
    <>
      {/* Hero */}
      <section className="relative pt-32 pb-20 md:pt-40 md:pb-28 bg-gradient-to-br from-primary via-primary-light to-primary">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNDOUEyMjciIGZpbGwtb3BhY2l0eT0iMC4wMyI+PHBhdGggZD0iTTM2IDM0djItaDJWMzRoLTJ6bTAgNHYyaDJ2LTJoLTJ6bS0yIDJ2Mmgydi0yaC0yem0wLTR2Mmgydi0yaC0yem0tMiAydjJoMnYtMmgtMnptMC00djJoMnYtMmgtMnptLTIgMnYyaDJ2LTJoLTJ6Ii8+PC9nPjwvZz48L3N2Zz4=')] opacity-40"></div>

        <div className="relative max-w-4xl mx-auto px-6 text-center">
          <AnimatedSection>
            <h1 className="text-5xl md:text-7xl font-bold mb-6">
              Nossos <span className="text-accent">Serviços</span>
            </h1>
          </AnimatedSection>
          <AnimatedSection delay={0.2}>
            <p className="text-xl md:text-2xl text-neutral-200">
              Expertise em áreas estratégicas para empresas de tecnologia e inovação
            </p>
          </AnimatedSection>
        </div>
      </section>

      {/* Serviços */}
      <Section>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service, index) => (
            <AnimatedSection key={service.slug} delay={index * 0.05}>
              <Link href={`/servicos/${service.slug}`}>
                <Card className="h-full">
                  <div className="mb-6">
                    <DynamicIcon name={service.icon} size={48} className="text-accent" />
                  </div>
                  <h3 className="text-2xl font-semibold mb-4 text-neutral-50">
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
      </Section>
    </>
  );
}
