import Link from 'next/link';
import Image from 'next/image';
import Container from './Container';
import SocialLinks from './SocialLinks';
import { getSiteSettings, getNavItems } from '@/lib/data';

export default async function Footer() {
  const [settings, navItems] = await Promise.all([
    getSiteSettings(),
    getNavItems(),
  ]);
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-black border-t border-neutral-500/10">
      <Container>
        <div className="py-16 md:py-20">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
            {/* Logo e Descrição */}
            <div className="lg:col-span-2">
              <Link
                href="/"
                className="inline-block mb-6"
              >
                {settings?.logoUrl ? (
                  <Image
                    src={settings.logoUrl}
                    alt={settings.siteName || 'Logo'}
                    width={280}
                    height={80}
                    className="h-20 w-auto object-contain"
                  />
                ) : (
                  <span className="text-3xl font-serif font-bold text-neutral-50 hover:text-accent transition-colors">
                    <span className="text-accent">{settings?.siteName?.charAt(0) || 'L'}</span>{settings?.siteName?.slice(1) || 'EX'}
                  </span>
                )}
              </Link>
              <p className="text-neutral-300 mb-6 max-w-md leading-relaxed">
                {settings?.siteDescription || 'Escritório de advocacia especializado em direito digital, tecnologia e inovação. Soluções jurídicas para a nova economia.'}
              </p>
              <SocialLinks />
            </div>

            {/* Navegação */}
            <div>
              <h3 className="text-neutral-50 font-semibold mb-4">Navegação</h3>
              <ul className="space-y-3">
                {navItems.map((item) => (
                  <li key={item.id}>
                    <Link
                      href={item.href}
                      className="text-neutral-300 hover:text-accent transition-colors"
                    >
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Contato */}
            <div>
              <h3 className="text-neutral-50 font-semibold mb-4">Escritório</h3>
              <address className="not-italic text-neutral-300 space-y-3">
                {settings?.address && (
                  <p className="whitespace-pre-line">{settings.address}</p>
                )}
                {settings?.phone && (
                  <p>
                    <a
                      href={`tel:${settings.phone.replace(/\D/g, '')}`}
                      className="hover:text-accent transition-colors"
                    >
                      {settings.phone}
                    </a>
                  </p>
                )}
                {settings?.email && (
                  <p>
                    <a
                      href={`mailto:${settings.email}`}
                      className="hover:text-accent transition-colors"
                    >
                      {settings.email}
                    </a>
                  </p>
                )}
              </address>
            </div>
          </div>

          {/* Copyright */}
          <div className="mt-16 pt-8 border-t border-neutral-500/10">
            <div className="flex flex-col md:flex-row justify-between items-center gap-4">
              <p className="text-neutral-400 text-sm">
                {settings?.copyrightText || `© ${currentYear} LEX. Todos os direitos reservados.`}
              </p>
              <div className="flex gap-6 text-sm">
                <Link
                  href="/privacidade"
                  className="text-neutral-400 hover:text-accent transition-colors"
                >
                  Política de Privacidade
                </Link>
                <Link
                  href="/termos"
                  className="text-neutral-400 hover:text-accent transition-colors"
                >
                  Termos de Uso
                </Link>
              </div>
            </div>
          </div>
        </div>
      </Container>
    </footer>
  );
}
