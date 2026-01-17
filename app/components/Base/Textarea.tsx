"use client";
import { forwardRef, TextareaHTMLAttributes } from 'react';

type TextareaSize = 'sm' | 'md' | 'lg';

interface TextareaProps extends Omit<TextareaHTMLAttributes<HTMLTextAreaElement>, 'onChange'> {
  size?: TextareaSize;
  onChange: (value: string) => void;
  value: string;
}

const sizeStyles: Record<TextareaSize, string> = {
  sm: 'px-3 py-2 text-xs',
  md: 'px-4 py-3 text-sm',
  lg: 'px-5 py-4 text-base',
};

const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(({
  size = 'md',
  className = '',
  disabled,
  onChange,
  value,
  ...props
}, ref) => {
  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    onChange(e.target.value);
  };

  return (
    <textarea
      ref={ref}
      value={value}
      onChange={handleChange}
      disabled={disabled}
      className={`
        w-full outline-none resize-none
        bg-black/30 border border-[#888]/50 rounded-2xl
        text-[#FCFCFC] placeholder:text-[#FCFCFC]/40
        focus:border-[#aaa]/50
        transition-all duration-200
        ${sizeStyles[size]}
        ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
        ${className}
      `}
      {...props}
    />
  );
});

Textarea.displayName = 'Textarea';

export default Textarea;
