export interface BaseComponentProps {
  className?: string;
  children?: React.ReactNode;
}

export interface InteractiveComponentProps extends BaseComponentProps {
  onClick?: () => void;
  disabled?: boolean;
}

export interface IconComponentProps extends BaseComponentProps {
  icon?: string;
  iconPosition?: 'left' | 'right' | 'top' | 'bottom';
}

export interface LoadingComponentProps extends BaseComponentProps {
  isLoading?: boolean;
  loadingText?: string;
}

export interface ErrorComponentProps extends BaseComponentProps {
  error?: string | null;
  onRetry?: () => void;
}

export type Position = 'top' | 'right' | 'bottom' | 'left' | 'center';

export interface PositionableComponentProps extends BaseComponentProps {
  position?: Position;
} 