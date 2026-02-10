import { cn } from '@/lib/utils';

interface TagProps {
  children: React.ReactNode;
  className?: string;
  variant?: 'default' | 'accent' | 'outline';
}

export default function Tag({ 
  children, 
  className,
  variant = 'default' 
}: TagProps) {
  return (
    <span
      className={cn(
        'inline-block px-3 py-1 text-xs font-medium rounded-full transition-colors',
        variant === 'default' && 'bg-neutral-500/20 text-neutral-100',
        variant === 'accent' && 'bg-accent/20 text-accent',
        variant === 'outline' && 'border border-neutral-300 text-neutral-200',
        className
      )}
    >
      {children}
    </span>
  );
}
