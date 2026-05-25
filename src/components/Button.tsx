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
    ref,
  ) => {
    const baseStyles =
      'inline-flex items-center justify-center gap-2 font-semibold rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 shadow-sm hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:shadow-sm';

    const variants = {
      primary: 'focus:ring-[var(--brand-amber)]',
      secondary: 'focus:ring-[var(--brand-cobalt)]',
      danger: 'focus:ring-[var(--error)]',
      outline: 'border-2 bg-transparent focus:ring-[var(--brand-cobalt)]',
    };

    const sizes = {
      sm: 'px-3 py-1 text-sm',
      md: 'px-4 py-2 text-base',
      lg: 'px-6 py-3 text-lg',
    };

    const getButtonStyle = (): React.CSSProperties => {
      switch (variant) {
        case 'primary':
          return {
            backgroundColor: 'var(--button-primary-bg)',
            color: 'var(--button-primary-text)',
            boxShadow: 'var(--shadow-amber)',
          };
        case 'secondary':
          return {
            backgroundColor: 'var(--button-secondary-bg)',
            color: 'var(--button-secondary-text)',
            border: '1px solid var(--button-secondary-border)',
            boxShadow: 'var(--shadow-xs)',
          };
        case 'danger':
          return {
            backgroundColor: 'var(--button-danger-bg)',
            color: 'var(--button-danger-text)',
            boxShadow: 'var(--shadow-sm)',
          };
        case 'outline':
          return {
            borderColor: 'var(--button-outline-border)',
            color: 'var(--button-outline-text)',
          };
        default:
          return {};
      }
    };

    const handleMouseEnter = (event: React.MouseEvent<HTMLButtonElement>) => {
      if (disabled || loading || variant !== 'primary') {
        return;
      }

      const button = event.currentTarget;
      button.style.backgroundColor = 'var(--button-primary-hover-bg)';
      button.style.color = 'var(--button-primary-hover-text)';
      button.style.boxShadow = 'var(--shadow-cobalt)';
      button.style.transform = 'translateY(-2px)';
    };

    const handleMouseLeave = (event: React.MouseEvent<HTMLButtonElement>) => {
      if (variant !== 'primary') {
        return;
      }

      const button = event.currentTarget;
      const styles = getButtonStyle();
      button.style.backgroundColor = String(styles.backgroundColor ?? '');
      button.style.color = String(styles.color ?? '');
      button.style.boxShadow = String(styles.boxShadow ?? '');
      button.style.transform = 'translateY(0)';
    };

    return (
      <button
        ref={ref}
        disabled={disabled || loading}
        className={clsx(baseStyles, variants[variant], sizes[size], className)}
        style={getButtonStyle()}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
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
  },
);

Button.displayName = 'Button';
