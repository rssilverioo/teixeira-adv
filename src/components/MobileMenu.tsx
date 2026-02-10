'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import SocialLinks from './SocialLinks';

interface MobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
  navItems?: { label: string; href: string }[];
}

const defaultMenuItems = [
  { label: 'Sobre', href: '/sobre' },
  { label: 'Nossos Serviços', href: '/servicos' },
  { label: 'Laboratório de Inovação', href: '/innovation-lab' },
  { label: 'Nosso Time', href: '/time' },
  { label: 'Na Mídia', href: '/midia' },
  { label: 'Podcast', href: '/podcast' },
  { label: 'Contate-nos', href: '/contato' },
];

export default function MobileMenu({ isOpen, onClose, navItems }: MobileMenuProps) {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40"
            onClick={onClose}
          />

          {/* Menu Panel */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'tween', duration: 0.3 }}
            className="fixed top-0 right-0 bottom-0 w-full max-w-sm bg-primary-light border-l border-neutral-500/20 z-50 overflow-y-auto"
          >
            <div className="p-6">
              {/* Close Button */}
              <button
                onClick={onClose}
                className="ml-auto flex items-center justify-center w-10 h-10 rounded-full hover:bg-neutral-500/10 transition-colors"
                aria-label="Fechar menu"
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
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>

              {/* Menu Items */}
              <nav className="mt-8 space-y-1">
                {(navItems && navItems.length > 0 ? navItems : defaultMenuItems).map((item, index) => (
                  <motion.div
                    key={item.href}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                  >
                    <Link
                      href={item.href}
                      onClick={onClose}
                      className="block py-3 px-4 text-neutral-50 hover:text-accent hover:bg-accent/5 rounded-lg transition-all duration-200 font-medium"
                    >
                      {item.label}
                    </Link>
                  </motion.div>
                ))}
              </nav>

              {/* Social Links */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
                className="mt-12 pt-8 border-t border-neutral-500/20"
              >
                <p className="text-sm text-neutral-300 mb-4">Siga-nos</p>
                <SocialLinks />
              </motion.div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
