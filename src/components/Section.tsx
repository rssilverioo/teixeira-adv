import { ReactNode } from 'react';
import { cn } from '@/lib/utils';
import Container from './Container';

interface SectionProps {
  children: ReactNode;
  className?: string;
  containerClassName?: string;
  background?: 'default' | 'dark' | 'darker';
  padding?: 'default' | 'large' | 'small';
  id?: string;
}

export default function Section({
  children,
  className,
  containerClassName,
  background = 'default',
  padding = 'default',
  id,
}: SectionProps) {
  return (
    <section
      id={id}
      className={cn(
        'relative',
        background === 'default' && 'bg-primary',
        background === 'dark' && 'bg-primary-light',
        background === 'darker' && 'bg-black',
        padding === 'default' && 'py-20 md:py-28',
        padding === 'large' && 'py-28 md:py-36',
        padding === 'small' && 'py-12 md:py-16',
        className
      )}
    >
      <Container className={containerClassName}>
        {children}
      </Container>
    </section>
  );
}
