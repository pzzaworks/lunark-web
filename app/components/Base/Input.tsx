"use client"
import { forwardRef, InputHTMLAttributes } from 'react';
import LoadingIcon from './LoadingIcon';
import { ComponentType, SVGAttributes } from 'react';

type InputVariant = 'default' | 'chat';
type InputSize = 'sm' | 'md' | 'lg';

interface InputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'onChange' | 'size' | 'onSubmit'> {
  variant?: InputVariant;
  size?: InputSize;
  onSubmit?: (value: string) => void;
  icon?: ComponentType<SVGAttributes<SVGElement>>;
  iconPosition?: 'left' | 'right';
  showSubmitButton?: boolean;
  submitIcon?: ComponentType<SVGAttributes<SVGElement>>;
  loading?: boolean;
  onChange: (value: string) => void;
  value: string;
}

const variantStyles: Record<InputVariant, string> = {
  default: `bg-black/30 border border-[#888]/50 rounded-full
    focus-within:border-[#aaa]/50`,
  chat: `border border-[#888]/30 rounded-full
    bg-[radial-gradient(70%_70%_at_center,rgba(8,10,12,0.98)_0%,rgba(160,165,180,0.25)_100%)]
    backdrop-blur-sm
    shadow-[0_0_10px_rgba(0,0,0,0.2),inset_0_0_20px_4px_rgba(0,0,0,0.3)]
    hover:border-[#aaa]/50
    hover:shadow-[0_0_15px_rgba(0,0,0,0.3),inset_0_0_25px_6px_rgba(0,0,0,0.3)]`,
};

const sizeStyles: Record<InputVariant, Record<InputSize, string>> = {
  default: {
    sm: 'px-2 py-1.5 text-xs',
    md: 'px-3 py-2 text-sm',
    lg: 'px-4 py-3 text-base',
  },
  chat: {
    sm: 'p-2 text-sm',
    md: 'p-3 md:p-4 text-base',
    lg: 'p-4 md:p-5 text-lg',
  },
};

const Input = forwardRef<HTMLInputElement, InputProps>(({
  variant = 'default',
  size = 'md',
  onSubmit,
  icon,
  iconPosition = 'left',
  showSubmitButton = false,
  submitIcon: SubmitIcon,
  className = "",
  loading = false,
  disabled,
  onChange,
  value,
  type = 'text',
  ...inputProps
}, ref) => {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (value && !disabled && onSubmit) {
      onSubmit(value);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange(e.target.value);
  };

  const Icon = icon;
  const isDisabled = disabled || loading;

  // For default variant, render simple input
  if (variant === 'default') {
    return (
      <input
        ref={ref}
        type={type}
        value={value}
        onChange={handleChange}
        disabled={isDisabled}
        className={`
          w-full outline-none
          ${variantStyles[variant]}
          ${sizeStyles[variant][size]}
          text-[#FCFCFC] placeholder:text-[#FCFCFC]/40
          transition-all duration-200
          ${isDisabled ? 'opacity-50 cursor-not-allowed' : ''}
          ${className}
        `}
        {...inputProps}
      />
    );
  }

  // For chat variant, render full form with optional submit button
  return (
    <form onSubmit={handleSubmit} className={`w-full mx-auto ${className}`}>
      <div className="relative">
        <div className={`
          flex items-center w-full
          ${variantStyles[variant]}
          ${sizeStyles[variant][size]}
          transition-all duration-400 ease-in-out
          ${isDisabled ? 'opacity-50 cursor-not-allowed' : ''}
          ${Icon && iconPosition === 'left' ? 'pl-8' : ''}
        `}>
          <input
            ref={ref}
            type={type}
            value={value}
            onChange={handleChange}
            disabled={isDisabled}
            className={`w-full outline-0 px-1 bg-transparent text-[#FCFCFC]/90 placeholder:text-[#FCFCFC]/60
              ${(showSubmitButton || (Icon && iconPosition === 'left')) ? 'pl-8' : ''}`}
            {...inputProps}
          />
        </div>

        {Icon && (
          <div className={`absolute top-1/2 -translate-y-1/2 ${iconPosition === 'left' ? 'left-4' : 'right-4'}`}>
            <Icon className="w-5 h-5 text-[#FCFCFC]/60" />
          </div>
        )}

        {showSubmitButton && (
          <div className="absolute right-3 top-1/2 -translate-y-1/2">
            <button
              type="submit"
              disabled={isDisabled}
              className={`p-2 rounded-full transition duration-200 border border-transparent
                ${isDisabled ? 'cursor-not-allowed' : 'hover:bg-[#FCFCFC]/10 hover:border-[#FCFCFC]/25'}`}
            >
              {loading ?
                <LoadingIcon /> :
                SubmitIcon && <SubmitIcon className={`w-5 h-5 ${isDisabled ? 'text-[#FCFCFC]/40' : 'text-[#FCFCFC]/90'}`} />
              }
            </button>
          </div>
        )}
      </div>
    </form>
  );
});

Input.displayName = 'Input';

export default Input;
