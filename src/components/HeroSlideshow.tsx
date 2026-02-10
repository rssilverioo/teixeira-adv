'use client';

import { useState, useEffect, useCallback } from 'react';
import Image from 'next/image';

interface HeroSlideshowProps {
  images: string[];
  interval?: number;
}

export default function HeroSlideshow({ images, interval = 6000 }: HeroSlideshowProps) {
  const [currentIndex, setCurrentIndex] = useState(0);

  const advance = useCallback(() => {
    setCurrentIndex((prev) => (prev + 1) % images.length);
  }, [images.length]);

  useEffect(() => {
    if (images.length <= 1) return;
    const timer = setInterval(advance, interval);
    return () => clearInterval(timer);
  }, [advance, interval, images.length]);

  if (images.length === 0) return null;

  return (
    <div className="absolute inset-0">
      {images.map((src, index) => (
        <div
          key={src}
          className="absolute inset-0 transition-opacity duration-1000 ease-in-out"
          style={{ opacity: index === currentIndex ? 1 : 0 }}
        >
          <Image
            src={src}
            alt=""
            fill
            className="object-cover"
            priority={index === 0}
            sizes="100vw"
          />
        </div>
      ))}
      <div className="absolute inset-0 bg-primary/70" />
    </div>
  );
}
