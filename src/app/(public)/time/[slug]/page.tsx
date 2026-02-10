import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import Section from '@/components/Section';
import Card from '@/components/Card';
import Tag from '@/components/Tag';
import CTAButton from '@/components/CTAButton';
import AnimatedSection from '@/components/AnimatedSection';
import { getTeamMemberBySlug, getTeamMembers } from '@/lib/data';

interface TeamMemberPageProps {
  params: {
    slug: string;
  };
}

export async function generateMetadata({ params }: TeamMemberPageProps): Promise<Metadata> {
  const member = await getTeamMemberBySlug(params.slug);

  if (!member) {
    return {};
  }

  return {
    title: `${member.name} - ${member.role}`,
    description: member.bio.substring(0, 160),
  };
}

export default async function TeamMemberPage({ params }: TeamMemberPageProps) {
  const member = await getTeamMemberBySlug(params.slug);

  if (!member) {
    notFound();
  }

  const allMembers = await getTeamMembers();
  const otherMembers = allMembers.filter((m) => m.slug !== member.slug).slice(0, 3);

  return (
    <>
      {/* Hero */}
      <section className="relative pt-32 pb-20 md:pt-40 md:pb-28 bg-gradient-to-br from-primary via-primary-light to-primary">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNDOUEyMjciIGZpbGwtb3BhY2l0eT0iMC4wMyI+PHBhdGggZD0iTTM2IDM0djItaDJWMzRoLTJ6bTAgNHYyaDJ2LTJoLTJ6bS0yIDJ2Mmgydi0yaC0yem0wLTR2Mmgydi0yaC0yem0tMiAydjJoMnYtMmgtMnptMC00djJoMnYtMmgtMnptLTIgMnYyaDJ2LTJoLTJ6Ii8+PC9nPjwvZz48L3N2Zz4=')] opacity-40"></div>

        <div className="relative max-w-5xl mx-auto px-6">
          <div className="flex flex-col md:flex-row gap-12 items-center md:items-start">
            <AnimatedSection>
              <div className="relative w-48 h-48 md:w-64 md:h-64 rounded-full overflow-hidden border-4 border-accent/20">
                {member.imageUrl ? (
                  <Image
                    src={member.imageUrl}
                    alt={member.name}
                    fill
                    className="object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-primary-light flex items-center justify-center text-6xl font-bold text-accent">
                    {member.name.charAt(0)}
                  </div>
                )}
              </div>
            </AnimatedSection>

            <AnimatedSection delay={0.2} className="flex-1 text-center md:text-left">
              <h1 className="text-5xl md:text-6xl font-bold mb-4">
                {member.name}
              </h1>
              <p className="text-2xl text-accent mb-6">{member.role}</p>
              <div className="flex flex-wrap gap-2 justify-center md:justify-start mb-6">
                {member.expertise.map((exp) => (
                  <Tag key={exp} variant="accent">
                    {exp}
                  </Tag>
                ))}
              </div>
              <div className="flex gap-4 justify-center md:justify-start">
                {member.linkedinUrl && (
                  <a
                    href={member.linkedinUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 px-6 py-3 bg-accent text-primary rounded-sm hover:bg-accent-light transition-colors"
                  >
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
                    </svg>
                    LinkedIn
                  </a>
                )}
                {member.email && (
                  <a
                    href={`mailto:${member.email}`}
                    className="flex items-center gap-2 px-6 py-3 border-2 border-accent text-accent rounded-sm hover:bg-accent hover:text-primary transition-colors"
                  >
                    Email
                  </a>
                )}
              </div>
            </AnimatedSection>
          </div>
        </div>
      </section>

      {/* Bio */}
      <Section>
        <div className="max-w-4xl mx-auto">
          <AnimatedSection>
            <div className="prose prose-lg prose-invert max-w-none">
              {member.bio.split('\n\n').map((paragraph, index) => (
                <p key={index} className="mb-6 text-lg text-neutral-300 leading-relaxed">
                  {paragraph}
                </p>
              ))}
            </div>
          </AnimatedSection>
        </div>
      </Section>

      {/* Other Members */}
      {otherMembers.length > 0 && (
        <Section background="dark">
          <AnimatedSection>
            <h2 className="text-4xl md:text-5xl font-bold mb-12">
              Conheça outros membros
            </h2>
          </AnimatedSection>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {otherMembers.map((otherMember, index) => (
              <AnimatedSection key={otherMember.slug} delay={index * 0.1}>
                <Link href={`/time/${otherMember.slug}`}>
                  <Card className="text-center h-full">
                    <div className="relative w-32 h-32 mx-auto mb-6 rounded-full overflow-hidden">
                      {otherMember.imageUrl ? (
                        <Image
                          src={otherMember.imageUrl}
                          alt={otherMember.name}
                          fill
                          className="object-cover"
                        />
                      ) : (
                        <div className="w-full h-full bg-primary-light flex items-center justify-center text-4xl font-bold text-accent">
                          {otherMember.name.charAt(0)}
                        </div>
                      )}
                    </div>
                    <h3 className="text-xl font-semibold mb-2">{otherMember.name}</h3>
                    <p className="text-accent mb-4">{otherMember.role}</p>
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
