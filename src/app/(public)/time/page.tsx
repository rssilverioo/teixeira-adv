import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import Section from '@/components/Section';
import Card from '@/components/Card';
import Tag from '@/components/Tag';
import AnimatedSection from '@/components/AnimatedSection';
import { getTeamMembers } from '@/lib/data';

export const metadata: Metadata = {
  title: 'Nosso Time',
  description: 'Conheça os profissionais que fazem do LEX referência em advocacia para a nova economia.',
};

export default async function TimePage() {
  const team = await getTeamMembers();

  return (
    <>
      {/* Hero */}
      <section className="relative pt-32 pb-20 md:pt-40 md:pb-28 bg-gradient-to-br from-primary via-primary-light to-primary">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNDOUEyMjciIGZpbGwtb3BhY2l0eT0iMC4wMyI+PHBhdGggZD0iTTM2IDM0djItaDJWMzRoLTJ6bTAgNHYyaDJ2LTJoLTJ6bS0yIDJ2Mmgydi0yaC0yem0wLTR2Mmgydi0yaC0yem0tMiAydjJoMnYtMmgtMnptMC00djJoMnYtMmgtMnptLTIgMnYyaDJ2LTJoLTJ6Ii8+PC9nPjwvZz48L3N2Zz4=')] opacity-40"></div>

        <div className="relative max-w-4xl mx-auto px-6 text-center">
          <AnimatedSection>
            <h1 className="text-5xl md:text-7xl font-bold mb-6">
              Nosso <span className="text-accent">Time</span>
            </h1>
          </AnimatedSection>
          <AnimatedSection delay={0.2}>
            <p className="text-xl md:text-2xl text-neutral-200">
              Profissionais experientes e apaixonados por inovação
            </p>
          </AnimatedSection>
        </div>
      </section>

      {/* Team Grid */}
      <Section>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {team.map((member, index) => (
            <AnimatedSection key={member.slug} delay={index * 0.05}>
              <Link href={`/time/${member.slug}`}>
                <Card className="h-full text-center">
                  <div className="relative w-32 h-32 mx-auto mb-6 rounded-full overflow-hidden">
                    {member.imageUrl ? (
                      <Image
                        src={member.imageUrl}
                        alt={member.name}
                        fill
                        className="object-cover"
                      />
                    ) : (
                      <div className="w-full h-full bg-primary-light flex items-center justify-center text-4xl font-bold text-accent">
                        {member.name.charAt(0)}
                      </div>
                    )}
                  </div>
                  <h3 className="text-2xl font-semibold mb-2">{member.name}</h3>
                  <p className="text-accent mb-4">{member.role}</p>
                  <div className="flex flex-wrap gap-2 justify-center mb-4">
                    {member.expertise.slice(0, 3).map((exp) => (
                      <Tag key={exp} variant="default">
                        {exp}
                      </Tag>
                    ))}
                  </div>
                  {member.linkedinUrl && (
                    <span className="inline-flex items-center gap-2 text-accent">
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
                      </svg>
                      LinkedIn
                    </span>
                  )}
                </Card>
              </Link>
            </AnimatedSection>
          ))}
        </div>
      </Section>
    </>
  );
}
