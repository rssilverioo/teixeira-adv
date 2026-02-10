'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import Container from './Container';
import SocialLinks from './SocialLinks';
import MobileMenu from './MobileMenu';

interface NavItemData {
  label: string;
  href: string;
}

interface NavbarProps {
  navItems?: NavItemData[];
  siteName?: string;
  logoUrl?: string | null;
}

const defaultMenuItems = [
  { label: 'Sobre', href: '/sobre' },
  { label: 'Nossos Serviços', href: '/servicos' },
  { label: 'Laboratório de inovação', href: '/innovation-lab' },
  { label: 'Nosso time', href: '/time' },
  { label: 'Na mídia', href: '/midia' },
  { label: 'Podcast', href: '/podcast' },
  { label: 'Contate-nos', href: '/contato' },
];

export default function Navbar({ navItems, siteName = 'LEX', logoUrl }: NavbarProps) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <>
      <header
        className={cn(
          'fixed top-0 left-0 right-0 z-50 transition-all duration-300',
          isScrolled
            ? 'bg-primary/95 backdrop-blur-md border-b border-neutral-500/10 shadow-xl'
            : 'bg-transparent'
        )}
      >
        <Container>
          <nav className="flex items-center justify-between h-20 md:h-28">
            {/* Logo */}
            <Link
              href="/"
              className="flex items-center hover:opacity-90 transition-opacity py-2"
            >
              {logoUrl ? (
                <img
                  src={logoUrl}
                  alt={siteName}
                  className="h-12 md:h-20 w-auto object-contain"
                />
              ) : (
                <span className="text-2xl md:text-3xl font-serif font-bold text-neutral-50">
                  <span className="text-accent">{siteName.charAt(0)}</span>{siteName.slice(1)}
                </span>
              )}
            </Link>

            {/* Desktop Menu */}
            <div className="hidden lg:flex items-center gap-8">
              {(navItems && navItems.length > 0 ? navItems : defaultMenuItems).map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    'text-sm font-medium transition-colors relative group',
                    pathname === item.href
                      ? 'text-accent'
                      : 'text-neutral-200 hover:text-accent'
                  )}
                >
                  {item.label}
                  <span
                    className={cn(
                      'absolute -bottom-1 left-0 w-0 h-0.5 bg-accent transition-all duration-300 group-hover:w-full',
                      pathname === item.href && 'w-full'
                    )}
                  />
                </Link>
              ))}
            </div>

            {/* Social Links - Desktop */}
            <div className="hidden lg:flex">
              <SocialLinks iconSize="small" />
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMobileMenuOpen(true)}
              className="lg:hidden flex items-center justify-center w-10 h-10 rounded-lg hover:bg-neutral-500/10 transition-colors"
              aria-label="Abrir menu"
            >
              <svg
                className="w-6 h-6 text-neutral-50"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
            </button>
          </nav>
        </Container>
      </header>

      {/* Mobile Menu */}
      <MobileMenu
        isOpen={isMobileMenuOpen}
        onClose={() => setIsMobileMenuOpen(false)}
        navItems={navItems && navItems.length > 0 ? navItems : defaultMenuItems}
      />
    </>
  );
}
