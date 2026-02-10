import Link from 'next/link';
import { cn } from '@/lib/utils';

interface CTAButtonProps {
  children: React.ReactNode;
  href: string;
  variant?: 'primary' | 'secondary' | 'outline';
  size?: 'default' | 'large' | 'small';
  className?: string;
  external?: boolean;
}

export default function CTAButton({
  children,
  href,
  variant = 'primary',
  size = 'default',
  className,
  external = false,
}: CTAButtonProps) {
  const baseStyles = 'inline-flex items-center justify-center font-medium transition-all duration-300 rounded-sm';
  
  const variants = {
    primary: 'bg-accent text-primary hover:bg-accent-light hover:shadow-lg hover:shadow-accent/20',
    secondary: 'bg-neutral-50 text-primary hover:bg-neutral-100',
    outline: 'border-2 border-accent text-accent hover:bg-accent hover:text-primary',
  };

  const sizes = {
    small: 'px-6 py-2.5 text-sm',
    default: 'px-8 py-3.5 text-base',
    large: 'px-10 py-4 text-lg',
  };

  const combinedClassName = cn(
    baseStyles,
    variants[variant],
    sizes[size],
    className
  );

  if (external) {
    return (
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className={combinedClassName}
      >
        {children}
      </a>
    );
  }

  return (
    <Link href={href} className={combinedClassName}>
      {children}
    </Link>
  );
}
