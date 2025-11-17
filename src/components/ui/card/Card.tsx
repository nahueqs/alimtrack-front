import React, { type ReactNode } from 'react';
import './Card.css';

type CardVariant = 'default' | 'outlined' | 'elevated' | 'filled';
type CardSize = 'sm' | 'md' | 'lg';

interface CardProps {
  children: ReactNode;
  className?: string;
  variant?: CardVariant;
  size?: CardSize;
  hoverEffect?: boolean;
  onClick?: () => void;
  style?: React.CSSProperties;
}

export const Card: React.FC<CardProps> = ({
  children,
  className = '',
  variant = 'default',
  size = 'md',
  hoverEffect = true,
  onClick,
  style,
  ...props
}) => {
  const cardClasses = [
    'card',
    `card--${variant}`,
    `card--${size}`,
    hoverEffect && 'card--hoverable',
    className,
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <div className={cardClasses} onClick={onClick} style={style} {...props}>
      {children}
    </div>
  );
};

// Subcomponentes para la estructura de la tarjeta
interface CardHeaderProps {
  children: ReactNode;
  className?: string;
  withBorder?: boolean;
}

export const CardHeader: React.FC<CardHeaderProps> = ({
  children,
  className = '',
  withBorder = false,
}) => (
  <div className={`card__header ${withBorder ? 'card__header--bordered' : ''} ${className}`}>
    {children}
  </div>
);

interface CardContentProps {
  children: ReactNode;
  className?: string;
}

export const CardContent: React.FC<CardContentProps> = ({ children, className = '' }) => (
  <div className={`card__content ${className}`}>{children}</div>
);

interface CardFooterProps {
  children: ReactNode;
  className?: string;
  align?: 'start' | 'center' | 'end' | 'space-between';
}

export const CardFooter: React.FC<CardFooterProps> = ({
  children,
  className = '',
  align = 'start',
}) => <div className={`card__footer card__footer--${align} ${className}`}>{children}</div>;

interface CardTitleProps {
  children: ReactNode;
  className?: string;
  as?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' | 'div';
}

export const CardTitle: React.FC<CardTitleProps> = ({
  children,
  className = '',
  as: Tag = 'h3',
}) => <Tag className={`card__title ${className}`}>{children}</Tag>;

interface CardDescriptionProps {
  children: ReactNode;
  className?: string;
}

export const CardDescription: React.FC<CardDescriptionProps> = ({ children, className = '' }) => (
  <p className={`card__description ${className}`}>{children}</p>
);
