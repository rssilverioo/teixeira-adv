import { ReactNode } from 'react';
import { cn } from '@/lib/utils';

interface ContainerProps {
  children: ReactNode;
  className?: string;
  size?: 'default' | 'large' | 'full';
}

export default function Container({ 
  children, 
  className,
  size = 'default' 
}: ContainerProps) {
  return (
    <div
      className={cn(
        'mx-auto px-6 md:px-8 lg:px-12',
        size === 'default' && 'max-w-7xl',
        size === 'large' && 'max-w-[1400px]',
        size === 'full' && 'max-w-full',
        className
      )}
    >
      {children}
    </div>
  );
}
