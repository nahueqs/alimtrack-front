import { type ButtonHTMLAttributes, forwardRef, type ReactNode } from 'react';
import './Button.css';

type ButtonVariant = 'primary' | 'secondary' | 'text' | 'outline' | 'link';

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  isLoading?: boolean;
  fullWidth?: boolean;
  icon?: ReactNode;
  iconPosition?: 'left' | 'right';
  href?: string;
  target?: string;
}

export const Button = forwardRef<HTMLButtonElement | HTMLAnchorElement, ButtonProps>(
  (
    {
      children,
      variant = 'primary',
      isLoading = false,
      className = '',
      disabled = false,
      fullWidth = false,
      icon,
      iconPosition = 'left',
      type = 'button',
      href,
      target,
      ...props
    },
    ref
  ) => {
    const baseClasses = 'btn';
    const variantClass = `btn--${variant}`;
    const widthClass = fullWidth ? 'w-full' : '';
    const loadingClass = isLoading ? 'btn--loading' : '';
    const disabledClass = disabled ? 'opacity-50 cursor-not-allowed' : '';

    const content = (
      <span className="btn__content">
        {icon && iconPosition === 'left' && (
          <span className="btn__icon btn__icon--left">{icon}</span>
        )}
        <span className="btn__label">{children}</span>
        {icon && iconPosition === 'right' && (
          <span className="btn__icon btn__icon--right">{icon}</span>
        )}
      </span>
    );

    if (href) {
      return (
        <a
          ref={ref as React.Ref<HTMLAnchorElement>}
          href={href}
          target={target}
          className={`${baseClasses} ${variantClass} ${widthClass} ${loadingClass} ${disabledClass} ${className}`}
          aria-disabled={disabled || isLoading}
          {...(props as any)}
        >
          {isLoading ? (
            <span className="flex items-center justify-center">
              <span className="btn__spinner"></span>
              <span className="ml-2">Cargando...</span>
            </span>
          ) : (
            content
          )}
        </a>
      );
    }

    return (
      <button
        ref={ref as React.Ref<HTMLButtonElement>}
        type={type}
        disabled={disabled || isLoading}
        className={`${baseClasses} ${variantClass} ${widthClass} ${loadingClass} ${disabledClass} ${className}`}
        {...props}
      >
        {isLoading ? (
          <span className="flex items-center justify-center">
            <span className="btn__spinner"></span>
            <span className="ml-2">Cargando...</span>
          </span>
        ) : (
          content
        )}
      </button>
    );
  }
);

Button.displayName = 'Button';
