import React from 'react';
import { LoadingOutlined } from '@ant-design/icons';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui';
import DashboardCardError from './DashboardCardError.tsx';

interface DashboardCardProps {
  title: string;
  description?: string;
  children?: React.ReactNode;
  className?: string;
  variant?: 'default' | 'primary' | 'secondary' | 'success' | 'warning' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  hoverEffect?: boolean;
  fullWidth?: boolean;
  error?: string;
  onErrorDismiss?: () => void;
  footerContent?: React.ReactNode;
  icon?: React.ReactNode;
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
  const dashboardVariantClass = `card--dashboard-${variant}`;
  const wrapperClass = [fullWidth && 'w-full', 'card--dashboard', dashboardVariantClass, className]
    .filter(Boolean)
    .join(' ');

  return (
    // data-variant/data-fullwidth permiten aplicar paleta y reglas en Index.css
    <Card
      className={wrapperClass}
      size={size}
      hoverEffect={hoverEffect}
      data-variant={variant}
      data-fullwidth={fullWidth ? 'true' : 'false'}
    >
      {loading && (
        <div className="dashboard-card__loading" aria-hidden>
          {/* color del spinner controlado por CSS: .dashboard-card__loading svg { color: var(--color-primary); } */}
          <LoadingOutlined style={{ fontSize: 24 }} spin />
        </div>
      )}

      <CardHeader className="dashboard-card__header">
        <div className="flex items-center gap-3">
          {icon && <span className="dashboard-card__icon">{icon}</span>}
          <CardTitle className="dashboard-card__title">{title}</CardTitle>
        </div>
        {description && (
          <CardDescription className="dashboard-card__description">{description}</CardDescription>
        )}
      </CardHeader>

      <CardContent className="dashboard-card__content">
        <DashboardCardError error={error} onDismiss={onErrorDismiss} />
        {children} {/* ← Contenido directo sin filtros */}
      </CardContent>

      {footerContent && (
        <CardFooter className="dashboard-card__footer">{footerContent}</CardFooter>
      )}
    </Card>
  );
};

export default DashboardCard;
