// components/dashboard/DashboardCard.tsx
import React, { type ReactNode } from 'react';
import { CloseOutlined, LoadingOutlined } from '@ant-design/icons';
import './DashboardCard.css';

export interface DashboardCardProps {
  /** Card title */
  title: string;
  /** Card description */
  description?: string;
  /** Card content */
  children: ReactNode;
  /** Additional CSS class */
  className?: string;
  /** Visual style variant */
  variant?: 'default' | 'primary' | 'success' | 'warning' | 'danger';
  /** Size of the card */
  size?: 'sm' | 'md' | 'lg';
  /** Enable hover effect */
  hoverEffect?: boolean;
  /** Make card full width */
  fullWidth?: boolean;
  /** Error message to display */
  error?: string;
  /** Callback when error is dismissed */
  onErrorDismiss?: () => void;
  /** Custom footer content */
  footerContent?: ReactNode;
  /** Optional icon to display in the header */
  icon?: ReactNode;
  /** Loading state */
  loading?: boolean;
}

export const DashboardCard: React.FC<DashboardCardProps> = ({
  title,
  description,
  children,
  className = '',
  variant = 'default',
  size = 'md',
  hoverEffect = true,
  fullWidth = false,
  error,
  onErrorDismiss,
  footerContent,
  icon,
  loading = false,
}) => {
  const cardClasses = [
    'dashboard-card',
    `dashboard-card--${variant}`,
    hoverEffect && 'dashboard-card--hoverable',
    fullWidth && 'w-full',
    className,
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <div className={cardClasses}>
      {loading && (
        <div className="dashboard-card__loading">
          <LoadingOutlined style={{ fontSize: 24 }} spin />
        </div>
      )}

      <div className="dashboard-card__header">
        <div className="flex items-center gap-3">
          {icon && <span className="dashboard-card__icon">{icon}</span>}
          <h3 className="dashboard-card__title">{title}</h3>
        </div>
        {description && <p className="dashboard-card__description">{description}</p>}
      </div>

      <div className="dashboard-card__content">
        {error ? (
          <div className="dashboard-card__error">
            <span>{error}</span>
            {onErrorDismiss && (
              <button
                onClick={onErrorDismiss}
                className="dashboard-card__error-dismiss"
                aria-label="Dismiss error"
              >
                <CloseOutlined />
              </button>
            )}
          </div>
        ) : (
          children
        )}
      </div>

      {footerContent && <div className="dashboard-card__footer">{footerContent}</div>}
    </div>
  );
};

// Button component for card actions
export const DashboardCardButton: React.FC<{
  children: ReactNode;
  onClick: () => void;
  variant?: 'default' | 'primary' | 'outline' | 'ghost';
  disabled?: boolean;
  className?: string;
  loading?: boolean;
  type?: 'button' | 'submit' | 'reset';
  icon?: ReactNode;
}> = ({
  children,
  onClick,
  variant = 'default',
  disabled = false,
  className = '',
  loading = false,
  type = 'button',
  icon,
}) => (
  <button
    type={type}
    className={`dashboard-card__btn ${
      variant === 'primary'
        ? 'dashboard-card__btn--primary'
        : variant === 'outline'
          ? 'dashboard-card__btn--outline'
          : variant === 'ghost'
            ? 'dashboard-card__btn--ghost'
            : ''
    } ${loading ? 'opacity-75 cursor-not-allowed' : ''} ${className}`}
    onClick={onClick}
    disabled={disabled || loading}
  >
    {loading && <LoadingOutlined className="mr-2" spin />}
    {!loading && icon && <span className="mr-2">{icon}</span>}
    {children}
  </button>
);

// Buttons container for better layout
export const DashboardCardButtons: React.FC<{
  children: ReactNode;
  className?: string;
  align?: 'start' | 'center' | 'end' | 'between';
}> = ({ children, className = '', align = 'start' }) => {
  const alignment = {
    start: 'justify-start',
    center: 'justify-center',
    end: 'justify-end',
    between: 'justify-between',
  }[align];

  return (
    <div className={`flex flex-wrap gap-3 mt-auto pt-4 ${alignment} ${className}`}>{children}</div>
  );
};
