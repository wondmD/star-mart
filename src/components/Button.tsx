import React from 'react';
import { clsx } from 'clsx';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
  children: React.ReactNode;
}

function ButtonSpinner() {
  return (
    <span
      className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent"
      aria-hidden="true"
    />
  );
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      variant = 'primary',
      size = 'md',
      loading = false,
      className,
      disabled,
      children,
      ...props
    },
    ref
  ) => {
    const baseStyles = 'font-semibold rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 shadow-sm hover:shadow-md';

    const variants = {
      primary: 'text-white focus:ring-offset-2',
      secondary: 'text-gray-900 focus:ring-offset-2',
      danger: 'text-white focus:ring-offset-2',
      outline: 'border-2 focus:ring-offset-2',
    };

    const sizes = {
      sm: 'px-3 py-1 text-sm',
      md: 'px-4 py-2 text-base',
      lg: 'px-6 py-3 text-lg',
    };

    const getStyles = () => {
      const primaryStyle = {
        backgroundColor: 'var(--accent-primary)',
        boxShadow: '0 14px 30px rgba(0, 173, 181, 0.24)',
      };
      const primaryHover = {
        backgroundColor: 'var(--accent-secondary)',
        color: 'var(--bg-primary)',
        boxShadow: '0 18px 35px rgba(34, 40, 49, 0.28)',
      };
      const secondaryStyle = {
        backgroundColor: 'var(--bg-secondary)',
        color: 'var(--text-primary)',
        border: '1px solid var(--border-color)',
      };
      const dangerStyle = {
        backgroundColor: 'var(--error)',
        color: 'var(--bg-primary)',
      };
      const outlineStyle = {
        borderColor: 'var(--accent-primary)',
        color: 'var(--accent-primary)',
        backgroundColor: 'transparent',
      };

      return { primaryStyle, primaryHover, secondaryStyle, dangerStyle, outlineStyle };
    };

    const { primaryStyle, primaryHover, secondaryStyle, dangerStyle, outlineStyle } = getStyles();

    const getButtonStyle = () => {
      switch (variant) {
        case 'primary':
          return primaryStyle;
        case 'secondary':
          return secondaryStyle;
        case 'danger':
          return dangerStyle;
        case 'outline':
          return outlineStyle;
        default:
          return primaryStyle;
      }
    };

    return (
      <button
        ref={ref}
        disabled={disabled || loading}
        className={clsx(
          baseStyles,
          variants[variant],
          sizes[size],
          (disabled || loading) && 'opacity-50 cursor-not-allowed',
          className
        )}
        style={getButtonStyle()}
        onMouseEnter={(e) => {
          if (variant === 'primary' && !disabled && !loading) {
            (e.currentTarget as HTMLButtonElement).style.backgroundColor = 'var(--accent-secondary)';
            (e.currentTarget as HTMLButtonElement).style.color = 'var(--bg-primary)';
            (e.currentTarget as HTMLButtonElement).style.boxShadow = '0 18px 35px rgba(34, 40, 49, 0.28)';
            (e.currentTarget as HTMLButtonElement).style.transform = 'translateY(-2px)';
          }
        }}
        onMouseLeave={(e) => {
          if (variant === 'primary') {
            (e.currentTarget as HTMLButtonElement).style.backgroundColor = 'var(--accent-primary)';
            (e.currentTarget as HTMLButtonElement).style.color = 'white';
            (e.currentTarget as HTMLButtonElement).style.boxShadow = '0 14px 30px rgba(0, 173, 181, 0.24)';
            (e.currentTarget as HTMLButtonElement).style.transform = 'translateY(0)';
          }
        }}
        {...props}
      >
        {loading ? (
          <>
            <ButtonSpinner />
            {typeof children === 'string' ? 'Loading...' : children}
          </>
        ) : (
          children
        )}
      </button>
    );
  }
);

Button.displayName = 'Button';
