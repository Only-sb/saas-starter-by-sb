import React from 'react';
import { clsx } from 'clsx';

/**
 * Componente de Loading Spinner
 * Exibe um indicador de carregamento animado
 */
const LoadingSpinner = ({ 
  size = 'md', 
  color = 'primary', 
  className = '',
  ...props 
}) => {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-6 h-6',
    lg: 'w-8 h-8',
    xl: 'w-12 h-12'
  };

  const colorClasses = {
    primary: 'text-primary-600',
    secondary: 'text-secondary-600',
    white: 'text-white',
    gray: 'text-gray-600'
  };

  return (
    <div
      className={clsx(
        'animate-spin inline-block border-2 border-current border-t-transparent rounded-full',
        sizeClasses[size],
        colorClasses[color],
        className
      )}
      role="status"
      aria-label="Carregando..."
      {...props}
    >
      <span className="sr-only">Carregando...</span>
    </div>
  );
};

export default LoadingSpinner;