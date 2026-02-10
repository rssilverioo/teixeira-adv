import type { Metadata } from 'next';
import Section from '@/components/Section';
import AnimatedSection from '@/components/AnimatedSection';
import { getLegalPage } from '@/lib/data';

export const metadata: Metadata = {
  title: 'Termos de Uso',
  description: 'Termos de uso do site.',
};

export const dynamic = 'force-dynamic';

export default async function TermosPage() {
  const page = await getLegalPage('termos');

  return (
    <>
      <section className="relative pt-32 pb-20 md:pt-40 md:pb-28 bg-gradient-to-br from-primary via-primary-light to-primary">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNDOUEyMjciIGZpbGwtb3BhY2l0eT0iMC4wMyI+PHBhdGggZD0iTTM2IDM0djItaDJWMzRoLTJ6bTAgNHYyaDJ2LTJoLTJ6bS0yIDJ2Mmgydi0yaC0yem0wLTR2Mmgydi0yaC0yem0tMiAydjJoMnYtMmgtMnptMC00djJoMnYtMmgtMnptLTIgMnYyaDJ2LTJoLTJ6Ii8+PC9nPjwvZz48L3N2Zz4=')] opacity-40"></div>
        <div className="relative max-w-4xl mx-auto px-6 text-center">
          <AnimatedSection>
            <h1 className="text-5xl md:text-7xl font-bold mb-6">
              {page?.title || 'Termos de Uso'}
            </h1>
          </AnimatedSection>
        </div>
      </section>

      <Section>
        <div className="max-w-4xl mx-auto">
          <AnimatedSection>
            {page?.content ? (
              <div
                className="prose prose-lg prose-invert max-w-none"
                dangerouslySetInnerHTML={{ __html: page.content }}
              />
            ) : (
              <p className="text-neutral-400 text-center text-lg">
                Conteúdo em breve.
              </p>
            )}
          </AnimatedSection>
        </div>
      </Section>
    </>
  );
}
