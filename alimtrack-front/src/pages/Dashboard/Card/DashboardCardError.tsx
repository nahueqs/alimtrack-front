import React from 'react';
import { CloseOutlined } from '@ant-design/icons';
import { Button } from '../../../components/ui';

interface Props {
  error?: string;
  onDismiss?: () => void;
}

export const DashboardCardError: React.FC<Props> = ({ error, onDismiss }) => {
  if (!error) return null;

  return (
    <div className="dashboard-card__error" role="status" aria-live="polite">
      <span
        className="dashboard-card__error-text"
        style={{ color: 'var(--color-danger, #d9534f)' }}
      >
        {error}
      </span>
      {onDismiss && (
        <Button
          variant="text"
          onClick={onDismiss}
          className="dashboard-card__error-dismiss"
          aria-label="Dismiss error"
          icon={<CloseOutlined />}
          iconPosition="left"
          type="button"
        />
      )}
    </div>
  );
};

export default DashboardCardError;
