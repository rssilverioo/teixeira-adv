import type { Metadata } from 'next';
import Image from 'next/image';
import Section from '@/components/Section';
import CTAButton from '@/components/CTAButton';
import AnimatedSection from '@/components/AnimatedSection';
import DynamicIcon from '@/components/DynamicIcon';
import { getAboutPage, getValues, getDifferentiators, getSiteSettings } from '@/lib/data';

export const metadata: Metadata = {
  title: 'Sobre',
  description: 'Conheça o LEX, escritório de advocacia especializado em direito digital, tecnologia e inovação.',
};

export const dynamic = 'force-dynamic';

export default async function SobrePage() {
  const [aboutPage, values, differentiators, settings] = await Promise.all([
    getAboutPage(),
    getValues(),
    getDifferentiators(),
    getSiteSettings(),
  ]);

  return (
    <>
      {/* Hero */}
      <section className="relative pt-32 pb-20 md:pt-40 md:pb-28 bg-gradient-to-br from-primary via-primary-light to-primary">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNDOUEyMjciIGZpbGwtb3BhY2l0eT0iMC4wMyI+PHBhdGggZD0iTTM2IDM0djItaDJWMzRoLTJ6bTAgNHYyaDJ2LTJoLTJ6bS0yIDJ2Mmgydi0yaC0yem0wLTR2Mmgydi0yaC0yem0tMiAydjJoMnYtMmgtMnptMC00djJoMnYtMmgtMnptLTIgMnYyaDJ2LTJoLTJ6Ii8+PC9nPjwvZz48L3N2Zz4=')] opacity-40"></div>

        <div className="relative max-w-4xl mx-auto px-6 text-center">
          <AnimatedSection>
            <h1 className="text-5xl md:text-7xl font-bold mb-6">
              {aboutPage?.title ? (
                <>{aboutPage.title.split(' ').slice(0, -1).join(' ')} <span className="text-accent">{aboutPage.title.split(' ').slice(-1)}</span></>
              ) : (
                <>Sobre o <span className="text-accent">{settings.siteName}</span></>
              )}
            </h1>
          </AnimatedSection>
          <AnimatedSection delay={0.2}>
            <p className="text-xl md:text-2xl text-neutral-200">
              {aboutPage?.subtitle || 'Advocacia estratégica para a nova economia'}
            </p>
          </AnimatedSection>
        </div>
      </section>

      {/* Nossa História */}
      <Section>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <AnimatedSection>
            <div>
              <h2 className="text-4xl md:text-5xl font-bold mb-6">
                {aboutPage?.historyTitle || 'Nossa História'}
              </h2>
              <div className="space-y-4 text-lg text-neutral-300 leading-relaxed">
                {aboutPage?.historyContent ? (
                  aboutPage.historyContent.split('\n\n').map((paragraph, index) => (
                    <p key={index}>{paragraph}</p>
                  ))
                ) : (
                  <>
                    <p>
                      Fundado em 2012, o {settings.siteName} nasceu com a missão de oferecer
                      assessoria jurídica especializada para empresas de tecnologia
                      e negócios inovadores que estavam transformando o mercado.
                    </p>
                    <p>
                      Ao longo de mais de uma década, construímos uma reputação
                      sólida ao combinar profundo conhecimento jurídico com
                      compreensão real dos desafios enfrentados por startups,
                      scale-ups e empresas digitais.
                    </p>
                    <p>
                      Hoje, somos referência em áreas como LGPD, direito digital,
                      propriedade intelectual, gaming e esports, atendendo desde
                      empresas em estágio inicial até grandes corporações.
                    </p>
                  </>
                )}
              </div>
            </div>
          </AnimatedSection>

          <AnimatedSection delay={0.2}>
            <div className="relative h-[500px] rounded-lg overflow-hidden">
              <Image
                src={aboutPage?.historyImageUrl || 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=800'}
                alt={`Escritório ${settings.siteName}`}
                fill
                className="object-cover"
              />
            </div>
          </AnimatedSection>
        </div>
      </Section>

      {/* Valores */}
      {values.length > 0 && (
        <Section background="dark">
          <AnimatedSection>
            <h2 className="text-4xl md:text-5xl font-bold text-center mb-16">
              Nossos Valores
            </h2>
          </AnimatedSection>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {values.map((value, index) => (
              <AnimatedSection key={value.id} delay={index * 0.1}>
                <div className="bg-primary-light p-8 rounded-lg border border-neutral-500/10 hover:border-accent/30 transition-all duration-300">
                  <div className="mb-4">
                    <DynamicIcon name={value.icon} size={48} className="text-accent" />
                  </div>
                  <h3 className="text-2xl font-semibold mb-3">{value.title}</h3>
                  <p className="text-neutral-300 leading-relaxed">
                    {value.description}
                  </p>
                </div>
              </AnimatedSection>
            ))}
          </div>
        </Section>
      )}

      {/* Diferenciais */}
      {differentiators.length > 0 && (
        <Section>
          <AnimatedSection>
            <h2 className="text-4xl md:text-5xl font-bold text-center mb-6">
              Nossos Diferenciais
            </h2>
            <p className="text-xl text-neutral-300 text-center mb-16 max-w-3xl mx-auto">
              O que nos torna únicos no mercado jurídico
            </p>
          </AnimatedSection>

          <div className="max-w-4xl mx-auto space-y-8">
            {differentiators.map((item, index) => (
              <AnimatedSection key={item.id} delay={index * 0.1}>
                <div className="bg-primary-light p-8 rounded-lg border-l-4 border-accent">
                  <h3 className="text-2xl font-semibold mb-3">{item.title}</h3>
                  <p className="text-lg text-neutral-300 leading-relaxed">
                    {item.description}
                  </p>
                </div>
              </AnimatedSection>
            ))}
          </div>
        </Section>
      )}

      {/* CTA */}
      <Section background="darker" padding="large">
        <AnimatedSection>
          <div className="text-center max-w-3xl mx-auto">
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              Vamos trabalhar juntos?
            </h2>
            <p className="text-xl text-neutral-300 mb-10">
              Entre em contato e descubra como podemos ajudar
              seu negócio a alcançar novos patamares.
            </p>
            <CTAButton href="/contato" size="large">
              Fale conosco
            </CTAButton>
          </div>
        </AnimatedSection>
      </Section>
    </>
  );
}
