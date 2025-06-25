import React, { useState, useRef, useEffect } from 'react';
import { Package } from 'lucide-react';

interface LazyImageProps {
  src: string;
  alt: string;
  className?: string;
  fallbackClassName?: string;
  placeholder?: React.ReactNode;
  onLoad?: () => void;
  onError?: () => void;
}

export function LazyImage({ 
  src, 
  alt, 
  className = '', 
  fallbackClassName = '',
  placeholder,
  onLoad,
  onError 
}: LazyImageProps) {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isError, setIsError] = useState(false);
  const [isInView, setIsInView] = useState(false);
  const imgRef = useRef<HTMLImageElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true);
          observer.disconnect();
        }
      },
      {
        threshold: 0.1,
        rootMargin: '50px'
      }
    );

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    return () => observer.disconnect();
  }, []);

  const handleLoad = () => {
    setIsLoaded(true);
    onLoad?.();
  };

  const handleError = () => {
    setIsError(true);
    onError?.();
  };

  const defaultPlaceholder = (
    <div className={`bg-gray-100 flex items-center justify-center ${className}`}>
      <div className="text-center">
        <div className="w-8 h-8 border-2 border-gray-300 border-t-[#183263] rounded-full animate-spin mx-auto mb-2"></div>
        <p className="text-xs text-gray-500">Carregando...</p>
      </div>
    </div>
  );

  const errorFallback = (
    <div className={`bg-gradient-to-br from-[#183263] to-[#3a5a8c] flex items-center justify-center ${fallbackClassName || className}`}>
      <div className="text-center text-white p-4">
        <Package className="w-8 h-8 mx-auto mb-2 opacity-80" />
        <p className="text-xs font-medium opacity-90 line-clamp-2">{alt}</p>
      </div>
    </div>
  );

  return (
    <div ref={containerRef} className={className}>
      {!isInView && (placeholder || defaultPlaceholder)}
      
      {isInView && !isError && (
        <>
          {!isLoaded && (placeholder || defaultPlaceholder)}
          <img
            ref={imgRef}
            src={src}
            alt={alt}
            className={`${className} ${isLoaded ? 'opacity-100' : 'opacity-0'} transition-opacity duration-300`}
            onLoad={handleLoad}
            onError={handleError}
            style={{ display: isLoaded ? 'block' : 'none' }}
          />
        </>
      )}
      
      {isError && errorFallback}
    </div>
  );
} 