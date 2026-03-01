import { useState } from 'react';

interface ImageWithSkeletonProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  skeletonClassName?: string;
}

export function ImageWithSkeleton({ src, alt, className = '', skeletonClassName = '', style, ...props }: ImageWithSkeletonProps) {
  const [isLoaded, setIsLoaded] = useState(false);

  return (
    <div className={`relative overflow-hidden w-full h-full ${className}`} style={style}>
      {/* Skeleton overlay */}
      {!isLoaded && src && (
        <div 
          className={`absolute inset-0 bg-gray-200 animate-pulse z-10 ${skeletonClassName}`} 
        />
      )}
      
      {/* Actual image */}
      {src && (
        <img
          src={src}
          alt={alt}
          className={`w-full h-full object-cover transition-opacity duration-300 ${
            isLoaded ? 'opacity-100' : 'opacity-0'
          }`}
          onLoad={() => setIsLoaded(true)}
          {...props}
        />
      )}
    </div>
  );
}
