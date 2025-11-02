// components/dashboard/DashboardCard.tsx
import React from 'react';
import { Card, CardHeader, CardFooter, CardTitle, CardDescription } from '../ui';
import './DashboardCard.css';

interface DashboardCardProps {
  title: string;
  description: string;
  children: React.ReactNode;
  className?: string;
  variant?: 'default' | 'outlined' | 'elevated' | 'filled';
  size?: 'sm' | 'md' | 'lg';
  hoverEffect?: boolean;
}

export const DashboardCard: React.FC<DashboardCardProps> = ({
  title,
  description,
  children,
  className = '',
  variant = 'default',
  size = 'md',
  hoverEffect = true,
}) => {
  return (
    <Card
      className={`dashboard-card ${className}`}
      variant={variant}
      size={size}
      hoverEffect={hoverEffect}
    >
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardFooter className="dashboard-card__footer">{children}</CardFooter>
    </Card>
  );
};
