"use client";

import React from 'react';

interface ExternalLinkProps {
  href: string;
  children: React.ReactNode;
  className?: string;
  target?: string;
}

export default function ExternalLink({ href, children, className, target = "_blank" }: ExternalLinkProps) {
  return (
    <a
      href={href}
      target={target}
      rel="noopener noreferrer"
      className={className}
      onClick={(e) => e.stopPropagation()}
    >
      {children}
    </a>
  );
}
