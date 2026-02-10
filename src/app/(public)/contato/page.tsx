import type { Metadata } from 'next';
import Section from '@/components/Section';
import Card from '@/components/Card';
import AnimatedSection from '@/components/AnimatedSection';
import SocialLinks from '@/components/SocialLinks';
import ContactForm from '@/components/ContactForm';
import { getSiteSettings } from '@/lib/data';

export const metadata: Metadata = {
  title: 'Contato',
  description: 'Entre em contato com o LEX. Vamos conversar sobre como podemos ajudar seu negócio.',
};

export const dynamic = 'force-dynamic';

export default async function ContatoPage() {
  const settings = await getSiteSettings();

  return (
    <>
      {/* Hero */}
      <section className="relative pt-32 pb-20 md:pt-40 md:pb-28 bg-gradient-to-br from-primary via-primary-light to-primary">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNDOUEyMjciIGZpbGwtb3BhY2l0eT0iMC4wMyI+PHBhdGggZD0iTTM2IDM0djItaDJWMzRoLTJ6bTAgNHYyaDJ2LTJoLTJ6bS0yIDJ2Mmgydi0yaC0yem0wLTR2Mmgydi0yaC0yem0tMiAydjJoMnYtMmgtMnptMC00djJoMnYtMmgtMnptLTIgMnYyaDJ2LTJoLTJ6Ii8+PC9nPjwvZz48L3N2Zz4=')] opacity-40"></div>

        <div className="relative max-w-4xl mx-auto px-6 text-center">
          <AnimatedSection>
            <h1 className="text-5xl md:text-7xl font-bold mb-6">
              Entre em <span className="text-accent">Contato</span>
            </h1>
          </AnimatedSection>
          <AnimatedSection delay={0.2}>
            <p className="text-xl md:text-2xl text-neutral-200">
              Vamos conversar sobre como podemos ajudar seu negócio
            </p>
          </AnimatedSection>
        </div>
      </section>

      {/* Contact Section */}
      <Section>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Contact Info */}
          <div className="lg:col-span-1">
            <AnimatedSection>
              <h2 className="text-3xl font-bold mb-8">Informações</h2>

              <Card className="space-y-6">
                {settings.address && (
                  <div>
                    <h3 className="font-semibold text-accent mb-2">Endereço</h3>
                    <p className="text-neutral-300 whitespace-pre-line">
                      {settings.address}
                    </p>
                  </div>
                )}

                {settings.phone && (
                  <div>
                    <h3 className="font-semibold text-accent mb-2">Telefone</h3>
                    <a
                      href={`tel:${settings.phone.replace(/\D/g, '')}`}
                      className="text-neutral-300 hover:text-accent transition-colors"
                    >
                      {settings.phone}
                    </a>
                  </div>
                )}

                {settings.email && (
                  <div>
                    <h3 className="font-semibold text-accent mb-2">Email</h3>
                    <a
                      href={`mailto:${settings.email}`}
                      className="text-neutral-300 hover:text-accent transition-colors"
                    >
                      {settings.email}
                    </a>
                  </div>
                )}

                <div>
                  <h3 className="font-semibold text-accent mb-3">Redes Sociais</h3>
                  <SocialLinks />
                </div>
              </Card>

              {settings.workingHours && (
                <AnimatedSection delay={0.2}>
                  <Card className="mt-6">
                    <h3 className="font-semibold text-accent mb-3">Horário de Atendimento</h3>
                    <p className="text-neutral-300 whitespace-pre-line">
                      {settings.workingHours}
                    </p>
                  </Card>
                </AnimatedSection>
              )}
            </AnimatedSection>
          </div>

          {/* Contact Form */}
          <div className="lg:col-span-2">
            <AnimatedSection delay={0.1}>
              <h2 className="text-3xl font-bold mb-8">Envie uma mensagem</h2>
              <ContactForm />
            </AnimatedSection>
          </div>
        </div>
      </Section>
    </>
  );
}
