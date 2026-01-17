"use client";
import { forwardRef } from 'react';
import LoadingIcon from './LoadingIcon';
import { ComponentType, SVGAttributes, ButtonHTMLAttributes } from 'react';

type ButtonVariant = 'default' | 'primary' | 'secondary' | 'ghost' | 'danger';
type ButtonSize = 'xs' | 'sm' | 'md' | 'lg';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  rounded?: 'lg' | 'full';
  loading?: boolean;
  icon?: ComponentType<SVGAttributes<SVGElement>>;
  iconPosition?: 'left' | 'right';
  iconOnly?: boolean;
  fullWidth?: boolean;
}

const variantStyles: Record<ButtonVariant, string> = {
  default: `border border-[#888]/30 text-[#FCFCFC]
    bg-[radial-gradient(70%_70%_at_center,rgba(8,10,12,0.98)_0%,rgba(160,165,180,0.25)_100%)]
    hover:border-[#aaa]/50 hover:bg-[radial-gradient(70%_70%_at_center,rgba(8,10,12,0.98)_0%,rgba(160,165,180,0.35)_100%)]`,
  primary: 'bg-blue-600 hover:bg-blue-700 text-white border border-transparent',
  secondary: 'bg-[#2A2A2A] hover:bg-[#3A3A3A] text-[#FCFCFC] border border-[#888]/30',
  ghost: 'bg-transparent hover:bg-[#FCFCFC]/10 text-[#FCFCFC] border border-transparent',
  danger: `border border-red-500/50 text-red-400
    bg-[radial-gradient(70%_70%_at_center,rgba(8,10,12,0.98)_0%,rgba(160,165,180,0.25)_100%)]
    hover:border-red-500/70 hover:bg-[radial-gradient(70%_70%_at_center,rgba(8,10,12,0.98)_0%,rgba(160,165,180,0.35)_100%)]`,
};

const sizeStyles: Record<ButtonSize, string> = {
  xs: 'px-2 py-1 text-xs',
  sm: 'px-3 py-1.5 text-xs',
  md: 'px-4 py-2 text-sm',
  lg: 'px-6 py-3 text-base',
};

const iconOnlySizeStyles: Record<ButtonSize, string> = {
  xs: 'w-6 h-6',
  sm: 'w-8 h-8',
  md: 'w-10 h-10',
  lg: 'w-12 h-12',
};

const iconSizeStyles: Record<ButtonSize, string> = {
  xs: 'w-3.5 h-3.5',
  sm: 'w-4 h-4',
  md: 'w-5 h-5',
  lg: 'w-6 h-6',
};

const Button = forwardRef<HTMLButtonElement, ButtonProps>(({
  variant = 'default',
  size = 'md',
  rounded = 'lg',
  loading = false,
  icon: Icon,
  iconPosition = 'left',
  iconOnly = false,
  fullWidth = false,
  disabled,
  className = '',
  children,
  ...props
}, ref) => {
  const isDisabled = disabled || loading;
  const roundedStyle = rounded === 'full' ? 'rounded-full' : 'rounded-lg';
  const iconClass = iconSizeStyles[size];

  return (
    <button
      ref={ref}
      disabled={isDisabled}
      className={`
        ${variantStyles[variant]}
        ${iconOnly ? iconOnlySizeStyles[size] : sizeStyles[size]}
        ${roundedStyle}
        ${fullWidth && !iconOnly ? 'w-full' : iconOnly ? '' : 'w-fit'}
        font-medium flex items-center justify-center gap-2
        transition-all duration-200 ease-in-out
        ${isDisabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
        ${className}
      `}
      {...props}
    >
      {loading ? (
        <LoadingIcon isSmall />
      ) : iconOnly && Icon ? (
        <Icon className={iconClass} />
      ) : (
        <>
          {Icon && iconPosition === 'left' && <Icon className={iconClass} />}
          {children}
          {Icon && iconPosition === 'right' && <Icon className={iconClass} />}
        </>
      )}
    </button>
  );
});

Button.displayName = 'Button';

export default Button;
