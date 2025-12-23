import React from 'react';

interface LoadingSkeletonProps {
  className?: string;
  width?: string;
  height?: string;
  rounded?: boolean;
}

export const LoadingSkeleton: React.FC<LoadingSkeletonProps> = ({
  className = '',
  width = 'w-full',
  height = 'h-4',
  rounded = true
}) => {
  return (
    <div
      className={`animate-pulse bg-gray-200 ${width} ${height} ${
        rounded ? 'rounded' : ''
      } ${className}`}
    />
  );
};

interface CardSkeletonProps {
  lines?: number;
  showAvatar?: boolean;
  className?: string;
}

export const CardSkeleton: React.FC<CardSkeletonProps> = ({
  lines = 3,
  showAvatar = false,
  className = ''
}) => {
  return (
    <div className={`animate-pulse p-4 ${className}`}>
      <div className="flex items-center space-x-4">
        {showAvatar && (
          <div className="w-10 h-10 bg-gray-200 rounded-full" />
        )}
        <div className="flex-1 space-y-2">
          {Array.from({ length: lines }).map((_, index) => (
            <LoadingSkeleton
              key={index}
              width={index === lines - 1 ? 'w-3/4' : 'w-full'}
              height="h-3"
            />
          ))}
        </div>
      </div>
    </div>
  );
};

interface ButtonSkeletonProps {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export const ButtonSkeleton: React.FC<ButtonSkeletonProps> = ({
  size = 'md',
  className = ''
}) => {
  const sizeClasses = {
    sm: 'h-8 w-20',
    md: 'h-10 w-24',
    lg: 'h-12 w-32'
  };

  return (
    <LoadingSkeleton
      className={`${sizeClasses[size]} ${className}`}
      rounded={true}
    />
  );
};