import React from 'react';

interface SpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export const Spinner: React.FC<SpinnerProps> = ({ size = 'md', className = '' }) => {
  const sizeClasses = {
    sm: 'h-4 w-4 border-2',
    md: 'h-6 w-6 border-3',
    lg: 'h-8 w-8 border-4',
  };

  return (
    <div
      className={`animate-spin rounded-full border-t-transparent ${sizeClasses[size]} ${className}`}
      style={{
        borderColor: 'var(--border-color)',
        borderTopColor: 'var(--accent-primary)',
      }}
      role="status"
      aria-label="Loading"
    />
  );
};

// Full page spinner with backdrop
export const FullPageSpinner: React.FC<{ message?: string }> = ({ message = 'Loading...' }) => {
  return (
    <div className="flex min-h-[50vh] flex-col items-center justify-center gap-4 px-4">
      <Spinner size="lg" />
      <p className="text-sm font-medium" style={{ color: 'var(--text-secondary)' }}>
        {message}
      </p>
    </div>
  );
};

// Inline spinner for buttons
export const ButtonSpinner: React.FC = () => {
  return <Spinner size="sm" className="inline-block mr-2" />;
};

export default Spinner;
