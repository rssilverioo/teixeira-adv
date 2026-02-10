import { ReactNode } from 'react';
import { cn } from '@/lib/utils';

interface CardProps {
  children: ReactNode;
  className?: string;
  hover?: boolean;
  padding?: 'default' | 'large' | 'small' | 'none';
}

export default function Card({ 
  children, 
  className,
  hover = true,
  padding = 'default'
}: CardProps) {
  return (
    <div
      className={cn(
        'bg-primary-light rounded-lg border border-neutral-500/10',
        hover && 'transition-all duration-300 hover:border-accent/30 hover:shadow-xl hover:shadow-accent/5 hover:-translate-y-1',
        padding === 'default' && 'p-6',
        padding === 'large' && 'p-8',
        padding === 'small' && 'p-4',
        padding === 'none' && 'p-0',
        className
      )}
    >
      {children}
    </div>
  );
}
