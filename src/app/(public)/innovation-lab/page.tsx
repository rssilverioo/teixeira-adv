import type { Metadata } from 'next';
import Section from '@/components/Section';
import Card from '@/components/Card';
import CTAButton from '@/components/CTAButton';
import AnimatedSection from '@/components/AnimatedSection';
import DynamicIcon from '@/components/DynamicIcon';
import { getInnovationProducts } from '@/lib/data';

export const metadata: Metadata = {
  title: 'Innovation Lab',
  description: 'Soluções tecnológicas e produtos inovadores para otimizar a prática jurídica.',
};

export const dynamic = 'force-dynamic';

export default async function InnovationLabPage() {
  const products = await getInnovationProducts();

  return (
    <>
      {/* Hero */}
      <section className="relative pt-32 pb-20 md:pt-40 md:pb-28 bg-gradient-to-br from-primary via-primary-light to-primary">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNDOUEyMjciIGZpbGwtb3BhY2l0eT0iMC4wMyI+PHBhdGggZD0iTTM2IDM0djItaDJWMzRoLTJ6bTAgNHYyaDJ2LTJoLTJ6bS0yIDJ2Mmgydi0yaC0yem0wLTR2Mmgydi0yaC0yem0tMiAydjJoMnYtMmgtMnptMC00djJoMnYtMmgtMnptLTIgMnYyaDJ2LTJoLTJ6Ii8+PC9nPjwvZz48L3N2Zz4=')] opacity-40"></div>

        <div className="relative max-w-4xl mx-auto px-6 text-center">
          <AnimatedSection>
            <h1 className="text-5xl md:text-7xl font-bold mb-6">
              Innovation <span className="text-accent">Lab</span>
            </h1>
          </AnimatedSection>
          <AnimatedSection delay={0.2}>
            <p className="text-xl md:text-2xl text-neutral-200 max-w-3xl mx-auto">
              Análise de riscos e oportunidades através de soluções tecnológicas inovadoras
            </p>
          </AnimatedSection>
        </div>
      </section>

      {/* Introdução */}
      <Section>
        <div className="max-w-4xl mx-auto text-center">
          <AnimatedSection>
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              Tecnologia e Inovação
            </h2>
            <p className="text-xl text-neutral-300 leading-relaxed">
              Nosso Innovation Lab desenvolve produtos e ferramentas que
              combinam expertise jurídica com tecnologia de ponta, oferecendo
              soluções que vão além da consultoria tradicional.
            </p>
          </AnimatedSection>
        </div>
      </Section>

      {/* Produtos */}
      <Section background="dark">
        <AnimatedSection>
          <h2 className="text-4xl md:text-5xl font-bold text-center mb-16">
            Nossas Soluções
          </h2>
        </AnimatedSection>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {products.map((product, index) => (
            <AnimatedSection key={product.id} delay={index * 0.05}>
              <Card className="h-full">
                <div className="mb-6">
                  <DynamicIcon name={product.icon} size={48} className="text-accent" />
                </div>
                <h3 className="text-2xl font-semibold mb-4">
                  {product.title}
                </h3>
                <p className="text-neutral-300 leading-relaxed mb-6">
                  {product.description}
                </p>
                <CTAButton
                  href="/contato"
                  variant="outline"
                  size="small"
                >
                  Saiba mais
                </CTAButton>
              </Card>
            </AnimatedSection>
          ))}
        </div>
      </Section>

      {/* Benefícios */}
      <Section>
        <AnimatedSection>
          <h2 className="text-4xl md:text-5xl font-bold text-center mb-16">
            Por Que Inovar?
          </h2>
        </AnimatedSection>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
          {[
            {
              title: 'Eficiência Operacional',
              description: 'Automatize processos repetitivos e libere sua equipe para atividades estratégicas.',
            },
            {
              title: 'Redução de Custos',
              description: 'Otimize recursos e reduza custos operacionais com soluções tecnológicas.',
            },
            {
              title: 'Tomada de Decisão',
              description: 'Base suas decisões em dados e análises preditivas precisas.',
            },
            {
              title: 'Vantagem Competitiva',
              description: 'Esteja à frente da concorrência com ferramentas de ponta.',
            },
          ].map((benefit, index) => (
            <AnimatedSection key={index} delay={index * 0.1}>
              <div className="bg-primary-light p-8 rounded-lg border-l-4 border-accent">
                <h3 className="text-2xl font-semibold mb-3">
                  {benefit.title}
                </h3>
                <p className="text-lg text-neutral-300 leading-relaxed">
                  {benefit.description}
                </p>
              </div>
            </AnimatedSection>
          ))}
        </div>
      </Section>

      {/* CTA */}
      <Section background="darker" padding="large">
        <AnimatedSection>
          <div className="text-center max-w-3xl mx-auto">
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              Transforme sua operação jurídica
            </h2>
            <p className="text-xl text-neutral-300 mb-10">
              Entre em contato e descubra como nossas soluções podem
              revolucionar a forma como você trabalha.
            </p>
            <CTAButton href="/contato" size="large">
              Agende uma demonstração
            </CTAButton>
          </div>
        </AnimatedSection>
      </Section>
    </>
  );
}
