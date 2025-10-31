// components/dashboard/DashboardCard.tsx
import React from 'react';
import './DashboardCard.css';

interface DashboardCardProps {
  title: string;
  description: string;
  children: React.ReactNode;
  className?: string;
}

export const DashboardCard: React.FC<DashboardCardProps> = ({
  title,
  description,
  children,
  className = ''
}) => {
  return (
    <div className={`dashboard__card ${className}`}>
      <h3 className="dashboard__card-title">{title}</h3>
      <p className="dashboard__card-description">{description}</p>
      <div className="dashboard__card-actions">
        {children}
      </div>
    </div>
  );
};